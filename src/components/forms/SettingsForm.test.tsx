import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SettingsForm from "@/components/forms/SettingsForm";
import { defaultSiteSettings } from "@/lib/data/default-content";

vi.mock("@/app/dashboard/actions", () => ({
  saveSiteSettings: vi.fn().mockResolvedValue(undefined),
  translateSiteSettingsGroup: vi.fn().mockResolvedValue({ locales: ["en"], message: "ok" }),
}));

describe("SettingsForm", () => {
  it("renders hero visual, SEO, translation and email automation fields with settings values", () => {
    render(<SettingsForm settings={defaultSiteSettings} />);

    expect(screen.getByLabelText("URL de la foto del hero")).toHaveValue(
      defaultSiteSettings.hero_image_url,
    );
    expect(screen.getByLabelText("Badge de disponibilidad")).toHaveValue(
      defaultSiteSettings.hero_available_badge,
    );
    expect(screen.getByLabelText("Título del panel lateral")).toHaveValue(
      defaultSiteSettings.hero_panel_title,
    );
    expect(screen.getByLabelText("Valor experiencia")).toHaveValue(
      defaultSiteSettings.hero_stat_years_value,
    );
    expect(screen.getByLabelText("SEO title")).toHaveValue(defaultSiteSettings.seo_title);
    expect(screen.getByLabelText("Meta description")).toHaveValue(
      defaultSiteSettings.seo_description,
    );
    expect(screen.getByLabelText("SEO keywords")).toHaveValue(
      defaultSiteSettings.seo_keywords.join(", "),
    );
    expect(screen.getByLabelText("Modelo de Groq para traducción")).toHaveValue(
      defaultSiteSettings.groq_translation_model,
    );
    expect(screen.getByLabelText("Nombre remitente")).toHaveValue(
      defaultSiteSettings.resend_from_name,
    );
    expect(screen.getByLabelText("Email remitente")).toHaveValue(
      defaultSiteSettings.resend_from_email,
    );
    expect(screen.getByLabelText("Idioma principal")).toHaveValue(
      defaultSiteSettings.default_locale,
    );
    expect(screen.getByLabelText("Español")).toBeChecked();
    expect(screen.getByLabelText("Quechua")).toBeChecked();
    expect(screen.getByLabelText("Canonical URL")).toHaveValue(
      defaultSiteSettings.seo_canonical_url,
    );
    expect(screen.getByLabelText("Aviso interno inmediato")).toBeChecked();
    expect(screen.getByLabelText("Autorespuesta automática")).toBeChecked();
    expect(screen.getByRole("button", { name: /Traducir Hero/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Traducir Automatización de email/i }),
    ).toBeInTheDocument();
  });
});
