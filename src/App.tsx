import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StationsMap } from './components/StationsMap';
import { RobotNono } from './components/RobotNono';
import { BadgesModal } from './components/BadgesModal';
import { Certificate } from './components/Certificate';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { StationBiology } from './components/stations/StationBiology';
import { StationSpace } from './components/stations/StationSpace';
import { StationWater } from './components/stations/StationWater';
import { StationBody } from './components/stations/StationBody';
import { StationMatter } from './components/stations/StationMatter';
import { StationLab } from './components/stations/StationLab';
import { StationId, PlayerProfile, ActivityProgress } from './types';
import { STATIONS } from './data/gameData';
import { sounds } from './utils/audio';
import { fireCelebrationConfetti } from './utils/confetti';
import { Lock, Unlock, ArrowRight, Sparkles, Award } from 'lucide-react';

const STORAGE_KEY = 'science_explorer_kids_game_v1';

const defaultProfile: PlayerProfile = {
  name: '',
  age: 7,
  level: 'نسخة المستكشف الصغير',
  safetyPledged: true,
  hasStarted: false,
};

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [stars, setStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_stars`);
      return saved ? JSON.parse(saved) : 3; // 3 stars starter reward!
    } catch {
      return 3;
    }
  });

  const [unlockedStations, setUnlockedStations] = useState<StationId[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_unlocked`);
      return saved ? JSON.parse(saved) : ['biology'];
    } catch {
      return ['biology'];
    }
  });

  const [completedStations, setCompletedStations] = useState<StationId[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_completed`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activityProgress, setActivityProgress] = useState<ActivityProgress>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [badges, setBadges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sound`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [currentView, setCurrentView] = useState<'map' | 'station' | 'badges' | 'certificate'>('map');
  const [currentStationId, setCurrentStationId] = useState<StationId>('biology');
  const [showProfileModal, setShowProfileModal] = useState<boolean>(!profile.hasStarted);
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [unlockedCelebration, setUnlockedCelebration] = useState<string | null>(null);

  // Sync sounds state
  useEffect(() => {
    sounds.enabled = soundEnabled;
    localStorage.setItem(`${STORAGE_KEY}_sound`, JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Persist game state
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
    localStorage.setItem(`${STORAGE_KEY}_stars`, JSON.stringify(stars));
    localStorage.setItem(`${STORAGE_KEY}_unlocked`, JSON.stringify(unlockedStations));
    localStorage.setItem(`${STORAGE_KEY}_completed`, JSON.stringify(completedStations));
    localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activityProgress));
    localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
  }, [profile, stars, unlockedStations, completedStations, activityProgress, badges]);

  // Handle completing an individual activity
  const handleCompleteActivity = (actId: string, earnedStars: number) => {
    if (activityProgress[actId]?.completed) return;

    setActivityProgress((prev) => ({
      ...prev,
      [actId]: { completed: true, starsEarned: earnedStars, maxStars: earnedStars },
    }));
    setStars((prev) => prev + earnedStars);
  };

  // Station unlock chain mapping
  const nextStationMap: Record<StationId, StationId | null> = {
    biology: 'space',
    space: 'water',
    water: 'body',
    body: 'matter',
    matter: 'lab',
    lab: null,
  };

  const badgeForStation: Record<StationId, string> = {
    biology: 'badge-bio',
    space: 'badge-space',
    water: 'badge-water',
    body: 'badge-body',
    matter: 'badge-matter',
    lab: 'badge-lab',
  };

  // Handle completing an entire station
  const handleFinishStation = (stId: StationId, redirectTo: 'map' | 'certificate' = 'map') => {
    if (!completedStations.includes(stId)) {
      setCompletedStations((prev) => [...prev, stId]);
    }

    // Award badge
    const badgeId = badgeForStation[stId];
    if (badgeId && !badges.includes(badgeId)) {
      setBadges((prev) => [...prev, badgeId]);
    }

    // Unlock next station if available
    const nextSt = nextStationMap[stId];
    if (nextSt && !unlockedStations.includes(nextSt)) {
      setUnlockedStations((prev) => [...prev, nextSt]);
      sounds.playUnlock();
      fireCelebrationConfetti();
      const nextConfig = STATIONS.find((s) => s.id === nextSt);
      setUnlockedCelebration(nextConfig?.title || 'المرحلة التالية');
    }

    setCurrentView(redirectTo);
  };

  const handleResetProgress = () => {
    localStorage.removeItem(`${STORAGE_KEY}_profile`);
    localStorage.removeItem(`${STORAGE_KEY}_stars`);
    localStorage.removeItem(`${STORAGE_KEY}_unlocked`);
    localStorage.removeItem(`${STORAGE_KEY}_completed`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_badges`);

    setProfile(defaultProfile);
    setStars(3);
    setUnlockedStations(['biology']);
    setCompletedStations([]);
    setActivityProgress({});
    setBadges([]);
    setCurrentView('map');
    setShowProfileModal(true);
  };

  // Nono contextual hints
  const getNonoContext = () => {
    if (currentView === 'certificate') {
      return {
        msg: `مبارك يا ${profile.name || 'بطل العلوم'}! شهادة التفوق بانتظارك، يمكنك طباعتها وتوقيعها الآن! 🎓`,
        tip: 'يمكنك حفظ الشهادة بصيغة PDF أو طباعتها بحجم A4 بالعرض لتعليقها على الحائط!',
      };
    }
    if (currentView === 'badges') {
      return {
        msg: `لقد جمعت ${badges.length} من 6 شارات فخرية، و ${stars} من 60 نجمة ذهبية! ⭐`,
        tip: 'استمر في حل جميع الأنشطة للحصول على وسام عالم العلوم الصغير!',
      };
    }
    if (currentView === 'station') {
      const activeSt = STATIONS.find((s) => s.id === currentStationId);
      return {
        msg: `أهلاً بك في ${activeSt?.title || 'المحطة'}! اضغط على الأنشطة وحل الأسئلة لكسب النجوم! ⭐`,
        tip: activeSt?.description,
      };
    }
    return {
      msg: `مرحباً يا بطل العلوم ${profile.name || ''}! اختر محطة مفتوحة على الخريطة لتنطلق في المغامرة! 🚀`,
      tip: 'المحطة الأولى مفتوحة، وأكمل كل محطة لفتح المرحلة التالية وجمع الشارات الستة!',
    };
  };

  const completedActivitiesList = Object.keys(activityProgress).filter(
    (k) => activityProgress[k]?.completed
  );

  const nonoData = getNonoContext();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 text-slate-800 flex flex-col font-['Alexandria','Tajawal',sans-serif]">
      {/* Top Header */}
      <Header
        stars={stars}
        maxStars={60}
        profile={profile}
        activeView={currentView}
        onNavigate={(view) => {
          if (view === 'badges') {
            setShowBadgesModal(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenProfile={() => setShowProfileModal(true)}
        onResetProgress={handleResetProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Persistent Robot Nono Companion */}
        <RobotNono
          message={nonoData.msg}
          tip={nonoData.tip}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
        />

        {/* View Switcher */}
        {currentView === 'map' && (
          <StationsMap
            unlockedStations={unlockedStations}
            completedStations={completedStations}
            earnedBadges={badges}
            onSelectStation={(stId) => {
              setCurrentStationId(stId);
              setCurrentView('station');
            }}
          />
        )}

        {currentView === 'station' && (
          <div className="space-y-4">
            {/* Back to Map button */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  sounds.playClick();
                  setCurrentView('map');
                }}
                className="btn-squish flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 font-black text-xs md:text-sm text-slate-700 shadow-sm cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى خريطة العوالم الستة 🗺️</span>
              </button>

              <div className="text-xs md:text-sm font-black text-slate-600 bg-white/80 px-3 py-1.5 rounded-2xl border border-slate-200">
                {STATIONS.find((s) => s.id === currentStationId)?.title}
              </div>
            </div>

            {/* Render Station Component */}
            {currentStationId === 'biology' && (
              <StationBiology
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('biology')}
              />
            )}

            {currentStationId === 'space' && (
              <StationSpace
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('space')}
              />
            )}

            {currentStationId === 'water' && (
              <StationWater
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('water')}
              />
            )}

            {currentStationId === 'body' && (
              <StationBody
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('body')}
              />
            )}

            {currentStationId === 'matter' && (
              <StationMatter
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('matter')}
              />
            )}

            {currentStationId === 'lab' && (
              <StationLab
                completedActivities={completedActivitiesList}
                onCompleteActivity={handleCompleteActivity}
                onFinishStation={() => handleFinishStation('lab', 'certificate')}
                onOpenCertificate={() => setCurrentView('certificate')}
              />
            )}
          </div>
        )}

        {currentView === 'certificate' && (
          <Certificate
            profile={profile}
            totalStars={stars}
            completedStationsCount={completedStations.length}
            onBack={() => setCurrentView('map')}
            onUpdateName={(newName) => setProfile((prev) => ({ ...prev, name: newName }))}
          />
        )}
      </main>

      {/* Stage Unlocked Celebratory Modal */}
      {unlockedCelebration && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-bounce-subtle">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner border-2 border-amber-300">
              <Unlock className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              أحسنت يا بطل! 🌟
            </h3>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">
              لقد فتحت المرحلة الجديدة بنجاح:
              <br />
              <strong className="text-amber-600 text-base">{unlockedCelebration}</strong>!
            </p>
            <button
              onClick={() => {
                sounds.playClick();
                setUnlockedCelebration(null);
              }}
              className="btn-squish w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-sm shadow-md cursor-pointer"
            >
              متابعة الاستكشاف والمغامرة! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          unlockedBadges={badges}
          totalStars={stars}
          onClose={() => setShowBadgesModal(false)}
          onOpenCertificate={() => {
            setShowBadgesModal(false);
            setCurrentView('certificate');
          }}
        />
      )}

      {/* Player Profile & Starter Pledge Modal */}
      {showProfileModal && (
        <PlayerProfileModal
          profile={profile}
          isInitialSetup={!profile.hasStarted}
          onSaveProfile={(updated) => setProfile(updated)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="no-print py-4 px-6 text-center text-xs font-bold text-slate-500 border-t border-slate-200 bg-white/60">
        مقتبس بأمانة وتفاعل من كتاب «مغامرات عالم العلوم الصغير» للأطفال (6 - 8 سنوات) • يرافقك الروبوت نونو 🤖
      </footer>
    </div>
  );
}
