import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Activity, TrendingUp, Globe, Clock, ArrowUpRight, ShieldAlert, ShieldCheck, BarChart3, PieChart as PieChartIcon, Zap, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from 'motion/react';
import { DashboardStats, ScanResult } from '../types';

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );

  const pieData = [
    { name: 'Safe', value: stats.safeScans },
    { name: 'Suspicious', value: stats.suspiciousScans },
    { name: 'Malicious', value: stats.maliciousScans },
  ];

  // Mocked data for additional charts
  const riskBreakdownData = [
    { name: 'Phishing', value: 45 },
    { name: 'Malware', value: 25 },
    { name: 'Redirects', value: 15 },
    { name: 'Domain Age', value: 15 },
  ];

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-10">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-2">
              <Zap className="w-3 h-3 text-blue-400 fill-current" />
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Live Intelligence</span>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Operational</span>
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold text-white tracking-tight">Security Command Center</h1>
          <p className="text-slate-400 font-medium text-lg">Monitoring global URL threats and enterprise reputation risks in real-time.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded-xl">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Nodes</span>
              <span className="text-white font-bold">12 Active</span>
            </div>
          </div>
          <div className="glass px-6 py-4 rounded-3xl flex items-center gap-4">
            <div className="p-2 bg-slate-800 rounded-xl">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Time</span>
              <span className="text-white font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Scans', value: stats.totalScans, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+14.2%', desc: 'Across all vectors' },
          { label: 'Malicious', value: stats.maliciousScans, icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10', trend: '+2.1%', desc: 'Critical threats' },
          { label: 'Suspicious', value: stats.suspiciousScans, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '-5.4%', desc: 'Warning indicators' },
          { label: 'Safe Analysis', value: stats.safeScans, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', trend: '+8.7%', desc: 'Verified clean' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-8 rounded-[2.5rem] relative overflow-hidden group hover:scale-[1.02] transition-all duration-500"
          >
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`p-4 ${stat.bg} rounded-2xl shadow-inner border border-white/5`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                stat.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <h3 className="text-4xl font-display font-bold text-white mt-1 tabular-nums">{stat.value.toLocaleString()}</h3>
              <p className="text-slate-500 text-xs mt-2 font-medium">{stat.desc}</p>
            </div>
            
            <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
               <stat.icon className="w-40 h-40" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 glass p-10 rounded-[3rem] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20">
                <TrendingUp className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Threat Activity Trend</h3>
                <p className="text-sm text-slate-500 font-medium">Historical scan volume and detection rate analytics</p>
              </div>
            </div>
            <div className="flex p-1.5 bg-slate-950/50 rounded-2xl border border-white/5">
              {['1D', '1W', '1M', '1Y'].map(t => (
                <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all duration-300 ${
                  t === '1W' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'text-slate-500 hover:text-slate-300'
                }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.trend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight={800}
                  tickLine={false} 
                  axisLine={false}
                  dy={15}
                  tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#475569" fontSize={10} fontWeight={800} tickLine={false} axisLine={false} dx={-15} />
                <Tooltip 
                  cursor={{ stroke: '#334155', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '24px', padding: '16px 20px', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.8)' }}
                  itemStyle={{ color: '#fff', fontWeight: 800 }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={6} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] flex flex-col">
          <div className="flex items-center gap-5 mb-12">
            <div className="p-4 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
              <PieChartIcon className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-white">Risk Profile</h3>
              <p className="text-sm text-slate-500 font-medium">Categorized scan results</p>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[280px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={110}
                    paddingAngle={15}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-display font-bold text-white tabular-nums">{stats.totalScans}</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.3em] mt-1">Total Scans</span>
              </div>
            </div>
            <div className="mt-12 w-full grid grid-cols-1 gap-4">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-950/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-3 h-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-white font-black tabular-nums text-lg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-rose-600/10 rounded-2xl">
              <Target className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">Threat Vector Analysis</h3>
              <p className="text-xs text-slate-500 font-medium">Top detected malicious indicators</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBreakdownData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#64748b" 
                  fontSize={12} 
                  fontWeight={700}
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '16px' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-amber-600/10 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white">Scan Efficiency</h3>
              <p className="text-xs text-slate-500 font-medium">Average processing time per scan</p>
            </div>
          </div>
          <div className="flex flex-col justify-center h-[300px]">
            <div className="space-y-8">
              {[
                { label: 'Single URL Scan', time: '1.2s', perf: 98 },
                { label: 'Bulk Batch (100)', time: '14.5s', perf: 92 },
                { label: 'API Response', time: '450ms', perf: 99 },
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-white">{item.label}</span>
                    <span className="text-xs font-mono text-blue-400">{item.time}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.perf}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="glass rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="text-xl font-display font-bold text-white">Recent Activity</h3>
            <button className="text-blue-400 hover:text-blue-300 text-xs font-black uppercase tracking-widest">View History</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-800">
                {stats.recentScans.map((scan, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${
                          scan.threat_level === 'Safe' ? 'bg-emerald-500/10 text-emerald-400' :
                          scan.threat_level === 'Suspicious' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-rose-500/10 text-rose-500'
                        }`}>
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-200 truncate max-w-[250px]">{scan.url}</span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(scan.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border ${
                        scan.threat_level === 'Safe' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        scan.threat_level === 'Suspicious' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {scan.threat_level}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <ArrowUpRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-all ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-rose-500/5">
            <h3 className="text-xl font-display font-bold text-white">Top Risk Domains</h3>
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-800">
                {stats.topRiskDomains.map((scan, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-800/50 rounded-2xl">
                          <Globe className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-slate-200 truncate max-w-[250px]">{scan.url}</span>
                          <span className="text-[10px] text-rose-500 font-black uppercase tracking-widest">Risk Score: {scan.risk_score}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="w-full max-w-[120px] h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                        <div 
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${scan.risk_score}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] hover:text-rose-300 transition-colors">Block</button>
                    </td>
                  </tr>
                ))}
                {stats.topRiskDomains.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <ShieldCheck className="w-16 h-16 text-emerald-500" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">No high-risk threats detected</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
