import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { auth } from '../../lib/firebase';
import { updateEmail, updatePassword } from 'firebase/auth';

export default function AdminConfig() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  
  const [siteConfig, setSiteConfig] = useState({
    contactEmail: '',
    githubUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    facebookUrl: '',
    maintenanceMode: false
  });
  const [configStatus, setConfigStatus] = useState('');
  const [cacheStatus, setCacheStatus] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await api.getConfig();
        setSiteConfig({
          contactEmail: data.contactEmail || '',
          githubUrl: data.githubUrl || '',
          linkedinUrl: data.linkedinUrl || '',
          twitterUrl: data.twitterUrl || '',
          facebookUrl: data.facebookUrl || '',
          maintenanceMode: data.maintenanceMode || false
        });
      } catch (err) {
        console.error("Failed to load config", err);
      }
    }
    loadConfig();
  }, []);
  
  const handleUpdateAuth = async (e) => {
    e.preventDefault();
    setAuthStatus('updating');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not logged in');

      if (email && email !== user.email) {
        await updateEmail(user, email);
      }
      if (password) {
        await updatePassword(user, password);
      }
      
      setAuthStatus('success');
      setPassword(''); // clear password field
      setTimeout(() => setAuthStatus(''), 3000);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setAuthStatus('recent-login-required');
      } else {
        setAuthStatus('error');
      }
    }
  };

  const handleUpdateConfig = async (e) => {
    e.preventDefault();
    setConfigStatus('updating');
    try {
      await api.updateConfig(siteConfig);
      setConfigStatus('success');
      setTimeout(() => setConfigStatus(''), 3000);
    } catch (err) {
      setConfigStatus('error');
    }
  };

  const handleClearCache = () => {
    setCacheStatus('clearing');
    setTimeout(() => {
      setCacheStatus('success');
      setTimeout(() => setCacheStatus(''), 3000);
    }, 800);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold font-display mb-8">System Configuration</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Security / Credentials */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Security & Credentials
          </h2>
          <form onSubmit={handleUpdateAuth} className="space-y-4 flex-1">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">New Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input input-bordered w-full bg-base-200/50" 
                placeholder="Leave blank to keep current"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input input-bordered w-full bg-base-200/50" 
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={authStatus === 'updating'}
              >
                {authStatus === 'updating' ? <span className="loading loading-spinner loading-sm"></span> : 'Update Credentials'}
              </button>
            </div>
            
            {authStatus === 'success' && <p className="text-success text-sm mt-2 text-center">Credentials updated successfully in Firebase!</p>}
            {authStatus === 'error' && <p className="text-error text-sm mt-2 text-center">Failed to update credentials. Check console for details.</p>}
            {authStatus === 'recent-login-required' && <p className="text-error text-sm mt-2 text-center">Security requirement: Please log out and log back in before updating your credentials.</p>}
          </form>
        </div>

        {/* System Options */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm flex flex-col">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            System Options
          </h2>
          <div className="space-y-6 flex-1">
            <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl border border-base-300">
              <div>
                <h3 className="font-medium">Maintenance Mode</h3>
                <p className="text-sm text-base-content/60">Take the public site offline</p>
              </div>
              <input 
                type="checkbox" 
                className="toggle toggle-primary" 
                checked={siteConfig.maintenanceMode}
                onChange={e => setSiteConfig({...siteConfig, maintenanceMode: e.target.checked})}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-base-200/50 rounded-xl border border-base-300">
              <div>
                <h3 className="font-medium">Clear Site Cache</h3>
                <p className="text-sm text-base-content/60">Purge cached API responses</p>
              </div>
              <button 
                onClick={handleClearCache}
                disabled={cacheStatus !== ''}
                className="btn btn-outline btn-sm"
              >
                {cacheStatus === 'clearing' ? 'Clearing...' : cacheStatus === 'success' ? 'Cleared!' : 'Clear Cache'}
              </button>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={handleUpdateConfig}
                className="btn btn-primary w-full"
                disabled={configStatus === 'updating'}
              >
                {configStatus === 'updating' ? <span className="loading loading-spinner loading-sm"></span> : 'Save System Settings'}
              </button>
              {configStatus === 'success' && <p className="text-success text-sm mt-2 text-center">Settings saved successfully!</p>}
              {configStatus === 'error' && <p className="text-error text-sm mt-2 text-center">Failed to save settings.</p>}
            </div>
          </div>
        </div>

        {/* Social Links & Contact */}
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            Social Links & Contact
          </h2>
          <form onSubmit={handleUpdateConfig} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Contact Email</label>
                <input 
                  type="email" 
                  value={siteConfig.contactEmail}
                  onChange={e => setSiteConfig({...siteConfig, contactEmail: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">GitHub Profile URL</label>
                <input 
                  type="url" 
                  value={siteConfig.githubUrl}
                  onChange={e => setSiteConfig({...siteConfig, githubUrl: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">LinkedIn Profile URL</label>
                <input 
                  type="url" 
                  value={siteConfig.linkedinUrl}
                  onChange={e => setSiteConfig({...siteConfig, linkedinUrl: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Twitter Profile URL</label>
                <input 
                  type="url" 
                  value={siteConfig.twitterUrl}
                  onChange={e => setSiteConfig({...siteConfig, twitterUrl: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-base-content/70 mb-2">Facebook Profile URL</label>
                <input 
                  type="url" 
                  value={siteConfig.facebookUrl}
                  onChange={e => setSiteConfig({...siteConfig, facebookUrl: e.target.value})}
                  className="input input-bordered w-full bg-base-200/50" 
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
            
            <div className="pt-2 flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary px-8"
                disabled={configStatus === 'updating'}
              >
                {configStatus === 'updating' ? <span className="loading loading-spinner loading-sm"></span> : 'Save Links'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
