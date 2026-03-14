import Image from "next/image";
import { ExternalLink, Github, TerminalSquare } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { Project } from "@/lib/supabase/database.types";

interface ProjectCardProps {
  copy: MarketingCopy;
  project: Project;
}

export default function ProjectCard({ copy, project }: ProjectCardProps) {
  return (
    <Card className="group glass-panel flex h-full flex-col overflow-hidden transition-all duration-500 hover:border-[#8da4b3]/30">
      <div className="relative h-[200px] w-full overflow-hidden border-b border-white/5 bg-[#0a1219]">
        {project.image_url ? (
          <>
            <Image
              src={project.image_url}
              alt={`Vista previa de ${project.title}`}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1219] via-[#0a1219]/35 to-transparent" />
            <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <TerminalSquare className="h-3.5 w-3.5 text-[#d5dfe5]" />
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d5dfe5]">
                  {project.slug}
                </p>
              </div>
              <p className="mt-2 text-xs text-zinc-300">
                {copy.project_cover_note}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(141,164,179,0.07)_0%,transparent_100%)]" />
            <div className="absolute bottom-0 left-6 right-6 top-8 rounded-t-xl border border-white/10 border-b-0 bg-[#111b24] shadow-xl transition-transform duration-700 group-hover:-translate-y-2">
              <div className="flex h-8 items-center gap-2 border-b border-white/5 bg-black/40 px-4">
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="h-2 w-2 rounded-full bg-zinc-800" />
                <div className="ml-2 h-2 text-[8px] font-mono uppercase tracking-widest text-zinc-600">
                  {project.slug}
                </div>
              </div>
              <div className="flex flex-col gap-3 p-4 opacity-60">
                <div className="h-2 w-3/4 rounded bg-white/5" />
                <div className="h-2 w-1/2 rounded bg-white/5" />
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="h-12 rounded border border-white/5 bg-white/[0.02]" />
                  <div className="flex h-12 items-center rounded border border-white/5 bg-white/[0.02] px-3">
                    <div className="h-1 w-full rounded bg-[#8da4b3]/25" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CardHeader className="gap-5 pt-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TerminalSquare className="h-3 w-3 text-[#9fb2bf]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fb2bf]">
              {project.slug}
            </p>
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-stone-100">
            {project.title}
          </CardTitle>
          <p className="text-sm leading-7 text-zinc-400">{project.short_description}</p>
        </div>
      </CardHeader>

      <CardContent className="mt-auto flex flex-1 flex-col gap-8 pb-8">
        <div className="flex flex-wrap gap-2">
          {project.stack.length ? (
            project.stack.map((item) => (
              <Badge
                key={item}
                variant="muted"
                className="rounded-sm border-white/10 bg-white/5 font-mono text-[10px] font-normal text-zinc-400 transition-colors hover:bg-white/10"
              >
                {item}
              </Badge>
            ))
          ) : (
            <Badge
              variant="muted"
              className="rounded-sm border-white/10 bg-white/5 font-mono text-[10px] text-zinc-500"
            >
              SYS_STACK_NULL
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-widest text-zinc-500">
          {project.repo_url ? (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-[#d5dfe5]"
            >
              <Github className="h-3.5 w-3.5" />
              [ Github ]
            </a>
          ) : null}
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-[#d5dfe5]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              [ {copy.project_live_label} ]
            </a>
          ) : null}
          {!project.repo_url && !project.live_url ? (
            <span className="flex items-center gap-2 text-zinc-600">
              <span className="h-1 w-1 rounded-full bg-[#b59d85]/60" />
              {copy.project_internal_label}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
