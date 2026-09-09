'use client';

import { useState, useEffect } from 'react';
import { Gamepad2, Lock, Phone, User, CheckCircle2, Loader2, Shield, Zap, Eye, EyeOff, Save } from 'lucide-react';
import { Reveal } from '@/components/motion';

export default function UserSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'security' | 'notifications'>('identity');

  const [profile, setProfile] = useState({
    displayName: '',
    username: '',
    email: '',
    freeFireUid: '',
    inGameName: '',
    phone: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const data = await res.json();
        if (data?.user) {
          setProfile({
            displayName: data.user.displayName || '',
            username: data.user.username || '',
            email: data.user.email || '',
            freeFireUid: data.user.profile?.freeFireUid || '',
            inGameName: data.user.profile?.inGameName || '',
            phone: data.user.phone || '',
            bio: data.user.profile?.bio || '',
          });
        }
      } catch {
        // use defaults
      }
    };
    fetchProfile();
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: profile.displayName,
          phone: profile.phone,
          freeFireUid: profile.freeFireUid,
          inGameName: profile.inGameName,
          bio: profile.bio,
        }),
      });
      setSuccessMsg('Profile saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSuccessMsg('Passwords do not match!');
      setTimeout(() => setSuccessMsg(''), 3000);
      return;
    }
    setSaving(true);
    try {
      await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      setSuccessMsg('Password updated!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]/30 transition-all text-sm';

  const TABS = [
    { key: 'identity',      label: 'Gamer ID',    icon: Gamepad2 },
    { key: 'security',      label: 'Security',    icon: Lock },
    { key: 'notifications', label: 'Notifications', icon: Shield },
  ] as const;

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-8">

      {/* Header */}
      <Reveal>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[10px] font-black text-[#00f0ff] mb-3 uppercase tracking-widest">
            <Zap size={12} />Commander Config
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-cyan">
            Account Settings
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your gamer identity, Free Fire UID, and security settings.
          </p>
        </div>
      </Reveal>

      {/* Success Message */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
              activeTab === key
                ? 'bg-[#00f0ff]/15 border-[#00f0ff]/50 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/25 hover:text-white'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Gamer Identity Tab */}
      {activeTab === 'identity' && (
        <Reveal>
          <div className="rounded-2xl border border-[#00f0ff]/25 bg-black/70 backdrop-blur-sm p-6 shadow-[0_0_30px_rgba(0,240,255,0.08)]">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center">
                <Gamepad2 size={20} className="text-[#00f0ff]" />
              </div>
              <div>
                <h2 className="text-base font-black text-white font-heading">Free Fire Gamer Identity</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your UID must be 100% accurate for Custom Room referee checks</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* FF UID + IGN — most critical */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20">
                <div>
                  <label className="block text-[11px] font-black text-[#00f0ff] uppercase tracking-widest mb-2">
                    🎮 Free Fire In-Game UID
                  </label>
                  <input
                    required
                    value={profile.freeFireUid}
                    onChange={e => setProfile({ ...profile, freeFireUid: e.target.value })}
                    className={inputCls + ' font-mono'}
                    placeholder="e.g. 184920491"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-[#00f0ff] uppercase tracking-widest mb-2">
                    In-Game Nickname (IGN)
                  </label>
                  <input
                    required
                    value={profile.inGameName}
                    onChange={e => setProfile({ ...profile, inGameName: e.target.value })}
                    className={inputCls}
                    placeholder="e.g. EG_SniperKing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                  <input
                    value={profile.displayName}
                    onChange={e => setProfile({ ...profile, displayName: e.target.value })}
                    className={inputCls}
                    placeholder="Your public name in rankings"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      className={inputCls + ' pl-10 font-mono'}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Gamer Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00f0ff]/50 transition-all text-sm resize-none"
                  placeholder="Competitive Free Fire player & Clash Squad IGL..."
                />
              </div>

              {/* Read-only fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Username (fixed)</label>
                  <input value={profile.username} disabled className={inputCls + ' opacity-50 cursor-not-allowed'} />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Email (fixed)</label>
                  <input value={profile.email} disabled className={inputCls + ' opacity-50 cursor-not-allowed'} />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="battle-btn-cyan flex items-center gap-2 px-7 py-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Reveal>
          <div className="rounded-2xl border border-[#ffbe1a]/25 bg-black/70 backdrop-blur-sm p-6 shadow-[0_0_30px_rgba(255,190,26,0.08)]">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#ffbe1a]/10 border border-[#ffbe1a]/30 flex items-center justify-center">
                <Lock size={20} className="text-[#ffbe1a]" />
              </div>
              <div>
                <h2 className="text-base font-black text-white font-heading">Security &amp; Password</h2>
                <p className="text-xs text-gray-500 mt-0.5">Change your account password — use min 8 characters</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showOldPw ? 'text' : 'password'} required
                    value={passwordData.currentPassword}
                    onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={inputCls + ' pl-10 pr-10'}
                    placeholder="Your current password"
                  />
                  <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ffbe1a] transition-colors">
                    {showOldPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type={showNewPw ? 'text' : 'password'} required
                      value={passwordData.newPassword}
                      onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className={inputCls + ' pl-10 pr-10'}
                      placeholder="Min 8 characters"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#ffbe1a] transition-colors">
                      {showNewPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password" required
                      value={passwordData.confirmPassword}
                      onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className={inputCls + ' pl-10'}
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="battle-btn-gold flex items-center gap-2 px-7 py-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Reveal>
          <div className="rounded-2xl border border-[#a855f7]/25 bg-black/70 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center">
                <Shield size={20} className="text-[#a855f7]" />
              </div>
              <div>
                <h2 className="text-base font-black text-white font-heading">Notification Preferences</h2>
                <p className="text-xs text-gray-500 mt-0.5">Choose which alerts you want to receive</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Match challenge received',      sub: 'Someone challenged you to a battle', on: true },
                { label: 'Match room is ready',           sub: 'Room ID & password released',        on: true },
                { label: 'Result verified & payout sent', sub: 'You\'ve been paid your winnings',   on: true },
                { label: 'Deposit confirmed',             sub: 'Your PKR deposit was approved',      on: true },
                { label: 'Tournament announcements',      sub: 'New events and brackets',            on: false },
                { label: 'Promo & seasonal events',       sub: 'Bonuses and limited offers',        on: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                  </div>
                  <button
                    className={`relative w-11 h-6 rounded-full transition-all ${item.on ? 'bg-[#a855f7]' : 'bg-white/15'}`}
                    onClick={() => {}}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${item.on ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <button className="battle-btn-purple flex items-center gap-2 px-7 py-3">
                <Save size={16} /> Save Preferences
              </button>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
