import React from 'react';
import {
  ShieldAlert,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Question } from '../types';
import { QUESTIONS_BANK } from '../data/questionsData';
import { MathView } from './MathView';
import { soundManager } from '../utils/soundEffects';

interface ErrorClinicProps {
  mistakeIds: string[];
  onStartRemedialQuiz: (questions: Question[]) => void;
  onClose: () => void;
}

export const ErrorClinic: React.FC<ErrorClinicProps> = ({
  mistakeIds,
  onStartRemedialQuiz,
  onClose,
}) => {
  const missedQuestions = QUESTIONS_BANK.filter((q) => mistakeIds.includes(q.id));

  // Categorize mistakes by common topics
  const categorizedMistakes = {
    he_phuong_trinh: missedQuestions.filter((q) => q.chuong === 1),
    bat_dang_thuc: missedQuestions.filter((q) => q.chuong === 2),
    luong_giac: missedQuestions.filter((q) => q.chuong === 4),
  };

  const handleStartPractice = () => {
    soundManager.playClick();
    if (missedQuestions.length > 0) {
      onStartRemedialQuiz(missedQuestions);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-rose-500/30 shadow-2xl text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              Phòng Sửa Lỗi Toán Học
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 font-semibold">
                Đánh giá vì sự tiến bộ
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Phân tích cặn kẽ các bẫy tư duy học sinh thường mắc phải và hỗ trợ luyện tập khắc phục.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Trở Lại Bản Đồ
        </button>
      </div>

      {missedQuestions.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Tuyệt Vời! Danh Sách Đang Trống</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Bạn chưa mắc lỗi nào hoặc đã sửa đúng tất cả các câu trước đó. Hãy tiếp tục giữ vững phong độ nhé!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Quick Action Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Có {missedQuestions.length} câu hỏi bạn cần ôn luyện lại
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Làm đúng lại các câu này sẽ giúp bạn nhận huy hiệu "Sửa Lỗi Xuất Sắc"!
              </p>
            </div>
            <button
              onClick={handleStartPractice}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Luyện Tập Lại Ngay</span>
            </button>
          </div>

          {/* Detailed Error Cards */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Chi Tiết Từng Câu Lỗi & Bẫy Sai Thường Gặp
            </h3>

            {missedQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-950 text-rose-300 font-bold text-xs flex items-center justify-center border border-rose-500/30">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/30">
                      {q.bai_ten}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Mức độ: {q.muc_do === 'biet' ? 'Nhận biết' : q.muc_do === 'hieu' ? 'Thông hiểu' : 'Vận dụng'}
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-200">
                  <MathView text={q.de_bai} />
                </div>
                {q.de_bai_latex && (
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-indigo-200 text-xs overflow-x-auto">
                    <MathView math={q.de_bai_latex} display={true} />
                  </div>
                )}

                {/* Common Trap Alert */}
                {q.loi_thuong_gap && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-200">
                      <strong className="text-amber-300">Phân tích sai lầm: </strong>
                      {q.loi_thuong_gap}
                    </div>
                  </div>
                )}

                {/* Owl Advice */}
                {q.goi_y && (
                  <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-500/20 flex items-center gap-2 text-xs text-indigo-200">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span><strong>Mẹo Cú Pi:</strong> {q.goi_y}</span>
                  </div>
                )}

                {/* Step Solution */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Đáp án đúng & Cách giải chuẩn: {q.dap_an_hien_thi}</span>
                  </div>
                  {q.loi_giai.map((step, sIdx) => (
                    <div key={sIdx} className="leading-relaxed">
                      <MathView text={step} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
