/**
 * LẠC HỒNG SỐ — Campaign Copy, Configuration & Handcrafted 2D Motif Artworks
 * Synchronized 100% with deliverables/02_ThietKe/campaign.config.json
 */

export const OFFICIAL_RESOLUTION_URL =
  'https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm';

export const PALETTE = {
  youthBlue: '#1464B4',
  deepNavy: '#0D2B52',
  redAccent: '#D62828',
  warmGold: '#F0C14B',
  warmCream: '#F7F3E8',
  deepGreen: '#0E5A38',
};

export const EMBLEM_ASSET = {
  src: './assets/identity/derived/huy-hieu-doan-clean.png',
  alt: 'Huy hiệu Đoàn Thanh niên Cộng sản Hồ Chí Minh',
};

export const SHARED_COPY = {
  headerLabel: 'NGHỊ QUYẾT 57-NQ/TW',
  panelBadge: 'CỤM 1 · NGHỊ QUYẾT 57-NQ/TW',
  footerEvent: 'Cụm 1 · Trại Thanh niên số thành phố Đồng Nai 2026',
  sourceLine: 'Nguồn: Nghị quyết 57-NQ/TW, Bộ Chính trị (22/12/2024).',
  aiDisclosureWeb:
    'Minh họa 2D bán hiện thực được thực hiện với sự hỗ trợ của công cụ AI; nhân vật và bối cảnh là giả lập truyền thông.',
};

export const LANDING_DATA = {
  eyebrow: 'CỤM 1 · TRẠI THANH NIÊN SỐ THÀNH PHỐ ĐỒNG NAI 2026',
  badge: 'CHỦ ĐỀ 1 · NGHỊ QUYẾT 57-NQ/TW',
  conceptTitle: 'LẠC HỒNG SỐ',
  seriesTitle: 'LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1',
  tagline: 'Hiểu đúng – Làm thật – Lan tỏa giá trị số',
  introSummary:
    'Triển lãm trực quan gồm 05 ấn phẩm theo mạch Lạc Hồng Số: đưa Nghị quyết 57-NQ/TW từ nhận thức học tập của người trẻ đến hành động thiết thực và lan tỏa trong cộng đồng Cụm 1.',
  startButtonLabel: 'Khám phá bộ 05 ấn phẩm',
  speakerCue:
    'Chào mừng quý đại biểu đến với triển lãm Lạc Hồng Số của Cụm 1. Bộ 05 ấn phẩm truyền tải tinh thần Nghị quyết 57-NQ/TW theo mạch kể gần gũi: từ khởi nguồn nhận thức đến hành động thiết thực và lan tỏa trong cộng đồng.',
};

export const FINALE_DATA = {
  eyebrow: 'TỔNG KẾT CHIẾN DỊCH · LẠC HỒNG SỐ',
  heading: 'HIỂU ĐÚNG – LÀM THẬT – LAN TỎA GIÁ TRỊ SỐ',
  summary:
    'Bộ 05 ấn phẩm khẳng định tinh thần đồng hành của thanh niên Cụm 1 với Nghị quyết 57-NQ/TW: lấy người dân làm trung tâm, trau dồi tri thức số và lan tỏa lợi ích công nghệ thiết thực tại cơ sở.',
  officialButtonLabel: 'Đọc toàn văn Nghị quyết 57-NQ/TW (mst.gov.vn)',
  officialUrl: OFFICIAL_RESOLUTION_URL,
  replayButtonLabel: 'Xem lại từ ấn phẩm 01/05',
  backToLandingLabel: 'Về màn hình giới thiệu',
  sourceCredit: `${SHARED_COPY.footerEvent} | ${SHARED_COPY.sourceLine}`,
  aiDisclosure: SHARED_COPY.aiDisclosureWeb,
  qrLabel: 'Quét mã đối chiếu trực tiếp toàn văn trên Cổng TTĐT Bộ KH&CN (mst.gov.vn)',
  speakerCue:
    'Khép lại hành trình 05 ấn phẩm Lạc Hồng Số, thanh niên Cụm 1 cam kết tinh thần Hiểu đúng – Làm thật – Lan tỏa giá trị số, bắt đầu từ những việc nhỏ thiết thực tại địa phương và đối chiếu trực tiếp toàn văn Nghị quyết 57-NQ/TW.',
};

