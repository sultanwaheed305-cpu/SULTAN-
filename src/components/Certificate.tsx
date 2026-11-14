import React, { useState } from 'react';
import { Trophy, Printer, ArrowRight, Sparkles, Award } from 'lucide-react';
import { PlayerProfile } from '../types';
import { sounds } from '../utils/audio';

interface CertificateProps {
  profile: PlayerProfile;
  totalStars: number;
  completedStationsCount: number;
  onBack: () => void;
  onUpdateName: (name: string) => void;
}

export const Certificate: React.FC<CertificateProps> = ({
  profile,
  totalStars,
  completedStationsCount,
  onBack,
  onUpdateName,
}) => {
  const [childName, setChildName] = useState(profile.name || 'عالم العلوم الصغير');
  const [signature, setSignature] = useState('المعلم / ولي الأمر المفتخر');
  const [dateStr, setDateStr] = useState(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));

  const handlePrint = () => {
    sounds.playFanfare();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top action bar (hidden during print) */}
      <div className="no-print bg-white p-4 rounded-3xl border-2 border-amber-300 shadow-md flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="btn-squish flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-sm cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى اللعبة</span>
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={childName}
            onChange={(e) => {
              setChildName(e.target.value);
              onUpdateName(e.target.value);
            }}
            placeholder="اكتب اسم البطل هنا..."
            className="px-3.5 py-1.5 rounded-xl border-2 border-amber-300 font-black text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
          />

          <button
            onClick={handlePrint}
            className="btn-squish px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md cursor-pointer flex items-center gap-2 animate-bounce-subtle"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة الشهادة (A4 بالعرض) 🖨️</span>
          </button>
        </div>
      </div>

      {/* The Printable A4 Landscape Certificate Container (Page 21) */}
      <div className="flex justify-center overflow-x-auto pb-4">
        <div
          id="certificate-sheet"
          className="print-page bg-gradient-to-br from-amber-50 via-white to-amber-50/50 w-full max-w-[950px] aspect-[1.414/1] p-6 sm:p-10 rounded-3xl border-8 border-amber-400 shadow-2xl relative flex flex-col justify-between text-center overflow-hidden"
          style={{ minHeight: '560px' }}
        >
          {/* Ornate corner frames */}
          <div className="absolute top-3 left-3 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-3 right-3 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none" />

          {/* Inner golden border */}
          <div className="absolute inset-4 border-2 border-dashed border-amber-300 rounded-2xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1 relative z-10 pt-2">
            <div className="flex items-center justify-center gap-3 text-amber-500 text-lg">
              <span>🎓</span>
              <span>⭐</span>
              <span>🔬</span>
              <span>⭐</span>
              <span>🎓</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-amber-900 tracking-wide drop-shadow-xs">
              شَهَادَةُ تَمَيُّزٍ وَتَخَرُّجٍ عِلْمِيَّة
            </h1>
            <h2 className="text-sm sm:text-lg font-black text-amber-700">
              نَشَاطَاتُ كِتَابِ «مُغَامَرَاتِ عَالِمِ العُلُومِ الصَّغِير»
            </h2>
          </div>

          {/* Body Content */}
          <div className="space-y-3 relative z-10 my-auto py-2">
            <p className="text-xs sm:text-base font-extrabold text-slate-700">
              بِكُلِّ فَخْرٍ وَاعْتِزَازٍ، نَشْهَدُ بِأَنَّ البَطَلَ العَبْقَرِيَّ الصَّغِير:
            </p>

            {/* Child's name banner */}
            <div className="my-2 py-1 px-6 border-b-4 border-amber-400 inline-block min-w-[280px]">
              <span className="text-xl sm:text-3xl font-black text-indigo-900 font-['Alexandria',sans-serif]">
                {childName}
              </span>
            </div>

            <p className="text-xs sm:text-sm md:text-base font-bold text-slate-700 max-w-2xl mx-auto leading-relaxed">
              قَدْ أَتَمَّ بِنَجَاحٍ وَشَغَفٍ جَمِيعَ مُهِمَّاتِ وَأَلْغَازِ وَتَجَارِبِ كِتَابِ العُلُومِ التَّفَاعُلِيِّ، وَأَظْهَرَ فُضُولاً عِلْمِيّاً رَائِعاً فِي اسْتِكْشَافِ الكَوْنِ وَالكَائِنَاتِ، وَاسْتَحَقَّ بِجَدَارَةٍ لَقَبَ:
            </p>

            {/* Golden Title Badge */}
            <div className="inline-block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black px-6 py-2 rounded-2xl shadow-md border-2 border-white text-base sm:text-xl">
              ⭐ عَالِمُ العُلُومِ الصَّغِيرُ المُبْدِع ⭐
            </div>
          </div>

          {/* Footer Seals & Signatures */}
          <div className="grid grid-cols-3 items-end pt-3 relative z-10 border-t border-amber-200">
            {/* Signature */}
            <div className="text-right space-y-1">
              <span className="text-xs font-black text-slate-600 block">
                تَوْقِيعُ المُرْشِد / وَلِيّ الأَمْر:
              </span>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                className="bg-transparent border-b border-slate-400 text-xs sm:text-sm font-bold text-slate-800 w-full focus:outline-none"
              />
            </div>

            {/* Golden Star Seal in Center */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white shadow-lg flex flex-col items-center justify-center p-1 relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl">⭐</span>
                  <span className="text-[9px] sm:text-[10px] font-black text-amber-950 leading-none">
                    خَتْمُ التَّفَوُّق
                  </span>
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="text-left space-y-1">
              <span className="text-xs font-black text-slate-600 block">
                تَارِيخُ الإِنْجَاز:
              </span>
              <input
                type="text"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="bg-transparent border-b border-slate-400 text-xs sm:text-sm font-bold text-slate-800 w-full text-left focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
