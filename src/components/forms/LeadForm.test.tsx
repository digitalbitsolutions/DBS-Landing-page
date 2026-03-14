import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import LeadForm from "@/components/forms/LeadForm";
import { defaultMarketingCopy } from "@/lib/data/marketing-copy";

describe("LeadForm", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables submit while the request is pending", async () => {
    let resolveRequest: ((value: Response) => void) | undefined;
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }) as Promise<Response>,
    );
    const user = userEvent.setup();

    render(<LeadForm copy={defaultMarketingCopy} locale="en" />);

    await user.type(screen.getByLabelText("Nombre"), "Elia");
    await user.type(screen.getByLabelText("Email"), "elia@example.com");
    await user.type(
      screen.getByLabelText("Mensaje"),
      "Necesitamos una landing moderna con CMS y automatizaciones basicas.",
    );

    await user.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();
    });

    resolveRequest?.(
      new Response(JSON.stringify({ success: true, message: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"locale":"en"'),
      }),
    );
  });
});
