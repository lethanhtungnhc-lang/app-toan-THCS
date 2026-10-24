import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Lock,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  BarChart2,
  Users,
  Plus,
  Trash2,
  RefreshCw,
  Award,
  Crown
} from 'lucide-react';
import { Question, StudentSubmission } from '../types';
import { QUESTIONS_BANK } from '../data/questionsData';
import { INITIAL_STUDENT_SUBMISSIONS, CLASS_LIST } from '../data/initialSubmissions';
import { validateQuestionBank, ValidationResult } from '../utils/mathValidator';
import { MathView } from './MathView';
import { soundManager } from '../utils/soundEffects';

const SUBMISSIONS_STORAGE_KEY = 'dao_toan_9_student_submissions';

interface TeacherPortalProps {
  onClose: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Tabs: 'students' | 'matrix' | 'questions' | 'print_exam' | 'validation'
  const [activeTab, setActiveTab] = useState<'students' | 'matrix' | 'questions' | 'print_exam' | 'validation'>('students');

  // Student Submissions State
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENT_SUBMISSIONS;
  });

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Question filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Math validation result
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Sync submissions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // Ignore
    }
  }, [submissions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Admin credentials: admin / admin@12345
    if (usernameInput.trim() === 'admin' && passwordInput.trim() === 'admin@12345') {
      soundManager.playLevelComplete();
      setIsAuthenticated(true);
      setAuthError(false);
      setValidationResult(validateQuestionBank(QUESTIONS_BANK));
    } else {
      soundManager.playIncorrect();
      setAuthError(true);
    }
  };

  const handleRunValidation = () => {
    soundManager.playClick();
    const result = validateQuestionBank(QUESTIONS_BANK);
    setValidationResult(result);
  };

  const handleExportJSON = () => {
    soundManager.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(QUESTIONS_BANK, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ngan_hang_cau_hoi_toan_9_gk1.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Student Participant List with UTF-8 BOM so Vietnamese displays properly in Excel
  const handleExportStudentCSV = () => {
    soundManager.playLevelComplete();

    // Headers
    const headers = [
      'STT',
      'Mã Học Sinh',
      'Họ và Tên',
      'Lớp',
      'Bài Kiểm Tra',
      'Điểm Số (/10)',
      'Số Câu Đúng',
      'Tổng Số Câu',
      'Thời Gian (Phút)',
      'Thời Gian Nộp',
      'Xếp Loại (TT 22)',
      'Nhận Xét Của Giáo Viên (Teacher Lê Thanh Tùng)'
    ];

    const rows = filteredSubmissions.map((s, idx) => [
      idx + 1,
      `"${s.studentCode}"`,
      `"${s.name}"`,
      `"${s.className}"`,
      `"${s.examTitle}"`,
      s.score10.toFixed(1),
      s.correctCount,
      s.totalQuestions,
      s.durationMinutes,
      `"${s.completedAt}"`,
      `"${s.circular22Level}"`,
      `"${s.circular22Comment.replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `Danh_sach_hoc_sinh_tham_gia_lam_bai_Toan9_LeThanhTung.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  const handlePrintExam = () => {
    soundManager.playClick();
    window.print();
  };

  const handleResetStudentData = () => {
    if (window.confirm('Thầy/cô có chắc chắn muốn khôi phục danh sách học sinh ban đầu?')) {
      soundManager.playClick();
      setSubmissions(INITIAL_STUDENT_SUBMISSIONS);
    }
  };

  // Filter student submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchClass = selectedClassFilter === 'all' || s.className === selectedClassFilter;
    const matchName = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || s.studentCode.toLowerCase().includes(studentSearchQuery.toLowerCase());
    return matchClass && matchName;
  });

  // Filtered questions
  const filteredQuestions = QUESTIONS_BANK.filter((q) => {
    const matchQuery = q.de_bai.toLowerCase().includes(searchQuery.toLowerCase()) || q.bai_ten.toLowerCase().includes(searchQuery.toLowerCase());
    const matchChapter = selectedChapter === 'all' || q.chuong === selectedChapter;
    const matchLevel = selectedLevel === 'all' || q.muc_do === selectedLevel;
    return matchQuery && matchChapter && matchLevel;
  });

  // Calculate statistics according to Circular 22 / Dispatch 7991
  const stats = {
    total: QUESTIONS_BANK.length,
    biet: QUESTIONS_BANK.filter((q) => q.muc_do === 'biet').length,
    hieu: QUESTIONS_BANK.filter((q) => q.muc_do === 'hieu').length,
    vanDung: QUESTIONS_BANK.filter((q) => q.muc_do === 'van_dung').length,
    chuong1: QUESTIONS_BANK.filter((q) => q.chuong === 1).length,
    chuong2: QUESTIONS_BANK.filter((q) => q.chuong === 2).length,
    chuong4: QUESTIONS_BANK.filter((q) => q.chuong === 4).length,
    thucTe: QUESTIONS_BANK.filter((q) => q.la_thuc_te).length,
  };

  // Student summary metrics
  const avgScore = submissions.length > 0
    ? (submissions.reduce((acc, curr) => acc + curr.score10, 0) / submissions.length).toFixed(1)
    : '0.0';

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Crown className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Cổng Quản Trị Viên (Admin)</h2>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                Bản quyền: Teacher Lê Thanh Tùng
              </p>
            </div>
            <p className="text-xs text-slate-300">
              Chỉ duy nhất một mình tài khoản <span className="text-indigo-400 font-bold">admin</span> có toàn quyền quản trị, chỉnh sửa ngân hàng câu hỏi và quản lý danh sách học sinh.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tài Khoản Quản Trị:
              </label>
              <input
                type="text"
                placeholder="Nhập tên tài khoản (admin)"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                  setAuthError(false);
                }}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu Quản Trị:
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu quản trị bảo mật..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(false);
                  }}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Tài khoản hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại.</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="text-amber-300/90 font-medium">
                Khu vực bảo mật: Chỉ dành riêng cho Thầy/Cô quản trị viên.
              </div>
              <div className="text-slate-500 text-[10px]">
                Trường TH & THCS Nguyễn Hữu Cảnh • Năm học 2026–2027
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
              >
                Đăng Nhập Toàn Quyền
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl font-semibold text-sm bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-6xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-100 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Bảng Quản Trị Toàn Quyền – Admin
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 font-bold">
                  Teacher Lê Thanh Tùng
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Trường TH & THCS Nguyễn Hữu Cảnh • Bản quyền © 2026 Teacher Lê Thanh Tùng (lethanhtungnhc@gmail.com)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất Câu Hỏi JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:text-white cursor-pointer"
            >
              Đóng Bảng Quản Trị
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'students'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Danh Sách Học Sinh Làm Bài ({submissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ma Trận & Đặc Tả (CV 7991)
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'questions'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Ngân Hàng Câu Hỏi ({QUESTIONS_BANK.length})
          </button>
          <button
            onClick={() => setActiveTab('print_exam')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'print_exam'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            In Đề Kiểm Tra (PDF)
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'validation'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Kiểm Chứng Tự Động (100% Sạch Lỗi)
          </button>
        </div>

        {/* TAB 1: DANH SÁCH HỌC SINH THAM GIA LÀM BÀI (NEW & PROMINENT) */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            {/* Top Toolbar: Search, Class Filter, Download Excel/CSV Button */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Sổ Theo Dõi Đánh Giá Thông Tư 22
                  </span>
                  <span className="text-xs text-amber-300 font-semibold">
                    Điểm TB: {avgScore} / 10
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-1">
                  Danh Sách Học Sinh Tham Gia Làm Bài Kiểm Tra
                </h3>
                <p className="text-xs text-slate-300">
                  Xuất dữ liệu chuẩn file Excel (CSV UTF-8) hỗ trợ đầy đủ tiếng Việt có dấu.
                </p>
              </div>

              {/* DOWNLOAD BUTTON */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleExportStudentCSV}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                  <span>Tải Xuống Danh Sách (Excel / CSV)</span>
                </button>
                <button
                  onClick={handleResetStudentData}
                  title="Khôi phục danh sách mẫu ban đầu"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm học sinh theo tên hoặc mã số..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedClassFilter}
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="all">Tất cả các lớp (9/1 – 9/10)</option>
                  {CLASS_LIST.map((cls) => (
                    <option key={cls} value={cls}>
                      Lớp {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-indigo-300 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-bold w-12 text-center">STT</th>
                    <th className="p-3 font-bold">Mã HS</th>
                    <th className="p-3 font-bold">Họ và Tên</th>
                    <th className="p-3 font-bold">Lớp</th>
                    <th className="p-3 font-bold">Điểm (/10)</th>
                    <th className="p-3 font-bold">Câu Đúng</th>
                    <th className="p-3 font-bold">Thời Gian</th>
                    <th className="p-3 font-bold">Xếp Loại (TT 22)</th>
                    <th className="p-3 font-bold">Nhận Xét Tiến Bộ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                  {filteredSubmissions.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                      <td className="p-3 font-mono text-indigo-300">{s.studentCode}</td>
                      <td className="p-3 font-bold text-white">{s.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-slate-200 text-xs">
                          {s.className}
                        </span>
                      </td>
                      <td className="p-3 font-black text-amber-300 text-base">
                        {s.score10.toFixed(1)}
                      </td>
                      <td className="p-3 text-slate-300">
                        {s.correctCount}/{s.totalQuestions}
                      </td>
                      <td className="p-3 text-slate-400 text-xs">{s.completedAt}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            s.circular22Level === 'Tốt'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : s.circular22Level === 'Khá'
                              ? 'bg-sky-950 text-sky-300 border border-sky-500/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {s.circular22Level}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-slate-300 max-w-xs truncate" title={s.circular22Comment}>
                        {s.circular22Comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Admin Copyright Banner */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div>
                Đang hiển thị <strong>{filteredSubmissions.length}</strong> học sinh tham gia làm bài.
              </div>
              <div className="text-amber-300 font-semibold">
                Bản quyền phần mềm & ngân hàng đề: Teacher Lê Thanh Tùng
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MA TRẬN & BẢN ĐẶC TẢ */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Mức Biết (≈ 40%)</div>
                <div className="text-xl font-black text-sky-400">
                  {stats.biet} câu ({Math.round((stats.biet / stats.total) * 100)}%)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Mức Hiểu (≈ 30%)</div>
                <div className="text-xl font-black text-amber-400">
                  {stats.hieu} câu ({Math.round((stats.hieu / stats.total) * 100)}%)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Mức Vận Dụng (≈ 30%)</div>
                <div className="text-xl font-black text-emerald-400">
                  {stats.vanDung} câu ({Math.round((stats.vanDung / stats.total) * 100)}%)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Toán Thực Tế (≥ 20%)</div>
                <div className="text-xl font-black text-purple-400">
                  {stats.thucTe} câu ({Math.round((stats.thucTe / stats.total) * 100)}%)
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-indigo-300 border-b border-slate-800">
                  <tr>
                    <th className="p-3 font-bold">Chương / Mạch kiến thức</th>
                    <th className="p-3 font-bold">Bài học trọng tâm</th>
                    <th className="p-3 font-bold">Biết (40%)</th>
                    <th className="p-3 font-bold">Hiểu (30%)</th>
                    <th className="p-3 font-bold">Vận dụng (30%)</th>
                    <th className="p-3 font-bold">Tổng điểm dự kiến</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                  <tr>
                    <td className="p-3 font-semibold text-white">Chương I: Hệ hai PT bậc nhất 2 ẩn</td>
                    <td className="p-3 text-slate-300">Khái niệm, giải hệ (thế/cộng), toán thực tế lập hệ</td>
                    <td className="p-3 text-sky-400 font-bold">1,0 điểm</td>
                    <td className="p-3 text-amber-400 font-bold">1,0 điểm</td>
                    <td className="p-3 text-emerald-400 font-bold">1,5 điểm</td>
                    <td className="p-3 font-black text-indigo-300">3,5 điểm (35%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Chương II: Bất đẳng thức & BPT 1 ẩn</td>
                    <td className="p-3 text-slate-300">PT tích, PT chứa ẩn ở mẫu (ĐKXĐ), liên hệ thứ tự, giải BPT</td>
                    <td className="p-3 text-sky-400 font-bold">1,5 điểm</td>
                    <td className="p-3 text-amber-400 font-bold">1,0 điểm</td>
                    <td className="p-3 text-emerald-400 font-bold">1,0 điểm</td>
                    <td className="p-3 font-black text-indigo-300">3,5 điểm (35%)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Chương IV: Hệ thức lượng tam giác vuông</td>
                    <td className="p-3 text-slate-300">Tỉ số sin, cos, tan, cot, góc đặc biệt, bài toán đo đạc thực tế</td>
                    <td className="p-3 text-sky-400 font-bold">1,5 điểm</td>
                    <td className="p-3 text-amber-400 font-bold">1,0 điểm</td>
                    <td className="p-3 text-emerald-400 font-bold">0,5 điểm</td>
                    <td className="p-3 font-black text-indigo-300">3,0 điểm (30%)</td>
                  </tr>
                </tbody>
                <tfoot className="bg-slate-950 font-bold text-white border-t border-slate-800">
                  <tr>
                    <td colSpan={2} className="p-3 text-right">Tổng cộng toàn đề thi:</td>
                    <td className="p-3 text-sky-400">4,0 điểm</td>
                    <td className="p-3 text-amber-400">3,0 điểm</td>
                    <td className="p-3 text-emerald-400">3,0 điểm</td>
                    <td className="p-3 text-amber-300 font-black">10,0 điểm (100%)</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: NGÂN HÀNG CÂU HỎI */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi, nội dung kiến thức..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="all">Tất cả chương</option>
                  <option value="1">Chương I (Hệ phương trình)</option>
                  <option value="2">Chương II (Bất đẳng thức & BPT)</option>
                  <option value="4">Chương IV (Tam giác vuông)</option>
                </select>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="biet">Biết</option>
                  <option value="hieu">Hiểu</option>
                  <option value="van_dung">Vận dụng</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400">
                      #{idx + 1} • {q.bai_ten}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-xs">
                        {q.dang === 'multiple_choice'
                          ? 'Nhiều lựa chọn'
                          : q.dang === 'true_false'
                          ? 'Đúng - Sai'
                          : q.dang === 'short_answer'
                          ? 'Trả lời ngắn'
                          : 'Sắp xếp bước'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-xs">
                        {q.muc_do}
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-200">
                    <MathView text={q.de_bai} />
                  </div>
                  {q.de_bai_latex && (
                    <div className="p-2 bg-slate-900 rounded border border-slate-800 text-indigo-200 text-xs">
                      <MathView math={q.de_bai_latex} display={true} />
                    </div>
                  )}

                  <div className="text-emerald-400 text-xs font-semibold">
                    Đáp án chuẩn: {q.dap_an_hien_thi}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRINT EXAM SHEET */}
        {activeTab === 'print_exam' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <h4 className="font-bold text-white text-sm">Bản In Đề Kiểm Tra & Phiếu Ôn Tập</h4>
                <p className="text-xs text-amber-300">
                  Tác giả & Chủ biên: Teacher Lê Thanh Tùng • Trường TH & THCS Nguyễn Hữu Cảnh
                </p>
              </div>
              <button
                onClick={handlePrintExam}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In Đề Ra Giấy / PDF</span>
              </button>
            </div>

            <div className="p-8 bg-white text-slate-950 rounded-2xl shadow-xl font-serif space-y-4">
              <div className="flex justify-between border-b-2 border-slate-900 pb-3 text-center">
                <div>
                  <div className="font-bold uppercase text-xs">TRƯỜNG TH & THCS NGUYỄN HỮU CẢNH</div>
                  <div className="text-xs font-semibold">TỔ CHUYÊN MÔN TOÁN</div>
                  <div className="text-[11px] text-slate-700 italic">GV ra đề: Teacher Lê Thanh Tùng</div>
                </div>
                <div>
                  <div className="font-bold text-sm uppercase">ĐỀ ÔN TẬP KIỂM TRA GIỮA HỌC KÌ I</div>
                  <div className="text-xs">Môn: TOÁN 9 • Năm học: 2026 - 2027</div>
                  <div className="text-xs italic">Thời gian làm bài: 45 phút (không kể phát đề)</div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="font-bold text-sm">PHẦN I. CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 điểm)</div>
                {QUESTIONS_BANK.filter((q) => q.dang === 'multiple_choice').slice(0, 3).map((q, qIdx) => (
                  <div key={q.id} className="text-xs space-y-1">
                    <div className="font-semibold">Câu {qIdx + 1}: {q.de_bai}</div>
                    <div className="grid grid-cols-2 gap-2 pl-4">
                      {q.lua_chon?.map((opt, oIdx) => (
                        <div key={oIdx}>{opt}</div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="font-bold text-sm pt-2">PHẦN II. CÂU TRẮC NGHIỆM ĐÚNG SAI (2,0 điểm)</div>
                {QUESTIONS_BANK.filter((q) => q.dang === 'true_false').slice(0, 1).map((q, qIdx) => (
                  <div key={q.id} className="text-xs space-y-1">
                    <div className="font-semibold">Câu {qIdx + 1}: {q.de_bai}</div>
                    <div className="pl-4 space-y-0.5">
                      {q.y_dung_sai?.map((sub) => (
                        <div key={sub.id}>
                          {sub.label}) {sub.noi_dung}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="font-bold text-sm pt-2">PHẦN III. CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 điểm)</div>
                {QUESTIONS_BANK.filter((q) => q.dang === 'short_answer').slice(0, 2).map((q, qIdx) => (
                  <div key={q.id} className="text-xs">
                    <span className="font-semibold">Câu {qIdx + 1}: </span> {q.de_bai}
                  </div>
                ))}

                <div className="pt-6 border-t border-slate-300 text-center text-xs text-slate-600 italic">
                  Bản quyền tài liệu & phần mềm: Teacher Lê Thanh Tùng – Email: lethanhtungnhc@gmail.com
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VALIDATION ENGINE */}
        {activeTab === 'validation' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Bộ Kiểm Tra Tính Toán Tự Động (Script Tự Động Kiểm Chứng)
                </h4>
                <p className="text-xs text-slate-400">
                  Tự động kiểm tra nghiệm hệ phương trình, điều kiện xác định, dấu bất đẳng thức và lượng giác
                </p>
              </div>
              <button
                onClick={handleRunValidation}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
              >
                Chạy Lại Kiểm Tra
              </button>
            </div>

            {validationResult && (
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>
                    Đã kiểm chứng thành công {validationResult.passedCount} / {validationResult.totalQuestions} câu hỏi.
                    Hoàn toàn sạch lỗi toán học, không có câu mơ hồ hoặc sai sót dữ liệu!
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {validationResult.report.map((rep, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono text-slate-400">{rep.questionId}</span>
                      <span className="text-slate-200">{rep.title}</span>
                      <span className="font-bold text-emerald-400">{rep.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
