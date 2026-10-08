import React, { useState } from 'react';
import { FurnitureItem } from '../types/game';
import { INITIAL_FURNITURE_CATALOG } from '../data/gameData';
import { sound } from '../utils/audio';
import { X, Sparkles, Armchair, BedDouble, Bath, Fan, Lightbulb, GraduationCap, Utensils, Check } from 'lucide-react';

interface CatalogueModalProps {
  naira: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectItemToPlace: (item: FurnitureItem) => void;
  onApplyWallColor?: (color: string) => void;
}

export const CatalogueModal: React.FC<CatalogueModalProps> = ({
  naira,
  isOpen,
  onClose,
  onSelectItemToPlace,
  onApplyWallColor
}) => {
  const [activeCategory, setActiveCategory] = useState<FurnitureItem['category'] | 'design'>('comfort');
  const [selectedWallColor, setSelectedWallColor] = useState<string>('#4682b4');

  if (!isOpen) return null;

  const categories = [
    { id: 'design', label: 'Design', icon: Sparkles },
    { id: 'comfort', label: 'Comfort', icon: Armchair },
    { id: 'sleep', label: 'Sleep', icon: BedDouble },
    { id: 'bath', label: 'Bath', icon: Bath },
    { id: 'skills', label: 'Skills', icon: GraduationCap },
    { id: 'light', label: 'Light', icon: Lightbulb },
  ] as const;

  const wallPaintOptions = [
    { name: 'Classic Cream', color: '#deb887', price: 1000 },
    { name: 'Lagos Sky Blue', color: '#4682b4', price: 2000 },
    { name: 'Mint Fresh', color: '#2dd4bf', price: 2000 },
    { name: 'Peach Glow', color: '#fb923c', price: 2500 },
    { name: 'Emerald Velvet', color: '#047857', price: 3000 },
  ];

  const filteredItems = INITIAL_FURNITURE_CATALOG.filter(
    (item) => item.category === activeCategory
  );

  return (
    <div className="fixed inset-x-0 bottom-0 sm:bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 w-full sm:w-[94%] max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[82vh] animate-in fade-in slide-in-from-bottom-8 duration-200">
      {/* Header matching Video */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">Catalogue</h2>
          <span className="text-xs text-slate-500 font-medium">Hostel & Living Decor</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1"
        >
          <span>Hide</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Categories Bar matching Video */}
      <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="p-6 overflow-y-auto max-h-[50vh]">
        {activeCategory === 'design' ? (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Wall Paint & Room Ambiance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wallPaintOptions.map((opt) => (
                <div
                  key={opt.name}
                  onClick={() => {
                    sound.playClick();
                    setSelectedWallColor(opt.color);
                    if (onApplyWallColor) onApplyWallColor(opt.color);
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedWallColor === opt.color
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div
                    className="w-full h-14 rounded-xl shadow-inner mb-2 flex items-center justify-center text-white"
                    style={{ backgroundColor: opt.color }}
                  >
                    {selectedWallColor === opt.color && <Check className="w-5 h-5 drop-shadow" />}
                  </div>
                  <div className="text-xs font-bold text-slate-800">{opt.name}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                    ₦{opt.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => {
              const canAfford = naira >= item.price;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Dimension badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.dimensions}
                      </span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color || '#3b82f6' }} />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">
                      ₦{item.price.toLocaleString()}
                    </span>

                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        sound.playCoin();
                        onSelectItemToPlace(item);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                        canAfford
                          ? 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Place' : 'No Funds'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
