import { NextResponse } from "next/server";

import { defaultLocale, isAppLocale } from "@/lib/i18n";
import { hasSupabasePublicEnv } from "@/lib/env";
import { createLeadRecord } from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validators/contact";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud invalida." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos invalidos." },
      { status: 400 },
    );
  }

  if (!hasSupabasePublicEnv()) {
    return NextResponse.json(
      { error: "Supabase no esta configurado todavia." },
      { status: 503 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    let locale = parsed.data.locale;

    if (!locale) {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("default_locale")
        .eq("id", 1)
        .maybeSingle();

      locale = isAppLocale(settings?.default_locale) ? settings.default_locale : defaultLocale;
    }

    await createLeadRecord(supabase, { ...parsed.data, locale });

    return NextResponse.json({
      success: true,
      message: "Lead guardado correctamente.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "No se pudo guardar el lead en Supabase.",
      },
      { status: 500 },
    );
  }
}
