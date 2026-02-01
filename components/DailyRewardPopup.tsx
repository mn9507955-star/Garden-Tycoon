
import React from 'react';
import { DailyReward } from '../types';
import { DAILY_REWARDS, ITEMS, PLANTS } from '../constants';
import { Check, Lock, Gift, Coins, Package, Sprout } from 'lucide-react';

interface DailyRewardPopupProps {
  currentStreak: number;
  onClaim: () => void;
}

const DailyRewardPopup: React.FC<DailyRewardPopupProps> = ({ currentStreak, onClaim }) => {
  // Safe clamp streak to 1-7
  const dayIndex = Math.min(Math.max(1, currentStreak), 7) - 1; 

  const getRewardIcon = (reward: DailyReward) => {
    if (reward.type === 'money') return <Coins className="w-6 h-6 text-yellow-500" />;
    if (reward.type === 'item') {
        const item = ITEMS[reward.value as string];
        return <span className="text-xl">{item?.emoji || <Package className="w-6 h-6 text-blue-500"/>}</span>;
    }
    if (reward.type === 'seed') {
        const plant = PLANTS[reward.value as string];
        return <span className="text-xl">{plant?.emoji || <Sprout className="w-6 h-6 text-green-500"/>}</span>;
    }
    return <Gift className="w-6 h-6 text-purple-500" />;
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden border-4 border-white">
        
        {/* Background Burst */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg bg-yellow-100/50 blur-3xl -z-10 rounded-full animate-pulse" />

        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-2">
                <Gift className="w-8 h-8 text-indigo-500 animate-bounce" />
                Quà Đăng Nhập
            </h2>
            <p className="text-slate-500 font-bold mt-1">Chuỗi đăng nhập: <span className="text-indigo-600">{currentStreak} Ngày</span></p>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
            {DAILY_REWARDS.map((reward, index) => {
                const dayNum = index + 1;
                const isClaimed = dayNum < currentStreak;
                const isCurrent = dayNum === currentStreak;
                const isLocked = dayNum > currentStreak;

                return (
                    <div 
                        key={reward.day}
                        className={`
                            relative flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all aspect-[4/5]
                            ${isCurrent 
                                ? 'bg-gradient-to-b from-yellow-50 to-orange-50 border-yellow-400 scale-105 shadow-xl ring-4 ring-yellow-200 z-10' 
                                : isClaimed
                                    ? 'bg-slate-100 border-slate-200 opacity-80'
                                    : 'bg-white border-slate-100 opacity-60'
                            }
                        `}
                    >
                        {/* Day Label */}
                        <div className={`
                            text-[10px] font-black uppercase mb-2 px-2 py-0.5 rounded-full
                            ${isCurrent ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 text-slate-500'}
                        `}>
                            Ngày {reward.day}
                        </div>

                        {/* Icon */}
                        <div className={`
                            mb-2 transition-transform duration-300
                            ${isCurrent ? 'scale-125' : ''}
                        `}>
                            {getRewardIcon(reward)}
                        </div>

                        {/* Amount */}
                        <div className="text-[10px] font-bold text-center leading-tight text-slate-700">
                            {reward.type === 'money' ? `$${reward.count}` : `x${reward.count}`}
                        </div>

                        {/* Status Overlay */}
                        {isClaimed && (
                            <div className="absolute inset-0 bg-slate-900/10 rounded-xl flex items-center justify-center">
                                <div className="bg-green-500 text-white rounded-full p-1 shadow-sm">
                                    <Check className="w-4 h-4" />
                                </div>
                            </div>
                        )}
                        {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-slate-300" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

        {/* Reward Description (Current) */}
        <div className="text-center mb-6">
            <div className="inline-block bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2">
                <span className="text-slate-500 text-xs font-bold uppercase mr-2">Hôm nay bạn nhận được:</span>
                <span className="text-indigo-700 font-black">{DAILY_REWARDS[dayIndex]?.label}</span>
            </div>
        </div>

        {/* Claim Button */}
        <button 
            onClick={onClaim}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xl py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
        >
            NHẬN THƯỞNG
        </button>

      </div>
    </div>
  );
};

export default DailyRewardPopup;
