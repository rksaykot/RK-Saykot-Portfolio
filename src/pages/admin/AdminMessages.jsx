import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Trash2, Eye, X } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await api.getMessages();
      setMessages(data.reverse()); // Show newest first
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.deleteMessage(id);
        fetchMessages();
      } catch (err) {
        alert('Error deleting message');
      }
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold font-display mb-8">Messages</h1>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-base-100 p-8 rounded-2xl border border-base-300 text-center text-base-content/60">
            No messages yet.
          </div>
        ) : messages.map(m => (
          <div key={m.id} className="bg-base-100 p-4 md:p-6 rounded-2xl border border-base-300 shadow-sm relative pr-10 md:pr-14">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-1 md:gap-4">
              <div>
                <h3 className="font-bold text-base md:text-lg">{m.firstName} {m.lastName}</h3>
                <p className="text-xs md:text-sm text-base-content/60">{m.email}</p>
              </div>
              <div className="text-[10px] md:text-xs text-base-content/40 mr-16 md:mr-24 mt-1 md:mt-2">
                {new Date(m.receivedAt).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-base-200/50 p-3 md:p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-2">{m.subject}</h4>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words line-clamp-2">{m.message}</p>
            </div>

            <div className="absolute top-4 right-2 md:top-6 md:right-4 flex items-center gap-1">
              <button 
                onClick={() => setSelectedMessage(m)}
                className="btn btn-sm btn-ghost btn-square text-base-content/70 hover:text-primary"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={() => handleDelete(m.id)}
                className="btn btn-sm btn-ghost btn-square text-error"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
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
                <span className="text-xs font-bold uppercase text-base-content/50">Subject</span>
                <p className="text-sm font-medium">{selectedMessage.subject}</p>
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
