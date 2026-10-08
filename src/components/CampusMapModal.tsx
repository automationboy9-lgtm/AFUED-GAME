import React, { useState } from 'react';
import { CampusLocation } from '../types/game';
import { CAMPUS_LOCATIONS } from '../data/gameData';
import { sound } from '../utils/audio';
import { X, MapPin, Footprints, Bike, Car, ArrowRight, Compass } from 'lucide-react';

interface CampusMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocationId: string;
  naira: number;
  onTravel: (location: CampusLocation, transport: string, cost: number) => void;
}

export const CampusMapModal: React.FC<CampusMapModalProps> = ({
  isOpen,
  onClose,
  currentLocationId,
  naira,
  onTravel
}) => {
  const [selectedLoc, setSelectedLoc] = useState<CampusLocation>(
    CAMPUS_LOCATIONS.find((l) => l.id !== currentLocationId) || CAMPUS_LOCATIONS[1]
  );
  const [selectedTransport, setSelectedTransport] = useState<'trek' | 'okada' | 'danfo' | 'cab'>('okada');

  if (!isOpen) return null;

  const transportOptions = [
    { id: 'trek', name: 'Trek', cost: 0, time: '15 mins', icon: Footprints },
    { id: 'okada', name: 'Okada', cost: 200, time: '3 mins', icon: Bike },
    { id: 'danfo', name: 'Danfo', cost: 250, time: '6 mins', icon: Car },
    { id: 'cab', name: 'Cab', cost: 800, time: '2 mins', icon: Car }
  ] as const;

  const activeCost = transportOptions.find((t) => t.id === selectedTransport)?.cost || 0;
  const canAfford = naira >= activeCost;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">AFUED Campus & City Map</h2>
              <p className="text-xs text-slate-500">Tap a landmark to travel</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Visualization Grid matching Video 00:34 */}
        <div className="relative w-full h-56 sm:h-72 bg-gradient-to-br from-emerald-100 via-sky-100 to-amber-100 p-4 overflow-hidden border-b border-slate-200">
          {/* Decorative Campus Lagoon / Roadway */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-14 bg-sky-200/80 -rotate-3 border-y-2 border-sky-300 flex items-center justify-center text-sky-800 font-extrabold text-[11px] tracking-widest uppercase">
            Campus Boulevard & River Avenue
          </div>

          {/* Landmarks Markers */}
          {CAMPUS_LOCATIONS.map((loc) => {
            const isSelected = selectedLoc.id === loc.id;
            const isCurrent = currentLocationId === loc.id;

            return (
              <button
                key={loc.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLoc(loc);
                }}
                style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group transition-all ${
                  isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
              >
                <div
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white ring-4 ring-emerald-500/30'
                      : isCurrent
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{loc.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Landmark Travel Panel */}
        <div className="p-6 bg-slate-50 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedLoc.name}</h3>
                <span className="text-xs text-slate-500 font-medium">{selectedLoc.zone}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{selectedLoc.description}</p>

            {/* Activities */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {selectedLoc.activities.map((act, i) => (
                <span key={i} className="text-[11px] font-medium bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700">
                  {act}
                </span>
              ))}
            </div>
          </div>

          {/* Transport Selector matching Video 00:58 */}
          <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {transportOptions.map((t) => {
                const Icon = t.icon;
                const isPicked = selectedTransport === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTransport(t.id as any);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isPicked
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-80">{t.cost === 0 ? 'Free' : `₦${t.cost}`}</span>
                  </button>
                );
              })}
            </div>

            <button
              disabled={!canAfford}
              onClick={() => {
                sound.playCoin();
                onTravel(selectedLoc, selectedTransport, activeCost);
                onClose();
              }}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                canAfford
                  ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Go: {activeCost === 0 ? 'Free' : `₦${activeCost}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
