import React, { useState } from 'react';
import { CheckCircle2, Star, Award, FlaskConical, Sparkles, Trophy, Lightbulb } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireCelebrationConfetti, fireStarBurst } from '../../utils/confetti';

interface StationLabProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
  onOpenCertificate: () => void;
}

export const StationLab: React.FC<StationLabProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
  onOpenCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 13: Laboratory Experiments ---
  const [saltDissolved, setSaltDissolved] = useState<boolean>(false);
  const [sandSettled, setSandSettled] = useState<boolean>(false);
  const [seedWatered, setSeedWatered] = useState<boolean>(false);
  const [act13Done, setAct13Done] = useState(completedActivities.includes('lab_act13'));

  const handleStirSalt = () => {
    sounds.playSuccess();
    setSaltDissolved(true);
    checkAct13Finished(true, sandSettled, seedWatered);
  };

  const handleAddSand = () => {
    sounds.playSuccess();
    setSandSettled(true);
    checkAct13Finished(saltDissolved, true, seedWatered);
  };

  const handleWaterSeed = () => {
    sounds.playStar();
    fireStarBurst();
    setSeedWatered(true);
    checkAct13Finished(saltDissolved, sandSettled, true);
  };

  const checkAct13Finished = (salt: boolean, sand: boolean, seed: boolean) => {
    if (salt && sand && seed && !act13Done) {
      sounds.playStar();
      fireStarBurst();
      setAct13Done(true);
      onCompleteActivity('lab_act13', 3);
    }
  };

  // --- ACTIVITY 14: Game City & Pattern Puzzles ---
  const [oddAnswers, setOddAnswers] = useState<Record<string, string>>({});
  const [patternAnswers, setPatternAnswers] = useState<Record<number, string>>({});
  const [act14Done, setAct14Done] = useState(completedActivities.includes('lab_act14'));

  const oddGroups = [
    {
      id: 'groupA',
      title: 'المجموعة (أ)',
      correct: 'sheep',
      reason: 'الخروف (لأنه آكل عشب والبقية حيوانات مفترسة)',
      options: [
        { id: 'lion', label: 'أسد 🦁' },
        { id: 'tiger', label: 'نمر 🐯' },
        { id: 'wolf', label: 'ذئب 🐺' },
        { id: 'sheep', label: 'خروف 🐑' },
      ],
    },
    {
      id: 'groupB',
      title: 'المجموعة (ب)',
      correct: 'sun',
      reason: 'الشمس (لأنها نجم ملتهب والبقية كواكب تدور)',
      options: [
        { id: 'saturn', label: 'زحل 🪐' },
        { id: 'earth', label: 'الأرض 🌍' },
        { id: 'sun', label: 'الشمس ☀️' },
        { id: 'mars', label: 'المريخ 🔴' },
      ],
    },
    {
      id: 'groupC',
      title: 'المجموعة (ج)',
      correct: 'ice',
      reason: 'مكعب ثلج (لأنه صلب بينما البقية سوائل)',
      options: [
        { id: 'water', label: 'ماء 💧' },
        { id: 'juice', label: 'عصير 🧃' },
        { id: 'ice', label: 'مكعب ثلج 🧊' },
        { id: 'milk', label: 'حليب 🥛' },
      ],
    },
  ];

  const handleOddSelect = (groupId: string, optionId: string, correctId: string) => {
    sounds.playClick();
    if (optionId === correctId) {
      sounds.playSuccess();
      const updated = { ...oddAnswers, [groupId]: optionId };
      setOddAnswers(updated);
      checkAct14Finished(updated, patternAnswers);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const handlePatternSelect = (patternNum: number, choice: string, correct: string) => {
    sounds.playClick();
    if (choice === correct) {
      sounds.playSuccess();
      const updated = { ...patternAnswers, [patternNum]: choice };
      setPatternAnswers(updated);
      checkAct14Finished(oddAnswers, updated);
    } else {
      sounds.playGentleTryAgain();
    }
  };

  const checkAct14Finished = (odds: Record<string, string>, pats: Record<number, string>) => {
    const oddsOk = Object.keys(odds).length === 3;
    const patsOk = pats[1] === 'moon' && pats[2] === 'tree';
    if (oddsOk && patsOk && !act14Done) {
      sounds.playStar();
      fireStarBurst();
      setAct14Done(true);
      onCompleteActivity('lab_act14', 3);
    }
  };

  // --- ACTIVITY 15: Grand Champion Final Quiz (Page 19) ---
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [act15Done, setAct15Done] = useState(completedActivities.includes('lab_act15'));

  const finalQuestions = [
    {
      id: 1,
      text: '1. ما هو الجزء في النبات المسؤول عن امتصاص الماء من التربة؟',
      correct: 'roots',
      options: [
        { id: 'leaves', text: '(أ) الأوراق 🍃' },
        { id: 'roots', text: '(ب) الجُذُور 🌱' },
        { id: 'flowers', text: '(ج) الأزهار 🌸' },
      ],
    },
    {
      id: 2,
      text: '2. ما هو الكوكب الذي نعيش عليه وله قمر واحد يدور حوله؟',
      correct: 'earth',
      options: [
        { id: 'mars', text: '(أ) المريخ 🔴' },
        { id: 'jupiter', text: '(ب) المشتري 🟠' },
        { id: 'earth', text: '(ج) كوكب الأَرْض 🌍' },
      ],
    },
    {
      id: 3,
      text: '3. عندما يسخن الماء ويتحول إلى بخار، تسمى هذه العملية:',
      correct: 'evaporation',
      options: [
        { id: 'evaporation', text: '(أ) التَّبَخُّر ♨️' },
        { id: 'freezing', text: '(ب) التَّجَمُّد 🧊' },
        { id: 'rain', text: '(ج) الهُطُول 🌧️' },
      ],
    },
    {
      id: 4,
      text: '4. كم عدد الحواس الأساسية لدى الإنسان؟',
      correct: 'five',
      options: [
        { id: 'three', text: '(أ) 3 حواس' },
        { id: 'five', text: '(ب) 5 حَوَاسّ ✋' },
        { id: 'ten', text: '(ج) 10 حواس' },
      ],
    },
    {
      id: 5,
      text: '5. ما هي المادة التي يجذبها المغناطيس بسهولة؟',
      correct: 'iron',
      options: [
        { id: 'wood', text: '(أ) الخشب 🪵' },
        { id: 'plastic', text: '(ب) البلاستيك 🥤' },
        { id: 'iron', text: '(ج) الحَدِيد والمَعَادِن 🧲' },
      ],
    },
    {
      id: 6,
      text: '6. ما هو مصدر الضوء والحرارة الرئيسي لكوكب الأرض؟',
      correct: 'sun',
      options: [
        { id: 'moon', text: '(أ) القمر 🌙' },
        { id: 'sun', text: '(ب) الشَّمْسُ السَّاطِعَة ☀️' },
        { id: 'stars', text: '(ج) النجوم البعيدة ⭐' },
      ],
    },
  ];

  const handleSelectQuiz = (qId: number, optId: string) => {
    sounds.playClick();
    setQuizAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmitFinalQuiz = () => {
    const isPerfect = finalQuestions.every((q) => quizAnswers[q.id] === q.correct);
    if (isPerfect) {
      sounds.playFanfare();
      fireCelebrationConfetti();
      setQuizSubmitted(true);
      if (!act15Done) {
        setAct15Done(true);
        onCompleteActivity('lab_act15', 5);
      }
    } else {
      sounds.playGentleTryAgain();
      alert('لديك بعض الإجابات التي تحتاج مراجعة يا بطل! راجع الأسئلة وضع الإجابات الصحيحة للحصول على 100%!');
    }
  };

  const allCompleted = act13Done && act14Done && act15Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-violet-100/70 p-2 rounded-3xl border-2 border-violet-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 13: تجارب المختبر الآمنة', done: act13Done },
            { id: 2, title: 'النشاط 14: مدينة الألعاب والأنماط', done: act14Done },
            { id: 3, title: 'النشاط 15: التحدي العلمي الكبير 🏆', done: act15Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white text-violet-900 hover:bg-violet-50'
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
              fireCelebrationConfetti();
              onFinishStation();
              onOpenCertificate();
            }}
            className="btn-squish px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2 cursor-pointer animate-pulse-gentle"
          >
            <Trophy className="w-5 h-5 text-amber-900" />
            <span>عرض شهادة التخرج الكبرى للطباعة! 🎓</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: EXPERIMENTS (Page 16 & 17) --- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-violet-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-violet-100 pb-3">
            <div>
              <span className="text-xs font-black text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                صفحة (16 و 17) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                تجارب مختبر المستكشف الصغير (سر الذوبان ونمو النبتة)
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تجارب منزلية سهلة وآمنة لملاحظة الذوبان ونمو بذرة الفاصولياء في قطنة!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Experiment 1: Dissolution */}
          <div className="bg-sky-50/80 p-5 rounded-3xl border-2 border-sky-300 space-y-4">
            <h4 className="font-black text-sky-950 text-sm md:text-base flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-sky-600" />
              <span>التجربة (1): أين اختفى الملح والسكر؟ (سر الذوبان في الماء)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cup 1: Salt */}
              <div className="bg-white p-4 rounded-2xl border border-sky-200 flex flex-col items-center text-center space-y-3">
                <div className="text-4xl">🧂 ➔ 🥛</div>
                <div className="font-black text-slate-800 text-sm">كوب ماء دافئ + ملعقة ملح</div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {saltDissolved
                    ? 'ذاب الملح تماماً وأصبح الماء صافياً! الملح يذوب في الماء.'
                    : 'ضع الملح في الماء وحرّك لمدة 20 ثانية.. ماذا تلاحظ؟'}
                </p>
                <button
                  onClick={handleStirSalt}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    saltDissolved ? 'bg-emerald-600 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}
                >
                  {saltDissolved ? 'ذاب الملح واختفى! ✔️' : 'حرّك الملح في الكوب 🥄'}
                </button>
              </div>

              {/* Cup 2: Sand */}
              <div className="bg-white p-4 rounded-2xl border border-sky-200 flex flex-col items-center text-center space-y-3">
                <div className="text-4xl">🏖️ ➔ 🥛</div>
                <div className="font-black text-slate-800 text-sm">كوب ماء + ملعقة رمل ناعم</div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {sandSettled
                    ? 'الرمل لم يذب واستقر في القاع! الرمل مادة لا تذوب.'
                    : 'جرّب وضع رمل في الماء وتحريكه.. هل يختفي؟'}
                </p>
                <button
                  onClick={handleAddSand}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    sandSettled ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {sandSettled ? 'الرمل مستقر في القاع! ✔️' : 'حرّك الرمل في الكوب 🥄'}
                </button>
              </div>
            </div>

            <div className="bg-sky-100/70 p-3 rounded-2xl text-xs font-black text-sky-950 flex items-center gap-2">
              <span>💡</span>
              <span>
                <strong>ماذا اكتشفت؟</strong> بعض المواد تذوب في الماء كالملح والسكر، ومواد لا تذوب كالرمل والزيت!
              </span>
            </div>
          </div>

          {/* Experiment 2: Bean Seed in Cotton */}
          <div className="bg-emerald-50/80 p-5 rounded-3xl border-2 border-emerald-300 space-y-3">
            <h4 className="font-black text-emerald-950 text-sm md:text-base flex items-center gap-2">
              <span>🌱</span>
              <span>التجربة (2): زراعة بذرة الفاصولياء في قطنة مبللة</span>
            </h4>
            <p className="text-xs text-emerald-800 font-bold leading-relaxed">
              ضع بذرة فاصولياء جافة بين قطعة قطن رطبة وجدار كوب شفاف قرب نافذة مشمسة ورطبها يومياً:
            </p>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{seedWatered ? '🌿' : '🫘'}</div>
                <div>
                  <div className="font-black text-slate-800 text-sm">
                    {seedWatered ? 'بعد 3 إلى 5 أيام: خرج أول جذر وساق خضراء!' : 'البذرة داخل القطنة الرطبة'}
                  </div>
                  <div className="text-xs text-slate-500 font-bold">
                    تحتاج ماء وضوء شمس وهواء نقي لتكبر!
                  </div>
                </div>
              </div>

              <button
                onClick={handleWaterSeed}
                className={`btn-squish px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer ${
                  seedWatered ? 'bg-emerald-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {seedWatered ? 'نمت الساق الخضراء! 🌱✔️' : 'اسقِ البذرة بالماء 💧'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: PUZZLES & PATTERNS (Page 18) --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-violet-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-violet-100 pb-3">
            <div>
              <span className="text-xs font-black text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                صفحة (18) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                مدينة الألعاب (1): اكتشف العنصر المختلف وأكمل النمط
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                نشّط عقلك وقوة ملاحظتك لاكتشاف الكائن المختلف وإكمال المتتاليات العلمية!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Part A: Odd element out */}
          <div className="space-y-4">
            <h4 className="font-black text-slate-800 text-sm md:text-base flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>اكتشف العنصر المختلف في كل مجموعة واضغط عليه:</span>
            </h4>

            {oddGroups.map((grp) => {
              const selected = oddAnswers[grp.id];
              const isDone = selected === grp.correct;
              return (
                <div
                  key={grp.id}
                  className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-slate-700">{grp.title}</span>
                    {isDone && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
                        المختلف: {grp.reason} ✔️
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {grp.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => handleOddSelect(grp.id, opt.id, grp.correct)}
                        className={`btn-squish p-2.5 rounded-xl text-xs md:text-sm font-black border cursor-pointer transition ${
                          selected === opt.id
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Part B: Complete Patterns */}
          <div className="space-y-4 pt-3 border-t-2 border-slate-100">
            <h4 className="font-black text-slate-800 text-sm md:text-base">
              أكمل النمط العلمي باختيار الرمز المناسب مكان علامة الاستفهام [ ؟ ]:
            </h4>

            {/* Pattern 1 */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 space-y-2">
              <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                <span>النمط 1:</span>
                <span className="text-xl tracking-widest">☀️ 🌙 ☀️ 🌙 ☀️ ➔ [ ؟ ]</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePatternSelect(1, 'moon', 'moon')}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    patternAnswers[1] === 'moon' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border border-amber-300'
                  }`}
                >
                  قمر 🌙 ✔️
                </button>
                <button
                  onClick={() => handlePatternSelect(1, 'sun', 'moon')}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    patternAnswers[1] === 'sun' ? 'bg-rose-500 text-white' : 'bg-white text-slate-800 border border-slate-300'
                  }`}
                >
                  شمس ☀️
                </button>
              </div>
            </div>

            {/* Pattern 2 */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-200 space-y-2">
              <div className="font-black text-slate-800 text-sm flex items-center gap-2">
                <span>النمط 2:</span>
                <span className="text-xl tracking-widest">🌿 🌳 🌿 🌳 🌿 ➔ [ ؟ ]</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePatternSelect(2, 'tree', 'tree')}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    patternAnswers[2] === 'tree' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 border border-emerald-300'
                  }`}
                >
                  شجرة 🌳 ✔️
                </button>
                <button
                  onClick={() => handlePatternSelect(2, 'flower', 'tree')}
                  className={`btn-squish px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    patternAnswers[2] === 'flower' ? 'bg-rose-500 text-white' : 'bg-white text-slate-800 border border-slate-300'
                  }`}
                >
                  نبتة صغيرة 🌿
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: GRAND FINAL QUIZ (Page 19) --- */}
      {activeTab === 3 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-violet-400 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-violet-100 pb-3">
            <div>
              <span className="text-xs font-black text-violet-600 bg-violet-100 px-3 py-1 rounded-full">
                صفحة (19) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1 flex items-center gap-2">
                <span>🏆</span>
                <span>التحدي العلمي الكبير (اختبار البطل النهائي)</span>
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                أجب عن أسئلة التحدي الشامل واجمع 15 نجمة ذهبية لتتأهل لشهادة التخرج!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>5 نجوم ذهبية</span>
            </div>
          </div>

          {/* 6 Questions */}
          <div className="space-y-4">
            {finalQuestions.map((q) => {
              const selected = quizAnswers[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200 space-y-2.5"
                >
                  <p className="font-black text-slate-900 text-sm md:text-base">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((opt) => {
                      const isChosen = selected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectQuiz(q.id, opt.id)}
                          className={`btn-squish p-2.5 rounded-xl font-black text-xs md:text-sm text-right cursor-pointer border transition ${
                            isChosen
                              ? 'bg-violet-600 text-white border-violet-700 shadow-sm'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit final quiz button */}
          <div className="pt-2">
            <button
              onClick={handleSubmitFinalQuiz}
              className="btn-squish w-full py-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 text-white rounded-2xl font-black text-base md:text-lg shadow-xl cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy className="w-6 h-6 text-amber-300" />
              <span>تأكيد الإجابات والتأهل لشهادة التخرج الكبرى!</span>
            </button>
          </div>

          {quizSubmitted && (
            <div className="bg-emerald-100 border-2 border-emerald-400 rounded-3xl p-5 text-center space-y-3 animate-bounce-subtle">
              <div className="text-3xl">⭐⭐⭐⭐⭐</div>
              <h4 className="text-lg md:text-xl font-black text-emerald-950">
                نتيجتي في التحدي الكبير: ممتاز 100%! مؤهل لنيل الشهادة! 🎓
              </h4>
              <p className="text-xs md:text-sm text-emerald-800 font-bold">
                لقد أثبت أنك مستكشف حقيقي وذكي.. حان الآن وقت استلام شهادة تخرجك الكبرى!
              </p>
              <button
                onClick={onOpenCertificate}
                className="btn-squish px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-base shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>افتح شهادة التميز والتخرج واطبعها الآن! 🏆</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
