import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X, Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { ProjectGenerationInput, ProjectGenerationInputSchema, SystemHealthResponse } from 'shared';
import { apiService } from '../services/api';

interface SkillFormProps {
  onSubmitSuccess: (data: any, input: any) => void;
}

export default function SkillForm({ onSubmitSuccess }: SkillFormProps) {
  // AI health status overrides
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('template');
  const [selectedModel, setSelectedModel] = useState<string>('local-templates-v1.0');
  const [manualOverride, setManualOverride] = useState(false);

  // Custom skills & frameworks typed additions
  const [newSkill, setNewSkill] = useState('');
  const [newFramework, setNewFramework] = useState('');

  // Loading Pipeline Overlay State
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeAbortController, setActiveAbortController] = useState<AbortController | null>(null);

  const loadingSteps = [
    { title: 'Detecting Active AI Providers', desc: 'Pinging local endpoints and cloud gateways...' },
    { title: 'Model Selection & Load Balancing', desc: 'Validating model sizes and queue workloads...' },
    { title: 'Assembling System Prompts', desc: 'Compiling structural few-shot templates...' },
    { title: 'Executing Large Language Model', desc: 'Generating detailed architectural schemas...' },
    { title: 'Validating Structural Output JSON', desc: 'Running Zod checks against schema configurations...' },
    { title: 'Finalizing Blueprint Rendering', desc: 'Compiling cards, folder structures, and resume bullets...' }
  ];

  // Initialize React Hook Form with Zod schema resolution
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectGenerationInput>({
    resolver: zodResolver(ProjectGenerationInputSchema),
    defaultValues: {
      fullName: '',
      skills: ['TypeScript', 'Python', 'Go'],
      frameworks: ['React', 'Express', 'FastAPI'],
      careerGoal: 'full_stack',
      domain: 'ai_rag',
      difficulty: 'advanced',
      duration: '2_4_weeks',
      teamConfig: 'solo'
    }
  });

  const skills = watch('skills') || [];
  const frameworks = watch('frameworks') || [];
  const activeDifficulty = watch('difficulty');
  const activeTeamConfig = watch('teamConfig');
  const activeCareerGoal = watch('careerGoal');

  // Load backend health details on init
  useEffect(() => {
    const fetchHealthInit = async () => {
      try {
        const prefProvider = localStorage.getItem('projectpilot_pref_provider') || undefined;
        const prefModel = localStorage.getItem('projectpilot_pref_model') || undefined;
        const response = await apiService.fetchHealth(prefProvider, prefModel);
        if (response.success && response.data) {
          setHealth(response.data);
          setSelectedProvider(response.data.activeProvider);
          setSelectedModel(response.data.selectedModel);
        }
      } catch (e) {
        console.warn('[SkillForm] Failed to fetch system health on load:', e);
      }
    };
    fetchHealthInit();
  }, []);

  // Fetch models dynamically when manual provider override changes
  useEffect(() => {
    if (manualOverride && selectedProvider !== 'template') {
      const fetchModels = async () => {
        try {
          const response = await apiService.fetchModels(selectedProvider);
          if (response.success && response.data && Array.isArray(response.data.models)) {
            if (!response.data.models.includes(selectedModel)) {
              setSelectedModel(response.data.models[0] || 'default');
            }
          }
        } catch (e) {
          console.warn('[SkillForm] Failed to fetch models list for manual provider override:', e);
        }
      };
      fetchModels();
    } else if (selectedProvider === 'template') {
      setSelectedModel('local-templates-v1.0');
    }
  }, [selectedProvider, manualOverride]);

  // Sync active models list
  const activeModels = health?.providers[selectedProvider as keyof typeof health.providers]?.models || [];

  // Tag helper modifiers
  const handleAddSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setValue('skills', updated, { shouldValidate: true });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setValue('skills', updated, { shouldValidate: true });
  };

  const handleAddFramework = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (newFramework.trim() && !frameworks.includes(newFramework.trim())) {
      const updated = [...frameworks, newFramework.trim()];
      setValue('frameworks', updated, { shouldValidate: true });
      setNewFramework('');
    }
  };

  const handleRemoveFramework = (index: number) => {
    const updated = frameworks.filter((_, i) => i !== index);
    setValue('frameworks', updated, { shouldValidate: true });
  };

  // Submit trigger
  const onSubmit = async (data: ProjectGenerationInput) => {
    setLoading(true);
    setLoadingStep(0);
    setErrorMsg(null);

    const controller = new AbortController();
    setActiveAbortController(controller);

    // Multi-step loading pipeline simulation
    const advanceStep = async (step: number) => {
      setLoadingStep(step);
      await new Promise(r => setTimeout(r, 600));
    };

    try {
      await advanceStep(0); // Detect Provider
      await advanceStep(1); // Model Selection
      await advanceStep(2); // Prompt generation
      await advanceStep(3); // LLM execution

      // Build payload matching configured preferences
      const savedProvider = localStorage.getItem('projectpilot_pref_provider') || undefined;
      const savedModel = localStorage.getItem('projectpilot_pref_model') || undefined;

      const payload = {
        ...data,
        providerOverride: manualOverride ? selectedProvider : savedProvider,
        modelOverride: manualOverride ? selectedModel : savedModel
      };

      const response = await apiService.generateProjects(payload, controller.signal);
      
      await advanceStep(4); // JSON validation
      await advanceStep(5); // Rendering complete

      setLoading(false);
      onSubmitSuccess(response.data, data);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[SkillForm] Generation aborted by the user.');
        return;
      }
      console.error('[SkillForm] Generation failed:', err);
      setErrorMsg(err.message || 'An error occurred during project generation.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Loading pipeline overlay container */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 animate-fadeIn">
          <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-indigo-500/30 shadow-2xl">
            <h3 className="font-display text-xl font-bold text-textPrimary text-center mb-1">Generating Blueprints</h3>
            <p className="text-textSecondary text-xs text-center mb-6">Structuring optimal deployment pathways</p>
            
            {errorMsg ? (
              <div className="space-y-4">
                <div className="flex gap-2.5 p-3 rounded-lg bg-red-950/30 border border-red-800 text-red-400 text-xs items-start">
                  <AlertCircle className="shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-bold">Generation Failed: </span>
                    {errorMsg}
                  </div>
                </div>
                <button
                  onClick={() => setLoading(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-all text-xs cursor-pointer"
                >
                  Dismiss & Edit Form
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {loadingSteps.map((step, idx) => {
                  const isDone = loadingStep > idx;
                  const isCurrent = loadingStep === idx;
                  return (
                    <div key={idx} className={`flex items-start gap-3 transition-opacity duration-300 ${isDone || isCurrent ? 'opacity-100' : 'opacity-35'}`}>
                      <div className="mt-0.5">
                        {isDone ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        ) : isCurrent ? (
                          <Loader2 className="animate-spin text-indigo-500" size={18} />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-cardBorder bg-slate-900" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${isCurrent ? 'text-indigo-400 dark:text-indigo-300' : 'text-textPrimary'}`}>
                          {step.title}
                        </h4>
                        {isCurrent && <p className="text-xs text-textSecondary mt-0.5">{step.desc}</p>}
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => {
                    activeAbortController?.abort();
                    setLoading(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 text-xs font-semibold transition-all mt-4 cursor-pointer"
                >
                  Cancel Generation
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Profile Input Form */}
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-extrabold text-textPrimary tracking-tight sm:text-4xl">
          Construct Your Profile
        </h2>
        <p className="mt-2 text-sm text-textSecondary max-w-md mx-auto">
          Enter your current skills, domain configurations, and career preferences to formulate your custom blueprints.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 glass-card rounded-2xl p-6 sm:p-8">
        {/* Profile Block */}
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-indigo-500 border-b border-cardBorder pb-2">
            1. Core Developer Profile
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Display Name / Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register('fullName')}
                placeholder="e.g., Jane Doe"
                className="w-full rounded-xl bg-inputBg border border-cardBorder px-4 py-3 text-sm text-textPrimary placeholder-textSecondary focus:border-indigo-500 focus:outline-none"
              />
              {errors.fullName && (
                <span className="text-xs text-red-500 mt-1 block">{errors.fullName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Target Career Goal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'sde_1', label: 'SDE 1' },
                  { key: 'aiml_engineer', label: 'AI/ML Eng' },
                  { key: 'full_stack', label: 'Full Stack' },
                  { key: 'devops_cloud', label: 'DevOps / Cloud' }
                ].map(item => (
                  <label
                    key={item.key}
                    className={`flex items-center justify-center py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                      activeCareerGoal === item.key
                        ? 'bg-indigo-950/30 border-indigo-500 text-indigo-500'
                        : 'bg-slate-900/40 border-cardBorder text-textSecondary hover:border-indigo-500/50 hover:text-textPrimary'
                    }`}
                  >
                    <input
                      type="radio"
                      value={item.key}
                      {...register('careerGoal')}
                      className="sr-only"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Skill lists */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
              Languages & Technologies (Type & Press Enter)
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-inputBg border border-cardBorder min-h-12 items-center">
              {skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-indigo-950/50 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(index)} className="hover:text-textPrimary transition-colors cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSkill(e);
                }}
                placeholder="Add skill..."
                className="bg-transparent border-none text-xs text-textPrimary placeholder-textSecondary focus:outline-none flex-grow min-w-24 px-1"
              />
              <button type="button" onClick={handleAddSkill} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer">
                <Plus size={14} />
              </button>
            </div>
            {errors.skills && (
              <span className="text-xs text-red-500 mt-1 block">{errors.skills.message}</span>
            )}
          </div>

          {/* Framework lists */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
              Frameworks & Tools (Type & Press Enter)
            </label>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-inputBg border border-cardBorder min-h-12 items-center">
              {frameworks.map((fw, index) => (
                <span key={index} className="inline-flex items-center gap-1 bg-violet-950/50 text-violet-400 border border-violet-500/30 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {fw}
                  <button type="button" onClick={() => handleRemoveFramework(index)} className="hover:text-textPrimary transition-colors cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newFramework}
                onChange={(e) => setNewFramework(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddFramework(e);
                }}
                placeholder="Add framework..."
                className="bg-transparent border-none text-xs text-textPrimary placeholder-textSecondary focus:outline-none flex-grow min-w-24 px-1"
              />
              <button type="button" onClick={handleAddFramework} className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer">
                <Plus size={14} />
              </button>
            </div>
            {errors.frameworks && (
              <span className="text-xs text-red-500 mt-1 block">{errors.frameworks.message}</span>
            )}
          </div>
        </div>

        {/* Structural Preferences */}
        <div className="space-y-6">
          <h3 className="font-display text-lg font-bold text-indigo-500 border-b border-cardBorder pb-2">
            2. Structural Requirements
          </h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="domain" className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Preferred Technical Domain
              </label>
              <select
                id="domain"
                {...register('domain')}
                className="w-full rounded-xl bg-inputBg border border-cardBorder px-4 py-3 text-sm text-textPrimary focus:border-indigo-500 focus:outline-none"
              >
                <option value="ai_rag">AI Agents / RAG Pipelines</option>
                <option value="dev_tools">Developer Productivity Tools</option>
                <option value="distributed_systems">Distributed Systems & Protocols</option>
                <option value="saas">Multi-Tenant SaaS Blueprints</option>
                <option value="automation">Infrastructure & CI/CD Automation</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Estimated Sprint Duration
              </label>
              <select
                id="duration"
                {...register('duration')}
                className="w-full rounded-xl bg-inputBg border border-cardBorder px-4 py-3 text-sm text-textPrimary focus:border-indigo-500 focus:outline-none"
              >
                <option value="1_week">1 Week Sprint (Prototypes)</option>
                <option value="2_4_weeks">2-4 Weeks Sprint (Standard Project)</option>
                <option value="1_2_months">1-2 Months (Full Capstone Blueprint)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Project Difficulty Level
              </label>
              <div className="flex bg-slate-900/60 border border-cardBorder p-1 rounded-xl">
                {[
                  { key: 'intermediate', label: 'Intermediate' },
                  { key: 'advanced', label: 'Advanced' },
                  { key: 'production_enterprise', label: 'Production Grade' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setValue('difficulty', item.key as any, { shouldValidate: true })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeDifficulty === item.key
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                Team Configuration
              </label>
              <div className="flex bg-slate-900/60 border border-cardBorder p-1 rounded-xl">
                {[
                  { key: 'solo', label: 'Solo Developer' },
                  { key: 'team', label: 'Team (2-4 Developers)' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setValue('teamConfig', item.key as any, { shouldValidate: true })}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeTeamConfig === item.key
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-textSecondary hover:text-textPrimary'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* AI Overrides section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-cardBorder pb-2">
            <h3 className="font-display text-lg font-bold text-indigo-500">
              3. Model Override Controls
            </h3>
            <button
              type="button"
              onClick={() => setManualOverride(!manualOverride)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              {manualOverride ? 'Disable Manual Override' : 'Configure Custom Model'}
            </button>
          </div>

          {manualOverride && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                  Active Provider Target
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    setSelectedProvider(e.target.value);
                    const models = health?.providers[e.target.value as keyof typeof health.providers]?.models || [];
                    setSelectedModel(models[0] || 'default');
                  }}
                  className="w-full rounded-xl bg-inputBg border border-cardBorder px-4 py-3 text-sm text-textPrimary focus:border-indigo-500 focus:outline-none"
                >
                  <option value="ollama">Ollama (Local)</option>
                  <option value="lmstudio">LM Studio (Local)</option>
                  <option value="huggingface">Hugging Face (Cloud)</option>
                  <option value="groq">Groq Cloud (SaaS)</option>
                  <option value="template">Template Engine (Offline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textSecondary mb-2">
                  Selected Model Target
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl bg-inputBg border border-cardBorder px-4 py-3 text-sm text-textPrimary focus:border-indigo-500 focus:outline-none"
                >
                  {activeModels.length === 0 ? (
                    <option value="default">No Models Found (Standard Fallback)</option>
                  ) : (
                    activeModels.map((m, idx) => (
                      <option key={idx} value={m}>{m}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full glow-btn inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          Formulate Technical Blueprints
        </button>
      </form>
    </div>
  );
}
