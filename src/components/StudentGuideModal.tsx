import React from 'react';
import { BookOpen, Sparkles, Heart, Zap, ShieldCheck, X } from 'lucide-react';

interface StudentGuideModalProps {
  onClose: () => void;
}

export const StudentGuideModal: React.FC<StudentGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sổ Tay Thám Hiểm Toán 9</h3>
              <p className="text-xs text-slate-400">Dành cho học sinh lớp 9 ôn thi Giữa Kì I</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. Mục Tiêu Cuộc Thám Hiểm
            </h4>
            <p>
              Bạn sẽ hóa thân thành một trong bốn Nhà thám hiểm trẻ (Minh Trí, Ánh Dương, Bảo Long, Thảo Vy) cùng Trợ lý Cú Pi vượt qua 3 vùng đất Toán học để thu thập 3 Viên ngọc Tri thức:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-slate-200">
              <li><strong>Vùng 1 (Thung lũng Hệ phương trình):</strong> Ôn phương pháp thế, cộng đại số và bài toán chuyển động, năng suất thực tế.</li>
              <li><strong>Vùng 2 (Rừng Bất đẳng thức):</strong> Luyện phương trình tích, phân thức (nhớ ĐKXĐ) và quy tắc đổi chiều khi chia số âm.</li>
              <li><strong>Vùng 3 (Núi Tam giác vuông):</strong> Thành thạo sin, cos, tan, cot và đo chiều cao cây, tháp, thang thực tế.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-400" />
              2. Cơ Chế Mạng & Phao Cứu Sinh
            </h4>
            <p>
              Mỗi màn chơi bạn có 3 "Trái tim". Nếu gặp câu hỏi khó, đừng lo lắng, bạn có 2 quyền trợ giúp hữu ích:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-indigo-300">Phao 50:50:</span> Loại bỏ ngay 2 phương án sai trong câu trắc nghiệm.
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-300">Bí kíp Cú Pi:</span> Cú Pi sẽ nhắc lại công thức chìa khóa mà không làm lộ đáp án.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              3. Phòng Sửa Lỗi - Bí Quyết Điểm 10
            </h4>
            <p>
              Khi làm sai, câu hỏi sẽ được chuyển vào <strong>Phòng Sửa Lỗi</strong>. Tại đây bạn được đọc cặn kẽ vì sao mình sai và luyện tập lại cho đến khi thành thạo. Bạn sẽ nhận được huy hiệu "Sửa Lỗi Xuất Sắc"!
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-amber-300 font-semibold">
            Bản quyền tác giả & thiết kế trò chơi: Teacher Lê Thanh Tùng – TH & THCS Nguyễn Hữu Cảnh
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            Đã Hiểu, Sẵn Sàng Thám Hiểm!
          </button>
        </div>
      </div>
    </div>
  );
};
