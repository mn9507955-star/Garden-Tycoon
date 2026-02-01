
import React from 'react';
import { CellData } from '../types';
import { PLANTS, VARIANTS } from '../constants';
import { Droplets, Skull, Sparkles, Sprout } from 'lucide-react';

interface GardenCellProps {
  cell: CellData;
  onClick: (id: number) => void;
  isSelected: boolean;
}

const GardenCell: React.FC<GardenCellProps> = ({ cell, onClick, isSelected }) => {
  const plant = cell.plantId ? PLANTS[cell.plantId] : null;
  const isReady = cell.growthProgress >= 100;
  const isDry = cell.waterLevel < 30;
  const isWet = cell.waterLevel > 80;
  const variantInfo = VARIANTS[cell.variant || 'Normal'];

  // 3D Soil Styling
  // We use borders and shadows to create a "Block" look
  const soilBase = isWet 
    ? 'bg-[#5D4037] border-b-[#3E2723]' 
    : isDry 
        ? 'bg-[#D7CCC8] border-b-[#A1887F]' 
        : 'bg-[#8D6E63] border-b-[#5D4037]';

  // Variant Glows
  let glowEffect = '';
  if (plant && !cell.isDead) {
      switch (cell.variant) {
          case 'Golden': glowEffect = 'shadow-[0_0_25px_rgba(250,204,21,0.6)] ring-2 ring-yellow-400'; break;
          case 'Diamond': glowEffect = 'shadow-[0_0_25px_rgba(34,211,238,0.7)] ring-2 ring-cyan-400'; break;
          case 'Magma': glowEffect = 'shadow-[0_0_20px_rgba(234,88,12,0.6)] ring-2 ring-orange-500'; break;
          case 'Void': glowEffect = 'shadow-[0_0_25px_rgba(0,0,0,0.8)] ring-2 ring-slate-900 grayscale'; break;
          case 'Cosmic': glowEffect = 'shadow-[0_0_25px_rgba(99,102,241,0.8)] ring-2 ring-indigo-500'; break;
          default: glowEffect = 'shadow-sm';
      }
  }

  return (
    <button
      onClick={() => onClick(cell.id)}
      className={`
        relative w-full aspect-square rounded-3xl transition-all duration-100 group
        border-b-[8px] border-r-[2px] border-l-[2px] border-t-[1px]
        active:translate-y-[6px] active:border-b-[2px] active:shadow-none
        ${soilBase} ${glowEffect}
        ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-[#5D4037] scale-105 z-10' : ''}
        flex items-center justify-center flex-col overflow-visible
      `}
    >
      {/* Texture Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] rounded-2xl pointer-events-none" />

      {/* Water Indicator (Floating Bubble) */}
      {plant && !cell.isDead && (
        <div className="absolute top-2 right-2 z-20">
             {isDry && (
                <div className="animate-bounce bg-red-500 text-white rounded-full p-1 shadow-lg border border-white">
                    <Droplets className="w-3 h-3" />
                </div>
             )}
             {!isDry && (
                 <div className="w-1.5 h-10 bg-black/20 rounded-full overflow-hidden border border-white/20 backdrop-blur-sm">
                    <div 
                        className={`w-full absolute bottom-0 transition-all duration-500 ${isWet ? 'bg-blue-500' : 'bg-sky-300'}`}
                        style={{ height: `${cell.waterLevel}%` }}
                    />
                 </div>
             )}
        </div>
      )}

      {/* Variant Badge */}
      {plant && !cell.isDead && cell.variant !== 'Normal' && (
        <div className={`
            absolute -top-3 left-1/2 -translate-x-1/2 z-30 
            text-[9px] font-black uppercase tracking-wider 
            px-2 py-0.5 rounded-full shadow-lg border border-white
            ${variantInfo.color.replace('text-', 'bg-')}-500 text-white
        `}>
          {variantInfo.label}
        </div>
      )}

      {/* Plant Visualization */}
      <div className="relative z-10 transition-transform duration-300 transform group-active:scale-95">
        {cell.isDead ? (
             <Skull className="w-12 h-12 text-stone-600 drop-shadow-md opacity-80" />
        ) : plant ? (
            <div className={`
                text-6xl filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] select-none transition-all duration-500
                ${isReady ? 'animate-[float_3s_ease-in-out_infinite] scale-110' : ''}
            `}>
                <span style={{ 
                    fontSize: `${0.4 + (cell.growthProgress / 100) * 0.6}em`,
                    opacity: `${0.4 + (cell.growthProgress / 100) * 0.6}`,
                    filter: cell.variant === 'Void' ? 'grayscale(100%)' : 'none'
                }}>
                    {plant.emoji}
                </span>
            </div>
        ) : (
            <Sprout className="w-8 h-8 text-[#5D4037]/50" />
        )}
      </div>

      {/* Ready Sparkles */}
      {isReady && !cell.isDead && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
             <Sparkles className="w-20 h-20 text-yellow-300 opacity-50 animate-spin-slow" />
        </div>
      )}

      {/* Growth Bar (Circular or Bottom) */}
      {plant && !isReady && !cell.isDead && (
        <div className="absolute bottom-3 left-3 right-3 h-2.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 z-20">
          <div 
            className="h-full bg-gradient-to-r from-green-300 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-300 rounded-full"
            style={{ width: `${cell.growthProgress}%` }}
          />
        </div>
      )}
    </button>
  );
};

export default GardenCell;
