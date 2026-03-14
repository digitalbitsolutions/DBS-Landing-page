"use client";

import { BarChart3, BriefcaseBusiness, FolderKanban, Inbox, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings2 },
  { href: "/dashboard/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/leads", label: "Leads", icon: Inbox },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-zinc-950/80 p-4 lg:w-72">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-300">DBS CMS</p>
          <p className="mt-2 text-sm text-zinc-400">Una sola web. Un panel limpio.</p>
        </div>
        <Badge variant="muted">internal</Badge>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/6 hover:text-white",
                isActive && "bg-cyan-400/10 text-white",
              )}
            >
              <Icon className={cn("h-4 w-4 text-cyan-200", isActive && "text-cyan-100")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