export const STAGE_PILLS = [
  { stage: 0, shortLabel: 'Mở đầu', fullLabel: 'Mở đầu' },
  { stage: 1, shortLabel: '01', fullLabel: '01 / 05' },
  { stage: 2, shortLabel: '02', fullLabel: '02 / 05' },
  { stage: 3, shortLabel: '03', fullLabel: '03 / 05' },
  { stage: 4, shortLabel: '04', fullLabel: '04 / 05' },
  { stage: 5, shortLabel: '05', fullLabel: '05 / 05' },
  { stage: 6, shortLabel: 'Kết', fullLabel: 'Tổng kết' },
];

/**
 * Handcrafted 2D gouache-line inline SVGs tailored per poster slide (Section H).
 * Palette strictly follows #1464B4, #0D2B52, #D62828, #F0C14B, #F7F3E8, #0E5A38.
 */
export const MOTIF_SVGS = {
  'study-horizon': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Soft Dong Son sun arcs -->
      <circle cx="268" cy="58" r="42" stroke="#F0C14B" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.65"/>
      <circle cx="268" cy="58" r="24" fill="#F0C14B" fill-opacity="0.18" stroke="#1464B4" stroke-width="1.2"/>
      <!-- Open notebook & bookmark -->
      <path d="M36 84 C54 78, 78 78, 96 84 L96 42 C78 36, 54 36, 36 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M96 84 C114 78, 138 78, 156 84 L156 42 C138 36, 114 36, 96 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M96 42 L96 92 L102 87 L108 92 L108 42" fill="#D62828" opacity="0.9"/>
      <line x1="48" y1="53" x2="84" y2="51" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <line x1="48" y1="63" x2="80" y2="61" stroke="#1464B4" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
      <line x1="112" y1="53" x2="144" y2="55" stroke="#0E5A38" stroke-width="2" stroke-linecap="round"/>
      <!-- Tablet / digital device -->
      <rect x="174" y="34" width="52" height="62" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="180" y="42" width="40" height="44" rx="4" fill="#F7F3E8"/>
      <circle cx="200" cy="64" r="9" fill="#1464B4" fill-opacity="0.18" stroke="#1464B4" stroke-width="1.6"/>
      <path d="M196 64 L199 67 L205 60" stroke="#0E5A38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Two Chim Lac cranes gliding -->
      <path d="M244 42 C254 32, 268 32, 278 40 C268 38, 258 41, 248 48 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M276 28 C286 20, 298 20, 306 27 C298 25, 290 27, 281 33 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3" stroke-linejoin="round"/>
      <path d="M258 70 Q274 58 292 68" stroke="#1464B4" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 3"/>
    </svg>
  `,
  'three-pillars': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Connecting Dong Son ring -->
      <ellipse cx="170" cy="60" rx="116" ry="38" stroke="#F0C14B" stroke-width="1.6" stroke-dasharray="5 4"/>
      <!-- Pillar 1: Khoa hoc, cong nghe -->
      <circle cx="72" cy="58" r="30" fill="#FFFFFF" stroke="#1464B4" stroke-width="2"/>
      <circle cx="72" cy="58" r="6" fill="#0D2B52"/>
      <ellipse cx="72" cy="58" rx="20" ry="8" transform="rotate(30 72 58)" stroke="#1464B4" stroke-width="1.6"/>
      <ellipse cx="72" cy="58" rx="20" ry="8" transform="rotate(-30 72 58)" stroke="#1464B4" stroke-width="1.6"/>
      <!-- Pillar 2: Doi moi sang tao -->
      <circle cx="170" cy="54" r="32" fill="#FFFFFF" stroke="#D62828" stroke-width="2"/>
      <path d="M170 34 C160 34, 154 42, 156 51 C157 56, 162 59, 163 64 L177 64 C178 59, 183 56, 184 51 C186 42, 180 34, 170 34 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.8"/>
      <line x1="164" y1="70" x2="176" y2="70" stroke="#0D2B52" stroke-width="2" stroke-linecap="round"/>
      <line x1="170" y1="25" x2="170" y2="29" stroke="#D62828" stroke-width="2" stroke-linecap="round"/>
      <line x1="147" y1="36" x2="150" y2="39" stroke="#D62828" stroke-width="2" stroke-linecap="round"/>
      <line x1="193" y1="36" x2="190" y2="39" stroke="#D62828" stroke-width="2" stroke-linecap="round"/>
      <!-- Pillar 3: Chuyen doi so -->
      <circle cx="268" cy="58" r="30" fill="#FFFFFF" stroke="#0E5A38" stroke-width="2"/>
      <rect x="252" y="42" width="18" height="30" rx="3" fill="#0D2B52"/>
      <rect x="255" y="46" width="12" height="20" rx="1.5" fill="#F7F3E8"/>
      <path d="M274 52 C274 47, 282 47, 284 51 C288 51, 289 58, 285 60 L273 60 C270 60, 270 53, 274 52 Z" fill="#1464B4" stroke="#0D2B52" stroke-width="1.3"/>
    </svg>
  `,
  'community-action': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Smartphone guidance icon -->
      <rect x="34" y="24" width="44" height="68" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="40" y="32" width="32" height="48" rx="4" fill="#FFFFFF"/>
      <circle cx="56" cy="52" r="10" fill="#0E5A38" fill-opacity="0.16" stroke="#0E5A38" stroke-width="1.8"/>
      <path d="M52 52 L55 55 L61 48" stroke="#0E5A38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Helping hand & citizen bridge -->
      <path d="M92 64 C112 52, 134 52, 152 64" stroke="#1464B4" stroke-width="2.4" stroke-linecap="round"/>
      <circle cx="102" cy="40" r="10" fill="#1464B4"/>
      <path d="M88 78 C88 66, 116 66, 116 78" fill="#1464B4" fill-opacity="0.22" stroke="#1464B4" stroke-width="2"/>
      <circle cx="144" cy="42" r="10" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.6"/>
      <path d="M130 78 C130 66, 158 66, 158 78" fill="#0E5A38" fill-opacity="0.2" stroke="#0E5A38" stroke-width="2"/>
      <!-- Local digital shop stall & safe badge -->
      <path d="M196 42 L298 42 L306 54 L188 54 Z" fill="#D62828" stroke="#0D2B52" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="196" y="54" width="102" height="36" rx="4" fill="#FFFFFF" stroke="#0D2B52" stroke-width="1.8"/>
      <rect x="208" y="62" width="32" height="20" rx="3" fill="#1464B4" fill-opacity="0.15" stroke="#1464B4" stroke-width="1.5"/>
      <path d="M262 63 L286 63 M262 72 L280 72" stroke="#0D2B52" stroke-width="2" stroke-linecap="round"/>
      <circle cx="294" cy="30" r="10" fill="#0E5A38"/>
      <path d="M290 30 L293 33 L299 27" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  'community-ripple': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Concentric community waves -->
      <circle cx="110" cy="60" r="18" fill="#1464B4" fill-opacity="0.15" stroke="#1464B4" stroke-width="2"/>
      <circle cx="110" cy="60" r="34" stroke="#F0C14B" stroke-width="1.8" stroke-dasharray="5 4"/>
      <circle cx="110" cy="60" r="50" stroke="#1464B4" stroke-width="1.4" opacity="0.55"/>
      <!-- Connected community nodes -->
      <circle cx="110" cy="60" r="8" fill="#D62828"/>
      <circle cx="184" cy="40" r="9" fill="#1464B4"/>
      <circle cx="196" cy="80" r="9" fill="#0E5A38"/>
      <circle cx="252" cy="56" r="10" fill="#0D2B52"/>
      <path d="M118 57 L175 42 M118 64 L187 78 M193 43 L242 54 M205 77 L242 59" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <!-- Expanding Chim Lac flock -->
      <path d="M266 32 C276 22, 290 22, 300 30 C290 28, 280 31, 270 38 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M286 48 C295 40, 307 40, 315 47 C307 45, 298 47, 290 53 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M250 84 C260 76, 272 76, 280 83 C272 81, 263 83, 254 89 Z" fill="#1464B4" fill-opacity="0.25" stroke="#1464B4" stroke-width="1.3"/>
    </svg>
  `,
  'lac-hong-ascent': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Rising Dong Son sun horizon -->
      <path d="M36 92 A76 76 0 0 1 188 92" fill="#F0C14B" fill-opacity="0.22" stroke="#F0C14B" stroke-width="2"/>
      <path d="M62 92 A50 50 0 0 1 162 92" stroke="#0D2B52" stroke-width="1.6" stroke-dasharray="4 3"/>
      <line x1="26" y1="92" x2="314" y2="92" stroke="#0D2B52" stroke-width="2" stroke-linecap="round"/>
      <!-- Digital knowledge beacon -->
      <rect x="92" y="54" width="40" height="38" rx="6" fill="#0D2B52"/>
      <path d="M104 68 L112 60 L120 68 M112 60 L112 80" stroke="#F0C14B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Ascending Chim Lac cranes -->
      <path d="M172 64 C186 50, 204 50, 218 61 C204 58, 190 62, 177 72 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.5"/>
      <path d="M214 44 C228 32, 244 32, 256 41 C244 39, 231 42, 219 51 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.5"/>
      <path d="M254 28 C266 18, 280 18, 290 26 C280 24, 269 27, 258 34 Z" fill="#D62828" fill-opacity="0.85" stroke="#0D2B52" stroke-width="1.3"/>
      <!-- QR verification icon -->
      <rect x="260" y="52" width="32" height="32" rx="5" fill="#FFFFFF" stroke="#1464B4" stroke-width="1.8"/>
      <rect x="265" y="57" width="8" height="8" fill="#0D2B52"/>
      <rect x="279" y="57" width="8" height="8" fill="#0D2B52"/>
      <rect x="265" y="71" width="8" height="8" fill="#0D2B52"/>
      <rect x="279" y="71" width="4" height="4" fill="#1464B4"/>
      <rect x="283" y="75" width="4" height="4" fill="#D62828"/>
    </svg>
  `,
};

