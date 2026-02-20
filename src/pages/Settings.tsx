import { useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Globe, Lock, Save, CreditCard } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

export default function Settings() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your account and enterprise preferences</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </aside>

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="glass p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-display font-bold text-white mb-6">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.primaryEmailAddress?.emailAddress}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Display Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ''}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Role</label>
                  <input
                    type="text"
                    disabled
                    value="Enterprise User"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-500 capitalize"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Timezone</label>
                  <select className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500">
                    <option>UTC (GMT+0)</option>
                    <option>EST (GMT-5)</option>
                    <option>PST (GMT-8)</option>
                  </select>
                </div>
              </div>
              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass p-8 rounded-3xl space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white">Security Settings</h3>
                <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/20 rounded-xl">
                      <Lock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">Two-Factor Authentication</h4>
                      <p className="text-slate-400 text-sm">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg">Enable</button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-bold">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="password"
                      placeholder="Current Password"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button className="text-blue-400 text-sm font-bold uppercase tracking-widest hover:text-blue-300">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass p-8 rounded-3xl space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-display font-bold text-white">Current Plan</h3>
                  <p className="text-slate-400 text-sm mt-1">You are currently on the <span className="text-blue-400 font-bold">Enterprise Plan</span></p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20">Active</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Next Billing Date</p>
                  <p className="text-white font-bold">March 15, 2024</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-2">Monthly Amount</p>
                  <p className="text-white font-bold">$499.00</p>
                </div>
              </div>

              <button className="w-full py-4 border border-slate-800 hover:bg-white/5 text-slate-300 font-bold rounded-2xl transition-all">
                Manage Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
