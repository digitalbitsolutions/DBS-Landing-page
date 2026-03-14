import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProjectCard from "@/components/cards/ProjectCard";
import { defaultMarketingCopy } from "@/lib/data/marketing-copy";

describe("ProjectCard", () => {
  it("renders optional link fallback when repo and live urls are missing", () => {
    render(
      <ProjectCard
        copy={defaultMarketingCopy}
        project={{
          id: "project-1",
          title: "Ops Console",
          slug: "ops-console",
          short_description: "Panel interno para operaciones y reporting ejecutivo.",
          stack: [],
          image_url: null,
          gallery: [],
          tags: [],
          repo_url: null,
          live_url: null,
          featured: true,
          order_index: 1,
          created_at: "2026-03-13T10:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("SYS_STACK_NULL")).toBeInTheDocument();
    expect(screen.getAllByText(/Interno/i).length).toBeGreaterThan(0);
  });

  it("renders project cover image when image_url exists", () => {
    render(
      <ProjectCard
        copy={defaultMarketingCopy}
        project={{
          id: "project-2",
          title: "Sales Funnel Studio",
          slug: "sales-funnel-studio",
          short_description: "Landing y CRM ligero para captacion comercial B2B.",
          stack: ["Next.js"],
          image_url: "https://images.unsplash.com/photo-1?fit=crop&w=1200&q=80",
          gallery: [],
          tags: [],
          repo_url: null,
          live_url: "https://example.com",
          featured: true,
          order_index: 2,
          created_at: "2026-03-13T10:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByAltText(/Vista previa de Sales Funnel Studio/i)).toBeInTheDocument();
  });
});
