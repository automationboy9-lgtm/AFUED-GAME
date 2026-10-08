import React, { useState } from 'react';
import { PhoneMessage, HustleJob, CampusLocation } from '../types/game';
import { HUSTLE_JOBS, CAMPUS_LOCATIONS } from '../data/gameData';
import { sound } from '../utils/audio';
import {
  X,
  Briefcase,
  MessageCircle,
  Car,
  Landmark,
  Music,
  Settings,
  ChevronLeft,
  Send,
  CheckCircle2,
  Bike
} from 'lucide-react';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  naira: number;
  messages: PhoneMessage[];
  onReplyMessage: (msgId: string, replyText: string) => void;
  onAcceptJob: (job: HustleJob) => void;
  onTravel: (location: CampusLocation, transportType: string, cost: number) => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  isOpen,
  onClose,
  naira,
  messages,
  onReplyMessage,
  onAcceptJob,
  onTravel
}) => {
  const [currentApp, setCurrentApp] = useState<'home' | 'jobs' | 'messages' | 'ride' | 'bank' | 'music'>('home');
  const [selectedMessage, setSelectedMessage] = useState<PhoneMessage | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Smartphone Device Frame matching Video 00:22 */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[640px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 flex flex-col justify-between overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Screen Container */}
        <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-[34px] overflow-hidden flex flex-col text-white">
          {/* Status Bar */}
          <div className="px-6 pt-3.5 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>3:32 PM</span>
            <div className="flex items-center gap-2">
              <span>4G</span>
              <span>94%</span>
            </div>
          </div>

          {/* App Views */}
          {currentApp === 'home' && (
            <div className="flex-1 p-5 flex flex-col justify-between">
              {/* Date & Location Header */}
              <div className="text-center mt-3">
                <h2 className="text-3xl font-extrabold tracking-tight">3:32</h2>
                <p className="text-xs text-slate-300 font-medium mt-0.5">
                  Wednesday 7 October · AFUED Ondo
                </p>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-3 gap-y-6 gap-x-4 px-2 my-auto">
                {/* Jobs */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentApp('jobs');
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">Jobs</span>
                </button>

                {/* Messages */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentApp('messages');
                  }}
                  className="relative flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">Messages</span>
                  {messages.some((m) => m.unread) && (
                    <span className="absolute top-0 right-3 w-4 h-4 bg-red-500 text-[10px] font-bold rounded-full flex items-center justify-center">
                      !
                    </span>
                  )}
                </button>

                {/* Ride / Transit */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentApp('ride');
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Car className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">Ride</span>
                </button>

                {/* Bank */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentApp('bank');
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Landmark className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">OPay Bank</span>
                </button>

                {/* Afrobeats Music */}
                <button
                  onClick={() => {
                    sound.playAfrobeatsBeat();
                    setCurrentApp('music');
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">Afrobeats</span>
                </button>

                {/* Close Phone */}
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform"
                >
                  <div className="w-13 h-13 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                    <X className="w-6 h-6 text-slate-300" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-200">Close</span>
                </button>
              </div>

              {/* Bottom Dock */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-3 flex items-center justify-around">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* INNER APPS */}
          {currentApp === 'jobs' && (
            <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <button onClick={() => setCurrentApp('home')} className="flex items-center text-xs text-emerald-400 font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <h3 className="text-sm font-bold">Campus Hustles</h3>
                <span className="text-xs text-slate-400 font-mono">₦{naira.toLocaleString()}</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                {HUSTLE_JOBS.map((job) => (
                  <div key={job.id} className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{job.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{job.client}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        +₦{job.payout.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{job.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Energy: -{job.energyCost}</span>
                      <button
                        onClick={() => {
                          sound.playCoin();
                          onAcceptJob(job);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        Accept & Work
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentApp === 'messages' && (
            <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <button onClick={() => { setCurrentApp('home'); setSelectedMessage(null); }} className="flex items-center text-xs text-sky-400 font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <h3 className="text-sm font-bold">Naija Chats</h3>
                <div />
              </div>

              {selectedMessage ? (
                <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
                  <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{selectedMessage.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{selectedMessage.sender}</div>
                        <div className="text-[10px] text-slate-400">{selectedMessage.time}</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{selectedMessage.text}</p>
                  </div>

                  {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                    <div className="space-y-1.5 mt-3">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Quick Reply:</span>
                      {selectedMessage.replies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            sound.playClick();
                            onReplyMessage(selectedMessage.id, reply);
                            setSelectedMessage(null);
                          }}
                          className="w-full text-left p-2.5 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800/60 rounded-xl text-xs font-medium text-sky-200 transition-colors flex items-center justify-between"
                        >
                          <span>{reply}</span>
                          <Send className="w-3.5 h-3.5 text-sky-400" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 p-2.5 overflow-y-auto space-y-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedMessage(m);
                      }}
                      className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <span className="text-2xl">{m.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{m.sender}</h4>
                          <span className="text-[10px] text-slate-400">{m.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate mt-0.5">{m.text}</p>
                      </div>
                      {m.unread && <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentApp === 'ride' && (
            <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <button onClick={() => setCurrentApp('home')} className="flex items-center text-xs text-amber-400 font-semibold">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <h3 className="text-sm font-bold">AFUED Transit</h3>
                <div />
              </div>
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                <span className="text-[11px] text-slate-400 font-semibold">Where are you going?</span>
                {CAMPUS_LOCATIONS.map((loc) => (
                  <div key={loc.id} className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{loc.name}</h4>
                        <p className="text-[10px] text-slate-400">{loc.zone}</p>
                      </div>
                    </div>
                    {/* Rides */}
                    <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                      <button
                        onClick={() => {
                          sound.playStep();
                          onTravel(loc, 'Trek', 0);
                          onClose();
                        }}
                        className="p-1.5 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-center"
                      >
                        <div className="text-[10px] font-bold text-slate-200">Trek</div>
                        <div className="text-[9px] text-emerald-400">Free</div>
                      </button>

                      <button
                        onClick={() => {
                          sound.playCoin();
                          onTravel(loc, 'Okada', 200);
                          onClose();
                        }}
                        className="p-1.5 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-center"
                      >
                        <div className="text-[10px] font-bold text-slate-200">Okada</div>
                        <div className="text-[9px] text-amber-400">₦200</div>
                      </button>

                      <button
                        onClick={() => {
                          sound.playCoin();
                          onTravel(loc, 'Danfo', 250);
                          onClose();
                        }}
                        className="p-1.5 bg-slate-700/60 hover:bg-slate-700 rounded-lg text-center"
                      >
                        <div className="text-[10px] font-bold text-slate-200">Danfo</div>
                        <div className="text-[9px] text-amber-400">₦250</div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentApp === 'bank' && (
            <div className="flex-1 bg-slate-900 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentApp('home')} className="flex items-center text-xs text-purple-400 font-semibold">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                  <h3 className="text-sm font-bold">OPay Student Wallet</h3>
                  <div />
                </div>

                <div className="bg-gradient-to-tr from-purple-700 to-indigo-600 rounded-2xl p-4 shadow-lg text-white">
                  <div className="text-xs text-purple-200 font-medium">Available Balance</div>
                  <div className="text-2xl font-extrabold mt-1">₦{naira.toLocaleString()}</div>
                  <div className="text-[10px] text-purple-300 mt-3 font-mono">Acct: 813 492 0182 (AFUED Branch)</div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    sound.playCoin();
                    alert('₦5,000 allowance sent from Mummy! ❤️');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-colors"
                >
                  Request Family Allowance (+₦5,000)
                </button>
              </div>
            </div>
          )}

          {currentApp === 'music' && (
            <div className="flex-1 bg-slate-900 p-5 flex flex-col items-center justify-center text-center">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-2xl mb-4 animate-bounce">
                <Music className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-base font-bold text-white">Lagos Vibe Radio</h3>
              <p className="text-xs text-slate-400 mt-1">Now Playing: Asake - Lonely at the Top</p>

              <button
                onClick={() => {
                  sound.playAfrobeatsBeat();
                }}
                className="mt-6 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-bold shadow-lg transition-colors"
              >
                Play Drum Rhythm
              </button>

              <button
                onClick={() => setCurrentApp('home')}
                className="mt-4 text-xs text-slate-400 hover:text-white"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
