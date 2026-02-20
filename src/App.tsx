import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, History, Bell, LogOut, Menu, X, User as UserIcon, Upload, Key, FileText, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser, useClerk } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import Scan from './pages/Scan';
import HistoryPage from './pages/History';
import BulkUpload from './pages/BulkUpload';
import Alerts from './pages/Alerts';
import ApiKeys from './pages/ApiKeys';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Background3D from './components/Background3D';
import { User } from './types';

const CLERK_PUBLISHABLE_KEY = (import.meta as any).env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <div className="w-full relative z-10">{children}</div>;
}

function Sidebar() {
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Command Center' },
    { path: '/scan', icon: Search, label: 'Threat Scanner' },
    { path: '/bulk', icon: Upload, label: 'Batch Analysis' },
    { path: '/history', icon: History, label: 'Audit Logs' },
    { path: '/alerts', icon: Bell, label: 'Security Alerts' },
    { path: '/api-keys', icon: Key, label: 'API Management' },
    { path: '/reports', icon: FileText, label: 'Intelligence' },
    { path: '/settings', icon: SettingsIcon, label: 'Configuration' },
  ];

  return (
    <aside className="w-72 h-screen sticky top-0 bg-slate-900/40 backdrop-blur-2xl border-r border-white/5 flex flex-col z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-display font-bold tracking-tight text-white leading-none">SecureScan</span>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-inner'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="font-semibold text-sm tracking-tight">{item.label}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-4 px-4 py-4 mb-4 glass rounded-2xl border-white/5">
          <UserButton 
            afterSignOutUrl="/login"
            appearance={{
              elements: {
                userButtonAvatarBox: "w-10 h-10 rounded-xl",
                userButtonTrigger: "focus:shadow-none"
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.firstName || 'User'}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Admin Access</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all duration-300 font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Background3D />
        <SmoothScroll>
          <div className="flex min-h-screen">
            <SignedIn>
              <Sidebar />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/scan" element={<Scan />} />
                  <Route path="/bulk" element={<BulkUpload />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/api-keys" element={<ApiKeys />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </SignedIn>
            <SignedOut>
              <div className="w-full flex items-center justify-center min-h-screen p-4">
                <Routes>
                  <Route path="/login" element={<SignIn routing="path" path="/login" signUpUrl="/register" />} />
                  <Route path="/register" element={<SignUp routing="path" path="/register" signInUrl="/login" />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </SignedOut>
          </div>
        </SmoothScroll>
      </Router>
    </ClerkProvider>
  );
}
