import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  RotateCcw,
  BookOpen,
  ArrowUpDown,
  X,
  FileQuestion,
  Upload,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Note, SectionType } from '../types';
import { BRANCHES_DATA, NOTE_CATEGORIES } from '../data/branchesData';
import { NoteCard } from './NoteCard';
import { useNotes } from '../context/NotesContext';

interface BrowseNotesSectionProps {
  notes: Note[];
  initialSubjectFilter: string;
  onPreviewNote: (note: Note) => void;
  onNavigate: (section: SectionType) => void;
}

export const BrowseNotesSection: React.FC<BrowseNotesSectionProps> = ({
  initialSubjectFilter,
  onPreviewNote,
  onNavigate
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedBranch,
    setSelectedBranch,
    selectedSemester,
    setSelectedSemester,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredNotes,
    resetFilters
  } = useNotes();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState(initialSubjectFilter || '');
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);

  useEffect(() => {
    if (initialSubjectFilter) {
      setActiveSubjectFilter(initialSubjectFilter);
      setSearchQuery(initialSubjectFilter);
    }
  }, [initialSubjectFilter, setSearchQuery]);

  const handleClearSubjectFilter = () => {
    setActiveSubjectFilter('');
    setSearchQuery('');
  };

  const branchList = [
    { code: 'ALL', name: 'All Branches' },
    ...BRANCHES_DATA.map((b) => ({ code: b.code, name: b.name }))
  ];

  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  const hasActiveFilters =
    selectedBranch !== 'ALL' ||
    selectedSemester !== null ||
    selectedCategory !== 'ALL' ||
    searchQuery.trim() !== '' ||
    activeSubjectFilter !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Academic Library</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Browse Engineering Notes
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Filter by branch, semester, course, and note format with instant PDF previews.
          </p>
        </div>

        {/* View Mode & Upload CTA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onNavigate('upload')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Notes</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Search Input Row with Sort */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by note title, subject, formula, or author..."
              className="w-full bg-slate-950/80 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto appearance-none bg-slate-950/80 text-slate-200 text-xs font-semibold pl-8 pr-8 py-2.5 rounded-xl border border-slate-800 focus:border-sky-500 focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Downloaded</option>
                <option value="upvotes">Most Helpful (Upvotes)</option>
                <option value="newest">Recently Uploaded</option>
                <option value="pages">Most Comprehensive (Pages)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-3.5 text-slate-400 pointer-events-none" />
              <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3.5 text-slate-400 pointer-events-none" />
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => {
                  resetFilters();
                  handleClearSubjectFilter();
                }}
                title="Reset all filters"
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Branch Filter Tabs */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Branch / Department</span>
            {selectedBranch !== 'ALL' && (
              <span className="text-sky-400 font-bold">{selectedBranch} selected</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {branchList.map((branch) => {
              const isSelected = selectedBranch === branch.code;
              return (
                <button
                  key={branch.code}
                  onClick={() => setSelectedBranch(branch.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {branch.code === 'ALL' ? 'All Branches' : branch.code}
                </button>
              );
            })}
          </div>
        </div>

        {/* Semester & Category Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
          {/* Semester Selector */}
          <div>
            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
              <span>Semester</span>
              {selectedSemester !== null && (
                <button
                  onClick={() => setSelectedSemester(null)}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Clear Sem
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedSemester(null)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  selectedSemester === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Sem
              </button>
              {semestersList.map((sem) => {
                const isSelected = selectedSemester === sem;
                return (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Sem {sem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
              <span>Material Type</span>
              {selectedCategory !== 'ALL' && (
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="text-xs text-sky-400 hover:underline"
                >
                  Clear Category
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                All Types
              </button>
              {NOTE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Subject Filter Badge */}
        {activeSubjectFilter && (
          <div className="flex items-center gap-2 p-2 bg-sky-500/10 border border-sky-500/30 rounded-xl text-xs text-sky-300">
            <span>Filtering for subject: <strong>{activeSubjectFilter}</strong></span>
            <button
              onClick={handleClearSubjectFilter}
              className="ml-auto p-1 text-sky-400 hover:text-white rounded-md bg-sky-500/20"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <strong className="text-slate-200">{filteredNotes.length}</strong> engineering note
          {filteredNotes.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Notes Grid or List */}
      {filteredNotes.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onPreview={onPreviewNote}
              variant={viewMode}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800 rounded-3xl max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-sky-400 flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">No notes found</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            We couldn't find any documents matching your current filters. Try resetting your search or branch selection.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                resetFilters();
                handleClearSubjectFilter();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              onClick={() => onNavigate('upload')}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Notes for this Subject</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
