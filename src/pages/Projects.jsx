import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useReveal } from '../lib/useReveal';
import SectionHeading from '../components/ui/SectionHeading';
import ProjectCard from '../components/cards/ProjectCard';
import CtaBanner from '../components/ui/CtaBanner';
import { LoadingState, ErrorState } from '../components/ui/StatusState';
import { Search, Hammer, Rocket } from 'lucide-react';

const process = [
  { icon: Search, title: 'Understand', d: 'Start with the actual problem and constraints, not the assumed solution.' },
  { icon: Hammer, title: 'Build', d: 'Ship a working version early, then iterate against real usage.' },
  { icon: Rocket, title: 'Refine', d: 'Polish, optimize, and harden once the core is proven.' },
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api.getProjects()
      .then((data) => { setProjects(data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  useReveal([projects, status]);

  return (
    <div className="pb-16 md:pb-24">
      <SectionHeading
        recordNo="03"
        label="Projects"
        title="Shipped, not staged."
        subtitle="Platforms built across web and Android — each entry below is in active use or development."
      />

      <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-20">
        <div>
        {status === 'loading' && <LoadingState label="Loading projects…" />}
        {status === 'error' && <ErrorState />}

        {status === 'ready' && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ───────── How projects get built ───────── */}
      <div className="mt-24">
        <div className="rv max-w-lg">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
            Process
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            How each project actually gets built.
          </h2>
        </div>

        <div className="relative mt-10 grid gap-10 md:gap-8 md:grid-cols-3">
          {/* Desktop horizontal line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-base-300 md:block" />
          
          {/* Mobile vertical timeline line */}
          <div className="pointer-events-none absolute left-[25px] top-4 bottom-4 block w-px bg-base-300 md:hidden" />

          {process.map(({ icon: Icon, title, d }, i) => (
            <div key={title} className="rv relative pl-16 md:pl-0" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="absolute left-0 top-0 md:relative z-10 grid h-[52px] w-[52px] place-items-center rounded-full border border-base-300 bg-base-100 text-primary shadow-sm md:shadow-none">
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div className="md:mt-4">
                <h3 className="font-display text-lg font-semibold pt-1 md:pt-0">
                  {String(i + 1).padStart(2, '0')} — {title}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-base-content/60">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CtaBanner
        eyebrow="Have Something to Build"
        title="Let's talk about your next project."
        subtitle="Freelance builds, full-time roles, or a scoped feature — I'm listening."
      />
      </div>
    </div>
  )
}
