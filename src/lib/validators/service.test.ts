import { describe, expect, it } from "vitest";

import { serviceSchema } from "@/lib/validators/service";

describe("serviceSchema", () => {
  it("accepts a valid service", () => {
    const result = serviceSchema.safeParse({
      title: "Software interno",
      description: "Herramientas operativas pequenas para equipos que necesitan orden.",
      icon: "code-2",
      order_index: 1,
      active: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid icons", () => {
    const result = serviceSchema.safeParse({
      title: "Software interno",
      description: "Herramientas operativas pequenas para equipos que necesitan orden.",
      icon: "unknown",
      order_index: 1,
      active: true,
    });

    expect(result.success).toBe(false);
  });
});
