import { useState } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, ShieldCheck, Clock } from 'lucide-react';

export default function ApiKeys() {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Scanner', key: 'ss_live_82374982374982374', created: '2024-01-15', lastUsed: '2 hours ago', visible: false },
    { id: 2, name: 'Staging Environment', key: 'ss_test_19283719283719283', created: '2024-02-10', lastUsed: 'Yesterday', visible: false },
  ]);

  const toggleVisibility = (id: number) => {
    setKeys(keys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">API Management</h1>
          <p className="text-slate-400 mt-1">Integrate SecureScan directly into your security workflows</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Generate New Key
        </button>
      </header>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-8 py-4 font-semibold">Key Name</th>
              <th className="px-8 py-4 font-semibold">API Key</th>
              <th className="px-8 py-4 font-semibold">Created</th>
              <th className="px-8 py-4 font-semibold">Last Used</th>
              <th className="px-8 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {keys.map((k) => (
              <tr key={k.id} className="hover:bg-white/5 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-lg">
                      <Key className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-bold text-white">{k.name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      {k.visible ? k.key : '••••••••••••••••••••••••'}
                    </code>
                    <button onClick={() => toggleVisibility(k.id)} className="text-slate-500 hover:text-white transition-colors">
                      {k.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500">{k.created}</td>
                <td className="px-8 py-6 text-sm text-slate-500">{k.lastUsed}</td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Usage Limits
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-slate-400">Monthly API Scans</span>
              <span className="text-sm font-bold text-white">1,240 / 5,000</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600" style={{ width: '24.8%' }} />
            </div>
            <p className="text-xs text-slate-500">Your plan resets in 12 days.</p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl">
          <h3 className="text-lg font-display font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Rate Limiting
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your current API rate limit is <span className="text-white font-bold">100 requests per minute</span>. 
            Need higher throughput? Contact our sales team for custom enterprise limits.
          </p>
        </div>
      </div>
    </div>
  );
}
