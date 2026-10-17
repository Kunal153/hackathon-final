import React, { useState, useId } from 'react';
import {
  GraduationCap,
  User as UserIcon,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layers,
  Cpu,
  Zap,
  Code2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateMobileNumber, validateName, cleanMobileNumber } from '../utils/mobileValidator';

const ENGINEERING_BRANCHES = [
  { code: 'Computer Engineering', label: 'Computer Engineering', short: 'COMP', icon: Code2, color: 'from-sky-500 to-blue-600' },
  { code: 'Information Technology', label: 'Information Technology', short: 'IT', icon: Layers, color: 'from-blue-500 to-cyan-500' },
  { code: 'AI & Data Science', label: 'AI & Data Science', short: 'AI & DS', icon: Cpu, color: 'from-indigo-500 to-purple-600' },
  { code: 'Electronics & Telecommunication', label: 'Electronics & Telecommunication (E&TC)', short: 'E&TC', icon: Zap, color: 'from-amber-500 to-orange-600' },
  { code: 'Mechanical Engineering', label: 'Mechanical Engineering', short: 'MECH', icon: Cpu, color: 'from-emerald-500 to-teal-600' },
  { code: 'Civil Engineering', label: 'Civil Engineering', short: 'CIVIL', icon: Layers, color: 'from-stone-500 to-amber-700' },
  { code: 'Electrical Engineering', label: 'Electrical Engineering', short: 'ELECT', icon: Zap, color: 'from-yellow-500 to-amber-600' },
  { code: 'First Year (FE - Common)', label: 'First Year Engineering (FE - Common)', short: 'FE', icon: BookOpen, color: 'from-rose-500 to-pink-600' }
];

