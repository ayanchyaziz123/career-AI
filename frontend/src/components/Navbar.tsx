import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, BarChart3, GitCompareArrows, LayoutDashboard, Menu, X } from 'lucide-react';
import { useCareer } from '../context/CareerContext';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/results', label: 'Results', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

export default function Navbar() {
  const location = useLocation();
  const { careers } = useCareer();
  const [mobileOpen, setMobileOpen] = useState(false);
  const savedCount = careers.filter(c => c.saved).length;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent hidden sm:block">
            CareerAI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            const disabled = to !== '/' && careers.length === 0;
            return (
              <Link
                key={to}
                to={disabled ? '#' : to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : disabled
                    ? 'text-slate-600 cursor-not-allowed'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                onClick={e => disabled && e.preventDefault()}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          {savedCount > 0 && (
            <span className="ml-2 px-2.5 py-0.5 text-xs font-bold bg-indigo-500/20 text-indigo-300 rounded-full">
              {savedCount} saved
            </span>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60 px-6 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            const disabled = to !== '/' && careers.length === 0;
            return (
              <Link
                key={to}
                to={disabled ? '#' : to}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-indigo-500/15 text-indigo-300' : disabled ? 'text-slate-600' : 'text-slate-400'
                }`}
                onClick={e => { disabled && e.preventDefault(); setMobileOpen(false); }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
