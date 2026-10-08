import React from 'react';
import { FurnitureItem, PlacedFurniture, FurnitureAction } from '../types/game';
import { sound } from '../utils/audio';
import { X, Trash2 } from 'lucide-react';

interface FurnitureModalProps {
  placedFurniture: PlacedFurniture | null;
  furnitureItem: FurnitureItem | null;
  onClose: () => void;
  onExecuteAction: (action: FurnitureAction) => void;
  onRemoveFurniture?: (instanceId: string) => void;
}

export const FurnitureModal: React.FC<FurnitureModalProps> = ({
  placedFurniture,
  furnitureItem,
  onClose,
  onExecuteAction,
  onRemoveFurniture
}) => {
  if (!placedFurniture || !furnitureItem) return null;

  return (
    <div className="fixed inset-x-0 bottom-6 z-40 mx-auto w-11/12 max-w-lg bg-white/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-200/90 animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{furnitureItem.name}</h3>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {furnitureItem.dimensions}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{furnitureItem.description}</p>
        </div>

        <div className="flex items-center gap-1.5">
          {onRemoveFurniture && (
            <button
              onClick={() => {
                sound.playClick();
                onRemoveFurniture(placedFurniture.instanceId);
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              title="Store item in inventory"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

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
      </div>

      {/* Action Buttons Grid matching Video */}
      <div className="grid grid-cols-2 gap-2.5">
        {furnitureItem.actions.map((act) => (
          <button
            key={act.id}
            onClick={() => {
              sound.playClick();
              onExecuteAction(act);
              onClose();
            }}
            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl text-left transition-all active:scale-98 hover:shadow-sm group flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900">
              {act.label}
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-600 font-semibold">
              <span>{act.tag}</span>
              <span className="text-[10px] text-slate-400 font-normal">
                {act.durationSeconds}s
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
