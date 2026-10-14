import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tech, setTech] = useState('');
  const [demoLink, setDemoLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [apkLink, setApkLink] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setTitle(project.name || '');
      setDescription(project.description || '');
      setTech((project.tech || []).join(', '));
      setDemoLink(project.links?.demo || '');
      setGithubLink(project.links?.github || '');
      setApkLink(project.links?.apk || '');
    } else {
      setEditingId(null);
      setTitle('');
      setDescription('');
      setTech('');
      setDemoLink('');
      setGithubLink('');
      setApkLink('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      name: title,
      description,
      tech: tech.split(',').map(t => t.trim()).filter(Boolean),
      links: { demo: demoLink, github: githubLink, apk: apkLink }
    };

    try {
      if (editingId) {
        await api.updateProject(editingId, projectData);
      } else {
        await api.createProject(projectData);
      }
      closeModal();
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
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
      setApkLink(baseUrl + res.url);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        fetchProjects();
      } catch (err) {
        alert('Error deleting project');
      }
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display truncate pr-2">Projects</h1>
        <button onClick={() => openModal()} className="btn btn-primary btn-sm sm:btn-md shrink-0 gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300 shadow-sm w-full">
        <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech Stack</th>
              <th>Link</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-base-content/60">No projects found.</td>
              </tr>
            ) : projects.map(p => (
              <tr key={p.id}>
                <td className="font-medium">{p.name}</td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {(p.tech || []).map((t, i) => (
                      <span key={i} className="badge badge-sm badge-outline">{t}</span>
                    ))}
                  </div>
                </td>
                <td>
                  {p.links?.demo && <a href={p.links.demo} target="_blank" rel="noreferrer" className="block text-primary hover:underline text-sm">Demo</a>}
                  {p.links?.github && <a href={p.links.github} target="_blank" rel="noreferrer" className="block text-primary hover:underline text-sm">GitHub</a>}
                  {p.links?.apk && <a href={p.links.apk} target="_blank" rel="noreferrer" className="block text-primary hover:underline text-sm">APK</a>}
                  {(!p.links?.demo && !p.links?.github && !p.links?.apk) && 'N/A'}
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(p)} className="btn btn-sm btn-ghost btn-square">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-ghost btn-square text-error">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Project' : 'New Project'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Title</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Description</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="textarea textarea-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Tech Stack (comma separated)</span></label>
                <input type="text" value={tech} onChange={e => setTech(e.target.value)} className="input input-bordered w-full" placeholder="React, Node.js, Tailwind" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label"><span className="label-text">Demo URL</span></label>
                  <input type="url" value={demoLink} onChange={e => setDemoLink(e.target.value)} className="input input-bordered w-full" placeholder="https://" />
                </div>
                <div>
                  <label className="label"><span className="label-text">GitHub URL</span></label>
                  <input type="url" value={githubLink} onChange={e => setGithubLink(e.target.value)} className="input input-bordered w-full" placeholder="https://github.com/..." />
                </div>
              </div>
              <div>
                <label className="label"><span className="label-text">APK Download URL (Upload an APK)</span></label>
                <div className="flex gap-2">
                  <input type="text" value={apkLink} onChange={e => setApkLink(e.target.value)} className="input input-bordered w-full" placeholder="/app.apk" />
                  <label className={`btn ${isUploading ? 'btn-disabled' : 'btn-outline'}`}>
                    {isUploading ? '...' : 'Upload'}
                    <input type="file" accept=".apk" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
              <div className="modal-action">
                <button type="button" onClick={closeModal} className="btn">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
