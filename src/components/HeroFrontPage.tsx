import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileText,
  Timer,
  Cpu,
  ArrowRight,
  GraduationCap,
  Award,
  Zap,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Flame,
  ChevronDown
} from 'lucide-react';

interface HeroFrontPageProps {
  onStartPreparation: () => void;
}

export const HeroFrontPage: React.FC<HeroFrontPageProps> = ({ onStartPreparation }) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 py-12 sm:py-20 border-b border-slate-800/80">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-sky-500/15 to-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-950/40">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Savitribai Phule Pune University (SPPU) • 2024 NEP Pattern</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Free College Study Portal</span>
          </div>
        </div>

        {/* Grand Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Crush Your Engineering Exams with{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]">
                EngiNotes
              </span>
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Your all-in-one SPPU academic hub: verified handwritten short notes for every syllabus unit, authentic 5-year PYQ question papers with step-by-step solved solutions, 20-minute timed unit quizzes with auto-submit, and Brahmāstra AI 24/7 engineering problem solver.
          </p>
        </div>

        {/* ================= MASSIVE NEON LIGHT BUTTON ================= */}
        <div className="pt-2 pb-4 flex flex-col items-center justify-center">
          {/* Team Hunters & Founders: Strictly in ONE single horizontal line (No vertical stacking) */}
          <div className="mb-6 w-full flex justify-center px-2">
            <div className="inline-flex flex-nowrap items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-slate-900/95 border border-amber-500/50 text-xs sm:text-sm shadow-2xl shadow-amber-950/50 whitespace-nowrap overflow-x-auto max-w-full scrollbar-none">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
                <span className="font-extrabold uppercase tracking-wider text-amber-400 shrink-0">Team Hunters</span>
              </div>
              <span className="text-slate-500 shrink-0 font-bold">•</span>
              <span className="font-extrabold text-amber-200 shrink-0">Founders:</span>
              <div className="inline-flex flex-nowrap items-center gap-2 text-slate-200 shrink-0">
                <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-bold text-xs whitespace-nowrap shrink-0 shadow-sm">
                  1) Abhishek Babar
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-bold text-xs whitespace-nowrap shrink-0 shadow-sm">
                  2) Tejas Shinde
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-bold text-xs whitespace-nowrap shrink-0 shadow-sm">
                  3) Piyush Plepagwar
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-bold text-xs whitespace-nowrap shrink-0 shadow-sm">
                  4) Kunal Chaudhari
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onStartPreparation}
            className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-5 sm:py-6 rounded-3xl font-black text-sm sm:text-lg tracking-wider uppercase text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_35px_rgba(6,182,212,0.65),0_0_60px_rgba(56,189,248,0.35)] hover:shadow-[0_0_55px_rgba(6,182,212,0.9),0_0_90px_rgba(99,102,241,0.6)] border-2 border-white/60 overflow-hidden"
          >
            {/* Animated Light Wave Sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="relative flex items-center gap-3">
              <Zap className="w-6 h-6 text-slate-950 fill-slate-950 animate-bounce" />
              <span className="font-extrabold tracking-wide drop-shadow-sm">
                LET'S START YOUR PREPARATION
              </span>
              <ArrowRight className="w-6 h-6 text-slate-950 group-hover:translate-x-2 transition-transform duration-200" />
            </div>
          </button>

          <p className="text-xs text-slate-400 mt-3 flex items-center gap-2">
            <span>✨ Select branch, choose semester, and access notes & quizzes instantly</span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-4">
          
          {/* Pillar 1: Notes */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg hover:shadow-cyan-950/40 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
              SPPU Unit Short Notes
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Every syllabus point covered from Unit 1 to Unit 6 across standard reference textbooks (Nirali, TechKnowledge, B.S. Grewal, Boylestad).
            </p>
            <div className="mt-3 text-[11px] font-bold text-cyan-400">
              PDF Downloads & Quick Formula Sheets →
            </div>
          </div>

          {/* Pillar 2: PYQ */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-950/40 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              Authentic 5-Year PYQs
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Original In-Sem (30M) and End-Sem (70M) question papers with step-by-step marking scheme answers and derivation diagrams.
            </p>
            <div className="mt-3 text-[11px] font-bold text-emerald-400">
              Pattern 2024 Question Papers →
            </div>
          </div>

          {/* Pillar 3: Quizzes */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all shadow-lg hover:shadow-amber-950/40 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              20Q / 20-Min Quizzes
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Unit-wise mock tests with 20 questions, a strict 20-minute countdown timer, auto-submit at 00:00, and performance reviews.
            </p>
            <div className="mt-3 text-[11px] font-bold text-amber-400">
              Exam Condition Testing →
            </div>
          </div>

          {/* Pillar 4: Brahmastra AI */}
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-950/40 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Brahmāstra AI Bot
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Draggable AI tutor powered by Gemini. Solves any engineering numerical, mathematical derivation, or coding question like ChatGPT.
            </p>
            <div className="mt-3 text-[11px] font-bold text-purple-400">
              Floating 24/7 Problem Solver →
            </div>
          </div>
        </div>

        {/* Live Academic Counters */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-around gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">9</p>
            <p className="text-xs text-slate-400 font-medium">Engineering Branches</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-800" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">8</p>
            <p className="text-xs text-slate-400 font-medium">Semesters (FE to BE)</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-800" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100+</p>
            <p className="text-xs text-slate-400 font-medium">Core SPPU Courses</p>
          </div>
          <div className="hidden sm:block w-px h-8 bg-slate-800" />
          <div>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">5,000+</p>
            <p className="text-xs text-slate-400 font-medium">Solved PYQs & MCQs</p>
          </div>
        </div>
      </div>
    </div>
  );
};
