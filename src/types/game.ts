export type Gender = 'man' | 'woman';

export type Hairstyle = 'low_cut' | 'bald' | 'curls' | 'afro' | 'locs' | 'braids' | 'classic';

export type OutfitStyle = 'casual' | 'hoodie' | 'office' | 'ankara' | 'chill';

export type SkinTone = '#3d2314' | '#5c3317' | '#7c4728' | '#9c5b36' | '#b97446' | '#d49466';

export interface CharacterAppearance {
  gender: Gender;
  hairstyle: Hairstyle;
  hairColor: string;
  outfit: OutfitStyle;
  shirtColor: string;
  pantsColor: string;
  skinTone: SkinTone;
  accessories?: 'sunglasses' | 'cap' | 'none';
}

export interface PlayerNeeds {
  hunger: number; // 0-100
  energy: number; // 0-100
  fun: number;    // 0-100
  social: number; // 0-100
  hygiene: number;// 0-100
  bladder: number;// 0-100
}

export interface PlayerSkills {
  cooking: number;
  charisma: number;
  fitness: number;
  coding: number;
  music: number;
  hustle: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: 'design' | 'sleep' | 'kitchen' | 'bath' | 'comfort' | 'fun' | 'skills' | 'light';
  price: number;
  description: string;
  dimensions: string; // e.g., '2x1'
  iconName: string;
  color?: string;
  actions: FurnitureAction[];
  modelType: 'sofa' | 'bed' | 'chair' | 'table' | 'toilet' | 'bucket' | 'fan' | 'tv' | 'ac' | 'desk' | 'generator' | 'lantern' | 'plant' | 'fridge';
}

export interface PlacedFurniture {
  instanceId: string;
  furnitureId: string;
  x: number; // grid position
  z: number;
  rotation: number; // 0, 90, 180, 270 in radians
}

export interface FurnitureAction {
  id: string;
  label: string;
  tag: string; // e.g. '+Energy', '+Fun'
  durationSeconds: number;
  effect: {
    energy?: number;
    hunger?: number;
    fun?: number;
    social?: number;
    hygiene?: number;
    bladder?: number;
    money?: number;
    skill?: keyof PlayerSkills;
    skillGain?: number;
  };
  animation: 'sit' | 'sleep' | 'bath' | 'toilet' | 'study' | 'relax' | 'eat';
}

export interface CampusLocation {
  id: string;
  name: string;
  zone: string;
  description: string;
  coordinates: { x: number; y: number };
  activities: string[];
}

export interface StreetNPC {
  id: string;
  name: string;
  role: string;
  dialogue: string;
  actionLabel?: string;
  actionCost?: number;
  effect?: {
    hunger?: number;
    energy?: number;
    fun?: number;
  };
  x: number;
  z: number;
}

export interface PhoneMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  unread: boolean;
  replies?: string[];
}

export interface HustleJob {
  id: string;
  title: string;
  client: string;
  payout: number;
  energyCost: number;
  requiredSkill: keyof PlayerSkills;
  requiredLevel: number;
  description: string;
}
