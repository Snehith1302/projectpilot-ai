import { useNavigate } from 'react-router-dom';
import { ArrowRight, Cpu, Code2, Copy, FileCode2, HardDrive, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-radial min-h-screen">
      {/* Background decorative glows */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -z-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/50 text-indigo-300 border border-indigo-500/20 mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          100% Offline Capable via Local LLMs
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-textPrimary max-w-4xl mx-auto leading-tight"
        >
          Generate <span className="text-gradient">Industry-Level Software Projects</span> for Off-Campus Placements
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-textSecondary max-w-2xl mx-auto leading-relaxed"
        >
          Stop building To-Do apps. Generate production-ready multi-agent architectures, RAG pipelines, and DevOps platforms tailored to your tech stack and career goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <button
            onClick={() => navigate('/generate')}
            className="glow-btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started / Generate Project
            <ArrowRight size={18} />
          </button>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-white transition-all"
          >
            Learn More
          </a>
        </motion.div>
      </div>

      {/* Feature Highlights Grid (3x2) */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-cardBorder" id="features">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary">
            Everything you need to stand out
          </h2>
          <p className="mt-4 text-textSecondary max-w-xl mx-auto">
            Our system generates exhaustive blueprints that help you code, understand, and explain complex projects during recruitment rounds.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Card 1: Multi-Provider Fallback */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 mb-5">
              <Cpu size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Multi-Provider Fallback</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Dynamically routes between local Ollama, LM Studio, Hugging Face, Groq, or our robust rule-based local Template Engine.
            </p>
          </motion.div>

          {/* Card 2: Zero Tutorial Clones */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 mb-5">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Zero Tutorial Clones Policy</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              No generic To-Do lists, simple calculators, or weather apps. Only complex multi-service production designs.
            </p>
          </motion.div>

          {/* Card 3: Complete Technical Blueprints */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 mb-5">
              <FileCode2 size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Complete Tech Blueprints</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Deep specs including detailed system architecture narratives, API endpoints, folder structures, and database schemas.
            </p>
          </motion.div>

          {/* Card 4: Placement & Resume Ready */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 mb-5">
              <Copy size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Placement & Resume Ready</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Get ATS-optimized resume bullet points and detailed interview preparation questions with hints to help you ace technical rounds.
            </p>
          </motion.div>

          {/* Card 5: Offline First Architecture */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-5">
              <HardDrive size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Offline First Architecture</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Build and generate without internet dependencies using local large language models running directly on your system.
            </p>
          </motion.div>

          {/* Card 6: Strict JSON Specifications */}
          <motion.div variants={itemVariants} className="glass-card glass-card-hover rounded-2xl p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-5">
              <Code2 size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-textPrimary mb-2">Strict JSON Blueprints</h3>
            <p className="text-textSecondary text-sm leading-relaxed">
              Ensures every output matches our unified data structure schemas exactly, guaranteeing deterministic visual parsing.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* How It Works (Timeline Visual) */}
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-cardBorder" id="how-it-works">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-textPrimary">How It Works</h2>
          <p className="mt-4 text-textSecondary max-w-xl mx-auto">Three simple steps to transition from student clone projects to production-grade blueprints.</p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical joining line */}
          <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-cardBorder md:left-1/2" />

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-white font-bold font-display shadow-lg shadow-indigo-500/30 animate-pulse">
                1
              </div>
              <div className="ml-16 md:ml-0 md:w-[45%] glass-card rounded-2xl p-6">
                <h4 className="font-display font-bold text-textPrimary text-lg mb-2">Input Skills & Preferences</h4>
                <p className="text-textSecondary text-sm">Select languages, frameworks, domain preference, and career targets in our comprehensive form selector.</p>
              </div>
              <div className="hidden md:block md:w-[45%]" />
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col md:flex-row-reverse md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-violet-500 text-white font-bold font-display shadow-lg shadow-violet-500/30">
                2
              </div>
              <div className="ml-16 md:ml-0 md:w-[45%] glass-card rounded-2xl p-6">
                <h4 className="font-display font-bold text-textPrimary text-lg mb-2">AI Analyzes & Orchestrates</h4>
                <p className="text-textSecondary text-sm">Our backend discovers local/cloud models, sets up custom validation loops, and generates detailed architectures.</p>
              </div>
              <div className="hidden md:block md:w-[45%]" />
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500 text-white font-bold font-display shadow-lg shadow-cyan-500/30">
                3
              </div>
              <div className="ml-16 md:ml-0 md:w-[45%] glass-card rounded-2xl p-6">
                <h4 className="font-display font-bold text-textPrimary text-lg mb-2">Export Code Specifications</h4>
                <p className="text-textSecondary text-sm">Review full specifications on the dashboard and export them to Markdown, JSON, or PDF formats instantly.</p>
              </div>
              <div className="hidden md:block md:w-[45%]" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Bottom Banner */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 to-violet-950/60 border border-cardBorder p-8 md:p-12 text-center shadow-2xl">
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl" />
          <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">Ready to elevate your engineering portfolio?</h3>
          <p className="text-slate-300 max-w-md mx-auto text-sm md:text-base mb-8">Generate unique and structured full-stack or systems software blueprints in seconds.</p>
          <button
            onClick={() => navigate('/generate')}
            className="glow-btn inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Start Generating
            <Zap size={16} className="fill-indigo-500 text-indigo-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
