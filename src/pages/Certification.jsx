import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { useReveal } from '../lib/useReveal';
import SectionHeading from '../components/ui/SectionHeading';
import StatsStrip from '../components/ui/StatsStrip';
import CtaBanner from '../components/ui/CtaBanner';
import { LoadingState, ErrorState } from '../components/ui/StatusState';
import certificationGraphic from '../assets/certification_graphic.png';
import { Award, Building2 } from 'lucide-react';

const CATEGORY_ORDER = ['Educational', 'Technical', 'Professional', 'Other'];

function CertificationCard({ cert, index }) {
  return (
    <div 
      className="rv rv-scale group relative flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-primary">
          {cert.category}
        </span>
        <span className="font-mono text-[0.7rem] text-base-content/30 transition-colors group-hover:text-primary/50">
          #{String(cert.id).padStart(2, '0')}
        </span>
      </div>
      
      <div className="relative z-10 flex-1">
        <h3 className="font-display text-[1.1rem] font-semibold leading-snug text-base-content transition-colors group-hover:text-primary">
          {cert.credential}
        </h3>
        
        <div className="mt-4 flex items-start gap-2.5 text-sm text-base-content/65">
          <Building2 size={16} className="mt-0.5 shrink-0 opacity-70" />
          <span className="leading-relaxed">{cert.institute}</span>
        </div>
      </div>
      
      <Award className="absolute -bottom-4 -right-4 h-28 w-28 opacity-[0.02] transition-all duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-[0.05] group-hover:text-primary" />
    </div>
  );
}

export default function Certification() {
  const [certs, setCerts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activeCat, setActiveCat] = useState('All');

  useEffect(() => {
    api.getCertifications()
      .then((data) => { setCerts(data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, []);

  useReveal([certs, activeCat, status]);

  const filteredCerts = useMemo(() => {
    return activeCat === 'All' ? certs : certs.filter((c) => c.category === activeCat);
  }, [certs, activeCat]);

  const activeCategories = useMemo(() => {
    const existing = new Set(certs.map(c => c.category));
    return CATEGORY_ORDER.filter(cat => existing.has(cat));
  }, [certs]);

  const categories = ['All', ...activeCategories];
  const instituteCount = useMemo(
    () => {
      const institutes = new Set(certs.map((c) => c.institute));
      return institutes.size;
    },
    [certs]
  );

  const stats = [
    { value: certs.length || '—', label: 'Certifications' },
    { value: instituteCount || '—', label: 'Institutes' },
    { value: activeCategories.length, label: 'Categories' },
    { value: '100%', label: 'Completed' },
  ];

  return (
    <div className="pb-16 md:pb-24">
      <SectionHeading
        recordNo="05"
        label="Certification"
        title={
          <>
            Verified certificates<br />
            <span className="text-base-content/60">Across {instituteCount} institutes</span>
          </>
        }
        subtitle="A full transcript of completed academic education, vocational training, and professional communication courses. Filter by category below."
      />

      <div className="mx-auto max-w-6xl px-6 pt-12 md:pt-20">
        <div>
        <StatsStrip stats={stats} className="rv" />
      </div>

      <div className="mt-14">
        {status === 'loading' && <LoadingState label="Loading certifications…" />}
        {status === 'error' && <ErrorState />}

        {status === 'ready' && (
          <>
            <div className="rv rv-d2 flex flex-wrap gap-2">
              {categories.map((cat) => {
                const count = cat === 'All' ? certs.length : certs.filter((c) => c.category === cat).length;
                const active = activeCat === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={`rounded-full border px-3.5 py-2 font-mono text-xs transition-colors ${
                      active
                        ? 'border-primary bg-primary text-primary-content'
                        : 'border-base-300 bg-base-100 text-base-content/60 hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {cat} <span className="opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCerts.map((cert, i) => (
                <CertificationCard key={cert.id} cert={cert} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ───────── Why certifications ───────── */}
      <div className="mt-24 overflow-hidden rounded-3xl border border-base-300 bg-base-200/30">
        <div className="p-8 md:p-10 lg:p-12">
          <div className="rv flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10">
            <div className="shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-base-300 bg-base-100 shadow-sm md:h-32 md:w-32">
                <img
                  src={certificationGraphic}
                  alt="Certification Graphic"
                  className="h-14 w-14 object-contain opacity-80 md:h-20 md:w-20"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="mb-5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-primary">
                Why Certifications
              </span>
              <p className="text-[1.05rem] leading-relaxed text-base-content/75 md:text-[1.1rem]">
                Certifications aren't the goal — they're the byproduct of completing
                what I start. If a skill is worth having, it's worth proving I
                have it. That mindset covers my academic path (JSC, SSC, and Diploma),
                my technical skills (Front End Development), and my professional/vocational courses
                (Civil engineering and Spoken English) — because staying curious and building practical
                skills makes the code better too.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CtaBanner
        eyebrow="See The Skills In Practice"
        title="Credentials are one part of the story."
        subtitle="Here's the working stack these certifications back up."
        ctaLabel="View Skills"
        ctaTo="/skills"
      />
      </div>
    </div>
  )
}
