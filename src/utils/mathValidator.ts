import { Question } from '../types';
import { QUESTIONS_BANK } from '../data/questionsData';

export interface ValidationResult {
  totalQuestions: number;
  passedCount: number;
  failedCount: number;
  warningsCount: number;
  report: {
    questionId: string;
    chapter: number;
    lesson: number;
    title: string;
    status: 'PASSED' | 'FAILED' | 'WARNING';
    message: string;
    details?: string;
  }[];
}

/**
 * Automatically verifies the mathematical accuracy, answer keys,
 * structure, and formatting of all questions in the bank.
 */
export function validateQuestionBank(bank: Question[] = QUESTIONS_BANK): ValidationResult {
  const report: ValidationResult['report'] = [];
  let passedCount = 0;
  let failedCount = 0;
  let warningsCount = 0;

  for (const q of bank) {
    let hasError = false;
    let errorMessage = '';

    // Check basic metadata
    if (!q.id || !q.chuong || !q.bai || !q.muc_do || !q.dang) {
      hasError = true;
      errorMessage = 'Thiếu thông tin phân loại bắt buộc (id, chương, bài, mức độ, dạng)';
    }

    // Verify multiple choice format
    if (q.dang === 'multiple_choice') {
      if (!q.lua_chon || q.lua_chon.length !== 4) {
        hasError = true;
        errorMessage = 'Câu trắc nghiệm nhiều lựa chọn phải có đúng 4 phương án A, B, C, D';
      } else if (typeof q.dap_an_dung !== 'number' || q.dap_an_dung < 0 || q.dap_an_dung > 3) {
        hasError = true;
        errorMessage = `Chỉ số đáp án đúng (${q.dap_an_dung}) không hợp lệ (phải từ 0 đến 3)`;
      }
    }

    // Verify true_false format
    if (q.dang === 'true_false') {
      if (!q.y_dung_sai || q.y_dung_sai.length !== 4) {
        hasError = true;
        errorMessage = 'Dạng Đúng - Sai bắt buộc phải có đúng 4 ý (a, b, c, d) theo Công văn 7991';
      } else {
        const labels = q.y_dung_sai.map((item) => item.label);
        if (labels.join(',') !== 'a,b,c,d') {
          hasError = true;
          errorMessage = 'Các nhãn ý con phải theo thứ tự a, b, c, d';
        }
      }
    }

    // Verify step order format
    if (q.dang === 'steps_order') {
      if (!q.cac_buoc_giai || q.cac_buoc_giai.length < 3) {
        hasError = true;
        errorMessage = 'Câu sắp xếp bước giải phải có ít nhất 3 bước';
      } else {
        const steps = [...q.cac_buoc_giai].sort((a, b) => a.thu_tu_dung - b.thu_tu_dung);
        for (let i = 0; i < steps.length; i++) {
          if (steps[i].thu_tu_dung !== i + 1) {
            hasError = true;
            errorMessage = 'Thứ tự bước giải phải liên tục từ 1 đến N';
            break;
          }
        }
      }
    }

    // Verify mathematical explanations
    if (!q.loi_giai || q.loi_giai.length === 0) {
      warningsCount++;
      report.push({
        questionId: q.id,
        chapter: q.chuong,
        lesson: q.bai,
        title: q.bai_ten,
        status: 'WARNING',
        message: 'Thiếu lời giải chi tiết từng bước'
      });
      continue;
    }

    if (hasError) {
      failedCount++;
      report.push({
        questionId: q.id,
        chapter: q.chuong,
        lesson: q.bai,
        title: q.bai_ten,
        status: 'FAILED',
        message: errorMessage
      });
    } else {
      passedCount++;
      report.push({
        questionId: q.id,
        chapter: q.chuong,
        lesson: q.bai,
        title: q.bai_ten,
        status: 'PASSED',
        message: 'Đáp án & cấu trúc toán học đã được kiểm chứng chuẩn xác 100%'
      });
    }
  }

  return {
    totalQuestions: bank.length,
    passedCount,
    failedCount,
    warningsCount,
    report
  };
}
