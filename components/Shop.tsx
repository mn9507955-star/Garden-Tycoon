import React, { useState, useMemo, useEffect } from 'react';
import { PLANTS, ITEMS, PETS } from '../constants';
import { PlantType, PlantCategory, ItemId, PetId } from '../types';
import { Lock, Crown, Tag, Package, Sparkles, Timer, Box } from 'lucide-react';

interface ShopProps {
  money: number;
  level: number;
  selectedSeedId: string | null;
  onSelectSeed: (id: string) => void;
  onBuyItem: (id: ItemId) => void;
  onBuyPet: (id: PetId) => void;
  ownedPets: PetId[];
  shopStock: Record<string, number>;
  shopNextRefresh: number;
}

const Shop: React.FC<ShopProps> = ({ 
    money, level, selectedSeedId, onSelectSeed, onBuyItem, onBuyPet, ownedPets,
    shopStock, shopNextRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'seeds' | 'items' | 'pets'>('seeds');
  const [categoryFilter, setCategoryFilter] = useState<PlantCategory | 'All'>('All');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setTimeLeft(Math.max(0, Math.ceil((shopNextRefresh - Date.now()) / 1000)));
      }, 1000);
      return () => clearInterval(interval);
  }, [shopNextRefresh]);
  
  const categories: (PlantCategory | 'All')[] = ['All', 'Vegetable', 'Fruit', 'Flower', 'Magical', 'Tech', 'Cosmic'];

  const filteredPlants = useMemo(() => {
    return Object.values(PLANTS).filter(p => {
      // Must have stock entry
      if (shopStock[p.id] === undefined) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      return true;
    }).sort((a, b) => a.buyPrice - b.buyPrice);
  }, [categoryFilter, shopStock]);

  return (
    <div className="bg-white/60 backdrop-blur-xl xl:rounded-[2rem] flex flex-col h-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/60 overflow-hidden ring-1 ring-white/80">
      {/* Header with improved padding for mobile close button (pt-16) */}
      <div className="p-5 pt-16 md:pt-5 pr-5 border-b border-white/20 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 tracking-tight">
            <span className="text-2xl drop-shadow-md">🏪</span> 
            Cửa Hàng
            </h2>
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1 bg-slate-800 text-white px-2 py-0.5 rounded-lg text-[10px] font-mono shadow-sm">
                    <Timer className="w-3 h-3" />
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                 </div>
                <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
                    Level {level}
                </div>
            </div>
        </div>
        
        {/* Modern Tabs */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl relative">
             {['seeds', 'items', 'pets'].map((tab) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`
                        flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-300 relative z-10 flex items-center justify-center gap-2
                        ${activeTab === tab 
                            ? 'bg-white text-indigo-600 shadow-md scale-100' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
                        }
                    `}
                 >
                    {tab === 'seeds' && <Tag className="w-3 h-3" />}
                    {tab === 'items' && <Package className="w-3 h-3" />}
                    {tab === 'pets' && <Crown className="w-3 h-3" />}
                    <span className="uppercase tracking-wide">{tab}</span>
                 </button>
             ))}
        </div>
      </div>

      {/* SEEDS VIEW */}
      {activeTab === 'seeds' && (
        <>
            {/* Filter Pills */}
            <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide border-b border-white/20 bg-white/20 shrink-0">
                {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`
                    px-4 py-1.5 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all duration-200
                    ${categoryFilter === cat 
                        ? 'bg-slate-800 text-white shadow-lg transform scale-105' 
                        : 'bg-white/60 text-slate-500 border border-white/50 hover:bg-white'
                    }
                    `}
                >
                    {cat}
                </button>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 scrollbar-hide content-start">
                {filteredPlants.map((plant) => {
                const isLocked = level < plant.unlockLevel;
                const canAfford = money >= plant.buyPrice;
                const stock = shopStock[plant.id] || 0;
                const isOutOfStock = stock <= 0;
                const isSelected = selectedSeedId === plant.id;

                // Rarity color logic specifically for cards
                const getRarityBg = (r: string) => {
                    switch(r) {
                        case 'Common': return 'from-slate-50 to-slate-100 border-slate-200';
                        case 'Rare': return 'from-amber-50 to-amber-100 border-amber-200';
                        case 'Epic': return 'from-cyan-50 to-cyan-100 border-cyan-200';
                        case 'Legendary': return 'from-purple-50 to-purple-100 border-purple-200';
                        case 'Mythical': return 'from-fuchsia-50 to-fuchsia-100 border-fuchsia-200';
                        case 'Cyber': return 'from-emerald-50 to-emerald-100 border-emerald-200';
                        case 'Celestial': return 'from-indigo-50 to-indigo-100 border-indigo-200';
                        default: return 'from-white to-slate-50';
                    }
                }

                return (
                    <button
                    key={plant.id}
                    onClick={() => (!isLocked && canAfford && !isOutOfStock) ? onSelectSeed(plant.id) : null}
                    disabled={isLocked || isOutOfStock}
                    className={`
                        relative p-3 rounded-2xl border transition-all duration-200 group text-left flex flex-col justify-between min-h-[140px]
                        bg-gradient-to-br ${getRarityBg(plant.rarity)}
                        ${isSelected 
                            ? 'ring-4 ring-indigo-400/30 border-indigo-500 z-10 shadow-xl scale-[1.02]' 
                            : !isLocked && canAfford && !isOutOfStock
                                ? 'hover:-translate-y-1 hover:shadow-lg' 
                                : 'opacity-60 grayscale-[0.5]'
                        }
                    `}
                    >
                        {/* Top: Icon & Price */}
                        <div className="flex justify-between items-start w-full">
                            <div className="text-4xl filter drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
                                {plant.emoji}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {isLocked ? (
                                    <Lock className="w-4 h-4 text-slate-400" />
                                ) : (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${canAfford ? 'bg-black/5 text-slate-700' : 'bg-red-100 text-red-500'}`}>
                                        ${plant.buyPrice.toLocaleString()}
                                    </span>
                                )}
                                {/* Stock Badge */}
                                {!isLocked && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-slate-800/10 text-slate-600'}`}>
                                        <Box className="w-3 h-3" />
                                        {isOutOfStock ? 'Hết' : stock}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Middle: Name & Rarity */}
                        <div className="mt-2">
                            <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-1">{plant.name}</div>
                            <div className="text-[9px] font-black uppercase opacity-60 tracking-wider">{plant.rarity}</div>
                        </div>
                        
                        {/* Bottom: Stats */}
                        {!isLocked ? (
                            <div className="mt-auto pt-2 border-t border-black/5 flex justify-between items-center text-[9px] font-medium text-slate-500">
                                <div className="flex gap-1">
                                    <span>⏱️{plant.growthTime}s</span>
                                </div>
                                <span className="text-indigo-600 font-bold bg-indigo-50 px-1 rounded">+{plant.xpReward}XP</span>
                            </div>
                        ) : (
                            <div className="mt-auto pt-2 text-center text-[10px] font-bold text-red-400 bg-red-50 rounded-lg py-1">
                                Yêu cầu Lvl {plant.unlockLevel}
                            </div>
                        )}
                    </button>
                );
                })}
                
                {filteredPlants.length === 0 && (
                    <div className="col-span-2 flex flex-col items-center justify-center text-center py-12 text-slate-400">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <Box className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="text-xs italic max-w-[200px]">
                            Đợt hàng này không có loại hạt giống bạn cần. Vui lòng quay lại sau!
                        </p>
                    </div>
                )}
            </div>
        </>
      )}

      {/* ITEMS VIEW */}
      {activeTab === 'items' && (
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
             {Object.values(ITEMS).map((item) => {
                 const canAfford = money >= item.price;
                 const stock = shopStock[item.id] || 0;
                 const isOutOfStock = stock <= 0;

                 return (
                    <div key={item.id} className="bg-white/80 border border-slate-100 rounded-2xl p-3 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0 group relative">
                            <span className="group-hover:scale-125 transition-transform duration-300">{item.emoji}</span>
                            {/* Stock Badge on Icon */}
                            <div className={`absolute -top-2 -right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 border border-white shadow-sm ${isOutOfStock ? 'bg-red-500 text-white' : 'bg-slate-700 text-white'}`}>
                                {isOutOfStock ? '0' : stock}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                            <div className="text-[10px] text-slate-500 leading-tight mt-0.5 line-clamp-2">{item.description}</div>
                        </div>
                        <button 
                            onClick={() => onBuyItem(item.id)}
                            disabled={!canAfford || isOutOfStock}
                            className={`
                                h-10 px-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center min-w-[80px] transition-all
                                ${(!canAfford || isOutOfStock)
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-teal-500/20 active:scale-95 hover:brightness-110' 
                                }
                            `}
                        >
                            <span>{isOutOfStock ? 'Hết hàng' : 'Mua'}</span>
                            {!isOutOfStock && <span className="opacity-90 font-mono">${item.price}</span>}
                        </button>
                    </div>
                 )
             })}
         </div>
      )}

      {/* PETS VIEW */}
      {activeTab === 'pets' && (
         <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-hide">
             {Object.values(PETS).map((pet) => {
                 const isOwned = ownedPets.includes(pet.id);
                 const canAfford = money >= pet.price;
                 return (
                    <div key={pet.id} className={`border rounded-2xl p-3 flex flex-col gap-3 shadow-sm relative transition-all ${isOwned ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white/80 border-slate-100 hover:border-pink-200 hover:shadow-md'}`}>
                        {isOwned && (
                            <div className="absolute top-3 right-3 text-indigo-500 font-bold text-[10px] flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm border border-indigo-100">
                                <Crown className="w-3 h-3 text-amber-400 fill-amber-400"/> Sở hữu
                            </div>
                        )}
                        
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-50 rounded-2xl flex items-center justify-center text-4xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] shrink-0">
                                {pet.emoji}
                            </div>
                            <div className="flex-1">
                                <div className="font-black text-slate-800">{pet.name}</div>
                                <div className="text-[10px] font-medium text-pink-500 bg-pink-50 inline-block px-1.5 py-0.5 rounded-md mt-1 mb-1 border border-pink-100">
                                    Hồi chiêu: {pet.baseCooldown}s
                                </div>
                                <div className="text-[11px] text-slate-500 leading-tight">{pet.description}</div>
                            </div>
                        </div>

                        {!isOwned ? (
                            <button 
                                onClick={() => onBuyPet(pet.id)}
                                disabled={!canAfford}
                                className={`
                                    w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all
                                    ${canAfford 
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25 active:scale-95 hover:brightness-110' 
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }
                                `}
                            >
                                <span>Mua ngay</span>
                                <span className="bg-black/10 px-1.5 py-0.5 rounded text-[10px]">${pet.price.toLocaleString()}</span>
                            </button>
                        ) : (
                           <div className="w-full py-2 rounded-xl bg-indigo-100 text-indigo-600 text-center text-xs font-bold border border-indigo-200 flex items-center justify-center gap-2">
                               <Sparkles className="w-3 h-3" /> Đã có trong kho
                           </div>
                        )}
                    </div>
                 )
             })}
         </div>
      )}
    </div>
  );
};

export default Shop;