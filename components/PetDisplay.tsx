
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
  // Safety Check: Ensure equippedPet exists AND is valid in PETS
  if (!equippedPet || !PETS[equippedPet]) return null;

  const pet = PETS[equippedPet];
  const isActive = activeTimer > 0;
  
  // Kích thước mới: w-14 (56px) thay vì w-20 (80px)
  // Center: 28, Radius: 24
  // Chu vi = 2 * PI * 24 ≈ 151
  const maxActive = pet.activeDuration;
  const maxCooldown = pet.baseCooldown;
  const CIRCUMFERENCE = 151;
  
  const activeProgress = (activeTimer / maxActive) * 100;
  const cooldownProgress = Math.max(0, Math.min(100, (1 - cooldownTimer / maxCooldown) * 100));

  return (
    // Changed position to bottom-24 to align with Assistant button height and leave room for toolbar
    <div className="fixed bottom-24 left-4 z-40 animate-in slide-in-from-left-10 fade-in duration-500">
        <div className="relative group flex items-center gap-3">
            {/* Main Pet Circle (Kích thước nhỏ hơn: w-14 h-14) */}
            <div className={`
                relative w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl overflow-hidden transition-all duration-300
                ${isActive ? 'scale-110 border-2 border-yellow-400 bg-yellow-50' : 'border-2 border-white bg-white grayscale-[0.2]'}
            `}>
                {/* Hiệu ứng Active */}
                {isActive && (
                    <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0" />
                )}

                {/* Icon Pet */}
                <div className={`relative z-10 ${isActive ? 'animate-bounce' : ''}`}>
                    {pet.emoji}
                </div>
                
                {/* Vòng tròn thời gian Active */}
                {isActive && (
                     <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none">
                        <circle
                            cx="28" cy="28" r="24"
                            fill="none" stroke="#eab308" strokeWidth="3"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={CIRCUMFERENCE - (CIRCUMFERENCE * activeProgress) / 100}
                            className="transition-all duration-1000 ease-linear"
                        />
                     </svg>
                )}

                {/* Thời gian hồi chiêu (Lớp phủ xám) */}
                {!isActive && cooldownTimer > 0 && (
                     <div 
                        className="absolute inset-0 bg-slate-900/60 z-20 transition-all duration-1000 ease-linear flex items-center justify-center text-white font-bold text-[10px]"
                        style={{ clipPath: `inset(0 0 ${cooldownProgress}% 0)` }}
                     >
                        <span className="drop-shadow-md">{cooldownTimer}s</span>
                     </div>
                )}
            </div>

            {/* Thông báo trạng thái nhỏ gọn bên cạnh */}
            <div className={`
                flex flex-col bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-md border border-white/50 transition-all duration-300
                ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 pointer-events-none absolute left-full ml-2'}
            `}>
                {isActive ? (
                    <>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 uppercase tracking-wider">
                            <Sparkles className="w-2 h-2 animate-spin-slow" />
                            Đang chạy!
                        </div>
                        <div className="font-bold text-slate-800 text-xs">{pet.name}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{activeTimer}s</div>
                    </>
                ) : null}
            </div>

            {/* Badge "Sẵn sàng" */}
            {!isActive && cooldownTimer === 0 && (
                 <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-bounce z-50 border border-white">
                    READY
                 </div>
            )}
            
            {/* Badge Năng lượng */}
            {isActive && (
                 <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg z-50 flex items-center gap-0.5 border border-white">
                    <Zap className="w-2 h-2" />
                 </div>
            )}

            {/* Tooltip khi di chuột vào (trên PC) hoặc nhấn giữ */}
             <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900/95 text-white p-2.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none translate-x-2 group-hover:translate-x-0 shadow-xl border border-white/10">
                <div className="font-bold text-yellow-400 text-xs mb-0.5">{pet.name}</div>
                <div className="opacity-90 text-[10px] leading-tight max-w-[150px] whitespace-normal">{pet.description}</div>
                <div className="mt-1.5 flex gap-2 text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1.5">
                    <span className="flex items-center gap-1"><Zap className="w-2.5 h-2.5"/> {pet.activeDuration}s</span>
                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5"/> {pet.baseCooldown}s CD</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PetDisplay;
