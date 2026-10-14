import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [group, setGroup] = useState('');
  const [items, setItems] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const data = await api.getSkills();
      setSkills(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill = null) => {
    if (skill) {
      setEditingId(skill.id);
      setGroup(skill.group || '');
      setItems((skill.items || []).join(', '));
    } else {
      setEditingId(null);
      setGroup('');
      setItems('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillData = { 
      group, 
      items: items.split(',').map(i => i.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await api.updateSkill(editingId, skillData);
      } else {
        await api.createSkill(skillData);
      }
      closeModal();
      fetchSkills();
    } catch (err) {
      alert('Error saving skill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill group?')) {
      try {
        await api.deleteSkill(id);
        fetchSkills();
      } catch (err) {
        alert('Error deleting skill');
      }
    }
  };

  if (loading) return <div>Loading skills...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display truncate pr-2">Skills Groups</h1>
        <button onClick={() => openModal()} className="btn btn-primary btn-sm sm:btn-md shrink-0 gap-2">
          <Plus size={18} /> Add Skill Group
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300 shadow-sm w-full">
        <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Skills in Group</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-8 text-base-content/60">No skills found.</td>
              </tr>
            ) : skills.map(s => (
              <tr key={s.id}>
                <td className="font-medium whitespace-nowrap">{s.group}</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {(s.items || []).map((item, i) => (
                      <span key={i} className="badge badge-sm badge-outline">{item}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(s)} className="btn btn-sm btn-ghost btn-square">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-ghost btn-square text-error">
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
            <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Skill Group' : 'New Skill Group'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Skill Group Name</span></label>
                <input type="text" value={group} onChange={e => setGroup(e.target.value)} className="input input-bordered w-full" placeholder="e.g. Frontend Web Development" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Skills (comma separated)</span></label>
                <textarea value={items} onChange={e => setItems(e.target.value)} className="textarea textarea-bordered w-full h-24" placeholder="React, Next JS, Tailwind" required />
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
