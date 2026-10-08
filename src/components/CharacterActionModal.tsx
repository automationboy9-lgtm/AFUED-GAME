import React from 'react';
import { sound } from '../utils/audio';
import { Music, Video, MessageCircle, PhoneCall, X } from 'lucide-react';

interface CharacterActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerAction: (actionKey: 'dance' | 'skit' | 'hustle' | 'mummy') => void;
}

export const CharacterActionModal: React.FC<CharacterActionModalProps> = ({
  isOpen,
  onClose,
  onTriggerAction
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      key: 'dance',
      title: 'Sing Afrobeats',
      tag: '+Fun · Free',
      icon: Music,
      desc: 'Groove to Asake & Burna Boy vibes.',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      key: 'skit',
      title: 'Record a Skit',
      tag: '+Comedy · Earn ₦',
      icon: Video,
      desc: 'Film a funny hostel comedy video for TikTok.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      key: 'hustle',
      title: 'WhatsApp Hustle',
      tag: '+Social · Earn ₦',
      icon: MessageCircle,
      desc: 'Post shoe & thrift arrivals on 24hr Status.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      key: 'mummy',
      title: 'Call Mummy',
      tag: '+Social · Moral Boost',
      icon: PhoneCall,
      desc: 'Receive prayers, blessings, and motherly care.',
      color: 'bg-amber-50 text-amber-600',
    },
  ] as const;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 mx-auto w-11/12 max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-200/90 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900">What should they do?</h3>
          <p className="text-xs text-slate-500">Pick an activity for your student avatar</p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.key}
              onClick={() => {
                sound.playClick();
                onTriggerAction(act.key);
                onClose();
              }}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-left transition-all active:scale-98 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {act.tag}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                  {act.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                  {act.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
