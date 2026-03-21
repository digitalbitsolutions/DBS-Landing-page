"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Languages, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch, type ControllerRenderProps, type FieldPath } from "react-hook-form";

import { saveSiteSettings, translateSiteSettingsGroup } from "@/app/dashboard/actions";
import ImageField from "@/components/dashboard/ImageField";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { marketingTranslationGroups } from "@/lib/data/marketing-copy";
import { groqTranslationModels } from "@/lib/groq";
import { type AppLocale, localeOptions } from "@/lib/i18n";
import { formatSeoKeywordsInput } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/supabase/database.types";
import { siteSettingsSchema, type SiteSettingsValues } from "@/lib/validators/settings";

interface SettingsFormProps {
  settings: SiteSettings;
  disabledReason?: string;
  translationDisabledReason?: string;
}

export default function SettingsForm({
  settings,
  disabledReason,
  translationDisabledReason,
}: SettingsFormProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isTranslating, startTranslation] = useTransition();
  const router = useRouter();
  const [committedImages, setCommittedImages] = useState({
    hero: settings.hero_image_url ?? "",
    og: settings.seo_og_image_url ?? "",
  });

  const [activeLocale, setActiveLocale] = useState<AppLocale>(settings.default_locale as AppLocale);
  const enabledLocales = settings.enabled_locales as AppLocale[];

  const form = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      site_name: settings.site_name,
      hero_badge: settings.hero_badge,
      hero_available_badge: settings.hero_available_badge,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_primary_cta: settings.hero_primary_cta,
      hero_secondary_cta: settings.hero_secondary_cta,
      hero_image_url: settings.hero_image_url ?? "",
      hero_panel_label: settings.hero_panel_label,
      hero_panel_title: settings.hero_panel_title,
      hero_stat_years_value: settings.hero_stat_years_value,
      hero_stat_years_label: settings.hero_stat_years_label,
      hero_stat_projects_value: settings.hero_stat_projects_value,
      hero_stat_projects_label: settings.hero_stat_projects_label,
      hero_stat_ops_value: settings.hero_stat_ops_value,
      hero_stat_ops_label: settings.hero_stat_ops_label,
      hero_delivery_label: settings.hero_delivery_label,
      default_locale: settings.default_locale as SiteSettingsValues["default_locale"],
      enabled_locales: settings.enabled_locales as SiteSettingsValues["enabled_locales"],
      groq_translation_model:
        settings.groq_translation_model as SiteSettingsValues["groq_translation_model"],
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      seo_keywords: formatSeoKeywordsInput(settings.seo_keywords),
      seo_og_image_url: settings.seo_og_image_url ?? "",
      seo_canonical_url: settings.seo_canonical_url ?? "",
      contact_email: settings.contact_email,
      contact_phone_es: settings.contact_phone_es ?? "",
      contact_phone_pe: settings.contact_phone_pe ?? "",
      location_barcelona: settings.location_barcelona ?? "",
      location_peru: settings.location_peru ?? "",
      footer_text: settings.footer_text,
      lead_notification_enabled: settings.lead_notification_enabled,
      autoresponder_enabled: settings.autoresponder_enabled,
      internal_notification_subject: settings.internal_notification_subject,
      autoresponder_subject: settings.autoresponder_subject,
      autoresponder_body: settings.autoresponder_body,
      resend_from_name: settings.resend_from_name,
      resend_from_email: settings.resend_from_email,
      header_nav_services: settings.header_nav_services,
      header_nav_cases: settings.header_nav_cases,
      header_nav_process: settings.header_nav_process,
      header_nav_contact: settings.header_nav_contact,
      header_access: settings.header_access,
      footer_directory_label: settings.footer_directory_label,
      footer_contact_label: settings.footer_contact_label,
      footer_tagline: settings.footer_tagline,
      ticker_label: settings.ticker_label,
      translations: settings.translations as Record<string, Record<string, string>>,
    },
  });

  const contactEmailValue = useWatch({ control: form.control, name: "contact_email" });

  function onSubmit(values: SiteSettingsValues) {
    setFeedback(null);

    startTransition(async () => {
      try {
        await saveSiteSettings(values);
        router.refresh();
        setCommittedImages({
          hero: values.hero_image_url,
          og: values.seo_og_image_url,
        });
        setFeedback("Ajustes guardados.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudieron guardar los cambios.");
      }
    });
  }

  function onTranslate(groupKey: keyof typeof marketingTranslationGroups) {
    setFeedback(null);

    startTranslation(async () => {
      try {
        const result = await translateSiteSettingsGroup(form.getValues(), groupKey);
        router.refresh();
        setFeedback(`${result.message} Idiomas: ${result.locales.join(", ").toUpperCase()}.`);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo traducir el bloque.");
      }
    });
  }

  const isBaseLocale = activeLocale === settings.default_locale;

  const TranslatableInput = ({
    fieldName,
    baseField,
    ...props
  }: {
    fieldName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseField: ControllerRenderProps<SiteSettingsValues, any>;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isBaseLocale) return <Input {...baseField} {...(props as any)} />;

    const translationKey = `translations.${activeLocale}.${fieldName}` as FieldPath<SiteSettingsValues>;
    return (
      <Input
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        value={(form.watch(translationKey) as string) || ""}
        onChange={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(translationKey, e.target.value as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    );
  };

  const TranslatableTextarea = ({
    fieldName,
    baseField,
    ...props
  }: {
    fieldName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseField: ControllerRenderProps<SiteSettingsValues, any>;
    [key: string]: unknown;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isBaseLocale) return <Textarea {...baseField} {...(props as any)} />;

    const translationKey = `translations.${activeLocale}.${fieldName}` as FieldPath<SiteSettingsValues>;
    return (
      <Textarea
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        value={(form.watch(translationKey) as string) || ""}
        onChange={(e) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setValue(translationKey, e.target.value as any, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }}
      />
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="relative space-y-6">
        <div className="sticky top-0 z-20 -mx-6 mb-6 border-b border-white/10 bg-[#0a1219]/95 px-6 py-4 backdrop-blur-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1 rounded-xl border border-white/5 bg-white/[0.03] p-1">
              {enabledLocales.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => setActiveLocale(locale)}
                  className={cn(
                    "px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-lg transition-all",
                    activeLocale === locale
                      ? "bg-[#8da4b3] text-[#0a1219] shadow-lg shadow-[#8da4b3]/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  {locale}
                  {locale === settings.default_locale && (
                    <span className="ml-1.5 opacity-60 text-[10px] lowercase">(base)</span>
                  )}
                </button>
              ))}
            </div>

            <Button
              type="submit"
              disabled={isPending || Boolean(disabledReason)}
              className="h-11 w-full bg-[#8da4b3] px-6 font-semibold text-[#0a1219] shadow-lg shadow-[#8da4b3]/20 hover:bg-[#8da4b3]/90 sm:w-auto rounded-xl"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Guardar Ajustes
            </Button>
          </div>
        </div>

        {feedback ? (
          <div
            className={cn(
              "rounded-2xl border px-4 py-3 text-sm font-medium",
              feedback.includes("guardados") || feedback.includes("Idiomas")
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/20 bg-red-500/10 text-red-400",
            )}
          >
            {feedback}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Nombre del sitio {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableInput fieldName="site_name" baseField={field} maxLength={80} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hero_badge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Kicker del hero {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableInput fieldName="hero_badge" baseField={field} maxLength={60} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-semibold text-white">Hero visual y credenciales</p>
            <p className="mt-1 text-sm text-zinc-400">
              Controla la foto principal, el badge de disponibilidad y los bloques de confianza
              que acompañan al titular.
            </p>
          </div>

          <FormField
            control={form.control}
            name="hero_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagen principal del hero</FormLabel>
                <FormControl>
                  <ImageField
                    label="Imagen principal del hero"
                    value={field.value}
                    initialValue={committedImages.hero}
                    target="site.hero"
                    previewAlt="Preview de la imagen principal del hero"
                    disabled={Boolean(disabledReason)}
                    disabledReason={disabledReason}
                    helperText="Se muestra en el bloque visual principal de la landing."
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>Si la eliminas, la landing volvera a la imagen fallback actual.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="hero_available_badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Badge de disponibilidad {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput
                      fieldName="hero_available_badge"
                      baseField={field}
                      maxLength={60}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hero_delivery_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Etiqueta final del hero {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput
                      fieldName="hero_delivery_label"
                      baseField={field}
                      maxLength={50}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="hero_panel_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Etiqueta del panel lateral {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="hero_panel_label" baseField={field} maxLength={60} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hero_panel_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título del panel lateral {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="hero_panel_title" baseField={field} maxLength={120} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="hero_stat_years_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor experiencia</FormLabel>
                    <FormControl>
                      <Input maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero_stat_years_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Etiqueta experiencia {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                    </FormLabel>
                    <FormControl>
                      <TranslatableInput
                        fieldName="hero_stat_years_label"
                        baseField={field}
                        maxLength={40}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="hero_stat_projects_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor proyectos</FormLabel>
                    <FormControl>
                      <Input maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero_stat_projects_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Etiqueta proyectos {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                    </FormLabel>
                    <FormControl>
                      <TranslatableInput
                        fieldName="hero_stat_projects_label"
                        baseField={field}
                        maxLength={40}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="hero_stat_ops_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor operativa</FormLabel>
                    <FormControl>
                      <Input maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hero_stat_ops_label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Etiqueta operativa {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                    </FormLabel>
                    <FormControl>
                      <TranslatableInput
                        fieldName="hero_stat_ops_label"
                        baseField={field}
                        maxLength={40}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-semibold text-white">Navegación y Footer</p>
            <p className="mt-1 text-sm text-zinc-400">
              Personaliza los enlaces del menú superior y los textos descriptivos del pie de página.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="header_nav_services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Menú: Servicios {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="header_nav_services" baseField={field} maxLength={40} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="header_nav_cases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Menú: Casos {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="header_nav_cases" baseField={field} maxLength={40} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="header_nav_process"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Menú: Proceso {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="header_nav_process" baseField={field} maxLength={40} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="header_nav_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Menú: Contacto {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="header_nav_contact" baseField={field} maxLength={40} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="header_access"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Botón de acceso {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="header_access" baseField={field} maxLength={40} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticker_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Texto del Ticker (CTA) {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput fieldName="ticker_label" baseField={field} maxLength={120} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="footer_directory_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Columna Directorio {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput
                      fieldName="footer_directory_label"
                      baseField={field}
                      maxLength={40}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="footer_contact_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Columna Contacto {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                  </FormLabel>
                  <FormControl>
                    <TranslatableInput
                      fieldName="footer_contact_label"
                      baseField={field}
                      maxLength={40}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="footer_tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Eslogan del footer {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableInput fieldName="footer_tagline" baseField={field} maxLength={180} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-semibold text-white">Idiomas de la landing</p>
            <p className="mt-1 text-sm text-zinc-400">
              Define el idioma principal, activa los idiomas disponibles y lanza traducciones
              asistidas sin rehacer rutas ni contenido base.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
            <FormField
              control={form.control}
              name="default_locale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idioma principal</FormLabel>
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(event) => field.onChange(event.target.value)}
                      className="flex h-10 w-full rounded-md border border-white/10 bg-[#0a1219] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#8da4b3]/50"
                    >
                      {localeOptions.map((locale) => (
                        <option key={locale.code} value={locale.code}>
                          {locale.nativeLabel}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled_locales"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idiomas activos</FormLabel>
                  <FormControl>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {localeOptions.map((locale) => {
                        const checked = field.value.includes(locale.code);

                        return (
                          <label
                            key={locale.code}
                            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-zinc-300"
                          >
                            <input
                              type="checkbox"
                              aria-label={locale.nativeLabel}
                              checked={checked}
                              onChange={(event) => {
                                const nextValue = event.target.checked
                                  ? [...field.value, locale.code]
                                  : field.value.filter((item) => item !== locale.code);

                                field.onChange(nextValue);
                              }}
                              className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#8da4b3]"
                            />
                            <span>
                              <span className="block font-medium text-white">
                                {locale.nativeLabel}
                              </span>
                              <span className="block text-xs uppercase tracking-[0.2em] text-zinc-500">
                                {locale.label}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="groq_translation_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo de Groq para traducción</FormLabel>
                <FormControl>
                  <select
                    value={field.value}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-white/10 bg-[#0a1219] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#8da4b3]/50"
                  >
                    {groqTranslationModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3 rounded-2xl border border-white/8 bg-[#0a1219]/70 p-4">
            <p className="text-sm font-medium text-white">Traducción asistida por LLM</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(marketingTranslationGroups).map(([groupKey, group]) => (
                <Button
                  key={groupKey}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isTranslating || Boolean(disabledReason || translationDisabledReason)}
                  title={translationDisabledReason ?? disabledReason}
                  onClick={() => onTranslate(groupKey as keyof typeof marketingTranslationGroups)}
                >
                  {isTranslating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Languages className="h-4 w-4" />
                  )}
                  Traducir {group.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-zinc-500">
              Cada botón traduce el bloque a todos los idiomas activos salvo el idioma principal.
            </p>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-semibold text-white">Automatización de email</p>
            <p className="mt-1 text-sm text-zinc-400">
              El buzón interno de avisos usa el email de contacto actual. La autorespuesta se
              envía automáticamente al lead y puede traducirse desde este panel.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="lead_notification_enabled"
              render={({ field }) => (
                <FormItem className="rounded-2xl border border-white/8 bg-[#0a1219]/70 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      id="lead_notification_enabled"
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#8da4b3]"
                    />
                    <div>
                      <FormLabel htmlFor="lead_notification_enabled">
                        Aviso interno inmediato
                      </FormLabel>
                      <p className="mt-1 text-sm text-zinc-500">
                        Envía una notificación a{" "}
                        <span className="text-zinc-300">{contactEmailValue}</span> cada vez que
                        entra un lead nuevo.
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="autoresponder_enabled"
              render={({ field }) => (
                <FormItem className="rounded-2xl border border-white/8 bg-[#0a1219]/70 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      id="autoresponder_enabled"
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[#8da4b3]"
                    />
                    <div>
                      <FormLabel htmlFor="autoresponder_enabled">
                        Autorespuesta automática
                      </FormLabel>
                      <p className="mt-1 text-sm text-zinc-500">
                        Confirma la recepción del lead y promete respuesta en un plazo máximo de 24
                        horas.
                      </p>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="resend_from_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre remitente</FormLabel>
                  <FormControl>
                    <Input maxLength={80} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resend_from_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email remitente</FormLabel>
                  <FormControl>
                    <Input type="email" maxLength={120} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="internal_notification_subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asunto de aviso interno</FormLabel>
                <FormControl>
                  <Input maxLength={140} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoresponder_subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Asunto de la autorespuesta {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableInput
                    fieldName="autoresponder_subject"
                    baseField={field}
                    maxLength={140}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="autoresponder_body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Cuerpo de la autorespuesta {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableTextarea
                    fieldName="autoresponder_body"
                    baseField={field}
                    rows={8}
                    maxLength={2000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-3xl border border-white/8 bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-semibold text-white">SEO y compartidos</p>
            <p className="mt-1 text-sm text-zinc-400">
              Controla title, description, keywords, canonical y la imagen de Open Graph.
            </p>
          </div>

          <FormField
            control={form.control}
            name="seo_title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  SEO title {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableInput fieldName="seo_title" baseField={field} maxLength={70} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seo_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Meta description {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
                </FormLabel>
                <FormControl>
                  <TranslatableTextarea
                    fieldName="seo_description"
                    baseField={field}
                    rows={4}
                    maxLength={180}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seo_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO keywords</FormLabel>
                <FormControl>
                  <Input
                    maxLength={240}
                    placeholder="software a medida, automatización, IA aplicada"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              control={form.control}
              name="seo_canonical_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Canonical URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      maxLength={200}
                      placeholder="https://digitalbitsolutions.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seo_og_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen de Open Graph</FormLabel>
                  <FormControl>
                    <ImageField
                      label="Imagen de Open Graph"
                      value={field.value}
                      initialValue={committedImages.og}
                      target="site.og"
                      previewAlt="Preview de la imagen Open Graph"
                      disabled={Boolean(disabledReason)}
                      disabledReason={disabledReason}
                      helperText="Se usa al compartir la home en redes y mensajeria."
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Si la eliminas, se reutilizara el comportamiento fallback del sitio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email de contacto</FormLabel>
              <FormControl>
                <Input type="email" maxLength={120} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hero_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Título del hero {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
              </FormLabel>
              <FormControl>
                <TranslatableTextarea fieldName="hero_title" baseField={field} rows={3} maxLength={140} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hero_subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Subtítulo del hero {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
              </FormLabel>
              <FormControl>
                <TranslatableTextarea fieldName="hero_subtitle" baseField={field} rows={5} maxLength={320} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="hero_primary_cta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA principal</FormLabel>
                <FormControl>
                  <Input maxLength={40} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hero_secondary_cta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CTA secundaria</FormLabel>
                <FormControl>
                  <Input maxLength={40} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_phone_es"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono España</FormLabel>
                <FormControl>
                  <Input maxLength={120} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_phone_pe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Perú</FormLabel>
                <FormControl>
                  <Input maxLength={120} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location_barcelona"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación Barcelona</FormLabel>
                <FormControl>
                  <Input maxLength={120} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_peru"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación Perú</FormLabel>
                <FormControl>
                  <Input maxLength={120} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="footer_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Texto del footer {!isBaseLocale && `(${activeLocale.toUpperCase()})`}
              </FormLabel>
              <FormControl>
                <TranslatableTextarea fieldName="footer_text" baseField={field} rows={4} maxLength={240} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center">
          {feedback || disabledReason ? (
            <p className="text-sm text-zinc-400">{feedback ?? disabledReason}</p>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
