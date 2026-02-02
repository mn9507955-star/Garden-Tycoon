
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythical' | 'Cyber' | 'Celestial';
export type PlantCategory = 'Vegetable' | 'Fruit' | 'Flower' | 'Magical' | 'Tech' | 'Cosmic';

export interface PlantType {
  id: string;
  name: string;
  emoji: string;
  growthTime: number; // in seconds
  waterConsumption: number; // water lost per tick
  buyPrice: number;
  sellPrice: number;
  description: string;
  rarity: Rarity;
  category: PlantCategory;
  unlockLevel: number; // New: Level required to buy
  xpReward: number; // New: XP gained on harvest
}

export type ItemId = 
  | 'fertilizer' 
  | 'revive_potion' 
  | 'super_water' 
  | 'sprinkler_basic' 
  | 'sprinkler_advanced' 
  | 'sprinkler_pro'
  | 'toy_ball' 
  | 'toy_yarn' 
  | 'toy_whistle';

export interface ItemType {
  id: ItemId;
  name: string;
  emoji: string;
  price: number;
  description: string;
  effect: 'speed_growth' | 'revive' | 'max_water' | 'reduce_pet_cooldown' | 'auto_water';
  cooldownReduction?: number; // Seconds to reduce for pet
  duration?: number; // Seconds for auto effects like sprinkler
}

export type PetId = 'dog' | 'cat' | 'frog' | 'chicken' | 'bee' | 'cloud_spirit' | 'sun_spirit' | 'dragon' | 'unicorn' | 'time_keeper';

export interface PetType {
  id: PetId;
  name: string;
  emoji: string;
  price: number;
  description: string;
  baseCooldown: number; // Seconds waiting
  activeDuration: number; // New: Seconds the pet stays active
  abilityType: 'buff_xp' | 'buff_money' | 'summon_weather' | 'grow_plants';
  abilityValue?: number | string; // XP amount, WeatherType, etc.
}

export type VariantType = 
  | 'Normal' 
  | 'Good' 
  | 'Golden' 
  | 'Diamond' 
  | 'Magma' 
  | 'Ice' 
  | 'Thunder' 
  | 'Air' 
  | 'Mist' 
  | 'Void'
  | 'Sand'
  | 'Cosmic'
  | 'Mystic'
  | 'Toxic'
  | 'Cyber'
  | 'Glitch';

export interface CellData {
  id: number;
  plantId: string | null;
  growthProgress: number; // 0 to 100
  waterLevel: number; // 0 to 100
  isDead: boolean;
  variant: VariantType; 
}

export type ToolType = 'water' | 'harvest' | 'shovel' | 'select_seed' | ItemId;

export type WeatherType = 
  | 'Sunny' 
  | 'Rainy' 
  | 'Heatwave' 
  | 'Cloudy' 
  | 'Storm' 
  | 'GoldenHour' 
  | 'DiamondSky' 
  | 'Rainbow'
  | 'Windy'
  | 'Foggy'
  | 'Snowy'
  | 'Eclipse'
  | 'Sandstorm'
  | 'MeteorShower'
  | 'Aurora'
  | 'AcidRain'
  | 'Drought'
  | 'Blizzard'
  | 'Hailstorm';

export interface Rival {
  id: string;
  name: string;
  money: number;
  level: number;
  growthRate: number; // Money earning speed multiplier
  lastUpdated: number;
  isOnline: boolean;
}

// New Types for Daily Rewards
export interface DailyReward {
  day: number;
  type: 'money' | 'item' | 'seed';
  value: number | string; // Amount for money, ID for item/seed
  count: number;
  label: string;
  icon?: string;
}

export interface GameState {
  playerName: string; // New: Player Name
  money: number;
  level: number;
  xp: number;
  inventory: Record<ItemId, number>;
  grid: CellData[];
  selectedTool: ToolType;
  selectedSeedId: string | null;
  weather: WeatherType;
  weatherTimeLeft: number; // New: Duration left for special weather
  ownedPets: PetId[];
  equippedPet: PetId | null;
  petCooldownTimer: number; // Seconds until ready
  petActiveTimer: number; // Seconds remaining for active ability
  
  // New State for Features
  sprinklerEndTime: number; // Timestamp when sprinkler stops
  shopStock: Record<string, number>; // Maps PlantId to Quantity
  shopNextRefresh: number; // Timestamp for next stock
  
  // Daily Login State
  lastLoginDate: number; // Timestamp of last login (set to midnight)
  consecutiveDays: number; // Current streak (1-7)
  lastClaimedDate: number; // Timestamp of last claim
  lastSaveTime: number; // Timestamp of last save (for offline progress)
  
  // Migration
  version?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  isAnonymous: boolean;
}
