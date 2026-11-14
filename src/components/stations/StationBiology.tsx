import React, { useState } from 'react';
import { CheckCircle2, Star, ArrowRight, ArrowLeft, Sparkles, Award } from 'lucide-react';
import { sounds } from '../../utils/audio';
import { fireStarBurst } from '../../utils/confetti';

interface StationBiologyProps {
  onCompleteActivity: (activityId: string, stars: number) => void;
  onFinishStation: () => void;
  completedActivities: string[];
}

export const StationBiology: React.FC<StationBiologyProps> = ({
  onCompleteActivity,
  onFinishStation,
  completedActivities,
}) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  // --- ACTIVITY 1: Habitat Matching ---
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [act1Done, setAct1Done] = useState(completedActivities.includes('bio_act1'));

  const habitats = [
    { id: 'desert', name: 'الصَّحْرَاءُ الرَّمْلِيَّةُ الحَارَّة 🏜️' },
    { id: 'ocean', name: 'أَعْمَاقُ البَحْرِ والمُحِيط 🌊' },
    { id: 'forest', name: 'أَشْجَارُ الغَابَةِ الكَثِيفَة 🌴' },
    { id: 'ice', name: 'الجَلِيدُ والقُطْبُ المُتَجَمِّد ❄️' },
  ];

  const animals = [
    { id: 'camel', name: 'الجَمَلُ (سفينة الصحراء)', icon: '🐪', target: 'desert' },
    { id: 'dolphin', name: 'الدُّلْفِينُ اللطيف', icon: '🐬', target: 'ocean' },
    { id: 'monkey', name: 'القِرْدُ المرح', icon: '🐒', target: 'forest' },
    { id: 'penguin', name: 'البِطْرِيقُ المقاوم للبرد', icon: '🐧', target: 'ice' },
  ];

  const handleMatch = (animalId: string, habitatId: string) => {
    sounds.playClick();
    const animal = animals.find((a) => a.id === animalId);
    if (!animal) return;

    if (animal.target === habitatId) {
      sounds.playSuccess();
      const newMatches = { ...matches, [animalId]: habitatId };
      setMatches(newMatches);
      setSelectedAnimal(null);

      if (Object.keys(newMatches).length === animals.length && !act1Done) {
        sounds.playStar();
        fireStarBurst();
        setAct1Done(true);
        onCompleteActivity('bio_act1', 3);
      }
    } else {
      sounds.playGentleTryAgain();
    }
  };

  // --- ACTIVITY 2: Classification Boxes ---
  const [placedCreatures, setPlacedCreatures] = useState<Record<number, string>>({});
  const [act2Done, setAct2Done] = useState(completedActivities.includes('bio_act2'));
  const [selectedCreature, setSelectedCreature] = useState<number | null>(null);

  const creatures = [
    { id: 1, name: 'النَّسْر', icon: '🦅', category: 'birds' },
    { id: 2, name: 'الأُخْطُبُوط', icon: '🐙', category: 'sea' },
    { id: 3, name: 'النَّحْلَة', icon: '🐝', category: 'insects' },
    { id: 4, name: 'البَقَرَة', icon: '🐄', category: 'mammals' },
    { id: 5, name: 'الفَرَاشَة', icon: '🦋', category: 'insects' },
    { id: 6, name: 'القِرْش', icon: '🦈', category: 'sea' },
    { id: 7, name: 'البَبَّغَاء', icon: '🦜', category: 'birds' },
    { id: 8, name: 'الحِصَان', icon: '🐎', category: 'mammals' },
  ];

  const categories = [
    { id: 'birds', name: 'الطُّيُور (لها ريش وتبيض)', color: 'border-amber-400 bg-amber-50' },
    { id: 'mammals', name: 'الثَّدْيِيَّات (تلد وترضع صغارها)', color: 'border-emerald-400 bg-emerald-50' },
    { id: 'sea', name: 'كَائِنَاتٌ بَحْرِيَّة (تعيش بالماء)', color: 'border-sky-400 bg-sky-50' },
    { id: 'insects', name: 'الحَشَرَات (لها 6 أرجل)', color: 'border-purple-400 bg-purple-50' },
  ];

  const handlePlaceCreature = (catId: string) => {
    if (selectedCreature === null) return;
    const item = creatures.find((c) => c.id === selectedCreature);
    if (!item) return;

    if (item.category === catId) {
      sounds.playSuccess();
      const updated = { ...placedCreatures, [selectedCreature]: catId };
      setPlacedCreatures(updated);
      setSelectedCreature(null);

      if (Object.keys(updated).length === creatures.length && !act2Done) {
        sounds.playStar();
        fireStarBurst();
        setAct2Done(true);
        onCompleteActivity('bio_act2', 3);
      }
    } else {
      sounds.playGentleTryAgain();
    }
  };

  // --- ACTIVITY 3: Plant Secrets & Stages ---
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [stageOrder, setStageOrder] = useState<number[]>([]);
  const [act3Done, setAct3Done] = useState(completedActivities.includes('bio_act3'));

  const plantNeeds = [
    { id: 'water', label: 'الماء 💧', correct: true },
    { id: 'sun', label: 'ضوء الشمس ☀️', correct: true },
    { id: 'air', label: 'الهواء النقي 💨', correct: true },
    { id: 'juice', label: 'العصير المحلى 🧃 ❌', correct: false },
  ];

  const stages = [
    { id: 1, text: 'بذرة صغيرة نزرعها في التربة 🌱', step: 1 },
    { id: 2, text: 'بُرْعُمٌ صَغِيرٌ يَبْدَأُ بِالخُرُوج 🌿', step: 2 },
    { id: 3, text: 'شجيرة صغيرة تنمو أوراقها 🪴', step: 3 },
    { id: 4, text: 'شجرة كبيرة مكتملة تُثمر 🌳🍎', step: 4 },
  ];

  const handleToggleNeed = (needId: string) => {
    sounds.playClick();
    setSelectedNeeds((prev) =>
      prev.includes(needId) ? prev.filter((id) => id !== needId) : [...prev, needId]
    );
  };

  const handleOrderStage = (stepId: number) => {
    sounds.playClick();
    if (stageOrder.includes(stepId)) return;
    const newOrder = [...stageOrder, stepId];
    setStageOrder(newOrder);

    // check if correctly ordered 1, 2, 3, 4
    if (newOrder.length === 4) {
      const isCorrect = newOrder.every((val, idx) => val === idx + 1);
      if (isCorrect && !act3Done) {
        sounds.playSuccess();
        fireStarBurst();
        setAct3Done(true);
        onCompleteActivity('bio_act3', 3);
      } else if (!isCorrect) {
        sounds.playGentleTryAgain();
        setTimeout(() => setStageOrder([]), 800);
      }
    }
  };

  // --- ACTIVITY 4: Food Chain ---
  const [chain, setChain] = useState<number[]>([]);
  const [act4Done, setAct4Done] = useState(completedActivities.includes('bio_act4'));
  const [quiz1Answer, setQuiz1Answer] = useState<string | null>(null);
  const [quiz2Answer, setQuiz2Answer] = useState<string | null>(null);

  const chainItems = [
    { id: 1, name: 'العُشْب الأَخْضَر', sub: '(يصنع غذاءه من الشمس)', icon: '🌿', step: 1 },
    { id: 2, name: 'الجَرَادَة', sub: '(تتغذى على العشب)', icon: '🦗', step: 2 },
    { id: 3, name: 'الضِّفْدَع', sub: '(يتغذى على الحشرة)', icon: '🐸', step: 3 },
    { id: 4, name: 'الصَّقْر القَوِي', sub: '(مفترس في قمة السلسلة)', icon: '🦅', step: 4 },
  ];

  const handleChainClick = (stepId: number) => {
    sounds.playClick();
    if (chain.includes(stepId)) return;
    const newChain = [...chain, stepId];
    setChain(newChain);

    if (newChain.length === 4) {
      const isCorrect = newChain.every((val, idx) => val === idx + 1);
      if (isCorrect) {
        sounds.playSuccess();
      } else {
        sounds.playGentleTryAgain();
        setTimeout(() => setChain([]), 800);
      }
    }
  };

  const checkAct4Completion = (q1: string | null, q2: string | null, ch: number[]) => {
    if (q1 === 'herb' && q2 === 'carn' && ch.length === 4 && !act4Done) {
      sounds.playStar();
      fireStarBurst();
      setAct4Done(true);
      onCompleteActivity('bio_act4', 3);
    }
  };

  const allCompleted = act1Done && act2Done && act3Done && act4Done;

  return (
    <div className="space-y-6">
      {/* Activity Tabs Nav */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-100/70 p-2 rounded-3xl border-2 border-emerald-300">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 1, title: 'النشاط 1: توصيل البيئات', done: act1Done },
            { id: 2, title: 'النشاط 2: تصنيف الكائنات', done: act2Done },
            { id: 3, title: 'النشاط 3: أسرار النبات', done: act3Done },
            { id: 4, title: 'النشاط 4: السلسلة الغذائية', done: act4Done },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id);
              }}
              className={`btn-squish px-3 py-2 rounded-2xl font-black text-xs md:text-sm flex items-center gap-1.5 cursor-pointer transition ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-emerald-900 hover:bg-emerald-50'
              }`}
            >
              <span>{tab.title}</span>
              {tab.done && <CheckCircle2 className="w-4 h-4 text-emerald-200 fill-emerald-500" />}
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
            <span>استلام شارة الأحياء والعودة للخريطة!</span>
          </button>
        )}
      </div>

      {/* --- TAB 1: HABITAT MATCHING --- */}
      {activeTab === 1 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-emerald-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-emerald-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                صفحة (4) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (1): أين يعيش كل حيوان؟ (توصيل البيئات)
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                صل بخط واضح بين كل حيوان وموطنه الطبيعي المناسب ليعيش بأمان!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Tap-to-Connect Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Animals list */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-700 text-sm mb-2">الحيوان (اضغط للاختيار):</h4>
              {animals.map((item) => {
                const isMatched = !!matches[item.id];
                const isSelected = selectedAnimal === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!isMatched) {
                        sounds.playClick();
                        setSelectedAnimal(item.id);
                      }
                    }}
                    disabled={isMatched}
                    className={`btn-squish w-full p-3.5 rounded-2xl border-3 flex items-center justify-between font-black text-right transition cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900 cursor-default'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 text-amber-950 scale-102 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-base">{item.name}</span>
                    </div>
                    {isMatched ? (
                      <span className="text-emerald-600 font-bold text-xs bg-white px-2 py-1 rounded-xl">
                        تم التوصيل ✔️
                      </span>
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Habitats list */}
            <div className="space-y-3">
              <h4 className="font-black text-slate-700 text-sm mb-2">الموطن الطبيعي (اضغط للتوصيل):</h4>
              {habitats.map((hab) => {
                const isMatchedToAny = Object.values(matches).includes(hab.id);
                return (
                  <button
                    key={hab.id}
                    onClick={() => {
                      if (selectedAnimal) {
                        handleMatch(selectedAnimal, hab.id);
                      }
                    }}
                    className={`btn-squish w-full p-3.5 rounded-2xl border-3 flex items-center justify-between font-black text-right transition cursor-pointer ${
                      isMatchedToAny
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                        : selectedAnimal
                        ? 'bg-sky-50 border-sky-300 hover:bg-sky-100 text-sky-950 animate-pulse-gentle'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-base">{hab.name}</span>
                    {isMatchedToAny ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Did you know note from Nono (Page 4 footer) */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3.5 text-sky-900 font-bold text-xs md:text-sm flex items-center gap-2">
            <span className="text-2xl">🐪</span>
            <span>
              <strong>هل تعلم مع نونو؟</strong> يمتلك الجمل خفاً عريضاً يمنع قدمه من الغوص في رمال الصحراء الناعمة!
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 2: CLASSIFICATION BOXES --- */}
      {activeTab === 2 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-emerald-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-emerald-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                صفحة (5) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (2): صندوق تصنيف الكائنات الحية
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                اختر الكائن الحي، ثم اضغط على الصندوق المناسب لمجموعته!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Creature Cards to classify */}
          <div>
            <h4 className="font-black text-slate-700 text-sm mb-3">اضغط على أحد الكائنات:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {creatures.map((c) => {
                const isPlaced = !!placedCreatures[c.id];
                const isSelected = selectedCreature === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (!isPlaced) {
                        sounds.playClick();
                        setSelectedCreature(c.id);
                      }
                    }}
                    disabled={isPlaced}
                    className={`btn-squish p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 font-black cursor-pointer transition ${
                      isPlaced
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-default'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-md scale-105'
                        : 'bg-white hover:bg-slate-50 border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{c.icon}</span>
                    <span className="text-xs text-slate-500">({c.id})</span>
                    <span className="text-sm text-slate-800">{c.name}</span>
                    {isPlaced && <span className="text-[11px] text-emerald-600">تم وضعه ✔️</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* The 4 Category Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const itemsInBox = creatures.filter((c) => placedCreatures[c.id] === cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => handlePlaceCreature(cat.id)}
                  className={`p-4 rounded-3xl border-3 transition cursor-pointer ${cat.color} ${
                    selectedCreature ? 'ring-2 ring-amber-400 hover:scale-101' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-black text-slate-800 text-sm md:text-base">{cat.name}</h5>
                    <span className="text-xs font-bold text-slate-500">
                      {itemsInBox.length} / 2
                    </span>
                  </div>

                  <div className="flex items-center gap-2 min-h-[50px] bg-white/70 rounded-2xl p-2 border border-slate-200">
                    {itemsInBox.length === 0 ? (
                      <span className="text-xs text-slate-400 font-bold">
                        {selectedCreature ? 'اضغط هنا لوضع الكائن' : 'الصندوق فارغ'}
                      </span>
                    ) : (
                      itemsInBox.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-slate-200 text-xs font-black"
                        >
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nono Smart Question (Page 5 footer) */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3.5 text-purple-900 font-bold text-xs md:text-sm flex items-center gap-2">
            <span className="text-2xl">🐬</span>
            <span>
              <strong>سؤال ذكاء من نونو:</strong> هل تعلم أن الدلفين والحوت يلدان ويرضعان صغارهما فهما من الثدييات وليسا أسماكاً؟
            </span>
          </div>
        </div>
      )}

      {/* --- TAB 3: PLANT SECRETS & STAGES --- */}
      {activeTab === 3 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-emerald-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-emerald-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                صفحة (6) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (3): أسرار النبات الأخضر ومراحل نموه
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تعرّف على أجزاء النبتة البطلة ورتّب مراحل نمو الشجرة من (1 إلى 4)!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Plant anatomy spotlight */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-3xl border-2 border-emerald-200">
            <h4 className="font-black text-emerald-900 text-sm md:text-base mb-3 flex items-center gap-2">
              <span>🌸</span>
              <span>أجزاء النبتة البطلة:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-emerald-200">
                <div className="font-black text-emerald-800 text-sm mb-1">🌱 الجذور:</div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  تمتص الماء والغذاء من التربة وتثبت النبتة في الأرض بقوة.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-200">
                <div className="font-black text-emerald-800 text-sm mb-1">🌿 الساق:</div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  ينقل الماء للأوراق ويحمل الأزهار والأغصان عالياً نحو النور.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-emerald-200">
                <div className="font-black text-emerald-800 text-sm mb-1">🍃 الأوراق:</div>
                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  تصنع الغذاء اللذيذ للنبات بواسطة ضوء الشمس الرائع.
                </p>
              </div>
            </div>
          </div>

          {/* Part A: What does a plant need? */}
          <div className="space-y-2">
            <h4 className="font-black text-slate-800 text-sm md:text-base">
              ماذا تحتاج النبتة لتنمو؟ (اضغط على العناصر الصحيحة):
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {plantNeeds.map((need) => {
                const isChecked = selectedNeeds.includes(need.id);
                return (
                  <button
                    key={need.id}
                    onClick={() => handleToggleNeed(need.id)}
                    className={`btn-squish p-3 rounded-2xl border-2 font-black text-sm flex items-center justify-between cursor-pointer transition ${
                      isChecked
                        ? need.correct
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : 'bg-rose-100 border-rose-400 text-rose-900'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{need.label}</span>
                    <span>{isChecked ? (need.correct ? '✔️' : '❌') : '⚪'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Part B: Sequence 1 to 4 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-800 text-sm md:text-base">
                رتّب مراحل نمو الشجرة من (1) إلى (4) بالضغط عليها بالترتيب:
              </h4>
              <button
                onClick={() => {
                  sounds.playClick();
                  setStageOrder([]);
                }}
                className="text-xs font-bold text-amber-700 underline cursor-pointer"
              >
                إعادة الترتيب
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stages.map((st) => {
                const orderIdx = stageOrder.indexOf(st.step);
                const hasOrder = orderIdx !== -1;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleOrderStage(st.step)}
                    className={`btn-squish p-4 rounded-2xl border-2 text-right font-black flex items-center justify-between cursor-pointer transition ${
                      hasOrder
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    <span className="text-sm md:text-base">{st.text}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ${
                        hasOrder
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'border-2 border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {hasOrder ? orderIdx + 1 : '?'}
                    </span>
                  </button>
                );
              })}
            </div>
            {stageOrder.length === 4 && (
              <p className="text-emerald-700 font-black text-sm text-center">
                أحسنت! الترتيب الصحيح: البذرة ➔ البرعم ➔ الشجيرة ➔ الشجرة المثمرة! 🌟
              </p>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 4: FOOD CHAIN --- */}
      {activeTab === 4 && (
        <div className="bg-white rounded-3xl p-5 md:p-7 border-3 border-emerald-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b-2 border-emerald-100 pb-3">
            <div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                صفحة (7) من الكتاب
              </span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                النشاط (4): السلسلة الغذائية في الطبيعة
              </h3>
              <p className="text-slate-600 font-bold text-sm">
                تتبع مسار الطاقة: من يأكل من؟ رتّب السلسلة الغذائية بالضغط عليها بالتسلسل!
              </p>
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-black bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
              <Star className="w-5 h-5 fill-amber-400" />
              <span>3 نجوم</span>
            </div>
          </div>

          {/* Interactive Food Chain Sequence */}
          <div className="space-y-3">
            <h4 className="font-black text-slate-700 text-sm">
              مسار انتقال الطاقة من النبات إلى الحيوانات (اضغط بالترتيب من البداية حتى قمة السلسلة):
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {chainItems.map((item) => {
                const orderIdx = chain.indexOf(item.step);
                const isSelected = orderIdx !== -1;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleChainClick(item.step)}
                    className={`btn-squish p-4 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition ${
                      isSelected
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-102 shadow-md'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-800'
                    }`}
                  >
                    <span className="text-4xl">{item.icon}</span>
                    <span className="text-sm font-black">{item.name}</span>
                    <span className="text-xs text-slate-500 font-semibold">{item.sub}</span>
                    <span
                      className={`mt-1 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'border-2 border-slate-300 bg-white text-slate-400'
                      }`}
                    >
                      {isSelected ? orderIdx + 1 : '?'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Challenge Questions (Page 7) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t-2 border-slate-100">
            {/* Q1 */}
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 space-y-2">
              <p className="font-black text-amber-900 text-sm">
                ❓ سؤال التحدي: ماذا يُسمى الحيوان الذي يأكل النباتات فقط (مثل الأرنب والغزال)؟
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    setQuiz1Answer('herb');
                    checkAct4Completion('herb', quiz2Answer, chain);
                  }}
                  className={`btn-squish flex-1 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    quiz1Answer === 'herb'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-amber-900 border border-amber-300'
                  }`}
                >
                  آكِل الأَعْشَاب ✔️
                </button>
                <button
                  onClick={() => {
                    sounds.playGentleTryAgain();
                    setQuiz1Answer('wrong');
                  }}
                  className={`btn-squish flex-1 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    quiz1Answer === 'wrong'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  آكِل اللحوم ❌
                </button>
              </div>
            </div>

            {/* Q2 */}
            <div className="bg-sky-50 p-4 rounded-2xl border-2 border-sky-200 space-y-2">
              <p className="font-black text-sky-900 text-sm">
                ❓ سؤال التحدي: ماذا يُسمى الحيوان الذي يصطاد ويأكل اللحوم (مثل الأسد والذئب)؟
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sounds.playSuccess();
                    setQuiz2Answer('carn');
                    checkAct4Completion(quiz1Answer, 'carn', chain);
                  }}
                  className={`btn-squish flex-1 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    quiz2Answer === 'carn'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-sky-900 border border-sky-300'
                  }`}
                >
                  آكِل اللُّحُوم ✔️
                </button>
                <button
                  onClick={() => {
                    sounds.playGentleTryAgain();
                    setQuiz2Answer('wrong');
                  }}
                  className={`btn-squish flex-1 py-2 rounded-xl text-xs font-black cursor-pointer ${
                    quiz2Answer === 'wrong'
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  آكِل الأعشاب ❌
                </button>
              </div>
            </div>
          </div>

          {/* Achievement card footer */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🦁🐾</span>
              <div>
                <h5 className="font-black text-emerald-900 text-sm md:text-base">
                  أحسنت! أنهيت محطة الكائنات الحية واستحققت شارة «مكتشف الطبيعة والحيوانات»!
                </h5>
                <p className="text-xs text-emerald-700 font-bold">
                  أنت الآن جاهز للمحطة التالية: مغامرة الفضاء والكون!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
