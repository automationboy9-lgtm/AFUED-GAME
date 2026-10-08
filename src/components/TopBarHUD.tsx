import React from 'react';
import { Volume2, VolumeX, Plus, Zap, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopBarHUDProps {
  naira: number;
  mood: string;
  nepaOff: boolean;
  eventToast: string | null;
  onOpenHustle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleNepa: () => void;
}

export const TopBarHUD: React.FC<TopBarHUDProps> = ({
  naira,
  mood,
  nepaOff,
  eventToast,
  onOpenHustle,
  isMuted,
  onToggleMute,
  onToggleNepa
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-4 flex flex-col items-center gap-2">
      {/* Primary Top Island Bar */}
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-full px-4 py-2.5 shadow-lg border border-slate-200/80 pointer-events-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium text-slate-700">
        {/* Left: Clock & Mood */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Wed 7 · 3:32 PM</span>
          </div>

          <span className="hidden sm:inline text-slate-300">|</span>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200/50">
            <span>{mood}</span>
          </div>
        </div>

        {/* Center: Online population & NEPA button */}
        <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>20.4m · 82k online</span>
          </div>

          <button
            onClick={() => {
              onToggleNepa();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              nepaOff
                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle NEPA electricity status"
          >
            <Zap className={`w-3.5 h-3.5 ${nepaOff ? 'text-amber-600' : 'text-emerald-500'}`} />
            <span>{nepaOff ? 'NEPA took light!' : 'Steady Light'}</span>
          </button>
        </div>

        {/* Right: Balance & Audio */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            <span>₦{naira.toLocaleString()}</span>
            <button
              onClick={() => {
                sound.playClick();
                onOpenHustle();
              }}
              className="ml-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
              title="Do quick hustle / earn money"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => {
              onToggleMute();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Dynamic Event Notification Toast (as seen in video) */}
      {eventToast && (
        <div className="pointer-events-auto bg-slate-900/90 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{eventToast}</span>
        </div>
      )}
    </div>
  );
};
