import { useState } from 'react';
import { ArrowLeft, Download, FileJson, Printer, Copy, Check, Terminal as TerminalIcon, Database, Layers, LayoutList, ListTodo, Milestone, FileSpreadsheet, Briefcase } from 'lucide-react';
import { ProjectBlueprint } from 'shared';

interface ProjectDetailsProps {
  project: ProjectBlueprint;
  onBack: () => void;
}

export default function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { label: 'Problem & Users', icon: LayoutList },
    { label: 'System Architecture', icon: Layers },
    { label: 'Core Features', icon: ListTodo },
    { label: 'Database & APIs', icon: Database },
    { label: 'Folder Layout', icon: TerminalIcon },
    { label: 'Roadmap Sprints', icon: Milestone },
    { label: 'CI/CD & Deployment', icon: FileSpreadsheet },
    { label: 'Placement Ready', icon: Briefcase }
  ];

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const content = `
# ${project.title}
> ${project.tagline}

## Project Specifications
- **Domain:** ${project.domain}
- **Difficulty:** ${project.difficulty}
- **Duration:** ${project.duration}
- **Resume Impact Rating:** ${project.resumeScore}/100
- **Placement Readiness Rating:** ${project.placementScore}/100
- **Innovation Rating:** ${project.innovationScore}/100

## 1. Problem & Target Audience
### Overview
${project.problemStatement.overview}

### Target Audience
${project.problemStatement.targetAudience}

### User Personas
${project.problemStatement.userPersonas.map(p => `- ${p}`).join('\n')}

## 2. System Architecture
### Architectural Narrative
${project.systemArchitecture.narrative}

### Data Flow
${project.systemArchitecture.dataFlow}

## 3. Database & API Specification
### Database Tables
${project.databaseApiSpecification.tables.map(t => `
#### Table: ${t.name}
- **Description:** ${t.description}
- **Columns:** ${t.columns.join(', ')}
`).join('\n')}

### API Endpoints
${project.databaseApiSpecification.endpoints.map(e => `
- **${e.method} ${e.path}**
  - *Description:* ${e.description}
  - *Request Body:* \`${e.requestBody || 'None'}\`
  - *Response Body:* \`${e.responseBody}\`
`).join('\n')}

