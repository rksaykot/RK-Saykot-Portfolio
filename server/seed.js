// Seeds the database with Saykot's real profile data.
// Run with: npm run seed
import { db, initDb } from './db.js';

const certifications = [
  { id: 1, institute: 'Barisal Polytechnic Institute (BPI)', credential: 'Diploma in Computer Science & Technology', category: 'Educational' },
  { id: 2, institute: 'Gazipur Govt. Technical School & College', credential: 'Secondary School Certificate (S.S.C)', category: 'Educational' },
  { id: 3, institute: 'Kachiyabunia High School', credential: 'Junior School Certificate (J.S.C)', category: 'Educational' },
  { id: 4, institute: 'PSTU (EDGE)', credential: 'Front End Development', category: 'Technical' },
  { id: 5, institute: 'Montage Training Center', credential: 'Civil Engineering Training', category: 'Technical' },
  { id: 6, institute: 'Mizan\'s Care', credential: 'Spoken English Course', category: 'Other' }
];

const skills = [
  { id: 1, group: 'Frontend Web Development', items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React JS', 'Next JS', 'TypeScript', 'Responsive & Mobile-First Design', 'WordPress', 'CMS Platforms'] },
  { id: 2, group: 'Backend Web Development', items: ['Node.js', 'Express.js', 'MySQL', 'RESTful APIs', 'Firebase', 'Git / Version Control'] },
  { id: 3, group: 'Programming', items: ['Python Programming', 'Java Programming', 'Kotlin'] },
  { id: 4, group: 'Design & Tools', items: ['Adobe Photoshop & Illustrator', 'UI/UX Design Fundamentals', 'Graphics Design'] },
  { id: 5, group: 'Office & Computer', items: ['Microsoft Office Suite (Word, Excel, PowerPoint)', 'Typing Speed: 75 WPM', 'Hardware & OS Installation'] },
  { id: 6, group: 'Communication Skills', items: ['Strong Communication Skills', 'Bilingual (English & Bengali)', 'Team Leadership'] },
];

const experience = [
  {
    id: 1,
    role: 'Freelance Web Developer',
    org: 'Multiple Companies & Clients',
    period: '2023 – Present',
    type: 'Contract-Based',
    description: 'Delivered custom websites and web applications for local businesses and organizations. Developed responsive user interfaces using React, Tailwind CSS, JavaScript, and PHP. Configured domains, hosting environments, email services, and website security. Provided maintenance, bug fixing, and performance optimization services.',
    skills: ['React', 'Tailwind CSS', 'JavaScript', 'PHP']
  },
  {
    id: 2,
    role: 'Academic Tutor',
    org: 'Private / Online Tutoring',
    period: '2023 – Present',
    type: 'Freelance',
    description: 'Conduct private and online tutoring sessions for Mathematics, Science, and ICT subjects. Help students understand core academic concepts, prepare for examinations, and improve their general academic performance.',
    skills: ['Mathematics', 'Science', 'ICT', 'Teaching']
  },
  {
    id: 3,
    role: 'Diploma in Engineering',
    org: 'Barisal Polytechnic Institute',
    period: 'Session: 2022–23',
    type: 'Education',
    description: 'Computer Science & Technology.',
    skills: []
  },
  {
    id: 4,
    role: 'Secondary School Certificate (S.S.C)',
    org: 'Gazipur Govt. Technical School & College',
    period: 'Passing Year: 2022',
    type: 'Education',
    description: 'Building Maintenance (1st Shift). GPA: 4.86',
    skills: []
  }
];

const projects = [
  {
    id: 1,
    name: 'Student Management System',
    type: 'Web App',
    description: 'A comprehensive system to manage student data and records.',
    tech: ['PHP', 'CSS3', 'JavaScript (ES6+)', 'Tailwind CSS', 'Daisy UI', 'MySQL', 'Git / Version Control'],
    links: { demo: 'https://student-managemant-system.free.nf/', github: 'https://github.com/rksaykot/Student-Management-System' }
  },
  {
    id: 2,
    name: 'Banglar Bagh Foundation',
    type: 'Website',
    description: 'Responsive foundation website with a focus on organization visibility.',
    tech: ['PHP', 'CSS3', 'JavaScript (ES6+)', 'Tailwind CSS', 'Daisy UI', 'MySQL'],
    links: { demo: 'https://www.banglarbagh.org/', github: '' }
  },
  {
    id: 3,
    name: 'Qadr Media & Communications Ltd.',
    type: 'Website',
    description: 'Official responsive website for Qadr Media & Communications Ltd.',
    tech: ['HTML', 'CSS3', 'JavaScript (ES6+)', 'Tailwind CSS', 'Daisy UI', 'MySQL'],
    links: { demo: 'https://qadrmcl.com/', github: '' }
  },
  {
    id: 4,
    name: 'People E Sheba',
    type: 'Web App',
    description: 'A React-based community services platform.',
    tech: ['React JS', 'Node JS', 'MySQL', 'Tailwind CSS', 'Daisy UI', 'Git / Version Control'],
    links: { demo: 'https://people-esheba.vercel.app/', github: 'https://github.com/rksaykot/people-esheba' }
  },
  {
    id: 5,
    name: 'My Messenger',
    type: 'Web & Mobile App',
    description: 'A real-time messaging application featuring secure authentication, live chat, friend requests, voice/video calling, and push notifications.',
    tech: ['Next.js', 'Android Studio', 'Capacitor', 'Google Firebase', 'Tailwind CSS', 'TypeScript'],
    links: { demo: 'https://my-messenger-web.vercel.app/', github: 'https://github.com/rksaykot/My_Messenger' }
  },
  {
    id: 6,
    name: 'My Reminder',
    type: 'Mobile App',
    description: 'A handy reminder application to keep track of tasks and schedules.',
    tech: ['React Native', 'Node JS', 'Google Firebase'],
    links: { apk: '/My Messenger_v1.4.apk', github: 'https://github.com/rksaykot/My_Reminder' }
  }
];

async function seed() {
  await initDb();
  db.data.skills = skills;
  db.data.projects = projects;
  db.data.experience = experience;
  db.data.certifications = certifications;
  db.data.messages = db.data.messages || [];
  await db.write();
  console.log(`Seeded: ${skills.length} skill groups, ${projects.length} projects, ${experience.length} experience entries, ${certifications.length} certifications.`);
}

seed();

