import { createClient } from "@supabase/supabase-js";

import { getServerSupabaseEnv, hasSupabaseServiceRole } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseAdminClient() {
  if (!hasSupabaseServiceRole()) {
    return null;
  }

  const { url, serviceRoleKey } = getServerSupabaseEnv();
  if (!serviceRoleKey) {
    return null;
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
