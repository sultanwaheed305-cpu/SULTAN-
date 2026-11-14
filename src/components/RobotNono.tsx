import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RobotNonoProps {
  message?: string;
  tip?: string;
  mood?: 'happy' | 'thinking' | 'celebrate' | 'talking';
  onTap?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const RobotNono: React.FC<RobotNonoProps> = ({
  message = 'مرحباً يا بطل العلوم! أنا صديقك الروبوت «نونو» مستعد لمغامرتنا!',
  tip,
  mood = 'happy',
  onTap,
  soundEnabled,
  onToggleSound,
}) => {
  const [bounce, setBounce] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const funQuotes = [
    'بيب بوب! عقلك عبقري يا بطل! 🌟',
    'العلوم ممتعة ومليئة بالأسرار المدهشة! 🔬',
    'أنت مستكشف حقيقي ورائع! 🚀',
    'استمر في الاستكشاف.. أنت عالم صغير مبدع! 💡',
  ];

  const handleRobotClick = () => {
    sounds.playClick();
    setBounce(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setBounce(false), 400);
    if (onTap) onTap();
  };

  const currentDisplayMessage =
    clickCount > 0 ? funQuotes[(clickCount - 1) % funQuotes.length] : message;

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-3 bg-white/95 backdrop-blur-sm p-4 rounded-3xl border-3 border-sky-300 shadow-md">
      {/* Robot Avatar */}
      <button
        onClick={handleRobotClick}
        title="اضغط على نونو لسماع تشجيع لطيف!"
        aria-label="الروبوت نونو"
        className={`relative group cursor-pointer focus:outline-none transition-transform duration-300 ${
          bounce ? 'scale-115 rotate-3' : 'hover:scale-105'
        }`}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-sky-400 to-blue-500 rounded-3xl border-3 border-white shadow-lg flex flex-col items-center justify-center p-1 relative overflow-hidden">
          {/* Antenna */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            <div className="w-1 h-3 bg-sky-600 -mt-1" />
          </div>

          {/* Robot Eyes visor */}
          <div className="w-12 h-6 md:w-14 md:h-7 bg-slate-900 rounded-xl flex items-center justify-around px-1.5 shadow-inner">
            <div
              className={`w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] transition-all ${
                mood === 'thinking' ? 'animate-pulse' : 'scale-100'
              }`}
            />
            <div
              className={`w-3.5 h-3.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] transition-all ${
                mood === 'thinking' ? 'animate-pulse' : 'scale-100'
              }`}
            />
          </div>

          {/* Robot Smile / Cheeks */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2 h-1 bg-pink-300 rounded-full opacity-80" />
            <div className="w-5 h-1.5 bg-white/90 rounded-full" />
            <div className="w-2 h-1 bg-pink-300 rounded-full opacity-80" />
          </div>

          {/* Badge */}
          <div className="absolute bottom-0.5 right-0.5 text-[10px] font-black text-white/80">
            🤖
          </div>
        </div>

        {/* Small badge name */}
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[11px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
          نونو
        </span>
      </button>

      {/* Speech Bubble */}
      <div className="flex-1 w-full text-right">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 text-sky-700 font-extrabold text-sm md:text-base">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>صديقك الروبوت نونو يقول:</span>
          </div>

          <button
            onClick={onToggleSound}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 transition cursor-pointer"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline font-bold">صوت مفعّل</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline font-bold">مكتوم</span>
              </>
            )}
          </button>
        </div>

        <p className="text-slate-800 font-bold text-sm md:text-base leading-relaxed">
          {currentDisplayMessage}
        </p>

        {tip && (
          <div className="mt-1.5 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1 text-xs md:text-sm text-amber-900 font-semibold flex items-center gap-2">
            <span className="text-base">💡</span>
            <span>{tip}</span>
          </div>
        )}
      </div>
    </div>
  );
};
