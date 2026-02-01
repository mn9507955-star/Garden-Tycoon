
import React from 'react';
import { Sprout, Bot, Play, Settings, Trophy, User } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
  playerName?: string; // Optional prop to show existing name
  onShowLeaderboard?: () => void; // New prop
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, playerName, onShowLeaderboard }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#e0f2fe] flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/soil.png')] mix-blend-multiply pointer-events-none" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-200 rounded-full blur-[100px] opacity-50 animate-[float-up_10s_infinite_ease-in-out]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[100px] opacity-50 animate-[float-up_12s_infinite_ease-in-out_reverse]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-10 duration-700">
            <div className="relative mb-6 group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-cyan-300 blur-xl rounded-full opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border-2 border-white transform transition-transform group-hover:scale-105 duration-300">
                    <Bot className="w-16 h-16 text-indigo-500 animate-[bounce_3s_infinite]" />
                    <div className="w-[2px] h-12 bg-slate-200 rounded-full" />
                    <Sprout className="w-16 h-16 text-emerald-500 animate-[pulse_3s_infinite]" />
                </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight text-center drop-shadow-sm leading-tight">
                Garden <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Tycoon</span>
            </h1>
            <div className="flex items-center gap-2 mt-4 bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/50">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Web Edition v1.0</p>
            </div>
        </div>

        {/* Greeting Logic */}
        {playerName && (
            <div className="mb-8 animate-in fade-in zoom-in duration-500 delay-100">
                 <div className="bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-full flex items-center gap-2 shadow-sm">
                    <User className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-bold text-indigo-800">Xin chào, {playerName}!</span>
                 </div>
            </div>
        )}

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
           <button 
            onClick={onStart}
            className="group relative bg-white hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white text-slate-700 font-black text-xl py-6 px-8 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-2 border-white hover:border-transparent transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-4 overflow-hidden"
           >
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-12 h-12 bg-slate-100 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors">
                   <Play className="w-6 h-6 fill-current" />
               </div>
               <span className="tracking-wide">CHƠI NGAY</span>
           </button>

           <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={onShowLeaderboard}
                    className="bg-white/80 hover:bg-white text-slate-600 font-bold py-4 rounded-2xl border border-white hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
                >
                    <Trophy className="w-5 h-5" />
                    <span>Xếp hạng</span>
                </button>
                <button 
                    disabled
                    className="bg-white/60 text-slate-400 font-bold py-4 rounded-2xl border border-white flex items-center justify-center gap-2 cursor-not-allowed"
                >
                    <Settings className="w-5 h-5" />
                    <span>Cài đặt</span>
                </button>
           </div>
        </div>
        
        <p className="text-center text-[10px] text-slate-400 mt-12 font-medium">
            Tự động lưu tiến trình trên thiết bị này.
        </p>
      </div>
    </div>
  );
};

export default MainMenu;
