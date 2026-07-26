import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Terminal, Settings, CheckCircle2, HelpCircle, Bookmark, Sun, Moon } from 'lucide-react';
import { SystemHealthResponse } from 'shared';
import { apiService } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Sync theme icon in navbar
  useEffect(() => {
    const savedTheme = localStorage.getItem('projectpilot_theme') || 'dark';
    setTheme(savedTheme);
  }, [location]);

  const toggleNavbarTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('projectpilot_theme', nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark', 'amoled-black');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('amoled-black');
    }
  };

  const loadHealthData = async () => {
    // Read provider settings if any are set in settings page
    const prefProvider = localStorage.getItem('projectpilot_pref_provider') || undefined;
    const prefModel = localStorage.getItem('projectpilot_pref_model') || undefined;

    try {
      const response = await apiService.fetchHealth(prefProvider, prefModel);
      if (response.success) {
        setHealth(response.data);
      } else {
        setHealth(null);
      }
    } catch (e) {
      console.warn('[Navbar] Failed to fetch system health from backend:', e);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
    // Refresh backend health states periodically
    const interval = setInterval(loadHealthData, 15000);
    return () => clearInterval(interval);
  }, [location]); // Reload whenever route changes to get quick updates

  const getStatusBadge = () => {
    if (loading) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700 animate-pulse">
          Detecting AI...
        </span>
      );
    }

    if (!health) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-800/40">
          Server Offline
        </span>
      );
    }

    const provider = health.activeProvider;
    const model = health.selectedModel;

    if (provider === 'template') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-950/40 text-amber-400 border border-amber-800/40" title="Fallback Mode Active">
          <HelpCircle size={12} />
          Template Fallback
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40" title="AI Service Online">
        <CheckCircle2 size={12} className="text-emerald-400" />
        {provider.toUpperCase()}: {model}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cardBorder bg-navBg backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
            <Terminal size={18} />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-textPrimary">
            ProjectPilot<span className="text-indigo-500">.AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-textPrimary font-semibold' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/generate"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/generate' ? 'text-textPrimary font-semibold' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Generate
          </Link>
          <Link
            to="/saved"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/saved' ? 'text-textPrimary font-semibold' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Saved Blueprints
          </Link>
          <Link
            to="/settings"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/settings' ? 'text-textPrimary font-semibold' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            {getStatusBadge()}
          </div>

          {/* Quick Saved Bookmarks Icon */}
          <button
            onClick={() => navigate('/saved')}
            className={`rounded-lg p-2 transition-all ${
              location.pathname === '/saved' ? 'bg-indigo-950/20 text-indigo-400' : 'text-textSecondary hover:bg-slate-800/40 hover:text-textPrimary'
            }`}
            title="Saved Blueprints"
          >
            <Bookmark size={20} />
          </button>

          {/* Quick Theme Toggle Icon */}
          <button
            onClick={toggleNavbarTheme}
            className="rounded-lg p-2 text-textSecondary hover:bg-slate-800/40 hover:text-textPrimary transition-all"
            title="Toggle Visual Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <button
            onClick={() => navigate('/settings')}
            className={`rounded-lg p-2 transition-all ${
              location.pathname === '/settings' ? 'bg-indigo-950/20 text-indigo-400' : 'text-textSecondary hover:bg-slate-800/40 hover:text-textPrimary'
            }`}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
