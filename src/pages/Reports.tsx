import { useState } from 'react';
import { FileText, Download, Calendar, Filter, ArrowUpRight, Search, FileDown } from 'lucide-react';
import { motion } from 'motion/react';

export default function Reports() {
  const reports = [
    { id: 1, name: 'Weekly Security Audit', date: '2024-02-18', type: 'PDF', size: '2.4 MB', status: 'Ready' },
    { id: 2, name: 'Malicious Domain Summary', date: '2024-02-15', type: 'CSV', size: '1.1 MB', status: 'Ready' },
    { id: 3, name: 'Monthly Compliance Report', date: '2024-02-01', type: 'PDF', size: '4.8 MB', status: 'Ready' },
    { id: 4, name: 'Phishing Trend Analysis', date: '2024-01-25', type: 'PDF', size: '3.2 MB', status: 'Ready' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Security Reports</h1>
          <p className="text-slate-400 mt-1">Generate and download comprehensive threat analysis reports</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
          <FileDown className="w-5 h-5" />
          Generate Report
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Reports', value: '24', icon: FileText, color: 'text-blue-400' },
          { label: 'Scheduled', value: '3', icon: Calendar, color: 'text-emerald-400' },
          { label: 'Storage Used', value: '112 MB', icon: Download, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-display font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-8 py-4 font-semibold">Report Name</th>
                <th className="px-8 py-4 font-semibold">Date</th>
                <th className="px-8 py-4 font-semibold">Format</th>
                <th className="px-8 py-4 font-semibold">Size</th>
                <th className="px-8 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reports.map((report, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-800 rounded-lg">
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-white">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">{report.date}</td>
                  <td className="px-8 py-5">
                    <span className="px-2 py-1 bg-slate-800 text-[10px] font-bold text-slate-400 rounded uppercase tracking-widest">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500">{report.size}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
