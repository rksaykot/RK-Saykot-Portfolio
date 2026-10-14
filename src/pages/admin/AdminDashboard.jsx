import { useState, useEffect } from 'react';
import { Eye, X } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [data, setData] = useState({
    projects: [],
    messages: [],
    skills: [],
    experience: [],
    certifications: []
  });
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projects, messages, skills, experience, certs] = await Promise.all([
          api.getProjects(),
          api.getMessages(),
          api.getSkills(),
          api.getExperience(),
          api.getCertifications()
        ]);
        setData({
          projects,
          messages,
          skills,
          experience,
          certifications: certs
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <h3 className="text-sm font-mono uppercase text-base-content/60 mb-2">Total Projects</h3>
          <p className="text-3xl font-bold">{data.projects.length}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <h3 className="text-sm font-mono uppercase text-base-content/60 mb-2">Total Messages</h3>
          <p className="text-3xl font-bold">{data.messages.length}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <h3 className="text-sm font-mono uppercase text-base-content/60 mb-2">Experience Entries</h3>
          <p className="text-3xl font-bold">{data.experience.length}</p>
        </div>
        <div className="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-sm">
          <h3 className="text-sm font-mono uppercase text-base-content/60 mb-2">Certifications</h3>
          <p className="text-3xl font-bold">{data.certifications.length}</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col w-full">
          <div className="p-4 border-b border-base-300 bg-base-200/50">
            <h2 className="font-bold font-display">Recent Messages</h2>
          </div>
          <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto max-h-72">
            {data.messages.length === 0 && <p className="text-base-content/50 text-sm">No messages yet.</p>}
            {data.messages.slice(-6).reverse().map(m => (
              <div key={m.id} className="flex justify-between items-center bg-base-200 p-3 rounded-xl gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{m.firstName} {m.lastName}</div>
                  <div className="text-xs text-base-content/60 truncate">{m.message}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-base-content/40 whitespace-nowrap hidden sm:inline">{new Date(m.receivedAt).toLocaleDateString()}</span>
                  <button onClick={() => setSelectedMessage(m)} className="btn btn-ghost btn-sm btn-circle hover:bg-base-300">
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-base-300 bg-base-200/50">
              <h2 className="font-bold font-display">Recent Projects</h2>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto max-h-64">
              {data.projects.length === 0 && <p className="text-base-content/50 text-sm">No projects yet.</p>}
              {data.projects.slice(-4).reverse().map(p => (
                <div key={p.id} className="flex justify-between items-center bg-base-200 p-3 rounded-xl">
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-base-content/60 truncate max-w-[200px] ml-4 text-right">{p.tech}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-base-300 bg-base-200/50">
              <h2 className="font-bold font-display">Recent Experience</h2>
            </div>
            <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto max-h-64">
              {data.experience.length === 0 && <p className="text-base-content/50 text-sm">No experience entries yet.</p>}
              {data.experience.slice(-4).reverse().map(e => (
                <div key={e.id} className="flex justify-between items-center bg-base-200 p-3 rounded-xl">
                  <span className="font-medium text-sm">{e.role}</span>
                  <span className="text-xs text-base-content/60 truncate max-w-[200px] ml-4 text-right">{e.org}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedMessage && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4 flex justify-between items-center">
              Message Details
              <button onClick={() => setSelectedMessage(null)} className="btn btn-ghost btn-sm btn-circle">
                <X size={20} />
              </button>
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-base-content/50">From</span>
                <p className="font-medium">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                <p className="text-sm text-base-content/70">{selectedMessage.email}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-base-content/50">Date</span>
                <p className="text-sm">{new Date(selectedMessage.receivedAt).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-base-content/50">Message</span>
                <div className="p-4 bg-base-200 rounded-lg text-sm mt-1 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedMessage(null)}>Close</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setSelectedMessage(null)}></div>
        </div>
      )}
    </div>
  );
}
