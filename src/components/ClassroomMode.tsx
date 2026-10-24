import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Trophy,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Question, ClassroomTeam } from '../types';
import { QUESTIONS_BANK } from '../data/questionsData';
import { MathView } from './MathView';
import { soundManager } from '../utils/soundEffects';

interface ClassroomModeProps {
  onExit: () => void;
}

const INITIAL_TEAMS: ClassroomTeam[] = [
  { id: 1, name: 'Tổ 1 (Kim Tự Tháp)', color: '#38bdf8', score: 0, streak: 0, answeredCount: 0, correctCount: 0 },
  { id: 2, name: 'Tổ 2 (Cung Lượng Giác)', color: '#34d399', score: 0, streak: 0, answeredCount: 0, correctCount: 0 },
  { id: 3, name: 'Tổ 3 (Bất Đẳng Thức Vàng)', color: '#fbbf24', score: 0, streak: 0, answeredCount: 0, correctCount: 0 },
  { id: 4, name: 'Tổ 4 (Hệ Phương Trình Sao)', color: '#ec4899', score: 0, streak: 0, answeredCount: 0, correctCount: 0 },
];

export const ClassroomMode: React.FC<ClassroomModeProps> = ({ onExit }) => {
  const [teams, setTeams] = useState<ClassroomTeam[]>(INITIAL_TEAMS);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [buzzingTeam, setBuzzingTeam] = useState<number | null>(null);

  const questions = QUESTIONS_BANK;
  const currentQ = questions[activeQuestionIdx];

  const handleBuzzer = (teamId: number) => {
    if (buzzingTeam !== null) return;
    soundManager.playPowerup();
    setBuzzingTeam(teamId);
  };

  const handleScoreTeam = (teamId: number, isCorrect: boolean) => {
    if (isCorrect) {
      soundManager.playCorrect();
      confetti({ particleCount: 30, spread: 60 });
    } else {
      soundManager.playIncorrect();
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id === teamId) {
          const newStreak = isCorrect ? t.streak + 1 : 0;
          return {
            ...t,
            score: isCorrect ? t.score + 100 + t.streak * 20 : Math.max(0, t.score - 20),
            streak: newStreak,
            answeredCount: t.answeredCount + 1,
            correctCount: isCorrect ? t.correctCount + 1 : t.correctCount,
          };
        }
        return t;
      })
    );

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    soundManager.playClick();
    setShowAnswer(false);
    setBuzzingTeam(null);
    if (activeQuestionIdx + 1 < questions.length) {
      setActiveQuestionIdx((i) => i + 1);
    } else {
      setActiveQuestionIdx(0);
    }
  };

  const handleReset = () => {
    soundManager.playClick();
    setTeams(INITIAL_TEAMS);
    setActiveQuestionIdx(0);
    setShowAnswer(false);
    setBuzzingTeam(null);
  };

  // Sort teams for leaderboard
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Đấu Trường Toán Học Lớp Học (Đối Kháng Tổ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Trình chiếu bảng tương tác • Tuyên dương sự tiến bộ của các tổ học tập
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thi Lại Từ Đầu</span>
          </button>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* 4 Teams Scoreboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sortedTeams.map((team, rank) => {
          const isBuzzing = buzzingTeam === team.id;
          return (
            <div
              key={team.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isBuzzing
                  ? 'bg-amber-950/80 border-amber-400 shadow-xl ring-2 ring-amber-400/50 scale-105'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: team.color, backgroundColor: `${team.color}20` }}>
                  Hạng {rank + 1}
                </span>
                {team.streak > 1 && (
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-0.5">
                    <Zap className="w-3 h-3 fill-amber-400" />
                    ×{team.streak}
                  </span>
                )}
              </div>
              <div className="font-bold text-sm text-white truncate">{team.name}</div>
              <div className="text-2xl font-black text-amber-300 mt-1">{team.score} đ</div>

              {/* Buzzer Button */}
              <button
                disabled={buzzingTeam !== null && !isBuzzing}
                onClick={() => handleBuzzer(team.id)}
                className={`w-full mt-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isBuzzing
                    ? 'bg-amber-500 text-slate-950 animate-bounce'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                }`}
              >
                {isBuzzing ? 'ĐANG GIÀNH QUYỀN!' : 'Bấm Chuông Giành Quyền'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Big Screen Question Display */}
      {currentQ && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-400">
              Câu Hỏi {activeQuestionIdx + 1}/{questions.length} • {currentQ.bai_ten}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-semibold">
              Mức: {currentQ.muc_do === 'biet' ? 'Nhận biết' : currentQ.muc_do === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}
            </span>
          </div>

          {/* Large text prompt for classroom projector */}
          <div className="text-lg sm:text-2xl font-bold text-slate-100 leading-relaxed">
            <MathView text={currentQ.de_bai} />
          </div>

          {currentQ.de_bai_latex && (
            <div className="p-4 bg-slate-900 rounded-xl border border-indigo-500/30 text-indigo-200 text-lg sm:text-xl text-center">
              <MathView math={currentQ.de_bai_latex} display={true} />
            </div>
          )}

          {/* Choices */}
          {currentQ.dang === 'multiple_choice' && currentQ.lua_chon && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.lua_chon.map((opt, idx) => {
                const isCorrect = idx === currentQ.dap_an_dung;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-base font-semibold transition-all ${
                      showAnswer && isCorrect
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200'
                    }`}
                  >
                    <MathView text={opt} />
                  </div>
                );
              })}
            </div>
          )}

          {/* True / False overview */}
          {currentQ.dang === 'true_false' && currentQ.y_dung_sai && (
            <div className="space-y-2 pt-2">
              {currentQ.y_dung_sai.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-sm sm:text-base font-medium"
                >
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="w-6 h-6 rounded bg-indigo-900 text-indigo-300 font-bold text-xs flex items-center justify-center">
                      {sub.label}
                    </span>
                    <MathView text={sub.noi_dung} />
                  </div>
                  {showAnswer && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded ${
                        sub.la_dung
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-900/80 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {sub.la_dung ? 'ĐÚNG' : 'SAI'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Teacher Grading Controller */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {buzzingTeam !== null ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300">
                    Chấm điểm cho Tổ {buzzingTeam}:
                  </span>
                  <button
                    onClick={() => handleScoreTeam(buzzingTeam, true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Chính Xác (+100)
                  </button>
                  <button
                    onClick={() => handleScoreTeam(buzzingTeam, false)}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Sai Rồi (-20)
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showAnswer ? 'Ẩn Đáp Án' : 'Hiện Đáp Án Chuẩn'}</span>
                </button>
              )}
            </div>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <span>Câu Kế Tiếp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
