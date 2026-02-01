
import React, { useState, useEffect, useRef } from 'react';
import { CellData, ToolType, WeatherType, VariantType, ItemId, PetId, Rival, DailyReward, GameState } from './types';
import { GRID_SIZE, INITIAL_MONEY, PLANTS, TICK_RATE, WEATHER_EFFECTS, VARIANTS, ITEMS, PETS, SHOP_REFRESH_RATE, DAILY_REWARDS } from './constants';
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
import { Droplets, Shovel, ShoppingBasket, Coins, Wheat, Zap, HeartPulse, Crown, Star, Bone, Club, Annoyed, ShowerHead, User, Volume2, VolumeX, Music, Check, Menu, X, Backpack, ChevronDown, Store, RefreshCw } from 'lucide-react';

const SAVE_KEY = 'GARDEN_TYCOON_SAVE_LOCAL_PLAYER';
const RIVALS_SAVE_KEY = 'GARDEN_TYCOON_RIVALS_V2'; 

const BOT_NAMES = [
  "Nông Dân Chăm Chỉ", "Vua Lúa Mì", "Trùm Cà Rốt", "Thánh Trồng Trọt", 
  "Bà Tân Vlog", "Anh Da Đen", "Famer Pro 99", "Cậu Vàng", "Lão Hạc", 
  "Chị Hằng", "Chú Cuội", "Sơn Tinh", "Thủy Tinh", "Thạch Sanh", 
  "Lý Thông", "Tấm Cám", "Doraemon", "Nobita", "Xuka", "Chaien",
  "Naruto", "Sasuke", "Goku", "Vegeta", "Luffy", "Zoro", "Conan"
];

