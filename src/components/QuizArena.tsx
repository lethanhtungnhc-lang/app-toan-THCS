import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Timer,
  Zap,
  HelpCircle,
  Shuffle,
  Percent,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Question, UserProgress } from '../types';
import { MathView } from './MathView';
import { GeometryCanvas } from './GeometryCanvas';
import { soundManager } from '../utils/soundEffects';

interface QuizArenaProps {
  questions: Question[];
  stageTitle: string;
  userProgress: UserProgress;
  onCompleteStage: (results: {
    score: number;
    stars: number;
    correctCount: number;
    totalQuestions: number;
    newMistakes: string[];
    fixedMistakes: string[];
  }) => void;
  onExit: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  questions,
  stageTitle,
  userProgress,
  onCompleteStage,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Inputs for specific question types
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({});
  const [shortAnswerInput, setShortAnswerInput] = useState('');
  const [stepOrder, setStepOrder] = useState<string[]>([]);

  // Lifeline usage
  const [lifelines, setLifelines] = useState({ ...userProgress.lifelines });
  const [mistakesMade, setMistakesMade] = useState<string[]>([]);
  const [fixedMistakes, setFixedMistakes] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  const currentQ = questions[currentIndex];

  // Initialize step order when question changes
  useEffect(() => {
    if (currentQ?.dang === 'steps_order' && currentQ.cac_buoc_giai) {
      // Shuffle steps initially
      const shuffled = [...currentQ.cac_buoc_giai]
        .sort(() => Math.random() - 0.5)
        .map((s) => s.id);
      setStepOrder(shuffled);
    } else {
      setStepOrder([]);
    }

    if (currentQ?.dang === 'true_false' && currentQ.y_dung_sai) {
      const initTf: Record<string, boolean | null> = {};
      currentQ.y_dung_sai.forEach((item) => {
        initTf[item.id] = null;
      });
      setTfAnswers(initTf);
    } else {
      setTfAnswers({});
    }

    setSelectedChoice(null);
    setShortAnswerInput('');
    setEliminatedOptions([]);
    setShowHint(false);
    setHasAnswered(false);
    setIsCorrect(null);
    setTimeLeft(currentQ?.thoi_gian_giay || 60);
  }, [currentIndex, currentQ]);

  // Countdown timer
  useEffect(() => {
    if (hasAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        if (prev <= 10) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasAnswered, currentIndex]);

  const handleTimeOut = () => {
    if (hasAnswered) return;
    setHasAnswered(true);
    setIsCorrect(false);
    soundManager.playIncorrect();
    setHearts((h) => Math.max(0, h - 1));
    setStreak(0);
    setMistakesMade((prev) => [...prev, currentQ.id]);
  };

  // 1. Submit Multiple Choice
  const handleSelectChoice = (index: number) => {
    if (hasAnswered || eliminatedOptions.includes(index)) return;
    setSelectedChoice(index);
    setHasAnswered(true);

    const correct = index === currentQ.dap_an_dung;
    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      const streakBonus = streak * 10;
      setScore((s) => s + 100 + streakBonus);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      if (newStreak > 1) {
        soundManager.playCombo(newStreak);
      }
      if (userProgress.incorrectQuestionIds.includes(currentQ.id)) {
        setFixedMistakes((prev) => [...prev, currentQ.id]);
      }
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } else {
      soundManager.playIncorrect();
      setHearts((h) => Math.max(0, h - 1));
      setStreak(0);
      setMistakesMade((prev) => [...prev, currentQ.id]);
    }
  };

  // 2. Submit True/False (4 sub-items)
  const handleSelectTf = (subItemId: string, val: boolean) => {
    if (hasAnswered) return;
    soundManager.playClick();
    setTfAnswers((prev) => ({ ...prev, [subItemId]: val }));
  };

  const handleSubmitTf = () => {
    if (hasAnswered || !currentQ.y_dung_sai) return;
    setHasAnswered(true);

    let matchCount = 0;
    currentQ.y_dung_sai.forEach((item) => {
      if (tfAnswers[item.id] === item.la_dung) {
        matchCount++;
      }
    });

    const isFullyCorrect = matchCount === 4;
    setIsCorrect(isFullyCorrect);

    if (matchCount >= 3) {
      soundManager.playCorrect();
      setScore((s) => s + matchCount * 25);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      if (isFullyCorrect) {
        confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
      }
    } else {
      soundManager.playIncorrect();
      setHearts((h) => Math.max(0, h - 1));
      setStreak(0);
      setMistakesMade((prev) => [...prev, currentQ.id]);
    }
  };

