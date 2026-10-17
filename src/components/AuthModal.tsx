import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  Phone,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateMobileNumber, validateName, cleanMobileNumber } from '../utils/mobileValidator';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'AI & Data Science',
  'Electronics & Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'First Year (FE - Common)'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithMobile } = useAuth();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const phoneCheck = validateMobileNumber(mobileNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const nameCheck = validateName(name);
    if (!nameCheck.isValid) {
      setError(nameCheck.error || 'Please enter your name.');
      return;
    }

    const mobCheck = validateMobileNumber(mobileNumber);
    if (!mobCheck.isValid) {
      setError(mobCheck.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = loginWithMobile({
        name: name.trim(),
        mobileNumber: cleanMobileNumber(mobileNumber),
        branch,
        semester
      });

      setLoading(false);
      if (res.success) {
        onClose();
      } else {
        setError(res.error || 'Login failed.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-2 shadow-lg shadow-sky-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Student Login
          </h2>
          <p className="text-xs text-slate-400">
            Enter your full name, 10-digit mobile number, and branch to access the study hub
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
              Your Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. Abhishek Babar"
                className="w-full bg-slate-950 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                Mobile Number (10 Digits)
              </label>
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {mobileNumber.length}/10
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-xs font-bold text-slate-400 border-r border-slate-800 pr-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                <span>+91</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                required
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (error) setError(null);
                }}
                placeholder="98XXXXXXXX"
                className="w-full bg-slate-950 font-mono text-sm text-slate-100 placeholder-slate-500 pl-16 pr-8 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none"
              />
              {phoneCheck.isValid && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 pointer-events-none" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1">
                Semester
              </label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Enter Study Hub</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secure direct access with verified student details</span>
        </div>
      </div>
    </div>
  );
};
