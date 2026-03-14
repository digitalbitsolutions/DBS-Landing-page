import Reveal from "@/components/motion/Reveal";
import StepCard from "@/components/cards/StepCard";
import type { MarketingCopy } from "@/lib/data/marketing-copy";

export default function ProcessSteps({ copy }: { copy: MarketingCopy }) {
  const steps = [
    {
      title: copy.process_step_1_title,
      description: copy.process_step_1_description,
    },
    {
      title: copy.process_step_2_title,
      description: copy.process_step_2_description,
    },
    {
      title: copy.process_step_3_title,
      description: copy.process_step_3_description,
    },
  ];

  return (
    <section id="proceso" className="py-24 md:py-40">
      <div className="section-shell">
        <Reveal className="mb-16">
          <div className="flex flex-col gap-6 border-b border-white/5 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="section-kicker flex items-center gap-2">
                <span className="h-px w-8 bg-[#8da4b3]" /> {copy.process_kicker}
              </p>
              <h2 className="section-title mt-6 whitespace-pre-line">{copy.process_title}</h2>
            </div>
            <p className="hidden max-w-sm border-l border-[#8da4b3]/30 bg-white/[0.01] p-4 pl-6 font-mono text-sm leading-relaxed text-zinc-400 lg:block">
              {copy.process_summary}
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.15}>
              <StepCard index={index + 1} title={step.title} description={step.description} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
