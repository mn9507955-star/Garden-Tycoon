
import { PlantType, Rarity, PlantCategory, WeatherType, VariantType, ItemType, ItemId, PetType, PetId, DailyReward } from './types';

export const GRID_SIZE = 12; 
export const TICK_RATE = 1000; 
export const SHOP_REFRESH_RATE = 4 * 60 * 1000; // 4 minutes
export const SAVE_VERSION = 1.1; // Increment this when making breaking changes to save structure

// --- Daily Rewards Configuration ---
export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, type: 'money', value: 100, count: 100, label: '$100 Tiền Mặt' },
  { day: 2, type: 'item', value: 'fertilizer', count: 2, label: '2x Phân Bón' },
  { day: 3, type: 'money', value: 500, count: 500, label: '$500 Tiền Mặt' },
  { day: 4, type: 'item', value: 'super_water', count: 2, label: '2x Nước Thần' },
  { day: 5, type: 'money', value: 1000, count: 1000, label: '$1,000 Tiền Mặt' },
  { day: 6, type: 'seed', value: 'pumpkin', count: 1, label: '1x Hạt Bí Ngô' },
  { day: 7, type: 'seed', value: 'golden_apple', count: 1, label: '1x Táo Vàng' },
];

// --- Variants Configuration ---
export const VARIANTS: Record<VariantType, { label: string; color: string; multiplier: number; chance: number }> = {
  Normal: { label: 'Thường', color: 'text-white', multiplier: 1, chance: 1 },
  Good: { label: 'Tốt', color: 'text-green-400', multiplier: 1.2, chance: 0.15 },
  Golden: { label: 'Vàng', color: 'text-yellow-400', multiplier: 5, chance: 0.05 },
  Diamond: { label: 'Kim Cương', color: 'text-cyan-400', multiplier: 10, chance: 0.01 },
  Magma: { label: 'Dung Nham', color: 'text-orange-500', multiplier: 3, chance: 0 },
  Ice: { label: 'Băng Giá', color: 'text-sky-300', multiplier: 2, chance: 0 },
  Thunder: { label: 'Sấm Sét', color: 'text-violet-400', multiplier: 4, chance: 0 },
  Air: { label: 'Khí', color: 'text-teal-200', multiplier: 1.5, chance: 0 },
  Mist: { label: 'Sương Mù', color: 'text-fuchsia-300', multiplier: 1.5, chance: 0 },
  Void: { label: 'Hư Vô', color: 'text-indigo-300', multiplier: 8, chance: 0 },
  Sand: { label: 'Cát', color: 'text-amber-400', multiplier: 1.8, chance: 0 },
  Cosmic: { label: 'Vũ Trụ', color: 'text-indigo-400', multiplier: 15, chance: 0 },
  Mystic: { label: 'Huyền Bí', color: 'text-pink-300', multiplier: 6, chance: 0 },
  Toxic: { label: 'Độc Dược', color: 'text-lime-500', multiplier: 0.5, chance: 0 },
  Cyber: { label: 'Công Nghệ', color: 'text-emerald-400', multiplier: 7, chance: 0 },
  Glitch: { label: 'Lỗi', color: 'text-red-500', multiplier: 0.1, chance: 0 },
};

