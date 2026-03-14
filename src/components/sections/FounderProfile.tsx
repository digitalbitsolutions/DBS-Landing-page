import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { Terminal, ShieldCheck, Code2, Database } from "lucide-react";

export default function FounderProfile() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden border-t border-white/[0.02] bg-[#02040b]">
      {/* Glow effect */}
      <div className="absolute right-0 top-1/2 -z-10 h-[300px] w-[500px] -translate-y-1/2 rounded-full bg-cyan-900/10 blur-[120px]" />
      
      <div className="section-shell">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:items-center xl:gap-20">
            {/* Image Container with Premium Tech Framing */}
            <div className="relative mx-auto lg:mx-0 w-full max-w-[400px] aspect-[4/5] rounded-sm overflow-hidden p-[1px] bg-gradient-to-b from-white/10 to-transparent">
              <div className="relative h-full w-full bg-black rounded-sm overflow-hidden group">
                {/* Image Placeholder or the generated image */}
                <Image
                  src="/founder_photo.png"
                  alt="Founder / Lead Consultant"
                  fill
                  className="object-cover object-top opacity-90 transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] contrast-125"
                />
                
                {/* Tech overlay elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02040b] via-transparent to-transparent opacity-90" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest leading-none">Status: Available</span>
                </div>
                
                {/* Tech stats decorative box */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel border border-white/10 rounded backdrop-blur-md bg-black/40 p-3">
                   <div className="flex items-center justify-between text-xs font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">
                      <span>SYS.ADMIN</span>
                      <span>LVL. 50</span>
                   </div>
                   <div className="flex items-center gap-4 text-cyan-400">
                     <span className="flex items-center gap-1.5"><Code2 className="h-3 w-3" /> 20+ YRS</span>
                     <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> LEAD</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                    Liderazgo Técnico en PHP & WP
                  </p>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                  Experiencia madura <br className="hidden md:block"/> para arquitecturas serias.
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 text-sm font-mono tracking-wider text-zinc-300 bg-white/5 w-fit px-4 py-2 border border-white/10 rounded-sm">
                   <span>Programador Fullstack</span>
                   <span className="text-cyan-500">|</span>
                   <span>Ingeniero de Sistemas</span>
                   <span className="text-cyan-500">|</span>
                   <span>Especialista WP</span>
                </div>
              </div>

              <div className="space-y-6 text-base leading-relaxed text-zinc-400 border-l border-cyan-500/30 pl-6 max-w-2xl relative">
                <p>
                  Con décadas de trayectoria en la trinchera del desarrollo corporativo, entiendo que las empresas no necesitan herramientas de moda, necesitan <strong className="text-white font-medium">sistemas predecibles, seguros y rentables</strong>.
                </p>
                <p>
                  Desde arquitecturas monolíticas legadas hasta ecosistemas desacoplados modernos, la prioridad siempre es la misma: operaciones ininterrumpidas y crecimiento sin colapsos estructurales. Aporto madurez técnica para asegurar que las decisiones de ingeniería tengan sentido comercial.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5 max-w-2xl">
                <div className="space-y-1">
                  <p className="text-2xl font-light text-white">100+</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Despliegues</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-light text-white">0%</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Downtime (SLA)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-light text-white">Core</p>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">PHP / Node</p>
                </div>
                <div className="space-y-1">
                  <Database className="h-6 w-6 text-white mb-1" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Databases</p>
                </div>
              </div>

            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