export const FrontLoginPage: React.FC = () => {
  const { loginWithMobile } = useAuth();
  const nameInputId = useId();
  const phoneInputId = useId();
  const branchSelectId = useId();
  const semesterSelectId = useId();

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [branch, setBranch] = useState('Computer Engineering');
  const [semester, setSemester] = useState<number>(1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);
  const [touchedName, setTouchedName] = useState(false);

  // Live validation checks
  const phoneValidation = validateMobileNumber(mobileNumber);
  const nameValidation = validateName(name);

  // Quick check for sequence during typing to alert the user immediately
  const rawClean = mobileNumber.replace(/\D/g, '');
  const isObviousSequence =
    rawClean === '1234567890' ||
    rawClean === '9876543210' ||
    rawClean === '0123456789' ||
    (rawClean.length === 10 && /^(\d)\1{9}$/.test(rawClean));

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(val);
    if (!touchedPhone) setTouchedPhone(true);
    if (errorMessage) setErrorMessage(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!touchedName) setTouchedName(true);
    if (errorMessage) setErrorMessage(null);
  };

  const handleBranchSelect = (selectedBranch: string) => {
    setBranch(selectedBranch);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedName(true);
    setTouchedPhone(true);

    // Validate Name
    const nameCheck = validateName(name);
    if (!nameCheck.isValid) {
      setErrorMessage(nameCheck.error || 'Please enter your full name.');
      return;
    }

    // Validate Mobile
    const mobileCheck = validateMobileNumber(mobileNumber);
    if (!mobileCheck.isValid) {
      setErrorMessage(mobileCheck.error || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!branch) {
      setErrorMessage('Please select your engineering branch.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = loginWithMobile({
        name: name.trim(),
        mobileNumber: cleanMobileNumber(mobileNumber),
        branch,
        semester
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Login failed. Please check your credentials.');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden selection:bg-sky-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-600/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-indigo-700/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle blueprint grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #38bdf8 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Top Header Brand */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 border border-sky-400/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Engi<span className="text-sky-400">Notes</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Study Hub
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Engineering Study Portal • College Notes & PYQ Bank
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Verified Student Access • 100% Free</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Visual highlights & value props */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Engineering Study Material & PYQs</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Study Smarter, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Score Like Toppers!
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Access verified handwritten notes, solved PYQs, syllabus guides, formula sheets, and AI-powered revision tools across all engineering branches.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Handwritten Notes</h4>
                  <p className="text-[11px] text-slate-400">Unit-wise high scoring notes</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">PYQ Question Bank</h4>
                  <p className="text-[11px] text-slate-400">Past papers with step solutions</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Last Minute Notes AI</h4>
                  <p className="text-[11px] text-slate-400">Instant PDF exam short notes</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Verified Direct Login</h4>
                  <p className="text-[11px] text-slate-400">Name, mobile & branch access</p>
                </div>
              </div>
            </div>

            {/* Social Proof Counter */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
              <div className="flex -space-x-2">
                {['A', 'S', 'P', 'R'].map((initial, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-sky-400"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span>
                Joined by <strong className="text-slate-200 font-bold">14,500+</strong> engineering students
              </span>
            </div>
          </div>

          {/* Right Column: Sleek Modern Login Card */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl shadow-black/60 relative">
              {/* Card Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-sky-400" />
                    <span>Student Login</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your genuine student details to access the study hub
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-bold text-sky-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Access</span>
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <strong className="font-bold block text-rose-200">Validation Error:</strong>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Enter Your Name */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={nameInputId} className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Your Full Name
                      <span className="text-rose-400 ml-1">*</span>
                    </label>
                    {touchedName && name.trim().length >= 2 && nameValidation.isValid && (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Valid Name
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      id={nameInputId}
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="e.g. Abhishek Babar or Rahul Sharma"
                      required
                      autoComplete="name"
                      className={`w-full bg-slate-950/80 text-sm text-slate-100 placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border transition-all ${
                        touchedName && !nameValidation.isValid && name.length > 0
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                          : touchedName && nameValidation.isValid
                          ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                          : 'border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30'
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* 2. Enter Mobile Number */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={phoneInputId} className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Mobile Number <span className="text-slate-400 font-normal lowercase">(10 Digits)</span>
                      <span className="text-rose-400 ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          mobileNumber.length === 10
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {mobileNumber.length}/10
                      </span>
                    </div>
                  </div>

                  <div className="relative flex items-center">
                    <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-slate-400 border-r border-slate-800 pr-2.5">
                      <Phone className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-bold text-slate-300">+91</span>
                    </div>
                    <input
                      id={phoneInputId}
                      type="tel"
                      inputMode="numeric"
                      value={mobileNumber}
                      onChange={handlePhoneChange}
                      placeholder="98XXXXXXXX (10 digits only)"
                      maxLength={10}
                      required
                      autoComplete="tel"
                      className={`w-full bg-slate-950/80 text-sm font-mono text-slate-100 placeholder-slate-500 pl-20 pr-10 py-3 rounded-2xl border transition-all ${
                        isObviousSequence || (touchedPhone && !phoneValidation.isValid && mobileNumber.length === 10)
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30'
                          : touchedPhone && phoneValidation.isValid
                          ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'
                          : 'border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30'
                      } focus:outline-none`}
                    />
                    {touchedPhone && phoneValidation.isValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 pointer-events-none" />
                    )}
                  </div>

                  {/* Realtime sequence warning helper */}
                  {isObviousSequence && (
                    <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Sequence or dummy numbers (e.g. 1234567890 or 9876543210) are not allowed! Please enter your real number.</span>
                    </p>
                  )}

                  {!isObviousSequence && touchedPhone && mobileNumber.length === 10 && !phoneValidation.isValid && (
                    <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{phoneValidation.error}</span>
                    </p>
                  )}

                  {!isObviousSequence && touchedPhone && phoneValidation.isValid && (
                    <p className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Verified 10-digit mobile number</span>
                    </p>
                  )}
                </div>

                {/* 3. Select Branch */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor={branchSelectId} className="block text-xs font-bold text-slate-300 uppercase tracking-wide">
                      Select Your Branch
                      <span className="text-rose-400 ml-1">*</span>
                    </label>
                    <span className="text-[11px] font-semibold text-sky-400">
                      {branch}
                    </span>
                  </div>

                  {/* Quick Select Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ENGINEERING_BRANCHES.slice(0, 8).map((b) => {
                      const isSelected = branch === b.code;
                      const IconComp = b.icon;
                      return (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => handleBranchSelect(b.code)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                            isSelected
                              ? 'bg-sky-500/20 border-sky-400 text-white shadow-md shadow-sky-500/10'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-sky-500 text-white'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <span className="block text-xs font-bold truncate">
                              {b.short}
                            </span>
                            <span className="text-[9px] text-slate-400 block truncate">
                              {b.label}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Full Dropdown for all branches */}
                  <div className="pt-1">
                    <select
                      id={branchSelectId}
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full bg-slate-950 text-xs text-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer"
                    >
                      {ENGINEERING_BRANCHES.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.label} ({b.short})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Year/Semester selection */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor={semesterSelectId} className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Semester
                    </label>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
                      const isSelected = semester === semNum;
                      return (
                        <button
                          key={semNum}
                          type="button"
                          onClick={() => setSemester(semNum)}
                          className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                          }`}
                        >
                          Sem {semNum}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Login Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-sky-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying student details...</span>
                      </div>
                    ) : (
                      <>
                        <span>Enter Study Hub</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Bottom Guarantee */}
              <div className="mt-5 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-left">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secure verified login via Name, Mobile No. & Branch</span>
                </div>
                <span className="text-slate-400">
                  100% Genuine Engineering Study Portal
                </span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-900 py-4 text-center text-xs text-slate-400">
        <p>
          EngiNotes Study Hub © {new Date().getFullYear()} • Engineering Notes, PYQs & Syllabi Portal
        </p>
      </footer>
    </div>
  );
};
