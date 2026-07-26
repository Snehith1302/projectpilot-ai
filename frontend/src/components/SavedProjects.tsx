import { useState, useEffect } from 'react';
import { Bookmark, BarChart3, Star, Compass, ArrowLeft, Trash2, Clock, Check } from 'lucide-react';
import { ProjectBlueprint, ProjectGenerationResponse } from 'shared';

interface SavedProjectsProps {
  onNavigateBack: () => void;
  onSelectProject: (projectId: string) => void;
  onNavigateToProjects: () => void;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  input: {
    fullName: string;
    skills: string[];
    frameworks: string[];
    domain: string;
    difficulty: string;
  };
  response: ProjectGenerationResponse;
}

export default function SavedProjects({ onNavigateBack, onSelectProject, onNavigateToProjects }: SavedProjectsProps) {
  const [savedProjects, setSavedProjects] = useState<ProjectBlueprint[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'history'>('bookmarks');

  useEffect(() => {
    // 1. Load bookmarked blueprints
    const saved = localStorage.getItem('projectpilot_saved_blueprints');
    if (saved) {
      try {
        setSavedProjects(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved blueprints', e);
      }
    }

    // 2. Load generation history
    const hist = localStorage.getItem('projectpilot_history');
    if (hist) {
      try {
        setHistory(JSON.parse(hist));
      } catch (e) {
        console.error('Error loading history list', e);
      }
    }
  }, []);

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedProjects.filter(p => p.id !== id);
    setSavedProjects(updated);
    localStorage.setItem('projectpilot_saved_blueprints', JSON.stringify(updated));

    // Also update bookmarks IDs array
    const bookmarksIds = JSON.parse(localStorage.getItem('projectpilot_bookmarks') || '[]');
    const updatedIds = bookmarksIds.filter((bId: string) => bId !== id);
    localStorage.setItem('projectpilot_bookmarks', JSON.stringify(updatedIds));
  };

  const removeHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('projectpilot_history', JSON.stringify(updated));
  };

  const loadHistoryGeneration = (item: HistoryItem) => {
    localStorage.setItem('projectpilot_current_generation', JSON.stringify(item.response));
    onNavigateToProjects();
  };

  const clearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem('projectpilot_history');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Toolbar */}
      <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-lg border border-slate-800 text-textSecondary hover:text-textPrimary hover:bg-slate-800/50 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="font-display font-bold text-textPrimary text-base">Bookmarks & History</h3>
            <p className="text-textSecondary text-xs">Manage bookmarked blueprints and previous generations</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/60 dark:bg-slate-950 p-1 rounded-xl border border-cardBorder">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Bookmark size={14} />
            Bookmarks ({savedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Clock size={14} />
            History ({history.length})
          </button>
        </div>
      </div>

      {activeTab === 'bookmarks' ? (
        /* BOOKMARKS TAB */
        savedProjects.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-cardBorder">
            <Bookmark className="mx-auto text-textSecondary mb-4 opacity-50" size={48} />
            <h4 className="font-display font-semibold text-textPrimary text-lg">No Saved Projects Yet</h4>
            <p className="text-textSecondary text-sm mt-1">Generate a project and click the bookmark icon to save blueprints here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between h-full relative group cursor-pointer border border-cardBorder/30"
              >
                {/* Delete Bookmark Action */}
                <button
                  type="button"
                  onClick={(e) => removeBookmark(project.id, e)}
                  className="absolute right-4 top-4 p-1.5 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  title="Remove Bookmark"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-4">
                  {/* Category and Metrics */}
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded-md border border-indigo-950/50">
                    {project.domain}
                  </span>

                  <h4 className="font-display font-bold text-textPrimary text-lg group-hover:text-indigo-400 dark:group-hover:text-indigo-300 transition-colors pr-6">
                    {project.title}
                  </h4>

                  <p className="text-textSecondary text-xs leading-relaxed line-clamp-3">
                    {project.tagline}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-900/60 dark:bg-slate-900 border border-cardBorder text-textSecondary px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score meters grid */}
                <div className="grid grid-cols-3 gap-2 my-5 py-3 border-y border-cardBorder text-center">
                  <div>
                    <span className="block text-[10px] text-textSecondary uppercase font-semibold">Resume</span>
                    <span className="font-display font-bold text-sm text-indigo-400 dark:text-indigo-300 flex justify-center items-center gap-0.5">
                      <BarChart3 size={11} className="text-indigo-500" />
                      {project.resumeScore}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-textSecondary uppercase font-semibold">Placement</span>
                    <span className="font-display font-bold text-sm text-violet-400 dark:text-violet-300 flex justify-center items-center gap-0.5">
                      <Star size={11} className="text-violet-500 fill-violet-500/20" />
                      {project.placementScore}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-textSecondary uppercase font-semibold">Innovation</span>
                    <span className="font-display font-bold text-sm text-cyan-400 dark:text-cyan-300 flex justify-center items-center gap-0.5">
                      <Compass size={11} className="text-cyan-500" />
                      {project.innovationScore}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all text-center"
                  >
                    View Full Specifications
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* HISTORY TAB */
        history.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-cardBorder">
            <Clock className="mx-auto text-textSecondary mb-4 opacity-50" size={48} />
            <h4 className="font-display font-semibold text-textPrimary text-lg">No Previous Generations</h4>
            <p className="text-textSecondary text-sm mt-1">Your generation history logs will be indexed here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={clearAllHistory}
                className="px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Trash2 size={12} />
                Clear All History
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadHistoryGeneration(item)}
                  className="glass-card glass-card-hover rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer relative group border border-cardBorder/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-textPrimary text-sm">{item.input.fullName || 'Anonymous Developer'}</span>
                      <span className="text-[10px] text-textSecondary">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-textSecondary">
                      <span>Goal: <strong className="text-indigo-400">{item.input.domain}</strong></span>
                      <span>•</span>
                      <span>Difficulty: <strong className="text-violet-400">{item.input.difficulty}</strong></span>
                      <span>•</span>
                      <span>Skills: <strong className="text-textPrimary">{item.input.skills.join(', ')}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={(e) => removeHistoryItem(item.id, e)}
                      className="p-2 rounded-lg border border-slate-800 text-textSecondary hover:text-red-400 hover:bg-red-950/20 hover:border-red-500/20 transition-colors"
                      title="Remove Record"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      className="flex-1 md:flex-none py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <Check size={12} />
                      Reload Generation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
