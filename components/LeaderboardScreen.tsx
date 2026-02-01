
import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, Coins, Crown, Medal, User } from 'lucide-react';
import { Rival } from '../types';

interface PlayerStats {
  name: string;
  money: number;
  level: number;
  isUser?: boolean;
}

interface LeaderboardScreenProps {
  currentPlayer: PlayerStats;
  rivals: Rival[]; // Updated prop to accept persistent rivals
  onClose: () => void;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ currentPlayer, rivals, onClose }) => {
  
  // Combine user with persistent rivals and sort
  const leaderboardData = useMemo(() => {
    // Convert Rivals to PlayerStats format for display
    const rivalStats: PlayerStats[] = rivals.map(r => ({
        name: r.name,
        money: r.money,
        level: r.level
    }));

    // Add current user
    const allPlayers = [...rivalStats, { ...currentPlayer, isUser: true }];

    // Sort by money descending
    return allPlayers.sort((a, b) => b.money - a.money);
  }, [currentPlayer.money, currentPlayer.level, currentPlayer.name, rivals]);

  // Find user rank
  const userRank = leaderboardData.findIndex(p => p.isUser) + 1;

  const getRankIcon = (rank: number) => {
      if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500 animate-bounce" />;
      if (rank === 2) return <Medal className="w-6 h-6 text-slate-400 fill-slate-400" />;
      if (rank === 3) return <Medal className="w-6 h-6 text-amber-700 fill-amber-700" />;
      return <span className="text-slate-500 font-black font-mono">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-[250] bg-[#e0f2fe] flex flex-col items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/soil.png')] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="bg-white rounded-t-[2.5rem] p-6 shadow-xl border-b border-slate-100 flex items-center justify-between">
              <button 
                  onClick={onClose}
                  className="bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition-colors"
              >
                  <ArrowLeft className="w-6 h-6 text-slate-600" />
              </button>
              
              <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                      <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                      Bảng Xếp Hạng
                  </h2>
                  <p className="text-xs text-slate-400 font-bold">Top Nông Dân Giàu Nhất</p>
              </div>

              <div className="w-12" /> {/* Spacer for centering */}
          </div>

          {/* List */}
          <div className="flex-1 bg-white/80 backdrop-blur-xl overflow-y-auto p-4 scrollbar-hide shadow-2xl border-x-2 border-white">
              <div className="flex flex-col gap-3">
                  {leaderboardData.slice(0, 100).map((player, index) => { // Limit display to top 100
                      const rank = index + 1;
                      const isUser = player.isUser;
                      
                      return (
                          <div 
                              key={index}
                              className={`
                                  flex items-center gap-4 p-4 rounded-3xl border-2 transition-all duration-300
                                  ${isUser 
                                      ? 'bg-indigo-50 border-indigo-500 shadow-lg scale-[1.02] z-10' 
                                      : 'bg-white border-transparent hover:border-slate-200 hover:shadow-md'
                                  }
                              `}
                          >
                              {/* Rank */}
                              <div className="w-10 flex justify-center items-center">
                                  {getRankIcon(rank)}
                              </div>

                              {/* Avatar */}
                              <div className={`
                                  relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-xl
                                  ${isUser ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}
                              `}>
                                  {isUser ? <User className="w-6 h-6" /> : player.name.charAt(0)}
                                  
                                  {/* Fake Online Indicator for some rivals */}
                                  {!isUser && Math.random() > 0.7 && (
                                     <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                                  )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                  <div className={`font-black truncate ${isUser ? 'text-indigo-700' : 'text-slate-700'}`}>
                                      {player.name} {isUser && '(Bạn)'}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                      <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                          Level {player.level}
                                      </div>
                                  </div>
                              </div>

                              {/* Money */}
                              <div className="text-right">
                                  <div className="font-black text-green-600 flex items-center justify-end gap-1">
                                      <Coins className="w-4 h-4 fill-green-600" />
                                      ${player.money.toLocaleString()}
                                  </div>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Footer - Your Rank Summary */}
          <div className="bg-white rounded-b-[2.5rem] p-6 shadow-xl border-t border-slate-100 z-20">
              <div className="flex items-center justify-between text-sm font-bold text-slate-600">
                  <span>Hạng của bạn:</span>
                  <span className="text-xl text-indigo-600 font-black">#{userRank}</span>
              </div>
              <div className="text-[10px] text-slate-400 text-center mt-2 italic">
                  *Dữ liệu được cập nhật theo thời gian thực (giả lập)
              </div>
          </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
