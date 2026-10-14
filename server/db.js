import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');

// Ensure the data directory exists, otherwise Render will crash because Git ignores empty directories
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const file = path.join(dataDir, 'db.json');

const defaultData = {
  skills: [],
  projects: [],
  experience: [],
  certifications: [],
  messages: [],
  config: {
    heroTitle: "RK Saykot — Full-Stack Developer",
    heroSubtitle: "Building software, on purpose.",
    aboutBio: "I'm RK Saykot — a freelance web developer and a Computer Engineering student living in Dhaka.",
    contactLocation: "Dhaka",
    socialLinks: {
      github: "https://github.com/rksaykot999",
      linkedin: "https://linkedin.com/in/rksaykot"
    }
  },
  adminCredentials: {
    username: "admin",
    password: "admin123"
  }
};

const adapter = new JSONFile(file);
export const db = new Low(adapter, defaultData);

export async function initDb() {
  await db.read();
  db.data ||= defaultData;
  await db.write();
}
