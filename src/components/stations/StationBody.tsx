import React, { useState } from 'react';
import { CheckCircle2, Star, Award, HeartPulse, Sparkles, ShieldCheck } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireStarBurst } from '../../utils/confetti';

interface StationBodyProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
}

export const StationBody: React.FC<StationBodyProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 9: Five Senses ---
  const [selectedSense, setSelectedSense] = useState<string | null>(null);
  const [sensesMatches, setSensesMatches] = useState<Record<string, string>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [act9Done, setAct9Done] = useState(completedActivities.includes('body_act9'));

  const senses = [
    { id: 'sight', name: 'حَاسَّةُ البَصَر (العين)', icon: '👁️', target: 'rainbow' },
    { id: 'hearing', name: 'حَاسَّةُ السَّمْع (الأذن)', icon: '👂', target: 'birds' },
    { id: 'smell', name: 'حَاسَّةُ الشَّمّ (الأنف)', icon: '👃', target: 'flowers' },
    { id: 'taste', name: 'حَاسَّةُ التَّذَوُّق (اللسان)', icon: '👅', target: 'food' },
    { id: 'touch', name: 'حَاسَّةُ اللَّمْس (اليد/الجلد)', icon: '✋', target: 'texture' },
  ];

  const situations = [
    { id: 'rainbow', text: 'أَرَى بها ألوان قوس قزح والكتب 🌈📖' },
    { id: 'birds', text: 'أَسْمَعُ بها تغريد العصافير والأذان 🐦🔔' },
    { id: 'flowers', text: 'أَشُمُّ بها رائحة الأزهار والعطور 🌸💐' },
    { id: 'food', text: 'أُمَيِّزُ بها الطعم الحلو والمالح 🍯🍋' },
    { id: 'texture', text: 'أَشْعُرُ بها بالملمس الناعم والخشن 🧸🧶' },
  ];

  const handleMatchSense = (senseId: string, sitId: string) => {
    sounds.playClick();
    const item = senses.find((s) => s.id === senseId);
    if (!item) return;

    if (item.target === sitId) {
      sounds.playSuccess();
      const updated = { ...sensesMatches, [senseId]: sitId };
      setSensesMatches(updated);
      setSelectedSense(null);
      checkAct9Finished(updated, quizAnswers);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handleQuizAnswer = (qNum: number, choice: string) => {
    sounds.playClick();
    const updated = { ...quizAnswers, [qNum]: choice };
    setQuizAnswers(updated);
    if ((qNum === 1 && choice === 'hearing') || (qNum === 2 && choice === 'taste') || (qNum === 3 && choice === 'distance')) {
      sounds.playSuccess();
    } else {
      sounds.playGentleTryAgain();
    }
    checkAct9Finished(sensesMatches, updated);
  };

  const checkAct9Finished = (matches: Record<string, string>, answers: Record<number, string>) => {
    const matchesOk = Object.keys(matches).length === senses.length;
    const qOk = answers[1] === 'hearing' && answers[2] === 'taste' && answers[3] === 'distance';
    if (matchesOk && qOk && !act9Done) {
      sounds.playStar();
      fireStarBurst();
      setAct9Done(true);
      onCompleteActivity('body_act9', 3);
    }
  };

  // --- ACTIVITY 10: Healthy Plate & Handwashing ---
  const [washSteps, setWashSteps] = useState<number[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [isWashing, setIsWashing] = useState<boolean>(false);
  const [act10Done, setAct10Done] = useState(completedActivities.includes('body_act10'));

  const foodGroups = [
    { title: '🥗 الخضار والفواكه', desc: 'تعطينا الفيتامينات وتقوي مناعتنا ضد الأمراض!' },
    { title: '🥛 الحليب والألبان', desc: 'تبني عظامنا وأسناننا البيضاء القوية!' },
    { title: '🍗 البروتينات (لحم/بيض)', desc: 'تساعد عضلاتنا وأجسامنا على النمو الصحي!' },
    { title: '🍞 الحبوب والخبز', desc: 'تمد أجسامنا بالطاقة والنشاط للعب والتعلم!' },
  ];

  const washingSteps = [
    { id: 1, text: 'بَلِّل يديك بالماء النظيف 💧', step: 1 },
    { id: 2, text: 'ضَع الصابون وافرك جيداً لمدة 20 ثانية 🧼🫧', step: 2 },
    { id: 3, text: 'اشْطُف يديك بالماء النقي من الرغوة 🚰', step: 3 },
    { id: 4, text: 'جَفِّف يديك بمنشفة نظيفة وجافة 🧖‍♂️', step: 4 },
  ];

  const handleWashStepClick = (stepNum: number) => {
    sounds.playClick();
    if (washSteps.includes(stepNum)) return;
    const nextSteps = [...washSteps, stepNum];
    setWashSteps(nextSteps);

    if (nextSteps.length === 4) {
      const isCorrect = nextSteps.every((s, i) => s === i + 1);
      if (isCorrect) {
        sounds.playSuccess();
        checkAct10Finished(nextSteps, true);
      } else {
        sounds.playGentleTryAgain();
        setTimeout(() => setWashSteps([]), 800);
      }
    }
  };

  const handleStartWashTimer = () => {
    if (isWashing) return;
    sounds.playSuccess();
    setIsWashing(true);
    let sec = 20;
    setTimerSeconds(20);
    const interval = setInterval(() => {
      sec -= 1;
      setTimerSeconds(sec);
      if (sec <= 0) {
        clearInterval(interval);
        setIsWashing(false);
        sounds.playStar();
        fireStarBurst();
      }
    }, 100); // Accelerated enjoyable preview timer
  };

  const checkAct10Finished = (steps: number[], timerDone: boolean) => {
    const stepsOk = steps.length === 4 && steps.every((s, i) => s === i + 1);
    if (stepsOk && timerDone && !act10Done) {
      sounds.playStar();
      fireStarBurst();
      setAct10Done(true);
      onCompleteActivity('body_act10', 3);
    }
  };

  const allCompleted = act9Done && act10Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-rose-100/70 p-2 rounded-3xl border-2 border-rose-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 9: حواسي الخمس الرائعة', done: act9Done },
            { id: 2, title: 'النشاط 10: طبقي الصحي وغسل اليدين', done: act10Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-white text-rose-900 hover:bg-rose-50'
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
            <span>استلام شارة خبير الصحة والعودة للخريطة!</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: FIVE SENSES --- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-rose-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-rose-100 pb-3">
            <div>
              <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                صفحة (12) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (9): حواسي الخمس الرائعة
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                صل كل حاسة بعضوها المسؤول والموقف المناسب لاستخدامها!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Senses Matching grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Senses */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-700 text-sm">اضغط على الحاسة:</h4>
              {senses.map((s) => {
                const isMatched = !!sensesMatches[s.id];
                const isSelected = selectedSense === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (!isMatched) {
                        sounds.playClick();
                        setSelectedSense(s.id);
                      }
                    }}
                    disabled={isMatched}
                    className={`btn-squish w-full p-3 rounded-2xl border-2 flex items-center justify-between font-black cursor-pointer transition ${
                      isMatched
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 text-amber-950 scale-102 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-rose-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{s.icon}</span>
                      <span>{s.name}</span>
                    </div>
                    <span>{isMatched ? '✔️' : '⚪'}</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Situations */}
            <div className="space-y-2">
              <h4 className="font-black text-slate-700 text-sm">الموقف المناسب:</h4>
              {situations.map((sit) => {
                const isMatched = Object.values(sensesMatches).includes(sit.id);
                return (
                  <button
                    key={sit.id}
                    onClick={() => {
                      if (selectedSense) {
                        handleMatchSense(selectedSense, sit.id);
                      }
                    }}
                    className={`btn-squish w-full p-3 rounded-2xl border-2 text-right font-black text-xs md:text-sm cursor-pointer transition ${
                      isMatched
                        ? 'bg-rose-50 border-rose-400 text-rose-950'
                        : selectedSense
                        ? 'bg-rose-50 border-rose-300 text-rose-950 animate-pulse-gentle'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {sit.text}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Senses Intelligence Quiz (Page 12) */}
          <div className="bg-rose-50/80 p-4 rounded-3xl border-2 border-rose-200 space-y-3">
            <h4 className="font-black text-rose-950 text-sm md:text-base flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <span>اختبر ذكاء حواسك:</span>
            </h4>

            {/* Q1 */}
            <div className="bg-white p-3 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-xs md:text-sm font-bold text-slate-800">
                1. عندما يدق جرس المدرسة، أي حاسة تستخدم؟
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuizAnswer(1, 'hearing')}
                  className={`btn-squish px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    quizAnswers[1] === 'hearing' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  👂 حاسة السمع ✔️
                </button>
                <button
                  onClick={() => handleQuizAnswer(1, 'taste')}
                  className={`btn-squish px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    quizAnswers[1] === 'taste' ? 'bg-rose-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  👅 التذوق
                </button>
              </div>
            </div>

            {/* Q2 */}
            <div className="bg-white p-3 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-xs md:text-sm font-bold text-slate-800">
                2. كيف تعرف أن الليمون حامض والعسل حلو؟
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuizAnswer(2, 'taste')}
                  className={`btn-squish px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    quizAnswers[2] === 'taste' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  👅 حاسة التذوق ✔️
                </button>
                <button
                  onClick={() => handleQuizAnswer(2, 'smell')}
                  className={`btn-squish px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                    quizAnswers[2] === 'smell' ? 'bg-rose-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  👃 الشم
                </button>
              </div>
            </div>

            {/* Q3 */}
            <div className="bg-white p-3 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-xs md:text-sm font-bold text-slate-800">
                3. كيف تحمي عينيك من الإجهاد والتعب؟
              </p>
              <button
                onClick={() => handleQuizAnswer(3, 'distance')}
                className={`btn-squish px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer ${
                  quizAnswers[3] === 'distance' ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                📱 عدم الجلوس قريباً جداً من الشاشات الإلكترونية ✔️
              </button>
            </div>
          </div>

          {/* Skeleton Info from Nono (Page 12 footer) */}
          <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-3.5 text-rose-900 font-bold text-xs md:text-sm flex items-center gap-2">
            <span className="text-2xl">🦴</span>
            <span>
              <strong>معلومة روبوت نونو:</strong> يمتلك الإنسان أكثر من 200 عظمة تشكّل الهيكل العظمي لتحمي أعضاءنا الداخلية وتساعدنا على المشي والركض!
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 2: HEALTHY PLATE & HANDWASHING --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-rose-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-rose-100 pb-3">
            <div>
              <span className="text-xs font-black text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
                صفحة (13) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (10): طبقي الصحي وخطوات النظافة
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تعرّف على مجموعات الغذاء الصحي ورتّب الخطوات السحرية لغسل اليدين!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Healthy Food Groups Spotlight */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
              <span>🥗</span>
              <span>مجموعات الغذاء الصحي المتوازن (بطلك لبناء الجسم):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {foodGroups.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/70 p-3.5 rounded-2xl border-2 border-emerald-200 flex flex-col justify-between"
                >
                  <div className="font-black text-emerald-950 text-sm mb-1">{group.title}</div>
                  <p className="text-xs text-emerald-800 font-semibold leading-relaxed">
                    {group.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Magical Handwashing 4 Steps (Page 13) */}
          <div className="bg-sky-50/80 p-5 rounded-3xl border-2 border-sky-300 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-black text-sky-950 text-sm md:text-base flex items-center gap-2">
                  <span>🫧</span>
                  <span>خطوات غسل اليدين السحرية (رتّب 1 - 4):</span>
                </h4>
                <p className="text-xs text-slate-600 font-bold">
                  اضغط على الخطوات بالتسلسل الصحيح للحفاظ على النظافة!
                </p>
              </div>

              {/* 20 seconds fun lather timer */}
              <button
                onClick={handleStartWashTimer}
                disabled={isWashing}
                className="btn-squish px-3.5 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>🧼 افرك الرغوة 20 ثانية!</span>
                {isWashing && <span className="bg-white text-sky-700 px-1.5 rounded">{timerSeconds}ث</span>}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {washingSteps.map((step) => {
                const orderIdx = washSteps.indexOf(step.step);
                const isSelected = orderIdx !== -1;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleWashStepClick(step.step)}
                    className={`btn-squish p-3.5 rounded-2xl border-2 text-right flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-sky-100 border-sky-500 text-sky-950 scale-102 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-sky-300 text-slate-800'
                    }`}
                  >
                    <span className="text-xs md:text-sm font-black">{step.text}</span>
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'bg-sky-600 text-white'
                          : 'border border-slate-300 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {isSelected ? orderIdx + 1 : '?'}
                    </span>
                  </button>
                );
              })}
            </div>
            {washSteps.length === 4 && (
              <p className="text-center font-black text-xs md:text-sm text-emerald-700">
                يدان نظيفتان = صحة وبطولة! أحسنت يا بطل النظافة والصحة! 🧼✨
              </p>
            )}
          </div>

          {/* Footer achievement badge */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🧠🍎</span>
            <div>
              <h5 className="font-black text-rose-900 text-sm md:text-base">
                تهانينا! أتممت قسم صحة الإنسان وحصلت على شارة «خبير الصحة والحواس الذكية»!
              </h5>
              <p className="text-xs text-rose-700 font-bold">
                أنت الآن جاهز للمحطة التالية: عالم المادة والطاقة وقوة المغناطيس!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
