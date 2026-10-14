import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function AdminHomepage() {
  const [config, setConfig] = useState({
    heroTitle: 'Full-Stack Developer',
    heroName: 'Saykot',
    heroDescription: 'I build web and mobile products end to end — React and Next.js on the frontend, Node.js and MySQL underneath. Currently working as a freelance developer, and studying Computer Engineering on the side.',
    currentProjectName: 'People E Sheba',
    currentProjectDesc: 'A comprehensive React-based community services platform built with Node.js, MySQL, and Tailwind CSS.',
    cvUrl: 'Saykot_CV.pdf',
    heroImageUrl: '',
    heroTypewriterTexts: 'I build scalable web and mobile products., I design user-centric interfaces., I write stories and poems that reflect the truth., I hold certificates that prove the rest.',
    approachTitle: 'Three things I hold to on every build.',
    approachCard1Title: 'Clean, maintainable code',
    approachCard1Desc: 'Modular components and clear structure — code that a future developer (including future me) can actually follow.',
    approachCard2Title: 'End-to-end ownership',
    approachCard2Desc: 'Comfortable across the whole stack, from database schema to the pixel on screen — no hand-off gaps.',
    approachCard3Title: 'Ships, then improves',
    approachCard3Desc: 'Working software first, polish second. Iteration beats a perfect plan that never leaves the doc.',
    techMarquee: 'React, Next.js, Node.js, MySQL, Kotlin, Jetpack Compose, Tailwind CSS, Express',
    ctaTitle: 'Ready to build something worth shipping?',
    ctaSubtitle: "I'm currently available for freelance projects and full-time roles."
  });
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await api.getConfig();
        setConfig({
          heroTitle: data.heroTitle || 'Full-Stack Developer',
          heroName: data.heroName || 'Saykot',
          heroDescription: data.heroDescription || 'I build web and mobile products end to end — React and Next.js on the frontend, Node.js and MySQL underneath. Currently working as a freelance developer, and studying Computer Engineering on the side.',
          currentProjectName: data.currentProjectName || 'People E Sheba',
          currentProjectDesc: data.currentProjectDesc || 'A comprehensive React-based community services platform built with Node.js, MySQL, and Tailwind CSS.',
          cvUrl: data.cvUrl || 'Saykot_CV.pdf',
          heroImageUrl: data.heroImageUrl || '',
          heroTypewriterTexts: data.heroTypewriterTexts || 'I build scalable web and mobile products., I design user-centric interfaces., I write stories and poems that reflect the truth., I hold certificates that prove the rest.',
          approachTitle: data.approachTitle || 'Three things I hold to on every build.',
          approachCard1Title: data.approachCard1Title || 'Clean, maintainable code',
          approachCard1Desc: data.approachCard1Desc || 'Modular components and clear structure — code that a future developer (including future me) can actually follow.',
          approachCard2Title: data.approachCard2Title || 'End-to-end ownership',
          approachCard2Desc: data.approachCard2Desc || 'Comfortable across the whole stack, from database schema to the pixel on screen — no hand-off gaps.',
          approachCard3Title: data.approachCard3Title || 'Ships, then improves',
          approachCard3Desc: data.approachCard3Desc || 'Working software first, polish second. Iteration beats a perfect plan that never leaves the doc.',
          techMarquee: data.techMarquee || 'React, Next.js, Node.js, MySQL, Kotlin, Jetpack Compose, Tailwind CSS, Express',
          ctaTitle: data.ctaTitle || 'Ready to build something worth shipping?',
          ctaSubtitle: data.ctaSubtitle || "I'm currently available for freelance projects and full-time roles."
        });
      } catch (err) {
        console.error("Failed to load config", err);
      }
    }
    loadConfig();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setStatus('updating');
    try {
      await api.updateConfig(config);
      setStatus('success');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('error');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setIsUploading(true);
    try {
      const res = await api.uploadFile(formData);
      const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
      setConfig({ ...config, heroImageUrl: baseUrl + res.url });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold font-display mb-8">Homepage Builder</h1>
      
      <form onSubmit={handleUpdate} className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Hero Section */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm col-span-1 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            Hero Section
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Hero Tagline</label>
                <input 
                  type="text" 
                  value={config.heroTitle}
                  onChange={e => setConfig({...config, heroTitle: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={config.heroName}
                  onChange={e => setConfig({...config, heroName: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Main Description</label>
              <textarea 
                value={config.heroDescription}
                onChange={e => setConfig({...config, heroDescription: e.target.value})}
                className="textarea textarea-bordered w-full h-24 bg-base-200/50" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">CV / Resume File Name</label>
              <input 
                type="text" 
                value={config.cvUrl}
                onChange={e => setConfig({...config, cvUrl: e.target.value})}
                className="input input-bordered w-full bg-base-200/50" 
                placeholder="Saykot_CV.pdf"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Hero Profile Image URL</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={config.heroImageUrl}
                  onChange={e => setConfig({...config, heroImageUrl: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="/uploads/myimage.png"
                />
                <label className={`btn ${isUploading ? 'btn-disabled' : 'btn-outline'}`}>
                  {isUploading ? '...' : 'Upload'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Typewriter Animation Texts (Comma separated)</label>
              <textarea 
                value={config.heroTypewriterTexts}
                onChange={e => setConfig({...config, heroTypewriterTexts: e.target.value})}
                className="textarea textarea-bordered w-full h-24 bg-base-200/50" 
              />
            </div>
          </div>
        </div>

        {/* Currently Building */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm col-span-1 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Currently Building Section
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Project Name</label>
              <input 
                type="text" 
                value={config.currentProjectName}
                onChange={e => setConfig({...config, currentProjectName: e.target.value})}
                className="input input-bordered w-full bg-base-200/50" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Project Description</label>
              <textarea 
                value={config.currentProjectDesc}
                onChange={e => setConfig({...config, currentProjectDesc: e.target.value})}
                className="textarea textarea-bordered w-full h-20 bg-base-200/50" 
              />
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm col-span-1 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            How I Work Section
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Section Title</label>
              <input 
                type="text" 
                value={config.approachTitle}
                onChange={e => setConfig({...config, approachTitle: e.target.value})}
                className="input input-bordered w-full bg-base-200/50" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-base-300">
              {/* Card 1 */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary">Card 1</label>
                <input 
                  type="text" 
                  value={config.approachCard1Title}
                  onChange={e => setConfig({...config, approachCard1Title: e.target.value})}
                  className="input input-bordered w-full input-sm bg-base-200/50" 
                  placeholder="Title"
                />
                <textarea 
                  value={config.approachCard1Desc}
                  onChange={e => setConfig({...config, approachCard1Desc: e.target.value})}
                  className="textarea textarea-bordered w-full h-24 bg-base-200/50 text-sm" 
                  placeholder="Description"
                />
              </div>
              
              {/* Card 2 */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary">Card 2</label>
                <input 
                  type="text" 
                  value={config.approachCard2Title}
                  onChange={e => setConfig({...config, approachCard2Title: e.target.value})}
                  className="input input-bordered w-full input-sm bg-base-200/50" 
                  placeholder="Title"
                />
                <textarea 
                  value={config.approachCard2Desc}
                  onChange={e => setConfig({...config, approachCard2Desc: e.target.value})}
                  className="textarea textarea-bordered w-full h-24 bg-base-200/50 text-sm" 
                  placeholder="Description"
                />
              </div>

              {/* Card 3 */}
              <div className="space-y-3">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary">Card 3</label>
                <input 
                  type="text" 
                  value={config.approachCard3Title}
                  onChange={e => setConfig({...config, approachCard3Title: e.target.value})}
                  className="input input-bordered w-full input-sm bg-base-200/50" 
                  placeholder="Title"
                />
                <textarea 
                  value={config.approachCard3Desc}
                  onChange={e => setConfig({...config, approachCard3Desc: e.target.value})}
                  className="textarea textarea-bordered w-full h-24 bg-base-200/50 text-sm" 
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm col-span-1 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            CTA Banner Section
          </h2>
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-0">
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Banner Title</label>
              <input 
                type="text" 
                value={config.ctaTitle}
                onChange={e => setConfig({...config, ctaTitle: e.target.value})}
                className="input input-bordered w-full bg-base-200/50" 
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Banner Subtitle</label>
              <textarea 
                value={config.ctaSubtitle}
                onChange={e => setConfig({...config, ctaSubtitle: e.target.value})}
                className="textarea textarea-bordered w-full h-20 bg-base-200/50" 
              />
            </div>
          </div>
        </div>
        
        <div className="col-span-1 xl:col-span-2 pt-4 flex items-center gap-4">
          <button 
            type="submit" 
            className="btn btn-primary px-8"
            disabled={status === 'updating'}
          >
            {status === 'updating' ? <span className="loading loading-spinner loading-sm"></span> : 'Save Homepage'}
          </button>
          {status === 'success' && <span className="text-success font-medium">Homepage updated successfully!</span>}
          {status === 'error' && <span className="text-error font-medium">Failed to update homepage.</span>}
        </div>
      </form>
    </div>
  );
}
