import React, { useState } from 'react';
import {
  FileText,
  Download,
  ThumbsUp,
  Bookmark,
  CheckCircle,
  Eye,
  Calendar,
  Layers,
  Trash2,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { INITIAL_NOTES } from '../data/seedNotes';
import { downloadNotePDF } from '../utils/pdfGenerator';

interface NoteCardProps {
  note: Note;
  onPreview: (note: Note) => void;
  variant?: 'grid' | 'compact' | 'list';
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onPreview,
  variant = 'grid'
}) => {
  const { user, isBookmarkSaved, toggleUserBookmark } = useAuth();
  const { toggleUpvote, recordDownload, deleteNote } = useNotes();
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const canDelete =
    note.isUserUploaded === true ||
    !INITIAL_NOTES.some((inNote) => inNote.id === note.id) ||
    (user && (user.uploadedNoteIds.includes(note.id) || note.author.id === user.id));

  const isSaved = isBookmarkSaved(note.id);
  const isUpvoted = user?.upvotedNoteIds.includes(note.id) || false;

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadState('downloading');
    recordDownload(note.id);
    const res = await downloadNotePDF(note);
    if (res.success) {
      setDownloadState('done');
      setTimeout(() => setDownloadState('idle'), 3500);
    } else {
      setDownloadState('idle');
    }
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvote(note.id);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUserBookmark(note.id);
  };

  // Branch badge color helper
  const getBranchBadgeStyle = (branch: string) => {
    switch (branch.toUpperCase()) {
      case 'CSE':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'ECE':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'MECH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'CIVIL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'EEE':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'AIDS':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'IT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (variant === 'list') {
    return (
      <div
        onClick={() => onPreview(note)}
        className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center shrink-0 text-sky-400 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBranchBadgeStyle(note.branch)}`}>
                {note.branch}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Sem {note.semester}
              </span>
              <span className="text-xs text-slate-400">
                {note.category}
              </span>
              {note.isVerified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1">
              {note.title}
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-1">{note.subject}</p>
            <p className="text-xs text-slate-400 line-clamp-1">{note.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t border-slate-800/60 md:border-t-0">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Syllabus</span>
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              {note.downloads}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              {note.pages}p
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              title={isSaved ? 'Remove Bookmark' : 'Save Note'}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>

            {canDelete && (
              <div className="flex items-center gap-1">
                {confirmDelete ? (
                  <div className="flex items-center gap-1 bg-rose-950/80 border border-rose-800/80 px-2 py-1 rounded-lg">
                    <span className="text-[10px] text-rose-300 font-bold">Delete?</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                    >
                      Yes
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(false);
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(true);
                    }}
                    title="Delete uploaded note"
                    className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={downloadState === 'downloading'}
              title="Download PDF"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-medium text-xs transition-colors shadow-sm cursor-pointer ${
                downloadState === 'done'
                  ? 'bg-emerald-600'
                  : downloadState === 'downloading'
                  ? 'bg-sky-600 opacity-80 cursor-wait'
                  : 'bg-sky-500 hover:bg-sky-400'
              }`}
            >
              {downloadState === 'downloading' ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : downloadState === 'done' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Get PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onPreview(note)}
      className="group relative flex flex-col bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/30 cursor-pointer"
    >
      {/* Top Banner with Subject & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full border ${getBranchBadgeStyle(note.branch)}`}>
              {note.branch}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/80">
              Sem {note.semester}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            title={isSaved ? 'Remove from saved' : 'Save note'}
            className={`p-1.5 rounded-lg border transition-all ${
              isSaved
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
            {note.category}
          </span>
          {note.isVerified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <CheckCircle className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-2 mt-1 leading-snug">
          {note.title}
        </h3>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">{note.subject}</p>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {note.description}
        </p>
      </div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="px-5 pb-3 flex flex-wrap gap-1.5">
          {note.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium text-slate-400 bg-slate-800/70 px-2 py-0.5 rounded-md border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 px-1 py-0.5">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Author and metadata */}
      <div className="mt-auto px-5 py-3 border-t border-slate-800/70 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {note.author.name}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {note.author.college}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified</span>
        </span>
      </div>

      {/* Action Footer */}
      <div className="px-5 py-2.5 bg-slate-900/90 border-t border-slate-800/90 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" title={`${note.downloads} downloads`}>
            <Download className="w-3 h-3 text-slate-400" />
            <span>{note.downloads}</span>
          </span>
          <span className="flex items-center gap-1" title={`${note.pages} pages (${note.fileSize})`}>
            <Layers className="w-3 h-3 text-slate-400" />
            <span>{note.pages}p</span>
          </span>
          <button
            onClick={handleUpvote}
            title={isUpvoted ? 'Upvoted' : 'Upvote this note'}
            className={`flex items-center gap-1 transition-colors ${
              isUpvoted ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ThumbsUp className={`w-3 h-3 ${isUpvoted ? 'fill-sky-400' : ''}`} />
            <span>{note.upvotes}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(note);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          {canDelete && (
            confirmDelete ? (
              <div className="flex items-center gap-1 bg-rose-950/90 border border-rose-800 px-1.5 py-0.5 rounded-md">
                <span className="text-[10px] text-rose-300 font-bold">Del?</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="px-1.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  Yes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                title="Delete uploaded note"
                className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )
          )}

          <button
            onClick={handleDownload}
            disabled={downloadState === 'downloading'}
            title="Download PDF directly to your device"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-white transition-colors shadow-sm cursor-pointer ${
              downloadState === 'done'
                ? 'bg-emerald-600'
                : downloadState === 'downloading'
                ? 'bg-sky-600 opacity-80 cursor-wait'
                : 'bg-sky-500 hover:bg-sky-400'
            }`}
          >
            {downloadState === 'downloading' ? (
              <>
                <span className="w-2.5 h-2.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : downloadState === 'done' ? (
              <>
                <CheckCircle className="w-3 h-3" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
