import React, { useEffect, useState } from 'react';
import { Bot, Sprout, CloudSun, CheckCircle2 } from 'lucide-react';

interface LoadingScreenProps {
  onFinished: () => void;
}

const TIPS = [
  "Mẹo: Tưới nước đúng lúc giúp cây lớn nhanh hơn!",
  "Mẹo: Pet Rồng Lửa có thể phun tiền, nhưng hãy cẩn thận Hạn Hán.",
  "Mẹo: Thời tiết Mưa Rào sẽ tự động tưới cây cho bạn.",
  "Mẹo: Đừng quên sử dụng Phân Bón khi cây sắp chín.",
  "Mẹo: Các biến thể cây (Vàng, Kim Cương) bán được rất nhiều tiền!",
  "Mẹo: Nâng cấp Pet để tối ưu hóa lợi nhuận.",
  "Đang khởi động hệ thống Robo...",
  "Đang tổng hợp dữ liệu hạt giống...",
  "Đang liên hệ với vệ tinh thời tiết..."
];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Randomize initial tip
    setTipIndex(Math.floor(Math.random() * TIPS.length));

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 500); // Small delay at 100%
          return 100;
        }
        // Non-linear progress for realism
        const increment = Math.random() * 15; 
        return Math.min(100, prev + increment);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        
        {/* Animated Logo Area */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-2xl flex items-center gap-4 animate-bounce">
             <Bot className="w-16 h-16 text-cyan-300 drop-shadow-lg" />
             <div className="h-12 w-1 bg-white/20 rounded-full" />
             <Sprout className="w-16 h-16 text-green-400 drop-shadow-lg" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black tracking-wider mb-2 drop-shadow-md text-center">
          GARDEN TYCOON
        </h1>
        <div className="text-sm font-bold tracking-[0.3em] uppercase opacity-80 mb-12">
          Tycoon Simulator
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-black/20 h-4 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 mb-4 shadow-inner relative">
           {/* Shimmer effect */}
           <div className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
           
           <div 
             className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300 ease-out relative z-10 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
             style={{ width: `${progress}%` }}
           />
        </div>

        {/* Percentage & Status */}
        <div className="flex justify-between w-full text-xs font-bold font-mono mb-8 opacity-90">
            <span className="flex items-center gap-2">
                {progress < 100 ? <CloudSun className="w-4 h-4 animate-pulse" /> : <CheckCircle2 className="w-4 h-4 text-green-300" />}
                {progress < 100 ? 'LOADING ASSETS...' : 'READY!'}
            </span>
            <span>{Math.floor(progress)}%</span>
        </div>

        {/* Tips Box */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 w-full border border-white/10 text-center min-h-[80px] flex items-center justify-center shadow-lg">
           <p className="text-sm font-medium leading-relaxed italic opacity-90">
             "{TIPS[tipIndex]}"
           </p>
        </div>

      </div>
      
      <div className="absolute bottom-4 text-[10px] opacity-40 font-mono">
        v1.0.2 • Powered by Gemini AI
      </div>
    </div>
  );
};

export default LoadingScreen;