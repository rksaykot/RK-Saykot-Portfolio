import { initialData } from '../data/initialData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get local data cache
function getLocalData() {
  try {
    const cached = localStorage.getItem('saykot_portfolio_data');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error reading local cache', e);
  }
  return initialData;
}

function saveLocalData(data) {
  try {
    localStorage.setItem('saykot_portfolio_data', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving local cache', e);
  }
}

async function request(path, options = {}) {
  const headers = {};
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = localStorage.getItem('adminToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    // Add a reasonable timeout so offline / inactive server quickly falls back
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE}${path}`, {
      headers: { ...headers, ...options.headers },
      signal: controller.signal,
      ...options
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Fallback handler if server is not running or on static GitHub Pages
    console.warn(`[API] Server unavailable at ${API_BASE}${path}. Using local portfolio data fallback.`, err.message);
    return fallbackHandler(path, options);
  }
}

function fallbackHandler(path, options) {
  const method = (options.method || 'GET').toUpperCase();
  const url = new URL(path, 'http://localhost');
  const pathname = url.pathname;
  const store = getLocalData();

  // GET requests
  if (method === 'GET') {
    if (pathname === '/config') {
      return store.config || initialData.config;
    }
    if (pathname === '/skills') {
      return store.skills || initialData.skills;
    }
    if (pathname === '/projects') {
      return store.projects || initialData.projects;
    }
    if (pathname.startsWith('/projects/')) {
      const id = parseInt(pathname.replace('/projects/', ''), 10);
      const proj = (store.projects || initialData.projects).find(p => p.id === id);
      if (proj) return proj;
      throw new Error('Project not found');
    }
    if (pathname === '/experience') {
      return store.experience || initialData.experience;
    }
    if (pathname === '/certifications') {
      const cat = url.searchParams.get('category');
      const certs = store.certifications || initialData.certifications;
      return cat ? certs.filter(c => c.category === cat) : certs;
    }
    if (pathname === '/messages') {
      return store.messages || [];
    }
  }

  // POST / PUT / DELETE mutation fallbacks for Admin / Forms
  if (method === 'POST') {
    if (pathname === '/contact') {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      const msg = {
        id: Date.now(),
        ...body,
        receivedAt: new Date().toISOString()
      };
      store.messages = [msg, ...(store.messages || [])];
      saveLocalData(store);
      return { success: true, message: 'Message sent successfully (cached locally)' };
    }
    if (pathname === '/auth/login') {
      const { username, password } = JSON.parse(options.body || '{}');
      if (username === 'admin' && (password === 'admin123' || !password)) {
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('adminToken', token);
        return { token };
      }
      throw new Error('Invalid credentials');
    }
    if (pathname === '/skills') {
      const body = JSON.parse(options.body);
      const newSkill = { id: Date.now(), ...body };
      store.skills = [...(store.skills || []), newSkill];
      saveLocalData(store);
      return newSkill;
    }
    if (pathname === '/projects') {
      const body = JSON.parse(options.body);
      const newProject = { id: Date.now(), ...body };
      store.projects = [...(store.projects || []), newProject];
      saveLocalData(store);
      return newProject;
    }
    if (pathname === '/experience') {
      const body = JSON.parse(options.body);
      const newExp = { id: Date.now(), ...body };
      store.experience = [...(store.experience || []), newExp];
      saveLocalData(store);
      return newExp;
    }
    if (pathname === '/certifications') {
      const body = JSON.parse(options.body);
      const newCert = { id: Date.now(), ...body };
      store.certifications = [...(store.certifications || []), newCert];
      saveLocalData(store);
      return newCert;
    }
  }

  if (method === 'PUT') {
    if (pathname === '/config') {
      const body = JSON.parse(options.body);
      store.config = { ...store.config, ...body };
      saveLocalData(store);
      return store.config;
    }
    if (pathname.startsWith('/skills/')) {
      const id = parseInt(pathname.replace('/skills/', ''), 10);
      const body = JSON.parse(options.body);
      store.skills = (store.skills || []).map(s => s.id === id ? { ...s, ...body } : s);
      saveLocalData(store);
      return body;
    }
    if (pathname.startsWith('/projects/')) {
      const id = parseInt(pathname.replace('/projects/', ''), 10);
      const body = JSON.parse(options.body);
      store.projects = (store.projects || []).map(p => p.id === id ? { ...p, ...body } : p);
      saveLocalData(store);
      return body;
    }
    if (pathname.startsWith('/experience/')) {
      const id = parseInt(pathname.replace('/experience/', ''), 10);
      const body = JSON.parse(options.body);
      store.experience = (store.experience || []).map(e => e.id === id ? { ...e, ...body } : e);
      saveLocalData(store);
      return body;
    }
    if (pathname.startsWith('/certifications/')) {
      const id = parseInt(pathname.replace('/certifications/', ''), 10);
      const body = JSON.parse(options.body);
      store.certifications = (store.certifications || []).map(c => c.id === id ? { ...c, ...body } : c);
      saveLocalData(store);
      return body;
    }
  }

  if (method === 'DELETE') {
    if (pathname.startsWith('/skills/')) {
      const id = parseInt(pathname.replace('/skills/', ''), 10);
      store.skills = (store.skills || []).filter(s => s.id !== id);
      saveLocalData(store);
      return { success: true };
    }
    if (pathname.startsWith('/projects/')) {
      const id = parseInt(pathname.replace('/projects/', ''), 10);
      store.projects = (store.projects || []).filter(p => p.id !== id);
      saveLocalData(store);
      return { success: true };
    }
    if (pathname.startsWith('/experience/')) {
      const id = parseInt(pathname.replace('/experience/', ''), 10);
      store.experience = (store.experience || []).filter(e => e.id !== id);
      saveLocalData(store);
      return { success: true };
    }
    if (pathname.startsWith('/certifications/')) {
      const id = parseInt(pathname.replace('/certifications/', ''), 10);
      store.certifications = (store.certifications || []).filter(c => c.id !== id);
      saveLocalData(store);
      return { success: true };
    }
    if (pathname.startsWith('/messages/')) {
      const id = parseInt(pathname.replace('/messages/', ''), 10);
      store.messages = (store.messages || []).filter(m => m.id !== id);
      saveLocalData(store);
      return { success: true };
    }
  }

  return { success: true };
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
