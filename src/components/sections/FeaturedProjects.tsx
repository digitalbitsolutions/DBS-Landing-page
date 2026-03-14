import { Link2Off } from "lucide-react";

import ProjectCard from "@/components/cards/ProjectCard";
import Reveal from "@/components/motion/Reveal";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketingCopy } from "@/lib/data/marketing-copy";
import type { Project } from "@/lib/supabase/database.types";

interface FeaturedProjectsProps {
  copy: MarketingCopy;
  projects: Project[];
}

export default function FeaturedProjects({ copy, projects }: FeaturedProjectsProps) {
  return (
    <section
      id="casos"
      className="relative bg-[linear-gradient(180deg,rgba(7,16,24,0)_0%,rgba(14,22,31,0.45)_50%,rgba(7,16,24,0)_100%)] py-24 md:py-40"
    >
      <div className="section-shell">
        <div className="mb-16 flex flex-col gap-6 border-b border-white/5 pb-12 md:flex-row md:items-end md:justify-between">
          <Reveal className="max-w-2xl">
            <p className="section-kicker flex items-center gap-2">
              <span className="h-px w-8 bg-[#8da4b3]" /> {copy.projects_kicker}
            </p>
            <h2 className="section-title mt-6 whitespace-pre-line">{copy.projects_title}</h2>
          </Reveal>
          <Reveal className="max-w-md" delay={0.1}>
            <p className="font-mono text-sm leading-relaxed text-zinc-400 md:text-right">
              {copy.projects_code_label} <br />
              <span className="mt-2 block text-zinc-500">
                {copy.projects_code_detail}
              </span>
            </p>
          </Reveal>
        </div>

        {projects.length ? (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.12}>
                <ProjectCard copy={copy} project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Card className="glass-panel border-dashed border-white/10 bg-transparent">
            <CardContent className="flex flex-col items-center justify-center gap-4 p-16 text-center text-sm text-zinc-500">
              <div className="rounded-full bg-white/5 p-4">
                <Link2Off className="h-6 w-6" />
              </div>
              {copy.projects_empty}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
