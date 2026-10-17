import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Search,
  Upload,
  User as UserIcon,
  Menu,
  X,
  Compass,
  FolderGit2,
  Sparkles,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { SectionType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';

interface NavbarProps {
  currentSection: SectionType;
  onNavigate: (section: SectionType) => void;
  onOpenAuthModal: () => void;
  onOpenGitHubModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  onOpenAuthModal,
  onOpenGitHubModal
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useNotes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (section: SectionType) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('browse');
    }
  };

  const navLinks: { id: SectionType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: <Compass className="w-4 h-4" /> },
    { id: 'browse', label: 'Browse Notes', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'branches', label: 'Branches & Syllabus', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'upload', label: 'Upload Notes', icon: <Upload className="w-4 h-4" />, badge: '+50 pts' },
    { id: 'account', label: 'My Account', icon: <UserIcon className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Engi<span className="text-sky-400">Notes</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Hub
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Engineering Study Portal
            </p>
          </div>
        </div>

        {/* Global Search Bar (Medium & Up) */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center relative max-w-xs xl:max-w-sm w-full"
        >
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes, subjects, branch, units..."
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-400 pl-9 pr-4 py-1.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/40 transition-all"
          />
        </form>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Auth & Actions */}
        <div className="flex items-center gap-3">


          {/* Quick Upload CTA (Mobile & Tablet) */}
          <button
            onClick={() => handleNavClick('upload')}
            className="hidden sm:flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-medium text-xs shadow-md transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 transition-all cursor-pointer"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-sky-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs border border-sky-500/40">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-200 line-clamp-1 max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-sky-400 font-semibold -mt-0.5">
                    {user.reputationPoints} pts
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-bold text-slate-200">{user.name}</p>
                    <p className="text-[11px] font-mono text-sky-400 font-semibold">+91 {user.mobileNumber}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {user.branch} {user.semester ? `• Sem ${user.semester}` : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleNavClick('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-sky-400" />
                    <span>My Account & Downloads</span>
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('upload');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                  >
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>Upload New Notes</span>
                  </button>

                  <div className="border-t border-slate-800/80 my-1"></div>

                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, subjects, branch..."
              className="w-full bg-slate-900 text-sm text-slate-200 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500"
            />
          </form>

          {navLinks.map((link) => {
            const isActive = currentSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
