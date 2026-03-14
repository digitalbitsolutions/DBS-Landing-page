import { describe, expect, it } from "vitest";

import { defaultSiteSettings } from "@/lib/data/default-content";
import {
  buildAutoresponderHtml,
  buildInternalNotificationHtml,
  resolveAutoresponderCopy,
  resolveLeadLocale,
  shouldAllowLeadEmailRetry,
} from "@/lib/email-automation";

describe("email automation helpers", () => {
  it("resolves the lead locale with fallback to site default", () => {
    expect(resolveLeadLocale({ locale: "ca" }, defaultSiteSettings)).toBe("ca");
    expect(resolveLeadLocale({ locale: "fr" as never }, defaultSiteSettings)).toBe("es");
  });

  it("resolves localized autoresponder copy from settings translations", () => {
    const settings = {
      ...defaultSiteSettings,
      translations: {
        en: {
          autoresponder_subject: "We got your message",
          autoresponder_body: "Thanks for reaching out. We will reply within 24 hours.",
        },
      },
    };

    const copy = resolveAutoresponderCopy(settings, "en");

    expect(copy.subject).toBe("We got your message");
    expect(copy.body).toContain("24 hours");
  });

  it("allows retry when some email delivery is missing or failed", () => {
    expect(
      shouldAllowLeadEmailRetry({
        notification_sent_at: null,
        autoresponder_sent_at: null,
        email_last_error: null,
      }),
    ).toBe(true);

    expect(
      shouldAllowLeadEmailRetry({
        notification_sent_at: "2026-03-14T10:00:00.000Z",
        autoresponder_sent_at: "2026-03-14T10:00:00.000Z",
        email_last_error: null,
      }),
    ).toBe(false);
  });

  it("builds email HTML safely", () => {
    const internalHtml = buildInternalNotificationHtml({
      name: "Elia <script>",
      email: "elia@example.com",
      company: null,
      locale: "es",
      message: "Necesitamos una landing premium.",
      created_at: "2026-03-14T10:00:00.000Z",
    });
    const autoresponderHtml = buildAutoresponderHtml({
      body: "Gracias por escribir.\nTe respondere en 24h.",
    });

    expect(internalHtml).toContain("&lt;script&gt;");
    expect(autoresponderHtml).toContain("<br />");
  });
});
