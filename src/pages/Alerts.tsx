import { useState } from 'react';
import { Bell, ShieldAlert, Mail, Slack, Webhook, Plus, Trash2, ToggleLeft as Toggle } from 'lucide-react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Email', target: 'security@company.com', trigger: 'Risk Score > 80', active: true },
    { id: 2, type: 'Slack', target: '#security-alerts', trigger: 'Malicious URL Detected', active: true },
    { id: 3, type: 'Webhook', target: 'https://api.siem.com/v1/ingest', trigger: 'Any Scan', active: false },
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Alert Configurations</h1>
          <p className="text-slate-400 mt-1">Manage real-time notifications and SIEM integrations</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-2xl transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create Alert
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {alerts.map((alert) => (
          <div key={alert.id} className="glass p-6 rounded-3xl flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className={`p-4 rounded-2xl ${alert.active ? 'bg-blue-600/10 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                {alert.type === 'Email' && <Mail className="w-6 h-6" />}
                {alert.type === 'Slack' && <Slack className="w-6 h-6" />}
                {alert.type === 'Webhook' && <Webhook className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-display font-bold text-white">{alert.type} Notification</h3>
                  {!alert.active && <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded uppercase">Paused</span>}
                </div>
                <p className="text-slate-400 text-sm mt-1">{alert.target}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trigger:</span>
                  <span className="text-xs text-blue-400 font-medium">{alert.trigger}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-500 hover:text-white transition-colors">
                <Toggle className={`w-6 h-6 ${alert.active ? 'text-emerald-500' : 'text-slate-700'}`} />
              </button>
              <button className="p-2 text-slate-500 hover:text-rose-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass p-8 rounded-3xl bg-blue-600/5 border-blue-500/10">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <ShieldAlert className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">Enterprise SIEM Integration</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect SecureScan directly to Splunk, Microsoft Sentinel, or Datadog. 
              Our enterprise plan supports high-throughput event streaming with full metadata.
            </p>
            <button className="mt-4 text-blue-400 text-sm font-bold uppercase tracking-widest hover:text-blue-300">
              Upgrade to Enterprise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
