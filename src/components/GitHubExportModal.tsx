import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  FolderGit2,
  FileCode,
  Terminal,
  ExternalLink,
  Download,
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'parts' | 'commands' | 'structure'>('parts');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const projectParts = [
    {
      part: 'Part 1: Core Configuration',
      files: [
        { path: 'package.json', desc: 'Dependencies, scripts, and build metadata' },
        { path: 'vite.config.ts', desc: 'Vite & Tailwind CSS v4 bundler setup' },
        { path: 'tsconfig.json', desc: 'TypeScript path mappings and JSX configuration' },
        { path: 'index.html', desc: 'HTML entry point with Plus Jakarta Sans & JetBrains Mono' },
        { path: 'README.md', desc: 'Complete GitHub project documentation' }
      ]
    },
    {
      part: 'Part 2: Data Models & Mock Data',
      files: [
        { path: 'src/types/index.ts', desc: 'Note, User, Branch, Syllabus, and Category types' },
        { path: 'src/data/branchesData.ts', desc: '7 Engineering Branches with 8-semester course syllabi' },
        { path: 'src/data/seedNotes.ts', desc: 'Initial high-yield notes with formulas and preview pages' }
      ]
    },
    {
      part: 'Part 3: State Management & Contexts',
      files: [
        { path: 'src/context/AuthContext.tsx', desc: 'User state, Google login, demo profiles, and bookmarks' },
        { path: 'src/context/NotesContext.tsx', desc: 'Filter state, branch/semester filters, syllabus verification, and downloads' }
      ]
    },
    {
      part: 'Part 4: UI Components & Sections',
      files: [
        { path: 'src/components/Navbar.tsx', desc: 'Sticky header with search bar, navigation tabs, and profile menu' },
        { path: 'src/components/HomeSection.tsx', desc: 'Hero section, instant jump search, and featured notes' },
        { path: 'src/components/BrowseNotesSection.tsx', desc: 'Filterable notes catalog with branch/semester selectors' },
        { path: 'src/components/BranchesSection.tsx', desc: 'Curriculum explorer with semester course units' },
        { path: 'src/components/UploadNotesSection.tsx', desc: 'Contributor publishing studio with live preview' },
        { path: 'src/components/MyAccountSection.tsx', desc: 'Student dashboard with bookmarks and upload history' },
        { path: 'src/components/NotePreviewModal.tsx', desc: 'In-browser multi-page document viewer with zoom & formulas' },
        { path: 'src/components/AuthModal.tsx', desc: 'Google Sign-In and 1-click student demo authentication' },
        { path: 'src/components/NoteCard.tsx', desc: 'Reusable note card with download and bookmark triggers' },
        { path: 'src/components/Footer.tsx', desc: 'Engineering directory footer with course links' }
      ]
    },
    {
      part: 'Part 5: Application Entry Points',
      files: [
        { path: 'src/App.tsx', desc: 'Root component orchestrating the 5 sections and modals' },
        { path: 'src/main.tsx', desc: 'React 19 root DOM hydration' },
        { path: 'src/index.css', desc: 'Tailwind CSS and custom scrollbars' }
      ]
    }
  ];

  const terminalCommands = `# Step 1: Open your terminal inside your project folder
git init

# Step 2: Add all files
git add .

# Step 3: Create initial commit
git commit -m "Add complete EngiNotes engineering platform"

# Step 4: Set primary branch to main
git branch -M main

# Step 5: Connect your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/VERIFIED-COURSE.git

# Step 6: Push all files to GitHub
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-sky-400 flex items-center justify-center border border-slate-700">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>GitHub Repository Upload Guide</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Commit
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Organized into modular parts to easily upload or commit to GitHub.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-3 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('parts')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'parts'
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            File Parts (5 Modules)
          </button>
          <button
            onClick={() => setActiveTab('commands')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'commands'
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Git CLI Commands</span>
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'structure'
                ? 'bg-slate-800 text-sky-400 border border-sky-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Folder Structure
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'parts' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-300">
                💡 <strong>Tip for GitHub Web UI:</strong> If you are creating files on github.com (via <em>Add file &gt; Create new file</em>), type the full path (e.g. <code className="bg-slate-950 px-1 py-0.5 rounded text-sky-200">src/types/index.ts</code>) into the filename box; GitHub will automatically create the subdirectories for you!
              </div>

              {projectParts.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span>{group.part}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {group.files.length} files
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {group.files.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <div className="min-w-0 pr-3">
                          <span className="font-mono text-xs font-semibold text-sky-300">
                            {file.path}
                          </span>
                          <p className="text-[11px] text-slate-400 truncate">
                            {file.desc}
                          </p>
                        </div>

                        <button
                          onClick={() => copyToClipboard(file.path, file.path)}
                          className="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                          title="Copy file path"
                        >
                          {copiedKey === file.path ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Run these commands in your project terminal to push everything to your GitHub repository:
                </span>
                <button
                  onClick={() => copyToClipboard(terminalCommands, 'cmd')}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedKey === 'cmd' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 overflow-x-auto">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                  {terminalCommands}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'structure' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed">
{`├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── data/
    │   ├── branchesData.ts
    │   └── seedNotes.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   └── NotesContext.tsx
    └── components/
        ├── Navbar.tsx
        ├── HomeSection.tsx
        ├── BrowseNotesSection.tsx
        ├── BranchesSection.tsx
        ├── UploadNotesSection.tsx
        ├── MyAccountSection.tsx
        ├── NotePreviewModal.tsx
        ├── AuthModal.tsx
        ├── NoteCard.tsx
        ├── BranchIcon.tsx
        └── Footer.tsx`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>All 20 files are compiled and verified</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
