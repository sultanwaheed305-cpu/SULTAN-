import React from 'react';
import { Lock, CheckCircle2, ChevronLeft, Sparkles, Award } from 'lucide-react';
import { StationConfig, StationId } from '../types';
import { STATIONS } from '../data/gameData';
import { sounds } from '../utils/audio';

interface StationsMapProps {
  unlockedStations: StationId[];
  completedStations: StationId[];
  onSelectStation: (stationId: StationId) => void;
  earnedBadges: string[];
}

export const StationsMap: React.FC<StationsMapProps> = ({
  unlockedStations,
  completedStations,
  onSelectStation,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Map Header banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-5 md:p-6 text-white shadow-lg border-4 border-amber-200 relative overflow-hidden">
        <div className="absolute -top-6 -left-6 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🗺️</span>
              <h2 className="text-xl md:text-2xl font-black">
                خريطة العوالم العلمية الستة
              </h2>
            </div>
            <p className="text-amber-100 font-bold text-sm md:text-base">
              تتبع مسار مغامرتك وضع علامة (<span className="text-emerald-200">✔</span>) داخل الدائرة عند إتمام كل محطة علمية!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/30 text-sm font-black whitespace-nowrap">
            <span>المحطات المكتملة:</span>
            <span className="text-lg bg-white text-amber-700 px-2.5 py-0.5 rounded-xl shadow-sm">
              {completedStations.length} / {STATIONS.length}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 6 Stations styled like the PDF Map on page 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {STATIONS.map((station: StationConfig) => {
          const isUnlocked = unlockedStations.includes(station.id);
          const isCompleted = completedStations.includes(station.id);

          return (
            <div
              key={station.id}
              className={`relative rounded-3xl border-4 transition-all duration-300 flex flex-col justify-between p-5 shadow-md ${
                isCompleted
                  ? 'border-emerald-400 bg-emerald-50/90 hover:shadow-lg'
                  : isUnlocked
                  ? `${station.color.border} ${station.color.bg} hover:shadow-xl hover:-translate-y-1`
                  : 'border-slate-300 bg-slate-100/90 opacity-80'
              }`}
            >
              {/* Badge Preview pill at top */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-3xl filter drop-shadow">{station.icon}</span>

                <div className="flex items-center gap-1.5">
                  {isCompleted ? (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم الإنجاز!</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="flex items-center gap-1 bg-sky-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse-gentle">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>مفتوحة للعب</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-slate-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                      <Lock className="w-3.5 h-3.5" />
                      <span>مقفلة 🔒</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Station Content */}
              <div className="flex-1 space-y-2 mb-4">
                <h3 className="text-lg md:text-xl font-black text-slate-800">
                  {station.title}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-600 leading-relaxed">
                  {station.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2 py-1 rounded-xl w-fit">
                  <Award className="w-3.5 h-3.5" />
                  <span>{station.badgeTitle}</span>
                </div>
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectStation(station.id);
                  }}
                  className={`btn-squish w-full py-3 px-4 rounded-2xl font-black text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer shadow-md transition ${
                    isCompleted
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : `bg-gradient-to-r ${station.color.gradient} text-white hover:opacity-95`
                  }`}
                >
                  <span>{isCompleted ? 'مراجعة الأنشطة' : 'ابدأ المغامرة الآن'}</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-full py-2.5 px-3 rounded-2xl bg-slate-200 text-slate-600 text-xs font-bold text-center flex items-center justify-center gap-1.5 border border-slate-300">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>أكمل المحطة السابقة لفتح القفل 🔓</span>
                </div>
              )}

              {/* Achievement Checkmark Circle (Page 3 format) */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs font-extrabold text-slate-600">
                <span>تم الإنجاز:</span>
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-black ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-600 text-white'
                      : 'border-slate-400 bg-white text-slate-300'
                  }`}
                >
                  {isCompleted ? '✔' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Wise Tip from Nono (Page 3 bottom) */}
      <div className="bg-sky-50 border-2 border-sky-300 rounded-3xl p-4 flex items-center gap-3">
        <span className="text-3xl">💡</span>
        <p className="text-xs md:text-sm font-bold text-sky-900 leading-relaxed">
          <strong className="text-sky-700">نصيحة نونو الذكية:</strong> كل صفحة تنهيها بنجاح تمنحك نجوماً إضافية لتصل إلى شهادة التخرج في نهاية الكتاب!
        </p>
      </div>
    </div>
  );
};
