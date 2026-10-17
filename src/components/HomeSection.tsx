import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  Search,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  FileText,
  Timer,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  ArrowDown
} from 'lucide-react';
import { Note, SectionType } from '../types';
import { BRANCHES_DATA } from '../data/branchesData';
import { BranchIcon } from './BranchIcon';
import { useNotes } from '../context/NotesContext';
import { getOrCreateNoteForSubject } from '../utils/subjectNotesGenerator';
import {
  getSppuSubjectsForBranchAndSemester,
  SppuSubject
} from '../data/sppuSyllabusData';
import { SppuQuizModal } from './SppuQuizModal';
import { SppuPyqModal } from './SppuPyqModal';
import { getQuizAttemptsForSubject } from '../data/sppuQuizzesData';
import { HeroFrontPage } from './HeroFrontPage';

interface HomeSectionProps {
  notes: Note[];
  onNavigate: (section: SectionType) => void;
  onSelectSubject: (subject: string) => void;
  onPreviewNote: (note: Note) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  notes,
  onNavigate,
  onSelectSubject,
  onPreviewNote
}) => {
  const { setSelectedBranch, setSelectedSemester: setContextSemester, setSearchQuery } = useNotes();

  // 3-Step Flow:
  // Step 1: Branch Selection (selectedBranchCode === null)
  // Step 2: "Choose your Semester" (selectedBranchCode !== null && selectedSemester === null)
  // Step 3: Semester Subjects with 3 options: Notes, PYQs, Unit Quizzes (selectedSemester !== null)
  const [selectedBranchCode, setSelectedBranchCode] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [subjectQuery, setSubjectQuery] = useState<string>('');

  const branchSectionRef = useRef<HTMLDivElement | null>(null);

  // Modals for PYQ and Quizzes
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [pyqModalOpen, setPyqModalOpen] = useState<boolean>(false);
  const [activeModalSubject, setActiveModalSubject] = useState<SppuSubject | null>(null);

  const activeBranch = selectedBranchCode
    ? BRANCHES_DATA.find((b) => b.code === selectedBranchCode) || BRANCHES_DATA[0]
    : null;

  const currentSubjects =
    selectedBranchCode && selectedSemester
      ? getSppuSubjectsForBranchAndSemester(selectedBranchCode, selectedSemester)
      : [];

  const filteredSubjects = currentSubjects.filter((s) => {
    if (!subjectQuery.trim()) return true;
    const q = subjectQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  const handleStartPreparation = () => {
    if (branchSectionRef.current) {
      branchSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const handleOpenSubjectNotes = (subj: SppuSubject) => {
    if (!activeBranch || !selectedSemester) return;
    const note = getOrCreateNoteForSubject(subj.name, activeBranch.code, notes, selectedSemester);
    onPreviewNote(note);
  };

  const handleOpenPyqs = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setPyqModalOpen(true);
  };

  const handleOpenQuiz = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setQuizModalOpen(true);
  };

  return (
    <div className="min-h-screen space-y-12 pb-16">
      {/* ================= ULTRA ATTRACTIVE HERO FRONT PAGE ================= */}
      {!selectedBranchCode && (
        <HeroFrontPage onStartPreparation={handleStartPreparation} />
      )}

      <div ref={branchSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        {/* ================= STEP 1: SELECT YOUR BRANCH ================= */}
        {!selectedBranchCode && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>SPPU University Engineering Hub • 2024 NEP Pattern</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Choose Your Engineering Branch
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Select your engineering stream below to access semester syllabi, verified handwritten short notes, authentic past year question papers, and unit-wise mock tests.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRANCHES_DATA.map((branch, index) => {
                const sequenceNumber = index + 1;
                const totalSubjectCount = branch.semesters.reduce(
                  (acc, sem) => acc + sem.subjects.length,
                  0
                );

                return (
                  <div
                    key={branch.code}
                    onClick={() => {
                      setSelectedBranchCode(branch.code);
                      setSelectedSemester(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="group p-6 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/80 shadow-lg hover:shadow-cyan-950/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          #{sequenceNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                          {branch.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shrink-0">
                          <BranchIcon name={branch.iconName} className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {branch.name}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {branch.shortDesc}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        <strong className="text-slate-200">Sem 1 - Sem 8</strong> Full Syllabi
                      </span>
                      <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Select Semester</span>
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CHOOSE YOUR SEMESTER ================= */}
        {selectedBranchCode && selectedSemester === null && activeBranch && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBranchCode(null);
                  setSelectedSemester(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Branches</span>
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-cyan-400">
                {activeBranch.name} ({activeBranch.code})
              </span>
            </div>

            <div className="bg-gradient-to-r from-cyan-950/40 via-sky-950/30 to-indigo-950/40 border border-cyan-500/20 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>SPPU Pattern 2024 NEP Curriculum</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Choose Your Semester
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Select your current semester for <strong>{activeBranch.name}</strong> to view core courses, verified unit short notes, past year examination question papers, and unit-wise quizzes.
              </p>
            </div>

            {/* Semester Cards 1 through 8 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
                const academicYear =
                  semNum <= 2
                    ? 'FE (First Year)'
                    : semNum <= 4
                    ? 'SE (Second Year)'
                    : semNum <= 6
                    ? 'TE (Third Year)'
                    : 'BE (Final Year)';

                const subjectsForSem = getSppuSubjectsForBranchAndSemester(
                  selectedBranchCode,
                  semNum
                );

                return (
                  <div
                    key={semNum}
                    onClick={() => {
                      setSelectedSemester(semNum);
                      setSubjectQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400 rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-cyan-950/40 hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          {academicYear}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          NEP 2024
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                        Semester {semNum}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {subjectsForSem.length} Subjects (In-Sem 30M + End-Sem 70M)
                      </p>

                      <div className="mt-4 space-y-1 pl-2 border-l-2 border-slate-800">
                        {subjectsForSem.slice(0, 3).map((s) => (
                          <p key={s.code} className="text-[11px] text-slate-300 truncate">
                            • {s.name}
                          </p>
                        ))}
                        {subjectsForSem.length > 3 && (
                          <p className="text-[10px] text-slate-500 italic">
                            +{subjectsForSem.length - 3} more subjects
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-5 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>View Courses & Materials</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: SEMESTER SUBJECTS WITH 3 OPTIONS ================= */}
        {selectedBranchCode && selectedSemester !== null && activeBranch && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose Another Semester</span>
                </button>
                <span className="text-slate-600">/</span>
                <button
                  onClick={() => {
                    setSelectedBranchCode(null);
                    setSelectedSemester(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {activeBranch.name}
                </button>
                <span className="text-slate-600">/</span>
                <span className="text-xs font-bold text-cyan-400">
                  Semester {selectedSemester}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSemester(s)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSemester === s
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Sem {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {activeBranch.code} • Semester {selectedSemester}
                  </span>
                  <span className="text-xs text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                    SPPU Pattern 2024
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Semester {selectedSemester} Subjects Directory
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  For every course below, select among: 📘 <strong>Notes</strong>, 📑 <strong>Past Year PYQ Papers</strong> (with step-by-step solved answers), or ⏱️ <strong>Unit-wise Quizzes</strong> (20 questions / 20 min timer with auto-submit & performance reviews).
                </p>
              </div>

              <div className="relative w-full md:w-72 shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={subjectQuery}
                  onChange={(e) => setSubjectQuery(e.target.value)}
                  placeholder="Search subject or code..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Subjects List with the 3 Dedicated Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Curriculum Courses ({filteredSubjects.length} Core Subjects)
              </h3>

              {filteredSubjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-5">
                  {filteredSubjects.map((subject) => {
                    const pastAttempts = getQuizAttemptsForSubject(subject.code);
                    const solvedCount = pastAttempts.length;

                    return (
                      <div
                        key={subject.code}
                        className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 transition-all space-y-4 shadow-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                                SPPU-{subject.code}
                              </span>
                              <span className="text-xs text-slate-400">
                                {subject.credits} Credits • {subject.courseType}
                              </span>
                              {solvedCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>{solvedCount} Quiz Solved</span>
                                </span>
                              )}
                            </div>

                            <h4 className="text-xl font-bold text-white">
                              {subject.name}
                            </h4>

                            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                              {subject.description}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-end gap-1.5 shrink-0 text-right">
                            <span className="text-xs font-bold text-slate-300 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                              In-Sem: <strong>30M</strong> | End-Sem: <strong>70M</strong>
                            </span>
                            <span className="text-[11px] text-slate-500">
                              6 Units Total (SPPU 2024)
                            </span>
                          </div>
                        </div>

                        {/* Units Pill Summary */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Syllabus Units:
                          </span>
                          {subject.units.map((u) => (
                            <span
                              key={u.unitNumber}
                              className={`text-[11px] px-2.5 py-0.5 rounded-lg border ${
                                u.unitNumber <= 2
                                  ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
                                  : 'bg-slate-950 text-slate-400 border-slate-800'
                              }`}
                              title={u.subtopics.join(', ')}
                            >
                              U{u.unitNumber}: {u.title.split('-')[0].split(':')[0].substring(0, 24)}...
                            </span>
                          ))}
                        </div>

                        {/* 3 Dedicated Action Options */}
                        <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Option 1: Notes & Study Material */}
                          <button
                            onClick={() => handleOpenSubjectNotes(subject)}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <BookOpen className="w-4 h-4" />
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                                Option 1
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                                📘 Notes & Study Material
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Handwritten notes, formulas, unit summaries & PDF download
                              </p>
                            </div>
                          </button>

                          {/* Option 2: Past Year PYQ Papers */}
                          <button
                            onClick={() => handleOpenPyqs(subject)}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-500/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <FileText className="w-4 h-4" />
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                Option 2
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                                📑 Past Year PYQ Papers
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Original SPPU In-Sem & End-Sem papers with model solutions
                              </p>
                            </div>
                          </button>

                          {/* Option 3: Unit-wise Quizzes */}
                          <button
                            onClick={() => handleOpenQuiz(subject)}
                            className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Timer className="w-4 h-4" />
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                Option 3
                              </span>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                                ⏱️ Unit-wise Quizzes (20Q / 20M)
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                20 Qs per unit, 20 min timer with auto-submit & results
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-xs">
                  No subjects found matching your query for Semester {selectedSemester}.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive SPPU Unit Quiz Modal */}
      <SppuQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        subject={activeModalSubject}
        onOpenNotes={() => {
          if (activeModalSubject) {
            handleOpenSubjectNotes(activeModalSubject);
          }
        }}
      />

      {/* Interactive SPPU PYQ Papers Modal */}
      <SppuPyqModal
        isOpen={pyqModalOpen}
        onClose={() => setPyqModalOpen(false)}
        subject={activeModalSubject}
      />
    </div>
  );
};
