function normalizePath(path: string | undefined, fallback: string) {
  if (!path) {
    return fallback;
  }

  const trimmed = path.trim();
  if (!trimmed) {
    return fallback;
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.replace(/\/+$/, "") || fallback;
}

export const INTERNAL_ADMIN_LOGIN_PATH = "/internal-login";
export const ADMIN_LOGIN_PATH = normalizePath(
  process.env.NEXT_PUBLIC_ADMIN_LOGIN_PATH,
  "/nucleo-7k9x-portal",
);
