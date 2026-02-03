import React, { useState, useEffect, useRef } from 'react';
import { CellData, ToolType, WeatherType, VariantType, ItemId, PetId, Rival, DailyReward, GameState } from './types';
import { GRID_SIZE, INITIAL_MONEY, PLANTS, TICK_RATE, WEATHER_EFFECTS, VARIANTS, ITEMS, PETS, SHOP_REFRESH_RATE, DAILY_REWARDS, SAVE_VERSION } from './constants';
import GardenCell from './components/GardenCell';
import Shop from './components/Shop';
import Assistant from './components/Assistant';
import WeatherDisplay from './components/WeatherDisplay';
import PetDisplay from './components/PetDisplay';
import LoadingScreen from './components/LoadingScreen';
import MainMenu from './components/MainMenu';
import NameInputScreen from './components/NameInputScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import DailyRewardPopup from './components/DailyRewardPopup';
import { Droplets, ShoppingBasket, Coins, Crown, Volume2, VolumeX, X, Backpack, Store, Briefcase, Info, Zap } from 'lucide-react';

const SAVE_KEY = 'GARDEN_TYCOON_SAVE_LOCAL_PLAYER';
const RIVALS_SAVE_KEY = 'GARDEN_TYCOON_RIVALS_V2'; 

const BOT_NAMES = [
  "Nông Dân Chăm Chỉ", "Vua Lúa Mì", "Trùm Cà Rốt", "Thánh Trồng Trọt", 
  "Bà Tân Vlog", "Anh Da Đen", "Famer Pro 99", "Cậu Vàng", "Lão Hạc", 
  "Chị Hằng", "Chú Cuội", "Sơn Tinh", "Thủy Tinh", "Thạch Sanh", 
  "Lý Thông", "Tấm Cám", "Doraemon", "Nobita", "Xuka", "Chaien",
  "Naruto", "Sasuke", "Goku", "Vegeta", "Luffy", "Zoro", "Conan"
];

