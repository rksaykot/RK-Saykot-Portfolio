import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SiteLoader from './components/SiteLoader';
import RouteProgress from './components/RouteProgress';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import Certification from './pages/Certification';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Maintenance from './pages/Maintenance';
import { api } from './lib/api';
import { useState, useEffect } from 'react';

// Admin imports
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminCertifications from './pages/admin/AdminCertifications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminConfig from './pages/admin/AdminConfig';

function App() {
  const { pathname } = useLocation();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    api.getConfig().then(setConfig).catch(console.error);
  }, []);

  if (config && config.maintenanceMode) {
    return <Maintenance />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
      <SiteLoader />
      <RouteProgress />
      <ScrollToTop />
      <Navbar />
      {/* key={pathname} forces the fade-in animation to replay on every route change */}
      <main key={pathname} className="page-enter flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Exclude Footer from Admin Routes */}
      {!pathname.startsWith('/admin') && <Footer />}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="certifications" element={<AdminCertifications />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="config" element={<AdminConfig />} />
      </Route>
      <Route path="/*" element={<App />} />
    </Routes>
  );
}
