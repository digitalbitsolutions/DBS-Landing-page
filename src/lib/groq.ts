import type { AppLocale } from "@/lib/i18n";
import { defaultGroqTranslationModel } from "@/lib/data/marketing-copy";

export const groqTranslationModels = [
  "qwen/qwen3-32b",
  "canopylabs/orpheus-arabic-saudi",
  "canopylabs/orpheus-v1-english",
  "groq/compound",
  "groq/compound-mini",
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "meta-llama/llama-prompt-guard-2-22m",
  "meta-llama/llama-prompt-guard-2-86m",
  "moonshotai/kimi-k2-instruct",
  "moonshotai/kimi-k2-instruct-0905",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-safeguard-20b",
] as const;

export type GroqTranslationModel = (typeof groqTranslationModels)[number];

interface TranslateWithGroqOptions {
  apiKey: string;
  model?: GroqTranslationModel | string | null;
  sourceLocale: AppLocale;
  targetLocales: AppLocale[];
  fields: Record<string, string>;
  context: string;
}

interface GroqCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

function extractJsonObject(value: string) {
  const firstBrace = value.indexOf("{");
  const lastBrace = value.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Groq no devolvio un JSON valido.");
  }

  return value.slice(firstBrace, lastBrace + 1);
}

export function parseGroqTranslationPayload(payload: string, expectedLocales: AppLocale[]) {
  const parsed = JSON.parse(extractJsonObject(payload)) as {
    translations?: Record<string, Record<string, string>>;
  };

  if (!parsed.translations || typeof parsed.translations !== "object") {
    throw new Error("La respuesta de Groq no incluye el bloque translations.");
  }

  return expectedLocales.reduce<Record<AppLocale, Record<string, string>>>((accumulator, locale) => {
    const localePayload = parsed.translations?.[locale];

    if (!localePayload || typeof localePayload !== "object") {
      throw new Error(`Falta la traduccion para ${locale}.`);
    }

    accumulator[locale] = Object.entries(localePayload).reduce<Record<string, string>>(
      (fieldAccumulator, [key, value]) => {
        if (typeof value === "string" && value.trim()) {
          fieldAccumulator[key] = value.trim();
        }

        return fieldAccumulator;
      },
      {},
    );

    return accumulator;
  }, {} as Record<AppLocale, Record<string, string>>);
}

export function resolveGroqTranslationModel(model?: GroqTranslationModel | string | null) {
  if (model && groqTranslationModels.includes(model as GroqTranslationModel)) {
    return model as GroqTranslationModel;
  }

  return defaultGroqTranslationModel;
}

export async function translateFieldsWithGroq({
  apiKey,
  model,
  sourceLocale,
  targetLocales,
  fields,
  context,
}: TranslateWithGroqOptions) {
  if (!targetLocales.length) {
    return {};
  }

  const resolvedModel = resolveGroqTranslationModel(model);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: resolvedModel,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a senior localization engine for a premium B2B technology website. Return only valid JSON. Keep tone professional, concise and commercially clear. Do not translate product names, stack names or URLs unless naturally localized.",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              task: "translate_fields",
              context,
              sourceLocale,
              targetLocales,
              instructions: [
                "Translate every field preserving the same keys.",
                "Keep line breaks when present.",
                "Do not add explanations, markdown or comments.",
                "Return JSON with shape {\"translations\":{\"en\":{\"field\":\"...\"}}}.",
              ],
              fields,
            },
            null,
            2,
          ),
        },
      ],
    }),
  });

  const data = (await response.json()) as GroqCompletionResponse;

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Groq no pudo completar la traduccion.");
  }

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq no devolvio contenido para la traduccion.");
  }

  return parseGroqTranslationPayload(content, targetLocales);
}
