import React, { useState } from 'react';
import {
  X,
  Download,
  Bookmark,
  ThumbsUp,
  CheckCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
  BookOpen,
  Share2,
  Code2,
  Cpu,
  Layers,
  Printer,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { INITIAL_NOTES } from '../data/seedNotes';
import { downloadNotePDF, printNoteToPDF } from '../utils/pdfGenerator';

interface NotePreviewModalProps {
  note: Note | null;
  onClose: () => void;
}

export const NotePreviewModal: React.FC<NotePreviewModalProps> = ({
  note,
  onClose
}) => {
  const { user, isBookmarkSaved, toggleUserBookmark } = useAuth();
  const { toggleUpvote, recordDownload, deleteNote } = useNotes();

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'reader' | 'summary' | 'verification'>('reader');
  const [readingLayout, setReadingLayout] = useState<'continuous' | 'single'>('continuous');
  const [viewerMode, setViewerMode] = useState<'structured' | 'original'>(
    note?.fileDataUrl ? 'original' : 'structured'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!note) return null;

  const canDeleteNote =
    note.isUserUploaded === true ||
    !INITIAL_NOTES.some((inNote) => inNote.id === note.id) ||
    (user && (user.uploadedNoteIds.includes(note.id) || note.author.id === user.id));

  const handleDeleteThisNote = () => {
    deleteNote(note.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const isSaved = isBookmarkSaved(note.id);
  const isUpvoted = user?.upvotedNoteIds.includes(note.id) || false;

  const pages =
    note.previewPages && note.previewPages.length > 0
      ? note.previewPages
      : [
          {
            pageNumber: 1,
            title: `${note.title} - Main Notes`,
            content: note.description || 'Full lecture notes and university solved papers.',
            keyPoints: [
              'Complete unit coverage and conceptual derivations',
              'Past year university exam questions',
              'Tips for scoring maximum marks in numerical problems'
            ]
          }
        ];

  const currentPage = pages[currentPageIndex] || pages[0];

  const handleDownload = async () => {
    setDownloadState('downloading');
    setDownloadNotice('Generating PDF file directly in your browser...');
    recordDownload(note.id);
    const res = await downloadNotePDF(note);
    if (res.success) {
      setDownloadState('done');
      setDownloadNotice('✓ PDF download started successfully! Check your browser downloads.');
      setTimeout(() => {
        setDownloadState('idle');
        setDownloadNotice(null);
      }, 5000);
    } else {
      setDownloadState('idle');
      setDownloadNotice('Download blocked by iframe. Click "Print / Save as PDF" below.');
    }
  };

  const handlePrint = () => {
    recordDownload(note.id);
    printNoteToPDF(note);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {note.branch} • Sem {note.semester}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {note.category}
              </span>
              {note.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" />
                  Verified Document
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 truncate mt-1">
              {note.title}
            </h2>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              title="Copy Note Link"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => toggleUserBookmark(note.id)}
              title={isSaved ? 'Remove bookmark' : 'Bookmark note'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handlePrint}
              title="Print or Save as PDF (Works offline in all browsers)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-all cursor-pointer ${
                downloadState === 'done'
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : downloadState === 'downloading'
                  ? 'bg-sky-600 opacity-80 cursor-wait'
                  : 'bg-sky-500 hover:bg-sky-400'
              }`}
            >
              {downloadState === 'downloading' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Preparing PDF...</span>
                </>
              ) : downloadState === 'done' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {canDeleteNote && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                title="Delete this uploaded note"
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Download notification banner if active */}
        {downloadNotice && (
          <div className="bg-sky-950/90 border-b border-sky-800/60 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-sky-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadNotice}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="underline font-semibold hover:text-white cursor-pointer"
              >
                Printer / Save as PDF
              </button>
              <button
                onClick={() => setDownloadNotice(null)}
                className="text-sky-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Sub-bar: Navigation Tabs & Zoom controls */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Document Reader ({pages.length} Pages)
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Exam Summary & Formulas</span>
            </button>

            <button
              onClick={() => setActiveTab('verification')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'verification'
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Syllabus Verification</span>
            </button>
          </div>

          {activeTab === 'reader' && (
            <div className="hidden sm:flex items-center gap-3 text-slate-400">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setReadingLayout('continuous')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    readingLayout === 'continuous'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All {pages.length} Pages
                </button>
                <button
                  onClick={() => setReadingLayout('single')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                    readingLayout === 'single'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Single Page
                </button>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setZoomLevel(Math.max(80, zoomLevel - 15))}
                  className="p-1 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(Math.min(140, zoomLevel + 15))}
                  className="p-1 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {readingLayout === 'single' && (
                <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                  <button
                    disabled={currentPageIndex === 0}
                    onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                    className="p-1 disabled:opacity-30 hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-semibold px-1">
                    {currentPageIndex + 1} / {pages.length}
                  </span>
                  <button
                    disabled={currentPageIndex === pages.length - 1}
                    onClick={() =>
                      setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))
                    }
                    className="p-1 disabled:opacity-30 hover:text-white cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/70">
          {copiedLink && (
            <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center animate-in fade-in">
              Link copied to clipboard! You can share this study material with classmates.
            </div>
          )}

          {/* READER TAB */}
          {activeTab === 'reader' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Quick Jump Bar across all pages */}
              {pages.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  <span className="text-[11px] text-slate-400 font-bold shrink-0 mr-1">
                    Jump to Module:
                  </span>
                  {pages.map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setCurrentPageIndex(pIdx);
                        const el = document.getElementById(`doc-page-${pIdx}`);
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        currentPageIndex === pIdx
                          ? 'bg-sky-500 text-white border-sky-400'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                      }`}
                    >
                      P.{p.pageNumber || pIdx + 1}: {p.title.split(':')[0]}
                    </button>
                  ))}
                </div>
              )}

              {note.fileDataUrl && (
                <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs">
                  <span className="text-slate-300 font-semibold pl-2">
                    Original Document Attached: <strong className="text-sky-400">{note.fileName}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setViewerMode('original')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        viewerMode === 'original'
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Original PDF
                    </button>
                    <button
                      onClick={() => setViewerMode('structured')}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        viewerMode === 'structured'
                          ? 'bg-sky-500 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      All Notes View
                    </button>
                  </div>
                </div>
              )}

              {viewerMode === 'original' && note.fileDataUrl ? (
                <div className="w-full h-[620px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
                  <iframe
                    src={note.fileDataUrl}
                    className="w-full h-full rounded-3xl"
                    title={note.title}
                  />
                </div>
              ) : readingLayout === 'continuous' ? (
                /* Continuous All Pages View: Shows EVERY SINGLE PAGE */
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="space-y-6 transition-transform"
                >
                  {pages.map((p, idx) => (
                    <div
                      key={idx}
                      id={`doc-page-${idx}`}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6"
                    >
                      {/* Page Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                        <span className="font-mono uppercase tracking-wider text-sky-400 font-bold">
                          {note.subject} • Module {idx + 1}
                        </span>
                        <span className="font-bold text-slate-300">
                          Page {p.pageNumber || idx + 1} of {pages.length}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                        {p.title}
                      </h3>

                      {/* Content */}
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal space-y-4">
                        {p.content}
                      </div>

                      {/* Formula */}
                      {p.formula && (
                        <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                            Governing Formula / Theorem:
                          </span>
                          <div className="font-mono text-sm sm:text-base font-semibold text-sky-200">
                            {p.formula}
                          </div>
                        </div>
                      )}

                      {/* Code Snippet */}
                      {p.codeSnippet && (
                        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 pb-2 border-b border-slate-800">
                            <Code2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Code Implementation</span>
                          </div>
                          <pre className="text-xs text-emerald-300 font-mono leading-relaxed">
                            {p.codeSnippet}
                          </pre>
                        </div>
                      )}

                      {/* Key Points */}
                      {p.keyPoints && p.keyPoints.length > 0 && (
                        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            High-Yield Exam Takeaways:
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-300">
                            {p.keyPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <span>EngiNotes Academic Repository • {note.branch}</span>
                        <span>Page {idx + 1} of {pages.length}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single Page View */
                <div
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 transition-transform"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-mono uppercase tracking-wider text-sky-400 font-bold">
                      {note.subject} • Module {currentPageIndex + 1}
                    </span>
                    <span>
                      Page {currentPage.pageNumber || currentPageIndex + 1} of {pages.length}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {currentPage.title}
                  </h3>

                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal space-y-4">
                    {currentPage.content}
                  </div>

                  {currentPage.formula && (
                    <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                        Governing Formula:
                      </span>
                      <div className="font-mono text-sm sm:text-base font-semibold text-sky-200">
                        {currentPage.formula}
                      </div>
                    </div>
                  )}

                  {currentPage.codeSnippet && (
                    <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 overflow-x-auto">
                      <pre className="text-xs text-emerald-300 font-mono leading-relaxed">
                        {currentPage.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {currentPage.keyPoints && currentPage.keyPoints.length > 0 && (
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        High-Yield Exam Takeaways:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {currentPage.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>EngiNotes Academic Repository • {note.branch}</span>
                    <span>Page {currentPageIndex + 1} of {pages.length}</span>
                  </div>
                </div>
              )}

              {/* Mobile pagination controls */}
              <div className="flex sm:hidden items-center justify-between p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 font-semibold"
                >
                  Previous
                </button>
                <span>
                  Page {currentPageIndex + 1} of {pages.length}
                </span>
                <button
                  disabled={currentPageIndex === pages.length - 1}
                  onClick={() =>
                    setCurrentPageIndex((prev) => Math.min(pages.length - 1, prev + 1))
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-800 disabled:opacity-40 font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* SUMMARY TAB */}
          {activeTab === 'summary' && (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Exam Preparation Highlights</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized review of the high-probability exam concepts covered in this set.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Document Overview
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {note.description}
                </p>
              </div>

              {/* Units covered */}
              {note.syllabusUnitsCovered && note.syllabusUnitsCovered.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Syllabus Units Covered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {note.syllabusUnitsCovered.map((u, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{u}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Download prompt */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-100">
                    Save the entire {note.pages}-page document
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    File size: {note.fileSize} • Clean PDF format
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Download Now
                </button>
              </div>
            </div>
          )}

          {/* ACADEMIC VERIFICATION & SYLLABUS TAB */}
          {activeTab === 'verification' && (
            <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Academic Integrity & Syllabus Verification
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Official curriculum alignment and quality assurance details.
                  </p>
                </div>
              </div>

              {/* Source attribution card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Institutional Source & Department
                </span>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">{note.author.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{note.author.college}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                      {note.author.role || 'Verified Coursepack'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quality Checklist */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Verification Standards Met
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-slate-200">Curriculum Aligned:</strong>{' '}
                      <span className="text-slate-400">
                        Matches {note.syllabusPattern || 'AICTE & University Model Syllabus'} for {note.branch} Semester {note.semester}.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-slate-200">Mathematical & Theoretical Rigor:</strong>{' '}
                      <span className="text-slate-400">
                        Contains step-by-step derivations, standard notation, and solved problems.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <strong className="text-slate-200">Open Educational Access:</strong>{' '}
                      <span className="text-slate-400">
                        Free for non-commercial student learning, exam preparation, and classroom revision.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-white">{note.pages}</div>
                  <span className="text-[10px] text-slate-400">Document Pages</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-sky-400">{note.downloads}</div>
                  <span className="text-[10px] text-slate-400">Student Accesses</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-lg font-bold text-emerald-400">{note.upvotes}</div>
                  <span className="text-[10px] text-slate-400">Helpful Endorsements</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar: Author info & Upvote */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4 shrink-0 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-200 truncate">{note.author.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{note.author.college}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleUpvote(note.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isUpvoted
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-400 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-sky-400' : ''}`} />
              <span>{note.upvotes} Upvotes</span>
            </button>
          </div>
        </div>

        {/* Modal: Confirm Delete Note */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-rose-700/60 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Delete This Note?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to delete <strong>"{note.title}"</strong>?
                The document and files will be permanently erased.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteThisNote}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg shadow-rose-600/30 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Note</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
