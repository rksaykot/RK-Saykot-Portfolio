import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Code2, GraduationCap, Award, MessageSquare, Settings, LogOut, Home, Menu, X, MonitorPlay } from 'lucide-react';

export default function AdminLayout() {
  const token = localStorage.getItem('adminToken');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Homepage', path: '/admin/homepage', icon: MonitorPlay },
    { name: 'Projects', path: '/admin/projects', icon: Code2 },
    { name: 'Skills', path: '/admin/skills', icon: Briefcase },
    { name: 'Experience', path: '/admin/experience', icon: GraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Config', path: '/admin/config', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-base-200 relative">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between p-4 bg-base-100 border-b border-base-300">
        <h2 className="font-display text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-base-content rounded-lg hover:bg-base-200">
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 border-r border-base-300 flex flex-col h-screen
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:sticky md:top-0 md:translate-x-0
      `}>
        <div className="p-4 md:p-6 border-b border-base-300 flex justify-between items-center">
          <h2 className="font-display text-xl font-bold">Admin Panel</h2>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-2 -mr-2 text-base-content rounded-lg hover:bg-base-200">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors flex-shrink-0 ${
                  isActive
                    ? 'bg-primary text-primary-content font-medium'
                    : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-base-300 flex flex-col gap-2">
          <Link
            to="/"
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-base-content/70 hover:bg-base-200 hover:text-base-content transition-colors mb-1"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-base-200 w-full">
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
