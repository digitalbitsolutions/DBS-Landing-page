import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LeadsTable from "@/components/dashboard/LeadsTable";
import type { Lead } from "@/lib/supabase/database.types";

vi.mock("@/components/forms/LeadStatusMenu", () => ({
  default: () => <div>status-menu</div>,
}));

describe("LeadsTable", () => {
  it("shows an empty state when there are no leads", () => {
    render(<LeadsTable leads={[]} />);

    expect(screen.getByText("Todavia no hay leads")).toBeInTheDocument();
    expect(
      screen.getByText(/cuando alguien complete el formulario publico/i),
    ).toBeInTheDocument();
  });

  it("shows email delivery state and retry action when a lead has pending emails", () => {
    const lead: Lead = {
      id: "lead-1",
      name: "Elia",
      email: "elia@example.com",
      company: null,
      locale: "en",
      message: "Necesitamos una landing con CMS y email automation.",
      source: "landing",
      status: "new",
      notification_sent_at: null,
      autoresponder_sent_at: null,
      followup_reminder_sent_at: null,
      email_last_error: "Autorespuesta pendiente",
      metadata: {},
      created_at: "2026-03-14T10:00:00.000Z",
    };

    render(<LeadsTable leads={[lead]} />);

    expect(screen.getByText("Aviso pendiente")).toBeInTheDocument();
    expect(screen.getAllByText("Autorespuesta pendiente")).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Reenviar email/i })).toBeInTheDocument();
  });
});