// --- Items Configuration (Tools & Toys) ---
export const ITEMS: Record<ItemId, ItemType> = {
  // Tools - Consumables
  fertilizer: {
    id: 'fertilizer',
    name: 'Phân Bón',
    emoji: '⚡',
    price: 50,
    description: 'Tăng 40% tăng trưởng ngay lập tức.',
    effect: 'speed_growth'
  },
  revive_potion: {
    id: 'revive_potion',
    name: 'Thuốc Hồi Sinh',
    emoji: '🧪',
    price: 150,
    description: 'Cứu sống một cây đã chết.',
    effect: 'revive'
  },
  super_water: {
    id: 'super_water',
    name: 'Nước Thần',
    emoji: '💧',
    price: 25,
    description: 'Đổ đầy bình nước ngay lập tức.',
    effect: 'max_water'
  },
  // Sprinklers
  sprinkler_basic: {
    id: 'sprinkler_basic',
    name: 'Vòi Tưới Cơ Bản',
    emoji: '🚿',
    price: 300,
    description: 'Tự động tưới nước trong 3 phút.',
    effect: 'auto_water',
    duration: 180 // 3 mins
  },
  sprinkler_advanced: {
    id: 'sprinkler_advanced',
    name: 'Vòi Tưới Xịn',
    emoji: '🚿',
    price: 550,
    description: 'Tự động tưới nước trong 6 phút.',
    effect: 'auto_water',
    duration: 360 // 6 mins
  },
  sprinkler_pro: {
    id: 'sprinkler_pro',
    name: 'Vòi Tưới Pro',
    emoji: '🚿',
    price: 800,
    description: 'Tự động tưới nước trong 9 phút.',
    effect: 'auto_water',
    duration: 540 // 9 mins
  },
  // Toys
  toy_ball: {
    id: 'toy_ball',
    name: 'Bóng Cao Su',
    emoji: '⚽',
    price: 500,
    description: 'Giảm 1 phút hồi chiêu Pet.',
    effect: 'reduce_pet_cooldown',
    cooldownReduction: 60
  },
  toy_yarn: {
    id: 'toy_yarn',
    name: 'Cuộn Len',
    emoji: '🧶',
    price: 1200,
    description: 'Giảm 2 phút hồi chiêu Pet.',
    effect: 'reduce_pet_cooldown',
    cooldownReduction: 120
  },
  toy_whistle: {
    id: 'toy_whistle',
    name: 'Còi Huấn Luyện',
    emoji: '🪈',
    price: 3000,
    description: 'Kích hoạt kỹ năng Pet ngay lập tức!',
    effect: 'reduce_pet_cooldown',
    cooldownReduction: 9999
  }
};

// --- Pets Configuration ---
export const PETS: Record<PetId, PetType> = {
  dog: {
    id: 'dog', name: 'Cậu Vàng', emoji: '🐕', price: 1000, 
    baseCooldown: 300, activeDuration: 30, // CD: 5 phút
    description: 'Sủa gâu gâu nhả tiền mỗi giây trong 30s.',
    abilityType: 'buff_money', abilityValue: 5 // Per second
  },
  cat: {
    id: 'cat', name: 'Mèo Mướp', emoji: '🐈', price: 1500, 
    baseCooldown: 300, activeDuration: 30, // CD: 5 phút
    description: 'Meo meo xin ăn, cho nhiều tiền hơn chó.',
    abilityType: 'buff_money', abilityValue: 8 // Per second
  },
  frog: {
    id: 'frog', name: 'Ếch Xanh', emoji: '🐸', price: 5000, 
    baseCooldown: 600, activeDuration: 60, // CD: 10 phút
    description: 'Duy trì Mưa Rào liên tục trong 60s.',
    abilityType: 'summon_weather', abilityValue: 'Rainy'
  },
  chicken: {
    id: 'chicken', name: 'Gà Đẻ Trứng', emoji: '🐔', price: 8000, 
    baseCooldown: 480, activeDuration: 20, // CD: 8 phút
    description: 'Đẻ trứng vàng (tiền lớn) trong 20s.',
    abilityType: 'buff_money', abilityValue: 50 // Per second
  },
  bee: {
    id: 'bee', name: 'Ong Thợ', emoji: '🐝', price: 15000, 
    baseCooldown: 540, activeDuration: 60, // CD: 9 phút, Active: 60s
    description: 'Thụ phấn giúp cây lớn nhanh mỗi giây (60s).',
    abilityType: 'grow_plants', abilityValue: 5 // Per second %
  },
  cloud_spirit: {
    id: 'cloud_spirit', name: 'Tinh Linh Mây', emoji: '☁️', price: 50000, 
    baseCooldown: 900, activeDuration: 90, // CD: 15 phút
    description: 'Duy trì Bão Tố trong 90s.',
    abilityType: 'summon_weather', abilityValue: 'Storm'
  },
  sun_spirit: {
    id: 'sun_spirit', name: 'Tinh Linh Nắng', emoji: '☀️', price: 60000, 
    baseCooldown: 900, activeDuration: 90, // CD: 15 phút
    description: 'Duy trì Nắng Gắt trong 90s.',
    abilityType: 'summon_weather', abilityValue: 'Heatwave'
  },
  dragon: {
    id: 'dragon', name: 'Rồng Lửa', emoji: '🐉', price: 200000, 
    baseCooldown: 1200, activeDuration: 60, // CD: 20 phút
    description: 'Gọi Hạn Hán và phun tiền (100$/s) trong 60s.',
    abilityType: 'summon_weather', abilityValue: 'Drought'
  },
  unicorn: {
    id: 'unicorn', name: 'Kỳ Lân', emoji: '🦄', price: 500000, 
    baseCooldown: 1200, activeDuration: 90, // CD: 20 phút
    description: 'Gọi Cầu Vồng may mắn trong 90s.',
    abilityType: 'summon_weather', abilityValue: 'Rainbow'
  },
  time_keeper: {
    id: 'time_keeper', name: 'Thần Thời Gian', emoji: '⏳', price: 1000000, 
    baseCooldown: 1800, activeDuration: 15, // CD: 30 phút
    description: 'Bẻ cong thời gian, cây lớn cực đại trong 15s.',
    abilityType: 'grow_plants', abilityValue: 20 // Per second
  }
};