export const POSTERS = [
  {
    id: 1,
    stage: 1,
    index: '01/05',
    badgeLabel: '01 / 05',
    filename: '01_KhoiNguonNhanThuc.png',
    posterPath: './assets/posters/01_KhoiNguonNhanThuc.png',
    role: 'KHỞI NGUỒN NHẬN THỨC',
    storyBeat: 'KHỞI NGUỒN NHẬN THỨC',
    title: 'NGHỊ QUYẾT 57 GẦN THANH NIÊN THẾ NÀO?',
    subtitle: 'Bắt đầu từ học tập, công nghệ và đời sống hằng ngày.',
    microNote: null,
    cta: null,
    hasQr: false,
    qrTargetUrl: null,
    highlightKeyword: 'học tập, công nghệ và đời sống hằng ngày',
    editorialSummary:
      'Mở đầu mạch truyện bằng câu hỏi gần gũi: tháo gỡ cảm giác xa lạ trước văn kiện dài để đoàn viên Cụm 1 nhận ra Nghị quyết 57-NQ/TW bắt đầu ngay từ học tập, công nghệ và đời sống hằng ngày.',
    motifTitle: 'Sổ tay tri thức & thiết bị số',
    motifSvgKey: 'study-horizon',
    domainPills: ['Học tập số', 'Công nghệ gần gũi', 'Đời sống hằng ngày'],
    speakerCue:
      'Với nhiều đoàn viên, thanh niên Cụm 1, các văn kiện nghị quyết thường dài và nhiều thuật ngữ. Nhưng khi nhìn vào việc học tập, sử dụng công nghệ và đời sống hằng ngày, câu hỏi gần gũi nhất chính là Nghị quyết 57-NQ/TW chạm tới người trẻ từ đâu.',
  },
  {
    id: 2,
    stage: 2,
    index: '02/05',
    badgeLabel: '02 / 05',
    filename: '02_HieuDungNoiDung.png',
    posterPath: './assets/posters/02_HieuDungNoiDung.png',
    role: 'HIỂU ĐÚNG NỘI DUNG',
    storyBeat: 'HIỂU ĐÚNG NỘI DUNG',
    title: 'HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG',
    subtitle: 'Khoa học, công nghệ · Đổi mới sáng tạo · Chuyển đổi số',
    microNote: 'Ba nội dung gợi nhớ cốt lõi của Nghị quyết 57-NQ/TW',
    cta: null,
    hasQr: false,
    qrTargetUrl: null,
    highlightKeyword: 'Khoa học, công nghệ · Đổi mới sáng tạo · Chuyển đổi số',
    editorialSummary:
      'Hệ thống hóa ba nội dung gợi nhớ cốt lõi quanh vòng Trống đồng Đông Sơn, giúp người trẻ nắm chắc bản chất đột phá của Nghị quyết 57-NQ/TW trước khi chuyển hóa thành hành động.',
    motifTitle: 'Ba nội dung gợi nhớ cốt lõi',
    motifSvgKey: 'three-pillars',
    domainPills: ['Khoa học, công nghệ', 'Đổi mới sáng tạo', 'Chuyển đổi số'],
    speakerCue:
      'Để hành động đúng, trước hết cần hiểu đúng tinh thần Nghị quyết 57-NQ/TW qua ba nội dung gợi nhớ cốt lõi: phát triển khoa học, công nghệ; thúc đẩy đổi mới sáng tạo; và chuyển đổi số gắn với năng lực học tập số của thế hệ trẻ.',
  },
  {
    id: 3,
    stage: 3,
    index: '03/05',
    badgeLabel: '03 / 05',
    filename: '03_HanhDongThietThuc.png',
    posterPath: './assets/posters/03_HanhDongThietThuc.png',
    role: 'HÀNH ĐỘNG THIẾT THỰC',
    storyBeat: 'HÀNH ĐỘNG THIẾT THỰC',
    title: 'THANH NIÊN HÀNH ĐỘNG',
    subtitle: 'Học kỹ năng số · Hỗ trợ người dân · Đồng hành cơ sở',
    microNote: 'Gợi ý phần việc thanh niên Cụm 1 tại cơ sở',
    cta: null,
    hasQr: false,
    qrTargetUrl: null,
    highlightKeyword: 'Học kỹ năng số · Hỗ trợ người dân · Đồng hành cơ sở',
    editorialSummary:
      'Đề xuất các phần việc cụ thể, vừa sức cho thanh niên Cụm 1 tại cơ sở: tự rèn kỹ năng số, kiên nhẫn hướng dẫn người lớn tuổi thao tác smartphone an toàn và hỗ trợ hộ kinh doanh địa phương.',
    motifTitle: 'Hỗ trợ người dân & cơ sở số',
    motifSvgKey: 'community-action',
    domainPills: ['Học kỹ năng số', 'Hỗ trợ người dân', 'Hộ kinh doanh số'],
    speakerCue:
      'Từ nhận thức đúng, bộ ấn phẩm gợi ý những phần việc thiết thực để thanh niên Cụm 1 triển khai tại cơ sở: chủ động học kỹ năng số, kiên nhẫn hỗ trợ người dân thao tác công nghệ an toàn và đồng hành cùng địa phương trong chuyển đổi số.',
  },
  {
    id: 4,
    stage: 4,
    index: '04/05',
    badgeLabel: '04 / 05',
    filename: '04_LanToaCongDong.png',
    posterPath: './assets/posters/04_LanToaCongDong.png',
    role: 'LAN TỎA TRONG CỘNG ĐỒNG',
    storyBeat: 'LAN TỎA TRONG CỘNG ĐỒNG',
    title: 'TỪ MỘT NGƯỜI ĐẾN CẢ CỘNG ĐỒNG',
    subtitle: 'Người dân là trung tâm — công nghệ phục vụ cuộc sống.',
    microNote: null,
    cta: null,
    hasQr: false,
    qrTargetUrl: null,
    highlightKeyword: 'Người dân là trung tâm',
    editorialSummary:
      'Thể hiện sức lan tỏa tự nhiên khi công nghệ thật sự phục vụ cuộc sống: từ một người dân nắm được thao tác số an toàn, kỹ năng tiếp tục truyền nối qua gia đình và khu dân cư Cụm 1.',
    motifTitle: 'Mạng kết nối & Chim Lạc mở rộng',
    motifSvgKey: 'community-ripple',
    domainPills: ['Người dân là trung tâm', 'Kết nối cộng đồng', 'Khu dân cư Cụm 1'],
    speakerCue:
      'Khi người dân là trung tâm và công nghệ thực sự phục vụ cuộc sống thường ngày, một kỹ năng được sẻ chia đúng cách sẽ nối tiếp từ một người sang cả gia đình, khu dân cư và cộng đồng Cụm 1.',
  },
  {
    id: 5,
    stage: 5,
    index: '05/05',
    badgeLabel: '05 / 05',
    filename: '05_KhatVongLacHongSo.png',
    posterPath: './assets/posters/05_KhatVongLacHongSo.png',
    role: 'KHÁT VỌNG LẠC HỒNG SỐ',
    storyBeat: 'KHÁT VỌNG LẠC HỒNG SỐ',
    title: 'HIỂU ĐÚNG – LÀM THẬT – LAN TỎA',
    subtitle: 'Khát vọng Lạc Hồng Số — Bắt đầu từ một việc nhỏ hôm nay.',
    microNote: null,
    cta: 'QUÉT MÃ ĐỌC NGHỊ QUYẾT GỐC',
    hasQr: true,
    qrTargetUrl: OFFICIAL_RESOLUTION_URL,
    highlightKeyword: 'Hiểu đúng – Làm thật – Lan tỏa',
    editorialSummary:
      'Kết tinh hành trình Lạc Hồng Số: tiếp nối tinh thần văn hóa Đông Sơn trong kỷ nguyên số, bắt đầu từ một việc nhỏ hôm nay và kết nối trực tiếp tới toàn văn Nghị quyết 57-NQ/TW qua mã QR xác thực.',
    motifTitle: 'Hành trình Lan tỏa & Tri thức số',
    motifSvgKey: 'lac-hong-ascent',
    domainPills: ['Khát vọng Lạc Hồng Số', 'Việc nhỏ hôm nay', 'Toàn văn mst.gov.vn'],
    speakerCue:
      'Khép lại mạch 05 ấn phẩm là khát vọng Lạc Hồng Số: tiếp nối bản sắc văn hóa Việt trong kỷ nguyên số bằng tinh thần Hiểu đúng – Làm thật – Lan tỏa, bắt đầu từ một việc nhỏ hôm nay và quét mã đối chiếu trực tiếp toàn văn Nghị quyết 57-NQ/TW.',
  },
];

export function getPosterByStage(stage) {
  return POSTERS.find((poster) => poster.stage === stage) || null;
}

export function getStageMeta(stage) {
  if (stage === 0) {
    return {
      stage: 0,
      id: 'stage-landing',
      label: 'Mở đầu',
      speakerCue: LANDING_DATA.speakerCue,
    };
  }
  if (stage === 6) {
    return {
      stage: 6,
      id: 'stage-finale',
      label: 'Tổng kết',
      speakerCue: FINALE_DATA.speakerCue,
    };
  }
  const poster = getPosterByStage(stage) || POSTERS[0];
  return {
    stage: poster.stage,
    id: 'stage-poster',
    label: poster.badgeLabel,
    speakerCue: poster.speakerCue,
    poster,
  };
}
