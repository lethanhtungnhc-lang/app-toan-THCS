export type CognitiveLevel = 'biet' | 'hieu' | 'van_dung';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'steps_order';

export type Competency =
  | 'tu_duy'        // Năng lực tư duy và lập luận toán học
  | 'mo_hinh_hoa'    // Năng lực mô hình hoá toán học
  | 'giai_quyet_vd'  // Năng lực giải quyết vấn đề toán học
  | 'giao_tiep'      // Năng lực giao tiếp toán học
  | 'cong_cu';       // Năng lực sử dụng công cụ, phương tiện học toán

export interface TrueFalseSubItem {
  id: string;
  label: 'a' | 'b' | 'c' | 'd';
  noi_dung: string;
  la_dung: boolean;
  giai_thich: string;
}

export interface StepItem {
  id: string;
  noi_dung: string;
  thu_tu_dung: number;
}

export interface GeometryVisual {
  type: 'tam_giac_vuong' | 'cot_co' | 'thang_dua_tuong' | 'ngon_hai_dang' | 'he_truc' | 'doc_nui';
  params: {
    canhGocVuong1?: number; // AC
    canhGocVuong2?: number; // AB
    canhHuyen?: number;     // BC
    gocB?: number;          // degrees
    gocC?: number;
    gocNang?: number;
    chieuCao?: number;
    khoangCach?: number;
    chieuDaiThang?: number;
    tenDiemA?: string;
    tenDiemB?: string;
    tenDiemC?: string;
    chuThich?: string;
  };
}

export interface Question {
  id: string;
  chuong: 1 | 2 | 4;
  bai: 1 | 2 | 3 | 4 | 5 | 6 | 11 | 12;
  bai_ten: string;
  muc_do: CognitiveLevel;
  dang: QuestionType;
  nang_luc: Competency;
  thoi_gian_giay: number;
  de_bai: string;
  de_bai_latex: string;
  lua_chon?: string[];          // Dành cho multiple_choice (A, B, C, D)
  dap_an_dung: number | string | boolean[]; // Index for multiple_choice, value for short_answer, boolean[] for true_false
  dap_an_hien_thi: string;
  loi_giai: string[];
  goi_y: string;                // Bí kíp Cú Pi
  loi_thuong_gap: string;       // Bẫy sai lầm học sinh hay mắc
  la_thuc_te?: boolean;         // Bài toán thực tế chuyển động, năng suất, đo đạc
  hinh_ve?: GeometryVisual;
  y_dung_sai?: TrueFalseSubItem[];
  cac_buoc_giai?: StepItem[];
}

export interface ZoneStage {
  id: string;
  name: string;
  subtitle: string;
  level: CognitiveLevel | 'thuc_te';
  questionIds: string[];
  requiredStars: number;
}

export interface GameZone {
  id: 'valley' | 'forest' | 'mountain' | 'boss';
  chapter: number;
  name: string;
  vietnameseName: string;
  themeColor: string;
  bgColor: string;
  description: string;
  monsterName: string;
  monsterDesc: string;
  gemName: string;
  stages: ZoneStage[];
}

export interface PlayerCharacter {
  id: 'tri' | 'duong' | 'long' | 'vy';
  name: string;
  gender: 'nam' | 'nu';
  role: string;
  bio: string;
  color: string;
  secondaryColor: string;
  hatType: 'adventurer' | 'scholar' | 'cap' | 'headband';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserProgress {
  playerName: string;
  characterId: 'tri' | 'duong' | 'long' | 'vy';
  stars: number;
  completedStages: Record<string, { stars: number; score: number; perfect: boolean }>;
  gems: {
    chuong1: boolean;
    chuong2: boolean;
    chuong4: boolean;
    bossDefeated: boolean;
  };
  lifelines: {
    fiftyFifty: number;
    owlHint: number;
    skip: number;
  };
  badges: Badge[];
  incorrectQuestionIds: string[];
  correctQuestionIds: string[];
  streakRecord: number;
  totalTimeSeconds: number;
  lastPlayedAt: string;
  soundEnabled: boolean;
  lowGraphicsMode: boolean;
}

export interface ClassroomTeam {
  id: number;
  name: string;
  color: string;
  score: number;
  streak: number;
  answeredCount: number;
  correctCount: number;
}

export interface StudentSubmission {
  id: string;
  name: string;
  studentCode: string;
  className: string;
  examTitle: string;
  score10: number;
  correctCount: number;
  totalQuestions: number;
  durationMinutes: number;
  completedAt: string;
  circular22Level: 'Tốt' | 'Khá' | 'Đạt' | 'Cần cố gắng';
  circular22Comment: string;
}

export interface StudentAccount {
  id: string;
  name: string;
  username: string;
  password?: string;
  className: string;
  studentCode?: string;
  registeredAt: string;
}

