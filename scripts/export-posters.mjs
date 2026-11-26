#!/usr/bin/env node
/**
 * LẠC HỒNG SỐ — V2 Poster Compositor & Export Toolchain
 *
 * Single Source of Truth: LacHongSo_Cum1_NQ57_2026/content/campaign-content.json
 * (kept aligned with deliverables/02_ThietKe/campaign.config.json).
 *
 * Embeds:
 *   - Untouched official Đoàn emblem: deliverables/02_ThietKe/identity/derived/huy-hieu-doan-clean.png
 *     at exact (64, 56) 84x93px inside protective #FFFFFF badge
 *   - Local @fontsource/be-vietnam-pro WOFF2 (400, 500, 600, 700, 800)
 *
 * Outputs (exact byte-identical PNGs 1080x1350 sRGB + editable layered SVGs):
 *   - deliverables/02_ThietKe/editable/01.svg .. 05.svg
 *   - LacHongSo_Cum1_NQ57_2026/design/editable/01.svg .. 05.svg
 *   - deliverables/02_ThietKe/01_dat_cau_hoi_1080x1350.png .. 05_lan_toa_1080x1350.png
 *   - LacHongSo_Cum1_NQ57_2026/design/01_dat_cau_hoi_1080x1350.png .. 05_lan_toa_1080x1350.png
 *   - public/assets/posters/01_dat_cau_hoi_1080x1350.png .. 05_lan_toa_1080x1350.png
 *   - deliverables/02_ThietKe/CONTACT_SHEET.png (1920x1080 sRGB)
 *   - LacHongSo_Cum1_NQ57_2026/qa/CONTACT_SHEET_v2.png (1920x1080 sRGB, byte-identical)
 *   - LacHongSo_Cum1_NQ57_2026/qa/MOBILE_READABILITY_25PCT.png (true 25% scale 270x338 strip)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CANONICAL_CONTENT_PATH = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'content', 'campaign-content.json');
const DESIGN_DIR = path.join(ROOT, 'deliverables', '02_ThietKe');
const CONFIG_MIRROR_PATH = path.join(DESIGN_DIR, 'campaign.config.json');
const EDITABLE_DIR = path.join(DESIGN_DIR, 'editable');
const PACKAGE_DESIGN_DIR = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'design');
const PACKAGE_EDITABLE_DIR = path.join(PACKAGE_DESIGN_DIR, 'editable');
const PACKAGE_QA_DIR = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'qa');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');

const STALE_V1_FILES = [
  '01_KhoiNguonNhanThuc.png',
  '02_HieuDungNoiDung.png',
  '03_HanhDongThietThuc.png',
  '04_LanToaCongDong.png',
  '05_KhatVongLacHongSo.png',
];

const CANVAS_W = 1080;
const CANVAS_H = 1350;

/**
 * Calibrated non-clipping 4:5 placements verified against pixel measurements of
 * source_illustrations/*.png so ZERO heads, faces, hands, notebooks, buildings,
 * or Chim Lạc cranes are obscured.
 */
const POSTER_SPECS = {
  1: {
    rhythm: 'editorial-left',
    footerTheme: 'navy',
    // 01_lhs_raw.png: crop(0,0,896,1178) -> 928x1220 at (76,14)
    artBox: {
      x: 76,
      y: 14,
      w: 928,
      h: 1220,
      imgYOffset: 0,
      imgH: 1243,
      featherEdges: true,
      featherH: 3.2,
      featherTop: 0,
      featherBottom: 2.5,
    },
    titleLines: ['NGHỊ QUYẾT 57 GẦN', 'BẠN THẾ NÀO?'],
    titleSize: 42,
    titleX: 64,
    titleY: 210,
    titleLineGap: 52,
    subtitleLines: ['Từ một câu hỏi nhỏ, mở ra cách nhìn mới.'],
    subtitleY: 304,
  },
  2: {
    rhythm: 'centered-radial',
    footerTheme: 'cream',
    // 02_lhs_raw.png: content spans y_src=225..1060 -> placed at (164, 292), w=752, h=730
    // so tabletop/legs end around y=1008px, opening y=1022..1228 for crisp 2x2 fact badges
    artBox: {
      x: 164,
      y: 292,
      w: 752,
      h: 730,
      imgYOffset: -174,
      imgH: 1007,
      featherEdges: true,
      featherH: 4.5,
      featherTop: 1.5,
      featherBottom: 2.8,
    },
    titleLines: ['HIỂU ĐÚNG ĐỊNH HƯỚNG'],
    titleSize: 40,
    titleX: 540,
    titleY: 204,
    titleLineGap: 48,
    subtitleLines: ['Công nghệ vì con người, đổi mới để phát triển.'],
    subtitleY: 244,
    microNoteY: 264,
    hasDataPanels: true,
  },
  3: {
    rhythm: 'policy-vision',
    footerTheme: 'navy',
    // 03_vision_2030_2045_raw.png: full-bleed crop(0, 18, 896, 1138) -> 1080x1350
    // Youth heads >= 668; upper cranes x >= 804 (y <= 600) & 779 (y=600..640);
    // lower cranes y >= 840; buildings y >= 991.
    // Smooth top wash removes raw top sun-band seam at y=222 without touching cranes (y>=265).
    artBox: {
      x: 0,
      y: 0,
      w: 1080,
      h: 1350,
      imgYOffset: -21.7,
      imgH: 1446.4,
      featherEdges: false,
      topSeamWashEnd: 256,
    },
    titleLines: ['2030 → 2045: TẦM NHÌN SỐ'],
    titleSize: 41,
    titleX: 64,
    titleY: 206,
    titleLineGap: 48,
    subtitleLines: ['Mục tiêu rõ ràng, khát vọng dài hạn.'],
    subtitleY: 246,
    microNoteY: 266,
    hasDataPanels: true,
  },
  4: {
    rhythm: 'community-badge',
    footerTheme: 'cream',
    // 03_lhs_raw.png: scale=1.0357 -> w=928 at (76, 14), h=1076 (y=14..1090)
    // Cranes sit at y=36..238, x=780..968; highest head y=427;
    // navy notebook ends cleanly at y=1056; bottom fade 1057..1090 opens dock y=1092..1234.
    artBox: {
      x: 76,
      y: 14,
      w: 928,
      h: 1076,
      imgYOffset: -20.7,
      imgH: 1242.9,
      featherEdges: true,
      featherH: 2.0,
      featherTop: 0,
      featherBottom: 3.0,
    },
    titleLines: ['THANH NIÊN CỤM 1', 'HÀNH ĐỘNG'],
    titleSize: 41,
    titleX: 64,
    titleY: 206,
    titleLineGap: 48,
    subtitleLines: ['Học kỹ năng số · Hỗ trợ cộng đồng · Sáng tạo.'],
    subtitleY: 294,
    microNoteY: 314,
    hasDataPanels: true,
  },
  5: {
    rhythm: 'climax-qr',
    footerTheme: 'navy',
    // 04_lhs_raw.png: scale=1.0223 -> w=916 at (82, 14), h=1050 (y=14..1064)
    // 4 Chim Lac cranes sit at x=634..962, y=36..258; highest head y=412;
    // navy notebook ends cleanly at y=1040; bottom fade 1037..1064 opens QR+CTA card y=1068..1234.
    artBox: {
      x: 82,
      y: 14,
      w: 916,
      h: 1050,
      imgYOffset: -20.4,
      imgH: 1226.8,
      featherEdges: true,
      featherH: 2.0,
      featherTop: 0,
      featherBottom: 2.6,
    },
    titleLines: ['HIỂU ĐÚNG. LÀM THẬT.', 'LAN TỎA.'],
    titleSize: 40,
    titleX: 64,
    titleY: 206,
    titleLineGap: 48,
    subtitleLines: ['Bắt đầu từ một việc nhỏ hôm nay.'],
    subtitleY: 298,
    qrCard: { x: 64, y: 1068, w: 952, h: 166 },
  },
};

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatMetricDisplay(metric) {
  return String(metric).replace(/>=/g, '≥').replace(/<=/g, '≤');
}

