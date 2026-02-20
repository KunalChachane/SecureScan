import { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Filter, Download, Trash2, Globe, ArrowUpRight, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { ScanResult } from '../types';

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setScans(data);
        setLoading(false);
      });
  }, []);

  const filteredScans = scans.filter(scan => 
    scan.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.threat_level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Scan History</h1>
          <p className="text-slate-400 mt-1">Review and manage your previous URL security assessments</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export All
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by URL or threat level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-semibold">URL / Domain</th>
                <th className="px-8 py-4 font-semibold">Risk Score</th>
                <th className="px-8 py-4 font-semibold">Threat Level</th>
                <th className="px-8 py-4 font-semibold">Timestamp</th>
                <th className="px-8 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredScans.length > 0 ? filteredScans.map((scan, i) => (
                <motion.tr 
                  key={scan.id || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        scan.threat_level === 'Safe' ? 'bg-emerald-500/10 text-emerald-400' :
                        scan.threat_level === 'Suspicious' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-rose-500/10 text-rose-500'
                      }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-slate-200 truncate max-w-[300px]">{scan.url}</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase">#SS-{scan.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            scan.risk_score < 30 ? 'bg-emerald-500' :
                            scan.risk_score < 70 ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`}
                          style={{ width: `${scan.risk_score}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400 font-bold">{scan.risk_score}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      {scan.threat_level === 'Safe' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : scan.threat_level === 'Suspicious' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={`text-xs font-bold uppercase tracking-wider ${
                        scan.threat_level === 'Safe' ? 'text-emerald-400' :
                        scan.threat_level === 'Suspicious' ? 'text-amber-400' :
                        'text-rose-500'
                      }`}>
                        {scan.threat_level}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {new Date(scan.created_at).toLocaleString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <HistoryIcon className="w-12 h-12 opacity-20" />
                      <p>No scans found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