// --- Weather Configuration ---
// UPDATED: Added 'weight' for probability. High weight = Common, Low weight = Rare.
export const WEATHER_EFFECTS: Record<WeatherType, { 
  waterMod: number; 
  growthMod: number; 
  emoji: string;
  desc: string;
  bgClass: string;
  specialVariant?: VariantType; 
  specialVariantChance?: number; 
  luckBonus: { [key in VariantType]?: number };
  weight: number; 
}> = {
  Sunny: { 
    waterMod: 1, growthMod: 1, emoji: '☀️', desc: 'Nắng đẹp', bgClass: 'bg-blue-100',
    luckBonus: { Normal: 1, Good: 1, Golden: 1, Diamond: 1 },
    weight: 0 // Sunny is default, weight unused for random selection
  },
  // COMMON (High Weight)
  Rainy: { 
    waterMod: -5, growthMod: 1.2, emoji: '🌧️', desc: 'Mưa rào (Tự tưới)', bgClass: 'bg-slate-300',
    luckBonus: { Normal: 1, Good: 1.2, Golden: 1, Diamond: 1 },
    weight: 100 
  },
  Cloudy: { 
    waterMod: 0.5, growthMod: 0.8, emoji: '☁️', desc: 'Nhiều mây', bgClass: 'bg-gray-200',
    luckBonus: { Normal: 1, Good: 1 },
    weight: 90
  },
  Windy: { 
    waterMod: 1.5, growthMod: 1.3, emoji: '🍃', desc: 'Gió Mùa (Khô nhanh)', bgClass: 'bg-teal-100',
    specialVariant: 'Air', specialVariantChance: 0.35,
    luckBonus: { Normal: 1, Good: 1.5 },
    weight: 80
  },
  Heatwave: { 
    waterMod: 2, growthMod: 1.5, emoji: '🥵', desc: 'Nắng gắt (Khô nhanh)', bgClass: 'bg-orange-100',
    specialVariant: 'Magma', specialVariantChance: 0.3,
    luckBonus: { Normal: 1, Good: 0.8 },
    weight: 70
  },
  
  // UNCOMMON (Medium Weight)
  Foggy: { 
    waterMod: 0.1, growthMod: 0.6, emoji: '🌫️', desc: 'Sương Mù (Giữ nước)', bgClass: 'bg-stone-200',
    specialVariant: 'Mist', specialVariantChance: 0.35,
    luckBonus: { Normal: 1, Good: 1 },
    weight: 60
  },
  Sandstorm: {
    waterMod: 3, growthMod: 1.2, emoji: '🌪️', desc: 'Bão Cát (Rất khô)', bgClass: 'bg-orange-200',
    specialVariant: 'Sand', specialVariantChance: 0.35,
    luckBonus: { Normal: 1, Good: 0.5 },
    weight: 50
  },
  Storm: { 
    waterMod: -10, growthMod: 2.0, emoji: '⛈️', desc: 'Bão tố (Lớn cực nhanh)', bgClass: 'bg-slate-500',
    specialVariant: 'Thunder', specialVariantChance: 0.25,
    luckBonus: { Normal: 1, Good: 1.5 },
    weight: 40
  },
  Snowy: { 
    waterMod: 0, growthMod: 0.4, emoji: '❄️', desc: 'Tuyết Rơi (Đóng băng)', bgClass: 'bg-slate-50',
    specialVariant: 'Ice', specialVariantChance: 0.3,
    luckBonus: { Normal: 1, Good: 1 },
    weight: 40
  },

  // RARE (Low Weight)
  AcidRain: {
    waterMod: -2, growthMod: 0.8, emoji: '🧪', desc: 'Mưa Axit (Biến dị)', bgClass: 'bg-lime-200',
    specialVariant: 'Toxic', specialVariantChance: 0.4,
    luckBonus: { Normal: 0.1, Good: 0.1 },
    weight: 30
  },
  Drought: {
    waterMod: 4, growthMod: 0.5, emoji: '🔥', desc: 'Hạn Hán (Cực khô)', bgClass: 'bg-red-100',
    luckBonus: { Normal: 1, Good: 0.5 },
    weight: 25
  },
  Blizzard: {
    waterMod: 0, growthMod: 0.1, emoji: '🌨️', desc: 'Bão Tuyết (Ngừng lớn)', bgClass: 'bg-blue-50',
    specialVariant: 'Ice', specialVariantChance: 0.6,
    luckBonus: { Normal: 0.5 },
    weight: 20
  },
  Hailstorm: {
    waterMod: -2, growthMod: 0.5, emoji: '🧊', desc: 'Mưa Đá (Hại cây)', bgClass: 'bg-slate-400',
    specialVariant: 'Ice', specialVariantChance: 0.4,
    luckBonus: { Normal: 0.5 },
    weight: 20
  },

  // LEGENDARY (Very Low Weight)
  Rainbow: { 
    waterMod: -2, growthMod: 1.5, emoji: '🌈', desc: 'Cầu Vồng (May mắn)', bgClass: 'bg-pink-100',
    luckBonus: { Normal: 0.5, Good: 3, Golden: 3, Diamond: 3 },
    weight: 10
  },
  GoldenHour: { 
    waterMod: 1.5, growthMod: 1.2, emoji: '✨', desc: 'Giờ Vàng (Tỉ lệ Vàng x10)', bgClass: 'bg-yellow-100',
    specialVariant: 'Golden', specialVariantChance: 0.4, 
    luckBonus: { Normal: 0.5, Good: 1, Golden: 10, Diamond: 1 },
    weight: 8
  },
  Aurora: {
    waterMod: 0.5, growthMod: 2.5, emoji: '🌌', desc: 'Cực Quang (Thần tốc)', bgClass: 'bg-slate-800',
    specialVariant: 'Mystic', specialVariantChance: 0.3,
    luckBonus: { Normal: 0.5, Good: 2, Golden: 2 },
    weight: 6
  },
  MeteorShower: {
    waterMod: 1, growthMod: 1.5, emoji: '🌠', desc: 'Mưa Sao Băng (Tuyệt đẹp)', bgClass: 'bg-slate-900',
    specialVariant: 'Cosmic', specialVariantChance: 0.25,
    luckBonus: { Normal: 0.2, Good: 2, Golden: 5, Diamond: 10 },
    weight: 4
  },

  // MYTHICAL (Extremely Low Weight)
  DiamondSky: { 
    waterMod: 0, growthMod: 0.5, emoji: '💎', desc: 'Mưa Kim Cương (Tỉ lệ KC x20)', bgClass: 'bg-indigo-900',
    specialVariant: 'Diamond', specialVariantChance: 0.2, 
    luckBonus: { Normal: 0.2, Good: 1, Golden: 2, Diamond: 20 },
    weight: 2
  },
  Eclipse: { 
    waterMod: 1, growthMod: 1.5, emoji: '🌑', desc: 'Nhật Thực (Huyền bí)', bgClass: 'bg-indigo-950',
    specialVariant: 'Void', specialVariantChance: 0.15, 
    luckBonus: { Normal: 0.1, Good: 2, Golden: 5, Diamond: 5 },
    weight: 1
  },
};

