'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Play, CheckCircle2, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [showSettings, setShowSettings] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scenarios, setScenarios] = useState('');

  // Form State
  const [jiraUrl, setJiraUrl] = useState('');
  const [jiraEmail, setJiraEmail] = useState('');
  const [jiraToken, setJiraToken] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [jiraId, setJiraId] = useState('');

  const handleGenerate = async () => {
    setError('');
    setScenarios('');
    if (!jiraUrl || !jiraEmail || !jiraToken || !groqKey || !jiraId) {
      setError('Please fill in all configuration fields and the Jira ID.');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jiraUrl, jiraEmail, jiraToken, groqKey, jiraId })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate scenarios');

      setScenarios(data.scenarios);
      setShowSettings(false); // Hide settings to focus on results
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-fuchsia-500 selection:text-white pb-20">
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-fuchsia-600 to-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              AI Test Strategy Architect
            </h1>
          </div>
          <div className="text-sm text-purple-200/60 font-medium tracking-wide">BLAST FRAMEWORK • PHASE 4</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Configuration Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="w-full px-6 py-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <h2 className="font-semibold tracking-wide">API Configuration</h2>
              </div>
              {showSettings ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
            </button>
            
            {showSettings && (
              <div className="p-6 space-y-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-medium text-purple-200/70 mb-1.5 uppercase tracking-wider">Jira Base URL</label>
                  <input 
                    type="url" placeholder="https://yourdomain.atlassian.net"
                    value={jiraUrl} onChange={(e) => setJiraUrl(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-200/70 mb-1.5 uppercase tracking-wider">Jira Email</label>
                  <input 
                    type="email" placeholder="you@company.com"
                    value={jiraEmail} onChange={(e) => setJiraEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-200/70 mb-1.5 uppercase tracking-wider">Jira API Token</label>
                  <input 
                    type="password" placeholder="••••••••••••••••"
                    value={jiraToken} onChange={(e) => setJiraToken(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-purple-200/70 mb-1.5 uppercase tracking-wider">Groq API Key</label>
                  <input 
                    type="password" placeholder="gsk_..."
                    value={groqKey} onChange={(e) => setGroqKey(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder:text-white/20"
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-fuchsia-900/40 to-purple-900/40 backdrop-blur-xl border border-fuchsia-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500"></div>
            <h2 className="font-semibold tracking-wide mb-4 text-fuchsia-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-fuchsia-400" />
              Generate Strategy
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-fuchsia-200/70 mb-1.5 uppercase tracking-wider">Target Jira ID</label>
                <input 
                  type="text" placeholder="e.g. KAN-4"
                  value={jiraId} onChange={(e) => setJiraId(e.target.value)}
                  className="w-full bg-black/40 border border-fuchsia-500/30 rounded-lg px-4 py-3 text-lg font-mono focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent outline-none transition-all placeholder:text-white/20"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold py-3.5 px-4 rounded-lg shadow-lg shadow-purple-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Architecting Scenarios...
                  </>
                ) : (
                  'Generate Test Scenarios'
                )}
              </button>
            </div>
          </motion.div>

        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl h-full min-h-[600px] flex flex-col overflow-hidden"
          >
            <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white/90 tracking-wide">Output Strategy</h3>
              </div>
              {scenarios && (
                <span className="text-xs font-medium px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/20">
                  Generation Complete
                </span>
              )}
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">{error}</p>
                </div>
              )}

              {!error && !scenarios && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/30 space-y-4">
                  <FileText className="w-16 h-16 opacity-20" />
                  <p className="max-w-sm">Enter your credentials and a Jira ID to automatically fetch attachments and generate a professional test strategy.</p>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/5 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-fuchsia-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent border-r-transparent"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-white/80 animate-pulse">Analyzing Jira Context...</p>
                    <p className="text-sm text-white/40">Fetching attachments and applying the 15-year engineer persona.</p>
                  </div>
                </div>
              )}

              {scenarios && (
                <div className="prose prose-invert prose-purple max-w-none prose-headings:font-semibold prose-a:text-fuchsia-400">
                  <ReactMarkdown>{scenarios}</ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
}