// Clean Playlist
const PLAYLIST = [
  { name: "Garden Ambience", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" }
];

export const App: React.FC = () => {
  // --- UI Flow State ---
  const [inMenu, setInMenu] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  const [showDailyReward, setShowDailyReward] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false); 
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); 
  
  // --- Audio State ---
  const [isMuted, setIsMuted] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Game State Defaults ---
  const defaultInventory: Record<ItemId, number> = { 
    fertilizer: 0, revive_potion: 0, super_water: 0, 
    sprinkler_basic: 0, sprinkler_advanced: 0, sprinkler_pro: 0,
    toy_ball: 0, toy_yarn: 0, toy_whistle: 0 
  };
  
  const [playerName, setPlayerName] = useState('');
  const [money, setMoney] = useState(INITIAL_MONEY);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [inventory, setInventory] = useState<Record<ItemId, number>>(defaultInventory);
  const [grid, setGrid] = useState<CellData[]>(
    Array.from({ length: GRID_SIZE }, (_, i) => ({
      id: i,
      plantId: null,
      growthProgress: 0,
      waterLevel: 50,
      isDead: false,
      variant: 'Normal'
    }))
  );
  
  const [selectedTool, setSelectedTool] = useState<ToolType>('water');
  const [selectedSeedId, setSelectedSeedId] = useState<string | null>('wheat');
  const [weather, setWeather] = useState<WeatherType>('Sunny');
  const [weatherTimeLeft, setWeatherTimeLeft] = useState(0); 
  const [ownedPets, setOwnedPets] = useState<PetId[]>([]);
  const [equippedPet, setEquippedPet] = useState<PetId | null>(null);
  const [petCooldownTimer, setPetCooldownTimer] = useState(0);
  const [petActiveTimer, setPetActiveTimer] = useState(0);
  
  // New State
  const [sprinklerEndTime, setSprinklerEndTime] = useState(0);
  const [shopStock, setShopStock] = useState<Record<string, number>>({ 'wheat': 10 });
  const [shopNextRefresh, setShopNextRefresh] = useState(Date.now() + SHOP_REFRESH_RATE);
  
  // Daily Login State
  const [lastLoginDate, setLastLoginDate] = useState(0);
  const [consecutiveDays, setConsecutiveDays] = useState(1);
  const [lastClaimedDate, setLastClaimedDate] = useState(0);
  
  // Offline State
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());

  // --- Persistent Rivals State ---
  const [rivals, setRivals] = useState<Rival[]>([]);
  const [toast, setToast] = useState<{msg: string, id: number} | null>(null);

  // --- Helper Functions ---
  const showToast = (msg: string) => {
    setToast({ msg, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  };

  // --- AUDIO LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
        audio.volume = 0.4; 
        if (!isMuted) audio.play().catch(() => {
            // Autoplay policy prevented playback, user interaction required later
        });
    }
  }, [currentSongIndex, isMuted]);

  // --- RIVAL SYSTEM LOGIC ---
  const generateInitialRivals = () => {
      const newRivals: Rival[] = [];
      for (let i = 0; i < 20; i++) {
          const name = BOT_NAMES[i % BOT_NAMES.length];
          newRivals.push({
              id: `rival_${i}`, name, money: (i + 1) * 1000, level: i + 1,
              growthRate: 10 + i * 5, lastUpdated: Date.now(), isOnline: false
          });
      }
      setRivals(newRivals);
      localStorage.setItem(RIVALS_SAVE_KEY, JSON.stringify(newRivals));
  };

  const loadRivalsData = () => {
    try {
        const savedRivalsStr = localStorage.getItem(RIVALS_SAVE_KEY);
        if (savedRivalsStr) {
            setRivals(JSON.parse(savedRivalsStr));
        } else {
            generateInitialRivals();
        }
    } catch (e) { 
        generateInitialRivals(); 
    }
  };

  // --- SHOP REFRESH LOGIC (BALANCED) ---
  const refreshShopStock = () => {
      const allPlants = Object.values(PLANTS);
      const allItems = Object.values(ITEMS);
      const selectedStock: Record<string, number> = {};
      
      // 1. Always guarantee Wheat (Basic)
      selectedStock['wheat'] = Math.floor(Math.random() * 11) + 10; 
      
      // 2. Balanced Random Selection (6 slots)
      for(let i=0; i<6; i++) {
          const rand = Math.random();
          let pool = allPlants;

          // Adjusted probability tiers
          if (rand < 0.5) {
              // 50% Common
              pool = allPlants.filter(p => p.rarity === 'Common');
          } else if (rand < 0.8) {
              // 30% Rare
              pool = allPlants.filter(p => p.rarity === 'Rare');
          } else if (rand < 0.95) {
              // 15% Epic/Legendary
              pool = allPlants.filter(p => ['Epic', 'Legendary'].includes(p.rarity));
          } else {
              // 5% Mythical/Celestial/Cyber
              pool = allPlants.filter(p => ['Mythical', 'Cyber', 'Celestial'].includes(p.rarity));
          }
          
          // Fallback if pool empty (e.g., no Mythical plants defined yet)
          if (pool.length === 0) pool = allPlants;

          if(pool.length > 0) {
              const pick = pool[Math.floor(Math.random() * pool.length)];
              // Don't overwrite if already selected, just add stock
              selectedStock[pick.id] = (selectedStock[pick.id] || 0) + Math.floor(Math.random() * 5) + 3;
          }
      }
      
      // 3. Always stock Items
      allItems.forEach(item => selectedStock[item.id] = Math.floor(Math.random() * 3) + 1);
      
      setShopStock(selectedStock);
      setShopNextRefresh(Date.now() + SHOP_REFRESH_RATE);
  };

  // --- DATA LOADING LOGIC ---
  const loadGameData = () => {
      try {
          const savedStr = localStorage.getItem(SAVE_KEY);
          if (savedStr) {
              const savedData: any = JSON.parse(savedStr);
              setPlayerName(savedData.playerName || '');
              setMoney(savedData.money || INITIAL_MONEY);
              setLevel(savedData.level || 1);
              setInventory({ ...defaultInventory, ...(savedData.inventory || {}) });
              
              // Safe Pet Loading: Filter out pets that don't exist in constants anymore
              const validPets = (savedData.ownedPets || []).filter((id: string) => PETS[id as PetId]);
              setOwnedPets(validPets);
              
              const validEquipped = savedData.equippedPet && PETS[savedData.equippedPet as PetId] ? savedData.equippedPet : null;
              setEquippedPet(validEquipped);
              
              // Load Grid with Sanitization
              if (savedData.grid) {
                   const loadedGrid = savedData.grid.map((cell: any) => {
                       // Sanitize: If plantId exists in save but not in constants, remove it to prevent crash
                       const isValidPlant = cell.plantId && PLANTS[cell.plantId];
                       return {
                           ...cell,
                           plantId: isValidPlant ? cell.plantId : null,
                           growthProgress: isValidPlant ? cell.growthProgress : 0,
                           waterLevel: cell.waterLevel ?? 50,
                           isDead: cell.isDead ?? false,
                           variant: cell.variant || 'Normal'
                       };
                   });
                   setGrid(loadedGrid);
              }
              
              // Load Timers & Shop
              setPetCooldownTimer(savedData.petCooldownTimer || 0);
              setPetActiveTimer(savedData.petActiveTimer || 0);
              setLastLoginDate(savedData.lastLoginDate || 0);
              setConsecutiveDays(savedData.consecutiveDays || 1);
              setLastClaimedDate(savedData.lastClaimedDate || 0);
              setSprinklerEndTime(savedData.sprinklerEndTime || 0);
              
              // CRITICAL FIX: Restore Shop State
              const savedStock = savedData.shopStock || { 'wheat': 10 };
              const savedRefresh = savedData.shopNextRefresh || Date.now();
              setShopStock(savedStock);
              setShopNextRefresh(savedRefresh);
              
              // Auto refresh if time passed while offline
              if (savedRefresh < Date.now()) {
                  refreshShopStock();
              }

          } else {
              refreshShopStock();
          }
      } catch (e) { 
          console.error("Save file corrupted, resetting shop", e);
          refreshShopStock(); 
      }
  };

  // --- INITIAL EFFECT ---
  useEffect(() => { 
    loadGameData(); 
    loadRivalsData(); 
  }, []);

  // --- SAVE LOGIC ---
  useEffect(() => {
    if (!inMenu && !isLoading && playerName) {
        try {
            const stateToSave = {
                playerName, money, level, xp, inventory, grid, weather,
                ownedPets, equippedPet, petCooldownTimer, petActiveTimer,
                shopStock, shopNextRefresh, lastLoginDate, consecutiveDays, lastClaimedDate, sprinklerEndTime,
                version: SAVE_VERSION
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        } catch (e) {
            console.warn("Failed to save game data (probably quota exceeded)", e);
        }
    }
  }, [money, grid, inventory, equippedPet, petCooldownTimer, petActiveTimer, weather, shopStock, playerName, inMenu, isLoading, sprinklerEndTime]);

  // --- GAME LOOP ---
  useEffect(() => {
    if (inMenu || isLoading) return;

    const tick = setInterval(() => {
      // 1. Weather Timer
      if (weather !== 'Sunny') {
          setWeatherTimeLeft(prev => {
              if (prev <= 1) { setWeather('Sunny'); return 0; }
              return prev - 1;
          });
      } else {
         // Random Natural Weather Event (Small chance if Sunny)
         if (Math.random() < 0.005) { // 0.5% per second (~once every 3 mins)
             const candidates = (Object.keys(WEATHER_EFFECTS) as WeatherType[]).filter(w => w !== 'Sunny');
             
             // Weighted random
             let totalWeight = 0;
             candidates.forEach(w => totalWeight += WEATHER_EFFECTS[w].weight);
             let random = Math.random() * totalWeight;
             
             for (const w of candidates) {
                 random -= WEATHER_EFFECTS[w].weight;
                 if (random <= 0) {
                     setWeather(w);
                     const duration = Math.floor(Math.random() * 60) + 30; // 30-90 seconds
                     setWeatherTimeLeft(duration); 
                     showToast(`Dự báo thời tiết: ${WEATHER_EFFECTS[w].desc}!`);
                     break;
                 }
             }
         }
      }

      // 2. Pet Timers & AUTO-ACTIVATION LOOP
      if (petActiveTimer > 0) {
          setPetActiveTimer(prev => prev - 1);
      } else if (petCooldownTimer > 0) {
          setPetCooldownTimer(prev => prev - 1);
      } else if (equippedPet && PETS[equippedPet]) {
          // If both timers are 0, restart the cycle automatically
          const pet = PETS[equippedPet];
          setPetActiveTimer(pet.activeDuration);
          setPetCooldownTimer(pet.baseCooldown);
          
          // Instant Effects (Weather) - triggers once when cycle restarts
          if (pet.abilityType === 'summon_weather') {
              setWeather(pet.abilityValue as WeatherType);
              setWeatherTimeLeft(pet.activeDuration + 10);
              showToast(`${pet.name} đã gọi ${WEATHER_EFFECTS[pet.abilityValue as WeatherType].desc}!`);
          }
      }

      // 3. Apply Active Pet Effects (Per Tick)
      if (equippedPet && PETS[equippedPet] && petActiveTimer > 0) {
          const pet = PETS[equippedPet];
          if (pet.abilityType === 'buff_money') {
             setMoney(m => m + (pet.abilityValue as number));
          }
      }

      // 4. Sprinkler Logic
      const isSprinklerActive = Date.now() < sprinklerEndTime;
      
      // 5. Shop Auto Refresh Logic
      if (Date.now() >= shopNextRefresh) {
          refreshShopStock();
      }

      // 6. Grid Updates
      setGrid(prevGrid => prevGrid.map(cell => {
          if (!cell.plantId) return cell;
          if (cell.isDead) return cell;

          const plant = PLANTS[cell.plantId];
          // CRITICAL SAFETY CHECK: If plant data is missing (corruption), skip update or kill plant
          if (!plant) {
              return { ...cell, plantId: null, growthProgress: 0 };
          }

          const weatherInfo = WEATHER_EFFECTS[weather];
          const variantInfo = VARIANTS[cell.variant];

          // Water Logic
          // Safety: Check if weatherInfo exists before accessing properties
          const waterMod = weatherInfo ? weatherInfo.waterMod : 1;
          let waterChange = -plant.waterConsumption * waterMod;
          
          if (isSprinklerActive) waterChange += 5; 
          
          let newWater = Math.max(0, Math.min(100, cell.waterLevel + waterChange));
          
          // Death Logic
          if (newWater <= 0) return { ...cell, waterLevel: 0, isDead: true };

          // Growth Logic
          if (cell.growthProgress < 100) {
             let growthSpeed = (100 / plant.growthTime); // Base per second
             
             // Modifiers
             if (newWater > 80) growthSpeed *= 1.2; // Well watered
             if (newWater < 30) growthSpeed *= 0.5; // Thirsty
             
             if (weatherInfo) growthSpeed *= weatherInfo.growthMod;
             growthSpeed *= variantInfo.multiplier; 
             
             // Pet Growth Ability
             if (equippedPet && PETS[equippedPet] && petActiveTimer > 0 && PETS[equippedPet].abilityType === 'grow_plants') {
                 growthSpeed *= (1 + (PETS[equippedPet].abilityValue as number) / 100);
             }

             return {
                 ...cell,
                 waterLevel: newWater,
                 growthProgress: Math.min(100, cell.growthProgress + growthSpeed)
             };
          }

          return { ...cell, waterLevel: newWater };
      }));

    }, TICK_RATE);

    return () => clearInterval(tick);
  }, [inMenu, isLoading, weather, petActiveTimer, petCooldownTimer, equippedPet, sprinklerEndTime, shopNextRefresh]);

  // --- HANDLERS ---
  const handleCellClick = (id: number) => {
    setGrid(prev => {
        const newGrid = [...prev];
        const cell = newGrid[id];
        
        // 1. Use Tool: Revive
        if (selectedTool === 'revive_potion' && cell.isDead) {
             if (inventory['revive_potion'] > 0) {
                 setInventory(inv => ({ ...inv, revive_potion: inv.revive_potion - 1 }));
                 cell.isDead = false;
                 cell.waterLevel = 50;
                 showToast("Đã hồi sinh cây!");
             } else showToast("Hết thuốc hồi sinh!");
             return newGrid;
        }

        // 2. Use Tool: Fertilizer
        if (selectedTool === 'fertilizer' && cell.plantId && !cell.isDead && cell.growthProgress < 100) {
            if (inventory['fertilizer'] > 0) {
                setInventory(inv => ({ ...inv, fertilizer: inv.fertilizer - 1 }));
                cell.growthProgress = Math.min(100, cell.growthProgress + 40);
                showToast("Đã bón phân!");
            } else showToast("Hết phân bón!");
            return newGrid;
        }

        // 3. Harvest / Remove Dead
        if (cell.isDead || (cell.plantId && cell.growthProgress >= 100 && selectedTool === 'harvest')) {
            if (cell.isDead) {
                // Clear dead
                cell.plantId = null; cell.growthProgress = 0; cell.waterLevel = 50; cell.isDead = false; cell.variant = 'Normal';
            } else {
                // Harvest
                const plant = PLANTS[cell.plantId!];
                if (!plant) { // Safety check
                    cell.plantId = null; cell.growthProgress = 0; return newGrid;
                }
                const variant = VARIANTS[cell.variant];
                const sellPrice = Math.floor(plant.sellPrice * variant.multiplier);
                
                setMoney(m => m + sellPrice);
                setXp(x => x + plant.xpReward);
                
                // Level Up Logic
                const xpNeeded = level * 100;
                if (xp + plant.xpReward >= xpNeeded) {
                    setLevel(l => l + 1);
                    setXp(0);
                    showToast(`Lên cấp ${level + 1}!`);
                }

                showToast(`+ $${sellPrice}`);
                cell.plantId = null; cell.growthProgress = 0; cell.waterLevel = 50; cell.variant = 'Normal';
            }
            return newGrid;
        }

        // 4. Plant Seed
        if (!cell.plantId && selectedSeedId) {
            const plant = PLANTS[selectedSeedId];
            if (!plant) return newGrid; // Safety check

            // STOCK CHECK LOGIC
            const currentStock = shopStock[selectedSeedId] || 0;
            if (currentStock <= 0) {
                showToast("Hết hạt giống này rồi! Chờ nhập kho.");
                return newGrid;
            }

            if (money >= plant.buyPrice) {
                setMoney(m => m - plant.buyPrice);
                
                // Deduct stock
                setShopStock(prev => ({
                    ...prev,
                    [selectedSeedId]: Math.max(0, (prev[selectedSeedId] || 0) - 1)
                }));

                cell.plantId = selectedSeedId;
                cell.growthProgress = 0;
                cell.waterLevel = 50;
                cell.isDead = false;
                
                // Variant Chance
                const rand = Math.random();
                let chosenVariant: VariantType = 'Normal';
                
                // Check weather specific variants first
                const weatherInfo = WEATHER_EFFECTS[weather];
                if (weatherInfo && weatherInfo.specialVariant && Math.random() < (weatherInfo.specialVariantChance || 0)) {
                    chosenVariant = weatherInfo.specialVariant;
                } else {
                    // Standard luck
                    if (rand < 0.01) chosenVariant = 'Diamond';
                    else if (rand < 0.06) chosenVariant = 'Golden';
                    else if (rand < 0.21) chosenVariant = 'Good';
                }
                
                cell.variant = chosenVariant;
                if (chosenVariant !== 'Normal') showToast(`Wow! Biến thể ${VARIANTS[chosenVariant].label}`);
            } else {
                showToast("Không đủ tiền!");
            }
            return newGrid;
        }

        // 5. Water
        if (selectedTool === 'water' && cell.plantId && !cell.isDead) {
            cell.waterLevel = 100;
            return newGrid;
        }
        
        return newGrid;
    });
  };

  const handleBuyItem = (id: ItemId) => {
      const item = ITEMS[id];
      if (money >= item.price && (shopStock[id] || 0) > 0) {
          setMoney(m => m - item.price);
          setShopStock(s => ({ ...s, [id]: s[id] - 1 }));
          
          if (item.effect === 'auto_water') {
              // Activate Sprinkler immediately
              setSprinklerEndTime(Date.now() + (item.duration || 0) * 1000);
              showToast(`Đã kích hoạt ${item.name}`);
          } else {
              setInventory(inv => ({ ...inv, [id]: (inv[id] || 0) + 1 }));
              showToast(`Đã mua ${item.name}`);
          }
      }
  };

  const handleBuyPet = (id: PetId) => {
      const pet = PETS[id];
      if (money >= pet.price && !ownedPets.includes(id)) {
          setMoney(m => m - pet.price);
          setOwnedPets(prev => [...prev, id]);
          
          // Auto equip if first pet
          if (ownedPets.length === 0) {
              setEquippedPet(id);
              showToast(`Đã mua và trang bị ${pet.name}!`);
          } else {
              showToast(`Đã mua ${pet.name}! Vào Balo để trang bị.`);
          }
      }
  };

  const handleEquipPet = (id: PetId) => {
      if (equippedPet === id) return;
      setEquippedPet(id);
      setPetCooldownTimer(0);
      setPetActiveTimer(0);
      showToast(`Đã gọi ${PETS[id].name} ra sân!`);
  };

  const handlePetClick = () => {
      if (!equippedPet || !PETS[equippedPet]) return;
      if (petActiveTimer > 0) return; // Already active
      if (petCooldownTimer > 0) {
          showToast(`Đang hồi chiêu: ${petCooldownTimer}s`);
          return;
      }

      const pet = PETS[equippedPet];
      setPetActiveTimer(pet.activeDuration);
      setPetCooldownTimer(pet.baseCooldown);
      showToast(`Kích hoạt kỹ năng ${pet.name}!`);

      // Immediate effects
      if (pet.abilityType === 'summon_weather') {
          setWeather(pet.abilityValue as WeatherType);
          setWeatherTimeLeft(90); // Pet weather duration
      }
  };

  const toggleTool = (tool: ToolType) => setSelectedTool(tool);

  // --- RENDER ---
  if (inMenu) return <MainMenu onStart={() => setInMenu(false)} playerName={playerName} />;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#e0f2fe] font-sans">
      {/* Background Ambience */}
      <audio ref={audioRef} src={PLAYLIST[currentSongIndex].url} loop hidden />
      
      {/* HUD: Top Bar - Z-Index 60 for better access */}
      <div className="absolute top-0 left-0 right-0 p-4 z-[60] flex justify-between items-start pointer-events-none">
          {/* User Info */}
          <div className="pointer-events-auto flex flex-col gap-2">
              <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-md border border-white flex items-center gap-3 pr-4">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {level}
                  </div>
                  <div>
                      <div className="font-black text-slate-800 text-sm">{playerName || "Nông Dân"}</div>
                      <div className="w-24 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
                          <div 
                             className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                             style={{ width: `${(xp / (level * 100)) * 100}%` }}
                          />
                      </div>
                  </div>
              </div>
              <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-white inline-flex items-center gap-2 self-start">
                  <Coins className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-black text-slate-700 text-lg">${money.toLocaleString()}</span>
              </div>
          </div>

          {/* Weather & Actions */}
          <div className="pointer-events-auto flex flex-col items-end gap-2">
              <WeatherDisplay weather={weather} />
              
              <div className="flex gap-2">
                  <button 
                    onClick={() => setIsInventoryOpen(true)}
                    className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-white hover:bg-indigo-50 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                  >
                      <Briefcase className="w-5 h-5 text-slate-600" />
                  </button>
                  <button 
                    onClick={() => setShowLeaderboard(true)}
                    className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-white hover:bg-yellow-50 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                  >
                      <Crown className="w-5 h-5 text-yellow-600" />
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center border border-white hover:bg-slate-50 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                  >
                      {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-slate-600" />}
                  </button>
              </div>
          </div>
      </div>

      {/* Main Game Area */}
      <div className="absolute inset-0 flex flex-col md:flex-row pt-24 gap-6 z-10 overflow-hidden">
          
          {/* Garden Grid - Centered */}
          <div className="flex-1 flex flex-col items-center justify-start md:justify-center h-full overflow-y-auto scrollbar-hide pt-4 md:pt-0 pb-64 md:pb-0">
             <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl w-full px-4 shrink-0">
                 {grid.map(cell => (
                     <GardenCell 
                        key={cell.id} 
                        cell={cell} 
                        onClick={handleCellClick} 
                        isSelected={false}
                     />
                 ))}
             </div>
          </div>

          {/* Desktop Shop Sidebar */}
          <div className="hidden md:block w-80 h-[85vh] self-center mr-8 z-20">
              <Shop 
                  money={money} level={level}
                  selectedSeedId={selectedSeedId} onSelectSeed={setSelectedSeedId}
                  onBuyItem={handleBuyItem} onBuyPet={handleBuyPet} ownedPets={ownedPets}
                  shopStock={shopStock} shopNextRefresh={shopNextRefresh}
              />
          </div>
      </div>

      {/* Bottom Toolbar (Refined Dock Style) - Z-Index 90 for Mobile Access */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-white/70 backdrop-blur-xl p-2 rounded-full shadow-2xl border border-white/60 flex items-center gap-2 transition-all hover:scale-105 hover:bg-white/80">
          <button 
            onClick={() => toggleTool('water')}
            className={`p-3.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${selectedTool === 'water' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110' : 'hover:bg-blue-50 text-slate-500'}`}
          >
              <Droplets className="w-6 h-6" />
          </button>
          <button 
            onClick={() => toggleTool('harvest')}
            className={`p-3.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation ${selectedTool === 'harvest' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110' : 'hover:bg-green-50 text-slate-500'}`}
          >
              <ShoppingBasket className="w-6 h-6" />
          </button>
          
          <div className="w-[1px] h-6 bg-slate-300 mx-1" />

          {/* Quick Item Access (Fertilizer) */}
          <button 
            onClick={() => toggleTool('fertilizer')}
            className={`p-3.5 rounded-full transition-all duration-300 relative cursor-pointer touch-manipulation ${selectedTool === 'fertilizer' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 scale-110' : 'hover:bg-amber-50 text-slate-500'}`}
          >
              <Zap className="w-6 h-6" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                  {inventory['fertilizer'] || 0}
              </span>
          </button>

          {/* Mobile Shop Button */}
          <button 
            onClick={() => setIsShopOpen(true)}
            className="md:hidden p-3.5 rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all ml-1 cursor-pointer touch-manipulation"
          >
              <Store className="w-6 h-6" />
          </button>
      </div>

      {/* Pet Display (Moved to bottom left) */}
      {equippedPet && (
        <div onClick={handlePetClick} className="cursor-pointer active:scale-95 transition-transform z-40">
            <PetDisplay equippedPet={equippedPet} cooldownTimer={petCooldownTimer} activeTimer={petActiveTimer} />
        </div>
      )}

      {/* AI Assistant (Bottom Right) */}
      <Assistant money={money} />

      {/* --- OVERLAYS --- */}

      {/* Mobile Shop Drawer - Z-Index 100 */}
      {isShopOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsShopOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 h-[85vh] rounded-t-[2rem] overflow-hidden animate-in slide-in-from-bottom duration-300 z-50">
                  <div className="h-full bg-[#f1f5f9] relative">
                    {/* Fixed absolute close button for mobile shop */}
                    <div className="absolute top-4 right-4 z-[110]">
                        <button 
                            onClick={() => setIsShopOpen(false)} 
                            className="bg-white text-slate-800 p-2.5 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
                        >
                            <X className="w-6 h-6"/>
                        </button>
                    </div>
                    <Shop 
                      money={money} level={level}
                      selectedSeedId={selectedSeedId} onSelectSeed={setSelectedSeedId}
                      onBuyItem={handleBuyItem} onBuyPet={handleBuyPet} ownedPets={ownedPets}
                      shopStock={shopStock} shopNextRefresh={shopNextRefresh}
                    />
                  </div>
              </div>
          </div>
      )}

      {/* INVENTORY DRAWER - Z-Index 100 */}
      {isInventoryOpen && (
          <div className="fixed inset-0 z-[100]">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsInventoryOpen(false)} />
              <div className="absolute top-0 right-0 bottom-0 w-full max-w-md h-[100dvh] bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col z-50">
                  {/* Header (Sticky & Padded) */}
                  <div className="flex items-center justify-between pl-5 pr-4 py-4 pt-14 md:pt-4 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-10">
                      <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 min-w-0 pr-4">
                          <Backpack className="w-6 h-6 text-indigo-500 shrink-0" />
                          <span className="truncate">Balo Của Bạn</span>
                      </h2>
                      <button 
                        onClick={() => setIsInventoryOpen(false)} 
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors shrink-0 shadow-sm border border-slate-200"
                      >
                          <X className="w-5 h-5 text-slate-600" />
                      </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                      
                      {/* PETS SECTION */}
                      <div className="mb-8">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Crown className="w-4 h-4" /> Thú Cưng Đã Sở Hữu
                          </h3>
                          
                          {ownedPets.length === 0 ? (
                              <div className="bg-slate-50 rounded-2xl p-6 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200">
                                  Bạn chưa có thú cưng nào.<br/>Ghé Cửa Hàng để mua nhé!
                              </div>
                          ) : (
                              <div className="flex flex-col gap-3">
                                  {ownedPets.map(petId => {
                                      const pet = PETS[petId];
                                      if (!pet) return null; // Safety Check
                                      
                                      const isEquipped = equippedPet === petId;
                                      return (
                                          <div key={petId} className={`
                                              relative p-3 rounded-2xl border-2 flex items-center gap-4 transition-all
                                              ${isEquipped ? 'bg-indigo-50 border-indigo-500 shadow-md' : 'bg-white border-slate-100 hover:border-indigo-100'}
                                          `}>
                                              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 shrink-0">
                                                  {pet.emoji}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                  <div className="font-bold text-slate-800 truncate">{pet.name}</div>
                                                  <div className="text-[10px] text-slate-500 leading-tight line-clamp-2">{pet.description}</div>
                                              </div>
                                              <button 
                                                  onClick={() => handleEquipPet(petId)}
                                                  disabled={isEquipped}
                                                  className={`
                                                      px-4 py-2 rounded-xl font-bold text-xs transition-all shrink-0
                                                      ${isEquipped 
                                                          ? 'bg-green-500 text-white cursor-default' 
                                                          : 'bg-slate-800 text-white hover:bg-indigo-600 active:scale-95 shadow-lg shadow-indigo-500/20'
                                                      }
                                                  `}
                                              >
                                                  {isEquipped ? 'Đang dùng' : 'Trang bị'}
                                              </button>
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>

                      {/* ITEMS SECTION */}
                      <div>
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              <Briefcase className="w-4 h-4" /> Vật Phẩm
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                              {Object.entries(inventory).map(([itemId, count]) => {
                                  // Fix implicit type error for count comparison
                                  const amount = count as number;
                                  if (amount <= 0) return null;
                                  const item = ITEMS[itemId as ItemId];
                                  if (!item) return null; // Safety Check

                                  return (
                                      <button 
                                          key={itemId}
                                          onClick={() => {
                                              if (['fertilizer', 'revive_potion'].includes(itemId)) {
                                                  setSelectedTool(itemId as ToolType);
                                                  setIsInventoryOpen(false);
                                                  showToast(`Đã chọn ${item.name}. Chạm vào cây để dùng.`);
                                              }
                                          }}
                                          className="bg-white border border-slate-100 p-3 rounded-2xl flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95"
                                      >
                                          <div className="text-3xl">{item.emoji}</div>
                                          <div className="text-center">
                                              <div className="font-bold text-xs text-slate-700 truncate max-w-full">{item.name}</div>
                                              <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                  x{amount}
                                              </div>
                                          </div>
                                      </button>
                                  );
                              })}
                              
                              {(Object.values(inventory) as number[]).every(c => c <= 0) && (
                                  <div className="col-span-2 text-center text-slate-400 text-xs italic py-4">
                                      Balo trống rỗng...
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Popups */}
      {toast && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-800/90 text-white px-6 py-3 rounded-2xl shadow-xl z-[100] animate-in fade-in slide-in-from-top-4 backdrop-blur-md flex items-center gap-3 pointer-events-none">
              <Info className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-sm">{toast.msg}</span>
          </div>
      )}
      
      {showNameInput && <NameInputScreen onSubmit={(name) => { setPlayerName(name); setShowNameInput(false); setIsLoading(true); }} />}
      {isLoading && <LoadingScreen onFinished={() => { setIsLoading(false); }} />}
      {showLeaderboard && <LeaderboardScreen currentPlayer={{ name: playerName, money, level }} rivals={rivals} onClose={() => setShowLeaderboard(false)} />}
      {showDailyReward && <DailyRewardPopup currentStreak={consecutiveDays} onClaim={() => {
          const reward = DAILY_REWARDS[Math.min(consecutiveDays, 7) - 1];
          if (reward.type === 'money') setMoney(m => m + (reward.value as number));
          else if (reward.type === 'item') setInventory(i => ({...i, [reward.value as string]: (i[reward.value as string] || 0) + reward.count}));
          setLastClaimedDate(Date.now());
          setShowDailyReward(false);
          showToast(`Đã nhận quà ngày ${consecutiveDays}!`);
      }} />}
    </div>
  );
};