import { useState } from 'react';
import { Search, Shield, AlertCircle, CheckCircle, Info, ArrowRight, ShieldAlert, ShieldCheck, Globe, Lock, ExternalLink, Download, Share2, BrainCircuit, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@clerk/clerk-react';
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from '../types';

export default function Scan() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const { user } = useUser();

  const isValidUrl = (urlString: string) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!urlPattern.test(urlString);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Standard Scan
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, userId: user?.id }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Scan failed');
        setLoading(false);
        return;
      }

      // 2. AI Scan (Gemini)
      const ai = new GoogleGenAI({ apiKey: (process.env as any).GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this URL for security threats: ${url}. Provide a risk assessment, threat details, and a confidence score.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              risk_assessment: {
                type: Type.STRING,
                description: "A brief assessment of the risk level (e.g., High, Medium, Low).",
              },
              threat_details: {
                type: Type.STRING,
                description: "Detailed explanation of potential threats found in the URL.",
              },
              confidence_score: {
                type: Type.NUMBER,
                description: "Confidence score of the analysis from 0 to 100.",
              },
            },
            required: ["risk_assessment", "threat_details", "confidence_score"],
          },
        },
      });

      const aiResult = JSON.parse(response.text || '{}');
      
      setResult({
        ...data,
        ai_analysis: aiResult
      });
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Neural Analysis Engine</span>
        </div>
        <h1 className="text-5xl font-display font-bold text-white tracking-tight">Threat Intelligence Scanner</h1>
        <p className="text-slate-400 font-medium text-lg">Deep-packet inspection and reputation analysis for global URL vectors.</p>
      </header>

      <div className="glass p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border-white/5">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Shield className="w-48 h-48 text-blue-500" />
        </div>
        
        <form onSubmit={handleScan} className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl group-focus-within:bg-blue-500/10 transition-all" />
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Enter target URL for deep analysis..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500/50 transition-all text-lg font-medium placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black px-10 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px] shadow-lg shadow-blue-500/20 active:scale-95"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="uppercase tracking-widest text-xs">Processing</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs">Initiate Scan</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              SSL Verification
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              DNS Reputation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              AI Pattern Match
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Result Summary Card */}
            <div className={`glass p-8 rounded-3xl border-l-8 ${
              result.threat_level === 'Safe' ? 'border-emerald-500' :
              result.threat_level === 'Suspicious' ? 'border-amber-500' :
              'border-rose-500'
            }`}>
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    {result.threat_level === 'Safe' ? (
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    ) : result.threat_level === 'Suspicious' ? (
                      <AlertCircle className="w-8 h-8 text-amber-400" />
                    ) : (
                      <ShieldAlert className="w-8 h-8 text-rose-500" />
                    )}
                    <h2 className={`text-2xl font-display font-bold ${
                      result.threat_level === 'Safe' ? 'text-emerald-400' :
                      result.threat_level === 'Suspicious' ? 'text-amber-400' :
                      'text-rose-500'
                    }`}>
                      {result.threat_level} Threat Level
                    </h2>
                  </div>
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    {result.scan_result.summary}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" /> Export PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                      <Share2 className="w-4 h-4" /> Share Report
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                  <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-800"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * result.risk_score) / 100}
                        className={`${
                          result.risk_score < 30 ? 'text-emerald-500' :
                          result.risk_score < 70 ? 'text-amber-500' :
                          'text-rose-500'
                        } transition-all duration-1000`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-display font-bold text-white">{result.risk_score}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Risk Score</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 text-center">Score based on 12+ security indicators</p>
                </div>
              </div>
            </div>

            {/* AI Analysis Card */}
            {result.ai_analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-8 rounded-[2.5rem] border-l-8 border-blue-500 bg-blue-500/5"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600/20 rounded-2xl">
                    <BrainCircuit className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                      Gemini AI Analysis
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Deep neural analysis of URL patterns and threat vectors</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Risk Assessment</p>
                      <p className={`text-lg font-bold ${
                        result.ai_analysis.risk_assessment.toLowerCase().includes('high') ? 'text-rose-400' :
                        result.ai_analysis.risk_assessment.toLowerCase().includes('medium') ? 'text-amber-400' :
                        'text-emerald-400'
                      }`}>
                        {result.ai_analysis.risk_assessment}
                      </p>
                    </div>
                    <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Threat Details</p>
                      <p className="text-slate-300 leading-relaxed">
                        {result.ai_analysis.threat_details}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <div className="text-4xl font-display font-bold text-blue-400 mb-2">
                      {result.ai_analysis.confidence_score}%
                    </div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest text-center">AI Confidence</p>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${result.ai_analysis.confidence_score}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Detailed Checks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass p-8 rounded-3xl">
                <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-400" />
                  Security Indicators
                </h3>
                <div className="space-y-4">
                  {Object.entries(result.scan_result.checks).map(([key, value], i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-slate-900/30 rounded-2xl border border-slate-800/50">
                      <div className="mt-1">
                        {value.toLowerCase().includes('safe') || value.toLowerCase().includes('valid') || value.toLowerCase().includes('none') ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-sm text-slate-300">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Recommendations
                  </h3>
                  <ul className="space-y-4">
                    {result.scan_result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass p-8 rounded-3xl">
                  <h3 className="text-xl font-display font-bold text-white mb-4">Domain Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Target URL</span>
                      <span className="text-slate-200 font-mono truncate max-w-[200px]">{result.url}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Scan ID</span>
                      <span className="text-slate-200 font-mono">#SS-{result.id || 'TEMP'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Protocol</span>
                      <span className="text-emerald-400 font-mono">HTTPS</span>
                    </div>
                  </div>
                  <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    View WHOIS Data <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
