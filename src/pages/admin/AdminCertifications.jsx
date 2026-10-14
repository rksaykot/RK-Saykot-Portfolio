import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminCertifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [credential, setCredential] = useState('');
  const [institute, setInstitute] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const data = await api.getCertifications();
      setCerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert = null) => {
    if (cert) {
      setEditingId(cert.id);
      setCredential(cert.credential || '');
      setInstitute(cert.institute || '');
      setCategory(cert.category || '');
    } else {
      setEditingId(null);
      setCredential('');
      setInstitute('');
      setCategory('Educational'); // default
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const certData = { credential, institute, category };

    try {
      if (editingId) {
        await api.updateCertification(editingId, certData);
      } else {
        await api.createCertification(certData);
      }
      closeModal();
      fetchCerts();
    } catch (err) {
      alert('Error saving certification');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        await api.deleteCertification(id);
        fetchCerts();
      } catch (err) {
        alert('Error deleting certification');
      }
    }
  };

  if (loading) return <div>Loading certifications...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-3xl font-bold font-display truncate pr-2">Certifications</h1>
        <button onClick={() => openModal()} className="btn btn-primary btn-sm sm:btn-md shrink-0 gap-1">
          <Plus size={18} /> Add Certification
        </button>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-300 shadow-sm w-full">
        <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Credential</th>
              <th>Institute</th>
              <th>Category</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-base-content/60">No certifications found.</td>
              </tr>
            ) : certs.map(c => (
              <tr key={c.id}>
                <td className="font-medium">{c.credential}</td>
                <td>{c.institute}</td>
                <td><span className="badge badge-sm">{c.category}</span></td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(c)} className="btn btn-sm btn-ghost btn-square">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-ghost btn-square text-error">
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
          <div className="modal-box max-w-md">
            <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Certification' : 'New Certification'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label"><span className="label-text">Credential / Title</span></label>
                <input type="text" value={credential} onChange={e => setCredential(e.target.value)} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Institute Name</span></label>
                <input type="text" value={institute} onChange={e => setInstitute(e.target.value)} className="input input-bordered w-full" required />
              </div>
              <div>
                <label className="label"><span className="label-text">Category</span></label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="select select-bordered w-full" required>
                  <option value="Educational">Educational</option>
                  <option value="Technical">Technical</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
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
