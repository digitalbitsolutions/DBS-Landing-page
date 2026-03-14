import { describe, expect, it } from "vitest";

import { leadSchema } from "@/lib/validators/lead";

describe("leadSchema", () => {
  it("accepts valid lead data", () => {
    const result = leadSchema.safeParse({
      name: "Elia",
      email: "elia@example.com",
      company: "",
      locale: "ca",
      message: "Necesitamos una landing con dashboard y automatizaciones basicas.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = leadSchema.safeParse({
      name: "Elia",
      email: "elia-at-example.com",
      company: "",
      locale: "es",
      message: "Necesitamos una landing con dashboard y automatizaciones basicas.",
    });

    expect(result.success).toBe(false);
  });

  it("rejects messages that are too long", () => {
    const result = leadSchema.safeParse({
      name: "Elia",
      email: "elia@example.com",
      company: "",
      locale: "qu",
      message: "a".repeat(2001),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid locales", () => {
    const result = leadSchema.safeParse({
      name: "Elia",
      email: "elia@example.com",
      company: "",
      locale: "fr",
      message: "Necesitamos una landing con dashboard y automatizaciones basicas.",
    });

    expect(result.success).toBe(false);
  });
});
