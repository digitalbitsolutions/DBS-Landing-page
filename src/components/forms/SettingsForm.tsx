"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Languages, Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { saveSiteSettings, translateSiteSettingsGroup } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { marketingTranslationGroups } from "@/lib/data/marketing-copy";
import { groqTranslationModels } from "@/lib/groq";
import { localeOptions } from "@/lib/i18n";
import { formatSeoKeywordsInput } from "@/lib/seo";
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
    },
  });

  const contactEmailValue = useWatch({ control: form.control, name: "contact_email" });

  function onSubmit(values: SiteSettingsValues) {
    setFeedback(null);

    startTransition(async () => {
      try {
        await saveSiteSettings(values);
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
        setFeedback(`${result.message} Idiomas: ${result.locales.join(", ").toUpperCase()}.`);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "No se pudo traducir el bloque.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del sitio</FormLabel>
                <FormControl>
                  <Input maxLength={80} {...field} />
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
                <FormLabel>Kicker del hero</FormLabel>
                <FormControl>
                  <Input maxLength={60} {...field} />
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
                <FormLabel>URL de la foto del hero</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    maxLength={200}
                    placeholder="https://... o /founder_photo.png"
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
              name="hero_available_badge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge de disponibilidad</FormLabel>
                  <FormControl>
                    <Input maxLength={60} {...field} />
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
                  <FormLabel>Etiqueta final del hero</FormLabel>
                  <FormControl>
                    <Input maxLength={50} {...field} />
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
                  <FormLabel>Etiqueta del panel lateral</FormLabel>
                  <FormControl>
                    <Input maxLength={60} {...field} />
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
                  <FormLabel>Título del panel lateral</FormLabel>
                  <FormControl>
                    <Input maxLength={120} {...field} />
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
                    <FormLabel>Etiqueta experiencia</FormLabel>
                    <FormControl>
                      <Input maxLength={40} {...field} />
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
                    <FormLabel>Etiqueta proyectos</FormLabel>
                    <FormControl>
                      <Input maxLength={40} {...field} />
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
                    <FormLabel>Etiqueta operativa</FormLabel>
                    <FormControl>
                      <Input maxLength={40} {...field} />
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
                  <FormLabel>Menú: Servicios</FormLabel>
                  <FormControl>
                    <Input maxLength={40} {...field} />
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
                  <FormLabel>Menú: Casos</FormLabel>
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
              name="header_nav_process"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menú: Proceso</FormLabel>
                  <FormControl>
                    <Input maxLength={40} {...field} />
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
                  <FormLabel>Menú: Contacto</FormLabel>
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
              name="header_access"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Botón de acceso</FormLabel>
                  <FormControl>
                    <Input maxLength={40} {...field} />
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
                  <FormLabel>Texto del Ticker (CTA)</FormLabel>
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
              name="footer_directory_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Columna Directorio</FormLabel>
                  <FormControl>
                    <Input maxLength={40} {...field} />
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
                  <FormLabel>Columna Contacto</FormLabel>
                  <FormControl>
                    <Input maxLength={40} {...field} />
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
                <FormLabel>Eslogan del footer</FormLabel>
                <FormControl>
                  <Input maxLength={180} {...field} />
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
                <FormLabel>Asunto de la autorespuesta</FormLabel>
                <FormControl>
                  <Input maxLength={140} {...field} />
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
                <FormLabel>Cuerpo de la autorespuesta</FormLabel>
                <FormControl>
                  <Textarea rows={8} maxLength={2000} {...field} />
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
                <FormLabel>SEO title</FormLabel>
                <FormControl>
                  <Input maxLength={70} {...field} />
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
                <FormLabel>Meta description</FormLabel>
                <FormControl>
                  <Textarea rows={4} maxLength={180} {...field} />
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
                  <FormLabel>OG image URL</FormLabel>
                  <FormControl>
                    <Input type="url" maxLength={200} placeholder="https://..." {...field} />
                  </FormControl>
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
              <FormLabel>Título del hero</FormLabel>
              <FormControl>
                <Textarea rows={3} maxLength={140} {...field} />
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
              <FormLabel>Subtítulo del hero</FormLabel>
              <FormControl>
                <Textarea rows={5} maxLength={320} {...field} />
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
              <FormLabel>Texto del footer</FormLabel>
              <FormControl>
                <Textarea rows={4} maxLength={240} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button type="submit" disabled={isPending || Boolean(disabledReason)} title={disabledReason}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar ajustes
          </Button>
          {feedback || disabledReason ? (
            <p className="text-sm text-zinc-400">{feedback ?? disabledReason}</p>
          ) : null}
        </div>
      </form>
    </Form>
  );
}
