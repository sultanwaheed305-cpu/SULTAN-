import React, { useState } from 'react';
import { CheckCircle2, Star, Award, Droplets, CloudRain, Sun, Flame } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireStarBurst } from '../../utils/confetti';

interface StationWaterProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
}

export const StationWater: React.FC<StationWaterProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 7: States of Matter & Weather Clothing ---
  const [selectedStates, setSelectedStates] = useState<Record<string, string>>({});
  const [selectedWeather, setSelectedWeather] = useState<Record<string, string>>({});
  const [iceMelted, setIceMelted] = useState<boolean>(false);
  const [act7Done, setAct7Done] = useState(completedActivities.includes('water_act7'));

  const matterStates = [
    {
      id: 'solid',
      title: 'الحالة الصَّلْبَة (Solid)',
      icon: '🧊',
      desc: 'الماء عندما يتجمد يصبح جليداً قاسياً له شكل ثابت.',
      example: 'مُكَعَّبَات الثَّلْج',
    },
    {
      id: 'liquid',
      title: 'الحالة السَّائِلَة (Liquid)',
      icon: '💧',
      desc: 'الماء الذي نشربه ونسكبه، يتغير شكله بحسب الوعاء.',
      example: 'كُوب المَاء والعَصِير',
    },
    {
      id: 'gas',
      title: 'الحالة الغَازِيَّة (Gas)',
      icon: '♨️',
      desc: 'الماء عندما يسخن يتبخر ويتحول لبخار ماء يرتفع في الهواء.',
      example: 'بُخَار الشَّاي المُتَصَاعِد',
    },
  ];

  const weatherOptions = [
    {
      id: 'sunny',
      weather: 'طقس مشمس وحار ☀️',
      correctCloth: 'cotton',
      choices: [
        { id: 'cotton', label: 'ملابس قطنية خفيفة وقبعة 🧢' },
        { id: 'wool', label: 'معطف صوفي سميك وقفازات 🧤' },
      ],
    },
    {
      id: 'rainy',
      weather: 'طقس ممطر 🌧️',
      correctCloth: 'raincoat',
      choices: [
        { id: 'raincoat', label: 'معطف واقٍ من المطر ومظلة ☂️' },
        { id: 'swim', label: 'ملابس سباحة صيفية 🩳' },
      ],
    },
    {
      id: 'snowy',
      weather: 'طقس مثلج وبارد جداً ❄️',
      correctCloth: 'wool',
      choices: [
        { id: 'wool', label: 'معطف صوفي سميك وقفازات 🧤' },
        { id: 'tank', label: 'قميص صيفي بدون أكمام 🎽' },
      ],
    },
  ];

  const handleSelectCloth = (weatherId: string, clothId: string, isCorrect: boolean) => {
    sounds.playClick();
    if (isCorrect) {
      sounds.playSuccess();
      const updated = { ...selectedWeather, [weatherId]: clothId };
      setSelectedWeather(updated);
      checkAct7Finished(updated, iceMelted);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handleMeltIce = () => {
    sounds.playSuccess();
    setIceMelted(true);
    checkAct7Finished(selectedWeather, true);
  };

  const checkAct7Finished = (weatherMap: Record<string, string>, melted: boolean) => {
    if (Object.keys(weatherMap).length === 3 && melted && !act7Done) {
      sounds.playStar();
      fireStarBurst();
      setAct7Done(true);
      onCompleteActivity('water_act7', 3);
    }
  };

  // --- ACTIVITY 8: Water Cycle & Conservation ---
  const [cycleSequence, setCycleSequence] = useState<number[]>([]);
  const [habitsChecked, setHabitsChecked] = useState<Record<string, boolean>>({});
  const [act8Done, setAct8Done] = useState(completedActivities.includes('water_act8'));

  const cycleSteps = [
    {
      id: 1,
      title: '1. التَّبَخُّر ♨️☀️',
      desc: 'تسخن الشمس مياه البحر فيتبخر الماء للأعلى نحو السماء.',
      step: 1,
    },
    {
      id: 2,
      title: '2. التَّكَاثُف ☁️💨',
      desc: 'يبرد بخار الماء في طبقات الجو وتتكون الغيوم البيضاء.',
      step: 2,
    },
    {
      id: 3,
      title: '3. الهُطُول 🌧️❄️',
      desc: 'تثقل الغيوم بالقطرات وتسقط الأمطار أو الثلوج على الأرض.',
      step: 3,
    },
    {
      id: 4,
      title: '4. التَّجَمُّع 🌊🏞️',
      desc: 'تجري مياه الأمطار إلى الأنهار والبحار لتبدأ الرحلة من جديد!',
      step: 4,
    },
  ];

  const handleCycleClick = (stepNum: number) => {
    sounds.playClick();
    if (cycleSequence.includes(stepNum)) return;
    const nextSeq = [...cycleSequence, stepNum];
    setCycleSequence(nextSeq);

    if (nextSeq.length === 4) {
      const isCorrect = nextSeq.every((s, i) => s === i + 1);
      if (isCorrect) {
        sounds.playSuccess();
        checkAct8Finished(nextSeq, habitsChecked);
      } else {
        sounds.playGentleTryAgain();
        setTimeout(() => setCycleSequence([]), 800);
      }
    }
  };

  const handleToggleHabit = (habitId: string) => {
    sounds.playClick();
    const updated = { ...habitsChecked, [habitId]: !habitsChecked[habitId] };
    setHabitsChecked(updated);
    checkAct8Finished(cycleSequence, updated);
  };

  const checkAct8Finished = (seq: number[], habits: Record<string, boolean>) => {
    const seqOk = seq.length === 4 && seq.every((s, i) => s === i + 1);
    const habitsOk = habits['tap'] && habits['bucket'];
    if (seqOk && habitsOk && !act8Done) {
      sounds.playStar();
      fireStarBurst();
      setAct8Done(true);
      onCompleteActivity('water_act8', 3);
    }
  };

  const allCompleted = act7Done && act8Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-sky-100/70 p-2 rounded-3xl border-2 border-sky-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 7: حالات الماء والطقس', done: act7Done },
            { id: 2, title: 'النشاط 8: رحلة قطرة الماء وحفظها', done: act8Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white text-sky-900 hover:bg-sky-50'
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
            <span>استلام شارة حامي الماء والعودة للخريطة!</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: STATES OF MATTER & WEATHER --- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-sky-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-sky-100 pb-3">
            <div>
              <span className="text-xs font-black text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
                صفحة (10) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (7): حالات الماء الثلاث المدهشة
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تعرّف على حالات المادة: صلبة 🧊، سائلة 💧، غازية ♨️، وماذا نرتدي في كل طقس!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* 3 States of Matter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {matterStates.map((st) => (
              <div
                key={st.id}
                className="bg-sky-50/80 p-4 rounded-3xl border-2 border-sky-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{st.icon}</span>
                    <span className="text-xs font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded-lg">
                      {st.id.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-800 text-sm md:text-base mb-1">
                    {st.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed mb-3">
                    {st.desc}
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded-2xl border border-sky-200 text-xs font-extrabold text-sky-900 text-center">
                  مثال: {st.example}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Melting Ice Cube Experiment */}
          <div className="bg-gradient-to-r from-cyan-50 to-amber-50 p-4 rounded-3xl border-2 border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
                <span>🧊 ➔ 💧</span>
                <span>سؤال ذكاء: ماذا يحدث إذا وضعنا مكعب ثلج تحت أشعة الشمس؟</span>
              </h4>
              <p className="text-xs text-slate-600 font-bold">
                تحول المادة من الحالة الصلبة إلى الحالة السائلة عند تعرضها للحرارة!
              </p>
            </div>

            <button
              onClick={handleMeltIce}
              className={`btn-squish px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm cursor-pointer shadow-md transition flex items-center gap-2 ${
                iceMelted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <Sun className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{iceMelted ? 'ذاب الثلج وأصبح ماءً سائلاً! ✔️' : 'سلّط الشمس ليذوب الثلج!'}</span>
            </button>
          </div>

          {/* What to wear in this weather (Page 10) */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base">
              ماذا نرتدي في هذا الطقس؟ (اختر ووفّق الملابس المناسبة):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {weatherOptions.map((item) => {
                const chosen = selectedWeather[item.id];
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2.5"
                  >
                    <div className="font-black text-slate-800 text-sm text-center">
                      {item.weather}
                    </div>
                    <div className="space-y-1.5">
                      {item.choices.map((choice) => {
                        const isCorrect = choice.id === item.correctCloth;
                        const isSelected = chosen === choice.id;
                        return (
                          <button
                            key={choice.id}
                            onClick={() => handleSelectCloth(item.id, choice.id, isCorrect)}
                            className={`btn-squish w-full p-2 rounded-xl text-xs font-black text-right cursor-pointer border transition ${
                              isSelected
                                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-xs'
                                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{choice.label}</span>
                            {isSelected && <span className="float-left">✔️</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: WATER CYCLE & HERO HABITS --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-sky-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-sky-100 pb-3">
            <div>
              <span className="text-xs font-black text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
                صفحة (11) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (8): رحلة قطرة الماء (دورة الماء في الطبيعة)
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تتبّع الخطوات الأربع لرحلة قطرة الماء ورتّبها بالترتيب الصحيح!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Water Cycle Ribbon */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-700 text-sm">
                اضغط على خطوات دورة الماء بالترتيب (1 ➔ 2 ➔ 3 ➔ 4):
              </h4>
              <button
                onClick={() => {
                  sounds.playClick();
                  setCycleSequence([]);
                }}
                className="text-xs text-sky-700 underline font-bold cursor-pointer"
              >
                إعادة الترتيب
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cycleSteps.map((step) => {
                const orderIdx = cycleSequence.indexOf(step.step);
                const isSelected = orderIdx !== -1;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleCycleClick(step.step)}
                    className={`btn-squish p-4 rounded-3xl border-3 text-right flex flex-col justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-100 border-sky-500 text-sky-950 scale-102 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-sky-300 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-black text-sky-800">{step.title}</span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                            isSelected
                              ? 'bg-sky-600 text-white'
                              : 'border border-slate-300 bg-white text-slate-400'
                          }`}
                        >
                          {isSelected ? orderIdx + 1 : '?'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Water Hero Habits (Page 11) */}
          <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-5 rounded-3xl border-2 border-sky-300 space-y-3">
            <h4 className="font-black text-sky-950 text-sm md:text-base flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              <span>كيف نحافظ على الماء؟ (سلوكيات بطل الماء - اضغط للتعهد بها):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleToggleHabit('tap')}
                className={`btn-squish p-3.5 rounded-2xl border-2 text-right font-black text-xs md:text-sm flex items-center justify-between cursor-pointer transition ${
                  habitsChecked['tap']
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>🚰 أغلق صنبور الماء جيداً أثناء تنظيف أسناني بالفرشاة.</span>
                <span>{habitsChecked['tap'] ? '✔️ أتعهد' : '⚪'}</span>
              </button>

              <button
                onClick={() => handleToggleHabit('bucket')}
                className={`btn-squish p-3.5 rounded-2xl border-2 text-right font-black text-xs md:text-sm flex items-center justify-between cursor-pointer transition ${
                  habitsChecked['bucket']
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>🪣 أستخدم كوباً أو دلواً صغيراً عند غسيل الألعاب بدلاً من هدر الماء.</span>
                <span>{habitsChecked['bucket'] ? '✔️ أتعهد' : '⚪'}</span>
              </button>
            </div>
          </div>

          {/* Footer badge highlight */}
          <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🌈💧</span>
            <div>
              <h5 className="font-black text-sky-900 text-sm md:text-base">
                رائع جداً! استحققت وسام «صديق الماء وحامي البيئة»!
              </h5>
              <p className="text-xs text-sky-700 font-bold">
                أنت الآن جاهز للمحطة التالية: جسم الإنسان والحواس الخمس!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
