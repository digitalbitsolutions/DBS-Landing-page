import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH } from "@/lib/admin";

export default function LoginPage() {
  redirect(ADMIN_LOGIN_PATH);
}