function buildEmbeddedFontCss() {
  const fontDir = path.join(ROOT, 'node_modules', '@fontsource', 'be-vietnam-pro');
  const weights = [400, 500, 600, 700, 800];
  const blocks = [];

  for (const w of weights) {
    const cssPath = path.join(fontDir, `${w}.css`);
    if (!fs.existsSync(cssPath)) {
      throw new Error(`Missing font CSS: ${cssPath}`);
    }
    let css = fs.readFileSync(cssPath, 'utf8');
    css = css.replace(
      /url\(\.\/files\/([^)]+\.woff2)\) format\('woff2'\),\s*url\([^)]+\) format\('woff'\)/g,
      (_, file) => {
        const woff2Path = path.join(fontDir, 'files', file);
        const b64 = fs.readFileSync(woff2Path).toString('base64');
        return `url(data:font/woff2;base64,${b64}) format('woff2')`;
      }
    );
    blocks.push(css);
  }
  return blocks.join('\n');
}

function buildIllustrationLayer(poster, spec, artDataUri) {
  const { palette } = poster._config;
  const clipId = `art-clip-${poster.id}`;
  const maskId = `art-mask-${poster.id}`;
  const ab = spec.artBox;
  const imgY = ab.y + (ab.imgYOffset || 0);
  const imgH = ab.imgH || Math.round((ab.w * 1200) / 896);

  const fh = ab.featherH ?? 3.5;
  const fTop = ab.featherTop ?? 0;
  const fBottom = ab.featherBottom ?? 2.5;

  const maskDef = ab.featherEdges
    ? `
      <linearGradient id="fade-h-${poster.id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000"/>
        <stop offset="${fh}%" stop-color="#FFFFFF"/>
        <stop offset="${100 - fh}%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <linearGradient id="fade-v-${poster.id}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${fTop > 0 ? '#000000' : '#FFFFFF'}"/>
        ${fTop > 0 ? `<stop offset="${fTop}%" stop-color="#FFFFFF"/>` : ''}
        <stop offset="${100 - fBottom}%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <mask id="${maskId}">
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" fill="url(#fade-h-${poster.id})"/>
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" fill="url(#fade-v-${poster.id})" style="mix-blend-mode:multiply"/>
      </mask>`
    : '';

  const topWashDef = ab.topSeamWashEnd
    ? `
      <linearGradient id="top-seam-wash-${poster.id}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${palette.warmCream}" stop-opacity="1"/>
        <stop offset="72%" stop-color="${palette.warmCream}" stop-opacity="0.96"/>
        <stop offset="100%" stop-color="${palette.warmCream}" stop-opacity="0"/>
      </linearGradient>`
    : '';

  const clipDef = `
      <clipPath id="${clipId}">
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" rx="${ab.featherEdges ? 18 : 0}"/>
      </clipPath>${maskDef}${topWashDef}`;

  const showTopRightBracket = poster.id === 1 || poster.id === 2;
  const topRightBracket = showTopRightBracket
    ? `
        <path d="M 1002 30 L 1052 30 L 1052 80" stroke-width="2"/>
        <path d="M 1016 42 L 1040 42 L 1040 66" stroke-width="1.25" opacity="0.75"/>
        <path d="M 1052 30 A 26 26 0 0 1 1026 56" stroke-width="1.2" opacity="0.55"/>`
    : '';

  const hasBottomWidePanel = poster.id === 2 || poster.id === 4 || poster.id === 5;
  const cornerStrokes = `
      <g id="dong-son-accents-${poster.id}" fill="none" stroke="${palette.warmGold}" stroke-linecap="round" stroke-linejoin="round" opacity="0.76">
        ${topRightBracket}
        ${
          hasBottomWidePanel
            ? `
        <path d="M 28 1188 L 28 1230 L 52 1230" stroke-width="1.8" opacity="0.72"/>
        <path d="M 1052 1188 L 1052 1230 L 1028 1230" stroke-width="1.8" opacity="0.72"/>`
            : `
        <path d="M 36 1180 L 36 1228 L 84 1228" stroke-width="1.8" opacity="0.72"/>
        <path d="M 48 1196 L 48 1216 L 68 1216" stroke-width="1.2" opacity="0.58"/>
        <path d="M 1044 1180 L 1044 1228 L 996 1228" stroke-width="1.8" opacity="0.72"/>
        <path d="M 1032 1196 L 1032 1216 L 1012 1216" stroke-width="1.2" opacity="0.58"/>`
        }
        <g transform="translate(562, 68) scale(0.95)">
          <path d="M 0 10 Q 10 2 20 8 Q 27 12 36 6 Q 29 14 21 14 Q 14 14 8 18 L 13 12 Q 6 12 0 10 Z" stroke-width="1.6"/>
          <path d="M 14 8 Q 18 -2 28 -4 Q 23 3 19 8" stroke-width="1.4"/>
          <path d="M 36 6 L 44 4" stroke-width="1.4"/>
        </g>
      </g>`;

  const maskAttr = ab.featherEdges ? ` mask="url(#${maskId})"` : '';
  const topWashOverlay = ab.topSeamWashEnd
    ? `<rect x="0" y="0" width="${CANVAS_W}" height="${ab.topSeamWashEnd}" fill="url(#top-seam-wash-${poster.id})"/>`
    : '';

  const groupMarkup = `
    <g id="layer-illustration">
      <g clip-path="url(#${clipId})"${maskAttr}>
        <image
          id="poster-artwork-${poster.id}"
          x="${ab.x}"
          y="${imgY}"
          width="${ab.w}"
          height="${imgH}"
          preserveAspectRatio="xMidYMid slice"
          href="${artDataUri}"
        />
      </g>
      ${topWashOverlay}
      ${cornerStrokes}
    </g>`;

  return { clipDef, groupMarkup };
}

