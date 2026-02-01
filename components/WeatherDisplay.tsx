import React from 'react';
import { WeatherType, WeatherType as WT } from '../types';
import { WEATHER_EFFECTS } from '../constants';
import { CloudRain, Sun, Flame, Cloud, Zap, Sparkles, Rainbow, Star, Wind, Haze, Snowflake, Moon, Tornado, Rocket, Mountain, FlaskConical, CloudHail } from 'lucide-react';

interface WeatherDisplayProps {
  weather: WeatherType;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const info = WEATHER_EFFECTS[weather];

  const Icon = {
    'Sunny': Sun,
    'Rainy': CloudRain,
    'Heatwave': Flame,
    'Cloudy': Cloud,
    'Storm': Zap,
    'GoldenHour': Star,
    'DiamondSky': Sparkles,
    'Rainbow': Rainbow,
    'Windy': Wind,
    'Foggy': Haze,
    'Snowy': Snowflake,
    'Eclipse': Moon,
    'Sandstorm': Tornado,
    'MeteorShower': Rocket,
    'Aurora': Mountain,
    'AcidRain': FlaskConical,
    'Drought': Flame,
    'Blizzard': Snowflake,
    'Hailstorm': CloudHail
  }[weather];

  // Adjust text colors for Dark backgrounds
  const isDarkMode = ['DiamondSky', 'Eclipse', 'MeteorShower', 'Aurora', 'Blizzard'].includes(weather);
  const textColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const subTextColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';

  return (
    <div className={`
        relative flex items-center gap-3 px-4 py-2 rounded-2xl shadow-sm border border-black/5 overflow-hidden
        transition-colors duration-1000 ${info.bgClass}
    `}>
        <div className="p-2 bg-white/50 rounded-full shadow-inner animate-pulse z-10">
            <Icon className="w-6 h-6 text-slate-700" />
        </div>
        <div className="z-10">
            <div className={`text-xs font-bold uppercase tracking-wider opacity-60 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Weather</div>
            <div className={`font-bold leading-none ${textColor}`}>{weather === 'GoldenHour' ? 'Golden Hour' : weather}</div>
            <div className={`text-[10px] mt-0.5 leading-tight max-w-[120px] ${subTextColor}`}>{info.desc}</div>
        </div>

        {/* Rain Particle Effect */}
        {(weather === 'Rainy' || weather === 'Storm' || weather === 'AcidRain') && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`absolute w-0.5 rounded-full ${
                            weather === 'Storm' ? 'bg-slate-700 h-6' : 
                            weather === 'AcidRain' ? 'bg-lime-500 h-4' : 'bg-blue-500 h-4'
                        }`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 20}%`,
                            animation: `rain-fall ${weather === 'Storm' ? 0.3 : 0.8}s linear infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Hail Effect */}
        {weather === 'Hailstorm' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-2 h-2 bg-white rounded-full border border-blue-200 shadow-sm"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 20}%`,
                            animation: `hail-fall ${0.3 + Math.random() * 0.2}s linear infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Snow/Blizzard Particle Effect */}
        {(weather === 'Snowy' || weather === 'Blizzard') && (
             <div className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${weather === 'Blizzard' ? 'opacity-90' : 'opacity-60'}`}>
                {Array.from({ length: weather === 'Blizzard' ? 60 : 30 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-1 h-1 bg-white rounded-full blur-[0.5px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-${Math.random() * 20}%`,
                            animation: `snow-fall ${weather === 'Blizzard' ? 0.5 : (2 + Math.random() * 3)}s linear infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Fog Effect */}
        {weather === 'Foggy' && (
             <div className="absolute inset-0 pointer-events-none z-0 opacity-50 overflow-hidden">
                <div className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white to-transparent"
                     style={{ animation: 'fog-move 8s ease-in-out infinite' }}
                />
             </div>
        )}
        
        {/* Heat/Drought Effect */}
        {(weather === 'Heatwave' || weather === 'Drought') && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay bg-orange-500 animate-[heat-shimmer_2s_ease-in-out_infinite]" />
        )}

        {/* Eclipse Effect */}
        {weather === 'Eclipse' && (
             <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-black rounded-full shadow-[0_0_20px_2px_rgba(253,224,71,0.2)] opacity-20 pointer-events-none animate-[eclipse-pulse_4s_ease-in-out_infinite]" />
        )}
        
        {/* Sandstorm Effect */}
        {weather === 'Sandstorm' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-20 h-1 bg-amber-600 rounded-full blur-sm"
                        style={{
                            left: `-20%`,
                            top: `${Math.random() * 100}%`,
                            animation: `sand-move ${0.5 + Math.random()}s linear infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Meteor Shower Effect */}
        {weather === 'MeteorShower' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute w-10 h-0.5 bg-gradient-to-r from-transparent to-white rounded-full blur-[0.5px]"
                        style={{
                            left: `50%`,
                            top: `0%`,
                            animation: `meteor-shoot ${1 + Math.random() * 2}s ease-in infinite`,
                            animationDelay: `-${Math.random() * 5}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Aurora Effect */}
        {weather === 'Aurora' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 blur-xl mix-blend-screen"
                    style={{ backgroundSize: '200% 200%', animation: 'aurora-wave 6s ease-in-out infinite' }}
                />
             </div>
        )}

        {/* Golden Hour Particles */}
        {weather === 'GoldenHour' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute bg-yellow-400 w-1 h-1 rounded-full shadow-[0_0_4px_gold]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            bottom: `-${Math.random() * 20}%`,
                            animation: `float-up ${2 + Math.random()}s ease-in-out infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    />
                ))}
             </div>
        )}

        {/* Diamond Sky Particles */}
        {weather === 'DiamondSky' && (
             <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i} 
                        className="absolute text-cyan-200 text-[8px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${1 + Math.random()}s ease-in-out infinite`,
                            animationDelay: `-${Math.random()}s`
                        }}
                    >✦</div>
                ))}
             </div>
        )}
    </div>
  );
};

export default WeatherDisplay;