import React, { useState } from 'react';
import { CheckCircle2, Star, Award, Compass, Sun, Moon, ArrowLeft } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireStarBurst } from '../../utils/confetti';

interface StationSpaceProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
}

export const StationSpace: React.FC<StationSpaceProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 5: Solar System Planets & True/False ---
  const [orderedPlanets, setOrderedPlanets] = useState<number[]>([]);
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [act5Done, setAct5Done] = useState(completedActivities.includes('space_act5'));

  const planets = [
    { id: 1, name: 'عُطَارِد', color: 'bg-amber-300', emoji: '🟤', desc: 'الأقرب للشمس' },
    { id: 2, name: 'الزُّهْرَة', color: 'bg-orange-300', emoji: '🟡', desc: 'الأكثر حرارة ولمعاناً' },
    { id: 3, name: 'الأَرْض', color: 'bg-blue-400', emoji: '🌍', desc: 'كوكبنا الأزرق، موطن الحياة' },
    { id: 4, name: 'المِرِّيخ', color: 'bg-red-400', emoji: '🔴', desc: 'الكوكب الأحمر بصخوره' },
    { id: 5, name: 'المُشْتَرِي', color: 'bg-amber-500', emoji: '🟠', desc: 'أضخم الكواكب حجماً' },
    { id: 6, name: 'زُحَل', color: 'bg-yellow-400', emoji: '🪐', desc: 'صاحب الحلقات الذهبية' },
    { id: 7, name: 'أُورَانُوس', color: 'bg-cyan-300', emoji: '🔵', desc: 'الكوكب الجليدي' },
    { id: 8, name: 'نِبْتُون', color: 'bg-indigo-400', emoji: '🔷', desc: 'الأبعد والأكثر برودة' },
  ];

  const handlePlanetOrder = (planetId: number) => {
    sounds.playClick();
    if (orderedPlanets.includes(planetId)) return;
    const nextOrder = [...orderedPlanets, planetId];
    setOrderedPlanets(nextOrder);

    if (nextOrder.length === 8) {
      const isCorrect = nextOrder.every((p, idx) => p === idx + 1);
      if (isCorrect) {
        sounds.playSuccess();
        checkAct5Finished(nextOrder, tfAnswers);
      } else {
        sounds.playGentleTryAgain();
        setTimeout(() => setOrderedPlanets([]), 800);
      }
    }
  };

  const handleTfAnswer = (qIndex: number, userChoice: boolean) => {
    sounds.playClick();
    const updated = { ...tfAnswers, [qIndex]: userChoice };
    setTfAnswers(updated);
    checkAct5Finished(orderedPlanets, updated);
  };

  const checkAct5Finished = (planetsArr: number[], answers: Record<number, boolean>) => {
    // Correct answers: Q1 is TRUE, Q2 is FALSE, Q3 is TRUE
    const q1Ok = answers[1] === true;
    const q2Ok = answers[2] === false;
    const q3Ok = answers[3] === true;
    const planetsOk = planetsArr.length === 8 && planetsArr.every((p, i) => p === i + 1);

    if (q1Ok && q2Ok && q3Ok && planetsOk && !act5Done) {
      sounds.playStar();
      fireStarBurst();
      setAct5Done(true);
      onCompleteActivity('space_act5', 3);
    }
  };

  // --- ACTIVITY 6: Day & Night, Moon Phases, Astronaut Rescue ---
  const [moonMatches, setMoonMatches] = useState<Record<string, string>>({});
  const [selectedMoon, setSelectedMoon] = useState<string | null>(null);
  const [rescueStep, setRescueStep] = useState<number>(0);
  const [earthRotation, setEarthRotation] = useState<'day' | 'night'>('day');
  const [act6Done, setAct6Done] = useState(completedActivities.includes('space_act6'));

  const moonPhases = [
    { id: 'crescent', name: 'هِلاَلٌ', desc: '(في أول الشهر)', icon: '🌙' },
    { id: 'full', name: 'بَدْرٌ مُكْتَمِل', desc: '(في منتصف الشهر)', icon: '🌕' },
    { id: 'quarter', name: 'تَرْبِيع', desc: '(نصف القمر مضيء)', icon: '🌓' },
  ];

  const moonDefinitions = [
    { id: 'crescent_def', target: 'crescent', text: 'شكل الهلال الرقيق في بداية الشهر العربي' },
    { id: 'full_def', target: 'full', text: 'دائرة مضيئة كاملة في ليلة 14 من الشهر' },
    { id: 'quarter_def', target: 'quarter', text: 'نصف قرص القمر يضيء في السماء' },
  ];

  const handleMoonMatch = (moonId: string, targetId: string) => {
    sounds.playClick();
    const phase = moonPhases.find((m) => m.id === moonId);
    if (!phase) return;

    if (phase.id === targetId) {
      sounds.playSuccess();
      const newMatches = { ...moonMatches, [moonId]: targetId };
      setMoonMatches(newMatches);
      setSelectedMoon(null);
      checkAct6Finished(newMatches, rescueStep);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handleRescueAdvance = () => {
    sounds.playClick();
    if (rescueStep < 4) {
      const nextStep = rescueStep + 1;
      setRescueStep(nextStep);
      if (nextStep === 4) {
        sounds.playSuccess();
        checkAct6Finished(moonMatches, 4);
      }
    }
  };

  const checkAct6Finished = (matches: Record<string, string>, step: number) => {
    if (Object.keys(matches).length === 3 && step === 4 && !act6Done) {
      sounds.playStar();
      fireStarBurst();
      setAct6Done(true);
      onCompleteActivity('space_act6', 3);
    }
  };

  const allCompleted = act5Done && act6Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-indigo-100/70 p-2 rounded-3xl border-2 border-indigo-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 5: كواكب المجموعة الشمسية', done: act5Done },
            { id: 2, title: 'النشاط 6: الليل والنهار وأطوار القمر', done: act6Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50'
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
            <span>استلام شارة رائد الفضاء والعودة للخريطة!</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: SOLAR SYSTEM --- */}
      {activeTab === 1 && (
        <div className="bg-slate-900 text-white rounded-3xl p-5 md:p-7 border-3 border-indigo-500 shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle starry background effect */}
          <div className="absolute top-2 left-6 text-amber-200 text-xs animate-ping">✨</div>
          <div className="absolute bottom-8 right-12 text-blue-200 text-xs animate-ping" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute top-1/2 left-1/4 text-indigo-300 text-xs animate-pulse">⭐</div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-indigo-700 pb-3 relative z-10">
            <div>
              <span className="text-xs font-black text-indigo-300 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-700">
                صفحة (8) من الكتاب
              </span>
              <h3 className="text-xl font-black text-amber-300 mt-1">
                النشاط (5): كواكب مجموعتنا الشمسية المذهلة
              </h3>
              <p className="text-indigo-200 font-bold text-sm">
                الشمس هي المركز وجميع الكواكب تدور حولها في مدارات منتظمة!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-400 font-black bg-indigo-950 px-3 py-1.5 rounded-2xl border border-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Sun & Planets Ribbon */}
          <div className="bg-indigo-950/80 p-4 rounded-3xl border-2 border-indigo-700 relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm md:text-base text-amber-300 flex items-center gap-2">
                <span>☀️</span>
                <span>رتّب الكواكب الثمانية حسب قربها من الشمس (اضغط بالترتيب 1 إلى 8):</span>
              </h4>
              <button
                onClick={() => {
                  sounds.playClick();
                  setOrderedPlanets([]);
                }}
                className="text-xs text-indigo-300 underline font-bold cursor-pointer"
              >
                إعادة الترتيب
              </button>
            </div>

            {/* Orbit row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin">
              {/* Sun */}
              <div className="flex flex-col items-center shrink-0 bg-amber-500 text-slate-900 px-3 py-2 rounded-2xl font-black text-xs shadow-[0_0_15px_#f59e0b]">
                <span className="text-2xl animate-spin" style={{ animationDuration: '20s' }}>☀️</span>
                <span>الشَّمْس</span>
              </div>

              {/* 8 slots */}
              {planets.map((planet) => {
                const orderIdx = orderedPlanets.indexOf(planet.id);
                const isSelected = orderIdx !== -1;
                return (
                  <button
                    key={planet.id}
                    onClick={() => handlePlanetOrder(planet.id)}
                    className={`btn-squish shrink-0 flex flex-col items-center justify-between p-3 rounded-2xl border-2 transition cursor-pointer min-w-[85px] ${
                      isSelected
                        ? 'bg-indigo-800 border-amber-400 text-white shadow-lg scale-105'
                        : 'bg-indigo-900/60 border-indigo-700 hover:border-indigo-400 text-indigo-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{planet.emoji}</span>
                    <span className="text-xs font-black">{planet.name}</span>
                    <span
                      className={`mt-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950'
                          : 'border border-indigo-500 bg-indigo-950 text-indigo-400'
                      }`}
                    >
                      {isSelected ? orderIdx + 1 : '?'}
                    </span>
                  </button>
                );
              })}
            </div>
            {orderedPlanets.length === 8 && (
              <p className="text-emerald-300 font-black text-xs md:text-sm text-center">
                رائع! عُطارد، الزهرة، الأرض، المريخ، المشتري، زحل، أورانوس، نبتون! 🪐✨
              </p>
            )}
          </div>

          {/* Space True / False Test (Page 8) */}
          <div className="bg-indigo-950/90 p-4 rounded-3xl border-2 border-indigo-700 relative z-10 space-y-3">
            <h4 className="font-black text-sm md:text-base text-amber-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>اختبر معلوماتك الفضائية (ضع علامة ✔ أو ✖):</span>
            </h4>

            {[
              {
                id: 1,
                text: '1. كوكب الأرض هو الكوكب الوحيد المعروف الذي توجد فيه حياة وماء.',
                isCorrectTrue: true,
              },
              {
                id: 2,
                text: '2. كوكب المشتري هو أصغر كواكب المجموعة الشمسية حجماً.',
                isCorrectTrue: false,
                hint: '(هو أكبر الكواكب حجماً!)',
              },
              {
                id: 3,
                text: '3. كوكب المريخ يسمى الكوكب الأحمر بسبب لون صخوره وتربته.',
                isCorrectTrue: true,
              },
            ].map((q) => {
              const userAns = tfAnswers[q.id];
              const isResolved = userAns !== undefined;
              const isCorrect = userAns === q.isCorrectTrue;

              return (
                <div
                  key={q.id}
                  className={`p-3 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                    isResolved
                      ? isCorrect
                        ? 'bg-emerald-950/60 border-emerald-500'
                        : 'bg-rose-950/60 border-rose-500'
                      : 'bg-indigo-900/40 border-indigo-800'
                  }`}
                >
                  <p className="text-xs md:text-sm font-bold text-slate-100">
                    {q.text} {isResolved && !isCorrect && q.hint && <span className="text-rose-300 text-xs">{q.hint}</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTfAnswer(q.id, true)}
                      className={`btn-squish px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        userAns === true
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
                      }`}
                    >
                      صحيح ✔
                    </button>
                    <button
                      onClick={() => handleTfAnswer(q.id, false)}
                      className={`btn-squish px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer ${
                        userAns === false
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
                      }`}
                    >
                      خطأ ✖
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nono Space Fact (Page 8 footer) */}
          <div className="bg-indigo-900/60 border border-indigo-600 rounded-2xl p-3 text-indigo-100 font-bold text-xs md:text-sm flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span>
              <strong>معلومة نونو الفضائية:</strong> كوكب عطارد هو الأقرب للشمس، ونبتون هو الكوكب الأبعد والأكثر برودة!
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 2: DAY & NIGHT, MOON PHASES & RESCUE --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-indigo-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-indigo-100 pb-3">
            <div>
              <span className="text-xs font-black text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                صفحة (9) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (6): الليل والنهار وأطوار القمر
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                اكتشف كيف يحدث الليل والنهار، وتعرّف على أشكال القمر في السماء!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Day & Night Simulator */}
          <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 p-4 rounded-3xl border-2 border-indigo-200 space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
              <span>🌍</span>
              <span>كيف يحدث الليل والنهار؟ (اضغط لتدوير كوكب الأرض):</span>
            </h4>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-white/80 p-4 rounded-2xl border border-indigo-100">
              {/* Sun Source */}
              <div className="flex flex-col items-center">
                <Sun className="w-12 h-12 text-amber-500 animate-spin" style={{ animationDuration: '15s' }} />
                <span className="font-black text-xs text-amber-800 mt-1">الشمس الساطعة</span>
              </div>

              <ArrowLeft className="w-6 h-6 text-indigo-300 hidden sm:block" />

              {/* Earth Model */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setEarthRotation((prev) => (prev === 'day' ? 'night' : 'day'));
                }}
                className="btn-squish flex flex-col items-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-300 cursor-pointer"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md transition-all duration-500 ${
                    earthRotation === 'day'
                      ? 'bg-gradient-to-r from-sky-400 to-amber-200 ring-4 ring-amber-300'
                      : 'bg-gradient-to-r from-indigo-900 to-slate-800 ring-4 ring-indigo-400'
                  }`}
                >
                  🌍
                </div>
                <span className="text-xs font-black text-indigo-900 mt-2">
                  {earthRotation === 'day' ? '☀️ النصف المواجه للشمس: (نَهَارٌ)' : '🌙 النصف البعيد: (لَيْلٌ)'}
                </span>
                <span className="text-[11px] text-slate-500">اضغط لتدوير الأرض 24 ساعة</span>
              </button>

              <div className="text-xs text-slate-600 font-bold max-w-[200px] leading-relaxed">
                • تدور الأرض حول نفسها كل 24 ساعة.<br />
                • النصف المواجه للشمس: <strong>نَهَار</strong>.<br />
                • النصف البعيد عن الشمس: <strong>لَيْل</strong>.
              </div>
            </div>
          </div>

          {/* Moon Phases Matching */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base">
              صِل كل شكل باسمه الصحيح (اضغط على شكل القمر ثم وصفه):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Moon phase buttons */}
              <div className="space-y-2">
                {moonPhases.map((m) => {
                  const isMatched = !!moonMatches[m.id];
                  const isSelected = selectedMoon === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        if (!isMatched) {
                          sounds.playClick();
                          setSelectedMoon(m.id);
                        }
                      }}
                      disabled={isMatched}
                      className={`btn-squish w-full p-3 rounded-2xl border-2 flex items-center justify-between font-black cursor-pointer transition ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : isSelected
                          ? 'bg-amber-100 border-amber-500 text-amber-950'
                          : 'bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{m.icon}</span>
                        <span>{m.name}</span>
                        <span className="text-xs text-slate-500 font-normal">{m.desc}</span>
                      </div>
                      <span>{isMatched ? '✔️' : '⚪'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Definitions */}
              <div className="space-y-2">
                {moonDefinitions.map((def) => {
                  const isMatched = Object.values(moonMatches).includes(def.target);
                  return (
                    <button
                      key={def.id}
                      onClick={() => {
                        if (selectedMoon) {
                          handleMoonMatch(selectedMoon, def.target);
                        }
                      }}
                      className={`btn-squish w-full p-3 rounded-2xl border-2 text-right font-black text-xs md:text-sm cursor-pointer transition ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : selectedMoon
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 animate-pulse-gentle'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {def.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mini Astronaut Rescue Challenge (Page 9 footer) */}
          <div className="bg-indigo-50 border-2 border-indigo-300 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h5 className="font-black text-indigo-950 text-sm md:text-base flex items-center gap-2">
                <span>🚀</span>
                <span>تحدي رائد الفضاء: ساعد مركبة الفضاء في العودة لكوكب الأرض بأمان!</span>
              </h5>
              <span className="text-xs font-black text-indigo-700 bg-white px-2.5 py-1 rounded-xl">
                الخطوة {rescueStep} من 4
              </span>
            </div>

            {/* Path track */}
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-indigo-200">
              <div className={`p-2 rounded-xl font-black text-xs ${rescueStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                1. الفضاء 🌌
              </div>
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <div className={`p-2 rounded-xl font-black text-xs ${rescueStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                2. مدار زحل 🪐
              </div>
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <div className={`p-2 rounded-xl font-black text-xs ${rescueStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                3. مدار القمر 🌙
              </div>
              <ArrowLeft className="w-4 h-4 text-indigo-400" />
              <div className={`p-2 rounded-xl font-black text-xs ${rescueStep === 4 ? 'bg-emerald-600 text-white animate-bounce-subtle' : 'bg-slate-100 text-slate-500'}`}>
                4. وصول الأرض 🌍 🎉
              </div>
            </div>

            {rescueStep < 4 ? (
              <button
                onClick={handleRescueAdvance}
                className="btn-squish w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-2xl shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>وجّه المركبة خطوة للأمام نحو الأرض! 🚀</span>
              </button>
            ) : (
              <div className="p-2.5 bg-emerald-100 border border-emerald-400 rounded-2xl text-emerald-900 font-black text-xs md:text-sm text-center">
                تم الهبوط بنجاح على كوكب الأرض بأمان! مرحى يا رائد الفضاء الصغير! 🌟🎉
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
