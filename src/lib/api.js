const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const headers = {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...headers, ...options.headers },
    ...options
  });
  
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getConfig: () => request('/config'),
  updateConfig: (data) => request('/config', { method: 'PUT', body: JSON.stringify(data) }),
  
  getSkills: () => request('/skills'),
  createSkill: (data) => request('/skills', { method: 'POST', body: JSON.stringify(data) }),
  updateSkill: (id, data) => request(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),

  getProjects: () => request('/projects'),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  getExperience: () => request('/experience'),
  createExperience: (data) => request('/experience', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id, data) => request(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id) => request(`/experience/${id}`, { method: 'DELETE' }),

  getCertifications: (category) =>
    request(`/certifications${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  createCertification: (data) => request('/certifications', { method: 'POST', body: JSON.stringify(data) }),
  updateCertification: (id, data) => request(`/certifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertification: (id) => request(`/certifications/${id}`, { method: 'DELETE' }),

  sendContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),
  getMessages: () => request('/messages'),
  deleteMessage: (id) => request(`/messages/${id}`, { method: 'DELETE' }),

  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  updateCredentials: (username, password) => request('/auth/credentials', { method: 'PUT', body: JSON.stringify({ username, password }) }),

  uploadFile: (formData) => request('/upload', { method: 'POST', body: formData })
};