function buildBackgroundLayer(poster, spec) {
  const { palette } = poster._config;
  let accent = '';

  if (spec.rhythm === 'editorial-left') {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="380" fill="url(#bg-wash-left-${poster.id})"/>
      <line x1="40" y1="56" x2="40" y2="320" stroke="${palette.warmGold}" stroke-width="2.5" stroke-linecap="round" opacity="0.65"/>`;
  } else if (spec.rhythm === 'centered-radial') {
    accent = `
      <circle cx="540" cy="658" r="372" fill="none" stroke="${palette.warmGold}" stroke-width="1.3" stroke-dasharray="6 10" opacity="0.45"/>`;
  } else if (spec.rhythm === 'policy-vision') {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="340" fill="url(#bg-wash-left-${poster.id})"/>
      <line x1="40" y1="56" x2="40" y2="306" stroke="${palette.youthBlue}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>`;
  } else if (spec.rhythm === 'community-badge') {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="360" fill="url(#bg-wash-left-${poster.id})"/>
      <line x1="40" y1="56" x2="40" y2="338" stroke="${palette.deepGreen}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>`;
  } else {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="340" fill="url(#bg-wash-left-${poster.id})"/>`;
  }

  return `
    <g id="layer-background">
      <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="${palette.warmCream}"/>
      ${accent}
    </g>`;
}

function buildHeaderLayer(poster, emblemDataUri) {
  const { palette, sharedCopy } = poster._config;
  const headerText = escapeXml(sharedCopy.headerLabel);
  const indexText = escapeXml(poster.index);

  return `
    <g id="layer-header">
      <!-- Protective white badge holding untouched Đoàn emblem at exact (64, 56), 84x93px -->
      <rect
        x="56"
        y="48"
        width="100"
        height="109"
        rx="18"
        fill="#FFFFFF"
        stroke="${palette.deepNavy}"
        stroke-opacity="0.14"
        stroke-width="1.5"
        filter="url(#soft-shadow)"
      />
      <image
        id="doan-emblem"
        x="64"
        y="56"
        width="84"
        height="93"
        preserveAspectRatio="xMidYMid meet"
        href="${emblemDataUri}"
      />

      <!-- NGHỊ QUYẾT 57-NQ/TW badge -->
      <g id="badge-resolution">
        <rect
          data-pill-for="header-label-text"
          data-pad-x="20"
          data-min-w="220"
          x="176"
          y="58"
          width="264"
          height="40"
          rx="20"
          fill="${palette.deepNavy}"
        />
        <circle cx="196" cy="78" r="4.5" fill="${palette.warmGold}"/>
        <text
          id="header-label-text"
          x="210"
          y="84"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="16"
          font-weight="800"
          letter-spacing="0.8"
          data-left-offset="34"
        >${headerText}</text>
      </g>

      <!-- Index pill (01/05 .. 05/05) -->
      <g id="badge-index" data-follow-pill="header-label-text" data-gap="12">
        <rect
          data-pill-for="index-label-text"
          data-pad-x="18"
          data-min-w="84"
          x="452"
          y="58"
          width="90"
          height="40"
          rx="20"
          fill="${palette.redAccent}"
        />
        <text
          id="index-label-text"
          x="497"
          y="84"
          text-anchor="middle"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="16"
          font-weight="800"
          letter-spacing="0.8"
        >${indexText}</text>
      </g>
    </g>`;
}

function buildTypographyLayer(poster, spec) {
  const { palette } = poster._config;
  const isCentered = spec.rhythm === 'centered-radial';
  const anchor = isCentered ? 'middle' : 'start';
  const storyBeat = escapeXml(poster.storyBeat);

  const storyBeatBlock = isCentered
    ? `
      <text
        id="story-beat-text"
        x="540"
        y="156"
        text-anchor="middle"
        fill="${palette.youthBlue}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="15.5"
        font-weight="800"
        letter-spacing="2.2"
      >${storyBeat}</text>`
    : `
      <rect x="176" y="114" width="24" height="4" rx="2" fill="${palette.redAccent}"/>
      <text
        id="story-beat-text"
        x="210"
        y="122"
        text-anchor="start"
        fill="${spec.rhythm === 'community-badge' ? palette.deepGreen : palette.youthBlue}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="15.5"
        font-weight="800"
        letter-spacing="1.6"
      >${storyBeat}</text>`;

  const headlineTspans = spec.titleLines
    .map(
      (line, idx) =>
        `<tspan x="${spec.titleX}" dy="${idx === 0 ? 0 : spec.titleLineGap}">${escapeXml(line)}</tspan>`
    )
    .join('');

  const subLines = spec.subtitleLines || [poster.subtitle];
  const subGap = spec.subtitleLineGap || 28;
  const subtitleTspans = subLines
    .map(
      (line, idx) =>
        `<tspan x="${spec.titleX}" dy="${idx === 0 ? 0 : subGap}">${escapeXml(line)}</tspan>`
    )
    .join('');

  let microNoteBlock = '';
  if (poster.microNote) {
    const noteText = escapeXml(poster.microNote);
    if (isCentered) {
      microNoteBlock = `
      <g id="micro-note-pill">
        <rect
          data-pill-for="micro-note-text"
          data-pad-x="20"
          data-center-x="540"
          x="265"
          y="${spec.microNoteY}"
          width="550"
          height="32"
          rx="16"
          fill="#FFFFFF"
          stroke="${palette.warmGold}"
          stroke-width="1.6"
        />
        <text
          id="micro-note-text"
          x="540"
          y="${spec.microNoteY + 21.5}"
          text-anchor="middle"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="15"
          font-weight="700"
        >${noteText}</text>
      </g>`;
    } else if (poster.id === 3) {
      microNoteBlock = `
      <g id="micro-note-pill">
        <rect
          data-pill-for="micro-note-text"
          data-pad-x="16"
          x="64"
          y="${spec.microNoteY}"
          width="660"
          height="34"
          rx="17"
          fill="${palette.deepNavy}"
          stroke="${palette.warmGold}"
          stroke-width="1.5"
        />
        <circle cx="82" cy="${spec.microNoteY + 17}" r="4.5" fill="${palette.warmGold}"/>
        <text
          id="micro-note-text"
          x="94"
          y="${spec.microNoteY + 22}"
          text-anchor="start"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="14"
          font-weight="700"
          letter-spacing="0.2"
          data-left-offset="30"
        >${noteText}</text>
      </g>`;
    } else {
      microNoteBlock = `
      <g id="micro-note-pill">
        <rect
          data-pill-for="micro-note-text"
          data-pad-x="16"
          x="64"
          y="${spec.microNoteY}"
          width="630"
          height="34"
          rx="17"
          fill="${palette.deepGreen}"
        />
        <circle cx="82" cy="${spec.microNoteY + 17}" r="4" fill="${palette.warmGold}"/>
        <text
          id="micro-note-text"
          x="94"
          y="${spec.microNoteY + 22}"
          text-anchor="start"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="14"
          font-weight="700"
          data-left-offset="30"
        >${noteText}</text>
      </g>`;
    }
  }

  return `
    <g id="layer-typography">
      ${storyBeatBlock}
      <text
        id="poster-headline"
        x="${spec.titleX}"
        y="${spec.titleY}"
        text-anchor="${anchor}"
        fill="${palette.deepNavy}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="${spec.titleSize}"
        font-weight="800"
        letter-spacing="-0.4"
      >${headlineTspans}</text>
      <text
        id="poster-subtitle"
        x="${spec.titleX}"
        y="${spec.subtitleY}"
        text-anchor="${anchor}"
        fill="${spec.rhythm === 'centered-radial' ? palette.redAccent : palette.youthBlue}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="21"
        font-weight="600"
      >${subtitleTspans}</text>
      ${microNoteBlock}
    </g>`;
}

/**
 * Splits a Vietnamese shortLabel into at most 2 clean lines inside a card width.
 */
function splitTwoLines(text, maxCharsFirstLine) {
  const words = String(text).trim().split(/\s+/);
  if (text.length <= maxCharsFirstLine) {
    return [text];
  }
  const line1 = [];
  let len = 0;
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    const nextLen = len === 0 ? w.length : len + 1 + w.length;
    if (nextLen <= maxCharsFirstLine || line1.length === 0) {
      line1.push(w);
      len = nextLen;
    } else {
      return [line1.join(' '), words.slice(i).join(' ')];
    }
  }
  return [line1.join(' ')];
}

function buildPoster02DataPanels(poster) {
  const { palette } = poster._config;
  const facts = poster.displayFacts || [];
  const accents = [palette.redAccent, palette.youthBlue, palette.warmGold, palette.deepGreen];
  const cardW = 468;
  const cardH = 96;
  const gapX = 16;
  const gapY = 14;
  const startX = 64;
  const startY = 1022;

  const cards = facts
    .slice(0, 4)
    .map((fact, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const accent = accents[idx % accents.length];
      const titleColor = accent === palette.warmGold ? palette.deepNavy : accent;
      const lines = splitTwoLines(fact.shortLabel, 43);

      const lineTspans =
        lines.length === 1
          ? `<tspan x="${x + 20}" dy="0">${escapeXml(lines[0])}</tspan>`
          : `<tspan x="${x + 20}" dy="0">${escapeXml(lines[0])}</tspan><tspan x="${x + 20}" dy="21">${escapeXml(lines[1])}</tspan>`;

      return `
      <g id="fact-badge-${idx + 1}">
        <rect
          x="${x}"
          y="${y}"
          width="${cardW}"
          height="${cardH}"
          rx="14"
          fill="#FFFFFF"
          fill-opacity="0.97"
          stroke="${palette.deepNavy}"
          stroke-opacity="0.14"
          stroke-width="1.5"
          filter="url(#soft-shadow)"
        />
        <rect x="${x}" y="${y + 12}" width="6" height="${cardH - 24}" rx="3" fill="${accent}"/>
        <circle cx="${x + 27}" cy="${y + 24}" r="10" fill="${accent}"/>
        <text
          x="${x + 27}"
          y="${y + 29}"
          text-anchor="middle"
          fill="${accent === palette.warmGold ? palette.deepNavy : '#FFFFFF'}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="13"
          font-weight="800"
        >${idx + 1}</text>
        <text
          x="${x + 44}"
          y="${y + 29}"
          fill="${titleColor}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="16"
          font-weight="800"
          letter-spacing="0.4"
        >${escapeXml(fact.badgeTitle)}</text>
        <text
          x="${x + cardW - 16}"
          y="${y + 28}"
          text-anchor="end"
          fill="${palette.deepNavy}"
          fill-opacity="0.58"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="12"
          font-weight="700"
        >${escapeXml(fact.sourceSection)}</text>
        <text
          x="${x + 20}"
          y="${y + 56}"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="15.5"
          font-weight="600"
        >${lineTspans}</text>
      </g>`;
    })
    .join('');

  return `
    <g id="layer-data-panels">
      ${cards}
    </g>`;
}

function buildPoster03DataPanels(poster) {
  const { palette } = poster._config;
  const targets = poster.targets2030 || [];
  const visions = poster.vision2045 || [];

  // Verified blank ivory sky zone ABOVE youths' heads (y >= 668) & CLEAR of cranes (x >= 804) & buildings (y >= 991)
  const panelA = { x: 64, y: 310, w: 730, h: 194 };
  const panelB = { x: 64, y: 514, w: 706, h: 146 };

  const colors2030 = [palette.redAccent, palette.youthBlue, palette.deepNavy, palette.deepGreen];
  const cellW = 345;
  const cellH = 66;
  const cells2030 = targets
    .slice(0, 4)
    .map((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cx = panelA.x + 14 + col * (cellW + 12);
      const cy = panelA.y + 44 + row * (cellH + 8);
      const accent = colors2030[idx % colors2030.length];
      const metricText = formatMetricDisplay(item.metric);
      const metricSize = metricText.length > 18 ? 17.5 : 24;
      const labelLines = splitTwoLines(item.label, 40);
      const labelTspans =
        labelLines.length === 1
          ? `<tspan x="${cx + 13}" dy="0">${escapeXml(labelLines[0])}</tspan>`
          : `<tspan x="${cx + 13}" dy="0">${escapeXml(labelLines[0])}</tspan><tspan x="${cx + 13}" dy="15.5">${escapeXml(labelLines[1])}</tspan>`;

      return `
      <g id="kpi-2030-${idx + 1}">
        <rect
          x="${cx}"
          y="${cy}"
          width="${cellW}"
          height="${cellH}"
          rx="10"
          fill="${palette.warmCream}"
          stroke="${palette.deepNavy}"
          stroke-opacity="0.12"
          stroke-width="1"
        />
        <rect x="${cx}" y="${cy + 8}" width="5" height="${cellH - 16}" rx="2.5" fill="${accent}"/>
        <text
          x="${cx + 13}"
          y="${cy + 26}"
          fill="${accent}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="${metricSize}"
          font-weight="800"
          letter-spacing="-0.2"
        >${escapeXml(metricText)}</text>
        <text
          x="${cx + 13}"
          y="${cy + 44}"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="13.2"
          font-weight="600"
        >${labelTspans}</text>
      </g>`;
    })
    .join('');

  const colors2045 = [palette.redAccent, palette.youthBlue, palette.deepNavy];
  const colWidths = [194, 214, 250];
  let curX = panelB.x + 14;
  const cells2045 = visions
    .slice(0, 3)
    .map((item, idx) => {
      const cw = colWidths[idx] || 220;
      const cx = curX;
      curX += cw + 10;
      const cy = panelB.y + 42;
      const ch = 92;
      const accent = colors2045[idx % colors2045.length];

      const rawMetric = formatMetricDisplay(item.metric);
      const metricDisplay =
        item.visionId === 'NQ57-03-V3' ? 'VIỆT NAM PHÁT TRIỂN, THU NHẬP CAO' : rawMetric;
      const labelDisplay =
        item.visionId === 'NQ57-03-V3' ? 'Khát vọng đến năm 2045' : item.label;

      const metricLines =
        metricDisplay.length > 20 ? ['VIỆT NAM PHÁT TRIỂN,', 'THU NHẬP CAO'] : [metricDisplay];
      const metricSize = metricLines.length > 1 ? 15.5 : metricDisplay.length > 12 ? 19.5 : 26;
      const metricTspans =
        metricLines.length === 1
          ? `<tspan x="${cx + 12}" dy="0">${escapeXml(metricLines[0])}</tspan>`
          : `<tspan x="${cx + 12}" dy="0">${escapeXml(metricLines[0])}</tspan><tspan x="${cx + 12}" dy="19">${escapeXml(metricLines[1])}</tspan>`;

      const labelLines = splitTwoLines(labelDisplay, 24);
      const labelStartY = metricLines.length > 1 ? cy + 71 : cy + 56;
      const labelTspans =
        labelLines.length === 1
          ? `<tspan x="${cx + 12}" dy="0">${escapeXml(labelLines[0])}</tspan>`
          : `<tspan x="${cx + 12}" dy="0">${escapeXml(labelLines[0])}</tspan><tspan x="${cx + 12}" dy="17">${escapeXml(labelLines[1])}</tspan>`;

      return `
      <g id="kpi-2045-${idx + 1}">
        <rect
          x="${cx}"
          y="${cy}"
          width="${cw}"
          height="${ch}"
          rx="10"
          fill="${palette.warmCream}"
          stroke="${palette.youthBlue}"
          stroke-opacity="0.18"
          stroke-width="1"
        />
        <rect x="${cx + 12}" y="${cy + 6}" width="32" height="4" rx="2" fill="${accent}"/>
        <text
          x="${cx + 12}"
          y="${metricLines.length > 1 ? cy + 27 : cy + 34}"
          fill="${accent}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="${metricSize}"
          font-weight="800"
          letter-spacing="-0.2"
        >${metricTspans}</text>
        <text
          x="${cx + 12}"
          y="${labelStartY}"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="13.6"
          font-weight="600"
        >${labelTspans}</text>
      </g>`;
    })
    .join('');

  return `
    <g id="layer-data-panels">
      <!-- Panel A: MỤC TIÊU ĐẾN NĂM 2030 -->
      <g id="panel-targets-2030">
        <rect
          x="${panelA.x}"
          y="${panelA.y}"
          width="${panelA.w}"
          height="${panelA.h}"
          rx="14"
          fill="#FFFFFF"
          fill-opacity="0.96"
          stroke="${palette.deepNavy}"
          stroke-opacity="0.18"
          stroke-width="1.5"
          filter="url(#soft-shadow)"
        />
        <path
          d="M ${panelA.x + 14} ${panelA.y} H ${panelA.x + panelA.w - 14} Q ${panelA.x + panelA.w} ${panelA.y} ${panelA.x + panelA.w} ${panelA.y + 14} V ${panelA.y + 36} H ${panelA.x} V ${panelA.y + 14} Q ${panelA.x} ${panelA.y} ${panelA.x + 14} ${panelA.y} Z"
          fill="${palette.deepNavy}"
        />
        <rect x="${panelA.x + 16}" y="${panelA.y + 11}" width="8" height="14" rx="2" fill="${palette.warmGold}"/>
        <text
          x="${panelA.x + 32}"
          y="${panelA.y + 24}"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="17"
          font-weight="800"
          letter-spacing="0.6"
        >MỤC TIÊU ĐẾN NĂM 2030</text>
        <text
          x="${panelA.x + panelA.w - 16}"
          y="${panelA.y + 23}"
          text-anchor="end"
          fill="${palette.warmGold}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="13"
          font-weight="700"
        >Mục II.1 · NQ 57-NQ/TW</text>
        ${cells2030}
      </g>

      <!-- Panel B: TẦM NHÌN ĐẾN NĂM 2045 -->
      <g id="panel-vision-2045">
        <rect
          x="${panelB.x}"
          y="${panelB.y}"
          width="${panelB.w}"
          height="${panelB.h}"
          rx="14"
          fill="#FFFFFF"
          fill-opacity="0.96"
          stroke="${palette.youthBlue}"
          stroke-opacity="0.24"
          stroke-width="1.5"
          filter="url(#soft-shadow)"
        />
        <path
          d="M ${panelB.x + 14} ${panelB.y} H ${panelB.x + panelB.w - 14} Q ${panelB.x + panelB.w} ${panelB.y} ${panelB.x + panelB.w} ${panelB.y + 14} V ${panelB.y + 34} H ${panelB.x} V ${panelB.y + 14} Q ${panelB.x} ${panelB.y} ${panelB.x + 14} ${panelB.y} Z"
          fill="${palette.youthBlue}"
        />
        <rect x="${panelB.x + 16}" y="${panelB.y + 10}" width="8" height="14" rx="2" fill="${palette.warmGold}"/>
        <text
          x="${panelB.x + 32}"
          y="${panelB.y + 23}"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="17"
          font-weight="800"
          letter-spacing="0.6"
        >TẦM NHÌN ĐẾN NĂM 2045</text>
        <text
          x="${panelB.x + panelB.w - 16}"
          y="${panelB.y + 22}"
          text-anchor="end"
          fill="${palette.warmGold}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="13"
          font-weight="700"
        >Mục II.2 · Khát vọng phát triển</text>
        ${cells2045}
      </g>
    </g>`;
}

function buildPoster04DataPanels(poster) {
  const { palette } = poster._config;
  const actions = poster.displayFacts || [];
  const dock = { x: 64, y: 1094, w: 952, h: 138 };

  // Row 1: 3 pills; Row 2: 2 centered pills + clear disclaimer subnote
  const row1Specs = [
    { x: 80, y: 1126, w: 240, h: 42, color: palette.youthBlue },
    { x: 332, y: 1126, w: 252, h: 42, color: palette.deepGreen },
    { x: 596, y: 1126, w: 404, h: 42, color: palette.deepNavy },
  ];
  const row2Specs = [
    { x: 184, y: 1178, w: 332, h: 42, color: palette.redAccent },
    { x: 534, y: 1178, w: 344, h: 42, color: palette.deepNavy },
  ];
  const pillSpecs = [...row1Specs, ...row2Specs];

  const pillNodes = actions
    .slice(0, 5)
    .map((act, idx) => {
      const p = pillSpecs[idx];
      const textCenterX = Math.round(p.x + 34 + (p.w - 46) / 2);
      return `
      <g id="action-pill-${idx + 1}">
        <rect
          x="${p.x}"
          y="${p.y}"
          width="${p.w}"
          height="${p.h}"
          rx="21"
          fill="${p.color}"
        />
        <circle cx="${p.x + 22}" cy="${p.y + 21}" r="10" fill="${palette.warmGold}"/>
        <text
          x="${p.x + 22}"
          y="${p.y + 25.5}"
          text-anchor="middle"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="12.5"
          font-weight="800"
        >${idx + 1}</text>
        <text
          x="${textCenterX}"
          y="${p.y + 26.5}"
          text-anchor="middle"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="15.5"
          font-weight="800"
          letter-spacing="0.2"
        >${escapeXml(act.badgeTitle)}</text>
      </g>`;
    })
    .join('');

  return `
    <g id="layer-data-panels">
      <rect
        x="${dock.x}"
        y="${dock.y}"
        width="${dock.w}"
        height="${dock.h}"
        rx="18"
        fill="#FFFFFF"
        fill-opacity="0.97"
        stroke="${palette.deepGreen}"
        stroke-opacity="0.24"
        stroke-width="1.5"
        filter="url(#soft-shadow)"
      />
      <rect x="${dock.x + 18}" y="${dock.y}" width="96" height="4" rx="2" fill="${palette.deepGreen}"/>
      <text
        x="${dock.x + 20}"
        y="${dock.y + 23}"
        fill="${palette.deepGreen}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="13.5"
        font-weight="800"
        letter-spacing="0.5"
      >5 NHÓM PHẦN VIỆC ĐỀ XUẤT CHO THANH NIÊN CỤM 1</text>
      <text
        x="${dock.x + dock.w - 20}"
        y="${dock.y + 23}"
        text-anchor="end"
        fill="${palette.deepNavy}"
        fill-opacity="0.78"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="13"
        font-weight="600"
      >Đề xuất triển khai · Không phải thống kê đã thực hiện</text>
      ${pillNodes}
    </g>`;
}

function buildDataPanelsLayer(poster, spec) {
  if (!spec.hasDataPanels) return '';
  if (poster.id === 2) return buildPoster02DataPanels(poster);
  if (poster.id === 3) return buildPoster03DataPanels(poster);
  if (poster.id === 4) return buildPoster04DataPanels(poster);
  return '';
}

function buildQrCtaLayer(poster, spec, qrInfo) {
  if (!poster.hasQr || !qrInfo) {
    return '';
  }
  const { palette } = poster._config;
  const card = spec.qrCard;
  // Integer scale QR modules (2px per module -> 73 * 2 = 146px crisp integer pixels inside 166px card height)
  const modulePx = 2;
  const qrSize = qrInfo.vbSize * modulePx;
  const qrPad = Math.round((card.h - qrSize) / 2);
  const qrX = card.x + qrPad + 6;
  const qrY = card.y + qrPad;
  const textX = qrX + qrSize + 28;
  const ctaText = escapeXml(poster.cta);
  const ctaSecText = escapeXml(poster.ctaSecondary || 'CHỌN MỘT HÀNH ĐỘNG SỐ HỮU ÍCH');

  const innerQr = qrInfo.svg
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  return `
    <g id="layer-cta-qr">
      <rect
        x="${card.x}"
        y="${card.y}"
        width="${card.w}"
        height="${card.h}"
        rx="18"
        fill="#FFFFFF"
        stroke="${palette.deepNavy}"
        stroke-opacity="0.20"
        stroke-width="2"
        filter="url(#soft-shadow)"
      />
      <rect x="${card.x + 18}" y="${card.y}" width="110" height="4" rx="2" fill="${palette.warmGold}"/>
      <!-- Pure white quiet zone pad + integer-scaled ECC=H QR SVG -->
      <rect x="${qrX - 6}" y="${qrY - 6}" width="${qrSize + 12}" height="${qrSize + 12}" rx="6" fill="#FFFFFF"/>
      <svg
        id="official-qr-svg"
        x="${qrX}"
        y="${qrY}"
        width="${qrSize}"
        height="${qrSize}"
        viewBox="0 0 ${qrInfo.vbSize} ${qrInfo.vbSize}"
        shape-rendering="crispEdges"
      >${innerQr}</svg>

      <!-- Primary CTA badge & headline -->
      <rect x="${textX}" y="${card.y + 18}" width="276" height="36" rx="18" fill="${palette.redAccent}"/>
      <circle cx="${textX + 20}" cy="${card.y + 36}" r="4.5" fill="${palette.warmGold}"/>
      <text
        id="qr-cta-label"
        x="${textX + 34}"
        y="${card.y + 42}"
        fill="#FFFFFF"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="18"
        font-weight="800"
        letter-spacing="0.4"
      >${ctaText}</text>

      <!-- Secondary action pill -->
      <rect
        x="${textX + 290}"
        y="${card.y + 18}"
        width="438"
        height="36"
        rx="18"
        fill="${palette.deepNavy}"
      />
      <text
        id="qr-cta-secondary-label"
        x="${textX + 509}"
        y="${card.y + 41.5}"
        text-anchor="middle"
        fill="${palette.warmGold}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="16"
        font-weight="800"
        letter-spacing="0.3"
      >${ctaSecText}</text>

      <text
        x="${textX}"
        y="${card.y + 85}"
        fill="${palette.deepNavy}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="22"
        font-weight="800"
      >Quét mã QR đọc toàn văn Nghị quyết 57-NQ/TW</text>

      <text
        x="${textX}"
        y="${card.y + 115}"
        fill="${palette.youthBlue}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="17.5"
        font-weight="700"
      >xaydungchinhsach.chinhphu.vn · Ảnh minh họa truyền thông</text>

      <text
        x="${textX}"
        y="${card.y + 143}"
        fill="${palette.deepNavy}"
        fill-opacity="0.80"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="15.5"
        font-weight="600"
      >Bộ Chính trị ban hành 22/12/2024 · Đối chiếu bản tại mst.gov.vn</text>
    </g>`;
}

function buildFooterLayer(poster, spec) {
  const { palette, sharedCopy } = poster._config;
  const eventText = escapeXml(sharedCopy.footerEvent);
  const sourceText = escapeXml(sharedCopy.sourceLine);
  const isCentered = spec.rhythm === 'centered-radial';
  const textX = isCentered ? 540 : 64;
  const anchor = isCentered ? 'middle' : 'start';

  if (spec.footerTheme === 'navy') {
    return `
    <g id="layer-footer">
      <rect x="0" y="1246" width="${CANVAS_W}" height="104" fill="${palette.deepNavy}"/>
      <rect x="0" y="1246" width="${CANVAS_W}" height="3" fill="${palette.warmGold}"/>
      <text
        id="footer-event-text"
        x="${textX}"
        y="1287"
        text-anchor="${anchor}"
        fill="#FFFFFF"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="21"
        font-weight="700"
      >${eventText}</text>
      <text
        id="footer-source-text"
        x="${textX}"
        y="1319"
        text-anchor="${anchor}"
        fill="${palette.warmCream}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="18.5"
        font-weight="500"
      >${sourceText}</text>
      <g transform="translate(966, 1278)" fill="none" stroke="${palette.warmGold}" stroke-width="1.6" stroke-linecap="round" opacity="0.82">
        <circle cx="24" cy="20" r="14" stroke-dasharray="4 3"/>
        <path d="M 10 22 Q 20 14 28 20 Q 34 24 44 17"/>
        <path d="M 22 18 Q 26 8 36 6"/>
      </g>
    </g>`;
  }

  return `
    <g id="layer-footer">
      <rect x="0" y="1224" width="${CANVAS_W}" height="126" fill="url(#cream-footer-fade)"/>
      <line x1="64" y1="1246" x2="1016" y2="1246" stroke="${palette.youthBlue}" stroke-opacity="0.35" stroke-width="1.5"/>
      <line x1="64" y1="1246" x2="180" y2="1246" stroke="${palette.warmGold}" stroke-width="3"/>
      <text
        id="footer-event-text"
        x="${textX}"
        y="1287"
        text-anchor="${anchor}"
        fill="${palette.deepNavy}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="21"
        font-weight="700"
      >${eventText}</text>
      <text
        id="footer-source-text"
        x="${textX}"
        y="1319"
        text-anchor="${anchor}"
        fill="${palette.deepNavy}"
        fill-opacity="0.90"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="18.5"
        font-weight="600"
      >${sourceText}</text>
    </g>`;
}

function buildPosterSvg(poster, spec, fontCss, emblemDataUri, artDataUri, qrInfo) {
  const { palette } = poster._config;
  const { clipDef, groupMarkup: illustrationMarkup } = buildIllustrationLayer(poster, spec, artDataUri);
  const bgMarkup = buildBackgroundLayer(poster, spec);
  const headerMarkup = buildHeaderLayer(poster, emblemDataUri);
  const typoMarkup = buildTypographyLayer(poster, spec);
  const dataPanelsMarkup = buildDataPanelsLayer(poster, spec);
  const qrMarkup = buildQrCtaLayer(poster, spec, qrInfo);
  const footerMarkup = buildFooterLayer(poster, spec);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  id="lac-hong-so-poster-${poster.id}"
  viewBox="0 0 ${CANVAS_W} ${CANVAS_H}"
  width="${CANVAS_W}"
  height="${CANVAS_H}"
>
  <defs>
    <style><![CDATA[
${fontCss}
    ]]></style>
    <filter id="soft-shadow" x="-15%" y="-15%" width="130%" height="135%">
      <feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="${palette.deepNavy}" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="bg-wash-left-${poster.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${palette.warmCream}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${palette.warmCream}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="cream-footer-fade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.warmCream}" stop-opacity="0"/>
      <stop offset="22%" stop-color="${palette.warmCream}" stop-opacity="0.97"/>
      <stop offset="100%" stop-color="${palette.warmCream}" stop-opacity="0.99"/>
    </linearGradient>
    ${clipDef}
  </defs>
  ${bgMarkup}
  ${illustrationMarkup}
  ${headerMarkup}
  ${typoMarkup}
  ${dataPanelsMarkup}
  ${qrMarkup}
  ${footerMarkup}
</svg>`;
}

async function renderPosterAndSave(page, poster, rawSvg) {
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: ${CANVAS_W}px; height: ${CANVAS_H}px; overflow: hidden; background: #F7F3E8; }
  svg { display: block; width: ${CANVAS_W}px; height: ${CANVAS_H}px; }
</style>
</head>
<body>${rawSvg}</body>
</html>`;

  await page.setViewportSize({ width: CANVAS_W, height: CANVAS_H });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;

    // Fit every pill <rect data-pill-for="..."> using exact rendered text metrics
    const svg = document.querySelector('svg');
    const pills = svg.querySelectorAll('rect[data-pill-for]');
    for (const rect of pills) {
      const targetId = rect.getAttribute('data-pill-for');
      const txt = svg.getElementById(targetId);
      if (!txt) continue;
      const textLen = txt.getComputedTextLength();
      const padX = Number(rect.getAttribute('data-pad-x') || 18);
      const minW = Number(rect.getAttribute('data-min-w') || 0);
      const leftOffset = Number(txt.getAttribute('data-left-offset') || padX);
      const newW = Math.max(minW, Math.ceil(leftOffset + textLen + padX));
      rect.setAttribute('width', String(newW));

      const centerX = rect.getAttribute('data-center-x');
      if (centerX !== null) {
        rect.setAttribute('x', String(Math.round(Number(centerX) - newW / 2)));
      }
      if (txt.getAttribute('text-anchor') === 'middle' && centerX === null) {
        const rx = Number(rect.getAttribute('x'));
        txt.setAttribute('x', String(Math.round(rx + newW / 2)));
      }

      rect.removeAttribute('data-pill-for');
      rect.removeAttribute('data-pad-x');
      rect.removeAttribute('data-min-w');
      rect.removeAttribute('data-center-x');
      txt.removeAttribute('data-left-offset');
    }

    // Re-position any follow-pill groups horizontally
    const followers = svg.querySelectorAll('g[data-follow-pill]');
    for (const grp of followers) {
      const refId = grp.getAttribute('data-follow-pill');
      const gap = Number(grp.getAttribute('data-gap') || 12);
      const refTxt = svg.getElementById(refId);
      const refRect = refTxt?.closest('g')?.querySelector('rect');
      if (refRect) {
        const refRight = Number(refRect.getAttribute('x')) + Number(refRect.getAttribute('width'));
        const ownRect = grp.querySelector('rect');
        const ownTxt = grp.querySelector('text');
        if (ownRect && ownTxt) {
          const oldX = Number(ownRect.getAttribute('x'));
          const newX = refRight + gap;
          const dx = newX - oldX;
          ownRect.setAttribute('x', String(newX));
          ownTxt.setAttribute('x', String(Number(ownTxt.getAttribute('x')) + dx));
        }
      }
      grp.removeAttribute('data-follow-pill');
      grp.removeAttribute('data-gap');
    }
  });

  const finalSvg = await page.evaluate(() => {
    const svg = document.querySelector('svg');
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + svg.outerHTML;
  });

  const svgPath = path.join(DESIGN_DIR, poster.editableSvg);
  const pkgSvgPath = path.join(PACKAGE_DESIGN_DIR, poster.editableSvg);
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.mkdirSync(path.dirname(pkgSvgPath), { recursive: true });
  fs.writeFileSync(svgPath, finalSvg, 'utf8');
  fs.writeFileSync(pkgSvgPath, finalSvg, 'utf8');

  const pngBuf = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H },
  });

  const designPngPath = path.join(DESIGN_DIR, poster.filename);
  const pkgDesignPngPath = path.join(PACKAGE_DESIGN_DIR, poster.filename);
  const publicPngPath = path.join(PUBLIC_POSTERS_DIR, poster.filename);
  fs.mkdirSync(path.dirname(designPngPath), { recursive: true });
  fs.mkdirSync(path.dirname(pkgDesignPngPath), { recursive: true });
  fs.mkdirSync(path.dirname(publicPngPath), { recursive: true });
  fs.writeFileSync(designPngPath, pngBuf);
  fs.writeFileSync(pkgDesignPngPath, pngBuf);
  fs.writeFileSync(publicPngPath, pngBuf);

  return { designPngPath, pkgDesignPngPath, publicPngPath, svgPath, pkgSvgPath, bytes: pngBuf.length };
}

async function generateContactSheet(page, config, fontCss, emblemDataUri) {
  const thumbItems = config.posters.map((p) => {
    const pngPath = path.join(DESIGN_DIR, p.filename);
    const b64 = fs.readFileSync(pngPath).toString('base64');
    return {
      ...p,
      dataUri: `data:image/png;base64,${b64}`,
    };
  });

  const cardsHtml = thumbItems
    .map(
      (p) => `
      <div class="card">
        <div class="thumb-wrap">
          <img src="${p.dataUri}" alt="${escapeXml(p.filename)}" />
        </div>
        <div class="meta">
          <div class="meta-top">
            <span class="idx">${escapeXml(p.index)}</span>
            <span class="beat">${escapeXml(p.storyBeat)}</span>
          </div>
          <div class="title">${escapeXml(p.title)}</div>
          <div class="fname">${escapeXml(p.filename)}</div>
        </div>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
  ${fontCss}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background: #F7F3E8;
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #0D2B52;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 44px 56px 38px;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid rgba(13, 43, 82, 0.14);
    padding-bottom: 20px;
  }
  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .emblem-box {
    background: #FFFFFF;
    border: 1.5px solid rgba(13, 43, 82, 0.14);
    border-radius: 14px;
    padding: 8px;
    box-shadow: 0 4px 12px rgba(13, 43, 82, 0.08);
  }
  .emblem-box img {
    display: block;
    width: 64px;
    height: 71px;
    object-fit: contain;
  }
  .eyebrow {
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 1.8px;
    color: #1464B4;
    margin-bottom: 4px;
  }
  h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.3px;
    color: #0D2B52;
  }
  .header-right {
    text-align: right;
  }
  .pill {
    display: inline-block;
    background: #0D2B52;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.8px;
    padding: 8px 18px;
    border-radius: 999px;
    border: 2px solid #F0C14B;
    margin-bottom: 6px;
  }
  .sub-meta {
    font-size: 15px;
    font-weight: 600;
    color: #0D2B52;
    opacity: 0.85;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
    align-items: start;
    margin: 22px 0;
  }
  .card {
    background: #FFFFFF;
    border-radius: 16px;
    padding: 14px;
    border: 1.5px solid rgba(13, 43, 82, 0.12);
    box-shadow: 0 8px 22px rgba(13, 43, 82, 0.08);
  }
  .thumb-wrap {
    width: 100%;
    aspect-ratio: 4 / 5;
    border-radius: 10px;
    overflow: hidden;
    background: #F7F3E8;
    border: 1px solid rgba(13, 43, 82, 0.08);
  }
  .thumb-wrap img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .meta {
    padding-top: 12px;
  }
  .meta-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .idx {
    background: #D62828;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 800;
    padding: 3px 9px;
    border-radius: 999px;
  }
  .beat {
    font-size: 11.5px;
    font-weight: 800;
    color: #1464B4;
    letter-spacing: 0.6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title {
    font-size: 15px;
    font-weight: 800;
    color: #0D2B52;
    line-height: 1.3;
    min-height: 40px;
  }
  .fname {
    font-size: 12px;
    font-weight: 600;
    color: #0D2B52;
    opacity: 0.65;
    margin-top: 4px;
  }
  .footer {
    background: #0D2B52;
    color: #FFFFFF;
    border-top: 3px solid #F0C14B;
    border-radius: 12px;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
    font-weight: 600;
  }
  .footer .src {
    color: #F7F3E8;
    font-weight: 500;
  }
</style>
</head>
<body>
  <header class="header">
    <div class="header-left">
      <div class="emblem-box"><img src="${emblemDataUri}" alt="Huy hiệu Đoàn"/></div>
      <div>
        <div class="eyebrow">CONTACT SHEET V2 · BỘ 05 ẤN PHẨM 1080 × 1350 PX (4:5 sRGB)</div>
        <h1>${escapeXml(config.seriesTitle)}</h1>
      </div>
    </div>
    <div class="header-right">
      <div class="pill">${escapeXml(config.sharedCopy.headerLabel)}</div>
      <div class="sub-meta">${escapeXml(config.centralMessage)}</div>
    </div>
  </header>
  <main class="grid">${cardsHtml}</main>
  <footer class="footer">
    <span>${escapeXml(config.sharedCopy.footerEvent)}</span>
    <span class="src">${escapeXml(config.sharedCopy.sourceLine)}</span>
  </footer>
</body>
</html>`;

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  const outPath = path.join(DESIGN_DIR, 'CONTACT_SHEET.png');
  const buf = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
  fs.writeFileSync(outPath, buf);

  fs.mkdirSync(PACKAGE_QA_DIR, { recursive: true });
  const v2SheetPath = path.join(PACKAGE_QA_DIR, 'CONTACT_SHEET_v2.png');
  fs.writeFileSync(v2SheetPath, buf);
  return { outPath, v2SheetPath, bytes: buf.length };
}

async function generateMobileReadabilityStrip(page, config, fontCss) {
  // True 25% scale: 1080 * 0.25 = 270px wide, 1350 * 0.25 = 338px tall
  const W = 1520;
  const H = 500;
  const items = config.posters.map((p) => {
    const pngPath = path.join(DESIGN_DIR, p.filename);
    const b64 = fs.readFileSync(pngPath).toString('base64');
    return {
      ...p,
      dataUri: `data:image/png;base64,${b64}`,
    };
  });

  const strips = items
    .map(
      (p) => `
      <div class="item">
        <div class="poster-25"><img src="${p.dataUri}" alt="${escapeXml(p.filename)}" /></div>
        <div class="cap"><span class="idx">${escapeXml(p.index)}</span> ${escapeXml(p.chapterTitle)}</div>
      </div>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8" />
<style>
  ${fontCss}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: ${W}px;
    height: ${H}px;
    overflow: hidden;
    background: #0D2B52;
    font-family: 'Be Vietnam Pro', sans-serif;
    color: #F7F3E8;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26px 40px 24px;
  }
  .top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    border-bottom: 2px solid rgba(240, 193, 75, 0.45);
    padding-bottom: 12px;
  }
  .top h1 {
    font-size: 20px;
    font-weight: 800;
    color: #F0C14B;
    letter-spacing: 0.4px;
  }
  .top span {
    font-size: 14px;
    font-weight: 600;
    color: #F7F3E8;
  }
  .row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 22px;
  }
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  .poster-25 {
    width: 270px;
    height: 338px;
    background: #F7F3E8;
    border-radius: 6px;
    overflow: hidden;
    border: 1.5px solid rgba(240, 193, 75, 0.5);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.32);
  }
  .poster-25 img {
    display: block;
    width: 270px;
    height: 338px;
    object-fit: fill;
  }
  .cap {
    font-size: 13.5px;
    font-weight: 700;
    color: #F7F3E8;
  }
  .idx {
    background: #D62828;
    color: #FFFFFF;
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 11.5px;
    margin-right: 4px;
  }
