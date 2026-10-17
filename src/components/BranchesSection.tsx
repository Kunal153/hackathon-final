import React, { useState } from 'react';
import {
  GraduationCap,
  Layers,
  ChevronRight,
  BookOpen,
  FileText,
  Timer,
  Search,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Award,
  Calendar,
  Eye,
  HelpCircle,
  Zap
} from 'lucide-react';
import { BRANCHES_DATA } from '../data/branchesData';
import { BranchIcon } from './BranchIcon';
import { Note, SectionType } from '../types';
import { useNotes } from '../context/NotesContext';
import { getOrCreateNoteForSubject } from '../utils/subjectNotesGenerator';
import {
  SPPU_2024_BRANCHES,
  SPPU_2024_SUBJECTS,
  SppuSubject,
  getSppuSubjectsForBranchAndSemester
} from '../data/sppuSyllabusData';
import { SppuQuizModal } from './SppuQuizModal';
import { SppuPyqModal } from './SppuPyqModal';
import { PdfSummarizerModal } from './PdfSummarizerModal';
import { getQuizAttemptsForSubject } from '../data/sppuQuizzesData';

interface BranchesSectionProps {
  onSelectBranchAndSem: (branchCode: string, sem?: number) => void;
  onSelectSubject: (subject: string) => void;
  onNavigate: (section: SectionType) => void;
  onPreviewNote?: (note: Note) => void;
}

