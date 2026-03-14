import { describe, expect, it } from "vitest";

import { projectSchema } from "@/lib/validators/project";

describe("projectSchema", () => {
  it("accepts valid data with optional urls empty", () => {
    const result = projectSchema.safeParse({
      title: "Ops Console",
      slug: "ops-console",
      short_description: "Panel interno para gestionar operaciones y reporting ejecutivo.",
      image_url: "",
      stack: "",
      repo_url: "",
      live_url: "",
      featured: true,
      order_index: 1,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid slugs", () => {
    const result = projectSchema.safeParse({
      title: "Ops Console",
      slug: "Ops Console",
      short_description: "Panel interno para gestionar operaciones y reporting ejecutivo.",
      image_url: "",
      stack: "Next.js",
      repo_url: "",
      live_url: "",
      featured: true,
      order_index: 1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid urls", () => {
    const result = projectSchema.safeParse({
      title: "Ops Console",
      slug: "ops-console",
      short_description: "Panel interno para gestionar operaciones y reporting ejecutivo.",
      image_url: "",
      stack: "Next.js",
      repo_url: "github.com/example",
      live_url: "",
      featured: true,
      order_index: 1,
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid cover image url", () => {
    const result = projectSchema.safeParse({
      title: "Ops Console",
      slug: "ops-console",
      short_description: "Panel interno para gestionar operaciones y reporting ejecutivo.",
      image_url: "https://images.unsplash.com/photo-1?fit=crop&w=1200&q=80",
      stack: "Next.js",
      repo_url: "",
      live_url: "",
      featured: true,
      order_index: 1,
    });

    expect(result.success).toBe(true);
  });
});