// Clean Playlist (Removed Morning Mood)
const PLAYLIST = [
  { name: "Garden Ambience", url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3" }
];

const App: React.FC = () => {
  // --- UI Flow State ---
  const [inMenu, setInMenu] = useState(true);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  const [showDailyReward, setShowDailyReward] = useState(false); // Daily Reward Popup
  const [isLoading, setIsLoading] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false); // Mobile shop toggle
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); // New Inventory Drawer State
  
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

  // --- Data Loading Logic ---
  useEffect(() => {
      loadGameData();
      loadRivalsData();
  }, []);

  // --- MUSIC LOGIC ---
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
        audio.volume = 0.4; 
        if (!isMuted) {
            audio.play().catch(() => {
                const startMusic = () => {
                    if (!isMuted && audioRef.current) audioRef.current.play();
                    document.removeEventListener('click', startMusic);
                };
                document.addEventListener('click', startMusic);
            });
        }
    }
  }, [currentSongIndex]);

  useEffect(() => {
      if (audioRef.current) {
          if (isMuted) audioRef.current.pause();
          else audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      }
  }, [isMuted]);

  // --- RIVAL SYSTEM LOGIC ---
  const loadRivalsData = () => {
    try {
        const savedRivalsStr = localStorage.getItem(RIVALS_SAVE_KEY);
        if (savedRivalsStr) {
            const savedRivals: Rival[] = JSON.parse(savedRivalsStr);
            const now = Date.now();
            const updatedRivals = savedRivals.map(r => {
                const timeDiff = (now - r.lastUpdated) / 1000;
                if (timeDiff <= 0) return r;
                const earnings = Math.floor(r.growthRate * timeDiff);
                const levelsGained = Math.floor(earnings / 5000); 
                return {
                    ...r,
                    money: r.money + earnings,
                    level: r.level + levelsGained,
                    lastUpdated: now,
                    isOnline: Math.random() > 0.6
                };
            });
            setRivals(updatedRivals);
        } else {
            generateInitialRivals();
        }
    } catch (e) {
        generateInitialRivals();
    }
  };

  const generateInitialRivals = () => {
      const newRivals: Rival[] = [];
      newRivals.push({
          id: 'admin_top_1', name: "ADMIN MINH3312", money: 99999999999, level: 1000,
          growthRate: 100000, lastUpdated: Date.now(), isOnline: true
      });
      for (let i = 0; i < 49; i++) {
          const name = BOT_NAMES[i % BOT_NAMES.length] + (i > 20 ? ` ${i}` : '');
          const startLevel = Math.floor(Math.random() * 50) + 1;
          newRivals.push({
              id: `rival_${i}`, name, money: startLevel * 1000, level: startLevel,
              growthRate: 5 + Math.random() * 500, lastUpdated: Date.now(), isOnline: false
          });
      }
      setRivals(newRivals);
      localStorage.setItem(RIVALS_SAVE_KEY, JSON.stringify(newRivals));
  };

  useEffect(() => {
      const interval = setInterval(() => {
          setRivals(prevRivals => {
              const now = Date.now();
              return prevRivals.map(r => {
                  const earning = Math.ceil(r.growthRate * 2);
                  return {
                      ...r, money: r.money + earning,
                      level: (Math.random() < 0.05 && earning > 100) ? r.level + 1 : r.level,
                      lastUpdated: now, isOnline: Math.random() < 0.05 ? !r.isOnline : r.isOnline
                  };
              });
          });
      }, 2000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      if (rivals.length > 0) localStorage.setItem(RIVALS_SAVE_KEY, JSON.stringify(rivals));
  }, [rivals]);

  // --- REBALANCED SHOP STOCK LOGIC ---
  const refreshShopStock = () => {
      const allPlants = Object.values(PLANTS);
      const allItems = Object.values(ITEMS);
      const selectedStock: Record<string, number> = {};
      
      // Basic Wheat: Reduced to 5-15 seeds
      selectedStock['wheat'] = Math.floor(Math.random() * 11) + 5; 
      
      // Randomly pick 4 to 8 other plants to sell
      const targetCount = 4 + Math.floor(Math.random() * 5);
      
      for(let i=0; i<targetCount; i++) {
          const rand = Math.random();
          let pool;
          // Weights for rarity appearance
          if (rand < 0.50) pool = allPlants.filter(p => p.rarity === 'Common' && p.id !== 'wheat');
          else if (rand < 0.75) pool = allPlants.filter(p => p.rarity === 'Rare');
          else if (rand < 0.90) pool = allPlants.filter(p => p.rarity === 'Epic');
          else if (rand < 0.98) pool = allPlants.filter(p => p.rarity === 'Legendary');
          else pool = allPlants.filter(p => ['Mythical', 'Celestial', 'Cyber'].includes(p.rarity));
          
          if(pool.length > 0) {
              const pick = pool[Math.floor(Math.random() * pool.length)];
              let quantity = 1;
              
              // Scarcity Logic based on Rarity
              switch(pick.rarity) {
                  case 'Common': quantity = Math.floor(Math.random() * 10) + 5; break; // 5-14
                  case 'Rare': quantity = Math.floor(Math.random() * 5) + 3; break; // 3-7
                  case 'Epic': quantity = Math.floor(Math.random() * 3) + 2; break; // 2-4
                  case 'Legendary': quantity = Math.floor(Math.random() * 2) + 1; break; // 1-2
                  default: quantity = 1; // Mythical/Cyber/Celestial are extremely rare (1 stock)
              }

              if(selectedStock[pick.id]) selectedStock[pick.id] += quantity;
              else selectedStock[pick.id] = quantity;
          }
      }

      // Items: Reduced to 1-3 per type
      allItems.forEach(item => {
          selectedStock[item.id] = Math.floor(Math.random() * 3) + 1; 
      });

      setShopStock(selectedStock);
      setShopNextRefresh(Date.now() + SHOP_REFRESH_RATE);
  };

  // --- Offline Simulation ---
  const calculateOfflineProgress = (
      savedGrid: CellData[], 
      lastSave: number, 
      sprinklerEnd: number
  ): { newGrid: CellData[], growthMessages: string[] } => {
      // Safety check for invalid dates
      const safeLastSave = (!lastSave || isNaN(lastSave)) ? Date.now() : lastSave;
      const now = Date.now();
      const elapsedSeconds = (now - safeLastSave) / 1000;
      const ONE_HOUR = 3600; // 1 hour in seconds

      // Logic: If offline < 1 hour, DO NOTHING (return original grid).
      // If offline >= 1 hour, grow all living plants to 100%.

      if (elapsedSeconds < ONE_HOUR) {
          return { newGrid: savedGrid, growthMessages: [] };
      }

      // If more than 1 hour passed
      const messages: string[] = [];
      let grownCount = 0;

      const newGrid = savedGrid.map(cell => {
          if (!cell.plantId || cell.isDead) return cell;

          // If plant is already fully grown, keep it
          if (cell.growthProgress >= 100) return cell;

          // Otherwise, force grow to 100%
          grownCount++;
          return { 
              ...cell, 
              growthProgress: 100, 
              // Keep water level as is (or set to safe level so they don't die instantly on next tick)
              // waterLevel: cell.waterLevel 
          };
      });

      if (grownCount > 0) {
          messages.push(`Bạn đã vắng mặt hơn 1 tiếng. Tất cả ${grownCount} cây đã trưởng thành!`);
      }

      return { newGrid, growthMessages: messages };
  };

  const loadGameData = () => {
      try {
          const savedStr = localStorage.getItem(SAVE_KEY);
          if (savedStr) {
              const savedData: GameState = JSON.parse(savedStr);
              
              // Helper to safely get value or default
              const safeNum = (val: any, def: number) => (typeof val === 'number' && !isNaN(val)) ? val : def;

              setPlayerName(savedData.playerName || '');
              setMoney(safeNum(savedData.money, INITIAL_MONEY));
              setLevel(safeNum(savedData.level, 1));
              setXp(safeNum(savedData.xp, 0));
              setInventory({ ...defaultInventory, ...(savedData.inventory || {}) });
              
              // Load raw grid first
              const rawGrid = savedData.grid || Array.from({ length: GRID_SIZE }, (_, i) => ({
                  id: i, plantId: null, growthProgress: 0, waterLevel: 50, isDead: false, variant: 'Normal'
              }));

              const savedSprinklerEnd = safeNum(savedData.sprinklerEndTime, 0);
              setSprinklerEndTime(savedSprinklerEnd);
              
              // OFFLINE PROGRESS CALCULATION
              const savedTime = safeNum(savedData.lastSaveTime, Date.now());
              const { newGrid, growthMessages } = calculateOfflineProgress(rawGrid, savedTime, savedSprinklerEnd);
              
              setGrid(newGrid);
              
              // Notify user
              if (growthMessages.length > 0) {
                  // Delay slightly to let UI render
                  setTimeout(() => {
                      growthMessages.forEach(msg => showToast(msg));
                  }, 1000);
              }

              setSelectedSeedId(savedData.selectedSeedId ?? 'wheat');
              setWeather(savedData.weather ?? 'Sunny');
              setWeatherTimeLeft(safeNum(savedData.weatherTimeLeft, 0));
              setOwnedPets(savedData.ownedPets || []);
              setEquippedPet(savedData.equippedPet ?? null);
              setPetCooldownTimer(safeNum(savedData.petCooldownTimer, 0));
              setPetActiveTimer(safeNum(savedData.petActiveTimer, 0));
              
              if (savedData.shopStock && savedData.shopNextRefresh > Date.now()) {
                  setShopStock(savedData.shopStock);
                  setShopNextRefresh(savedData.shopNextRefresh);
              } else refreshShopStock();

              // --- Daily Reward Logic Check ---
              const now = new Date();
              const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
              const lastLogin = safeNum(savedData.lastLoginDate, 0);
              const lastClaimed = safeNum(savedData.lastClaimedDate, 0);
              let streak = safeNum(savedData.consecutiveDays, 1);

              // Compare stored lastLogin (start of day) with today's start
              if (lastLogin < todayStart) {
                  const oneDay = 24 * 60 * 60 * 1000;
                  // If difference is exactly one day (allow 2 days buffer for timezone safety/leniency)
                  if (todayStart - lastLogin <= oneDay * 2) {
                      if (todayStart - lastLogin > oneDay) {
                         streak = 1;
                      } else {
                        if (lastClaimed < lastLogin) {
                          streak += 1;
                        }
                      }
                  } else {
                      streak = 1;
                  }
                  setLastLoginDate(todayStart);
                  setConsecutiveDays(streak);
              } else {
                  setLastLoginDate(lastLogin);
                  setConsecutiveDays(streak);
              }
              setLastClaimedDate(lastClaimed);
              setLastSaveTime(Date.now()); // Reset save time to now

          } else refreshShopStock();
      } catch (e) { 
          console.error("Failed to load save data, resetting...", e);
          refreshShopStock(); 
          // If save is corrupt, clear it to prevent infinite crash loops
          localStorage.removeItem(SAVE_KEY);
      }
  };

  const handleStartGame = () => {
      if (!playerName || playerName.trim() === '') {
          setInMenu(false); setShowNameInput(true);
      } else {
          setInMenu(false); setIsLoading(true);
      }
      if (!isMuted && audioRef.current) audioRef.current.play().catch(console.log);
  };

  const handleNameSubmit = (name: string) => {
      setPlayerName(name); setShowNameInput(false); setIsLoading(true);
      if (!isMuted && audioRef.current) audioRef.current.play().catch(console.log);
  };

  // --- Daily Reward Trigger ---
  useEffect(() => {
    if (!isLoading && !inMenu && !showNameInput) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // If we haven't claimed today (lastClaimed < todayStart), show popup
        if (lastClaimedDate < todayStart) {
            // Small delay for effect
            setTimeout(() => setShowDailyReward(true), 1000);
        }
    }
  }, [isLoading, inMenu, showNameInput, lastClaimedDate]);

  const handleClaimDailyReward = () => {
      const dayIndex = Math.min(Math.max(1, consecutiveDays), 7) - 1;
      const reward = DAILY_REWARDS[dayIndex];
      
      if (reward.type === 'money') {
          setMoney(prev => prev + (reward.value as number));
      } else if (reward.type === 'item') {
          const itemId = reward.value as ItemId;
          setInventory(prev => ({
              ...prev,
              [itemId]: (prev[itemId] || 0) + reward.count
          }));
      } else if (reward.type === 'seed') {
          const seedId = reward.value as string;
          setShopStock(prev => ({
              ...prev,
              [seedId]: (prev[seedId] || 0) + reward.count
          }));
          const plant = PLANTS[seedId];
          if (plant) setMoney(prev => prev + (plant.buyPrice * reward.count));
          showToast(`Nhận ${reward.label} (Đã quy đổi + Thêm vào Shop)`);
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      setLastClaimedDate(todayStart);
      setShowDailyReward(false);
      showToast(`Đã nhận quà ngày ${consecutiveDays}!`);
  };

  // --- Auto-Save Fix ---
  const gameStateRef = useRef({ 
      playerName, money, level, xp, inventory, grid, weather, weatherTimeLeft, 
      ownedPets, equippedPet, petCooldownTimer, petActiveTimer, selectedSeedId, 
      sprinklerEndTime, shopStock, shopNextRefresh,
      lastLoginDate, consecutiveDays, lastClaimedDate, lastSaveTime
  });
  
  useEffect(() => {
      gameStateRef.current = { 
          playerName, money, level, xp, inventory, grid, weather, weatherTimeLeft, 
          ownedPets, equippedPet, petCooldownTimer, petActiveTimer, selectedSeedId, 
          sprinklerEndTime, shopStock, shopNextRefresh,
          lastLoginDate, consecutiveDays, lastClaimedDate, 
          lastSaveTime: Date.now() // Always update save time reference to NOW
      };
  }, [playerName, money, level, xp, inventory, grid, weather, weatherTimeLeft, ownedPets, equippedPet, petCooldownTimer, petActiveTimer, selectedSeedId, sprinklerEndTime, shopStock, shopNextRefresh, lastLoginDate, consecutiveDays, lastClaimedDate]);

  useEffect(() => {
      const handleSave = () => {
          // Only save if we have a valid player name (game started/loaded)
          if (gameStateRef.current.playerName) {
              // Ensure we capture the exact moment of saving
              const stateToSave = {
                  ...gameStateRef.current,
                  lastSaveTime: Date.now()
              };
              localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
          }
      };

      // Save immediately on tab close or refresh
      window.addEventListener('beforeunload', handleSave);

      // Auto-save every 5 seconds only if playing (Leaderboard allowed)
      const interval = setInterval(() => {
           if (!inMenu && !isLoading && !showNameInput) {
               handleSave();
           }
      }, 5000);

      return () => {
          window.removeEventListener('beforeunload', handleSave);
          clearInterval(interval);
      };
  }, [inMenu, isLoading, showNameInput]); 

  // --- Game Loop (Growth) ---
  const showToast = (msg: string) => {
    setToast({ msg, id: Date.now() });
    setTimeout(() => setToast(null), 2000);
  };

  const getMaxXp = (lvl: number) => lvl * 100;
  const addXp = (amount: number) => {
      let newXp = xp + amount;
      let newLevel = level;
      let needed = getMaxXp(newLevel);
      while (newXp >= needed) {
          newXp -= needed; newLevel++; needed = getMaxXp(newLevel);
          showToast(`LÊN CẤP! Bạn đạt cấp độ ${newLevel}!`);
      }
      setXp(newXp); setLevel(newLevel);
  };

  useEffect(() => {
    if (inMenu || isLoading) return;
    const interval = setInterval(() => {
      if (Date.now() >= shopNextRefresh) refreshShopStock();
      // Sprinkler check
      const isSprinklerActive = Date.now() < sprinklerEndTime;
      // Grid update
      setGrid((prevGrid) => prevGrid.map((cell) => {
          if (!cell.plantId || cell.isDead) return cell;
          const plant = PLANTS[cell.plantId];
          const wInfo = WEATHER_EFFECTS[weather];
          
          if (isSprinklerActive) {
               return { ...cell, waterLevel: 100, growthProgress: Math.min(100, cell.growthProgress + ((100 / plant.growthTime) * wInfo.growthMod)) };
          }

          let consume = plant.waterConsumption * wInfo.waterMod;
          let newWater = consume < 0 ? Math.min(100, cell.waterLevel + Math.abs(consume)) : Math.max(0, cell.waterLevel - consume);
          if (weather === 'Snowy' || weather === 'Blizzard') newWater = cell.waterLevel;
          
          if (newWater <= 0.1 && cell.growthProgress < 100) return { ...cell, waterLevel: 0, isDead: true };
          
          let newGrowth = cell.growthProgress;
          if (newWater > 0 && newGrowth < 100) newGrowth = Math.min(100, newGrowth + (100 / plant.growthTime) * wInfo.growthMod);
          if (newWater <= 0.1 && newGrowth >= 100) return { ...cell, growthProgress: 100, waterLevel: 0, isDead: false };

          return { ...cell, growthProgress: newGrowth, waterLevel: newWater, isDead: false };
      }));
    }, TICK_RATE);
    return () => clearInterval(interval);
  }, [weather, inMenu, isLoading, sprinklerEndTime, shopNextRefresh]);

  // Pet Logic
  useEffect(() => {
    if (inMenu || !equippedPet) return;
    const pet = PETS[equippedPet];
    const timer = setInterval(() => {
        if (petActiveTimer > 0) {
            setPetActiveTimer(prev => prev - 1);
            if (pet.abilityType === 'buff_money') setMoney(prev => prev + (pet.abilityValue as number));
            if (pet.abilityType === 'grow_plants') setGrid(p => p.map(c => (c.plantId && !c.isDead) ? { ...c, growthProgress: Math.min(100, c.growthProgress + (pet.abilityValue as number)) } : c));
            if (petActiveTimer === 1) setPetCooldownTimer(pet.baseCooldown);
        } else if (petCooldownTimer > 0) setPetCooldownTimer(prev => prev - 1);
        else if (petCooldownTimer === 0 && petActiveTimer === 0) setPetActiveTimer(pet.activeDuration);
    }, 1000);
    return () => clearInterval(timer);
  }, [equippedPet, petCooldownTimer, petActiveTimer, inMenu]);

  // Weather Change
  useEffect(() => {
      if (inMenu) return;
      const interval = setInterval(() => {
          if (weather !== 'Sunny') {
              if (weatherTimeLeft > 0) setWeatherTimeLeft(prev => prev - 1);
              else setWeather('Sunny');
          } else if (Math.random() < 0.005) {
               setWeather('Rainy'); setWeatherTimeLeft(180); showToast("Trời bắt đầu mưa!");
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [weather, weatherTimeLeft, inMenu]);


  // --- Actions ---
  const handleBuyItem = (itemId: ItemId) => {
      const item = ITEMS[itemId];
      if ((shopStock[itemId] || 0) <= 0) return showToast("Hết hàng!");
      if (money >= item.price) {
          setMoney(m => m - item.price);
          setInventory(i => ({ ...i, [itemId]: (i[itemId] || 0) + 1 }));
          setShopStock(s => ({ ...s, [itemId]: s[itemId] - 1 }));
          showToast(`Đã mua ${item.name}`);
      } else showToast("Thiếu tiền!");
  };

  const handleBuyPet = (petId: PetId) => {
      const pet = PETS[petId];
      if (ownedPets.includes(petId)) { setEquippedPet(petId); return; }
      if (money >= pet.price) {
          setMoney(m => m - pet.price);
          setOwnedPets(p => [...p, petId]);
          setEquippedPet(petId);
      }
  };

  const handleCellClick = (cellId: number) => {
      const idx = grid.findIndex(c => c.id === cellId);
      if (idx === -1) return;
      const cell = grid[idx];
      let newGrid = [...grid];
      let newMoney = money;
      const inv = { ...inventory };

      if(selectedTool === 'select_seed') {
          if(cell.plantId) return showToast("Đã có cây!");
          if(!selectedSeedId) return;
          const p = PLANTS[selectedSeedId];
          if(money < p.buyPrice) return showToast("Thiếu tiền!");
          if((shopStock[selectedSeedId] || 0) <= 0) return showToast("Hết hạt giống!");
          
          setShopStock(s => ({ ...s, [selectedSeedId]: s[selectedSeedId] - 1 }));
          newMoney -= p.buyPrice;
          
          // Luck logic
          let variant: VariantType = 'Normal';
          if(Math.random() < 0.05) variant = 'Golden';
          
          newGrid[idx] = { ...cell, plantId: selectedSeedId, growthProgress: 0, waterLevel: 100, isDead: false, variant };
      } 
      else if (selectedTool === 'water') {
          if(!cell.plantId) return;
          newGrid[idx] = { ...cell, waterLevel: 100 };
      }
      else if (selectedTool === 'harvest') {
          if(cell.isDead || !cell.plantId || cell.growthProgress < 100) return;
          const p = PLANTS[cell.plantId];
          const mult = VARIANTS[cell.variant].multiplier;
          newMoney += Math.floor(p.sellPrice * mult);
          addXp(p.xpReward * mult);
          newGrid[idx] = { ...cell, plantId: null, growthProgress: 0, waterLevel: 50, variant: 'Normal' };
      }
      else if (selectedTool === 'shovel') {
          if(!cell.plantId) return;
          newGrid[idx] = { ...cell, plantId: null, growthProgress: 0, waterLevel: 50, variant: 'Normal', isDead: false };
      }
      else if (ITEMS[selectedTool as ItemId]) {
          // Item usage
           if(inv[selectedTool as ItemId] > 0) {
               inv[selectedTool as ItemId]--;
               setInventory(inv);
               if(selectedTool === 'fertilizer' && cell.plantId) newGrid[idx].growthProgress = Math.min(100, cell.growthProgress + 40);
               if(selectedTool === 'revive_potion' && cell.isDead) { newGrid[idx].isDead = false; newGrid[idx].waterLevel = 50; }
               if(selectedTool.includes('sprinkler')) {
                   const dur = ITEMS[selectedTool as ItemId].duration || 100;
                   setSprinklerEndTime(Math.max(Date.now(), sprinklerEndTime) + dur * 1000);
               }
               // Toys
               if(selectedTool === 'toy_ball' && equippedPet) setPetCooldownTimer(prev => Math.max(0, prev - (ITEMS['toy_ball'].cooldownReduction || 60)));
               if(selectedTool === 'toy_yarn' && equippedPet) setPetCooldownTimer(prev => Math.max(0, prev - (ITEMS['toy_yarn'].cooldownReduction || 120)));
               if(selectedTool === 'toy_whistle' && equippedPet) setPetCooldownTimer(0);
               
               if(selectedTool.includes('toy')) showToast("Pet vui vẻ hơn!");
           } else {
               showToast("Đã hết vật phẩm này!");
               setSelectedTool('water'); // Reset to water if empty
           }
      }

      setMoney(newMoney);
      setGrid(newGrid);
  };

  // Helper to check if tool is a basic tool
  const isBasicTool = (t: ToolType) => ['water', 'harvest', 'shovel', 'select_seed'].includes(t);

  const ToolButton = ({ tool, icon: Icon, label, color, count, onClick }: any) => {
      const isActive = selectedTool === tool;
      const handleClick = onClick ? onClick : () => {
          setSelectedTool(tool);
          if (!isBasicTool(tool)) setIsInventoryOpen(false); // Close drawer if selecting item
      };

      return (
        <button
            onClick={handleClick}
            className={`
                flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[64px] flex-1
                ${isActive ? `bg-${color}-500 text-white shadow-lg -translate-y-2 scale-105` : `bg-transparent text-slate-500 hover:bg-slate-100`}
            `}
        >
            <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-bounce' : ''}`} />
                {count !== undefined && count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                        {count}
                    </span>
                )}
            </div>
            <span className="text-[10px] font-bold uppercase">{label}</span>
        </button>
      )
  };

  const InventoryItemButton = ({ itemId }: { itemId: ItemId }) => {
      const item = ITEMS[itemId];
      const count = inventory[itemId] || 0;
      const isActive = selectedTool === itemId;

      return (
          <button
            onClick={() => { setSelectedTool(itemId); setIsInventoryOpen(false); }}
            className={`
                relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all
                ${isActive ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-100 hover:border-indigo-200'}
                ${count === 0 ? 'opacity-50 grayscale' : ''}
            `}
          >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-[10px] font-bold text-slate-700 text-center leading-tight">{item.name}</div>
              <div className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 rounded-full ${count > 0 ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {count}
              </div>
          </button>
      );
  };

  const activePlants = grid.filter(c => c.plantId && !c.isDead).length;

  return (
    <>
    <audio ref={audioRef} src={PLAYLIST[0].url} loop />

    {/* Emergency Reset Button (Visible only if critical error state stuck) */}
    <div className="fixed bottom-2 right-2 z-[9999] opacity-20 hover:opacity-100 transition-opacity">
         <button 
            onClick={() => {
                if(window.confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu game và chơi lại từ đầu? (Dùng khi game bị lỗi)')) {
                    localStorage.clear();
                    window.location.reload();
                }
            }}
            className="bg-red-500 text-white p-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
         >
             <RefreshCw className="w-3 h-3"/> Reset
         </button>
    </div>

    {inMenu ? (
        <MainMenu onStart={handleStartGame} playerName={playerName} onShowLeaderboard={() => { setInMenu(false); setShowLeaderboard(true); }} />
    ) : showLeaderboard ? (
        <LeaderboardScreen currentPlayer={{ name: playerName || 'Bạn', money, level }} rivals={rivals} onClose={() => { setShowLeaderboard(false); setInMenu(true); }} />
    ) : showNameInput ? (
        <NameInputScreen onSubmit={handleNameSubmit} />
    ) : (
        <>
            {isLoading && <LoadingScreen onFinished={() => setIsLoading(false)} />}
            
            {showDailyReward && (
                <DailyRewardPopup currentStreak={consecutiveDays} onClaim={handleClaimDailyReward} />
            )}

            <div className={`
                min-h-screen flex flex-col transition-all duration-1000 overflow-hidden
                ${WEATHER_EFFECTS[weather].bgClass}
                ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
            `}>
            
            {/* --- TOP HUD (Fixed) --- */}
            <div className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
                <div className="max-w-[1600px] mx-auto flex justify-between items-start">
                    {/* Left: Money & Level */}
                    <div className="pointer-events-auto flex flex-col gap-2 animate-in slide-in-from-top-10 fade-in duration-500">
                         <div className="bg-white/80 backdrop-blur-xl rounded-full pl-2 pr-6 py-2 shadow-xl border border-white/50 flex items-center gap-3">
                             <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                                 <Coins className="w-6 h-6 text-white" />
                             </div>
                             <div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tài Sản</div>
                                 <div className="text-xl font-black text-slate-800 leading-none">${money.toLocaleString()}</div>
                             </div>
                         </div>
                         
                         <div className="bg-white/80 backdrop-blur-xl rounded-full px-4 py-1.5 shadow-lg border border-white/50 flex items-center gap-3 w-max">
                             <span className="text-xs font-black text-indigo-500">LVL {level}</span>
                             <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(xp / getMaxXp(level)) * 100}%` }} />
                             </div>
                         </div>
                    </div>

                    {/* Right: Controls & Weather */}
                    <div className="pointer-events-auto flex gap-2 items-start">
                         <div className="hidden md:block mr-4"><WeatherDisplay weather={weather} /></div>
                         
                         <button onClick={() => setIsMuted(!isMuted)} className="bg-white/80 p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400"/> : <Volume2 className="w-5 h-5 text-indigo-500"/>}
                        </button>
                        <button onClick={() => setIsShopOpen(!isShopOpen)} className="xl:hidden bg-white/80 p-3 rounded-full shadow-lg hover:scale-110 transition-transform relative">
                            <Store className="w-5 h-5 text-emerald-600"/>
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- MAIN LAYOUT CONTAINER --- */}
            <div className="flex-1 flex flex-col xl:flex-row h-screen pt-24 pb-28 xl:pb-6 gap-6 overflow-hidden max-w-[1800px] mx-auto w-full px-4">
                
                {/* Center: Garden Grid (Responsive Width) */}
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full overflow-y-auto xl:overflow-visible">
                    <div className="w-full max-w-md md:max-w-xl xl:max-w-2xl transition-all duration-500">
                         {/* Stats Row for Mobile */}
                         <div className="flex justify-between items-end mb-4 px-2 xl:hidden">
                             <div className="bg-white/40 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-slate-700 border border-white/40">
                                 {activePlants}/{GRID_SIZE} Cây
                             </div>
                             <div className="md:hidden"><WeatherDisplay weather={weather} /></div>
                         </div>
                         
                         {/* THE GRID */}
                         <div className="grid grid-cols-3 gap-3 md:gap-5 p-4 md:p-6 bg-white/20 backdrop-blur-xl rounded-[2rem] shadow-[inset_0_0_60px_rgba(255,255,255,0.3)] border border-white/30">
                             {grid.map(cell => (
                                 <GardenCell key={cell.id} cell={cell} onClick={handleCellClick} isSelected={false} />
                             ))}
                         </div>
                    </div>
                </div>

                {/* Right: Persistent Shop (Desktop) / Drawer (Mobile) */}
                <div className={`
                    fixed inset-y-0 right-0 w-80 md:w-96 bg-white/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 z-[60]
                    xl:relative xl:transform-none xl:w-[400px] xl:bg-transparent xl:shadow-none xl:backdrop-blur-none xl:z-auto xl:flex xl:flex-col xl:justify-center
                    ${isShopOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
                `}>
                    <div className="h-full flex flex-col p-4 xl:p-0 xl:h-[85vh]">
                        <div className="xl:hidden flex justify-between items-center mb-4 pt-safe-top">
                            <h2 className="text-xl font-black text-slate-800">Cửa Hàng</h2>
                            <button onClick={() => setIsShopOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <Shop 
                            money={money} level={level} selectedSeedId={selectedSeedId}
                            onSelectSeed={(id) => { setSelectedSeedId(id); setSelectedTool('select_seed'); if(window.innerWidth < 1280) setIsShopOpen(false); }}
                            onBuyItem={handleBuyItem} onBuyPet={handleBuyPet} ownedPets={ownedPets}
                            shopStock={shopStock} shopNextRefresh={shopNextRefresh}
                        />
                    </div>
                </div>

            </div>

            {/* --- DOCK + INVENTORY DRAWER --- */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                <div className="max-w-xl mx-auto p-4 flex flex-col justify-end pb-safe-bottom">
                    
                    {/* Inventory Drawer (Popup) */}
                    {isInventoryOpen && (
                        <div className="pointer-events-auto bg-white/90 backdrop-blur-2xl rounded-3xl p-5 mb-3 shadow-2xl border border-white/50 animate-in slide-in-from-bottom-5 fade-in duration-300 mx-2">
                             <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                                 <h3 className="font-bold text-slate-700 flex items-center gap-2"><Backpack className="w-4 h-4"/> Túi Đồ Của Bạn</h3>
                                 <button onClick={() => setIsInventoryOpen(false)}><ChevronDown className="w-5 h-5 text-slate-400"/></button>
                             </div>

                             <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                                 {/* Consumables Section */}
                                 <div>
                                     <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Vật Phẩm</div>
                                     <div className="grid grid-cols-3 gap-2">
                                         <InventoryItemButton itemId="fertilizer" />
                                         <InventoryItemButton itemId="revive_potion" />
                                         <InventoryItemButton itemId="super_water" />
                                     </div>
                                 </div>

                                 {/* Sprinklers Section */}
                                 <div>
                                     <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Vòi Tưới</div>
                                     <div className="grid grid-cols-3 gap-2">
                                         <InventoryItemButton itemId="sprinkler_basic" />
                                         <InventoryItemButton itemId="sprinkler_advanced" />
                                         <InventoryItemButton itemId="sprinkler_pro" />
                                     </div>
                                 </div>

                                 {/* Toys Section */}
                                 <div>
                                     <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Đồ Chơi Pet</div>
                                     <div className="grid grid-cols-3 gap-2">
                                         <InventoryItemButton itemId="toy_ball" />
                                         <InventoryItemButton itemId="toy_yarn" />
                                         <InventoryItemButton itemId="toy_whistle" />
                                     </div>
                                     {!equippedPet && (
                                         <div className="text-[10px] text-red-400 italic mt-1 text-center">Cần trang bị Pet để dùng đồ chơi</div>
                                     )}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Bottom Dock */}
                    <div className="pointer-events-auto bg-white/90 backdrop-blur-2xl rounded-3xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 flex items-center justify-between gap-2 mx-2 md:mx-0">
                        
                        {/* Basic Tools (Fixed) */}
                        <div className="flex-1 flex gap-1 justify-around">
                            <ToolButton tool="select_seed" icon={Wheat} label="Trồng" color="green" />
                            <ToolButton tool="water" icon={Droplets} label="Tưới" color="cyan" />
                            <ToolButton tool="harvest" icon={ShoppingBasket} label="Thu" color="orange" />
                            <ToolButton tool="shovel" icon={Shovel} label="Xẻng" color="stone" />
                        </div>

                        {/* Divider */}
                        <div className="w-[1px] h-10 bg-slate-200"></div>

                        {/* Inventory Toggle Button */}
                        <button 
                            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                            className={`
                                flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all shadow-sm
                                ${isInventoryOpen ? 'bg-slate-100' : 'bg-indigo-50 hover:bg-indigo-100'}
                                ${!isBasicTool(selectedTool) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                            `}
                        >
                            {isBasicTool(selectedTool) ? (
                                <>
                                    <Backpack className="w-6 h-6 text-indigo-600 mb-1" />
                                    <span className="text-[9px] font-bold text-indigo-700 uppercase">Túi Đồ</span>
                                </>
                            ) : (
                                <>
                                    <div className="text-2xl mb-1 drop-shadow-sm">{ITEMS[selectedTool as ItemId]?.emoji}</div>
                                    <span className="text-[8px] font-bold text-slate-700 uppercase truncate w-14 text-center">
                                        {inventory[selectedTool as ItemId] || 0}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-slate-900/90 text-white px-6 py-3 rounded-full font-bold shadow-2xl backdrop-blur-md flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        {toast.msg}
                    </div>
                </div>
            )}

            <PetDisplay equippedPet={equippedPet} cooldownTimer={petCooldownTimer} activeTimer={petActiveTimer} />
            <Assistant money={money} />
            
            </div>
        </>
    )}
    </>
  );
};

export default App;
