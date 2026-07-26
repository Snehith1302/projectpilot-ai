import { useState, useEffect } from 'react';
import { Save, RefreshCw, Check, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiService } from '../services/api';

interface SettingsPageProps {
  onBack: () => void;
}

export default function SettingsPage({ onBack }: SettingsPageProps) {
  const [theme, setTheme] = useState('dark');
  const [prefProvider, setPrefProvider] = useState('ollama');
  const [prefModel, setPrefModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [timeout, setTimeoutVal] = useState(30);
  const [retries, setRetries] = useState(1);
  const [offlineTemplates, setOfflineTemplates] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const applyTheme = (currentTheme: string) => {
    if (currentTheme === 'light') {
      document.documentElement.classList.remove('dark', 'amoled-black');
    } else if (currentTheme === 'amoled') {
      document.documentElement.classList.add('dark', 'amoled-black');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('amoled-black');
    }
  };

  // 1. Fetch models when provider changes
  useEffect(() => {
    const fetchProviderModels = async () => {
      setLoadingModels(true);
      try {
        const response = await apiService.fetchModels(prefProvider);
        if (response.success && response.data && Array.isArray(response.data.models)) {
          setAvailableModels(response.data.models);
          // If the cached preferred model is not in this provider's list, select the first one
          if (!response.data.models.includes(prefModel)) {
            setPrefModel(response.data.models[0] || '');
          }
        } else {
          setAvailableModels([]);
        }
      } catch (e) {
        console.warn(`[Settings] Failed to fetch models for provider ${prefProvider}:`, e);
        setAvailableModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    if (prefProvider === 'template') {
      setAvailableModels(['local-templates-v1.0']);
      setPrefModel('local-templates-v1.0');
      setLoadingModels(false);
    } else {
      fetchProviderModels();
    }
  }, [prefProvider]);

  // 2. Load configurations from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('projectpilot_theme') || localStorage.getItem('projectpilot_pref_theme') || 'dark';
    const savedProvider = localStorage.getItem('projectpilot_pref_provider') || localStorage.getItem('projectpilot_default_provider') || 'ollama';
    const savedModel = localStorage.getItem('projectpilot_pref_model') || '';
    const savedTimeout = localStorage.getItem('projectpilot_pref_timeout') || localStorage.getItem('projectpilot_timeout') || '30';
    const savedRetries = localStorage.getItem('projectpilot_pref_retries') || '1';
    const savedTemplates = localStorage.getItem('projectpilot_offline_templates') !== 'false';

    setTheme(savedTheme);
    applyTheme(savedTheme);
    setPrefProvider(savedProvider);
    setPrefModel(savedModel);
    setTimeoutVal(parseInt(savedTimeout, 10));
    setRetries(parseInt(savedRetries, 10));
    setOfflineTemplates(savedTemplates);
  }, []);

  const handleSave = () => {
    localStorage.setItem('projectpilot_theme', theme);
    localStorage.setItem('projectpilot_pref_theme', theme);
    localStorage.setItem('projectpilot_pref_provider', prefProvider);
    localStorage.setItem('projectpilot_pref_model', prefModel);
    localStorage.setItem('projectpilot_pref_timeout', timeout.toString());
    localStorage.setItem('projectpilot_pref_retries', retries.toString());
    localStorage.setItem('projectpilot_offline_templates', offlineTemplates.toString());

    applyTheme(theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setTheme('dark');
    applyTheme('dark');
    setPrefProvider('ollama');
    setPrefModel('');
    setTimeoutVal(30);
    setRetries(1);
    setOfflineTemplates(true);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Application Settings
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Configure default AI interfaces, system fallback thresholds, and layout preferences.
        </p>
      </div>

      <div className="space-y-6 glass-card rounded-2xl p-6 sm:p-8 border border-cardBorder/30">
        
        {/* Theme Settings */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Visual Theme Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: 'light', label: 'Light Clean (Minimal)' },
              { key: 'dark', label: 'Dark Default (Slate/Indigo)' },
              { key: 'amoled', label: 'Amoled Black (Contrast)' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setTheme(item.key)}
                className={`py-3 px-4 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all ${
                  theme === item.key
                    ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400 dark:text-indigo-300 shadow'
                    : 'bg-slate-900/40 dark:bg-slate-900 border-cardBorder text-textSecondary hover:border-indigo-500/50 hover:text-textPrimary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Default Provider select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Primary AI Gateway Target
          </label>
          <select
            value={prefProvider}
            onChange={(e) => setPrefProvider(e.target.value)}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none"
          >
            <option value="ollama">Ollama (Localhost Engine)</option>
            <option value="lmstudio">LM Studio (Localhost endpoint)</option>
            <option value="huggingface">Hugging Face (Cloud Client)</option>
            <option value="groq">Groq Cloud (REST API Gateway)</option>
            <option value="template">Static Offline Template Database</option>
          </select>
        </div>

        {/* Dynamic Model select */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Preferred Model
          </label>
          {loadingModels ? (
            <div className="text-xs text-textSecondary animate-pulse py-2">Loading active models list...</div>
          ) : availableModels.length > 0 ? (
            <select
              value={prefModel}
              onChange={(e) => setPrefModel(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none"
            >
              {availableModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={prefModel}
              onChange={(e) => setPrefModel(e.target.value)}
              placeholder="e.g. llama3.1:latest"
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none"
            />
          )}
          <span className="text-[10px] text-slate-500 mt-1 block">Specify the targeted neural model tags.</span>
        </div>

        {/* Retry Count */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Zod Validation Retry Counts
          </label>
          <select
            value={retries}
            onChange={(e) => setRetries(parseInt(e.target.value, 10))}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-white focus:outline-none"
          >
            <option value={0}>0 - No Retries (Fail Immediately)</option>
            <option value={1}>1 - Single Retry Attempt (Recommended)</option>
            <option value={2}>2 - Two Retry Loops</option>
            <option value={3}>3 - Maximum Recovery Loops</option>
          </select>
        </div>

        {/* Timeout Slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              API Generation Timeout
            </label>
            <span className="text-xs font-mono text-indigo-400 font-bold">{timeout} seconds</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            value={timeout}
            onChange={(e) => setTimeoutVal(parseInt(e.target.value, 10))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="text-[10px] text-slate-500 mt-1 block">Maximum elapsed time allowed before executing provider fallback routing.</span>
        </div>

        {/* Offline Template Toggle */}
        <div className="flex items-center justify-between py-3 border-y border-slate-800/60">
          <div>
            <h5 className="text-xs font-bold text-slate-300">Offline Fallback Templates</h5>
            <p className="text-[10px] text-slate-500 mt-0.5">Toggle fallback to pre-written curations database if AI times out.</p>
          </div>
          <button
            onClick={() => setOfflineTemplates(!offlineTemplates)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {offlineTemplates ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-slate-600" />}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="flex-grow glow-btn inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3.5 text-xs font-semibold text-white shadow-lg hover:shadow-indigo-500/20 transition-all"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? 'Settings Saved' : 'Save Configurations'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 text-xs font-medium transition-all"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={onBack}
            className="px-4 py-3.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white bg-slate-900/40 hover:bg-slate-900 text-xs font-medium transition-all"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
