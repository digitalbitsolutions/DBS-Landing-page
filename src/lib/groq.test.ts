import { describe, expect, it } from "vitest";

import { parseGroqTranslationPayload, resolveGroqTranslationModel } from "@/lib/groq";

describe("parseGroqTranslationPayload", () => {
  it("extracts translations from a JSON payload", () => {
    const parsed = parseGroqTranslationPayload(
      JSON.stringify({
        translations: {
          en: { hero_title: "Custom software" },
          ca: { hero_title: "Programari a mida" },
        },
      }),
      ["en", "ca"],
    );

    expect(parsed.en.hero_title).toBe("Custom software");
    expect(parsed.ca.hero_title).toBe("Programari a mida");
  });

  it("parses JSON even if wrapped in prose", () => {
    const parsed = parseGroqTranslationPayload(
      `Here is the JSON:\n${JSON.stringify({
        translations: {
          en: { title: "Services" },
        },
      })}`,
      ["en"],
    );

    expect(parsed.en.title).toBe("Services");
  });

  it("falls back to the default model when Groq model is missing", () => {
    expect(resolveGroqTranslationModel(undefined)).toBe("openai/gpt-oss-120b");
    expect(resolveGroqTranslationModel("")).toBe("openai/gpt-oss-120b");
  });

  it("keeps a supported model when one is configured", () => {
    expect(resolveGroqTranslationModel("llama-3.3-70b-versatile")).toBe(
      "llama-3.3-70b-versatile",
    );
  });
});
