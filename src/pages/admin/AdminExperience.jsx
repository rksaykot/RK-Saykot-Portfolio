import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminExperience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [period, setPeriod] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const data = await api.getExperience();
      setExperience(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exp = null) => {
    if (exp) {
      setEditingId(exp.id);
      setCompany(exp.org || '');
      setRole(exp.role || '');
      setPeriod(exp.period || '');
      setDescription((exp.description || []).join('\n'));
    } else {
      setEditingId(null);
      setCompany('');
      setRole('');
      setPeriod('');
      setDescription('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expData = {
      org: company,
      role,
      period,
      description: description.split('\n').map(d => d.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await api.updateExperience(editingId, expData);
      } else {
        await api.createExperience(expData);
      }
      closeModal();
      fetchExperience();
    } catch (err) {
      alert('Error saving experience');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await api.deleteExperience(id);
        fetchExperience();
      } catch (err) {
        alert('Error deleting experience');
      }
    }
  };

  if (loading) return <div>Loading experience...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display truncate pr-2">Experience</h1>
        <button onClick={() => openModal()} className="btn btn-primary btn-sm sm:btn-md shrink-0 gap-2">
          <Plus size={18} /> Add Experience
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300 shadow-sm w-full">
        <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Role</th>
              <th>Company</th>
              <th>Period</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experience.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-base-content/60">No experience records found.</td>
              </tr>
            ) : experience.map(e => (
              <tr key={e.id}>
                <td className="font-medium">{e.role}</td>
                <td>{e.org}</td>
                <td>{e.period}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(e)} className="btn btn-sm btn-ghost btn-square">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(e.id)} className="btn btn-sm btn-ghost btn-square text-error">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Experience' : 'New Experience'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Company Name</span></label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Role</span></label>
                <input type="text" value={role} onChange={e => setRole(e.target.value)} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Period</span></label>
                <input type="text" value={period} onChange={e => setPeriod(e.target.value)} className="input input-bordered w-full" placeholder="e.g. 2021 - Present" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Description (one bullet point per line)</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="textarea textarea-bordered w-full h-32" required />
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
