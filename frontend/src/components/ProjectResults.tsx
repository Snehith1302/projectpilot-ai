import { useState, useEffect } from 'react';
import { Search, Bookmark, ArrowLeft, BarChart3, Star, Compass, AlertCircle, X } from 'lucide-react';
import { ProjectBlueprint, ProjectGenerationResponse } from 'shared';

interface ProjectResultsProps {
  response: ProjectGenerationResponse;
  onNavigateBack: () => void;
  onSelectProject: (projectId: string) => void;
}

export default function ProjectResults({ response, onNavigateBack, onSelectProject }: ProjectResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');
  
  // Bookmarks state (persisted to localStorage)
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  // Comparison list
  const [compareList, setCompareList] = useState<ProjectBlueprint[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('projectpilot_bookmarks');
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleBookmark = (id: string) => {
    let nextBookmarks: string[];
    if (bookmarks.includes(id)) {
      nextBookmarks = bookmarks.filter(b => b !== id);
    } else {
      nextBookmarks = [...bookmarks, id];
    }
    setBookmarks(nextBookmarks);
    localStorage.setItem('projectpilot_bookmarks', JSON.stringify(nextBookmarks));
  };

  const toggleCompare = (project: ProjectBlueprint) => {
    if (compareList.some(p => p.id === project.id)) {
      setCompareList(compareList.filter(p => p.id !== project.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 projects at once.');
        return;
      }
      setCompareList([...compareList, project]);
    }
  };

  // Filter recommendations based on controls
  const filteredProjects = response.projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = selectedDifficulty === 'all' || 
      project.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesDomain = selectedDomain === 'all' || 
      project.domain.toLowerCase().includes(selectedDomain.toLowerCase());

    return matchesSearch && matchesDifficulty && matchesDomain;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Fallback Banner Alert */}
      {response.activeProvider === 'template' && (
        <div className="mb-6 flex gap-3 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 text-amber-300 text-sm">
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
          <div>
            <span className="font-bold">Offline Template Fallback:</span> All primary AI services were unreachable. 
            We have served highly optimized blueprint recommendations from our offline template database matching your profile.
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="glass-card rounded-2xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h3 className="font-display font-bold text-white text-base">Generated Blueprints</h3>
            <p className="text-slate-400 text-xs">5 curated projects ranked by index scores</p>
          </div>
        </div>

        {/* Filters and search inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, tech stacks..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="production grade">Production Grade</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Domains</option>
            <option value="ai">AI / RAG</option>
            <option value="saas">SaaS Systems</option>
            <option value="distributed">Distributed Systems</option>
            <option value="dev">Dev Tools</option>
            <option value="automation">Automation</option>
          </select>
        </div>
      </div>

      {/* Recommendations Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-slate-800">
          <AlertCircle className="mx-auto text-slate-600 mb-4 animate-bounce" size={48} />
          <h4 className="font-display font-semibold text-white text-lg">No Matching Blueprints</h4>
          <p className="text-slate-400 text-sm mt-1">Try resetting the difficulty or keyword search criteria filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isBookmarked = bookmarks.includes(project.id);
            const isCompareSelected = compareList.some(p => p.id === project.id);
            return (
              <div key={project.id} className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between h-full relative group">
                {/* Bookmarking Action */}
                <button
                  type="button"
                  onClick={() => toggleBookmark(project.id)}
                  className={`absolute right-4 top-4 p-1.5 rounded-lg border transition-all ${
                    isBookmarked
                      ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  <Bookmark size={15} className={isBookmarked ? 'fill-indigo-400' : ''} />
                </button>

                <div className="space-y-4">
                  {/* Category and Metrics */}
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded-md border border-indigo-950">
                    {project.domain}
                  </span>

                  <h4 className="font-display font-bold text-white text-lg group-hover:text-indigo-300 transition-colors pr-6">
                    {project.title}
                  </h4>

                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {project.tagline}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech, idx) => (
                      <span key={idx} className="text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score meters grid */}
                <div className="grid grid-cols-3 gap-2 my-5 py-3 border-y border-slate-800/60 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Resume</span>
                    <span className="font-display font-bold text-sm text-indigo-300 flex justify-center items-center gap-0.5">
                      <BarChart3 size={11} className="text-indigo-400" />
                      {project.resumeScore}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Placement</span>
                    <span className="font-display font-bold text-sm text-violet-300 flex justify-center items-center gap-0.5">
                      <Star size={11} className="text-violet-400 fill-violet-400/20" />
                      {project.placementScore}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Innovation</span>
                    <span className="font-display font-bold text-sm text-cyan-300 flex justify-center items-center gap-0.5">
                      <Compass size={11} className="text-cyan-400" />
                      {project.innovationScore}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProject(project.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all text-center"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={() => toggleCompare(project)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      isCompareSelected
                        ? 'bg-indigo-950 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-500/10'
                        : 'bg-transparent border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Compare
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Persistent Compare Dock bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[90%] glass-card rounded-2xl p-4 border border-indigo-500/30 shadow-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white font-bold text-xs">
              {compareList.length}
            </div>
            <div>
              <h5 className="font-display font-bold text-white text-xs">Project Comparison List</h5>
              <p className="text-slate-400 text-[10px]">{compareList.length === 1 ? 'Select one more to compare' : 'Ready to compare details'}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {compareList.length >= 2 && (
              <button
                onClick={() => setShowCompareModal(true)}
                className="py-1.5 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
              >
                Compare Side-by-Side
              </button>
            )}
            <button
              onClick={() => setCompareList([])}
              className="py-1.5 px-3.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Comparison Modal Overlay */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-darkBg/95 backdrop-blur-md px-4">
          <div className="glass-card max-w-4xl w-full rounded-2xl p-6 md:p-8 border border-indigo-500/20 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Compare Architecture Complexity</h3>
                <p className="text-slate-400 text-xs">Performance, resume, and technical impact ratings comparison</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4 font-semibold uppercase">Feature Metric</th>
                    {compareList.map(p => (
                      <th key={p.id} className="py-3 px-4 font-display font-bold text-white text-sm">{p.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Resume Impact Score</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-indigo-400 font-bold">{p.resumeScore}/100</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Placement Readiness</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-violet-400 font-bold">{p.placementScore}/100</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Innovation Quotient</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-cyan-400 font-bold">{p.innovationScore}/100</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Tech Stack</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-slate-300">
                        <div className="flex flex-wrap gap-1">
                          {p.techStack.map((t, i) => (
                            <span key={i} className="bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[10px]">{t}</span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Complexity & Level</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-slate-300">{p.difficulty}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-slate-300">Project Duration</td>
                    {compareList.map(p => (
                      <td key={p.id} className="py-3 px-4 text-slate-300">{p.duration}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
