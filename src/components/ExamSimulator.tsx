import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  BookOpen,
  ArrowRight,
  RotateCcw,
  BarChart3,
  Check,
  X,
  HelpCircle,
  Edit3,
  Eye,
  EyeOff,
  Sparkles,
  Send,
  GraduationCap
} from 'lucide-react';
import { Question, StudentAccount, StudentSubmission } from '../types';
import { MathView } from './MathView';
import { soundManager } from '../utils/soundEffects';

interface ExamSimulatorProps {
  currentStudent?: StudentAccount | null;
  onFinishExam: (result: { score10: number; feedback: string }) => void;
  onExit: () => void;
  onOpenAuth?: () => void;
}

// -------------------------------------------------------------
// ĐỀ KIỂM TRA CHUẨN CÔNG VĂN 7991/BGDĐT-GDTrH & THÔNG TƯ 22
// Ma trận: Nhận biết 40% (4,0đ) - Thông hiểu 30% (3,0đ) - Vận dụng 30% (3,0đ)
// Cấu trúc 4 phần:
//   Phần I: Trắc nghiệm 4 lựa chọn (6 câu x 0.5đ = 3.0 điểm)
//   Phần II: Đúng - Sai (2 câu lớn x 1.0đ = 2.0 điểm, chuẩn barem 0.1 / 0.25 / 0.5 / 1.0)
//   Phần III: Trả lời ngắn (4 câu x 0.5đ = 2.0 điểm)
//   Phần IV: Tự luận (2 bài x 1.5đ = 3.0 điểm, có barem chi tiết từng 0.25đ/0.5đ)
// -------------------------------------------------------------

