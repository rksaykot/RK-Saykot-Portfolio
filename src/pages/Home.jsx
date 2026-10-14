import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { useEffect, useState, useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Code2, Layers, Rocket } from 'lucide-react';
import { api } from '../lib/api';
import { useReveal } from '../lib/useReveal';
import Marquee from '../components/ui/Marquee';
import StatsStrip from '../components/ui/StatsStrip';
import CtaBanner from '../components/ui/CtaBanner';
import ProjectCard from '../components/cards/ProjectCard';







export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skillGroups, setSkillGroups] = useState([]);
  const [certs, setCerts] = useState([]);
  const [siteConfig, setSiteConfig] = useState({});

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => {});
    api.getSkills().then(setSkillGroups).catch(() => {});
    api.getCertifications().then(setCerts).catch(() => {});
    api.getConfig().then(setSiteConfig).catch(() => {});
  }, []);

  useReveal([projects, skillGroups, certs]);

  const instituteCount = useMemo(
    () => new Set(certs.map((c) => c.institute)).size,
    [certs]
  );

  const stats = [
    { value: projects.length ? `${projects.length}+` : '—', label: 'Projects Shipped' },
    { value: certs.length || '—', label: 'Certifications' },
    { value: instituteCount || '—', label: 'Institutes' },
    { value: skillGroups.length ? skillGroups.length : '—', label: 'Skill Categories' },
  ];

  const quicklinks = [
    { to: '/skills', label: 'Skills', d: 'Frontend, backend, mobile, and tools — the working stack.' },
    { to: '/projects', label: 'Projects', d: 'Shipped platforms across web and Android.' },
    { to: '/experience', label: 'Experience', d: 'Where the work has happened so far.' },
    { to: '/certification', label: 'Certification', d: `${certs.length || 6} credentials across ${instituteCount || 6} institutes.` },
  ];

  const typeSequence = useMemo(() => {
    const rawTexts = siteConfig.heroTypewriterTexts || 'I build scalable web and mobile products., I design user-centric interfaces., I write stories and poems that reflect the truth., I hold certificates that prove the rest.';
    const parts = rawTexts.split(',').map(s => s.trim()).filter(Boolean);
    const seq = [];
    for (const part of parts) {
      seq.push(part);
      seq.push(2000);
    }
    return seq.length ? seq : ['Developer', 2000];
  }, [siteConfig.heroTypewriterTexts]);

  const stack = useMemo(() => {
    const raw = siteConfig.techMarquee || 'React, Next.js, Node.js, MySQL, Kotlin, Jetpack Compose, Tailwind CSS, Express';
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }, [siteConfig.techMarquee]);

  const approach = useMemo(() => {
    return [
      {
        icon: Code2,
        title: siteConfig.approachCard1Title || 'Clean, maintainable code',
        d: siteConfig.approachCard1Desc || 'Modular components and clear structure — code that a future developer (including future me) can actually follow.',
      },
      {
        icon: Layers,
        title: siteConfig.approachCard2Title || 'End-to-end ownership',
        d: siteConfig.approachCard2Desc || 'Comfortable across the whole stack, from database schema to the pixel on screen — no hand-off gaps.',
      },
      {
        icon: Rocket,
        title: siteConfig.approachCard3Title || 'Ships, then improves',
        d: siteConfig.approachCard3Desc || 'Working software first, polish second. Iteration beats a perfect plan that never leaves the doc.',
      },
    ];
  }, [siteConfig]);

  return (
    <div>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden border-b border-base-300">
        <div className="bg-dot-grid pointer-events-none absolute inset-0 text-base-content/[0.06]" />
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[110px]" />

        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 pt-32 pb-20 md:grid-cols-[1.15fr_0.85fr] md:pt-40 md:pb-28">
          <div>
            <div className="rv inline-flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {siteConfig.heroTitle || 'Full-Stack Developer'}
            </div>

            <h1 className="rv rv-d1 mt-5 text-[clamp(2.5rem,6vw,4.2rem)] font-semibold leading-[1.04] tracking-tight">
              Hi, I'm {siteConfig.heroName || 'Saykot'}.
              <span className="mt-2 block text-[0.42em] font-medium leading-snug text-base-content/55">
                <TypeAnimation
                  sequence={typeSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </h1>

            <p className="rv rv-d2 mt-6 max-w-lg text-[1.05rem] leading-relaxed text-base-content/65">
              {siteConfig.heroDescription || 'I build web and mobile products end to end — React and Next.js on the frontend, Node.js and MySQL underneath. Currently working as a freelance developer, and studying Computer Engineering on the side.'}
            </p>

            <div className="rv rv-d3 mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/projects"
                className="btn btn-primary rounded-full px-6 font-mono text-sm normal-case"
              >
                View Projects <ArrowRight size={15} />
              </Link>
              <a
                href={`${import.meta.env.BASE_URL}${siteConfig.cvUrl || 'Saykot_CV.pdf'}`}
                download={siteConfig.cvUrl || 'Saykot_CV.pdf'}
                className="btn btn-outline rounded-full border-base-300 px-6 font-mono text-sm normal-case hover:border-primary hover:bg-transparent hover:text-primary"
              >
                Download CV
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="rv rv-d2 relative">
            <div className="rounded-box border border-base-300 bg-base-100/90 p-6 shadow-xl shadow-base-content/[0.03] backdrop-blur-sm">
              <img src={siteConfig.heroImageUrl || `${import.meta.env.BASE_URL}saykot-photo.png`} alt="Saykot" className="aspect-square h-full w-full object-cover object-center rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Tech marquee ───────── */}
      <Marquee items={stack} />

      {/* ───────── Quicklinks ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {quicklinks.map((item, i) => (
            <Link
              to={item.to}
              key={item.to}
              className="rv group flex flex-col rounded-box border border-base-300 bg-base-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              
              <h3 className="mt-4 font-display text-lg font-semibold transition-colors group-hover:text-primary">
                {item.label}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-base-content/55">{item.d}</p>
              <ArrowUpRight
                size={18}
                className="mt-4 text-base-content/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── By the numbers ───────── */}
      <section className="border-y border-base-300 bg-base-200/30">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <StatsStrip stats={stats} />
        </div>
      </section>

      {/* ───────── Featured work ───────── */}
      {projects.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="rv flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
                Featured Work
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
                A few things I've built.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 font-mono text-sm text-base-content/60 transition-colors hover:text-primary"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ───────── Currently building ───────── */}
      <section className="border-t border-base-300 bg-base-200/40">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="rv flex flex-col items-start justify-between gap-6 rounded-box border border-base-300 bg-base-100 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
                Currently Building
              </span>
              <h2 className="mt-2 font-display text-2xl font-semibold">
                {siteConfig.currentProjectName || 'People E Sheba'}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-base-content/60">
                {siteConfig.currentProjectDesc || 'A comprehensive React-based community services platform built with Node.js, MySQL, and Tailwind CSS.'}
              </p>
            </div>
            <Link
              to="/projects"
              className="btn btn-outline shrink-0 rounded-full border-base-300 font-mono text-sm normal-case hover:border-primary hover:bg-transparent hover:text-primary"
            >
              See all projects <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Approach ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="rv max-w-lg">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
            How I Work
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            {siteConfig.approachTitle || 'Three things I hold to on every build.'}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {approach.map(({ icon: Icon, title, d }, i) => (
            <div
              key={title}
              className="rv rounded-box border border-base-300 bg-base-100 p-6"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-field border border-base-300 bg-base-200 text-primary">
                <Icon size={19} strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <CtaBanner
          title={siteConfig.ctaTitle || "Ready to build something worth shipping?"}
          subtitle={siteConfig.ctaSubtitle || "I'm currently available for freelance projects and full-time roles."}
        />
      </div>
    </div>
  );
}