export const BranchesSection: React.FC<BranchesSectionProps> = ({
  onSelectBranchAndSem,
  onSelectSubject,
  onNavigate,
  onPreviewNote
}) => {
  const { notes, setSelectedBranch, setSelectedSemester: setContextSemester, setSearchQuery } = useNotes();

  // Navigation steps requested by user:
  // 'branches' -> click branch -> 'semesters' ("Choose your Semester") -> click sem -> 'subjects' (3 options per subject)
  const [currentStep, setCurrentStep] = useState<'branches' | 'semesters' | 'subjects'>('branches');
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [subjectSearch, setSubjectSearch] = useState<string>('');

  // Modals for PYQ and Quizzes
  const [quizModalOpen, setQuizModalOpen] = useState<boolean>(false);
  const [pyqModalOpen, setPyqModalOpen] = useState<boolean>(false);
  const [activeModalSubject, setActiveModalSubject] = useState<SppuSubject | null>(null);

  // Active branch metadata
  const currentBranch =
    BRANCHES_DATA.find((b) => b.code === selectedBranchCode) || BRANCHES_DATA[0];

  // Subjects for the selected branch and semester (SPPU 2024 Pattern)
  const currentSemesterSubjects = getSppuSubjectsForBranchAndSemester(
    selectedBranchCode,
    selectedSemester
  );

  // Filtered subjects
  const filteredSubjects = currentSemesterSubjects.filter((s) => {
    if (!subjectSearch.trim()) return true;
    const query = subjectSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.code.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query)
    );
  });

  // Action: Open Notes Reader
  const handleOpenNotes = (subjectName: string, semester: number) => {
    if (onPreviewNote) {
      const generated = getOrCreateNoteForSubject(
        subjectName,
        selectedBranchCode,
        notes,
        semester
      );
      onPreviewNote(generated);
    } else {
      setSelectedBranch(selectedBranchCode);
      setSelectedSemester(semester);
      setSearchQuery(subjectName);
      onSelectSubject(subjectName);
      onNavigate('browse');
    }
  };

  // Action: Open PYQ Modal
  const handleOpenPyqs = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setPyqModalOpen(true);
  };

  // Action: Open Unit Quizzes Modal
  const handleOpenQuiz = (subj: SppuSubject) => {
    setActiveModalSubject(subj);
    setQuizModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ================= STEP 1: SELECT BRANCH ================= */}
      {currentStep === 'branches' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>SPPU University Engineering Streams (Pattern 2024 NEP)</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              Engineering Branches & Academic Streams
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Select your engineering branch below to view semester syllabi, original SPPU past year question papers (PYQs), and unit-wise exam quizzes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BRANCHES_DATA.map((branch, idx) => {
              return (
                <div
                  key={branch.code}
                  onClick={() => {
                    setSelectedBranchCode(branch.code);
                    setCurrentStep('semesters');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-sky-950/40 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/15 transition-all" />

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BranchIcon name={branch.iconName} className="w-6 h-6" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          {branch.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          Sem 1-8
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {branch.shortDesc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      SPPU Pattern 2024 Aligned
                    </span>
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Choose Semester</span>
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
      {currentStep === 'semesters' && (
        <div className="space-y-6">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep('branches')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Branches</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-bold text-sky-400">
              {currentBranch.name} ({currentBranch.code})
            </span>
          </div>

          {/* Heading Requested: "Choose your Semester" */}
          <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-500/20 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>SPPU University 2024 Syllabus • NEP Pattern</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Choose Your Semester
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Below are all 8 semesters for <strong>{currentBranch.name}</strong>. Click on your semester to explore subjects, past year PYQ question papers, and unit-wise quizzes.
            </p>
          </div>

          {/* Semesters 1 to 8 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
              // Academic year tag
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
                    setCurrentStep('subjects');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-400 rounded-3xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-sky-950/50 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        {academicYear}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        NEP 2024
                      </span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white group-hover:text-sky-300 transition-colors">
                      Semester {semNum}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {subjectsForSem.length} Core Subjects (In-Sem 30M + End-Sem 70M)
                    </p>

                    {/* Preview of subject names */}
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

                  <div className="pt-4 mt-5 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-sky-400 group-hover:translate-x-1 transition-transform">
                    <span>View Subjects & Quizzes</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= STEP 3: SEMESTER SUBJECTS WITH 3 OPTIONS ================= */}
      {currentStep === 'subjects' && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentStep('semesters')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Semester</span>
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={() => setCurrentStep('branches')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {currentBranch.name}
              </button>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-bold text-sky-400">
                Semester {selectedSemester}
              </span>
            </div>

            {/* Semester Switcher Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSemester(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSemester === s
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

          {/* Header Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {currentBranch.code} • Semester {selectedSemester}
                </span>
                <span className="text-xs text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                  SPPU University Pattern 2024
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Semester {selectedSemester} Courses & Modules
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                For each subject below, you have <strong>3 options</strong>: 📘 <strong>Notes & Study Material</strong>, 📑 <strong>Past Year PYQ Papers</strong> (original questions with solved solutions), and ⏱️ <strong>Unit-wise Quizzes</strong> (20 questions / 20 mins timer with auto-submit).
              </p>
            </div>

            {/* Search Input Filter */}
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={subjectSearch}
                onChange={(e) => setSubjectSearch(e.target.value)}
                placeholder="Search subject or code..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 pl-10 pr-4 py-3 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Subjects Cards Grid with the 3 Distinct Options! */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Subjects for Semester {selectedSemester} ({filteredSubjects.length} Courses)
              </h3>
              <span className="text-xs text-slate-400">
                In-Sem: 30 Marks (Units 1-2) | End-Sem: 70 Marks (Units 3-6)
              </span>
            </div>

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
                      {/* Top Info Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-mono font-black text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-lg border border-sky-500/20">
                              SPPU-{subject.code}
                            </span>
                            <span className="text-xs text-slate-400">
                              {subject.credits} Credits • {subject.courseType}
                            </span>
                            {solvedCount > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{solvedCount} Quiz Attempt{solvedCount > 1 ? 's' : ''}</span>
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

                        {/* Exam Marks Badge */}
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

                      {/* ================= THE 3 DEDICATED OPTIONS ================= */}
                      <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* OPTION 1: Notes & Study Material */}
                        <button
                          onClick={() => handleOpenNotes(subject.name, selectedSemester)}
                          className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 border border-sky-500/30 text-left transition-all group cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                              Option 1
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                              📘 Notes & Study Material
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Handwritten notes, formulas, unit summaries & PDF download
                            </p>
                          </div>
                        </button>

                        {/* OPTION 2: Past Year PYQ Papers */}
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

                        {/* OPTION 3: Unit-wise Quizzes */}
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

      {/* Interactive SPPU Unit Quiz Modal */}
      <SppuQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        subject={activeModalSubject}
        onOpenNotes={(unitNum) => {
          if (activeModalSubject) {
            handleOpenNotes(activeModalSubject.name, selectedSemester);
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
