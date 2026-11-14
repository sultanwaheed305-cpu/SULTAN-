import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, Star, Award, Heart } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sounds } from '../utils/audio';
import { fireStarBurst } from '../utils/confetti';

interface PlayerProfileModalProps {
  profile: PlayerProfile;
  onSaveProfile: (profile: PlayerProfile) => void;
  onClose: () => void;
  isInitialSetup?: boolean;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  profile,
  onSaveProfile,
  onClose,
  isInitialSetup = false,
}) => {
  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState<number>(profile.age || 7);
  const [level, setLevel] = useState(profile.level || 'المستكشف الصغير');
  const [pledged, setPledged] = useState(profile.safetyPledged || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playStar();
    fireStarBurst();
    onSaveProfile({
      name: name.trim() || 'المستكشف الصغير',
      age,
      level,
      safetyPledged: pledged,
      hasStarted: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border-4 border-sky-400 shadow-2xl p-5 sm:p-7 relative max-h-[90vh] overflow-y-auto space-y-5">
        {!isInitialSetup && (
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 left-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-16 h-16 bg-gradient-to-tr from-sky-400 to-blue-500 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-md border-3 border-white">
            🤖
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            {isInitialSetup
              ? 'مرحباً بك يا بطل العلوم في رحلتنا الاستكشافية!'
              : 'بطاقة العالم الصغير المبدع 👤'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            صديقك الآلي «نونو» يرحب بك ومستعد لمساعدتك في استكشاف أسرار الكون!
          </p>

          {isInitialSetup && (
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-black border border-amber-300 mt-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
              <span>مكافأة البداية: 3 نجوم ذهبية مجانية فورية! ⭐⭐⭐</span>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-700 mb-1">
              اسم البطل الصغير:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك هنا يا بطل (مثل: أحمد، سارة)..."
              className="w-full p-3 rounded-2xl border-2 border-slate-300 font-bold text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                العمر (6 إلى 8 سنوات):
              </label>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 rounded-2xl border-2 border-slate-300 font-bold text-sm bg-white focus:border-sky-500 focus:outline-none cursor-pointer"
              >
                <option value={6}>6 سنوات</option>
                <option value={7}>7 سنوات</option>
                <option value={8}>8 سنوات</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                المستوى:
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-3 rounded-2xl border-2 border-slate-300 font-bold text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Safety Pledge (Page 2) */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs md:text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <span>قواعد السلامة للمستكشف الصغير (تعهد الأمان):</span>
            </div>

            <ul className="text-xs text-amber-950 font-semibold space-y-1.5 list-disc list-inside leading-relaxed">
              <li>1. أطلب إذن ومساعدة الكبار قبل بدء أي تجربة عملية.</li>
              <li>2. أغسل يدي جيداً بالماء والصابون بعد كل استكشاف.</li>
              <li>3. لا ألمس المواد الساخنة أو الحادة بمفردي أبداً.</li>
            </ul>

            <label className="flex items-center gap-2 pt-2 border-t border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                checked={pledged}
                onChange={(e) => {
                  sounds.playClick();
                  setPledged(e.target.checked);
                }}
                className="w-4 h-4 accent-amber-600 rounded"
              />
              <span className="text-xs font-black text-slate-800">
                ✍️ أتعهد بأن أكون عالماً ذكياً ومحافظاً على السلامة دائماً!
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-squish w-full py-3.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl font-black text-sm md:text-base shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>{isInitialSetup ? 'ابدأ رحلة العلوم الآن مع نونو! 🚀' : 'حفظ التعديلات'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
