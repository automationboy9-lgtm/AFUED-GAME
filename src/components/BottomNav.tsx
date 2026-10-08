import React from 'react';
import { Home, ShoppingBag, Map, Footprints, Smartphone, User } from 'lucide-react';
import { sound } from '../utils/audio';

export type NavTab = 'home' | 'buy' | 'map' | 'street' | 'phone' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadCount = 2
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'buy', label: 'Buy', icon: ShoppingBag },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'street', label: 'Street', icon: Footprints },
    { id: 'phone', label: 'Phone', icon: Smartphone, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User }
  ] as const;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-full px-2 py-1.5 shadow-2xl border border-slate-200/90 flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id as NavTab);
              }}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>

              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