  // 3. Submit Short Answer
  const handleSubmitShortAnswer = () => {
    if (hasAnswered || !shortAnswerInput.trim()) return;
    setHasAnswered(true);

    const cleanInput = shortAnswerInput.trim().replace(',', '.').toLowerCase();
    const target = String(currentQ.dap_an_dung).trim().replace(',', '.').toLowerCase();

    // Check numeric match or exact string match
    const numInput = parseFloat(cleanInput);
    const numTarget = parseFloat(target);
    const isNumMatch = !isNaN(numInput) && !isNaN(numTarget) && Math.abs(numInput - numTarget) < 0.05;
    const correct = isNumMatch || cleanInput === target;

    setIsCorrect(correct);

    if (correct) {
      soundManager.playCorrect();
      setScore((s) => s + 120 + streak * 10);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      confetti({ particleCount: 45, spread: 65, origin: { y: 0.7 } });
    } else {
      soundManager.playIncorrect();
      setHearts((h) => Math.max(0, h - 1));
      setStreak(0);
      setMistakesMade((prev) => [...prev, currentQ.id]);
    }
  };

  // 4. Move Step Up/Down
  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (hasAnswered) return;
    soundManager.playClick();
    const newOrder = [...stepOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIdx];
    newOrder[targetIdx] = temp;
    setStepOrder(newOrder);
  };

  const handleSubmitStepOrder = () => {
    if (hasAnswered || !currentQ.cac_buoc_giai) return;
    setHasAnswered(true);

    const expectedOrder = [...currentQ.cac_buoc_giai]
      .sort((a, b) => a.thu_tu_dung - b.thu_tu_dung)
      .map((s) => s.id);

    const isMatch = stepOrder.every((id, idx) => id === expectedOrder[idx]);
    setIsCorrect(isMatch);

    if (isMatch) {
      soundManager.playCorrect();
      setScore((s) => s + 150 + streak * 15);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak((m) => Math.max(m, newStreak));
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.7 } });
    } else {
      soundManager.playIncorrect();
      setHearts((h) => Math.max(0, h - 1));
      setStreak(0);
      setMistakesMade((prev) => [...prev, currentQ.id]);
    }
  };

  // Lifelines: 50:50
  const handleUseFiftyFifty = () => {
    if (lifelines.fiftyFifty <= 0 || hasAnswered || currentQ.dang !== 'multiple_choice' || !currentQ.lua_chon) {
      return;
    }
    soundManager.playPowerup();
    setLifelines((l) => ({ ...l, fiftyFifty: l.fiftyFifty - 1 }));

    const correctIdx = Number(currentQ.dap_an_dung);
    const incorrectIndices = [0, 1, 2, 3].filter((i) => i !== correctIdx);
    // Pick 2 random incorrect indices
    const toEliminate = incorrectIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    setEliminatedOptions(toEliminate);
  };

  // Lifeline: Owl Pi Hint
  const handleUseOwlHint = () => {
    if (lifelines.owlHint <= 0) return;
    soundManager.playOwlChirp();
    setLifelines((l) => ({ ...l, owlHint: l.owlHint - 1 }));
    setShowHint(true);
  };

  // Next Question or Finish Stage
  const handleNextQuestion = () => {
    soundManager.playClick();
    if (currentIndex + 1 < questions.length && hearts > 0) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Calculate Stars
      let stars = 1;
      const accuracy = (questions.length - mistakesMade.length) / questions.length;
      if (accuracy >= 0.9 && hearts >= 2) stars = 3;
      else if (accuracy >= 0.6) stars = 2;

      soundManager.playLevelComplete();
      onCompleteStage({
        score,
        stars,
        correctCount: questions.length - mistakesMade.length,
        totalQuestions: questions.length,
        newMistakes: mistakesMade,
        fixedMistakes,
      });
    }
  };

  if (!currentQ) {
    return null;
  }

  const allTfSelected =
    currentQ.dang === 'true_false' &&
    currentQ.y_dung_sai &&
    currentQ.y_dung_sai.every((item) => tfAnswers[item.id] !== null && tfAnswers[item.id] !== undefined);

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-2xl text-slate-100">
      {/* Top Header: Stage title, hearts, score, streak */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
            {stageTitle}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>Câu {currentIndex + 1}/{questions.length}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-normal">
              {currentQ.muc_do === 'biet' ? 'Nhận biết' : currentQ.muc_do === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}
            </span>
          </h2>
        </div>

        {/* HUD Elements */}
        <div className="flex items-center gap-4">
          {/* Hearts */}
          <div className="flex items-center gap-1 bg-slate-950/70 px-3 py-1.5 rounded-xl border border-rose-500/30">
            {[1, 2, 3].map((h) => (
              <Heart
                key={h}
                className={`w-5 h-5 transition-transform ${
                  h <= hearts ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-600 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              timeLeft <= 10
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-slate-950/70 border-slate-800 text-slate-200'
            }`}
          >
            <Timer className="w-4 h-4 text-sky-400" />
            <span>{timeLeft}s</span>
          </div>

          {/* Streak & Score */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-amber-950/50 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>{streak} Combo</span>
            </div>
            <div className="bg-indigo-950/50 px-3 py-1.5 rounded-xl border border-indigo-500/40 text-indigo-300 text-xs font-bold">
              {score} Điểm
            </div>
          </div>
        </div>
      </div>

      {/* Lifelines Toolbar */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          {/* 50:50 */}
          {currentQ.dang === 'multiple_choice' && (
            <button
              onClick={handleUseFiftyFifty}
              disabled={lifelines.fiftyFifty <= 0 || hasAnswered}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                lifelines.fiftyFifty > 0 && !hasAnswered
                  ? 'bg-indigo-900/40 hover:bg-indigo-800/60 border-indigo-500/50 text-indigo-200 cursor-pointer'
                  : 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              <span>50:50 ({lifelines.fiftyFifty})</span>
            </button>
          )}

          {/* Owl Hint */}
          <button
            onClick={handleUseOwlHint}
            disabled={lifelines.owlHint <= 0 || showHint}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              lifelines.owlHint > 0 && !showHint
                ? 'bg-amber-900/40 hover:bg-amber-800/60 border-amber-500/50 text-amber-200 cursor-pointer'
                : 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Bí Kíp Cú Pi ({lifelines.owlHint})</span>
          </button>
        </div>

        <button
          onClick={onExit}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition-colors"
        >
          Tạm Dừng
        </button>
      </div>

      {/* Owl Pi Hint Box */}
      {showHint && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 text-amber-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-0.5">
              Lời Dặn Của Trợ Lý Cú Pi
            </h4>
            <p className="text-sm text-amber-100/90 leading-relaxed">{currentQ.goi_y}</p>
          </div>
        </div>
      )}

      {/* Question Prompt */}
      <div className="my-3 p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-2 leading-relaxed">
          {currentQ.de_bai}
        </h3>
        {currentQ.de_bai_latex && (
          <div className="py-2 px-3 bg-slate-900/80 rounded-xl border border-indigo-500/20 my-2 overflow-x-auto text-indigo-200">
            <MathView math={currentQ.de_bai_latex} display={true} />
          </div>
        )}

        {/* Geometry SVG visual if present */}
        {currentQ.hinh_ve && (
          <div className="mt-3">
            <GeometryCanvas visual={currentQ.hinh_ve} />
          </div>
        )}
      </div>

      {/* Interactive Answer Area depending on Question Type */}

      {/* 1. Multiple Choice (4 Options) */}
      {currentQ.dang === 'multiple_choice' && currentQ.lua_chon && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {currentQ.lua_chon.map((option, idx) => {
            const isEliminated = eliminatedOptions.includes(idx);
            const isSelected = selectedChoice === idx;
            const isTarget = idx === currentQ.dap_an_dung;

            let btnStyle = 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200';
            if (isEliminated) {
              btnStyle = 'opacity-20 line-through bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed';
            } else if (hasAnswered) {
              if (isTarget) {
                btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-lg';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 shadow-lg';
              } else {
                btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered || isEliminated}
                onClick={() => handleSelectChoice(idx)}
                className={`p-3.5 sm:p-4 rounded-xl border text-left font-medium text-sm sm:text-base transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-slate-900/80 border border-slate-700/80 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-300">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-snug">
                  <MathView text={option.replace(/^[A-D]\.\s*/, '')} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. True / False (4 sub-items: a, b, c, d) */}
      {currentQ.dang === 'true_false' && currentQ.y_dung_sai && (
        <div className="space-y-3 my-4">
          <div className="text-xs font-semibold text-slate-400 px-1">
            Chọn Đúng hoặc Sai cho mỗi khẳng định bên dưới theo Công văn 7991:
          </div>
          {currentQ.y_dung_sai.map((item) => {
            const currentVal = tfAnswers[item.id];
            const isCorrectAnswer = item.la_dung;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-md bg-indigo-900/60 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {item.label}
                  </span>
                  <span className="leading-snug">
                    <MathView text={item.noi_dung} />
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    disabled={hasAnswered}
                    onClick={() => handleSelectTf(item.id, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      currentVal === true
                        ? hasAnswered
                          ? isCorrectAnswer
                            ? 'bg-emerald-600 border-emerald-400 text-white'
                            : 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ĐÚNG
                  </button>
                  <button
                    disabled={hasAnswered}
                    onClick={() => handleSelectTf(item.id, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      currentVal === false
                        ? hasAnswered
                          ? !isCorrectAnswer
                            ? 'bg-emerald-600 border-emerald-400 text-white'
                            : 'bg-rose-600 border-rose-400 text-white'
                          : 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    SAI
                  </button>
                </div>
              </div>
            );
          })}

          {!hasAnswered && (
            <button
              onClick={handleSubmitTf}
              disabled={!allTfSelected}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                allTfSelected
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              Xác Nhận 4 Ý Đúng / Sai
            </button>
          )}
        </div>
      )}

      {/* 3. Short Answer (Nhập kết quả số / biểu thức) */}
      {currentQ.dang === 'short_answer' && (
        <div className="my-4 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              disabled={hasAnswered}
              placeholder="Nhập giá trị số (Ví dụ: 3, -2, 15, 8.4)..."
              value={shortAnswerInput}
              onChange={(e) => setShortAnswerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmitShortAnswer();
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-indigo-500"
            />
            {!hasAnswered && (
              <button
                onClick={handleSubmitShortAnswer}
                disabled={!shortAnswerInput.trim()}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  shortAnswerInput.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                Gửi Đáp Án
              </button>
            )}
          </div>

          {/* Quick On-Screen Math Keypad Helpers */}
          {!hasAnswered && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Bàn phím nhanh:</span>
              {['-', '.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => {
                    soundManager.playClick();
                    setShortAnswerInput((prev) => prev + sym);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold border border-slate-700 cursor-pointer"
                >
                  {sym}
                </button>
              ))}
              <button
                onClick={() => setShortAnswerInput('')}
                className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium border border-rose-800/60 cursor-pointer"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Steps Order (Sắp xếp các bước giải) */}
      {currentQ.dang === 'steps_order' && currentQ.cac_buoc_giai && (
        <div className="my-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 mb-1">
            Dùng mũi tên Lên/Xuống để sắp xếp các bước theo trình tự giải toán chính xác:
          </div>
          {stepOrder.map((stepId, index) => {
            const stepObj = currentQ.cac_buoc_giai?.find((s) => s.id === stepId);
            if (!stepObj) return null;

            return (
              <div
                key={stepId}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-slate-200 leading-snug">
                    <MathView text={stepObj.noi_dung} />
                  </span>
                </div>

                {!hasAnswered && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      disabled={index === 0}
                      onClick={() => moveStep(index, 'up')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      disabled={index === stepOrder.length - 1}
                      onClick={() => moveStep(index, 'down')}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {!hasAnswered && (
            <button
              onClick={handleSubmitStepOrder}
              className="w-full py-3 rounded-xl font-bold text-sm tracking-wide bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer transition-all mt-2"
            >
              Kiểm Tra Trình Tự Các Bước
            </button>
          )}
        </div>
      )}

      {/* Answer Evaluation, Detailed Solution & Misconception Alert */}
      {hasAnswered && (
        <div
          className={`mt-5 p-4 rounded-2xl border transition-all ${
            isCorrect
              ? 'bg-emerald-950/60 border-emerald-500/50'
              : 'bg-rose-950/60 border-rose-500/50'
          }`}
        >
          {/* Status Bar */}
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <h4 className="text-base font-bold text-emerald-300">
                  Chính Xác! +100 Điểm {streak > 1 ? `(Chuỗi ×${streak})` : ''}
                </h4>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-rose-300">Chưa Đúng Rồi!</h4>
                  <p className="text-xs text-rose-200/80">Đáp án chính xác: {currentQ.dap_an_hien_thi}</p>
                </div>
              </>
            )}
          </div>

          {/* Common Pitfall Note (Cảnh báo lỗi thường gặp) */}
          {currentQ.loi_thuong_gap && (
            <div className="p-3 mb-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200">
                <strong className="text-amber-300">Bẫy sai lầm cần nhớ: </strong>
                {currentQ.loi_thuong_gap}
              </div>
            </div>
          )}

          {/* Detailed step-by-step solution */}
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-300 text-xs uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              Lời Giải Chi Tiết Từng Bước
            </div>
            {currentQ.loi_giai.map((step, sIdx) => (
              <div key={sIdx} className="leading-relaxed">
                <MathView text={step} />
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
            >
              <span>{currentIndex + 1 < questions.length && hearts > 0 ? 'Câu Tiếp Theo' : 'Xem Kết Quả'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
