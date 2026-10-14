import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, initDb } from './db.js';
import { sendContactEmail } from './mailer.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

dotenv.config();

// Initialize Firebase Admin (Uses GOOGLE_APPLICATION_CREDENTIALS from .env if provided)
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
} catch (error) {
  console.log('Firebase Admin initialized without explicit credentials or already initialized.');
}

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Multer Setup for File Uploads
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'))
  }
});
const upload = multer({ storage: storage });

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ── Authentication Middleware ──
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Try to verify as a Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (firebaseError) {
    // Fallback for custom JWT token if Firebase fails
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Forbidden' });
      req.user = user;
      next();
    });
  }
}

// ── Auth ──
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const validUsername = db.data.adminCredentials?.username || 'admin';
  const validPassword = db.data.adminCredentials?.password || 'admin123';
  
  if (username === validUsername && password === validPassword) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.put('/api/auth/credentials', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  
  await db.read();
  db.data.adminCredentials = { username, password };
  await db.write();
  res.json({ success: true });
});

// ── Upload ──
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// ── Config ──
app.get('/api/config', async (req, res) => {
  await db.read();
  res.json(db.data.config || {});
});

app.put('/api/config', authenticateToken, async (req, res) => {
  await db.read();
  db.data.config = { ...db.data.config, ...req.body };
  await db.write();
  res.json(db.data.config);
});

// ── Skills ──
app.get('/api/skills', async (req, res) => {
  await db.read();
  res.json(db.data.skills);
});

app.post('/api/skills', authenticateToken, async (req, res) => {
  await db.read();
  const newItem = { id: Date.now(), ...req.body };
  db.data.skills.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

app.put('/api/skills/:id', authenticateToken, async (req, res) => {
  await db.read();
  const index = db.data.skills.findIndex(s => s.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.data.skills[index] = { ...db.data.skills[index], ...req.body };
  await db.write();
  res.json(db.data.skills[index]);
});

app.delete('/api/skills/:id', authenticateToken, async (req, res) => {
  await db.read();
  db.data.skills = db.data.skills.filter(s => s.id !== Number(req.params.id));
  await db.write();
  res.json({ success: true });
});

// ── Projects ──
app.get('/api/projects', async (req, res) => {
  await db.read();
  res.json(db.data.projects);
});

app.get('/api/projects/:id', async (req, res) => {
  await db.read();
  const project = db.data.projects.find(p => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  res.json(project);
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  await db.read();
  const newItem = { id: Date.now(), ...req.body };
  db.data.projects.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  await db.read();
  const index = db.data.projects.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.data.projects[index] = { ...db.data.projects[index], ...req.body };
  await db.write();
  res.json(db.data.projects[index]);
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  await db.read();
  db.data.projects = db.data.projects.filter(p => p.id !== Number(req.params.id));
  await db.write();
  res.json({ success: true });
});

// ── Experience ──
app.get('/api/experience', async (req, res) => {
  await db.read();
  res.json(db.data.experience);
});

app.post('/api/experience', authenticateToken, async (req, res) => {
  await db.read();
  const newItem = { id: Date.now(), ...req.body };
  db.data.experience.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

app.put('/api/experience/:id', authenticateToken, async (req, res) => {
  await db.read();
  const index = db.data.experience.findIndex(e => e.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.data.experience[index] = { ...db.data.experience[index], ...req.body };
  await db.write();
  res.json(db.data.experience[index]);
});

app.delete('/api/experience/:id', authenticateToken, async (req, res) => {
  await db.read();
  db.data.experience = db.data.experience.filter(e => e.id !== Number(req.params.id));
  await db.write();
  res.json({ success: true });
});

// ── Certifications ──
app.get('/api/certifications', async (req, res) => {
  await db.read();
  const { category } = req.query;
  let certs = db.data.certifications;
  if (category) {
    certs = certs.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }
  res.json(certs);
});

app.post('/api/certifications', authenticateToken, async (req, res) => {
  await db.read();
  const newItem = { id: Date.now(), ...req.body };
  db.data.certifications.push(newItem);
  await db.write();
  res.status(201).json(newItem);
});

app.put('/api/certifications/:id', authenticateToken, async (req, res) => {
  await db.read();
  const index = db.data.certifications.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.data.certifications[index] = { ...db.data.certifications[index], ...req.body };
  await db.write();
  res.json(db.data.certifications[index]);
});

app.delete('/api/certifications/:id', authenticateToken, async (req, res) => {
  await db.read();
  db.data.certifications = db.data.certifications.filter(c => c.id !== Number(req.params.id));
  await db.write();
  res.json({ success: true });
});

// ── Contact form ──
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !email || !message) {
    return res.status(400).json({ error: 'First name, email, and message are required.' });
  }

  await db.read();
  const entry = {
    id: Date.now(),
    firstName,
    lastName: lastName || '',
    email,
    subject: subject || '(no subject)',
    message,
    receivedAt: new Date().toISOString()
  };
  db.data.messages.push(entry);
  await db.write();

  try {
    await sendContactEmail(entry);
  } catch (err) {
    console.warn('Email not sent:', err.message);
  }

  res.status(201).json({ message: 'Message received. Thank you for reaching out.' });
});

app.get('/api/messages', authenticateToken, async (req, res) => {
  await db.read();
  res.json(db.data.messages);
});

app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  await db.read();
  db.data.messages = db.data.messages.filter(m => m.id !== Number(req.params.id));
  await db.write();
  res.json({ success: true });
});

async function start() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

start();
