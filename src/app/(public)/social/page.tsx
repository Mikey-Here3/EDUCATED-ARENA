import { Reveal, Stagger, StaggerItem } from '@/components/motion';
import { Gamepad2, Play, Users, MessageCircle, ExternalLink } from 'lucide-react';
import { MobileBattleNav } from '@/components/navigation/mobile-battle-nav';

const SOCIALS = [
  {
    id: 'youtube',
    name: 'YouTube',
    tag: '@EducatedGamerArena',
    desc: 'Watch live casts, championship highlights, and aim tutorials.',
    url: 'https://youtube.com',
    icon: Play,
    color: '#FF0000',
    stat: '25K+ Subs'
  },
  {
    id: 'discord',
    name: 'Discord',
    tag: 'EGA Official',
    desc: 'Join the community, find scrims, and request live referee support.',
    url: 'https://discord.com',
    icon: MessageCircle,
    color: '#5865F2',
    stat: '10K+ Online'
  },
  {
    id: 'facebook',
    name: 'Facebook Group',
    tag: 'Educated Gamer Arena PK',
    desc: 'Share your booyahs, recruit squad members, and vote on polls.',
    url: 'https://facebook.com',
    icon: Users,
    color: '#1877F2',
    stat: '50K+ Members'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    tag: '@educatedgamer.arena',
    desc: 'Behind the scenes, quick clips, and tournament announcements.',
    url: 'https://instagram.com',
    icon: Gamepad2,
    color: '#E1306C',
    stat: '15K+ Followers'
  }
];

export default function SocialPage() {
  return (
    <div className="min-h-screen pb-32 pt-20 px-4 sm:px-6 max-w-5xl mx-auto">
      <Reveal>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#8B5CF6]/35 bg-[#8B5CF6]/10 text-xs font-black text-[#8B5CF6] mb-3 uppercase tracking-wider">
            <Users size={14} />
            EGA COMMUNITY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white italic tracking-tight font-heading text-glow-purple">
            JOIN THE NETWORK
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-2">
            Connect with thousands of Pakistani Free Fire warriors across our official channels.
          </p>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SOCIALS.map((social) => {
          const Icon = social.icon;
          return (
            <StaggerItem key={social.id}>
              <a 
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block cyber-card-3d p-6 border-2 transition-all duration-300 hover:-translate-y-1 group"
                style={{ borderColor: `${social.color}30` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all" style={{ backgroundColor: `${social.color}15`, borderColor: `${social.color}40`, boxShadow: `0 0 20px ${social.color}20` }}>
                    <Icon size={24} style={{ color: social.color }} />
                  </div>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 border border-white/10 text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: social.color }} />
                    {social.stat}
                  </div>
                </div>

                <h3 className="text-xl font-black text-white font-heading italic mb-1 group-hover:text-white transition-colors" style={{ textShadow: `0 0 10px ${social.color}50` }}>
                  {social.name}
                </h3>
                <span className="text-xs font-mono text-slate-400 block mb-3 font-semibold">
                  {social.tag}
                </span>
                
                <p className="text-sm text-slate-300 mb-6 line-clamp-2">
                  {social.desc}
                </p>

                <div className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all border bg-black/50" style={{ borderColor: `${social.color}50` }}>
                  CONNECT NOW
                  <ExternalLink size={14} />
                </div>
              </a>
            </StaggerItem>
          );
        })}
      </Stagger>

      <MobileBattleNav />
    </div>
  );
}