</style>
</head>
<body>
  <div class="top">
    <h1>KIỂM ĐỊNH ĐỌC TRÊN DI ĐỘNG — TỶ LỆ THẬT 25% (270 × 338 PX / ẤN PHẨM)</h1>
    <span>${escapeXml(config.seriesTitle)}</span>
  </div>
  <div class="row">${strips}</div>
</body>
</html>`;

  await page.setViewportSize({ width: W, height: H });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  fs.mkdirSync(PACKAGE_QA_DIR, { recursive: true });
  const outPath = path.join(PACKAGE_QA_DIR, 'MOBILE_READABILITY_25PCT.png');
  const buf = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: W, height: H },
  });
  fs.writeFileSync(outPath, buf);
  return { outPath, bytes: buf.length, width: W, height: H };
}

function cleanupStaleV1Pngs() {
  const removed = [];
  for (const dir of [DESIGN_DIR, PUBLIC_POSTERS_DIR]) {
    for (const fname of STALE_V1_FILES) {
      const fpath = path.join(dir, fname);
      if (fs.existsSync(fpath)) {
        fs.unlinkSync(fpath);
        removed.push(path.relative(ROOT, fpath));
      }
    }
  }
  return removed;
}

async function main() {
  if (!fs.existsSync(CANONICAL_CONTENT_PATH)) {
    throw new Error(`Missing canonical campaign-content.json: ${CANONICAL_CONTENT_PATH}`);
  }
  const config = JSON.parse(fs.readFileSync(CANONICAL_CONTENT_PATH, 'utf8'));

  // Sanity check alignment with campaign.config.json
  if (fs.existsSync(CONFIG_MIRROR_PATH)) {
    const mirrorCfg = JSON.parse(fs.readFileSync(CONFIG_MIRROR_PATH, 'utf8'));
    if (mirrorCfg.officialResolutionUrl !== config.officialResolutionUrl) {
      throw new Error('officialResolutionUrl mismatch between campaign-content.json and campaign.config.json');
    }
  }

  const emblemPath = path.join(ROOT, config.emblem.derivedClean);
  if (!fs.existsSync(emblemPath)) {
    throw new Error(`Missing clean Đoàn emblem: ${emblemPath}`);
  }

  const emblemDataUri = `data:image/png;base64,${fs.readFileSync(emblemPath).toString('base64')}`;
  const fontCss = buildEmbeddedFontCss();

  const qrSvg = await QRCode.toString(config.officialResolutionUrl, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: config.palette.deepNavy, light: '#FFFFFF' },
  });
  const vbMatch = qrSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!vbMatch) {
    throw new Error('Could not parse generated QR SVG viewBox');
  }
  const qrInfo = { svg: qrSvg, vbSize: Number(vbMatch[1]) };

  const requestedIds = process.argv
    .slice(2)
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= 5);

  const availablePosters = [];
  const missingPosters = [];
  for (const poster of config.posters) {
    if (requestedIds.length > 0 && !requestedIds.includes(poster.id)) {
      continue;
    }
    const artPath = path.join(DESIGN_DIR, poster.sourceIllustration);
    if (fs.existsSync(artPath)) {
      availablePosters.push({ ...poster, _config: config, artPath });
    } else {
      missingPosters.push(poster);
    }
  }

  if (availablePosters.length === 0) {
    console.log('No source illustrations found to export.');
    process.exit(0);
  }

  fs.mkdirSync(EDITABLE_DIR, { recursive: true });
  fs.mkdirSync(PACKAGE_EDITABLE_DIR, { recursive: true });
  fs.mkdirSync(PACKAGE_DESIGN_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_POSTERS_DIR, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({
      viewport: { width: CANVAS_W, height: CANVAS_H },
      deviceScaleFactor: 1,
    });

    for (const poster of availablePosters) {
      const spec = POSTER_SPECS[poster.id];
      const artDataUri = `data:image/png;base64,${fs.readFileSync(poster.artPath).toString('base64')}`;
      const rawSvg = buildPosterSvg(
        poster,
        spec,
        fontCss,
        emblemDataUri,
        artDataUri,
        poster.hasQr ? qrInfo : null
      );
      const res = await renderPosterAndSave(page, poster, rawSvg);
      console.log(
        `[export] ${poster.index} -> ${poster.filename} (${res.bytes.toLocaleString()} B) + ${poster.editableSvg}`
      );
    }

    const allFivePresent = config.posters.every(
      (p) =>
        fs.existsSync(path.join(DESIGN_DIR, p.filename)) &&
        fs.existsSync(path.join(PACKAGE_DESIGN_DIR, p.filename)) &&
        fs.existsSync(path.join(PUBLIC_POSTERS_DIR, p.filename))
    );

    if (allFivePresent && requestedIds.length === 0) {
      const sheet = await generateContactSheet(page, config, fontCss, emblemDataUri);
      console.log(`[export] CONTACT_SHEET.png & CONTACT_SHEET_v2.png (1920x1080, ${sheet.bytes.toLocaleString()} B)`);

      const mobileStrip = await generateMobileReadabilityStrip(page, config, fontCss);
      console.log(
        `[export] MOBILE_READABILITY_25PCT.png (${mobileStrip.width}x${mobileStrip.height}, ${mobileStrip.bytes.toLocaleString()} B)`
      );

      const removed = cleanupStaleV1Pngs();
      if (removed.length > 0) {
        console.log(`[cleanup] Removed stale V1 PNGs: ${removed.join(', ')}`);
      }
    } else if (missingPosters.length > 0) {
      console.log(
        `[partial] Exported ${availablePosters.length}/5 available posters. Missing: ${missingPosters
          .map((p) => p.sourceIllustration)
          .join(', ')}`
      );
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
