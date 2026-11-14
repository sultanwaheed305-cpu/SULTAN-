import React from 'react';
import { Star, Award, Map, User, Trophy, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/audio';
import { PlayerProfile } from '../types';

interface HeaderProps {
  stars: number;
  maxStars: number;
  profile: PlayerProfile;
  activeView: 'map' | 'station' | 'badges' | 'certificate';
  onNavigate: (view: 'map' | 'badges' | 'certificate') => void;
  onOpenProfile: () => void;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  maxStars,
  profile,
  activeView,
  onNavigate,
  onOpenProfile,
  onResetProgress,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-md px-3 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo / Title lockup */}
        <div
          onClick={() => {
            sounds.playClick();
            onNavigate('map');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white group-hover:scale-105 transition-transform">
            🔬
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-800 leading-tight">
              مغامرات عالم العلوم
            </h1>
            <span className="text-[11px] sm:text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full inline-block">
              للأبطال (6 - 8 سنوات)
            </span>
          </div>
        </div>

        {/* Stars counter */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-200 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-inner">
          <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-amber-400 animate-bounce-subtle" />
          <div className="text-right">
            <span className="text-xs text-amber-800 font-bold block sm:hidden">النجوم</span>
            <div className="text-sm sm:text-lg font-black text-amber-900 leading-none">
              {stars} <span className="text-xs text-amber-700 font-bold">/ {maxStars}</span>
            </div>
          </div>
        </div>

        {/* Nav cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Map button */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('map');
            }}
            className={`btn-squish flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 cursor-pointer transition ${
              activeView === 'map'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-300'
            }`}
          >
            <Map className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden md:inline">الخريطة</span>
          </button>

          {/* Badges button */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('badges');
            }}
            className={`btn-squish flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 cursor-pointer transition ${
              activeView === 'badges'
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            <span className="hidden md:inline">الشارات</span>
          </button>

          {/* Certificate button */}
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('certificate');
            }}
            className={`btn-squish flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm border-2 cursor-pointer transition ${
              activeView === 'certificate'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
            }`}
          >
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="hidden md:inline">الشهادة</span>
          </button>

          {/* Player profile */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenProfile();
            }}
            className="btn-squish flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 text-purple-800 border-2 border-purple-300 cursor-pointer"
            title="بطاقة العالم الصغير"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="max-w-[70px] sm:max-w-[100px] truncate">
              {profile.name || 'المستكشف'}
            </span>
          </button>

          {/* Quick reset button for replayability */}
          <button
            onClick={() => {
              if (window.confirm('هل تريد إعادة مغامرة العلوم من البداية وجمع النجوم مجدداً؟')) {
                sounds.playClick();
                onResetProgress();
              }
            }}
            className="p-1.5 sm:p-2 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition cursor-pointer"
            title="إعادة اللعب من البداية"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
