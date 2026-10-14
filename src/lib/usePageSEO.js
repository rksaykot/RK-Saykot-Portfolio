import { useEffect } from 'react';

export function usePageSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage
}) {
  useEffect(() => {
    // 1. Title
    const fullTitle = title
      ? `${title} — RK Saykot | Full-Stack Developer`
      : 'RK Saykot — Full-Stack Developer & Software Engineer';
    document.title = fullTitle;

    // Helper for updating or creating meta tags
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const defaultDesc =
      'RK Saykot is a Full-Stack Developer and Computer Engineering student in Dhaka, Bangladesh. Building scalable web and mobile products with React, Next.js, Node.js, and modern technologies.';
    const desc = description || defaultDesc;

    setMeta('description', desc);
    setMeta('title', fullTitle);
    if (keywords) setMeta('keywords', keywords);

    // OpenGraph
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', desc, true);
    if (ogImage) setMeta('og:image', ogImage, true);

    // Twitter
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    if (ogImage) setMeta('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, keywords, canonical, ogImage]);
}
