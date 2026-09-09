'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, ArrowLeft, Shield, Clock, Key, Lock, Copy, CheckCircle2, Trophy, AlertCircle, Loader2 } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';

export default function MatchLobbyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: matchId } = use(params);
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedRoom, setCopiedRoom] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  useEffect(() => {
    async function loadMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`);
        const json = await res.json();
        if (json.match) {
          setMatch(json.match);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [matchId]);

  function copyText(text: string, type: 'room' | 'pass') {
    navigator.clipboard.writeText(text);
    if (type === 'room') {
      setCopiedRoom(true);
      setTimeout(() => setCopiedRoom(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-violet-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-white mb-2">Match Not Found</h2>
        <Link href="/dashboard/matches">
          <Button variant="secondary">Back to Matches</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/matches" className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">Match Lobby</h1>
              <span className="text-xs font-mono font-bold text-violet-400">{match.publicId}</span>
            </div>
            <p className="text-xs text-slate-400">Free Fire Official Custom Room Operations</p>
          </div>
        </div>
        <StatusBadge status={match.status} />
      </div>

      {/* Versus Banner */}
      <Card className="bg-gradient-to-r from-violet-950/40 via-black to-violet-950/40 border-violet-800/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Side 1 (Creator)</span>
            <h3 className="text-lg font-extrabold text-white">{match.participants[0]?.user.displayName}</h3>
            <p className="text-xs text-violet-400 font-mono mt-1">UID: {match.participants[0]?.user.freeFireUid || 'Not set'}</p>
          </div>

          <div>
            <div className="w-12 h-12 rounded-full gradient-purple mx-auto flex items-center justify-center font-black text-white text-sm glow-purple-sm">
              VS
            </div>
            <p className="text-xs text-slate-400 mt-2 font-semibold">{match.format} • {match.gameMode?.name}</p>
            <p className="text-[11px] text-amber-400 font-bold mt-1">Prize: {formatCurrency(match.prizePool)}</p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-zinc-800">
            <span className="text-xs text-slate-400 uppercase font-bold block mb-1">Side 2 (Challenger)</span>
            <h3 className="text-lg font-extrabold text-white">{match.participants[1]?.user.displayName || 'TBD'}</h3>
            <p className="text-xs text-violet-400 font-mono mt-1">UID: {match.participants[1]?.user.freeFireUid || 'Not set'}</p>
          </div>
        </div>
      </Card>

      {/* Free Fire Custom Room Credentials */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" /> Free Fire Custom Room Credentials
          </CardTitle>
          <CardDescription>
            Join the custom room in the Free Fire client using these exact details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {match.canSeeRoom && match.room ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Room ID</span>
                  <span className="text-xl font-mono font-black text-white">{match.room.roomId}</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyText(match.room.roomId, 'room')}
                  className="text-xs"
                >
                  {copiedRoom ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Room Password</span>
                  <span className="text-xl font-mono font-black text-white">{match.room.roomPassword}</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => copyText(match.room.roomPassword, 'pass')}
                  className="text-xs"
                >
                  {copiedPass ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-black/40 border border-dashed border-zinc-800 text-center">
              <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white mb-1">Room Credentials Not Yet Assigned</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Our match manager will generate and publish the custom room details 10 minutes prior to scheduled start.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Winner Summary if Completed */}
      {match.status === 'COMPLETED' && (
        <Card className="bg-gradient-to-r from-amber-500/10 via-zinc-900/50 to-amber-500/10 border-amber-500/30 p-6 text-center">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white mb-1">Match Completed & Settled</h3>
          <p className="text-xs text-slate-300">
            Winner: Side {match.result?.winnerSide} ({match.participants[match.result?.winnerSide - 1]?.user.displayName})
          </p>
          <p className="text-xs text-amber-400 font-bold mt-2">
            Prize distributed to registered winner&apos;s wallet balance.
          </p>
        </Card>
      )}

      {/* Referee & Match Guidelines */}
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" /> Operational Fair Play Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-400 space-y-2">
          <p>• All players must join the room within 15 minutes of room publication.</p>
          <p>• Playing with an unregistered Free Fire UID will forfeit the game immediately.</p>
          <p>• Ensure you take an uncropped end-game scoreboard screenshot in case of dispute.</p>
        </CardContent>
      </Card>
    </div>
  );
}
