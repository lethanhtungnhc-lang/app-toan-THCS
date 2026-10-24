import React, { useState } from 'react';
import {
  User,
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  X,
  GraduationCap,
  ArrowRight,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { StudentAccount } from '../types';
import { CLASS_LIST } from '../data/initialSubmissions';
import { soundManager } from '../utils/soundEffects';

const REGISTERED_STUDENTS_KEY = 'dao_toan_9_registered_students';

interface StudentAuthModalProps {
  onSuccess: (student: StudentAccount) => void;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  onSuccess,
  onClose,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);

  // Form states
  const [fullName, setFullName] = useState('');
  const [selectedClass, setSelectedClass] = useState('9/1');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Vui lòng nhập Họ và Tên của bạn.');
      soundManager.playIncorrect();
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setErrorMessage('Tên đăng nhập / Mã HS phải có ít nhất 3 ký tự.');
      soundManager.playIncorrect();
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Mật khẩu phải có ít nhất 4 ký tự.');
      soundManager.playIncorrect();
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      soundManager.playIncorrect();
      return;
    }

    try {
      const existing: StudentAccount[] = JSON.parse(
        localStorage.getItem(REGISTERED_STUDENTS_KEY) || '[]'
      );

      const isTaken = existing.some(
        (s) => s.username.toLowerCase() === username.trim().toLowerCase()
      );
      if (isTaken) {
        setErrorMessage('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác.');
        soundManager.playIncorrect();
        return;
      }

      const newStudent: StudentAccount = {
        id: 'std_' + Date.now(),
        name: fullName.trim(),
        username: username.trim(),
        password: password,
        className: selectedClass,
        studentCode: `HS-${selectedClass}-${Math.floor(10 + Math.random() * 90)}`,
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem(
        REGISTERED_STUDENTS_KEY,
        JSON.stringify([...existing, newStudent])
      );

      soundManager.playLevelComplete();
      setSuccessMessage('Đăng ký tài khoản thành công! Đang đăng nhập...');
      setTimeout(() => {
        onSuccess(newStudent);
      }, 700);
    } catch {
      setErrorMessage('Có lỗi xảy ra khi lưu tài khoản. Vui lòng thử lại.');
    }
  };

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập Tên đăng nhập hoặc Mã học sinh.');
      soundManager.playIncorrect();
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập Mật khẩu.');
      soundManager.playIncorrect();
      return;
    }

    try {
      const existing: StudentAccount[] = JSON.parse(
        localStorage.getItem(REGISTERED_STUDENTS_KEY) || '[]'
      );

      const found = existing.find(
        (s) =>
          s.username.toLowerCase() === username.trim().toLowerCase() &&
          s.password === password
      );

      if (found) {
        soundManager.playCorrect();
        onSuccess(found);
      } else {
        // Allow instant guest/convenience login for demo if username matches without strict fail
        setErrorMessage('Tên đăng nhập hoặc mật khẩu chưa chính xác. Nếu chưa có tài khoản, em vui lòng bấm nút "Đăng Ký".');
        soundManager.playIncorrect();
      }
    } catch {
      setErrorMessage('Có lỗi xảy ra trong quá trình đăng nhập.');
    }
  };

  // Quick Demo Student Fill
  const handleUseDemoAccount = (demoClass: string = '9/1') => {
    const demoStudent: StudentAccount = {
      id: 'demo_' + Date.now(),
      name: `Học Sinh Lớp ${demoClass}`,
      username: `hs_${demoClass.replace('/', '_')}`,
      className: demoClass,
      studentCode: `HS-${demoClass}-01`,
      registeredAt: new Date().toISOString(),
    };
    soundManager.playCorrect();
    onSuccess(demoStudent);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-6 sm:p-7 text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tài Khoản Học Sinh Toán 9</h3>
              <p className="text-xs text-slate-400">Trường TH & THCS Nguyễn Hữu Cảnh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => {
              soundManager.playClick();
              setTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Đăng Ký Mới
          </button>
        </div>

        {/* Error / Success alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORM 1: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên Đăng Nhập hoặc Mã Học Sinh:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: nam_91 hoặc HS-9/1-01"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mật Khẩu Cá Nhân:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu của em..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer transition-all mt-2"
            >
              Đăng Nhập Vào Học
            </button>

            {/* Quick Demo Student Option */}
            <div className="pt-2 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-400">Hoặc vào nhanh để trải nghiệm:</span>
              <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                {CLASS_LIST.slice(0, 5).map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleUseDemoAccount(cls)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                  >
                    Vào Lớp {cls}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* FORM 2: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Họ và Tên Học Sinh:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nguyễn Văn An"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lớp Học (Khối 9):
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {CLASS_LIST.map((cls) => (
                  <option key={cls} value={cls}>
                    Lớp {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tên Đăng Nhập (hoặc Mã HS tự chọn):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: vanan_91 hoặc hs9102"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mật Khẩu:
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mật khẩu..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Xác Nhận Mật Khẩu:
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập lại..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer transition-all mt-2"
            >
              Đăng Ký Tài Khoản Lớp {selectedClass}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 border-t border-slate-800 pt-3">
          Bản quyền: Teacher Lê Thanh Tùng • Trường TH & THCS Nguyễn Hữu Cảnh
        </div>
      </div>
    </div>
  );
};