## 4. Directory Structure
\`\`\`
${project.directoryStructure}
\`\`\`

## 5. Implementation Roadmap
${project.roadmap.map(r => `
### ${r.phase}: ${r.title}
${r.tasks.map(t => `- [ ] ${t}`).join('\n')}
`).join('\n')}

## 6. Deployment & CI/CD
- **Host Provider Target:** ${project.deploymentCiCd.host}
- **Containerization Engine:** ${project.deploymentCiCd.containerization}
- **Execution Steps:**
${project.deploymentCiCd.steps.map(s => `- ${s}`).join('\n')}

## 7. Placement Artifacts
### ATS Resume Bullet Points
${project.placementArtifacts.resumeBullets.map(b => `- ${b}`).join('\n')}

### Technical Interview Q&A
${project.placementArtifacts.interviewQuestions.map(q => `
#### Q: ${q.question}
> **Answer Hint:** ${q.answerHint}
`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 print:bg-white print:text-black">
      {/* Back & Export Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">{project.domain}</span>
            <h2 className="font-display font-extrabold text-2xl text-white mt-0.5">{project.title}</h2>
          </div>
        </div>

        {/* Action button rows */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
          >
            <Download size={14} />
            Markdown
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
          >
            <FileJson size={14} />
            JSON
          </button>
          <button
            onClick={handlePrintPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-all"
          >
            <Printer size={14} />
            Print PDF
          </button>
          <button
            onClick={handleCopyDetails}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white transition-all shadow-md shadow-indigo-600/10"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy Specs'}
          </button>
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Tabs (Sidebar) */}
        <div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 pb-4 lg:pb-0 border-b lg:border-b-0 border-slate-800 print:hidden">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex shrink-0 items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-300 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                <Icon size={16} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Detail Pane */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 sm:p-8 min-h-[500px]">
          
          {/* Tab 0: Problem and Audience */}
          {activeTab === 0 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Problem Statement & Users
              </h3>
              
              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Problem Overview</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.problemStatement.overview}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Target Audience</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.problemStatement.targetAudience}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Target Personas</h4>
                <ul className="space-y-2">
                  {project.problemStatement.userPersonas.map((persona, index) => (
                    <li key={index} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                      {persona}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 1: System Architecture */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                System Architecture
              </h3>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Architectural Narrative</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.systemArchitecture.narrative}</p>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-2">Process Data Flow</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{project.systemArchitecture.dataFlow}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Core & Advanced Features */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Project Feature Scope
              </h3>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-3">Core Baseline Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.core.map((feature, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-violet-400 tracking-wider mb-3">Advanced Enhancements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.features.advanced.map((feature, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-slate-300 text-xs font-medium">
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Database & API Specification */}
          {activeTab === 3 && (
            <div className="space-y-8">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Database Schemas & APIs
              </h3>

              {project.databaseApiSpecification.tables.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-4">Relational Entities</h4>
                  <div className="space-y-4">
                    {project.databaseApiSpecification.tables.map((table, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <h5 className="font-display font-bold text-white text-sm mb-1">{table.name}</h5>
                        <p className="text-slate-400 text-xs mb-3">{table.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {table.columns.map((col, cIdx) => (
                            <span key={cIdx} className="text-[10px] font-mono bg-slate-950 border border-slate-800 text-indigo-300 px-2 py-0.5 rounded">
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.databaseApiSpecification.endpoints.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-4">API Operations Dashboard</h4>
                  <div className="space-y-4">
                    {project.databaseApiSpecification.endpoints.map((endpoint, idx) => {
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                              endpoint.method === 'GET' ? 'bg-emerald-950 text-emerald-400' :
                              endpoint.method === 'POST' ? 'bg-indigo-950 text-indigo-400' : 'bg-amber-950 text-amber-400'
                            }`}>
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-white">{endpoint.path}</span>
                          </div>
                          <p className="text-slate-400 text-xs">{endpoint.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            {endpoint.requestBody && (
                              <div>
                                <span className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">Request Payload</span>
                                <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto">
                                  {endpoint.requestBody}
                                </pre>
                              </div>
                            )}
                            <div>
                              <span className="block text-[10px] text-slate-500 uppercase font-semibold mb-1">Response JSON</span>
                              <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 overflow-x-auto">
                                {endpoint.responseBody}
                              </pre>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Directory structure */}
          {activeTab === 4 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Repository File Layout
              </h3>
              <p className="text-slate-400 text-xs">Standard microservices / monorepo workspace directory tree structure:</p>
              
              <pre className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-900 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                {project.directoryStructure}
              </pre>
            </div>
          )}

          {/* Tab 5: Roadmap Sprints */}
          {activeTab === 5 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Phased Implementation Sprints
              </h3>
              
              <div className="space-y-6">
                {project.roadmap.map((phase, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-slate-800">
                    {/* Timeline bullet node */}
                    <div className="absolute left-[-5px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 shadow shadow-indigo-500/50" />
                    
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{phase.phase}</span>
                    <h4 className="font-display font-bold text-white text-base mt-0.5 mb-3">{phase.title}</h4>
                    
                    <ul className="space-y-2">
                      {phase.tasks.map((task, tIdx) => (
                        <li key={tIdx} className="text-slate-300 text-xs flex items-center gap-2">
                          <input type="checkbox" readOnly checked={false} className="rounded border-slate-800 bg-slate-900 text-indigo-600 shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: CI/CD & Deployment */}
          {activeTab === 6 && (
            <div className="space-y-6">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                CI/CD & Server Deployment
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Recommended Deployment Host</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{project.deploymentCiCd.host}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase font-semibold">Containerization Engine</span>
                  <span className="text-sm font-semibold text-white mt-1 block">{project.deploymentCiCd.containerization}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-3">Deployment Execution Steps</h4>
                <ol className="space-y-3">
                  {project.deploymentCiCd.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-3 text-slate-300 text-xs items-start">
                      <span className="flex h-5 w-5 rounded-full bg-slate-800 text-[10px] font-bold text-indigo-300 items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="mt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {/* Tab 7: Placement Artifacts */}
          {activeTab === 7 && (
            <div className="space-y-8">
              <h3 className="font-display text-xl font-bold text-white border-b border-slate-800 pb-2">
                Placement & Recruitment Preparation
              </h3>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-3">ATS Resume Impact Bullets</h4>
                <div className="space-y-3">
                  {project.placementArtifacts.resumeBullets.map((bullet, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <span className="h-2 w-2 rounded-full bg-indigo-500 mt-2 shrink-0 animate-pulse" />
                      <p className="text-slate-300 text-xs leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider mb-3">Mock Technical Q&A Interview Questions</h4>
                <div className="space-y-4">
                  {project.placementArtifacts.interviewQuestions.map((qa, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
                      <h5 className="font-display font-bold text-white text-sm">Q: {qa.question}</h5>
                      <div className="p-3 rounded bg-slate-950/80 border border-slate-900 text-xs text-indigo-300 italic">
                        <span className="font-bold uppercase tracking-wider text-[9px] text-slate-500 block mb-1">Answer Strategy Hint</span>
                        {qa.answerHint}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
