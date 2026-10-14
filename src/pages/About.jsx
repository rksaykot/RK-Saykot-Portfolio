import { useReveal } from '../lib/useReveal';
import { usePageSEO } from '../lib/usePageSEO';
import SectionHeading from '../components/ui/SectionHeading';
import CtaBanner from '../components/ui/CtaBanner';
import { GraduationCap, PenLine, Users } from 'lucide-react';

const facts = [
  ['Name', 'RK Saykot'],
  ['Live in', 'Dhaka, Bangladesh'],
  ['Current role', 'Freelance Web Developer'],
  ['Status', 'Available for Projects'],
  ['Education', 'Computer Engineering'],
  ['Hobby', 'Bengali creative writing'],
];

const timeline = [
  { year: 'Now', title: 'Freelance Web Developer', org: 'Multiple Clients' },
  { year: 'Now', title: 'Computer Engineering', org: 'Ongoing studies' },
  { year: 'Ongoing', title: 'Side tutoring', org: 'Independent students' },
];

const beyond = [
  {
    icon: PenLine,
    title: 'Bengali creative writing',
    d: "Short stories and poetry published on Asom Aptogolpo Kobitar Bhandar — a project I'm slowly growing on its own terms.",
  },
  {
    icon: Users,
    title: 'Tutoring on the side',
    d: 'Helping high school and college students with Mathematics, Science, and ICT subjects.',
  },
  {
    icon: GraduationCap,
    title: 'Studying Computer Engineering',
    d: 'Formal coursework running alongside professional development work, not instead of it.',
  },
];

export default function About() {
  usePageSEO({
    title: 'About Me',
    description: 'Learn more about RK Saykot — Full-Stack Developer and Computer Engineering student in Dhaka, Bangladesh. Technical background, approach, and journey.'
  });

  useReveal();

  return (
    <div className="pb-16 md:pb-24">
      <SectionHeading
        recordNo="01"
        label="About"
        title="Building software, on purpose."
        subtitle="A full-stack developer's account of how the work actually happens."
      />

      <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
        <div className="rv rv-d2 space-y-5 text-[1.02rem] leading-relaxed text-base-content/70">
          <p>
            I'm <strong className="font-medium text-base-content">RK Saykot</strong> — a
            freelance web developer and a Computer
            Engineering student living in Dhaka.
          </p>
          <p>
            My day-to-day centers on React, Next.js, and Node.js — delivering
            custom websites and web applications for local businesses and organizations. On the
            mobile side, I work in Kotlin and Jetpack Compose, most recently
            building a Daily Reminder app with a full calendar and recurring
            alarm system.
          </p>
          <p>
            Outside of paid work, I tutor students on the side, and write short
            stories and poetry in Bengali on my page <em>Asom Aptogolpo Kobitar
            Bhandar</em> — which I'm slowly working to grow and monetize as a
            writing project in its own right.
          </p>
        </div>

        <aside className="rv rv-d3 h-fit rounded-box border border-base-300 bg-base-100 p-6">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-base-content/35">
            Quick Facts
          </span>
          <div className="mt-4 divide-y divide-base-300">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 py-3.5 text-sm">
                <span className="text-base-content/45">{k}</span>
                <span className="text-right font-medium">{v}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ───────── Right now ───────── */}
      <div className="mt-24">
        <div className="rv max-w-lg">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
            Right Now
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            What's actively on my plate.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {timeline.map((t, i) => (
            <div
              key={t.title}
              className="rv rv-left rounded-box border border-base-300 bg-base-100 p-6"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-primary">
                {t.year}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-base-content/55">{t.org}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ───────── Beyond the code ───────── */}
      <div className="mt-24">
        <div className="rv max-w-lg">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
            Beyond the Code
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            What I do when I'm not shipping.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {beyond.map(({ icon: Icon, title, d }, i) => (
            <div
              key={title}
              className="rv rv-scale rounded-box border border-base-300 bg-base-100 p-6"
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
      </div>

      <CtaBanner
        eyebrow="Curious About the Work"
        title="See what I've actually built."
        subtitle="Projects, skills, and a full record of experience — all one click away."
        ctaLabel="View Projects"
        ctaTo="/projects"
      />
      </div>
    </div>
  )
}

