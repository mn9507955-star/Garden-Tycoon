import React from 'react';
import { PetId } from '../types';
import { PETS } from '../constants';
import { Zap, Clock, Sparkles } from 'lucide-react';

interface PetDisplayProps {
  equippedPet: PetId | null;
  cooldownTimer: number;
  activeTimer: number;
}

const PetDisplay: React.FC<PetDisplayProps> = ({ equippedPet, cooldownTimer, activeTimer }) => {
  if (!equippedPet) return null;

  const pet = PETS[equippedPet];
  const isActive = activeTimer > 0;
  
  // Calculate progress for active state (going down) or cooldown state (going up to ready)
  const maxActive = pet.activeDuration;
  const maxCooldown = pet.baseCooldown;
  
  const activeProgress = (activeTimer / maxActive) * 100;
  const cooldownProgress = Math.max(0, Math.min(100, (1 - cooldownTimer / maxCooldown) * 100));

  return (
    <div className="fixed bottom-32 left-4 z-40 animate-in slide-in-from-left-10 fade-in duration-500">
        <div className="relative group flex items-center gap-4">
            {/* Main Pet Circle */}
            <div className={`
                relative w-20 h-20 rounded-full shadow-2xl flex items-center justify-center text-4xl overflow-hidden transition-all duration-300
                ${isActive ? 'scale-110 border-4 border-yellow-400 bg-yellow-50' : 'border-4 border-white bg-white grayscale-[0.2]'}
            `}>
                {/* Active Glow/Pulse */}
                {isActive && (
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0" />
                )}

                {/* Pet Emoji */}
                <div className={`relative z-10 ${isActive ? 'animate-bounce' : ''}`}>
                    {pet.emoji}
                </div>
                
                {/* Circular Progress Overlay */}
                {/* Active State: Yellow ring depleting */}
                {isActive && (
                     <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
                        <circle
                            cx="40" cy="40" r="36"
                            fill="none" stroke="#eab308" strokeWidth="4"
                            strokeDasharray="226"
                            strokeDashoffset={226 - (226 * activeProgress) / 100}
                            className="transition-all duration-1000 ease-linear"
                        />
                     </svg>
                )}

                {/* Cooldown State: Gray overlay lifting */}
                {!isActive && cooldownTimer > 0 && (
                     <div 
                        className="absolute inset-0 bg-slate-900/60 z-20 transition-all duration-1000 ease-linear flex items-center justify-center text-white font-bold text-sm"
                        style={{ clipPath: `inset(0 0 ${cooldownProgress}% 0)` }}
                     >
                        <span className="drop-shadow-md">{cooldownTimer}s</span>
                     </div>
                )}
            </div>

            {/* Info Badge / Status Text */}
            <div className={`
                flex flex-col bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-white/50 transition-all duration-300
                ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 pointer-events-none absolute left-full ml-2'}
            `}>
                {isActive ? (
                    <>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 animate-spin-slow" />
                            Active!
                        </div>
                        <div className="font-bold text-slate-800 text-sm">{pet.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{activeTimer}s left</div>
                    </>
                ) : (
                    // Hover tooltip logic handled by parent usually, but simple state text here
                    null
                )}
            </div>

            {/* Cooldown "Ready" Badge when inactive and ready */}
            {!isActive && cooldownTimer === 0 && (
                 <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce z-50">
                    READY!
                 </div>
            )}
            
            {/* Active Ability Badge */}
            {isActive && (
                 <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-50 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    WORKING
                 </div>
            )}

            {/* Hover Tooltip (Always available) */}
             <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-xs p-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none translate-x-2 group-hover:translate-x-0">
                <div className="font-bold text-yellow-400 text-sm mb-1">{pet.name}</div>
                <div className="opacity-90">{pet.description}</div>
                <div className="mt-2 flex gap-2 text-[10px] font-mono text-slate-400 border-t border-white/10 pt-2">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> {pet.activeDuration}s Active</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {pet.baseCooldown}s CD</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PetDisplay;