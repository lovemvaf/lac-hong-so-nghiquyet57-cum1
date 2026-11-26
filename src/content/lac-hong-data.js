/**
 * LẠC HỒNG SỐ — Single Source of Truth Data Binding & Handcrafted 2D Motif Artworks
 * Imports directly from ./campaign-content.json so zero poster titles, subtitles,
 * URLs, targets, or facts are duplicated.
 */

import campaignData from './campaign-content.json';

export const CAMPAIGN_META = campaignData.metadata;
export const CAMPAIGN_STATUS = campaignData.status;
export const CONCEPT_NOTICE = campaignData.conceptNotice;
export const RESOLUTION_INFO = campaignData.resolution;

export const OFFICIAL_RESOLUTION_URL = campaignData.officialResolutionUrl;
export const SECONDARY_OFFICIAL_URL = campaignData.secondaryOfficialUrl;
export const RELATED_IMPLEMENTATION_DOCS = campaignData.relatedImplementationDocs || [];
export const SEVEN_TASKS_GROUPED = campaignData.sevenTasksGrouped || [];
export const EVALUATION_QUESTIONS = campaignData.evaluationQuestions || [];

export const PALETTE = campaignData.palette;

export const EMBLEM_ASSET = {
  src: campaignData.emblem.publicDerivedClean.replace(/^public\//, './'),
  alt: campaignData.landing.emblemAlt,
};

export const SHARED_COPY = {
  headerLabel: campaignData.sharedCopy.headerLabel,
  panelBadge: `${campaignData.metadata.cumDonVi.toUpperCase()} · ${campaignData.sharedCopy.headerLabel}`,
  footerEvent: campaignData.sharedCopy.footerEvent,
  sourceLine: campaignData.sharedCopy.sourceLine,
  aiDisclosureWeb: campaignData.sharedCopy.aiDisclosureWeb,
};

export const CLAIM_TYPE_LABELS = {
  policy_fact: 'Định hướng NQ57',
  official_target: 'Mục tiêu NQ57',
  youth_action_suggestion: 'Đề xuất Cụm 1',
  interpretation: 'Thông điệp nhóm',
  illustrative_scene: 'Minh họa giả lập',
};

export const LANDING_DATA = {
  ...campaignData.landing,
  speakerCue:
    `Chào mừng quý đại biểu đến với triển lãm ${campaignData.conceptTitle} của ${campaignData.metadata.cumDonVi}. ` +
    `Bộ 05 ấn phẩm truyền tải tinh thần Nghị quyết ${campaignData.resolution.code} (${campaignData.resolution.issuedDate}) ` +
    `theo mạch: Đặt vấn đề → Quan điểm cốt lõi → Tầm nhìn 2030–2045 → Thanh niên hành động → Lan tỏa.`,
};

export const FINALE_DATA = {
  ...campaignData.finale,
  qrLabel:
    'Quét mã đọc trực tiếp toàn văn trên Cổng TTĐT Chính phủ (xaydungchinhsach.chinhphu.vn), kèm bản đối chiếu Bộ KH&CN (mst.gov.vn)',
  speakerCue:
    `Khép lại hành trình 05 ấn phẩm ${campaignData.conceptTitle}, thanh niên ${campaignData.metadata.cumDonVi} lan tỏa thông điệp ` +
    `"${campaignData.centralMessage}" — bắt đầu từ một việc nhỏ hôm nay và quét mã đối chiếu trực tiếp toàn văn Nghị quyết ${campaignData.resolution.code}.`,
};

export const STAGE_PILLS = [
  { stage: 0, shortLabel: 'Mở đầu', fullLabel: 'Mở đầu' },
  ...campaignData.posters.map((poster) => ({
    stage: poster.id,
    shortLabel: String(poster.id).padStart(2, '0'),
    fullLabel: poster.index.replace('/', ' / '),
  })),
  { stage: 6, shortLabel: 'Kết', fullLabel: 'Tổng kết' },
];

/**
 * Handcrafted 2D gouache-line inline SVGs semantically aligned with each V2 poster.
 * Strictly follows palette: #1464B4, #0D2B52, #D62828, #F0C14B, #F7F3E8, #0E5A38.
 */
export const MOTIF_SVGS = {
  'question-spark': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Soft Dong Son sun arcs -->
      <circle cx="268" cy="58" r="42" stroke="#F0C14B" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.68"/>
      <circle cx="268" cy="58" r="26" fill="#F0C14B" fill-opacity="0.18" stroke="#1464B4" stroke-width="1.3"/>
      <!-- Open notebook & bookmark -->
      <path d="M32 86 C50 80, 74 80, 92 86 L92 42 C74 36, 50 36, 32 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M92 86 C110 80, 134 80, 152 86 L152 42 C134 36, 110 36, 92 42 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="2" stroke-linejoin="round"/>
      <path d="M92 42 L92 93 L98 88 L104 93 L104 42" fill="#D62828" opacity="0.92"/>
      <line x1="44" y1="54" x2="80" y2="52" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <line x1="44" y1="64" x2="76" y2="62" stroke="#1464B4" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
      <line x1="108" y1="54" x2="140" y2="56" stroke="#0E5A38" stroke-width="2" stroke-linecap="round"/>
      <!-- Smartphone / digital device -->
      <rect x="170" y="30" width="46" height="66" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="176" y="38" width="34" height="48" rx="4" fill="#FFFFFF"/>
      <line x1="183" y1="50" x2="203" y2="50" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <line x1="183" y1="59" x2="198" y2="59" stroke="#0E5A38" stroke-width="2" stroke-linecap="round"/>
      <circle cx="193" cy="74" r="6" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <!-- Spark question arc -->
      <path d="M216 42 Q238 22 256 36" stroke="#D62828" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/>
      <circle cx="268" cy="58" r="16" fill="#FFFFFF" stroke="#D62828" stroke-width="2"/>
      <path d="M263 53 C263 48, 273 48, 273 53 C273 57, 268 58, 268 62" stroke="#0D2B52" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="268" cy="67" r="1.7" fill="#D62828"/>
      <!-- Spark rays -->
      <line x1="268" y1="22" x2="268" y2="28" stroke="#D62828" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="296" y1="32" x2="291" y2="37" stroke="#F0C14B" stroke-width="2" stroke-linecap="round"/>
      <line x1="304" y1="58" x2="298" y2="58" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `,
  'core-pillars': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Human-centered Dong Son circle -->
      <circle cx="170" cy="58" r="44" stroke="#F0C14B" stroke-width="1.8" stroke-dasharray="5 4"/>
      <circle cx="170" cy="58" r="30" fill="#FFFFFF" stroke="#1464B4" stroke-width="2.2"/>
      <circle cx="170" cy="49" r="7.5" fill="#0D2B52"/>
      <path d="M156 71 C156 61, 184 61, 184 71" fill="#1464B4" fill-opacity="0.22" stroke="#1464B4" stroke-width="2" stroke-linecap="round"/>
      <!-- Connector spokes to 4 policy nodes -->
      <path d="M140 50 L86 35 M140 66 L86 81 M200 50 L254 35 M200 66 L254 81" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Node 1: Dong luc phat trien -->
      <circle cx="68" cy="32" r="18" fill="#FFFFFF" stroke="#1464B4" stroke-width="1.8"/>
      <path d="M68 22 L73 34 L68 31 L63 34 Z" fill="#D62828"/>
      <circle cx="68" cy="39" r="3" fill="#F0C14B"/>
      <!-- Node 2: Con nguoi & 5 nen tang -->
      <circle cx="68" cy="84" r="18" fill="#FFFFFF" stroke="#0D2B52" stroke-width="1.8"/>
      <rect x="59" y="77" width="18" height="4" rx="1.5" fill="#1464B4"/>
      <rect x="59" y="83" width="18" height="4" rx="1.5" fill="#F0C14B"/>
      <rect x="59" y="89" width="18" height="4" rx="1.5" fill="#0D2B52"/>
      <!-- Node 3: Doi moi sang tao -->
      <circle cx="272" cy="32" r="18" fill="#FFFFFF" stroke="#D62828" stroke-width="1.8"/>
      <path d="M272 21 C266 21, 263 26, 264 31 C265 34, 267 36, 268 39 L276 39 C277 36, 279 34, 280 31 C281 26, 278 21, 272 21 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.4"/>
      <!-- Node 4: An toan so -->
      <circle cx="272" cy="84" r="18" fill="#FFFFFF" stroke="#0E5A38" stroke-width="1.8"/>
      <path d="M272 73 L282 77 L282 84 C282 90, 277 94, 272 96 C267 94, 262 90, 262 84 L262 77 Z" fill="#0E5A38" fill-opacity="0.16" stroke="#0E5A38" stroke-width="1.6"/>
      <path d="M268 84 L271 87 L277 81" stroke="#0E5A38" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `,
  'vision-2030-2045': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Sunrise Dong Son arcs on upper right -->
      <circle cx="282" cy="52" r="38" fill="#F0C14B" fill-opacity="0.2" stroke="#F0C14B" stroke-width="1.6" stroke-dasharray="4 4"/>
      <circle cx="282" cy="52" r="22" fill="#F0C14B" fill-opacity="0.45" stroke="#D62828" stroke-width="1.6"/>
      <!-- Horizon baseline -->
      <line x1="24" y1="92" x2="316" y2="92" stroke="#0D2B52" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Ascending trajectory arc 2030 -> 2045 -->
      <path d="M54 84 Q146 72 254 44" stroke="#1464B4" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M54 90 Q146 80 258 54" stroke="#F0C14B" stroke-width="1.5" stroke-dasharray="4 4"/>
      <!-- 2030 milestone -->
      <circle cx="118" cy="72" r="11" fill="#1464B4" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="94" y="42" width="48" height="20" rx="6" fill="#0D2B52"/>
      <text x="118" y="56" text-anchor="middle" fill="#F0C14B" font-size="10.5" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2030</text>
      <!-- 2045 milestone -->
      <circle cx="238" cy="48" r="12" fill="#D62828" stroke="#FFFFFF" stroke-width="2"/>
      <rect x="214" y="16" width="48" height="20" rx="6" fill="#D62828"/>
      <text x="238" y="30" text-anchor="middle" fill="#FFFFFF" font-size="10.5" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2045</text>
      <!-- Chim Lac cranes soaring toward sunrise -->
      <path d="M156 42 C168 30, 184 30, 195 39 C184 37, 172 40, 161 48 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M180 26 C190 17, 204 17, 212 24 C204 22, 193 25, 184 31 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M268 36 C277 27, 290 27, 298 34 C290 32, 280 34, 272 40 Z" fill="#FFFFFF" stroke="#0D2B52" stroke-width="1.2"/>
    </svg>
  `,
  'community-action': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Smartphone digital guide -->
      <rect x="28" y="24" width="42" height="68" rx="8" fill="#0D2B52" stroke="#1464B4" stroke-width="2"/>
      <rect x="34" y="32" width="30" height="48" rx="4" fill="#FFFFFF"/>
      <circle cx="49" cy="54" r="10" fill="#0E5A38" fill-opacity="0.16" stroke="#0E5A38" stroke-width="1.8"/>
      <path d="M45 54 L48 57 L54 50" stroke="#0E5A38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- Digital support bridge between youth & community -->
      <circle cx="102" cy="40" r="9.5" fill="#1464B4"/>
      <path d="M88 76 C88 64, 116 64, 116 76" fill="#1464B4" fill-opacity="0.22" stroke="#1464B4" stroke-width="2"/>
      <circle cx="148" cy="42" r="9.5" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.6"/>
      <path d="M134 76 C134 64, 162 64, 162 76" fill="#0E5A38" fill-opacity="0.2" stroke="#0E5A38" stroke-width="2"/>
      <path d="M98 58 Q125 46 152 58" stroke="#1464B4" stroke-width="2.2" stroke-linecap="round"/>
      <!-- 5 Action dots on curved community ribbon -->
      <path d="M188 76 Q244 26 306 58" stroke="#0D2B52" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="192" cy="74" r="9" fill="#1464B4" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="218" cy="54" r="9" fill="#0E5A38" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="246" cy="44" r="9" fill="#0D2B52" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="275" cy="46" r="9" fill="#D62828" stroke="#FFFFFF" stroke-width="1.6"/>
      <circle cx="302" cy="58" r="9" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.6"/>
      <text x="192" y="77.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">1</text>
      <text x="218" y="57.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">2</text>
      <text x="246" y="47.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">3</text>
      <text x="275" y="49.5" text-anchor="middle" fill="#FFFFFF" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">4</text>
      <text x="302" y="61.5" text-anchor="middle" fill="#0D2B52" font-size="9" font-weight="800" font-family="Be Vietnam Pro, sans-serif">5</text>
    </svg>
  `,
  'community-ripple': `
    <svg class="motif-svg" viewBox="0 0 340 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="2" y="2" width="336" height="112" rx="14" fill="#F7F3E8" stroke="#F0C14B" stroke-width="1.5"/>
      <!-- Expanding golden & blue community ripple -->
      <circle cx="102" cy="60" r="14" fill="#D62828" fill-opacity="0.16" stroke="#D62828" stroke-width="2"/>
      <circle cx="102" cy="60" r="28" stroke="#F0C14B" stroke-width="2"/>
      <circle cx="102" cy="60" r="42" stroke="#1464B4" stroke-width="1.6" stroke-dasharray="5 4"/>
      <circle cx="102" cy="60" r="56" stroke="#F0C14B" stroke-width="1.2" opacity="0.65"/>
      <circle cx="102" cy="60" r="6.5" fill="#D62828"/>
      <!-- Connected community beacons -->
      <circle cx="164" cy="40" r="7" fill="#1464B4"/>
      <circle cx="174" cy="80" r="7" fill="#0E5A38"/>
      <path d="M108 57 L157 42 M108 63 L167 78" stroke="#1464B4" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Chim Lac flight ascending -->
      <path d="M210 40 C222 28, 238 28, 248 37 C238 35, 226 38, 215 46 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M248 28 C258 19, 272 19, 281 26 C272 24, 262 27, 252 33 Z" fill="#F0C14B" stroke="#0D2B52" stroke-width="1.3"/>
      <path d="M280 42 C289 34, 301 34, 309 41 C301 39, 292 41, 284 47 Z" fill="#D62828" fill-opacity="0.88" stroke="#0D2B52" stroke-width="1.2"/>
      <!-- QR verification mark -->
      <rect x="252" y="54" width="38" height="38" rx="6" fill="#FFFFFF" stroke="#1464B4" stroke-width="2"/>
      <rect x="258" y="60" width="9" height="9" fill="#0D2B52"/>
      <rect x="275" y="60" width="9" height="9" fill="#0D2B52"/>
      <rect x="258" y="77" width="9" height="9" fill="#0D2B52"/>
      <rect x="275" y="77" width="4.5" height="4.5" fill="#1464B4"/>
      <rect x="280" y="81.5" width="4.5" height="4.5" fill="#D62828"/>
    </svg>
  `,
};

/**
 * UI-only presentation cues keyed by posterId so zero canonical copy, titles,
 * subtitles, facts, or URLs are duplicated outside campaign-content.json.
 */
const POSTER_UI_EXTENSIONS = {
  'NQ57-01': {
    highlightKeyword: '22/12/2024',
    editorialSummary:
      'Mở đầu mạch truyện bằng tình huống quen thuộc: người trẻ dùng smartphone và AI hằng ngày nhưng dễ ngại văn bản dài — để thấy Nghị quyết 57-NQ/TW (22/12/2024) gắn sát từ học tập đến dịch vụ công.',
    motifTitle: 'Sổ tay tri thức & câu hỏi mở',
    motifSvgKey: 'question-spark',
    domainPills: ['Câu hỏi gần gũi', 'Đời sống số', 'Phần Mở đầu NQ57'],
  },
  'NQ57-02': {
    highlightKeyword: 'con người',
    editorialSummary:
      'Chắt lọc Mục I Nghị quyết 57-NQ/TW thành 4 điểm định hướng cốt lõi quanh nguyên tắc lấy con người và doanh nghiệp làm trung tâm, đồng thời giữ an toàn không gian mạng xuyên suốt.',
    motifTitle: 'Trọng tâm con người & 4 định hướng',
    motifSvgKey: 'core-pillars',
    domainPills: ['Mục I.1–I.5 NQ57', '5 nền tảng cốt lõi', 'An toàn số'],
  },
  'NQ57-03': {
    highlightKeyword: '2030 → 2045',
    editorialSummary:
      'Hệ thống hóa các chỉ tiêu định lượng 2030 → 2045 theo Mục II.1–II.2 (rõ nhãn mục tiêu văn kiện, không phải kết quả hiện tại), liên kết với 7 nhóm nhiệm vụ trọng tâm tại Mục III.',
    motifTitle: 'Lộ trình 2030 → 2045 & khát vọng Việt Nam',
    motifSvgKey: 'vision-2030-2045',
    domainPills: ['Mục II.1 & II.2', '7 nhóm nhiệm vụ', 'Mục tiêu định hướng'],
  },
  'NQ57-04': {
    highlightKeyword: 'đề xuất phần việc',
    editorialSummary:
      'Tổng hợp 5 đề xuất phần việc vừa sức cho đoàn viên Cụm 1 tại cơ sở (không phải số liệu đã thống kê): từ tự học kỹ năng số, hỗ trợ người dân dùng dịch vụ công đến giữ an toàn thông tin.',
    motifTitle: 'Cầu nối số & 5 phần việc đề xuất',
    motifSvgKey: 'community-action',
    domainPills: ['Đề xuất Cụm 1', 'Học tập số', 'An toàn thông tin'],
  },
  'NQ57-05': {
    highlightKeyword: 'một việc nhỏ hôm nay',
    editorialSummary:
      'Khép lại hành trình bằng lời mời bắt đầu từ một việc nhỏ hôm nay để lan tỏa trong gia đình và khu dân cư Cụm 1, kèm mã QR kiểm chứng toàn văn trên Cổng TTĐT Chính phủ.',
    motifTitle: 'Lan tỏa cộng đồng & mã QR xác thực',
    motifSvgKey: 'community-ripple',
    domainPills: ['Hiểu đúng · Làm thật', 'Việc nhỏ hôm nay', 'QR chinhphu.vn'],
  },
};

export const POSTERS = campaignData.posters.map((poster) => {
  const ui = POSTER_UI_EXTENSIONS[poster.posterId] || {};
  return {
    ...poster,
    stage: poster.id,
    badgeLabel: poster.index.replace('/', ' / '),
    posterPath: `./assets/posters/${poster.filename}`,
    speakerCue: poster.speakerNotes,
    highlightKeyword: ui.highlightKeyword || '',
    editorialSummary: ui.editorialSummary || poster.socialPostSection || '',
    motifTitle: ui.motifTitle || poster.chapterTitle,
    motifSvgKey: ui.motifSvgKey || 'question-spark',
    domainPills: ui.domainPills || [],
  };
});

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