interface EssayProblem {
  id: string;
  title: string;
  points: number;
  level: 'van_dung';
  deBai: string;
  deBaiLatex?: string;
  hinhVe?: string;
  dapSoTarget: {
    label: string;
    targetValues: (string | number)[];
    unit: string;
  }[];
  steps: {
    stepNum: number;
    points: number;
    title: string;
    content: string;
    criteria: string;
  }[];
  loiGiaiMau: string[];
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  currentStudent,
  onFinishExam,
  onExit,
  onOpenAuth,
}) => {
  // Navigation active tab: 'all' | 'part1' | 'part2' | 'part3' | 'part4'
  const [activeTab, setActiveTab] = useState<'all' | 'part1' | 'part2' | 'part3' | 'part4'>('all');

  // Time remaining (45 minutes = 2700 seconds)
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Student Responses
  const [part1Answers, setPart1Answers] = useState<Record<number, number>>({});
  const [part2Answers, setPart2Answers] = useState<Record<string, Record<string, boolean>>>({});
  const [part3Answers, setPart3Answers] = useState<Record<number, string>>({});
  const [part4Answers, setPart4Answers] = useState<Record<string, { short: Record<string, string>; essayText: string }>>({
    essay_1: { short: {}, essayText: '' },
    essay_2: { short: {}, essayText: '' },
  });

  // Self-grading toggle for essay
  const [showEssayRubric, setShowEssayRubric] = useState<Record<string, boolean>>({});

  // Result state
  const [examResult, setExamResult] = useState<{
    score10: number;
    part1Score: number;
    part2Score: number;
    part3Score: number;
    part4Score: number;
    nhanBietScore: number;
    thongHieuScore: number;
    vanDungScore: number;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  // -------------------------------------------------------------
  // ĐỀ THI DỮ LIỆU CHUẨN XÁC 100% MÔN TOÁN 9 - GIỮA HỌC KÌ I
  // -------------------------------------------------------------

  // PHẦN I: Trắc nghiệm 4 lựa chọn (6 câu x 0.5đ = 3.0 điểm)
  // Nhận biết: 4 câu (2.0đ); Thông hiểu: 2 câu (1.0đ)
  const PART1_QUESTIONS = [
    {
      id: 1,
      muc_do: 'biet',
      de_bai: 'Cặp số nào sau đây là một nghiệm của phương trình 2x - 3y = 7?',
      de_bai_latex: '2x - 3y = 7',
      options: ['A. (2; -1)', 'B. (5; 1)', 'C. (1; -2)', 'D. (-1; -3)'],
      correctAnswer: 1, // B
      explain: 'Thay x = 5, y = 1 vào VT: 2.(5) - 3.(1) = 10 - 3 = 7 = VP (Thỏa mãn).'
    },
    {
      id: 2,
      muc_do: 'biet',
      de_bai: 'Phương trình nào dưới đây KHÔNG PHẢI là phương trình bậc nhất hai ẩn x và y?',
      de_bai_latex: 'ax + by = c \\quad (a^2 + b^2 \\neq 0)',
      options: ['A. 3x - 5y = 1', 'B. 0x + 4y = 8', 'C. 2x² + y = 3', 'D. -x + 0y = -9'],
      correctAnswer: 2, // C
      explain: 'Phương trình 2x² + y = 3 chứa x² (bậc 2) nên không phải là phương trình bậc nhất hai ẩn.'
    },
    {
      id: 3,
      muc_do: 'biet',
      de_bai: 'Nghiệm của phương trình tích (x - 3)(2x + 6) = 0 là:',
      de_bai_latex: '(x - 3)(2x + 6) = 0',
      options: ['A. x = 3 hoặc x = -3', 'B. x = 3 hoặc x = 3', 'C. x = -3 hoặc x = 6', 'D. x = 0 hoặc x = 3'],
      correctAnswer: 0, // A
      explain: 'x - 3 = 0 => x = 3 hoặc 2x + 6 = 0 => x = -3.'
    },
    {
      id: 4,
      muc_do: 'biet',
      de_bai: 'Điều kiện xác định của phương trình (x + 1)/(x - 2) = 3/(x + 4) là:',
      de_bai_latex: '\\frac{x + 1}{x - 2} = \\frac{3}{x + 4}',
      options: ['A. x ≠ 2 và x ≠ -4', 'B. x ≠ -2 và x ≠ 4', 'C. x ≠ 2 hoặc x ≠ -4', 'D. x ≠ -1'],
      correctAnswer: 0, // A
      explain: 'Mẫu thức khác 0: x - 2 ≠ 0 <=> x ≠ 2 và x + 4 ≠ 0 <=> x ≠ -4.'
    },
    {
      id: 5,
      muc_do: 'hieu',
      de_bai: 'Giải bất phương trình: -2x + 7 ≤ 1',
      de_bai_latex: '-2x + 7 \\le 1',
      options: ['A. x ≥ 3', 'B. x ≤ 3', 'C. x ≥ -3', 'D. x ≤ -3'],
      correctAnswer: 0, // A
      explain: '-2x ≤ 1 - 7 <=> -2x ≤ -6. Chia cả hai vế cho -2 và ĐỔI CHIỀU: x ≥ 3.'
    },
    {
      id: 6,
      muc_do: 'hieu',
      de_bai: 'Cho tam giác ABC vuông tại A. Khi đó sin B bằng tỉ số lượng giác nào sau đây?',
      de_bai_latex: '\\sin B = \\frac{\\text{cạnh đối}}{\\text{cạnh huyền}}',
      options: ['A. AC / BC', 'B. AB / BC', 'C. AC / AB', 'D. AB / AC'],
      correctAnswer: 0, // A
      explain: 'Trong tam giác vuông ABC vuông tại A, cạnh đối của góc B là AC, cạnh huyền là BC nên sin B = AC / BC.'
    }
  ];

  // PHẦN II: Trắc nghiệm Đúng - Sai (2 câu x 1.0đ = 2.0 điểm)
  // Mỗi câu gồm 4 ý a, b, c, d
  // Câu 7 (Nhận biết 1.0đ), Câu 8 (Thông hiểu 1.0đ)
  const PART2_QUESTIONS = [
    {
      id: 'q7',
      num: 7,
      muc_do: 'biet',
      de_bai: 'Cho hệ hai phương trình bậc nhất hai ẩn: { 2x + y = 5 (1); x - 2y = -5 (2) }',
      de_bai_latex: '\\begin{cases} 2x + y = 5 \\\\ x - 2y = -5 \\end{cases}',
      items: [
        { id: 'q7_a', label: 'a', text: 'Cặp số (1; 3) là nghiệm của phương trình thứ nhất 2x + y = 5.', isTrue: true, explain: '2.(1) + 3 = 5 (Đúng).' },
        { id: 'q7_b', label: 'b', text: 'Cặp số (1; 3) là nghiệm của phương trình thứ hai x - 2y = -5.', isTrue: true, explain: '1 - 2.(3) = 1 - 6 = -5 (Đúng).' },
        { id: 'q7_c', label: 'c', text: 'Cặp số (1; 3) là nghiệm duy nhất của hệ phương trình đã cho.', isTrue: true, explain: 'Tỉ số a/a\' = 2/1 ≠ b/b\' = 1/(-2) nên hệ có nghiệm duy nhất (1; 3).' },
        { id: 'q7_d', label: 'd', text: 'Hệ phương trình đã cho có vô số nghiệm.', isTrue: false, explain: 'Hệ có nghiệm duy nhất chứ không phải vô số nghiệm.' }
      ]
    },
    {
      id: 'q8',
      num: 8,
      muc_do: 'hieu',
      de_bai: 'Cho góc nhọn α tùy ý (0° < α < 90°). Xét tính Đúng / Sai của các hệ thức lượng giác sau:',
      de_bai_latex: '0^\\circ < \\alpha < 90^\\circ',
      items: [
        { id: 'q8_a', label: 'a', text: 'Hệ thức sin² α + cos² α = 1 luôn đúng với mọi góc nhọn α.', isTrue: true, explain: 'Định lý Pitago: (đ/h)² + (k/h)² = (đ² + k²)/h² = h²/h² = 1.' },
        { id: 'q8_b', label: 'b', text: 'Công thức tan α = cos α / sin α.', isTrue: false, explain: 'Sai: tan α = sin α / cos α (còn cos α / sin α = cot α).' },
        { id: 'q8_c', label: 'c', text: 'Tích tan α . cot α = 1.', isTrue: true, explain: 'Đúng: (đ/k) . (k/đ) = 1.' },
        { id: 'q8_d', label: 'd', text: 'Nếu α và β là hai góc phụ nhau (α + β = 90°) thì sin α = cos β.', isTrue: true, explain: 'Định lý tỉ số lượng giác hai góc phụ nhau: sin góc này bằng cos góc kia.' }
      ]
    }
  ];

  // PHẦN III: Trắc nghiệm trả lời ngắn (4 câu x 0.5đ = 2.0 điểm)
  // Nhận biết: 2 câu (1.0đ); Thông hiểu: 2 câu (1.0đ)
  const PART3_QUESTIONS = [
    {
      id: 9,
      muc_do: 'biet',
      de_bai: 'Tính giá trị chính xác của biểu thức P = sin 30° + cos 60°. (Nhập kết quả số)',
      de_bai_latex: 'P = \\sin 30^\\circ + \\cos 60^\\circ',
      correctValue: '1',
      acceptableValues: ['1', '1.0'],
      explain: 'sin 30° = 1/2; cos 60° = 1/2 => P = 1/2 + 1/2 = 1.'
    },
    {
      id: 10,
      muc_do: 'hieu',
      de_bai: 'Biết cặp số (x; y) = (2; m) là một nghiệm của phương trình 3x - 4y = -6. Tìm giá trị của m.',
      de_bai_latex: '3x - 4y = -6',
      correctValue: '3',
      acceptableValues: ['3', '3.0', 'm=3'],
      explain: 'Thay x = 2, y = m vào phương trình: 3.(2) - 4m = -6 <=> 6 - 4m = -6 <=> -4m = -12 <=> m = 3.'
    },
    {
      id: 11,
      muc_do: 'hieu',
      de_bai: 'Tìm nghiệm của phương trình (x² - 4)/(x - 2) = 0 sau khi đã đối chiếu điều kiện xác định.',
      de_bai_latex: '\\frac{x^2 - 4}{x - 2} = 0',
      correctValue: '-2',
      acceptableValues: ['-2', 'x=-2'],
      explain: 'ĐKXĐ: x ≠ 2. Tử số bằng 0 <=> (x - 2)(x + 2) = 0 <=> x = 2 (loại) hoặc x = -2 (thỏa mãn). Nghiệm duy nhất là -2.'
    },
    {
      id: 12,
      muc_do: 'biet',
      de_bai: 'Cho tam giác ABC vuông tại A có cạnh huyền BC = 10 cm và góc C = 30°. Độ dài cạnh góc vuông AB là bao nhiêu cm? (Chỉ điền số)',
      de_bai_latex: 'AB = BC \\cdot \\sin C = 10 \\cdot \\sin 30^\\circ',
      correctValue: '5',
      acceptableValues: ['5', '5 cm', '5.0'],
      explain: 'Trong tam giác vuông ABC, cạnh đối AB = BC . sin C = 10 . sin 30° = 10 . (1/2) = 5 cm.'
    }
  ];

  // PHẦN IV: Tự luận (2 bài x 1.5đ = 3.0 điểm) - VẬN DỤNG 30%
  const PART4_ESSAYS: EssayProblem[] = [
    {
      id: 'essay_1',
      title: 'Bài 1: Giải bài toán bằng cách lập hệ phương trình (1,5 điểm)',
      points: 1.5,
      level: 'van_dung',
      deBai: 'Bạn Nam mua 5 quyển vở và 3 cây bút hết 63 000 đồng. Bạn An mua 3 quyển vở và 2 cây bút cùng loại hết 39 000 đồng. Em hãy tính giá tiền của mỗi quyển vở và mỗi cây bút.',
      deBaiLatex: '\\begin{cases} 5x + 3y = 63\\,000 \\\\ 3x + 2y = 39\\,000 \\end{cases}',
      dapSoTarget: [
        { label: 'Giá 1 quyển vở', targetValues: ['9000', '9 000', '9.000', '9000d', '9000đ'], unit: 'đồng' },
        { label: 'Giá 1 cây bút', targetValues: ['6000', '6 000', '6.000', '6000d', '6000đ'], unit: 'đồng' }
      ],
      steps: [
        {
          stepNum: 1,
          points: 0.25,
          title: 'Bước 1: Chọn ẩn, đặt điều kiện và đơn vị',
          content: 'Gọi x (đồng) là giá tiền của một quyển vở (x > 0).\nGọi y (đồng) là giá tiền của một cây bút (y > 0).',
          criteria: 'Đúng 2 ẩn x, y kèm đơn vị đồng và điều kiện x, y > 0 (+0,25đ)'
        },
        {
          stepNum: 2,
          points: 0.5,
          title: 'Bước 2: Lập hệ phương trình',
          content: 'Số tiền Nam mua 5 quyển vở và 3 cây bút là: 5x + 3y = 63 000 (1).\nSố tiền An mua 3 quyển vở và 2 cây bút là: 3x + 2y = 39 000 (2).\nTừ (1) và (2) ta có hệ phương trình: { 5x + 3y = 63 000; 3x + 2y = 39 000 }.',
          criteria: 'Lập đúng phương trình (1) và phương trình (2) thành hệ (+0,50đ)'
        },
        {
          stepNum: 3,
          points: 0.5,
          title: 'Bước 3: Giải hệ phương trình',
          content: 'Nhân (1) với 2 và nhân (2) với 3:\n{ 10x + 6y = 126 000; 9x + 6y = 117 000 }\nTrừ từng vế hai phương trình: x = 9 000.\nThay x = 9 000 vào (2): 3.(9 000) + 2y = 39 000 <=> 27 000 + 2y = 39 000 <=> 2y = 12 000 <=> y = 6 000.',
          criteria: 'Giải đúng phương pháp thế hoặc cộng đại số tìm ra x = 9000, y = 6000 (+0,50đ)'
        },
        {
          stepNum: 4,
          points: 0.25,
          title: 'Bước 4: Đối chiếu điều kiện và kết luận',
          content: 'Cả hai giá trị x = 9 000 và y = 6 000 đều thỏa mãn điều kiện bài toán.\nKết luận: Giá tiền một quyển vở là 9 000 đồng và giá tiền một cây bút là 6 000 đồng.',
          criteria: 'Đối chiếu điều kiện và kết luận rõ ràng kèm đơn vị (+0,25đ)'
        }
      ],
      loiGiaiMau: [
        'Gọi x (đồng) là giá tiền của một quyển vở (x > 0).',
        'Gọi y (đồng) là giá tiền của một cây bút (y > 0).',
        'Theo bài ra, Nam mua 5 vở và 3 bút hết 63 000 đồng nên: 5x + 3y = 63 000 (1).',
        'An mua 3 vở và 2 bút hết 39 000 đồng nên: 3x + 2y = 39 000 (2).',
        'Từ (1) và (2) ta có hệ phương trình:',
        '  { 5x + 3y = 63 000',
        '  { 3x + 2y = 39 000',
        '<=> { 10x + 6y = 126 000',
        '    { 9x + 6y = 117 000',
        '<=> { x = 9 000',
        '    { 3.(9 000) + 2y = 39 000 <=> y = 6 000 (thỏa mãn điều kiện).',
        'Vậy mỗi quyển vở giá 9 000 đồng, mỗi cây bút giá 6 000 đồng.'
      ]
    },
    {
      id: 'essay_2',
      title: 'Bài 2: Ứng dụng hệ thức lượng tam giác vuông giải toán thực tế (1,5 điểm)',
      points: 1.5,
      level: 'van_dung',
      deBai: 'Tại một thời điểm trong ngày, bóng của một cột cờ trên mặt đất dài 12 m. Tia nắng mặt trời tạo với mặt đất một góc bằng 35°. Tính chiều cao cột cờ (làm tròn đến hàng phần mười của mét, biết tan 35° ≈ 0,7002).',
      deBaiLatex: 'h = BC \\cdot \\tan 35^\\circ = 12 \\cdot \\tan 35^\\circ',
      dapSoTarget: [
        { label: 'Chiều cao cột cờ', targetValues: ['8.4', '8,4', '8.4m', '8,4m'], unit: 'mét' }
      ],
      steps: [
        {
          stepNum: 1,
          points: 0.25,
          title: 'Bước 1: Mô hình hóa hình học',
          content: 'Mô hình hóa bài toán thành tam giác ABC vuông tại B (chân cột cờ).\nTrong đó: AB là chiều cao cột cờ, BC = 12 m là chiều dài bóng trên mặt đất, góc C = 35° là góc tạo bởi tia nắng với mặt đất.',
          criteria: 'Xác định đúng tam giác vuông và các đại lượng AB, BC, góc C (+0,25đ)'
        },
        {
          stepNum: 2,
          points: 0.5,
          title: 'Bước 2: Thiết lập hệ thức lượng giác',
          content: 'Trong tam giác ABC vuông tại B, theo hệ thức giữa cạnh và góc trong tam giác vuông:\nAB = BC . tan C',
          criteria: 'Viết đúng hệ thức cạnh góc vuông bằng cạnh kề nhân tan góc đối (+0,50đ)'
        },
        {
          stepNum: 3,
          points: 0.5,
          title: 'Bước 3: Thay số và tính toán',
          content: 'Thay số ta được:\nAB = 12 . tan 35° ≈ 12 . 0,7002 = 8,4024 m ≈ 8,4 m.',
          criteria: 'Thay số chính xác và tính ra kết quả xấp xỉ 8,4 (+0,50đ)'
        },
        {
          stepNum: 4,
          points: 0.25,
          title: 'Bước 4: Kết luận thực tế',
          content: 'Kết luận: Chiều cao của cột cờ là khoảng 8,4 mét.',
          criteria: 'Có câu kết luận đầy đủ kèm đơn vị mét (+0,25đ)'
        }
      ],
      loiGiaiMau: [
        'Mô hình hóa bài toán bằng hình vẽ tam giác vuông ABC (vuông tại B).',
        'Gọi AB là chiều cao của cột cờ, BC = 12 m là độ dài bóng của cột cờ trên mặt đất.',
        'Góc tạo bởi tia nắng với mặt đất là góc ACB = 35°.',
        'Xét tam giác ABC vuông tại B, áp dụng hệ thức lượng giữa cạnh và góc:',
        '  AB = BC . tan C',
        '  AB = 12 . tan 35°',
        '  AB ≈ 12 . 0,7002 ≈ 8,4 (m).',
        'Vậy cột cờ có chiều cao khoảng 8,4 mét.'
      ]
    }
  ];

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        if (prev === 300) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit and compute grade
  const handleSubmitExam = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    soundManager.playLevelComplete();

    // 1. Calculate Part I: 6 questions x 0.5 = 3.0 pts max
    // Q1-Q4 (Nhận biết): 4 x 0.5 = 2.0đ
    // Q5-Q6 (Thông hiểu): 2 x 0.5 = 1.0đ
    let p1 = 0;
    let nb_p1 = 0;
    let th_p1 = 0;
    PART1_QUESTIONS.forEach((q) => {
      if (part1Answers[q.id] === q.correctAnswer) {
        p1 += 0.5;
        if (q.muc_do === 'biet') nb_p1 += 0.5;
        else th_p1 += 0.5;
      }
    });

    // 2. Calculate Part II: 2 big True/False questions (CV 7991 rubric)
    // 1 correct: 0.1đ | 2 correct: 0.25đ | 3 correct: 0.5đ | 4 correct: 1.0đ
    let p2 = 0;
    let nb_p2 = 0;
    let th_p2 = 0;
    PART2_QUESTIONS.forEach((q) => {
      const studentMap = part2Answers[q.id] || {};
      let correctSubCount = 0;
      q.items.forEach((item) => {
        if (studentMap[item.id] === item.isTrue) {
          correctSubCount++;
        }
      });

      let qScore = 0;
      if (correctSubCount === 4) qScore = 1.0;
      else if (correctSubCount === 3) qScore = 0.5;
      else if (correctSubCount === 2) qScore = 0.25;
      else if (correctSubCount === 1) qScore = 0.1;

      p2 += qScore;
      if (q.muc_do === 'biet') nb_p2 += qScore;
      else th_p2 += qScore;
    });

    // 3. Calculate Part III: 4 short answer questions x 0.5 = 2.0 pts max
    // Q9 (NB): 0.5đ, Q10 (TH): 0.5đ, Q11 (TH): 0.5đ, Q12 (NB): 0.5đ
    let p3 = 0;
    let nb_p3 = 0;
    let th_p3 = 0;
    PART3_QUESTIONS.forEach((q) => {
      const userRaw = (part3Answers[q.id] || '').trim().toLowerCase().replace(',', '.');
      const isCorrect = q.acceptableValues.some((v) => userRaw === v.toLowerCase().replace(',', '.'));
      if (isCorrect) {
        p3 += 0.5;
        if (q.muc_do === 'biet') nb_p3 += 0.5;
        else th_p3 += 0.5;
      }
    });

    // 4. Calculate Part IV: 2 essay problems x 1.5 = 3.0 pts max (Vận dụng 30%)
    let p4 = 0;
    PART4_ESSAYS.forEach((essay) => {
      const studentEssay = part4Answers[essay.id] || { short: {}, essayText: '' };
      let essayPts = 0;

      // Check short answer targets
      let targetMatches = 0;
      essay.dapSoTarget.forEach((t) => {
        const val = (studentEssay.short[t.label] || '').trim().toLowerCase().replace(',', '.');
        if (t.targetValues.some((tg) => val.includes(String(tg).toLowerCase().replace(',', '.')))) {
          targetMatches++;
        }
      });

      if (targetMatches === essay.dapSoTarget.length) {
        // Correct final target answers: at least 1.0 pt
        essayPts = 1.0;
      } else if (targetMatches > 0) {
        essayPts = 0.5;
      }

      // Bonus if student provided thorough steps in essay textarea
      if (studentEssay.essayText.trim().length > 60) {
        essayPts = Math.min(1.5, essayPts + 0.5);
      }

      p4 += essayPts;
    });

    // Total Score (10.0 scale, rounded to 1 decimal place per TT 22)
    const rawTotal = p1 + p2 + p3 + p4;
    const finalScore = Math.min(10, Math.round(rawTotal * 10) / 10);

    const nhanBietTotal = Math.round((nb_p1 + nb_p2 + nb_p3) * 10) / 10;
    const thongHieuTotal = Math.round((th_p1 + th_p2 + th_p3) * 10) / 10;
    const vanDungTotal = Math.round(p4 * 10) / 10;

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (p1 >= 2.0) strengths.push('Nắm rất chắc kiến thức nhận biết và giải phương trình, hệ phương trình cơ bản (Phần I).');
    else improvements.push('Cần rà soát lại kỹ năng giải hệ phương trình và điều kiện xác định của phương trình (Phần I).');

    if (p2 >= 1.5) strengths.push('Khả năng phân tích mệnh đề Đúng - Sai logic, không mắc bẫy khái niệm (Phần II).');
    else improvements.push('Cần ghi nhớ kĩ các hệ thức lượng giác cơ bản (sin² + cos² = 1; tan = sin/cos) ở Phần II.');

    if (p3 >= 1.5) strengths.push('Kỹ năng tính toán số học và tỉ số lượng giác góc đặc biệt nhanh và chính xác (Phần III).');
    else improvements.push('Cẩn thận các bài toán phương trình có nghiệm ngoại lai cần loại theo ĐKXĐ (Phần III).');

    if (p4 >= 2.0) strengths.push('Năng lực mô hình hóa toán học và giải toán thực tế xuất sắc (Phần IV Tự luận).');
    else improvements.push('Cần rèn luyện cách trình bày bài giải tự luận 4 bước chuẩn chỉ và đối chiếu điều kiện (Phần IV).');

    const resultObj = {
      score10: finalScore,
      part1Score: p1,
      part2Score: p2,
      part3Score: p3,
      part4Score: p4,
      nhanBietScore: nhanBietTotal,
      thongHieuScore: thongHieuTotal,
      vanDungScore: vanDungTotal,
      strengths,
      improvements
    };

    setExamResult(resultObj);

    // Save to LocalStorage for teacher / admin export
    try {
      const savedSubmissions: StudentSubmission[] = JSON.parse(
        localStorage.getItem('dao_toan_9_student_submissions') || '[]'
      );
      const studentName = currentStudent?.name || 'Học Sinh Trải Nghiệm';
      const studentClass = currentStudent?.className || '9/1';
      const studentCode = currentStudent?.studentCode || `HS-${studentClass}-${Math.floor(10 + Math.random() * 90)}`;

      const newSub: StudentSubmission = {
        id: 'sub_' + Date.now(),
        name: studentName,
        studentCode: studentCode,
        className: studentClass,
        examTitle: 'Đề Kiểm Tra Giữa Kì I (Chuẩn CV 7991 - 4 Phần)',
        score10: finalScore,
        correctCount: Math.round((finalScore / 10) * 14),
        totalQuestions: 14,
        durationMinutes: Math.max(1, Math.round((45 * 60 - timeLeft) / 60)),
        completedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        circular22Level: finalScore >= 8 ? 'Tốt' : finalScore >= 6.5 ? 'Khá' : finalScore >= 5 ? 'Đạt' : 'Cần cố gắng',
        circular22Comment: strengths.join(' ') || 'Đã nộp bài kiểm tra đạt chuẩn.'
      };

      localStorage.setItem('dao_toan_9_student_submissions', JSON.stringify([newSub, ...savedSubmissions]));
    } catch {
      // Ignore
    }

    if (finalScore >= 7.0) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }

    onFinishExam({
      score10: finalScore,
      feedback: strengths.join(' ') || 'Hoàn thành bài thi.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-indigo-500/30 shadow-2xl text-slate-100 space-y-6">
      {/* Top Exam Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-md bg-purple-950 border border-purple-500/40 text-purple-300">
              Công Văn 7991/BGDĐT-GDTrH
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 border border-indigo-500/30 text-indigo-300">
              Thông Tư 22/2021/TT-BGDĐT
            </span>
            <span className="text-[11px] text-amber-300 font-bold">
              Bản quyền: Teacher Lê Thanh Tùng
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Đề Kiểm Tra Đánh Giá Năng Lực Giữa Học Kì I – Môn Toán 9
          </h2>
          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-slate-300">
            <span>Trường TH & THCS Nguyễn Hữu Cảnh</span>
            <span>•</span>
            <span className="font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Thí sinh: {currentStudent ? `${currentStudent.name} (Lớp ${currentStudent.className})` : 'Học sinh trải nghiệm'}
            </span>
            {!currentStudent && onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-amber-300 underline font-semibold hover:text-amber-200 cursor-pointer"
              >
                Đăng nhập để ghi nhận điểm vào danh sách lớp
              </button>
            )}
          </div>
        </div>

        {/* Timer & Main Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-indigo-500/40 text-white font-mono font-bold text-sm shadow-inner">
            <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-rose-400 animate-pulse' : 'text-sky-400'}`} />
            <span className={timeLeft < 300 ? 'text-rose-300' : 'text-white'}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {!isSubmitted && (
            <button
              onClick={handleSubmitExam}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105"
            >
              Nộp Bài
            </button>
          )}

          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Thoát
          </button>
        </div>
      </div>

      {/* Cognition Matrix Summary Banner (Nhận biết 40% - Thông hiểu 30% - Vận dụng 30%) */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/25 grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
          <span className="text-slate-400 block font-medium">Nhận biết (40%)</span>
          <span className="text-sm font-black text-sky-400">4,0 Điểm</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
          <span className="text-slate-400 block font-medium">Thông hiểu (30%)</span>
          <span className="text-sm font-black text-amber-400">3,0 Điểm</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
          <span className="text-slate-400 block font-medium">Vận dụng (30%)</span>
          <span className="text-sm font-black text-purple-400">3,0 Điểm</span>
        </div>
        <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/40 text-center">
          <span className="text-indigo-200 block font-medium">Tổng Đề Thi</span>
          <span className="text-sm font-black text-white">10,0 Điểm (45 Phút)</span>
        </div>
      </div>

      {/* IF SUBMITTED: SHOW DETAILED REPORT ACCORDING TO CV 7991 & TT 22 */}
      {isSubmitted && examResult ? (
        <div className="space-y-6">
          {/* Score Hero Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-500/50 text-center space-y-3 shadow-2xl">
            <span className="text-xs uppercase tracking-widest text-indigo-300 font-extrabold px-3 py-1 rounded-full bg-indigo-900/60 border border-indigo-400/40 inline-block">
              Kết Quả Đánh Giá Định Kì Giữa Kì I
            </span>
            <div className="text-5xl sm:text-6xl font-black text-amber-300">
              {examResult.score10.toFixed(1)} <span className="text-2xl text-slate-400">/ 10.0</span>
            </div>
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-400/40 bg-emerald-950 text-emerald-300">
              Xếp loại TT 22:{' '}
              {examResult.score10 >= 8
                ? 'Mức TỐT'
                : examResult.score10 >= 6.5
                ? 'Mức KHÁ'
                : examResult.score10 >= 5
                ? 'Mức ĐẠT'
                : 'Mức CHƯA ĐẠT'}
            </div>
          </div>

          {/* 4 Parts Breakdown (CV 7991 Standard) */}
          <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-300 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Điểm Thành Phần Theo 4 Dạng Bài (Công Văn 7991)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Phần I: Nhiều Lựa Chọn</div>
                <div className="text-xl font-black text-sky-400 mt-1">{examResult.part1Score.toFixed(1)} / 3.0</div>
                <div className="text-[11px] text-slate-500 mt-0.5">6 câu x 0.5đ</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Phần II: Đúng - Sai</div>
                <div className="text-xl font-black text-amber-400 mt-1">{examResult.part2Score.toFixed(1)} / 2.0</div>
                <div className="text-[11px] text-slate-500 mt-0.5">2 câu lớn x 1.0đ</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Phần III: Trả Lời Ngắn</div>
                <div className="text-xl font-black text-emerald-400 mt-1">{examResult.part3Score.toFixed(1)} / 2.0</div>
                <div className="text-[11px] text-slate-500 mt-0.5">4 câu x 0.5đ</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Phần IV: Tự Luận</div>
                <div className="text-xl font-black text-purple-400 mt-1">{examResult.part4Score.toFixed(1)} / 3.0</div>
                <div className="text-[11px] text-slate-500 mt-0.5">2 bài x 1.5đ</div>
              </div>
            </div>
          </div>

          {/* Cognition Matrix Actual Achievement */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Kết Quả Đạt Được Theo Ma Trận Nhận Thức
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/20 flex items-center justify-between">
                <span>Nhận biết (Mục tiêu 4.0đ)</span>
                <span className="font-bold text-sky-300 text-sm">{examResult.nhanBietScore.toFixed(1)} / 4.0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 flex items-center justify-between">
                <span>Thông hiểu (Mục tiêu 3.0đ)</span>
                <span className="font-bold text-amber-300 text-sm">{examResult.thongHieuScore.toFixed(1)} / 3.0</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-purple-500/20 flex items-center justify-between">
                <span>Vận dụng (Mục tiêu 3.0đ)</span>
                <span className="font-bold text-purple-300 text-sm">{examResult.vanDungScore.toFixed(1)} / 3.0</span>
              </div>
            </div>
          </div>

          {/* Formative Comments (Thông tư 22) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Ưu Điểm & Năng Lực Đạt Được
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {examResult.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Hạn Chế Cần Rèn Luyện Thêm
              </h4>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {examResult.improvements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setTimeLeft(45 * 60);
                setPart1Answers({});
                setPart2Answers({});
                setPart3Answers({});
                setPart4Answers({ essay_1: { short: {}, essayText: '' }, essay_2: { short: {}, essayText: '' } });
                setExamResult(null);
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm Lại Đề Thi</span>
            </button>
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer"
            >
              Hoàn Thành
            </button>
          </div>
        </div>
      ) : (
        /* EXAM TAKING INTERFACE: 4 STRUCTURED SECTIONS */
        <div className="space-y-6">
          {/* Section Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Toàn Bộ Đề Thi (10,0đ)
            </button>
            <button
              onClick={() => setActiveTab('part1')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'part1'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Phần I: Nhiều Lựa Chọn (3,0đ)
            </button>
            <button
              onClick={() => setActiveTab('part2')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'part2'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Phần II: Đúng - Sai (2,0đ)
            </button>
            <button
              onClick={() => setActiveTab('part3')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'part3'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Phần III: Trả Lời Ngắn (2,0đ)
            </button>
            <button
              onClick={() => setActiveTab('part4')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'part4'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Phần IV: Tự Luận (3,0đ)
            </button>
          </div>

          {/* ========================================================= */}
          {/* PHẦN I: TRẮC NGHIỆM NHIỀU LỰA CHỌN (3,0 ĐIỂM)            */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'part1') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-950/50 border border-sky-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                    I
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-sky-200">
                    PHẦN I: CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN (3,0 ĐIỂM)
                  </h3>
                </div>
                <span className="text-xs font-bold text-sky-300">
                  6 câu • 0,5 điểm / câu
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                Thí sinh trả lời từ Câu 1 đến Câu 6. Mỗi câu hỏi chỉ chọn MỘT phương án đúng nhất.
              </p>

              <div className="space-y-4">
                {PART1_QUESTIONS.map((q) => {
                  const studentChoice = part1Answers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-sky-400 uppercase tracking-wide">
                          Câu {q.id} ({q.muc_do === 'biet' ? 'Nhận biết - 0,5đ' : 'Thông hiểu - 0,5đ'})
                        </span>
                        {studentChoice !== undefined && (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Đã chọn
                          </span>
                        )}
                      </div>

                      <div className="text-sm sm:text-base font-semibold text-slate-100">
                        <MathView text={q.de_bai} />
                      </div>

                      {q.de_bai_latex && (
                        <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-200">
                          <MathView math={q.de_bai_latex} display={true} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = studentChoice === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                soundManager.playClick();
                                setPart1Answers((prev) => ({ ...prev, [q.id]: oIdx }));
                              }}
                              className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-sky-950/80 border-sky-400 text-white shadow-md ring-1 ring-sky-400'
                                  : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>
                                <MathView text={opt.replace(/^[A-D]\.\s*/, '')} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHẦN II: TRẮC NGHIỆM ĐÚNG - SAI (2,0 ĐIỂM)                */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'part2') && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-950/50 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                    II
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-amber-200">
                    PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG – SAI (2,0 ĐIỂM)
                  </h3>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  2 câu lớn • 1,0 điểm / câu
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>Thí sinh trả lời Câu 7 và Câu 8. Trong mỗi ý a), b), c), d) chọn Đúng hoặc Sai.</span>
                <span className="text-amber-400 font-semibold">
                  Quy tắc: 1 ý = 0,1đ | 2 ý = 0,25đ | 3 ý = 0,5đ | 4 ý = 1,0đ
                </span>
              </div>

              <div className="space-y-4">
                {PART2_QUESTIONS.map((q) => {
                  const studentAnswers = part2Answers[q.id] || {};
                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wide">
                          Câu {q.num} ({q.muc_do === 'biet' ? 'Nhận biết - 1,0đ' : 'Thông hiểu - 1,0đ'})
                        </span>
                        <span className="text-xs text-slate-400">
                          Đã chọn: {Object.keys(studentAnswers).length} / 4 ý
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-slate-100">
                        <MathView text={q.de_bai} />
                      </div>

                      {q.de_bai_latex && (
                        <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-200">
                          <MathView math={q.de_bai_latex} display={true} />
                        </div>
                      )}

                      <div className="space-y-2 pt-1">
                        {q.items.map((sub) => {
                          const userVal = studentAnswers[sub.id];
                          return (
                            <div
                              key={sub.id}
                              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs sm:text-sm"
                            >
                              <div className="flex items-start gap-2.5 text-slate-200">
                                <span className="w-5 h-5 rounded bg-indigo-950 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                                  {sub.label}
                                </span>
                                <MathView text={sub.text} />
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                <button
                                  onClick={() => {
                                    soundManager.playClick();
                                    setPart2Answers((prev) => ({
                                      ...prev,
                                      [q.id]: { ...(prev[q.id] || {}), [sub.id]: true }
                                    }));
                                  }}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    userVal === true
                                      ? 'bg-amber-600 text-white shadow-md'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  Đúng
                                </button>
                                <button
                                  onClick={() => {
                                    soundManager.playClick();
                                    setPart2Answers((prev) => ({
                                      ...prev,
                                      [q.id]: { ...(prev[q.id] || {}), [sub.id]: false }
                                    }));
                                  }}
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    userVal === false
                                      ? 'bg-amber-600 text-white shadow-md'
                                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                  }`}
                                >
                                  Sai
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHẦN III: TRẢ LỜI NGẮN (2,0 ĐIỂM)                          */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'part3') && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    III
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-emerald-200">
                    PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN (2,0 ĐIỂM)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-300">
                  4 câu • 0,5 điểm / câu
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                Thí sinh trả lời từ Câu 9 đến Câu 12. Điền kết quả số hoặc biểu thức rút gọn vào ô trống.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PART3_QUESTIONS.map((q) => {
                  const currVal = part3Answers[q.id] || '';
                  return (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                            Câu {q.id} ({q.muc_do === 'biet' ? 'Nhận biết - 0,5đ' : 'Thông hiểu - 0,5đ'})
                          </span>
                          {currVal && (
                            <span className="text-[11px] font-bold text-emerald-400">Đã điền</span>
                          )}
                        </div>

                        <div className="text-sm font-semibold text-slate-100">
                          <MathView text={q.de_bai} />
                        </div>

                        {q.de_bai_latex && (
                          <div className="p-2 rounded-lg bg-slate-900 text-indigo-200 mt-2">
                            <MathView math={q.de_bai_latex} display={true} />
                          </div>
                        )}
                      </div>

                      <div className="pt-2">
                        <label className="text-[11px] text-slate-400 mb-1 block">Đáp số của em:</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: 3 hoặc 0.5..."
                          value={currVal}
                          onChange={(e) => {
                            const val = e.target.value;
                            setPart3Answers((prev) => ({ ...prev, [q.id]: val }));
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* PHẦN IV: TỰ LUẬN (3,0 ĐIỂM) - VẬN DỤNG 30%                */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'part4') && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/50 border border-purple-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                    IV
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-purple-200">
                    PHẦN IV: TỰ LUẬN – VẬN DỤNG THỰC TẾ (3,0 ĐIỂM)
                  </h3>
                </div>
                <span className="text-xs font-bold text-purple-300">
                  2 bài • 1,5 điểm / bài
                </span>
              </div>
              <p className="text-xs text-slate-400 italic">
                Thí sinh trình bày bài giải chi tiết từng bước theo quy chuẩn sư phạm THCS. Có thể nhập đáp số và xem thang điểm barem để tự đối chiếu.
              </p>

              <div className="space-y-5">
                {PART4_ESSAYS.map((essay, eIdx) => {
                  const studentData = part4Answers[essay.id] || { short: {}, essayText: '' };
                  const isRubricOpen = !!showEssayRubric[essay.id];

                  return (
                    <div
                      key={essay.id}
                      className="p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-black text-purple-300 uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-950 border border-purple-500/40">
                          {essay.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEssayRubric((prev) => ({ ...prev, [essay.id]: !prev[essay.id] }));
                          }}
                          className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
                        >
                          {isRubricOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isRubricOpen ? 'Ẩn Thang Điểm Barem' : 'Xem Thang Điểm Barem (0,25đ - 0,5đ)'}</span>
                        </button>
                      </div>

                      <div className="text-sm font-semibold text-slate-100 leading-relaxed">
                        <MathView text={essay.deBai} />
                      </div>

                      {essay.deBaiLatex && (
                        <div className="p-2.5 rounded-lg bg-slate-900 text-indigo-200">
                          <MathView math={essay.deBaiLatex} display={true} />
                        </div>
                      )}

                      {/* Fast Target Answers Input */}
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <span className="text-xs font-bold text-slate-300 block">
                          1. Điền đáp số rút gọn:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {essay.dapSoTarget.map((target, tIdx) => (
                            <div key={tIdx} className="flex items-center gap-2">
                              <span className="text-xs text-slate-400 shrink-0 w-32">{target.label}:</span>
                              <input
                                type="text"
                                placeholder={`Nhập số (${target.unit})...`}
                                value={studentData.short[target.label] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPart4Answers((prev) => ({
                                    ...prev,
                                    [essay.id]: {
                                      ...studentData,
                                      short: { ...studentData.short, [target.label]: val }
                                    }
                                  }));
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Written Steps Input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                          <span>2. Trình bày bài giải tự luận của em (hoặc nháp các bước):</span>
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Ví dụ: Gọi ẩn, đặt điều kiện... Lập hệ phương trình... Giải hệ ta được... Đối chiếu điều kiện và kết luận..."
                          value={studentData.essayText}
                          onChange={(e) => {
                            const txt = e.target.value;
                            setPart4Answers((prev) => ({
                              ...prev,
                              [essay.id]: { ...studentData, essayText: txt }
                            }));
                          }}
                          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-purple-400"
                        />
                      </div>

                      {/* Official Step-by-Step Scoring Rubric */}
                      {isRubricOpen && (
                        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-3 transition-all">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Barem Chấm Điểm Chi Tiết Chuẩn Quy Cách THCS
                          </h5>
                          <div className="space-y-2">
                            {essay.steps.map((st) => (
                              <div
                                key={st.stepNum}
                                className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                              >
                                <div>
                                  <span className="font-bold text-amber-300">{st.title}: </span>
                                  <span className="text-slate-300 whitespace-pre-line">{st.content}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded bg-purple-900 text-purple-200 font-bold shrink-0 self-end sm:self-center">
                                  +{st.points}đ
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Complete & Submit Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30">
            <div className="text-xs text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Đã hoàn tất các phần? Hãy kiểm tra lại trước khi bấm nộp bài để ghi nhận điểm vào danh sách.
              </span>
            </div>

            <button
              onClick={handleSubmitExam}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-xl shadow-emerald-600/30 cursor-pointer transition-all hover:scale-105"
            >
              Nộp Bài Kiểm Tra (45 Phút)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
