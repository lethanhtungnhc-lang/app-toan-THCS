import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Lock,
  Play,
  Award,
  ChevronRight,
  ShieldAlert,
  Flame,
  CheckCircle,
  Gem,
  BookMarked,
  GraduationCap,
  Clock,
  CheckCircle2,
  ArrowRight,
  LogIn
} from 'lucide-react';
import { GameZone, ZoneStage, UserProgress, StudentAccount } from '../types';
import { GAME_ZONES_CONFIG } from '../data/questionsData';
import { soundManager } from '../utils/soundEffects';

interface StoryMapProps {
  userProgress: UserProgress;
  currentStudent?: StudentAccount | null;
  onSelectStage: (zone: GameZone, stage: ZoneStage) => void;
  onOpenExamMode: () => void;
  onOpenClassroomMode: () => void;
  onOpenErrorClinic: () => void;
  onOpenTeacherPortal: () => void;
  onOpenAuth?: (tab: 'login' | 'register') => void;
}

export const StoryMap: React.FC<StoryMapProps> = ({
  userProgress,
  currentStudent,
  onSelectStage,
  onOpenExamMode,
  onOpenClassroomMode,
  onOpenErrorClinic,
  onOpenTeacherPortal,
  onOpenAuth,
}) => {
  const [selectedZone, setSelectedZone] = useState<GameZone>(GAME_ZONES_CONFIG[0]);
  const [activeModalStage, setActiveModalStage] = useState<ZoneStage | null>(null);

  const totalStars = Object.values(userProgress.completedStages).reduce((acc, curr) => acc + curr.stars, 0);

  // Check gems unlocked
  const gemsUnlockedCount =
    (userProgress.gems.chuong1 ? 1 : 0) +
    (userProgress.gems.chuong2 ? 1 : 0) +
    (userProgress.gems.chuong4 ? 1 : 0);

  const isBossUnlocked = totalStars >= 8 || gemsUnlockedCount >= 2;

  const handleStageClick = (stage: ZoneStage) => {
    soundManager.playClick();
    if (totalStars < stage.requiredStars) return;
    onSelectStage(selectedZone, stage);
  };

  return (
    <div className="space-y-6">
      {/* Top Island Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Sao Đã Đạt</div>
            <div className="text-xl font-black text-amber-300">{totalStars} / 36</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-sky-500/30 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300">
            <Gem className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Ngọc Tri Thức</div>
            <div className="text-xl font-black text-sky-300">{gemsUnlockedCount} / 3</div>
          </div>
        </div>

        <div
          onClick={onOpenErrorClinic}
          className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-500/60 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Phòng Sửa Lỗi</div>
            <div className="text-base font-bold text-rose-300">
              {userProgress.incorrectQuestionIds.length > 0
                ? `${userProgress.incorrectQuestionIds.length} câu cần ôn`
                : 'Đã hoàn hảo!'}
            </div>
          </div>
        </div>

        <div
          onClick={onOpenExamMode}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/40 hover:border-purple-400 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-purple-200 font-medium">Đề Thi Mô Phỏng</div>
            <div className="text-sm font-bold text-white flex items-center gap-1">
              Chuẩn 7991 <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Post-Revision Official Exam Banner (Thang điểm 10 theo Thông tư 22 & CV 7991) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-900 border-2 border-indigo-500/50 p-4 sm:p-5 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Kiểm Tra Sau Ôn Tập
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Thang điểm 10.0 • TT 22
                </span>
                {currentStudent ? (
                  <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Thí sinh: {currentStudent.name} ({currentStudent.className})
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    (Khuyến khích đăng nhập để lưu kết quả vào danh sách của thầy cô)
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Bài Kiểm Tra Giữa Học Kì I – Môn Toán 9 (45 Phút)
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Sau khi luyện tập các ải trên bản đồ, học sinh tiến hành làm bài kiểm tra chính thức để đánh giá năng lực: Trắc nghiệm 4 lựa chọn (3.0đ), Đúng–Sai (2.0đ), Trả lời ngắn (2.0đ) và Ứng dụng thực tế (3.0đ).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {!currentStudent && onOpenAuth && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenAuth('login');
                }}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-400 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenExamMode();
              }}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/40 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Vào Làm Bài Kiểm Tra Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {GAME_ZONES_CONFIG.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          const isBoss = zone.id === 'boss';

          return (
            <button
              key={zone.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedZone(zone);
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-indigo-400 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500/40'
                  : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${zone.themeColor}20`,
                    color: zone.themeColor,
                    borderColor: `${zone.themeColor}40`,
                  }}
                >
                  {zone.vietnameseName}
                </span>
                {isBoss && !isBossUnlocked && <Lock className="w-3.5 h-3.5 text-slate-500" />}
              </div>
              <div className="font-bold text-sm sm:text-base text-white truncate">
                {zone.name}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-1">
                {zone.monsterName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Zone Overview & Stages Map */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 shadow-2xl space-y-6">
        {/* Zone Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                {selectedZone.vietnameseName}
              </span>
              <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                <Gem className="w-3.5 h-3.5" />
                {selectedZone.gemName}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{selectedZone.name}</h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {selectedZone.description}
            </p>
          </div>

          {/* Monster Warning Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 max-w-xs shrink-0 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-300">
              <Flame className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-300">{selectedZone.monsterName}</div>
              <div className="text-xs text-slate-400 leading-tight mt-0.5">
                {selectedZone.monsterDesc}
              </div>
            </div>
          </div>
        </div>

        {/* Stages Grid (4 Stages per Zone) */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Các Màn Thám Hiểm Theo Độ Khó (Biết → Hiểu → Vận Dụng → Thực Tế)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedZone.stages.map((stage, idx) => {
              const stageKey = stage.id;
              const completedData = userProgress.completedStages[stageKey];
              const isLocked = totalStars < stage.requiredStars;
              const earnedStars = completedData?.stars || 0;

              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isLocked
                      ? 'bg-slate-950/50 border-slate-800 opacity-60'
                      : 'bg-slate-950/80 hover:bg-slate-800/90 border-slate-700/80 hover:border-indigo-500/60 shadow-lg'
                  }`}
                >
                  <div>
                    {/* Top row: Stage number & Stars */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-7 h-7 rounded-lg bg-indigo-900/60 text-indigo-300 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                        0{idx + 1}
                      </span>
                      {isLocked ? (
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Cần {stage.requiredStars} ★</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= earnedStars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white">{stage.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      {stage.subtitle}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      {stage.questionIds.length} câu đố
                    </span>

                    <button
                      disabled={isLocked}
                      onClick={() => handleStageClick(stage)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        isLocked
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{earnedStars > 0 ? 'Chơi Lại' : 'Bắt Đầu'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
