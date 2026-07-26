import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import SkillForm from './components/SkillForm';
import ProjectResults from './components/ProjectResults';
import ProjectDetails from './components/ProjectDetails';
import SavedProjects from './components/SavedProjects';
import SettingsPage from './components/SettingsPage';
import { ProjectGenerationResponse } from 'shared';

// Layout wrapper for site structure
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-appBg text-textPrimary flex flex-col antialiased transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-cardBorder bg-slate-950/20 py-8 text-center text-xs text-textSecondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2">
          <p>&copy; {new Date().getFullYear()} ProjectPilot AI. All rights reserved.</p>
          <p>Built with React, TypeScript, Tailwind CSS v4, and Local LLM Architectures.</p>
        </div>
      </footer>
    </div>
  );
}

// Wrapper to parse projectId parameter and display details
function ProjectDetailsWrapper({
  generationResponse
}: {
  generationResponse: ProjectGenerationResponse | null;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Search in current generation first, then saved blueprints local storage
  let project = generationResponse?.projects.find(p => p.id === projectId);
  
  if (!project) {
    const saved = localStorage.getItem('projectpilot_saved_blueprints');
    if (saved) {
      try {
        const savedProjects = JSON.parse(saved);
        project = savedProjects.find((p: any) => p.id === projectId);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (!project) {
    // Fallback if not found anywhere
    return <Navigate to="/generate" replace />;
  }

  return (
    <ProjectDetails
      project={project}
      onBack={() => navigate(-1)}
    />
  );
}

export default function App() {
  const [generationResponse, setGenerationResponse] = useState<ProjectGenerationResponse | null>(null);

  // Load last generation from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem('projectpilot_current_generation');
    if (saved) {
      try {
        setGenerationResponse(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Load and apply theme on load
    const savedTheme = localStorage.getItem('projectpilot_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark', 'amoled-black');
    } else if (savedTheme === 'amoled') {
      document.documentElement.classList.add('dark', 'amoled-black');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('amoled-black');
    }
  }, []);

  const handleFormSubmitSuccess = (data: ProjectGenerationResponse, inputParams?: any) => {
    setGenerationResponse(data);
    localStorage.setItem('projectpilot_current_generation', JSON.stringify(data));

    // Save generation logs to history
    const histRaw = localStorage.getItem('projectpilot_history') || '[]';
    try {
      const historyList = JSON.parse(histRaw);
      const newHistoryItem = {
        id: `hist_${Date.now()}`,
        timestamp: new Date().toISOString(),
        input: inputParams || {
          fullName: 'Developer',
          skills: [],
          frameworks: [],
          domain: data.projects[0]?.domain || 'General',
          difficulty: 'advanced'
        },
        response: data
      };
      const updatedHistory = [newHistoryItem, ...historyList].slice(0, 20);
      localStorage.setItem('projectpilot_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to write local history metadata', e);
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/generate"
            element={
              <SkillFormWrapper
                onSubmitSuccess={handleFormSubmitSuccess}
              />
            }
          />
          <Route
            path="/projects"
            element={
              <ProjectResultsWrapper
                generationResponse={generationResponse}
              />
            }
          />
          <Route
            path="/projects/:projectId"
            element={
              <ProjectDetailsWrapper
                generationResponse={generationResponse}
              />
            }
          />
          <Route
            path="/saved"
            element={
              <SavedProjectsWrapper onSelectGeneration={(data) => setGenerationResponse(data)} />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPageWrapper />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// Intermediary components to allow useNavigate hook usage inside routers
function SkillFormWrapper({ onSubmitSuccess }: { onSubmitSuccess: (data: any, input: any) => void }) {
  const navigate = useNavigate();
  return (
    <SkillForm
      onSubmitSuccess={(data, input) => {
        onSubmitSuccess(data, input);
        navigate('/projects');
      }}
    />
  );
}

function ProjectResultsWrapper({ generationResponse }: { generationResponse: ProjectGenerationResponse | null }) {
  const navigate = useNavigate();
  if (!generationResponse) {
    return <Navigate to="/generate" replace />;
  }
  return (
    <ProjectResults
      response={generationResponse}
      onNavigateBack={() => navigate('/generate')}
      onSelectProject={(id) => navigate('/projects/' + id)}
    />
  );
}

function SavedProjectsWrapper({ onSelectGeneration }: { onSelectGeneration: (data: any) => void }) {
  const navigate = useNavigate();
  return (
    <SavedProjects
      onNavigateBack={() => navigate(-1)}
      onSelectProject={(id) => navigate('/projects/' + id)}
      onNavigateToProjects={() => {
        const current = localStorage.getItem('projectpilot_current_generation');
        if (current) {
          try {
            onSelectGeneration(JSON.parse(current));
          } catch (e) {
            console.error(e);
          }
        }
        navigate('/projects');
      }}
    />
  );
}

function SettingsPageWrapper() {
  const navigate = useNavigate();
  return (
    <SettingsPage
      onBack={() => navigate(-1)}
    />
  );
}
