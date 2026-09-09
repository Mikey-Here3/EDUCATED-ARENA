'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Trash2,
  Swords,
  Wallet,
  Trophy,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'MATCH',
      title: 'Match Result Finalized',
      message: 'Match EG-M-1024 has concluded. Congratulations on your victory! PKR 900 has been credited to your available wallet.',
      isRead: false,
      createdAt: '10 mins ago',
      linkUrl: '/dashboard/matches',
    },
    {
      id: 'notif-2',
      type: 'ROOM',
      title: 'Room Credentials Assigned',
      message: 'Room ID 19827364 and Password have been set for your upcoming 4v4 Clash Squad against ViperSquad.',
      isRead: false,
      createdAt: '1 hour ago',
      linkUrl: '/dashboard/matches',
    },
    {
      id: 'notif-3',
      type: 'WALLET',
      title: 'Deposit Approved',
      message: 'Your deposit of PKR 1,000 via Easypaisa has been verified and added to your available ledger balance.',
      isRead: true,
      createdAt: 'Yesterday',
      linkUrl: '/dashboard/wallet',
    },
  ]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function deleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[10px] font-black text-[#00f0ff] mb-2 uppercase tracking-widest shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              <Bell size={12} />
              Intel Feed
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-heading text-glow-cyan">
              Notification Center
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Match alerts, room credentials, and verified wallet credits.
            </p>
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all self-start sm:self-auto"
            >
              <CheckCheck className="w-4 h-4 text-[#00f0ff]" />
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </Reveal>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <Stagger className="space-y-3" staggerDelay={0.07}>
          {notifications.map((n) => {
            const isMatch = n.type === 'MATCH';
            const isRoom = n.type === 'ROOM';
            const isWallet = n.type === 'WALLET';

            return (
              <StaggerItem key={n.id}>
                <div
                  className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex items-start justify-between gap-4 ${
                    n.isRead
                      ? 'bg-[#080c1e]/60 border-white/8 hover:border-white/20'
                      : 'bg-[#0a1232]/80 border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isMatch
                          ? 'bg-[#ffbe1b]/15 border-[#ffbe1b]/40 text-[#ffbe1b]'
                          : isRoom
                          ? 'bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#00f0ff]'
                          : 'bg-[#00ff88]/15 border-[#00ff88]/40 text-[#00ff88]'
                      }`}
                    >
                      {isMatch ? (
                        <Trophy size={18} />
                      ) : isRoom ? (
                        <Swords size={18} />
                      ) : (
                        <Wallet size={18} />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm leading-snug font-heading">
                          {n.title}
                        </h3>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-4 pt-1.5 text-[10px]">
                        <span className="text-slate-500 font-mono">{n.createdAt}</span>
                        {n.linkUrl && (
                          <Link
                            href={n.linkUrl}
                            className="font-black text-[#00f0ff] hover:text-white transition-colors flex items-center gap-1 uppercase"
                          >
                            <span>View Details</span>
                            <ArrowRight size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => deleteNotif(n.id)}
                    className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    title="Dismiss"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      ) : (
        /* Intentional Empty State */
        <Reveal>
          <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-white/15 bg-[#060816] max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center mx-auto mb-4 text-[#00f0ff]">
              <Sparkles size={28} />
            </div>
            <h3 className="text-xl font-black text-white font-heading uppercase italic mb-1 text-glow-cyan">
              YOU&apos;RE ALL CLEAR
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              No unread alerts or match reminders right now. Jump into the arena and challenge real opponents.
            </p>
            <Link
              href="/dashboard/challenges"
              className="battle-btn-cyan py-3.5 px-7 rounded-xl text-xs font-black uppercase tracking-wider text-black inline-flex items-center gap-2 shadow-lg"
            >
              <Swords size={16} />
              EXPLORE BATTLES
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}
