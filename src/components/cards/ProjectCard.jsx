import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Globe, Smartphone, X } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import Tag from '../ui/Tag';

const TYPE_ICON = {
  'Web App': Globe,
  'Mobile App': Smartphone,
};

// Domains that block iframing (X-Frame-Options) or have anti-bot JS, or use Firebase/Google Auth which blocks iframes
const BLOCKED_DOMAINS = ['free.nf', 'banglarbagh.org', 'vercel.app'];
const isIframeBlocked = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return BLOCKED_DOMAINS.some(domain => hostname.includes(domain));
  } catch {
    return false;
  }
};

export default function ProjectCard({ project, index }) {
  const [showPreview, setShowPreview] = useState(false);
  const TypeIcon = TYPE_ICON[project.type] || Globe;
  const hasLinks = project.links?.demo || project.links?.github || project.links?.apk;

  const handleLiveClick = (e) => {
    // Only intercept and show inline preview on desktop sizes
    if (window.innerWidth >= 768) {
      e.preventDefault();
      setShowPreview(!showPreview);
    }
  };

  return (
    <div className="rv h-full" style={{ transitionDelay: `${index * 70}ms` }}>
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${showPreview ? '' : 'hover:-translate-y-1'}`}
      >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-base-content/40">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-field border border-base-300 bg-base-200 px-2.5 py-1 font-mono text-[0.68rem] uppercase tracking-wide text-base-content/60">
          <TypeIcon size={12} />
          {project.type}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-primary">
        {project.name}
      </h3>
      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-base-content/60">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <Tag key={t} tone="primary">{t}</Tag>
        ))}
      </div>

      {hasLinks && (
        <div className="mt-5 flex gap-4 border-t border-base-300 pt-4 font-mono text-xs">
          {project.links.demo && (
            <a
              href={project.links.demo}
              onClick={handleLiveClick}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-base-content/60 transition-colors hover:text-primary cursor-pointer"
            >
              {showPreview ? 'Close Preview' : 'Live Preview'} <ArrowUpRight size={13} />
            </a>
          )}
          {project.links.apk && (
            <a
              href={project.links.apk}
              download
              className="inline-flex items-center gap-1 text-base-content/60 transition-colors hover:text-primary cursor-pointer"
            >
              Download apk <ArrowUpRight size={13} />
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-base-content/60 transition-colors hover:text-primary"
            >
              <GithubIcon size={13} /> Code
            </a>
          )}
        </div>
      )}

      {/* The mini browser preview modal (Pop-up) */}
      {project.links?.demo && showPreview && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-base-300/80 backdrop-blur-sm transition-opacity"
            onClick={() => setShowPreview(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-6xl h-[85vh] flex flex-col rounded-2xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Mac OS style Window Header */}
            <div className="flex items-center justify-between border-b border-base-300 bg-base-200/50 px-4 py-3 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-warning/80 shadow-sm"></div>
                  <div className="w-3 h-3 rounded-full bg-success/80 shadow-sm"></div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-base-100 rounded-md border border-base-300 text-xs font-mono text-base-content/70">
                  <Globe size={12} />
                  <span>
                    {(() => {
                      try { return new URL(project.links.demo).hostname; } catch { return 'live-preview'; }
                    })()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href={project.links.demo} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hidden sm:flex btn btn-xs btn-outline border-base-300 text-base-content/70 hover:bg-base-300 font-normal h-8 px-3"
                  title="Open in new tab if preview fails"
                >
                  Open in New Tab <ArrowUpRight size={14} />
                </a>
                <button 
                  onClick={() => setShowPreview(false)} 
                  className="btn btn-sm btn-circle btn-ghost text-base-content/60 hover:text-base-content"
                  title="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            {/* Preview Container: Iframe or Screenshot based on domain compatibility */}
            {isIframeBlocked(project.links.demo) ? (
              <div className="relative flex-1 w-full bg-base-200/50 group/preview overflow-hidden">
                <img
                  src={`https://api.microlink.io/?url=${encodeURIComponent(project.links.demo)}&screenshot=true&meta=false&embed=screenshot.url`}
                  alt={`${project.name} Preview`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/preview:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-300/60 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                  <a
                    href={project.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary shadow-xl shadow-primary/20"
                  >
                    Open Live Website <ArrowUpRight size={18} />
                  </a>
                  <p className="mt-4 text-sm font-medium text-base-content/70">
                    (Preview is an image because the host blocks inline frames)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative flex-1 w-full bg-base-100">
                <iframe
                  src={project.links.demo}
                  title={`${project.name} Live Preview`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      </article>
    </div>
  );
}
