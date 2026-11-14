import React, { useState } from 'react';
import { X, Award, CheckCircle2, Lock, BookOpen, Star } from 'lucide-react';
import { BADGES_DATA } from '../data/gameData';
import { sounds } from '../utils/audio';

interface BadgesModalProps {
  unlockedBadges: string[];
  totalStars: number;
  onClose: () => void;
  onOpenCertificate: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  unlockedBadges,
  totalStars,
  onClose,
  onOpenCertificate,
}) => {
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border-4 border-amber-300 shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-5">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-black">
            <span>صفحة (20) من الكتاب</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>لوحة شارات الفخر ومفتاح الإنجازات</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            اجمع شاراتك الست واطّلع على تقدمك ونجومك التي جمعتها!
          </p>

          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-200 to-yellow-300 border-2 border-amber-400 px-4 py-1.5 rounded-2xl shadow-inner text-amber-950 font-black text-sm mt-2">
            <Star className="w-5 h-5 fill-amber-500 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>مجموع نجومي: {totalStars} من 60 نجمة ذهبية ⭐</span>
          </div>
        </div>

        {/* 6 Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {BADGES_DATA.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border-3 flex flex-col items-center text-center justify-between gap-2 transition ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-400 shadow-md scale-102'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white border-2 border-amber-200 shadow-inner flex items-center justify-center text-3xl">
                  {badge.icon}
                </div>
                <h4 className="font-black text-xs md:text-sm text-slate-800">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  {badge.description}
                </p>

                <div className="w-full mt-1">
                  {isUnlocked ? (
                    <span className="flex items-center justify-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-100 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>شارة مُكتسبة ✔️</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1 text-[11px] font-black text-slate-500 bg-slate-200 py-1 rounded-xl">
                      <Lock className="w-3.5 h-3.5" />
                      <span>مقفلة 🔒</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nono Pride Message (Page 20 footer) */}
        <div className="bg-sky-50 border-2 border-sky-300 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-1">
            <h5 className="font-black text-sky-950 text-sm flex items-center gap-1.5">
              <span>🤖</span>
              <span>رسالة فخر من نونو:</span>
            </h5>
            <p className="text-xs text-sky-800 font-semibold leading-relaxed">
              لقد أثبت أنك مستكشف حقيقي وذكي.. حان الآن وقت استلام شهادة تخرجك الكبرى!
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playFanfare();
              onOpenCertificate();
            }}
            className="btn-squish px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs md:text-sm shadow-md cursor-pointer whitespace-nowrap"
          >
            عرض الشهادة 🏆
          </button>
        </div>

        {/* Answer key toggle for parents & teachers */}
        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => {
              sounds.playClick();
              setShowAnswerKey(!showAnswerKey);
            }}
            className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{showAnswerKey ? 'إخفاء مفتاح الإجابات السريعة' : 'عرض مفتاح الإجابات السريعة (للوالدين والمعلمين)'}</span>
          </button>

          {showAnswerKey && (
            <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 font-semibold leading-relaxed space-y-1.5">
              <p>• <strong>نشاط 1 (البيئات):</strong> الجمل ➔ الصحراء، الدلفين ➔ البحر، القرد ➔ الغابة، البطريق ➔ الجليد.</p>
              <p>• <strong>نشاط 2 (التصنيف):</strong> الطيور (1، 7)، الثدييات (4، 8)، بحريات (2، 6)، حشرات (3، 5).</p>
              <p>• <strong>نشاط 3 (النبات):</strong> الترتيب الصحيح: (1) البذرة، (2) البرعم، (3) الشجيرة، (4) الشجرة المثمرة.</p>
              <p>• <strong>نشاط 4 (السلسلة):</strong> عشب ➔ جرادة ➔ ضفدع ➔ صقر.</p>
              <p>• <strong>نشاط 5 (الكواكب):</strong> الأرض كوكب الحياة (✔)، المشتري أصغر كوكب (✖)، المريخ أحمر (✔).</p>
              <p>• <strong>نشاط 7 (المغناطيس):</strong> ينجذب (مشبك الورق والمفتاح الحديدي)، لا ينجذب (الدب والقلم الخشبي).</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
