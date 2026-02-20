import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ClipboardList } from 'lucide-react';
import { motion } from 'motion/react';

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [textUrls, setTextUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'file' | 'text'>('file');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'file' && !file) return;
    if (mode === 'text' && !textUrls.trim()) return;
    
    setLoading(true);
    // Simulate bulk processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFile(null);
      setTextUrls('');
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-white">Bulk URL Analysis</h1>
        <p className="text-slate-400 mt-1">Process high volumes of URLs via file upload or direct input</p>
      </header>

      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setMode('file')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${mode === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
        >
          File Upload
        </button>
        <button 
          onClick={() => setMode('text')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${mode === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
        >
          Direct Input
        </button>
      </div>

      <div className="glass p-12 rounded-3xl border-dashed border-2 border-slate-800 flex flex-col items-center justify-center text-center">
        {mode === 'file' ? (
          <>
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Select your file</h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">
              Supported formats: .csv, .txt. Maximum 5,000 URLs per upload.
            </p>

            <form onSubmit={handleUpload} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-slate-400 flex items-center justify-between">
                  <span className="truncate">{file ? file.name : 'Choose file...'}</span>
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Batch...
                  </>
                ) : (
                  <>
                    Start Bulk Scan
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="w-full space-y-6">
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <ClipboardList className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Paste URLs</h3>
            <p className="text-slate-500 text-sm mb-6">Enter one URL per line</p>
            
            <form onSubmit={handleUpload} className="space-y-6">
              <textarea
                value={textUrls}
                onChange={(e) => setTextUrls(e.target.value)}
                placeholder="https://example.com&#10;https://malicious-site.net"
                className="w-full h-64 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              />
              
              <button
                type="submit"
                disabled={!textUrls.trim() || loading}
                className="w-full max-w-sm mx-auto bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing URLs...
                  </>
                ) : (
                  <>
                    Analyze {textUrls.split('\n').filter(l => l.trim()).length} URLs
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center gap-4"
        >
          <div className="p-3 bg-emerald-500/20 rounded-2xl">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-emerald-400 font-bold">Upload Successful</h4>
            <p className="text-emerald-500/70 text-sm">Your batch of 124 URLs has been queued for processing. You will be notified when complete.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
