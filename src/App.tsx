/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Award,
  BookOpen,
  GraduationCap,
  Users,
  ShieldAlert,
  HelpCircle,
  FileText,
  Star,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Zap,
  Monitor,
  Music,
  Crown,
  LogIn,
  LogOut,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { GameZone, ZoneStage, Question, UserProgress, StudentAccount } from './types';
import { GAME_ZONES_CONFIG, QUESTIONS_BANK, INITIAL_BADGES, INITIAL_CHARACTERS } from './data/questionsData';
import { MathIslandScene } from './components/3d/MathIslandScene';
import { StoryMap } from './components/StoryMap';
import { QuizArena } from './components/QuizArena';
import { ExamSimulator } from './components/ExamSimulator';
import { ClassroomMode } from './components/ClassroomMode';
import { ErrorClinic } from './components/ErrorClinic';
import { TeacherPortal } from './components/TeacherPortal';
import { CharacterModal } from './components/CharacterModal';
import { StudentGuideModal } from './components/StudentGuideModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { soundManager } from './utils/soundEffects';

const STORAGE_KEY = 'dao_toan_9_progress_v1';
const STUDENT_STORAGE_KEY = 'dao_toan_9_current_student';

const INITIAL_PROGRESS: UserProgress = {
  playerName: 'Học Sinh Thám Hiểm',
  characterId: 'tri',
  stars: 0,
  completedStages: {},
  gems: {
    chuong1: false,
    chuong2: false,
    chuong4: false,
    bossDefeated: false,
  },
  lifelines: {
    fiftyFifty: 3,
    owlHint: 3,
    skip: 1,
  },
  badges: INITIAL_BADGES,
  incorrectQuestionIds: [],
  correctQuestionIds: [],
  streakRecord: 0,
  totalTimeSeconds: 0,
  lastPlayedAt: new Date().toISOString(),
  soundEnabled: true,
  lowGraphicsMode: false,
};

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PROGRESS;
  });

  // Navigation views: 'map' | 'quiz' | 'exam' | 'classroom' | 'clinic'
  const [activeView, setActiveView] = useState<'map' | 'quiz' | 'exam' | 'classroom' | 'clinic'>('map');

  // Currently loaded quiz state
  const [activeZone, setActiveZone] = useState<GameZone>(GAME_ZONES_CONFIG[0]);
  const [activeStage, setActiveStage] = useState<ZoneStage | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [stageResults, setStageResults] = useState<{
    score: number;
    stars: number;
    correctCount: number;
    totalQuestions: number;
  } | null>(null);

  // Student authentication state (Session & LocalStorage)
  const [currentStudent, setCurrentStudent] = useState<StudentAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const handleStudentLoginSuccess = (student: StudentAccount) => {
    setCurrentStudent(student);
    try {
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
    } catch {
      // Ignore
    }
    setUserProgress((prev) => ({
      ...prev,
      playerName: student.name,
    }));
    setShowAuthModal(false);
  };

  const handleStudentLogout = () => {
    soundManager.playClick();
    setCurrentStudent(null);
    try {
      localStorage.removeItem(STUDENT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Modals
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [showStudentGuide, setShowStudentGuide] = useState(false);
  const [showTeacherGuide, setShowTeacherGuide] = useState(false);
  const [showTeacherPortal, setShowTeacherPortal] = useState(false);

  // 3D scene triggers
  const [celebrateTrigger, setCelebrateTrigger] = useState(0);
  const [bgmActive, setBgmActive] = useState(false);

  // Save to localStorage on progress updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    } catch {
      // Ignore
    }
  }, [userProgress]);

  // Sync sound manager state
  useEffect(() => {
    soundManager.setMuted(!userProgress.soundEnabled);
  }, [userProgress.soundEnabled]);

  const toggleSound = () => {
    setUserProgress((prev) => {
      const next = !prev.soundEnabled;
      soundManager.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  };

  const toggleGraphics = () => {
    soundManager.playClick();
    setUserProgress((prev) => ({
      ...prev,
      lowGraphicsMode: !prev.lowGraphicsMode,
    }));
  };

  // Launch a stage
  const handleSelectStage = (zone: GameZone, stage: ZoneStage) => {
    setActiveZone(zone);
    setActiveStage(stage);

    // Filter questions belonging to this stage
    const qs = QUESTIONS_BANK.filter((q) => stage.questionIds.includes(q.id));
    setActiveQuestions(qs.length > 0 ? qs : QUESTIONS_BANK.slice(0, 3));
    setStageResults(null);
    setActiveView('quiz');
  };

  // Complete a stage
  const handleCompleteStage = (results: {
    score: number;
    stars: number;
    correctCount: number;
    totalQuestions: number;
    newMistakes: string[];
    fixedMistakes: string[];
  }) => {
    setStageResults({
      score: results.score,
      stars: results.stars,
      correctCount: results.correctCount,
      totalQuestions: results.totalQuestions,
    });

    setCelebrateTrigger((c) => c + 1);

    setUserProgress((prev) => {
      const stageKey = activeStage?.id || 'stage';
      const prevStars = prev.completedStages[stageKey]?.stars || 0;
      const newStars = Math.max(prevStars, results.stars);

      const updatedCompleted = {
        ...prev.completedStages,
        [stageKey]: {
          stars: newStars,
          score: results.score,
          perfect: results.correctCount === results.totalQuestions,
        },
      };

      // Calculate total stars
      const totalStars = Object.values(updatedCompleted).reduce((acc, curr) => acc + curr.stars, 0);

      // Check unlock gems
      const updatedGems = { ...prev.gems };
      if (activeZone.chapter === 1 && results.stars >= 2) updatedGems.chuong1 = true;
      if (activeZone.chapter === 2 && results.stars >= 2) updatedGems.chuong2 = true;
      if (activeZone.chapter === 4 && results.stars >= 2) updatedGems.chuong4 = true;
      if (activeZone.id === 'boss' && results.stars >= 2) updatedGems.bossDefeated = true;

      // Update mistake lists
      const currentMistakes = new Set(prev.incorrectQuestionIds);
      results.newMistakes.forEach((id) => currentMistakes.add(id));
      results.fixedMistakes.forEach((id) => currentMistakes.delete(id));

      // Check Badges
      const updatedBadges = prev.badges.map((b) => {
        if (b.id === 'first_step' && !b.unlocked) return { ...b, unlocked: true };
        if (b.id === 'algebra_master' && updatedGems.chuong1) return { ...b, unlocked: true };
        if (b.id === 'trig_champion' && updatedGems.chuong4) return { ...b, unlocked: true };
        if (b.id === 'error_healer' && results.fixedMistakes.length > 0) return { ...b, unlocked: true };
        if (b.id === 'boss_slayer' && updatedGems.bossDefeated) return { ...b, unlocked: true };
        return b;
      });

      return {
        ...prev,
        stars: totalStars,
        completedStages: updatedCompleted,
        gems: updatedGems,
        badges: updatedBadges,
        incorrectQuestionIds: Array.from(currentMistakes),
      };
    });
  };

  // Launch remedial quiz for error clinic
  const handleStartRemedialQuiz = (questions: Question[]) => {
    setActiveQuestions(questions);
    setActiveStage({
      id: 'clinic_remedial',
      name: 'Luyện Tập Sửa Lỗi',
      subtitle: 'Khắc phục các bẫy tư duy',
      level: 'biet',
      questionIds: questions.map((q) => q.id),
      requiredStars: 0,
    });
    setStageResults(null);
    setActiveView('quiz');
  };

  const currentChar = INITIAL_CHARACTERS.find((c) => c.id === userProgress.characterId) || INITIAL_CHARACTERS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Top Universal App Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-indigo-500/25 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Game Title */}
          <div
            onClick={() => {
              soundManager.playClick();
              setActiveView('map');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                  Toán 9 • Giữa Học Kì I
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-bold hidden sm:inline">
                  2026–2027
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Hành Trình Giải Mã – Đảo Toán Học 9
              </h1>
            </div>
          </div>

          {/* Player & Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Player Avatar & Character Pill */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowCharacterModal(true);
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                style={{ backgroundColor: currentChar.color }}
              >
                {currentChar.name[0]}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-bold text-white truncate">{currentChar.name}</div>
                <div className="text-[10px] text-amber-300 font-medium flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {userProgress.stars} sao
                </div>
              </div>
            </button>

            {/* Background Music Toggle */}
            <button
              onClick={() => {
                const active = soundManager.toggleBgm();
                setBgmActive(active);
              }}
              title={bgmActive ? 'Tắt nhạc nền (BGM)' : 'Bật nhạc nền phiêu lưu (BGM)'}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                bgmActive
                  ? 'bg-purple-950/80 border-purple-400 text-purple-300 ring-2 ring-purple-500/40 shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Music className={`w-4 h-4 ${bgmActive ? 'animate-bounce' : ''}`} />
            </button>

            {/* Sound SFX Toggle */}
            <button
              onClick={toggleSound}
              title={userProgress.soundEnabled ? 'Tắt hiệu ứng âm thanh' : 'Bật hiệu ứng âm thanh'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {userProgress.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {/* Graphics Mode Toggle */}
            <button
              onClick={toggleGraphics}
              title={userProgress.lowGraphicsMode ? 'Đang ở chế độ nhẹ 2.5D' : 'Đang ở chế độ 3D đầy đủ'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                userProgress.lowGraphicsMode
                  ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>

            {/* Guides & Portals */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowStudentGuide(true);
              }}
              title="Sổ tay học sinh"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-400" />
              <span>Sổ Tay</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowTeacherGuide(true);
              }}
              title="Hướng dẫn triển khai PWA & trường học"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Triển Khai</span>
            </button>

            {/* Student Auth: Login / Register / Profile & Logout */}
            {currentStudent ? (
              <div className="flex items-center gap-1.5 p-1 sm:pl-2.5 sm:pr-1.5 sm:py-1 rounded-xl bg-slate-900/90 border border-emerald-500/50 shadow-sm text-xs">
                <div className="w-6 h-6 rounded-lg bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="font-bold text-white max-w-[110px] truncate">{currentStudent.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">Lớp {currentStudent.className}</div>
                </div>
                <button
                  onClick={handleStudentLogout}
                  title="Thoát tài khoản học sinh"
                  className="ml-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 hover:border-rose-500/50 text-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-rose-400" />
                  <span className="hidden md:inline">Thoát</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setAuthModalTab('login');
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all hover:bg-cyan-950/40 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Đăng Nhập</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setAuthModalTab('register');
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/30 hover:scale-105 transition-all cursor-pointer border border-emerald-400/40"
                >
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Đăng Ký</span>
                </button>
              </div>
            )}

            {/* Prominent Admin Portal Button (admin / admin@12345) */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowTeacherPortal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-amber-600/20 border border-amber-400/50 hover:scale-105 transition-all cursor-pointer"
            >
              <Crown className="w-4 h-4 text-amber-200" />
              <span>Quản Trị (Admin)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* VIEW 1: STORY MAP & 3D WORLD */}
        {activeView === 'map' && (
          <div className="space-y-6">
            {/* 3D Low-Poly Island Scene */}
            <MathIslandScene
              activeZoneId={activeZone.id}
              characterId={userProgress.characterId}
              celebrateTrigger={celebrateTrigger}
              lowGraphics={userProgress.lowGraphicsMode}
              onSelectZone={(zoneId) => {
                const targetZone = GAME_ZONES_CONFIG.find((z) => z.id === zoneId);
                if (targetZone) setActiveZone(targetZone);
              }}
            />

            {/* Story Map Stage Selector & Zone Cards */}
            <StoryMap
              userProgress={userProgress}
              currentStudent={currentStudent}
              onSelectStage={handleSelectStage}
              onOpenExamMode={() => {
                soundManager.playClick();
                setActiveView('exam');
              }}
              onOpenClassroomMode={() => {
                soundManager.playClick();
                setActiveView('classroom');
              }}
              onOpenErrorClinic={() => {
                soundManager.playClick();
                setActiveView('clinic');
              }}
              onOpenTeacherPortal={() => {
                soundManager.playClick();
                setShowTeacherPortal(true);
              }}
              onOpenAuth={(tab) => {
                soundManager.playClick();
                setAuthModalTab(tab);
                setShowAuthModal(true);
              }}
            />
          </div>
        )}

        {/* VIEW 2: QUIZ ARENA (Stage Quiz) */}
        {activeView === 'quiz' && activeStage && (
          <div className="space-y-4">
            {stageResults ? (
              /* Stage Complete Results Dialog */
              <div className="max-w-xl mx-auto p-6 sm:p-8 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-indigo-500/40 shadow-2xl text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Award className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
                    Ải Đã Hoàn Thành!
                  </span>
                  <h2 className="text-2xl font-black text-white">{activeStage.name}</h2>
                </div>

                {/* Stars Rating */}
                <div className="flex items-center justify-center gap-2 py-2">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-9 h-9 transition-transform ${
                        s <= stageResults.stars
                          ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                          : 'text-slate-700 scale-90'
                      }`}
                    />
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 py-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Số Câu Đúng</div>
                    <div className="text-xl font-bold text-emerald-400">
                      {stageResults.correctCount} / {stageResults.totalQuestions}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-xs text-slate-400">Điểm Đạt Được</div>
                    <div className="text-xl font-bold text-amber-400">
                      +{stageResults.score}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setStageResults(null);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Luyện Lại Ải Này</span>
                  </button>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveView('map');
                      setStageResults(null);
                    }}
                    className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer"
                  >
                    <span>Về Bản Đồ</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <QuizArena
                questions={activeQuestions}
                stageTitle={`${activeZone.vietnameseName} • ${activeStage.name}`}
                userProgress={userProgress}
                onCompleteStage={handleCompleteStage}
                onExit={() => {
                  soundManager.playClick();
                  setActiveView('map');
                }}
              />
            )}
          </div>
        )}

        {/* VIEW 3: EXAM SIMULATOR (Chuẩn Công văn 7991 & Thông tư 22) */}
        {activeView === 'exam' && (
          <ExamSimulator
            currentStudent={currentStudent}
            onOpenAuth={() => {
              setAuthModalTab('login');
              setShowAuthModal(true);
            }}
            onFinishExam={(result) => {
              // Award star if high score
              if (result.score10 >= 8.0) {
                confetti({ particleCount: 60, spread: 80 });
              }
            }}
            onExit={() => {
              soundManager.playClick();
              setActiveView('map');
            }}
          />
        )}

        {/* VIEW 4: CLASSROOM TEAM BATTLE MODE */}
        {activeView === 'classroom' && (
          <ClassroomMode
            onExit={() => {
              soundManager.playClick();
              setActiveView('map');
            }}
          />
        )}

        {/* VIEW 5: ERROR CLINIC (Phòng Sửa Lỗi) */}
        {activeView === 'clinic' && (
          <ErrorClinic
            mistakeIds={userProgress.incorrectQuestionIds}
            onStartRemedialQuiz={handleStartRemedialQuiz}
            onClose={() => {
              soundManager.playClick();
              setActiveView('map');
            }}
          />
        )}
      </main>

      {/* Floating Bottom Quick Navigation (For Mobile Viewport) */}
      <footer className="md:hidden sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-lg border-t border-indigo-500/20 px-4 py-2 flex items-center justify-around text-xs">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveView('map');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'map' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Bản Đồ</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveView('exam');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'exam' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Đề Thi</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveView('classroom');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'classroom' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tổ Đấu</span>
        </button>
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveView('clinic');
          }}
          className={`flex flex-col items-center gap-0.5 ${
            activeView === 'clinic' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Sửa Lỗi</span>
        </button>
      </footer>

      {/* Persistent Desktop / Universal Copyright Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-3.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-extrabold text-amber-300">Bản quyền © 2026 Teacher Lê Thanh Tùng</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Tổ Chuyên Môn Toán – Trường TH & THCS Nguyễn Hữu Cảnh</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>lethanhtungnhc@gmail.com</span>
            <span>•</span>
            <span>Thông tư 22/2021/TT-BGDĐT</span>
            <span>•</span>
            <span>Công văn 7991/BGDĐT-GDTrH</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showCharacterModal && (
        <CharacterModal
          userProgress={userProgress}
          onUpdateCharacter={(charId) => {
            setUserProgress((prev) => ({ ...prev, characterId: charId }));
          }}
          onClose={() => setShowCharacterModal(false)}
        />
      )}

      {showStudentGuide && <StudentGuideModal onClose={() => setShowStudentGuide(false)} />}

      {showTeacherGuide && <TeacherGuideModal onClose={() => setShowTeacherGuide(false)} />}

      {showTeacherPortal && <TeacherPortal onClose={() => setShowTeacherPortal(false)} />}

      {showAuthModal && (
        <StudentAuthModal
          initialTab={authModalTab}
          onSuccess={handleStudentLoginSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
