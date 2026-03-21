import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import ImageField from "@/components/dashboard/ImageField";

describe("ImageField", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uploads a valid image and propagates the new public url", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          publicUrl:
            "https://demo.supabase.co/storage/v1/object/public/dashboard-images/site-settings/hero/1-hero.webp",
        }),
      } as Response);

    render(
      <ImageField
        label="Imagen principal del hero"
        value=""
        initialValue=""
        target="site.hero"
        previewAlt="Hero"
        onChange={onChange}
      />,
    );

    await user.upload(
      screen.getByLabelText("Imagen principal del hero archivo"),
      new File(["img"], "hero.webp", { type: "image/webp" }),
    );

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        "https://demo.supabase.co/storage/v1/object/public/dashboard-images/site-settings/hero/1-hero.webp",
      );
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/Imagen subida\./i)).toBeInTheDocument();
  });

  it("blocks unsupported files before calling the upload endpoint", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onChange = vi.fn();
    const fetchMock = vi.spyOn(globalThis, "fetch");

    render(
      <ImageField
        label="Imagen principal del hero"
        value=""
        initialValue=""
        target="site.hero"
        previewAlt="Hero"
        onChange={onChange}
      />,
    );

    await user.upload(
      screen.getByLabelText("Imagen principal del hero archivo"),
      new File(["svg"], "hero.svg", { type: "image/svg+xml" }),
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/Formato no compatible/i)).toBeInTheDocument();
    });
  });
});
