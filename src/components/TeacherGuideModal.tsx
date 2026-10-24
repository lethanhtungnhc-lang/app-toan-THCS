import React, { useState } from 'react';
import {
  FileText,
  Globe,
  QrCode,
  Smartphone,
  Shield,
  ExternalLink,
  Copy,
  Check,
  X
} from 'lucide-react';

interface TeacherGuideModalProps {
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Cẩm Nang Triển Khai Cho Giáo Viên & Nhà Trường
              </h3>
              <p className="text-xs text-slate-400">
                Toán 9 THCS • Chuẩn hóa GDPT 2018, Thông tư 22 & Công văn 7991
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {/* Section A: Chạy thử trên máy tính */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" />
              (a) Chạy thử & Trình chiếu trên máy tính lớp học
            </h4>
            <p>
              Giáo viên mở ứng dụng trực tiếp trên trình duyệt Chrome, Edge, Safari hoặc Firefox. Ứng dụng tự động điều chỉnh độ phân giải, hiển thị rõ nét trên màn hình chiếu, tivi thông minh hoặc bảng tương tác thông minh.
            </p>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-indigo-300 truncate">{window.location.href}</span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép link'}</span>
              </button>
            </div>
          </div>

          {/* Section B: Đưa lên website trường & Tạo mã QR */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4 text-amber-400" />
              (b & c) Đưa lên Website trường & Tạo mã QR cho học sinh quét
            </h4>
            <p>
              Ứng dụng được xây dựng theo kiến trúc SPA hiện đại. Thầy/cô có thể triển khai lên <strong>GitHub Pages, Vercel, Netlify hoặc Hosting trường</strong> hoàn toàn miễn phí chỉ với 1 lệnh:
            </p>
            <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
              npm run build
            </pre>
            <p>
              Thư mục <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">dist</code> xuất ra có thể đưa lên bất kỳ máy chủ nào. Để tạo mã QR cho học sinh quét bằng camera điện thoại, thầy/cô truy cập <code className="text-sky-300">qr-code-generator.com</code> dán đường link website vào và in dán ở bảng tin lớp học.
            </p>
          </div>

          {/* Section D: Đóng gói PWA & App Android / iOS */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              (d) Cài đặt PWA & Xuất bản App Android (APK/AAB) / iOS
            </h4>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              <li>
                <strong>Cài PWA trực tiếp (Khuyên dùng - Nhanh & Miễn phí):</strong> Trên điện thoại học sinh (Android/iOS), mở trình duyệt Chrome hoặc Safari, nhấn nút <em>"Thêm vào Màn hình chính" (Add to Home Screen)</em>. Ứng dụng sẽ xuất hiện như app native, lưu bộ nhớ đệm và <strong>chạy mượt mà offline</strong> mà không tốn dung lượng 4G!
              </li>
              <li>
                <strong>Đóng gói APK bằng Capacitor (Nếu cần xuất file cài đặt):</strong>
                <pre className="p-2.5 bg-slate-950 text-sky-300 font-mono text-xs rounded border border-slate-800 mt-1">
                  npm install @capacitor/core @capacitor/cli @capacitor/android{'\n'}
                  npx cap init "DaoToan9" "vn.edu.nguyenhuucanh.daotoan9"{'\n'}
                  npx cap add android{'\n'}
                  npx cap open android
                </pre>
                <em>Lưu ý: Nếu đưa lên Google Play Store hoặc Apple App Store sẽ cần tài khoản Google Play Developer ($25 một lần) hoặc Apple Developer ($99/năm). Phương án PWA là tối ưu nhất cho nhà trường.</em>
              </li>
            </ul>
          </div>

          {/* Section E: An toàn & Quyền riêng tư theo Thông tư 22 */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              (e) An toàn, bảo mật & Đạo đức giáo dục
            </h4>
            <p>
              Học sinh là đối tượng dưới 16 tuổi. Ứng dụng <strong>KHÔNG</strong> thu thập bất kỳ thông tin cá nhân nhạy cảm nào (không hỏi số điện thoại, email, địa chỉ). Mọi tiến độ lưu trên trình duyệt cục bộ (localStorage). Bảng điểm đối kháng chỉ dùng để khích lệ sự tiến bộ, không bêu tên học sinh làm sai theo đúng tinh thần nhân văn của Thông tư 22.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-amber-300 font-semibold">
            Bản quyền tác giả & chuyên môn: Teacher Lê Thanh Tùng – Email: lethanhtungnhc@gmail.com
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
          >
            Đóng Cẩm Nang
          </button>
        </div>
      </div>
    </div>
  );
};
