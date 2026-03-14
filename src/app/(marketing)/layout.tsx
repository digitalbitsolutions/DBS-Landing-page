import type { ReactNode } from "react";

export default async function MarketingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
