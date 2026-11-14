import React, { useState } from 'react';
import { CheckCircle2, Star, Award, Zap, Magnet, Lightbulb, Music } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireStarBurst } from '../../utils/confetti';

interface StationMatterProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
}

export const StationMatter: React.FC<StationMatterProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 11: Magnetic Force & Push/Pull ---
  const [magnetAnswers, setMagnetAnswers] = useState<Record<string, boolean>>({});
  const [motionAnswers, setMotionAnswers] = useState<Record<string, 'push' | 'pull'>>({});
  const [act11Done, setAct11Done] = useState(completedActivities.includes('matter_act11'));

  const magnetItems = [
    { id: 'clip', name: 'مشبك ورق معدني', icon: '📎', attracts: true },
    { id: 'bear', name: 'دب قماشي قطني', icon: '🧸', attracts: false },
    { id: 'key', name: 'مفتاح حديدي', icon: '🔑', attracts: true },
    { id: 'pencil', name: 'قلم رصاص خشبي', icon: '✏️', attracts: false },
  ];

  const motionItems: Array<{ id: string; name: string; target: 'push' | 'pull'; desc: string }> = [
    { id: 'kick', name: 'ركل كرة القدم ⚽', target: 'push', desc: 'إبعاد الشيء عنك' },
    { id: 'rope', name: 'سحب الحبل في اللعبة 🪢', target: 'pull', desc: 'تقريب الشيء نحوك' },
    { id: 'cart', name: 'دفع عربة التسوق للأمام 🛒', target: 'push', desc: 'إبعاد الشيء عنك' },
    { id: 'drawer', name: 'فتح درج المكتب نحوك 🗄️', target: 'pull', desc: 'تقريب الشيء نحوك' },
  ];

  const handleMagnetChoice = (itemId: string, choiceAttracts: boolean, actualAttracts: boolean) => {
    sounds.playClick();
    if (choiceAttracts === actualAttracts) {
      sounds.playSuccess();
      const updated = { ...magnetAnswers, [itemId]: choiceAttracts };
      setMagnetAnswers(updated);
      checkAct11Finished(updated, motionAnswers);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handleMotionChoice = (itemId: string, choice: 'push' | 'pull', target: 'push' | 'pull') => {
    sounds.playClick();
    if (choice === target) {
      sounds.playSuccess();
      const updated = { ...motionAnswers, [itemId]: choice };
      setMotionAnswers(updated);
      checkAct11Finished(magnetAnswers, updated);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const checkAct11Finished = (magMap: Record<string, boolean>, motMap: Record<string, string>) => {
    const magOk = Object.keys(magMap).length === magnetItems.length;
    const motOk = Object.keys(motMap).length === motionItems.length;
    if (magOk && motOk && !act11Done) {
      sounds.playStar();
      fireStarBurst();
      setAct11Done(true);
      onCompleteActivity('matter_act11', 3);
    }
  };

  // --- ACTIVITY 12: Light, Shadows & Sound ---
  const [lightClassifications, setLightClassifications] = useState<Record<string, 'natural' | 'artificial'>>({});
  const [flashlightDistance, setFlashlightDistance] = useState<number>(50);
  const [throatVibrating, setThroatVibrating] = useState<boolean>(false);
  const [act12Done, setAct12Done] = useState(completedActivities.includes('matter_act12'));

  const lightSources: Array<{ id: string; name: string; icon: string; type: 'natural' | 'artificial' }> = [
    { id: 'sun', name: 'الشمس الساطعة', icon: '☀️', type: 'natural' },
    { id: 'lamp', name: 'المصباح الكهربائي', icon: '💡', type: 'artificial' },
    { id: 'stars', name: 'النجوم في الفضاء', icon: '⭐', type: 'natural' },
    { id: 'candle', name: 'الشمعة المشتعلة', icon: '🕯️', type: 'artificial' },
    { id: 'lightning', name: 'البرق في السماء', icon: '⚡', type: 'natural' },
    { id: 'torch', name: 'كشاف الجيب اليدوي', icon: '🔦', type: 'artificial' },
  ];

  const handleLightSort = (srcId: string, choice: 'natural' | 'artificial', actualType: 'natural' | 'artificial') => {
    sounds.playClick();
    if (choice === actualType) {
      sounds.playSuccess();
      const updated = { ...lightClassifications, [srcId]: choice };
      setLightClassifications(updated);
      checkAct12Finished(updated, throatVibrating);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handleThroatTouch = () => {
    sounds.playSuccess();
    setThroatVibrating(true);
    checkAct12Finished(lightClassifications, true);
  };

  const checkAct12Finished = (lights: Record<string, string>, throatTested: boolean) => {
    const lightsOk = Object.keys(lights).length === lightSources.length;
    if (lightsOk && throatTested && !act12Done) {
      sounds.playStar();
      fireStarBurst();
      setAct12Done(true);
      onCompleteActivity('matter_act12', 3);
    }
  };

  const allCompleted = act11Done && act12Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-amber-100/70 p-2 rounded-3xl border-2 border-amber-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 11: قوة المغناطيس والدفع والسحب', done: act11Done },
            { id: 2, title: 'النشاط 12: عالم الضوء والظلال والأصوات', done: act12Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white text-amber-900 hover:bg-amber-50'
              }`}
            >
              <span>{tab.title}</span>
              {tab.done && <CheckCircle2 className="w-4 h-4 text-emerald-300 fill-emerald-500" />}
            </button>
          ))}
        </div>

        {allCompleted && (
          <button
            onClick={() => {
              sounds.playFanfare();
              onFinishStation();
            }}
            className="btn-squish px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 cursor-pointer animate-bounce-subtle"
          >
            <Award className="w-5 h-5" />
            <span>استلام شارة عالم المادة والعودة للخريطة!</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: MAGNET & PUSH/PULL --- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-amber-100 pb-3">
            <div>
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                صفحة (14) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (11): قوة المغناطيس السحرية وحركة الأجسام
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                اختبر المواد: هل تنجذب للمغناطيس؟ وميِّز بين قوة الدفع وقوة السحب!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Part A: Magnet testing cards (Page 14) */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Magnet className="w-5 h-5 text-rose-500" />
              <span>ضع علامة (🧲 ينجذب) أو (❌ لا ينجذب) أمام كل مادة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {magnetItems.map((item) => {
                const userAns = magnetAnswers[item.id];
                const isResolved = userAns !== undefined;
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-between gap-3 text-center transition ${
                      isResolved
                        ? 'bg-amber-50 border-amber-400'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="font-black text-sm text-slate-800">{item.name}</span>

                    <div className="flex gap-1.5 w-full">
                      <button
                        onClick={() => handleMagnetChoice(item.id, true, item.attracts)}
                        className={`btn-squish flex-1 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                          userAns === true
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        🧲 ينجذب
                      </button>
                      <button
                        onClick={() => handleMagnetChoice(item.id, false, item.attracts)}
                        className={`btn-squish flex-1 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                          userAns === false
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        ❌ لا
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Part B: Push (دفع) vs Pull (سحب) */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-3xl border-2 border-amber-200 space-y-3">
            <h4 className="font-black text-amber-950 text-sm md:text-base">
              قوى الحركة: الدَّفْع (Push) والسَّحْب (Pull) - اختر النوع الصحيح:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {motionItems.map((m) => {
                const userChoice = motionAnswers[m.id];
                return (
                  <div
                    key={m.id}
                    className="bg-white p-3.5 rounded-2xl border border-amber-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-black text-slate-800 text-sm">{m.name}</div>
                      <div className="text-[11px] text-slate-500 font-bold">{m.desc}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleMotionChoice(m.id, 'push', m.target)}
                        className={`btn-squish px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                          userChoice === 'push'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        قُوَّةُ دَفْع
                      </button>
                      <button
                        onClick={() => handleMotionChoice(m.id, 'pull', m.target)}
                        className={`btn-squish px-3 py-1 rounded-xl text-xs font-black cursor-pointer ${
                          userChoice === 'pull'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        قُوَّةُ سَحْب
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Magnet rule info from Nono (Page 14 footer) */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3.5 text-amber-900 font-bold text-xs md:text-sm flex items-center gap-2">
            <span className="text-2xl">🧲</span>
            <span>
              <strong>قاعدة المغناطيس:</strong> المغناطيس يجذب المعادن المصنوعة من الحديد، وله قطبان: شمالي (N) وجنوبي (S)!
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 2: LIGHT, SHADOWS & SOUND --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-amber-100 pb-3">
            <div>
              <span className="text-xs font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                صفحة (15) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (12): عالم الضوء، الظلال، والأصوات
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                اكتشف كيف يتكون الظل، وتعرّف على مصادر الضوء الطبيعية والصناعية وسر الصوت!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Shadow Theatre Simulator */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border-3 border-slate-700 space-y-3">
            <h4 className="font-black text-sm md:text-base text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>مسرح الظلال: كيف يتكون الظل؟</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              عندما يسقط الضوء على جسم معتم (لا يمرر الضوء)، يتكون خلفه <strong>ظل مظلم</strong> يشبه شكل الجسم!
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-between w-full max-w-md px-4">
                <span className="text-2xl animate-pulse">🔦 الكشاف</span>
                {/* Visual shadow scale based on distance slider */}
                <div className="flex items-center gap-8">
                  <span className="text-3xl">🧸 اللعبة</span>
                  {/* Projected Shadow */}
                  <div
                    className="bg-black/90 rounded-full border border-slate-700 transition-all duration-300 flex items-center justify-center text-slate-500 text-xs font-bold"
                    style={{
                      width: `${(100 - flashlightDistance) * 0.9 + 30}px`,
                      height: `${(100 - flashlightDistance) * 0.9 + 30}px`,
                      filter: 'blur(1px)',
                    }}
                  >
                    الظل
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="w-full max-w-sm flex items-center gap-3">
                <span className="text-xs text-slate-400 font-bold">قرّب الضوء</span>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={flashlightDistance}
                  onChange={(e) => setFlashlightDistance(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-xs text-slate-400 font-bold">أبعد الضوء</span>
              </div>
              <span className="text-xs font-bold text-amber-300">
                كلما اقتربت اليد أو الجسم من مصدر الضوء، أصبح الظل <strong>أكبر</strong>!
              </span>
            </div>
          </div>

          {/* Light Sources: Natural vs Artificial */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base">
              صنّف مصادر الضوء حولنا: (طبيعية من خلق الله ☀️) أو (صناعية صنعها الإنسان 💡):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lightSources.map((ls) => {
                const classified = lightClassifications[ls.id];
                return (
                  <div
                    key={ls.id}
                    className="p-3 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-between gap-2 text-center"
                  >
                    <span className="text-3xl">{ls.icon}</span>
                    <span className="font-black text-xs md:text-sm text-slate-800">{ls.name}</span>
                    <div className="flex gap-1 w-full">
                      <button
                        onClick={() => handleLightSort(ls.id, 'natural', ls.type)}
                        className={`btn-squish flex-1 py-1 rounded-xl text-[11px] font-black cursor-pointer ${
                          classified === 'natural'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        طبيعي 🌿
                      </button>
                      <button
                        onClick={() => handleLightSort(ls.id, 'artificial', ls.type)}
                        className={`btn-squish flex-1 py-1 rounded-xl text-[11px] font-black cursor-pointer ${
                          classified === 'artificial'
                            ? 'bg-amber-500 text-white'
                            : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                        }`}
                      >
                        صناعي 🛠️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice vibrations secret with Nono (Page 15) */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1">
              <h5 className="font-black text-purple-950 text-sm md:text-base flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                <span>سر الصوت مع نونو: الصوت ينتج عن الاهتزازات! 🎵</span>
              </h5>
              <p className="text-xs text-purple-800 font-semibold leading-relaxed">
                عندما تتكلم ضع يدك بلطف على حنجرتك.. ستشعر باهتزاز حبالك الصوتية!
              </p>
            </div>
            <button
              onClick={handleThroatTouch}
              className={`btn-squish px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm cursor-pointer shadow-md transition flex items-center gap-2 ${
                throatVibrating
                  ? 'bg-emerald-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              <span>{throatVibrating ? 'أحسست بالاهتزازات! ✔️' : 'جرّب اهتزاز الصوت الآن! 🗣️'}</span>
            </button>
          </div>

          {/* Footer achievement */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">⚡🧲</span>
            <div>
              <h5 className="font-black text-amber-900 text-sm md:text-base">
                مبارك يا بطل! جمعت شارة «عالم الطاقة والمادة الذكي»!
              </h5>
              <p className="text-xs text-amber-700 font-bold">
                أنت الآن جاهز للمحطة السادسة الكبرى: مختبر المستكشف والتحدي النهائي للشهادة!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
