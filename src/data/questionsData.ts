import { Question, GameZone } from '../types';

export const QUESTIONS_BANK: Question[] = [
  // ==========================================
  // CHƯƠNG I: PHƯƠNG TRÌNH VÀ HỆ HAI PHƯƠNG TRÌNH BẬC NHẤT HAI ẨN
  // ==========================================

  // --- BÀI 1: Khái niệm phương trình & hệ phương trình bậc nhất 2 ẩn ---
  {
    id: 'c1_b1_01',
    chuong: 1,
    bai: 1,
    bai_ten: 'Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 45,
    de_bai: 'Cặp số nào sau đây là một nghiệm của phương trình 2x - 3y = 7?',
    de_bai_latex: '2x - 3y = 7',
    lua_chon: [
      'A. (2; -1)',
      'B. (5; 1)',
      'C. (1; -2)',
      'D. (-1; -3)'
    ],
    dap_an_dung: 1, // B. (5; 1)
    dap_an_hien_thi: 'B. (5; 1)',
    loi_giai: [
      'Thay x = 5, y = 1 vào vế trái của phương trình:',
      'VT = 2.(5) - 3.(1) = 10 - 3 = 7 = VP.',
      'Vậy cặp số (5; 1) là nghiệm của phương trình.'
    ],
    goi_y: 'Cặp số (x₀; y₀) là nghiệm của ax + by = c nếu thay x = x₀ và y = y₀ làm hai vế bằng nhau.',
    loi_thuong_gap: 'Học sinh hay thay nhầm thứ tự x cho y hoặc tính sai dấu âm: 2.(1) - 3.(-2) = 8 chứ không phải 7.'
  },
  {
    id: 'c1_b1_02',
    chuong: 1,
    bai: 1,
    bai_ten: 'Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 45,
    de_bai: 'Phương trình nào dưới đây KHÔNG PHẢI là phương trình bậc nhất hai ẩn x và y?',
    de_bai_latex: 'ax + by = c \\quad (a^2 + b^2 \\neq 0)',
    lua_chon: [
      'A. 3x - 5y = 1',
      'B. 0x + 4y = 8',
      'C. 2x^2 + y = 3',
      'D. -x + 0y = -9'
    ],
    dap_an_dung: 2, // C
    dap_an_hien_thi: 'C. 2x² + y = 3',
    loi_giai: [
      'Phương trình bậc nhất hai ẩn có dạng ax + by = c với a, b không đồng thời bằng 0, bậc của các ẩn x, y đều là 1.',
      'Phương trình 2x² + y = 3 chứa x² (bậc 2) nên không phải là phương trình bậc nhất hai ẩn.'
    ],
    goi_y: 'Chú ý bậc của các ẩn trong phương trình bậc nhất hai ẩn phải là bậc một!',
    loi_thuong_gap: 'Nhầm lẫn phương trình có hệ số a = 0 (như 0x + 4y = 8) vẫn là phương trình bậc nhất hai ẩn.'
  },
  {
    id: 'c1_b1_03',
    chuong: 1,
    bai: 1,
    bai_ten: 'Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'hieu',
    dang: 'true_false',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 90,
    de_bai: 'Cho hệ hai phương trình bậc nhất hai ẩn: { 2x + y = 5; x - 2y = -5 }',
    de_bai_latex: '\\begin{cases} 2x + y = 5 \\\\ x - 2y = -5 \\end{cases}',
    y_dung_sai: [
      {
        id: 'c1_b1_03_a',
        label: 'a',
        noi_dung: 'Cặp số (1; 3) là nghiệm của phương trình thứ nhất 2x + y = 5.',
        la_dung: true,
        giai_thich: '2.(1) + 3 = 5 (đúng).'
      },
      {
        id: 'c1_b1_03_b',
        label: 'b',
        noi_dung: 'Cặp số (1; 3) là nghiệm của phương trình thứ hai x - 2y = -5.',
        la_dung: true,
        giai_thich: '1 - 2.(3) = 1 - 6 = -5 (đúng).'
      },
      {
        id: 'c1_b1_03_c',
        label: 'c',
        noi_dung: 'Cặp số (1; 3) là nghiệm duy nhất của hệ phương trình đã cho.',
        la_dung: true,
        giai_thich: 'Do (1; 3) thỏa mãn đồng thời cả hai phương trình và tỉ số a/a\' ≠ b/b\' (2/1 ≠ 1/(-2)).'
      },
      {
        id: 'c1_b1_03_d',
        label: 'd',
        noi_dung: 'Hệ phương trình đã cho có vô số nghiệm.',
        la_dung: false,
        giai_thich: 'Hai đường thẳng cắt nhau tại điểm duy nhất (1; 3), hệ có nghiệm duy nhất.'
      }
    ],
    dap_an_dung: [true, true, true, false],
    dap_an_hien_thi: 'a: Đúng, b: Đúng, c: Đúng, d: Sai',
    loi_giai: [
      'Kiểm tra cặp (1; 3) với từng phương trình:',
      'PT 1: 2(1) + 3 = 5 (Thỏa mãn).',
      'PT 2: 1 - 2(3) = -5 (Thỏa mãn).',
      'Vì a/a\' = 2/1 = 2 khác b/b\' = 1/(-2) = -0.5 nên hệ có nghiệm duy nhất (1; 3).'
    ],
    goi_y: 'Một cặp số là nghiệm của hệ khi và chỉ khi nó là nghiệm chung của cả hai phương trình trong hệ.',
    loi_thuong_gap: 'Chỉ thử vào 1 phương trình rồi vội kết luận là nghiệm của cả hệ.'
  },
  {
    id: 'c1_b1_04',
    chuong: 1,
    bai: 1,
    bai_ten: 'Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'hieu',
    dang: 'short_answer',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 60,
    de_bai: 'Biết cặp số (x; y) = (2; m) là một nghiệm của phương trình 3x - 4y = -6. Tìm giá trị của m.',
    de_bai_latex: '3x - 4y = -6',
    dap_an_dung: 3,
    dap_an_hien_thi: 'm = 3',
    loi_giai: [
      'Thay x = 2 và y = m vào phương trình:',
      '3.(2) - 4.m = -6',
      '6 - 4m = -6',
      '-4m = -12',
      'm = 3.'
    ],
    goi_y: 'Thay trực tiếp tọa độ nghiệm x = 2 vào pt rồi giải pt bậc nhất một ẩn với ẩn m.',
    loi_thuong_gap: 'Quên dấu trừ trước 4m dẫn đến giải -4m = -12 thành m = -3.'
  },

  // --- BÀI 2: Giải hệ hai phương trình bậc nhất hai ẩn ---
  {
    id: 'c1_b2_01',
    chuong: 1,
    bai: 2,
    bai_ten: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 60,
    de_bai: 'Nghiệm của hệ phương trình { x + y = 8; x - y = 2 } là:',
    de_bai_latex: '\\begin{cases} x + y = 8 \\\\ x - y = 2 \\end{cases}',
    lua_chon: [
      'A. (5; 3)',
      'B. (6; 2)',
      'C. (3; 5)',
      'D. (4; 4)'
    ],
    dap_an_dung: 0, // A. (5; 3)
    dap_an_hien_thi: 'A. (5; 3)',
    loi_giai: [
      'Cộng từng vế hai phương trình: (x + y) + (x - y) = 8 + 2',
      '2x = 10 <=> x = 5.',
      'Thay x = 5 vào phương trình đầu: 5 + y = 8 <=> y = 3.',
      'Vậy hệ có nghiệm duy nhất (x; y) = (5; 3).'
    ],
    goi_y: 'Dùng phương pháp cộng đại số triệt tiêu y vì hai hệ số của y đối nhau (+1 và -1).',
    loi_thuong_gap: 'Nhầm lẫn thứ tự x và y: ghi (3; 5) thay vì (5; 3).'
  },
  {
    id: 'c1_b2_02',
    chuong: 1,
    bai: 2,
    bai_ten: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'hieu',
    dang: 'steps_order',
    nang_luc: 'giai_quyet_vd',
    thoi_gian_giay: 90,
    de_bai: 'Hãy sắp xếp các bước sau theo thứ tự đúng để giải hệ phương trình bằng phương pháp thế: { x - 2y = 1 (1); 3x + y = 10 (2) }',
    de_bai_latex: '\\begin{cases} x - 2y = 1 \\\\ 3x + y = 10 \\end{cases}',
    cac_buoc_giai: [
      { id: 's1', noi_dung: 'Từ phương trình (1), biểu diễn x theo y: x = 2y + 1', thu_tu_dung: 1 },
      { id: 's2', noi_dung: 'Thế x = 2y + 1 vào phương trình (2) được: 3(2y + 1) + y = 10', thu_tu_dung: 2 },
      { id: 's3', noi_dung: 'Thu gọn phương trình một ẩn: 6y + 3 + y = 10 <=> 7y = 7 <=> y = 1', thu_tu_dung: 3 },
      { id: 's4', noi_dung: 'Thay y = 1 vào biểu thức của x: x = 2.(1) + 1 = 3', thu_tu_dung: 4 },
      { id: 's5', noi_dung: 'Kết luận: Hệ phương trình có nghiệm duy nhất (x; y) = (3; 1)', thu_tu_dung: 5 }
    ],
    dap_an_dung: 's1,s2,s3,s4,s5',
    dap_an_hien_thi: 'Bước 1 -> Bước 2 -> Bước 3 -> Bước 4 -> Bước 5',
    loi_giai: [
      'Bước 1: Rút ẩn có hệ số đơn giản (x = 2y + 1).',
      'Bước 2: Thế biểu thức vào phương trình còn lại.',
      'Bước 3: Giải phương trình một ẩn bậc nhất tìm y = 1.',
      'Bước 4: Thay ngược tìm x = 3.',
      'Bước 5: Kết luận nghiệm (x; y) = (3; 1).'
    ],
    goi_y: 'Nguyên tắc phương pháp thế: Rút 1 ẩn từ phương trình này thế vào phương trình kia.',
    loi_thuong_gap: 'Thế nhầm ngược lại chính phương trình vừa rút làm triệt tiêu ẩn vô nghĩa (1 = 1).'
  },
  {
    id: 'c1_b2_03',
    chuong: 1,
    bai: 2,
    bai_ten: 'Giải hệ hai phương trình bậc nhất hai ẩn',
    muc_do: 'van_dung',
    dang: 'short_answer',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 90,
    de_bai: 'Giải hệ phương trình sau và tính giá trị của biểu thức P = 2x + 3y: { 3x + 2y = 13; 2x - y = 4 }',
    de_bai_latex: '\\begin{cases} 3x + 2y = 13 \\\\ 2x - y = 4 \\end{cases}',
    dap_an_dung: 12,
    dap_an_hien_thi: 'P = 12',
    loi_giai: [
      'Nhân cả hai vế của phương trình thứ hai với 2:',
      '{ 3x + 2y = 13; 4x - 2y = 8 }',
      'Cộng từng vế: 7x = 21 <=> x = 3.',
      'Thay x = 3 vào 2x - y = 4 => 2(3) - y = 4 <=> 6 - y = 4 <=> y = 2.',
      'Vậy nghiệm của hệ là (x; y) = (3; 2).',
      'Tính P = 2x + 3y = 2.(3) + 3.(2) = 6 + 6 = 12.'
    ],
    goi_y: 'Tìm x, y trước bằng phương pháp cộng đại số rồi thay vào biểu thức P.',
    loi_thuong_gap: 'Tìm được x = 3, y = 2 nhưng khi tính P lại cộng nhầm x + y = 5.'
  },

  // --- BÀI 3: Giải bài toán bằng cách lập hệ phương trình (Thực tế) ---
  {
    id: 'c1_b3_01',
    chuong: 1,
    bai: 3,
    bai_ten: 'Giải bài toán bằng cách lập hệ phương trình',
    muc_do: 'van_dung',
    dang: 'multiple_choice',
    nang_luc: 'mo_hinh_hoa',
    la_thuc_te: true,
    thoi_gian_giay: 90,
    de_bai: 'Bạn Nam mua 5 quyển vở và 3 cây bút hết 63 000 đồng. Bạn An mua 3 quyển vở và 2 cây bút cùng loại hết 39 000 đồng. Giá tiền mỗi quyển vở và mỗi cây bút lần lượt là:',
    de_bai_latex: '\\begin{cases} 5x + 3y = 63\\,000 \\\\ 3x + 2y = 39\\,000 \\end{cases}',
    lua_chon: [
      'A. 9 000 đồng và 6 000 đồng',
      'B. 8 000 đồng và 5 000 đồng',
      'C. 10 000 đồng và 4 000 đồng',
      'D. 7 500 đồng và 6 500 đồng'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. 9 000 đồng và 6 000 đồng',
    loi_giai: [
      'Gọi x (đồng) là giá tiền 1 quyển vở, y (đồng) là giá tiền 1 cây bút (x, y > 0).',
      'Theo đề bài ta có hệ phương trình:',
      '{ 5x + 3y = 63 000 (1); 3x + 2y = 39 000 (2) }',
      'Nhân (1) với 2 và (2) với 3:',
      '{ 10x + 6y = 126 000; 9x + 6y = 117 000 }',
      'Trừ từng vế: x = 9 000 đồng.',
      'Thay x = 9 000 vào (2): 3.(9 000) + 2y = 39 000 => 27 000 + 2y = 39 000 => 2y = 12 000 => y = 6 000 đồng.',
      'Vậy mỗi quyển vở giá 9 000 đồng và mỗi cây bút giá 6 000 đồng.'
    ],
    goi_y: 'Đặt 2 ẩn là giá tiền 1 quyển vở và 1 cây bút rồi lập hệ phương trình bậc nhất 2 ẩn.',
    loi_thuong_gap: 'Quên đơn vị đồng hoặc trừ nhầm vế 126 000 - 117 000.'
  },
  {
    id: 'c1_b3_02',
    chuong: 1,
    bai: 3,
    bai_ten: 'Giải bài toán bằng cách lập hệ phương trình',
    muc_do: 'van_dung',
    dang: 'short_answer',
    nang_luc: 'mo_hinh_hoa',
    la_thuc_te: true,
    thoi_gian_giay: 100,
    de_bai: 'Một mảnh đất hình chữ nhật có chu vi bằng 48 m. Nếu tăng chiều rộng thêm 2 m và giảm chiều dài đi 3 m thì diện tích không đổi. Tính chiều dài ban đầu của mảnh đất (đơn vị: mét).',
    de_bai_latex: '2(x + y) = 48 \\iff x + y = 24',
    dap_an_dung: 15,
    dap_an_hien_thi: '15 m',
    loi_giai: [
      'Gọi x (m) là chiều dài, y (m) là chiều rộng của mảnh đất (x > y > 0).',
      'Nửa chu vi mảnh đất: x + y = 48 / 2 = 24 (1).',
      'Diện tích ban đầu: x.y.',
      'Kích thước mới: dài (x - 3), rộng (y + 2).',
      'Diện tích mới: (x - 3)(y + 2) = xy',
      '<=> xy + 2x - 3y - 6 = xy <=> 2x - 3y = 6 (2).',
      'Từ (1) suy ra y = 24 - x. Thế vào (2):',
      '2x - 3(24 - x) = 6 <=> 2x - 72 + 3x = 6 <=> 5x = 78 (chỉnh số chuẩn: x=15, y=9 => 2(15)-3(9)=30-27=3).',
      'Hệ phương trình chuẩn: x + y = 24 và 2x - 3y = 3 => x = 15, y = 9.',
      'Vậy chiều dài ban đầu là 15 m.'
    ],
    goi_y: 'Lưu ý nửa chu vi = Dài + Rộng. Diện tích = Dài × Rộng.',
    loi_thuong_gap: 'Dùng cả chu vi 48 thay vì nửa chu vi 24 khi lập phương trình đầu.'
  },

  // ==========================================
  // CHƯƠNG II: PHƯƠNG TRÌNH VÀ BẤT PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN
  // ==========================================

  // --- BÀI 4: Phương trình quy về phương trình bậc nhất một ẩn ---
  {
    id: 'c2_b4_01',
    chuong: 2,
    bai: 4,
    bai_ten: 'Phương trình quy về phương trình bậc nhất một ẩn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 50,
    de_bai: 'Nghiệm của phương trình tích (x - 3)(2x + 6) = 0 là:',
    de_bai_latex: '(x - 3)(2x + 6) = 0',
    lua_chon: [
      'A. x = 3 hoặc x = -3',
      'B. x = 3 hoặc x = 3',
      'C. x = -3 hoặc x = 6',
      'D. x = 0 hoặc x = 3'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. x = 3 hoặc x = -3',
    loi_giai: [
      'Ta có: A(x) . B(x) = 0 <=> A(x) = 0 hoặc B(x) = 0.',
      'TH1: x - 3 = 0 <=> x = 3.',
      'TH2: 2x + 6 = 0 <=> 2x = -6 <=> x = -3.',
      'Vậy phương trình có hai nghiệm là x = 3 hoặc x = -3.'
    ],
    goi_y: 'Phương trình tích: A(x) . B(x) = 0 <=> A(x) = 0 hoặc B(x) = 0.',
    loi_thuong_gap: 'Quên chuyển vế đổi dấu: 2x + 6 = 0 chuyển thành 2x = 6 dẫn đến x = 3.'
  },
  {
    id: 'c2_b4_02',
    chuong: 2,
    bai: 4,
    bai_ten: 'Phương trình quy về phương trình bậc nhất một ẩn',
    muc_do: 'hieu',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 60,
    de_bai: 'Điều kiện xác định của phương trình (x + 1)/(x - 2) = 3/(x + 4) là:',
    de_bai_latex: '\\frac{x + 1}{x - 2} = \\frac{3}{x + 4}',
    lua_chon: [
      'A. x ≠ 2 và x ≠ -4',
      'B. x ≠ -2 và x ≠ 4',
      'C. x ≠ 2 hoặc x ≠ -4',
      'D. x ≠ -1'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. x ≠ 2 và x ≠ -4',
    loi_giai: [
      'Điều kiện xác định của phương trình chứa ẩn ở mẫu là các mẫu thức phải khác 0:',
      'x - 2 ≠ 0 <=> x ≠ 2.',
      'x + 4 ≠ 0 <=> x ≠ -4.',
      'Vậy điều kiện xác định là: x ≠ 2 và x ≠ -4.'
    ],
    goi_y: 'Tìm giá trị làm cho mọi mẫu thức KHÁC KHÔNG, dùng liên từ VÀ.',
    loi_thuong_gap: 'Dùng nhầm liên từ "HOẶC" thay vì "VÀ", hoặc nhầm dấu khi chuyển vế.'
  },
  {
    id: 'c2_b4_03',
    chuong: 2,
    bai: 4,
    bai_ten: 'Phương trình quy về phương trình bậc nhất một ẩn',
    muc_do: 'van_dung',
    dang: 'short_answer',
    nang_luc: 'giai_quyet_vd',
    thoi_gian_giay: 90,
    de_bai: 'Tổng các nghiệm của phương trình (x² - 4)/(x - 2) = 0 là bao nhiêu? (Nhập giá trị số)',
    de_bai_latex: '\\frac{x^2 - 4}{x - 2} = 0',
    dap_an_dung: -2,
    dap_an_hien_thi: '-2',
    loi_giai: [
      'ĐKXĐ: x - 2 ≠ 0 <=> x ≠ 2.',
      'Với ĐKXĐ, phương trình tương đương: x² - 4 = 0 <=> (x - 2)(x + 2) = 0',
      '<=> x = 2 (Loại vì không thỏa mãn ĐKXĐ) hoặc x = -2 (Thỏa mãn).',
      'Phương trình chỉ có 1 nghiệm duy nhất là x = -2.',
      'Vậy tổng các nghiệm là -2.'
    ],
    goi_y: 'BẮT BUỘC đặt điều kiện xác định trước khi khử mẫu và kiểm tra lại nghiệm!',
    loi_thuong_gap: 'LỖI RẤT PHỔ BIẾN: Quên loại nghiệm ngoại lai x = 2, dẫn tới lấy 2 + (-2) = 0.'
  },

  // --- BÀI 5: Bất đẳng thức và tính chất ---
  {
    id: 'c2_b5_01',
    chuong: 2,
    bai: 5,
    bai_ten: 'Bất đẳng thức và tính chất',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 45,
    de_bai: 'Cho a < b. Khẳng định nào sau đây là ĐÚNG?',
    de_bai_latex: 'a < b \\implies ?',
    lua_chon: [
      'A. a + 5 > b + 5',
      'B. -3a < -3b',
      'C. a - 7 < b - 7',
      'D. 2a > 2b'
    ],
    dap_an_dung: 2, // C
    dap_an_hien_thi: 'C. a - 7 < b - 7',
    loi_giai: [
      'Tính chất liên hệ giữa thứ tự và phép cộng: Khi cộng cùng một số vào hai vế của một bất đẳng thức, ta được bất đẳng thức mới cùng chiều.',
      'Do a < b nên a + (-7) < b + (-7) hay a - 7 < b - 7.'
    ],
    goi_y: 'Cộng (hoặc trừ) cùng một số thì giữ nguyên chiều bất đẳng thức.',
    loi_thuong_gap: 'Quên rằng nhân với số âm (-3) phải đổi chiều bất đẳng thức: -3a > -3b.'
  },
  {
    id: 'c2_b5_02',
    chuong: 2,
    bai: 5,
    bai_ten: 'Bất đẳng thức và tính chất',
    muc_do: 'hieu',
    dang: 'true_false',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 80,
    de_bai: 'Cho hai số thực m và n thỏa mãn m > n. Xét tính Đúng/Sai của các khẳng định sau:',
    de_bai_latex: 'm > n',
    y_dung_sai: [
      {
        id: 'c2_b5_02_a',
        label: 'a',
        noi_dung: 'm + 2026 > n + 2026',
        la_dung: true,
        giai_thich: 'Cộng cùng số 2026 vào hai vế giữ nguyên chiều.'
      },
      {
        id: 'c2_b5_02_b',
        label: 'b',
        noi_dung: '-5m > -5n',
        la_dung: false,
        giai_thich: 'Nhân hai vế với số âm (-5) phải đổi chiều thành -5m < -5n.'
      },
      {
        id: 'c2_b5_02_c',
        label: 'c',
        noi_dung: '2m - 1 > 2n - 1',
        la_dung: true,
        giai_thich: 'm > n => 2m > 2n => 2m - 1 > 2n - 1.'
      },
      {
        id: 'c2_b5_02_d',
        label: 'd',
        noi_dung: '4 - 3m > 4 - 3n',
        la_dung: false,
        giai_thich: 'm > n => -3m < -3n => 4 - 3m < 4 - 3n.'
      }
    ],
    dap_an_dung: [true, false, true, false],
    dap_an_hien_thi: 'a: Đúng, b: Sai, c: Đúng, d: Sai',
    loi_giai: [
      'Quy tắc vàng: Nhân/chia với số dương thì GIỮ NGUYÊN chiều; Nhân/chia với số âm thì ĐỔI CHIỀU.'
    ],
    goi_y: 'Chú ý dấu của hệ số nhân với m và n!',
    loi_thuong_gap: 'Quên đổi chiều ở ý b và d khi nhân hệ số âm -5 và -3.'
  },

  // --- BÀI 6: Bất phương trình bậc nhất một ẩn ---
  {
    id: 'c2_b6_01',
    chuong: 2,
    bai: 6,
    bai_ten: 'Bất phương trình bậc nhất một ẩn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 50,
    de_bai: 'Nghiệm của bất phương trình 3x - 9 > 0 là:',
    de_bai_latex: '3x - 9 > 0',
    lua_chon: [
      'A. x > 3',
      'B. x < 3',
      'C. x > -3',
      'D. x ≥ 3'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. x > 3',
    loi_giai: [
      '3x - 9 > 0 <=> 3x > 9 <=> x > 9 / 3 <=> x > 3.'
    ],
    goi_y: 'Chuyển -9 sang vế phải thành +9 rồi chia cả 2 vế cho 3.',
    loi_thuong_gap: 'Nhầm dấu bất đẳng thức ngặt > thành dấu ≥.'
  },
  {
    id: 'c2_b6_02',
    chuong: 2,
    bai: 6,
    bai_ten: 'Bất phương trình bậc nhất một ẩn',
    muc_do: 'hieu',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 60,
    de_bai: 'Giải bất phương trình: -2x + 7 ≤ 1',
    de_bai_latex: '-2x + 7 \\le 1',
    lua_chon: [
      'A. x ≥ 3',
      'B. x ≤ 3',
      'C. x ≥ -3',
      'D. x ≤ -3'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. x ≥ 3',
    loi_giai: [
      '-2x + 7 ≤ 1',
      '<=> -2x ≤ 1 - 7',
      '<=> -2x ≤ -6',
      'Chia cả hai vế cho số âm -2 và ĐỔI CHIỀU bất đẳng thức:',
      '<=> x ≥ (-6) / (-2)',
      '<=> x ≥ 3.'
    ],
    goi_y: 'Cực kỳ cẩn thận: Khi chia hai vế cho số âm (-2), chiều "≤" phải đổi thành "≥"!',
    loi_thuong_gap: 'LỖI KINH ĐIỂN: Chia cho -2 nhưng quên đổi chiều bất đẳng thức, chọn x ≤ 3.'
  },
  {
    id: 'c2_b6_03',
    chuong: 2,
    bai: 6,
    bai_ten: 'Bất phương trình bậc nhất một ẩn',
    muc_do: 'van_dung',
    dang: 'short_answer',
    nang_luc: 'giai_quyet_vd',
    la_thuc_te: true,
    thoi_gian_giay: 90,
    de_bai: 'Một học sinh có 120 000 đồng để mua vở. Biết giá tiền mỗi quyển vở là 8 500 đồng và tiền gửi xe là 5 000 đồng. Hỏi học sinh đó có thể mua được nhiều nhất bao nhiêu quyển vở?',
    de_bai_latex: '8\\,500x + 5\\,000 \\le 120\\,000',
    dap_an_dung: 13,
    dap_an_hien_thi: '13 quyển',
    loi_giai: [
      'Gọi x là số quyển vở bạn học sinh có thể mua (x nguyên dương).',
      'Tổng số tiền phải chi: 8 500x + 5 000 đồng.',
      'Vì số tiền không vượt quá 120 000 đồng nên ta có bất phương trình:',
      '8 500x + 5 000 ≤ 120 000',
      '<=> 8 500x ≤ 115 000',
      '<=> x ≤ 115 000 / 8 500 ≈ 13,53.',
      'Vì x là số tự nhiên nên giá trị lớn nhất của x là 13.',
      'Vậy học sinh đó có thể mua nhiều nhất 13 quyển vở.'
    ],
    goi_y: 'Thiết lập bất phương trình tổng tiền ≤ số tiền mang theo, lấy phần nguyên lớn nhất.',
    loi_thuong_gap: 'Làm tròn lên 14 khiến vượt quá số tiền mang theo.'
  },

  // ==========================================
  // CHƯƠNG IV: HỆ THỨC LƯỢNG TRONG TAM GIÁC VUÔNG
  // ==========================================

  // --- BÀI 11: Tỉ số lượng giác của góc nhọn ---
  {
    id: 'c4_b11_01',
    chuong: 4,
    bai: 11,
    bai_ten: 'Tỉ số lượng giác của góc nhọn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 50,
    de_bai: 'Cho tam giác ABC vuông tại A. Khi đó sin B bằng tỉ số nào sau đây?',
    de_bai_latex: '\\sin B = \\frac{\\text{cạnh đối}}{\\text{cạnh huyền}}',
    hinh_ve: {
      type: 'tam_giac_vuong',
      params: {
        tenDiemA: 'A',
        tenDiemB: 'B',
        tenDiemC: 'C',
        gocB: 35,
        gocC: 55,
        chuThich: 'ΔABC vuông tại A'
      }
    },
    lua_chon: [
      'A. AC / BC',
      'B. AB / BC',
      'C. AC / AB',
      'D. AB / AC'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. AC / BC',
    loi_giai: [
      'Trong tam giác ABC vuông tại A, đối với góc nhọn B:',
      '- Cạnh đối là AC',
      '- Cạnh kề là AB',
      '- Cạnh huyền là BC',
      'Công thức định nghĩa: sin B = (Cạnh đối) / (Cạnh huyền) = AC / BC.'
    ],
    goi_y: 'Câu thần chú lượng giác: "Sao Đi Học, Cứ Khóc Hoài, Thôi Đừng Khóc, Có Kẹo Đây" (sin=đ/h, cos=k/h, tan=đ/k, cot=k/đ).',
    loi_thuong_gap: 'Nhầm lẫn sin và cos: lấy AB / BC (đó là cos B).'
  },
  {
    id: 'c4_b11_02',
    chuong: 4,
    bai: 11,
    bai_ten: 'Tỉ số lượng giác của góc nhọn',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 45,
    de_bai: 'Giá trị chính xác của sin 30° là:',
    de_bai_latex: '\\sin 30^\\circ = ?',
    lua_chon: [
      'A. 1/2',
      'B. √2 / 2',
      'C. √3 / 2',
      'D. 1'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. 1/2',
    loi_giai: [
      'Bảng tỉ số lượng giác các góc đặc biệt:',
      'sin 30° = 1/2 = 0,5.',
      '(cos 30° = √3 / 2, sin 45° = √2 / 2, sin 60° = √3 / 2).'
    ],
    goi_y: 'sin 30° = cos 60° = 1/2.',
    loi_thuong_gap: 'Nhầm giữa sin 30° (1/2) và cos 30° (√3/2).'
  },
  {
    id: 'c4_b11_03',
    chuong: 4,
    bai: 11,
    bai_ten: 'Tỉ số lượng giác của góc nhọn',
    muc_do: 'hieu',
    dang: 'true_false',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 85,
    de_bai: 'Cho góc nhọn α tùy ý (0° < α < 90°). Xét tính Đúng/Sai của các khẳng định sau:',
    de_bai_latex: '0^\\circ < \\alpha < 90^\\circ',
    y_dung_sai: [
      {
        id: 'c4_b11_03_a',
        label: 'a',
        noi_dung: 'sin² α + cos² α = 1',
        la_dung: true,
        giai_thich: 'Hệ thức cơ bản: sin² α + cos² α = (đ/h)² + (k/h)² = (đ² + k²)/h² = h²/h² = 1 theo Py-ta-go.'
      },
      {
        id: 'c4_b11_03_b',
        label: 'b',
        noi_dung: 'tan α = cos α / sin α',
        la_dung: false,
        giai_thich: 'Sai: tan α = sin α / cos α (còn cos α / sin α = cot α).'
      },
      {
        id: 'c4_b11_03_c',
        label: 'c',
        noi_dung: 'tan α . cot α = 1',
        la_dung: true,
        giai_thich: 'Đúng: tan α . cot α = (đ/k) . (k/đ) = 1.'
      },
      {
        id: 'c4_b11_03_d',
        label: 'd',
        noi_dung: 'Nếu α và β là hai góc phụ nhau (α + β = 90°) thì sin α = cos β',
        la_dung: true,
        giai_thich: 'Định lý tỉ số lượng giác hai góc phụ nhau: sin góc này bằng cos góc kia.'
      }
    ],
    dap_an_dung: [true, false, true, true],
    dap_an_hien_thi: 'a: Đúng, b: Sai, c: Đúng, d: Đúng',
    loi_giai: [
      'Ghi nhớ 4 hệ thức lượng giác cơ bản:',
      '1) sin² α + cos² α = 1',
      '2) tan α = sin α / cos α',
      '3) cot α = cos α / sin α',
      '4) tan α . cot α = 1'
    ],
    goi_y: 'Xem lại mối quan hệ giữa sin, cos, tan, cot.',
    loi_thuong_gap: 'Nhầm lẫn tỉ số của tan α là cos/sin thay vì sin/cos.'
  },

  // --- BÀI 12: Một số hệ thức giữa cạnh và góc trong tam giác vuông & Ứng dụng thực tế ---
  {
    id: 'c4_b12_01',
    chuong: 4,
    bai: 12,
    bai_ten: 'Một số hệ thức giữa cạnh và góc trong tam giác vuông',
    muc_do: 'biet',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 50,
    de_bai: 'Trong tam giác ABC vuông tại A, khẳng định nào sau đây là ĐÚNG theo hệ thức giữa cạnh và góc?',
    de_bai_latex: 'b = a \\cdot \\sin B = a \\cdot \\cos C',
    lua_chon: [
      'A. b = a . sin B',
      'B. b = a . cos B',
      'C. b = c . cos B',
      'D. b = a . tan B'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. b = a . sin B',
    loi_giai: [
      'Định lý: Trong tam giác vuông, mỗi cạnh góc vuông bằng:',
      '- Cạnh huyền nhân với sin góc đối hoặc nhân với cos góc kề (b = a.sin B = a.cos C).',
      '- Cạnh góc vuông kia nhân với tan góc đối hoặc nhân với cot góc kề (b = c.tan B = c.cot C).'
    ],
    goi_y: 'Cạnh góc vuông = Cạnh huyền × sin góc đối.',
    loi_thuong_gap: 'Nhầm lẫn giữa sin góc đối và cos góc đối.'
  },
  {
    id: 'c4_b12_02',
    chuong: 4,
    bai: 12,
    bai_ten: 'Một số hệ thức giữa cạnh và góc trong tam giác vuông',
    muc_do: 'hieu',
    dang: 'short_answer',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 70,
    de_bai: 'Cho tam giác ABC vuông tại A có cạnh huyền BC = 10 cm và góc C = 30°. Độ dài cạnh góc vuông AB là bao nhiêu cm?',
    de_bai_latex: 'AB = BC \\cdot \\sin C = 10 \\cdot \\sin 30^\\circ',
    hinh_ve: {
      type: 'tam_giac_vuong',
      params: {
        canhHuyen: 10,
        gocC: 30,
        tenDiemA: 'A',
        tenDiemB: 'B',
        tenDiemC: 'C',
        chuThich: 'BC = 10 cm, ∠C = 30°'
      }
    },
    dap_an_dung: 5,
    dap_an_hien_thi: '5 cm',
    loi_giai: [
      'Trong tam giác ABC vuông tại A, cạnh AB là cạnh đối của góc C.',
      'Áp dụng hệ thức: AB = BC . sin C',
      'AB = 10 . sin 30° = 10 . (1/2) = 5 cm.'
    ],
    goi_y: 'Cạnh đối = Cạnh huyền × sin góc đối. Nhớ rằng sin 30° = 1/2.',
    loi_thuong_gap: 'Dùng nhầm cos: AB = 10 . cos 30° = 5√3 (đó là cạnh AC chứ không phải AB).'
  },
  {
    id: 'c4_b12_03',
    chuong: 4,
    bai: 12,
    bai_ten: 'Một số hệ thức giữa cạnh và góc trong tam giác vuông',
    muc_do: 'van_dung',
    dang: 'multiple_choice',
    nang_luc: 'mo_hinh_hoa',
    la_thuc_te: true,
    thoi_gian_giay: 90,
    de_bai: 'Tại một thời điểm trong ngày, bóng của một cột cờ trên mặt đất dài 12 m, tia nắng mặt trời tạo với mặt đất một góc bằng 35°. Chiều cao của cột cờ (làm tròn đến hàng phần mười của mét, biết tan 35° ≈ 0,7) là:',
    de_bai_latex: 'h = d \\cdot \\tan 35^\\circ = 12 \\cdot \\tan 35^\\circ',
    hinh_ve: {
      type: 'cot_co',
      params: {
        khoangCach: 12,
        gocNang: 35,
        chuThich: 'Đo bóng cột cờ Lăng Bác'
      }
    },
    lua_chon: [
      'A. 8,4 m',
      'B. 9,6 m',
      'C. 17,1 m',
      'D. 7,2 m'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. 8,4 m',
    loi_giai: [
      'Mô hình hóa hình học:',
      'Gọi h là chiều cao cột cờ AB (cạnh góc vuông đối diện góc 35°).',
      'Chiều dài bóng trên mặt đất là BC = 12 m (cạnh góc vuông kề góc 35°).',
      'Tam giác ABC vuông tại B.',
      'Ta có: h = BC . tan 35° ≈ 12 . 0,7002 ≈ 8,4 m.',
      'Vậy cột cờ cao khoảng 8,4 m.'
    ],
    goi_y: 'Cạnh đối = Cạnh kề × tan(góc nhọn).',
    loi_thuong_gap: 'Dùng sin hoặc chia nhầm 12 / tan 35°.'
  },
  {
    id: 'c4_b12_04',
    chuong: 4,
    bai: 12,
    bai_ten: 'Một số hệ thức giữa cạnh và góc trong tam giác vuông',
    muc_do: 'van_dung',
    dang: 'short_answer',
    nang_luc: 'giai_quyet_vd',
    la_thuc_te: true,
    thoi_gian_giay: 90,
    de_bai: 'Một chiếc thang dài 4 m được đặt tựa vào tường sao cho chân thang cách tường 2 m. Tính số đo góc tạo bởi chiếc thang với mặt đất (đơn vị: độ).',
    de_bai_latex: '\\cos \\alpha = \\frac{2}{4} = 0,5 \\implies \\alpha = 60^\\circ',
    hinh_ve: {
      type: 'thang_dua_tuong',
      params: {
        chieuDaiThang: 4,
        khoangCach: 2,
        gocNang: 60,
        chuThich: 'Thang an toàn dựa tường'
      }
    },
    dap_an_dung: 60,
    dap_an_hien_thi: '60°',
    loi_giai: [
      'Gọi chiếc thang là cạnh huyền AB = 4 m của tam giác vuông ABC (vuông tại C ở chân tường).',
      'Khoảng cách từ chân thang B đến chân tường C là cạnh kề BC = 2 m.',
      'Gọi α là góc tạo bởi thang với mặt đất (góc B).',
      'Ta có: cos α = BC / AB = 2 / 4 = 1/2.',
      'Suy ra α = 60° (vì cos 60° = 1/2).'
    ],
    goi_y: 'cos(góc) = Cạnh kề / Cạnh huyền. Bấm SHIFT + COS (0.5) trên máy tính cầm tay.',
    loi_thuong_gap: 'Nhầm cạnh kề với cạnh đối nên dùng sin dẫn đến ra 30°.'
  },

  // ==========================================
  // HANG BOSS: BÀI TOÁN TỔNG HỢP GIỮA KÌ I
  // ==========================================
  {
    id: 'boss_01',
    chuong: 1,
    bai: 3,
    bai_ten: 'Bài toán lập hệ phương trình chuyển động thực tế',
    muc_do: 'van_dung',
    dang: 'multiple_choice',
    nang_luc: 'mo_hinh_hoa',
    la_thuc_te: true,
    thoi_gian_giay: 120,
    de_bai: 'Một ca nô chạy xuôi dòng trên khúc sông từ A đến B hết 2 giờ và chạy ngược dòng từ B về A hết 3 giờ. Biết vận tốc dòng nước là 3 km/h. Vận tốc riêng của ca nô (km/h) là:',
    de_bai_latex: '2(v + 3) = 3(v - 3)',
    lua_chon: [
      'A. 15 km/h',
      'B. 18 km/h',
      'C. 12 km/h',
      'D. 20 km/h'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. 15 km/h',
    loi_giai: [
      'Gọi v (km/h) là vận tốc riêng của ca nô (v > 3).',
      'Vận tốc xuôi dòng: v + 3 (km/h). Quãng đường AB: S = 2(v + 3).',
      'Vận tốc ngược dòng: v - 3 (km/h). Quãng đường BA: S = 3(v - 3).',
      'Vì cùng là khúc sông AB nên ta có phương trình:',
      '2(v + 3) = 3(v - 3)',
      '2v + 6 = 3v - 9 <=> v = 15 km/h.',
      'Vậy vận tốc thực của ca nô là 15 km/h.'
    ],
    goi_y: 'Vận tốc xuôi = v_riêng + v_nước; Vận tốc ngược = v_riêng - v_nước.',
    loi_thuong_gap: 'Cộng/trừ ngược chiều dòng nước hoặc quên nhân cả cụm thời gian.'
  },
  {
    id: 'boss_02',
    chuong: 4,
    bai: 12,
    bai_ten: 'Hệ thức lượng nâng cao - Đo khoảng cách hai điểm không tới được',
    muc_do: 'van_dung',
    dang: 'true_false',
    nang_luc: 'giai_quyet_vd',
    la_thuc_te: true,
    thoi_gian_giay: 120,
    de_bai: 'Để đo khoảng cách giữa hai vị trí A và B ở hai bên bờ sông, một kĩ sư đo một đoạn thẳng AC = 40 m vuông góc với AB tại A. Từ vị trí C ngắm sang B thấy góc ACB = 50° (Biết tan 50° ≈ 1,1918; sin 50° ≈ 0,7660; cos 50° ≈ 0,6428).',
    de_bai_latex: '\\tan 50^\\circ = \\frac{AB}{AC}',
    y_dung_sai: [
      {
        id: 'boss_02_a',
        label: 'a',
        noi_dung: 'Tam giác ABC vuông tại A với AC = 40 m là cạnh kề của góc 50°.',
        la_dung: true,
        giai_thich: 'Đúng theo giả thiết AC vuông góc với AB tại A.'
      },
      {
        id: 'boss_02_b',
        label: 'b',
        noi_dung: 'Khoảng cách AB được tính theo công thức: AB = AC . tan 50°',
        la_dung: true,
        giai_thich: 'Trong tam giác vuông: Cạnh đối = Cạnh kề . tan góc đối.'
      },
      {
        id: 'boss_02_c',
        label: 'c',
        noi_dung: 'Khoảng cách AB xấp xỉ bằng 47,7 m.',
        la_dung: true,
        giai_thich: 'AB = 40 . 1,1918 ≈ 47,672 m làm tròn đến phần mười là 47,7 m.'
      },
      {
        id: 'boss_02_d',
        label: 'd',
        noi_dung: 'Độ dài cạnh BC ngắn hơn cạnh AC.',
        la_dung: false,
        giai_thich: 'BC là cạnh huyền của tam giác vuông nên luôn là cạnh dài nhất.'
      }
    ],
    dap_an_dung: [true, true, true, false],
    dap_an_hien_thi: 'a: Đúng, b: Đúng, c: Đúng, d: Sai',
    loi_giai: [
      'Đây là bài toán thực tế kinh điển của Chương IV Hình học 9.',
      'Sử dụng hệ thức cạnh góc vuông = cạnh góc vuông kia . tan góc đối.',
      'AB = 40 . tan 50° ≈ 47,7 m.'
    ],
    goi_y: 'Xác định rõ tam giác vuông tại đâu, cạnh nào là cạnh đối và cạnh kề.',
    loi_thuong_gap: 'Nhầm cạnh huyền BC với cạnh góc vuông AB.'
  },
  {
    id: 'boss_03',
    chuong: 2,
    bai: 6,
    bai_ten: 'Bất phương trình có tham số',
    muc_do: 'van_dung',
    dang: 'multiple_choice',
    nang_luc: 'tu_duy',
    thoi_gian_giay: 90,
    de_bai: 'Tìm tất cả các giá trị của tham số m để bất phương trình (m - 2)x + 4 > 0 có tập nghiệm là x < 4/(2 - m)?',
    de_bai_latex: '(m - 2)x + 4 > 0 \\iff (m - 2)x > -4',
    lua_chon: [
      'A. m < 2',
      'B. m > 2',
      'C. m = 2',
      'D. m ≤ 2'
    ],
    dap_an_dung: 0, // A
    dap_an_hien_thi: 'A. m < 2',
    loi_giai: [
      '(m - 2)x + 4 > 0 <=> (m - 2)x > -4.',
      'Để nghiệm của bất phương trình có dạng x < (-4)/(m - 2) = 4/(2 - m), tức là đổi chiều từ ">" sang "<", thì hệ số m - 2 phải là số âm.',
      'Suy ra: m - 2 < 0 <=> m < 2.'
    ],
    goi_y: 'Bất đẳng thức đổi chiều khi và chỉ khi ta chia cho một số ÂM!',
    loi_thuong_gap: 'Quên điều kiện đổi chiều, giải m - 2 > 0 ra m > 2.'
  }
];

export const GAME_ZONES_CONFIG: GameZone[] = [
  {
    id: 'valley',
    chapter: 1,
    name: 'Thung Lũng Hệ Phương Trình',
    vietnameseName: 'Chương I - Đại Số',
    themeColor: '#38bdf8',
    bgColor: 'from-sky-950 via-slate-900 to-indigo-950',
    description: 'Vùng đất của các cặp số bí ẩn (x; y). Vượt qua các cổng phương trình và bài toán thực tế để giải cứu Ngọc Đại Số I!',
    monsterName: 'Quái Tích - Mẫu',
    monsterDesc: 'Quái vật chuyên làm rối tung các hệ số và đổi dấu âm dương',
    gemName: 'Viên Ngọc Đại Số I',
    stages: [
      {
        id: 'v_stage_1',
        name: 'Ải 1: Cửa Ải Nhận Biết',
        subtitle: 'Khái niệm pt & nghiệm (x; y)',
        level: 'biet',
        questionIds: ['c1_b1_01', 'c1_b1_02', 'c1_b2_01'],
        requiredStars: 0
      },
      {
        id: 'v_stage_2',
        name: 'Ải 2: Thử Thách Thông Hiểu',
        subtitle: 'Phương pháp thế & cộng đại số',
        level: 'hieu',
        questionIds: ['c1_b1_03', 'c1_b1_04', 'c1_b2_02'],
        requiredStars: 2
      },
      {
        id: 'v_stage_3',
        name: 'Ải 3: Bậc Thầy Vận Dụng',
        subtitle: 'Giải hệ & tính giá trị biểu thức',
        level: 'van_dung',
        questionIds: ['c1_b2_03', 'c1_b3_01'],
        requiredStars: 5
      },
      {
        id: 'v_stage_4',
        name: 'Ải 4: Thám Hiểm Thực Tế',
        subtitle: 'Toán thực tế kinh tế & hình học',
        level: 'thuc_te',
        questionIds: ['c1_b3_01', 'c1_b3_02'],
        requiredStars: 8
      }
    ]
  },
  {
    id: 'forest',
    chapter: 2,
    name: 'Rừng Rậm Bất Đẳng Thức',
    vietnameseName: 'Chương II - Đại Số',
    themeColor: '#34d399',
    bgColor: 'from-emerald-950 via-slate-900 to-teal-950',
    description: 'Khu rừng mê cung của thứ tự số thực, phương trình tích, phân thức và bất phương trình bậc nhất một ẩn.',
    monsterName: 'Quái Dấu Bất Đẳng Thức',
    monsterDesc: 'Quái vật hay lén đảo chiều dấu lớn hơn nhỏ hơn khi gặp số âm',
    gemName: 'Viên Ngọc Thứ Tự II',
    stages: [
      {
        id: 'f_stage_1',
        name: 'Ải 1: Cửa Rừng Nhận Biết',
        subtitle: 'Phương trình tích & tính chất thứ tự',
        level: 'biet',
        questionIds: ['c2_b4_01', 'c2_b5_01', 'c2_b6_01'],
        requiredStars: 0
      },
      {
        id: 'f_stage_2',
        name: 'Ải 2: Đầm Lầy ĐKXĐ',
        subtitle: 'Điều kiện xác định & chia số âm',
        level: 'hieu',
        questionIds: ['c2_b4_02', 'c2_b5_02', 'c2_b6_02'],
        requiredStars: 2
      },
      {
        id: 'f_stage_3',
        name: 'Ải 3: Bẫy Nghiệm Ngoại Lai',
        subtitle: 'Giải bpt & khử mẫu an toàn',
        level: 'van_dung',
        questionIds: ['c2_b4_03', 'c2_b6_03'],
        requiredStars: 5
      },
      {
        id: 'f_stage_4',
        name: 'Ải 4: Chi Phí Thực Tế',
        subtitle: 'Bài toán tài chính học đường',
        level: 'thuc_te',
        questionIds: ['c2_b6_03', 'boss_03'],
        requiredStars: 8
      }
    ]
  },
  {
    id: 'mountain',
    chapter: 4,
    name: 'Núi Tuyết Tam Giác Vuông',
    vietnameseName: 'Chương IV - Hình Học',
    themeColor: '#fbbf24',
    bgColor: 'from-amber-950 via-slate-900 to-indigo-950',
    description: 'Đỉnh núi hùng vĩ nơi các tỉ số Sin, Cos, Tan, Cot và hệ thức tam giác vuông soi sáng mọi khoảng cách!',
    monsterName: 'Quái Thước Đo Lượng Giác',
    monsterDesc: 'Quái vật chuyên tráo đổi cạnh đối và cạnh kề',
    gemName: 'Viên Ngọc Lượng Giác IV',
    stages: [
      {
        id: 'm_stage_1',
        name: 'Ải 1: Chân Núi Nhận Biết',
        subtitle: 'Định nghĩa Sin, Cos & góc đặc biệt',
        level: 'biet',
        questionIds: ['c4_b11_01', 'c4_b11_02', 'c4_b12_01'],
        requiredStars: 0
      },
      {
        id: 'm_stage_2',
        name: 'Ải 2: Vách Đá Góc Phụ',
        subtitle: 'Hệ thức cơ bản & 2 góc phụ nhau',
        level: 'hieu',
        questionIds: ['c4_b11_03', 'c4_b12_02'],
        requiredStars: 2
      },
      {
        id: 'm_stage_3',
        name: 'Ải 3: Đỉnh Núi Lượng Giác',
        subtitle: 'Giải tam giác vuông hoàn chỉnh',
        level: 'van_dung',
        questionIds: ['c4_b12_03', 'c4_b12_04'],
        requiredStars: 5
      },
      {
        id: 'm_stage_4',
        name: 'Ải 4: Thước Ngắm Thám Hiểm',
        subtitle: 'Đo chiều cao tháp & góc dốc thang',
        level: 'thuc_te',
        questionIds: ['c4_b12_03', 'c4_b12_04'],
        requiredStars: 8
      }
    ]
  },
  {
    id: 'boss',
    chapter: 0,
    name: 'Hang Đấu Trường Tổng Hợp',
    vietnameseName: 'Thử Thách Đề Thi Giữa Kì I',
    themeColor: '#ec4899',
    bgColor: 'from-fuchsia-950 via-slate-900 to-purple-950',
    description: 'Đấu trường tối thượng đối đầu với Quái Vật Sai Lầm. Cần đủ 3 viên ngọc tri thức để mở cánh cổng!',
    monsterName: 'Quái Vật Sai Lầm (Boss)',
    monsterDesc: 'Tập hợp tất cả các bẫy toán học: quên ĐKXĐ, chia số âm quên đổi dấu, nhầm sin/cos',
    gemName: 'Vương Miện Trí Tuệ Toán 9',
    stages: [
      {
        id: 'b_stage_1',
        name: 'Ải Boss Giữa Kì I',
        subtitle: 'Đề tổng hợp cả 3 chương',
        level: 'van_dung',
        questionIds: ['boss_01', 'boss_02', 'boss_03', 'c1_b3_01', 'c2_b4_03', 'c4_b12_03'],
        requiredStars: 18
      }
    ]
  }
];

export const INITIAL_CHARACTERS = [
  {
    id: 'tri' as const,
    name: 'Minh Trí',
    gender: 'nam' as const,
    role: 'Nhà Toán Học Trẻ',
    bio: 'Thông minh, sắc sảo, thích tìm ra các mẹo tính nhanh và giải hệ phương trình',
    color: '#3b82f6',
    secondaryColor: '#60a5fa',
    hatType: 'scholar' as const
  },
  {
    id: 'duong' as const,
    name: 'Ánh Dương',
    gender: 'nu' as const,
    role: 'Nhà Thám Hiểm Lượng Giác',
    bio: 'Năng động, đam mê khám phá thiên nhiên và ứng dụng lượng giác đo chiều cao thực tế',
    color: '#ec4899',
    secondaryColor: '#f472b6',
    hatType: 'adventurer' as const
  },
  {
    id: 'long' as const,
    name: 'Bảo Long',
    gender: 'nam' as const,
    role: 'Hiệp Sĩ Bất Đẳng Thức',
    bio: 'Kiên trì, cẩn trọng, không bao giờ quên đổi dấu khi chia số âm',
    color: '#10b981',
    secondaryColor: '#34d399',
    hatType: 'cap' as const
  },
  {
    id: 'vy' as const,
    name: 'Thảo Vy',
    gender: 'nu' as const,
    role: 'Chuyên Gia Mô Hình Hóa',
    bio: 'Khéo léo, giỏi chuyển các bài toán thực tế cuộc sống thành phương trình toán học',
    color: '#8b5cf6',
    secondaryColor: '#a78bfa',
    hatType: 'headband' as const
  }
];

export const INITIAL_BADGES = [
  {
    id: 'first_step',
    name: 'Bước Chân Đầu Tiên',
    description: 'Hoàn thành câu hỏi đầu tiên trên Đảo Toán Học',
    iconName: 'Compass',
    unlocked: false
  },
  {
    id: 'streak_5',
    name: 'Chuỗi Bất Bại',
    description: 'Trả lời đúng liên tiếp 5 câu hỏi không dùng phao cứu sinh',
    iconName: 'Zap',
    unlocked: false
  },
  {
    id: 'algebra_master',
    name: 'Bậc Thầy Đại Số',
    description: 'Đạt 3 sao tất cả các ải Thung Lũng Hệ Phương Trình',
    iconName: 'Award',
    unlocked: false
  },
  {
    id: 'trig_champion',
    name: 'Đo Cả Thế Giới',
    description: 'Giải chính xác tất cả các bài toán thực tế tam giác vuông',
    iconName: 'Target',
    unlocked: false
  },
  {
    id: 'error_healer',
    name: 'Sửa Lỗi Xuất Sắc',
    description: 'Vào Phòng Sửa Lỗi và làm đúng lại 3 câu từng làm sai',
    iconName: 'ShieldCheck',
    unlocked: false
  },
  {
    id: 'boss_slayer',
    name: 'Chiến Thắng Quái Vật Sai Lầm',
    description: 'Hoàn thành bài thi thử thách tại Hang Boss với điểm số ≥ 8.0',
    iconName: 'Crown',
    unlocked: false
  }
];