// --- Plants List up to Level 100 (Rebalanced) ---
const NORMAL_PLANTS_LIST: PlantType[] = [
  // Lvl 1-5 (Starters)
  // Adjusted consumption to 1.1 as requested
  { id: 'wheat', name: 'Lúa Mì', emoji: '🌾', growthTime: 60, waterConsumption: 1.1, buyPrice: 0, sellPrice: 10, description: 'Cây lương thực cơ bản.', rarity: 'Common', category: 'Vegetable', unlockLevel: 1, xpReward: 5 },
  { id: 'carrot', name: 'Cà Rốt', emoji: '🥕', growthTime: 120, waterConsumption: 1.2, buyPrice: 20, sellPrice: 60, description: 'Giòn và ngọt.', rarity: 'Common', category: 'Vegetable', unlockLevel: 1, xpReward: 10 },
  { id: 'potato', name: 'Khoai Tây', emoji: '🥔', growthTime: 180, waterConsumption: 1.1, buyPrice: 50, sellPrice: 150, description: 'Củ chứa nhiều tinh bột.', rarity: 'Common', category: 'Vegetable', unlockLevel: 2, xpReward: 15 },
  { id: 'tomato', name: 'Cà Chua', emoji: '🍅', growthTime: 240, waterConsumption: 1.3, buyPrice: 100, sellPrice: 300, description: 'Mọng nước.', rarity: 'Common', category: 'Vegetable', unlockLevel: 3, xpReward: 25 },
  { id: 'corn', name: 'Bắp Ngô', emoji: '🌽', growthTime: 300, waterConsumption: 1.1, buyPrice: 200, sellPrice: 600, description: 'Hạt vàng óng.', rarity: 'Common', category: 'Vegetable', unlockLevel: 4, xpReward: 40 },
  { id: 'strawberry', name: 'Dâu Tây', emoji: '🍓', growthTime: 400, waterConsumption: 1.2, buyPrice: 350, sellPrice: 1000, description: 'Vị ngọt.', rarity: 'Rare', category: 'Fruit', unlockLevel: 5, xpReward: 60 },

  // Lvl 10-20 (Intermediate)
  { id: 'rose', name: 'Hoa Hồng', emoji: '🌹', growthTime: 600, waterConsumption: 0.9, buyPrice: 1500, sellPrice: 5000, description: 'Lãng mạn.', rarity: 'Epic', category: 'Flower', unlockLevel: 10, xpReward: 150 },
  { id: 'dragon_tree', name: 'Cây Rồng', emoji: '🐲', growthTime: 1200, waterConsumption: 0.8, buyPrice: 5000, sellPrice: 18000, description: 'Hơi thở rồng.', rarity: 'Legendary', category: 'Magical', unlockLevel: 15, xpReward: 500 },
  { id: 'pumpkin', name: 'Bí Ngô', emoji: '🎃', growthTime: 900, waterConsumption: 1.0, buyPrice: 4000, sellPrice: 12000, description: 'Vua lễ hội.', rarity: 'Legendary', category: 'Vegetable', unlockLevel: 20, xpReward: 450 },
  
  // Lvl 25-30
  { id: 'mandrake', name: 'Nhân Sâm', emoji: '👺', growthTime: 1800, waterConsumption: 0.7, buyPrice: 8000, sellPrice: 28000, description: 'Có linh hồn.', rarity: 'Mythical', category: 'Magical', unlockLevel: 25, xpReward: 1200 },
  { id: 'moneytree', name: 'Cây Tiền', emoji: '🤑', growthTime: 2400, waterConsumption: 0.5, buyPrice: 15000, sellPrice: 90000, description: 'Tiền là lá.', rarity: 'Mythical', category: 'Magical', unlockLevel: 30, xpReward: 3500 },

  // Lvl 35-50 (Advanced)
  { id: 'bonsai', name: 'Bonsai Cổ', emoji: '🪴', growthTime: 2000, waterConsumption: 0.3, buyPrice: 20000, sellPrice: 70000, description: 'Tĩnh tâm.', rarity: 'Epic', category: 'Flower', unlockLevel: 35, xpReward: 3000 },
  { id: 'coffee', name: 'Cà Phê', emoji: '☕', growthTime: 1500, waterConsumption: 1.1, buyPrice: 25000, sellPrice: 80000, description: 'Tăng năng lượng.', rarity: 'Rare', category: 'Fruit', unlockLevel: 40, xpReward: 3200 },
  { id: 'cocoa', name: 'Ca Cao', emoji: '🍫', growthTime: 1600, waterConsumption: 1.1, buyPrice: 30000, sellPrice: 95000, description: 'Ngọt ngào.', rarity: 'Rare', category: 'Fruit', unlockLevel: 45, xpReward: 3600 },
  { id: 'golden_apple', name: 'Táo Vàng', emoji: '🍏', growthTime: 3000, waterConsumption: 0.4, buyPrice: 50000, sellPrice: 180000, description: 'Bất tử.', rarity: 'Legendary', category: 'Fruit', unlockLevel: 50, xpReward: 6000 },

  // Lvl 55-70
  { id: 'crystal_rose', name: 'Hồng Pha Lê', emoji: '💎', growthTime: 3600, waterConsumption: 0.3, buyPrice: 75000, sellPrice: 250000, description: 'Lấp lánh.', rarity: 'Legendary', category: 'Flower', unlockLevel: 55, xpReward: 8000 },
  { id: 'circuit_tree', name: 'Cây Mạch', emoji: '🔋', growthTime: 2800, waterConsumption: 0.6, buyPrice: 100000, sellPrice: 350000, description: 'Chạy bằng điện.', rarity: 'Cyber', category: 'Tech', unlockLevel: 60, xpReward: 10000 },
  { id: 'server_plant', name: 'Máy Chủ', emoji: '🖥️', growthTime: 3200, waterConsumption: 0.7, buyPrice: 150000, sellPrice: 500000, description: 'Lưu trữ dữ liệu.', rarity: 'Cyber', category: 'Tech', unlockLevel: 65, xpReward: 15000 },
  { id: 'lightning_reed', name: 'Cỏ Sấm Sét', emoji: '⚡', growthTime: 2500, waterConsumption: 0.6, buyPrice: 200000, sellPrice: 600000, description: 'Tích điện.', rarity: 'Legendary', category: 'Magical', unlockLevel: 70, xpReward: 18000 },

  // Lvl 75-90
  { id: 'void_shroom', name: 'Nấm Hư Vô', emoji: '⚫', growthTime: 5000, waterConsumption: 0.2, buyPrice: 500000, sellPrice: 1500000, description: 'Hấp thụ ánh sáng.', rarity: 'Mythical', category: 'Magical', unlockLevel: 75, xpReward: 30000 },
  { id: 'star_tree', name: 'Cây Tinh Tú', emoji: '🌟', growthTime: 6000, waterConsumption: 0.3, buyPrice: 1000000, sellPrice: 3000000, description: 'Sinh ra sao.', rarity: 'Celestial', category: 'Cosmic', unlockLevel: 80, xpReward: 50000 },
  { id: 'galaxy_lotus', name: 'Sen Ngân Hà', emoji: '🌌', growthTime: 7200, waterConsumption: 0.3, buyPrice: 2000000, sellPrice: 6000000, description: 'Chứa đựng vũ trụ.', rarity: 'Celestial', category: 'Cosmic', unlockLevel: 85, xpReward: 80000 },
  { id: 'black_hole_flower', name: 'Hoa Lỗ Đen', emoji: '🕳️', growthTime: 8000, waterConsumption: 0.8, buyPrice: 5000000, sellPrice: 15000000, description: 'Nặng vô tận.', rarity: 'Celestial', category: 'Cosmic', unlockLevel: 90, xpReward: 120000 },

  // Lvl 95-100
  { id: 'singularity_seed', name: 'Hạt Điểm Dị', emoji: '⚛️', growthTime: 10000, waterConsumption: 0.3, buyPrice: 10000000, sellPrice: 30000000, description: 'Khởi đầu tất cả.', rarity: 'Celestial', category: 'Tech', unlockLevel: 95, xpReward: 250000 },
  { id: 'yggdrasil', name: 'Yggdrasil', emoji: '🌳', growthTime: 20000, waterConsumption: 0.3, buyPrice: 50000000, sellPrice: 120000000, description: 'Cây Thế Giới.', rarity: 'Mythical', category: 'Magical', unlockLevel: 100, xpReward: 1500000 },
];

export const PLANTS: Record<string, PlantType> = NORMAL_PLANTS_LIST.reduce((acc, plant) => {
  acc[plant.id] = plant;
  return acc;
}, {} as Record<string, PlantType>);

export const INITIAL_MONEY = 20;
