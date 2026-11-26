#!/usr/bin/env node
/**
 * LẠC HỒNG SỐ — Phase 3B Poster Compositor & Export Toolchain
 *
 * Reads deliverables/02_ThietKe/campaign.config.json, the untouched Đoàn emblem
 * (huy-hieu-doan-clean.png), local @fontsource/be-vietnam-pro WOFF2 fonts, and
 * whichever source_illustrations/01_lhs_raw.png..05_lhs_raw.png exist on disk.
 *
 * Outputs:
 *   - deliverables/02_ThietKe/editable/01.svg .. 05.svg (viewBox="0 0 1080 1350")
 *   - deliverables/02_ThietKe/01_KhoiNguonNhanThuc.png .. 05_KhatVongLacHongSo.png (1080x1350 sRGB)
 *   - public/assets/posters/01_...png .. 05_...png (exact byte-identical mirror)
 *   - deliverables/02_ThietKe/CONTACT_SHEET.png (1920x1080 sRGB, when all 5 exist)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DESIGN_DIR = path.join(ROOT, 'deliverables', '02_ThietKe');
const EDITABLE_DIR = path.join(DESIGN_DIR, 'editable');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');
const CONFIG_PATH = path.join(DESIGN_DIR, 'campaign.config.json');

const CANVAS_W = 1080;
const CANVAS_H = 1350;

/**
 * Per-poster illustration placement/crop & layout rhythm calibrated against
 * ILLUSTRATION_NOTES.md safe zones so zero heads, hands, Chim Lạc cranes, or
 * props are clipped or covered.
 *
 * Each source illustration is 896x1200. Placement uses SVG <image> inside an
 * explicit clipPath rect (with optional edge feathering mask so #F7F3E8 merges
 * cleanly without hard seams).
 */
const POSTER_SPECS = {
  1: {
    rhythm: 'editorial-left',
    footerTheme: 'navy',
    // crop(0, 0, 896, 1178) scaled 1.0357x -> 928x1220 at (76, 14)
    // Preserves cranes (y=56..225), top head (y=387), notebook bottom (y=1204)
    artBox: { x: 76, y: 14, w: 928, h: 1220, imgH: 1243, featherEdges: true },
    titleLines: ['NGHỊ QUYẾT 57 GẦN', 'THANH NIÊN THẾ NÀO?'],
    titleSize: 42,
    titleX: 64,
    titleY: 210,
    titleLineGap: 52,
    subtitleY: 304,
    subtitleMaxW: 700,
  },
  2: {
    rhythm: 'centered-radial',
    footerTheme: 'cream',
    // crop(0, 210, 896, 1075) -> 950x917 placed at (65, 308) on #F7F3E8
    // Keeps top y=0..308 completely open for centered headline/subtitle/microNote
    artBox: {
      x: 65,
      y: 308,
      w: 950,
      h: 917,
      imgYOffset: -222.6,
      imgH: 1272.3,
      featherEdges: true,
      featherSpan: 9.0,
    },
    titleLines: ['HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG'],
    titleSize: 38,
    titleX: 540,
    titleY: 204,
    titleLineGap: 48,
    subtitleLines: ['Khoa học, công nghệ · Đổi mới sáng tạo · Chuyển đổi số'],
    subtitleY: 244,
    microNoteY: 266,
  },
  3: {
    rhythm: 'community-badge',
    footerTheme: 'navy',
    // Exact full-bleed non-clipping 4:5 crop (0, 18, 896, 1138) -> 1080x1350
    // Cranes sit at x=820..1038, y=28..265; top head y=483; navy notebook y<=1190
    artBox: { x: 0, y: 0, w: 1080, h: 1350, imgYOffset: -21.7, imgH: 1446.4, featherEdges: false },
    titleLines: ['THANH NIÊN HÀNH ĐỘNG'],
    titleSize: 44,
    titleX: 64,
    titleY: 210,
    titleLineGap: 52,
    subtitleLines: ['Học kỹ năng số · Hỗ trợ người dân · Đồng hành cơ sở'],
    subtitleY: 252,
    microNoteY: 274,
  },
  4: {
    rhythm: 'panoramic',
    footerTheme: 'cream',
    // Exact full-bleed non-clipping 4:5 crop (0, 18, 896, 1138) -> 1080x1350
    // 4 cranes sit at x=651..1038, y=28..290; keep headline & subtitle <= x=635
    artBox: { x: 0, y: 0, w: 1080, h: 1350, imgYOffset: -21.7, imgH: 1446.4, featherEdges: false },
    titleLines: ['TỪ MỘT NGƯỜI ĐẾN', 'CẢ CỘNG ĐỒNG'],
    titleSize: 42,
    titleX: 64,
    titleY: 208,
    titleLineGap: 50,
    subtitleLines: ['Người dân là trung tâm —', 'công nghệ phục vụ cuộc sống.'],
    subtitleY: 300,
    subtitleLineGap: 29,
  },
  5: {
    rhythm: 'climax-qr',
    footerTheme: 'navy',
    // Exact full-bleed non-clipping 4:5 crop (0, 18, 896, 1138) -> 1080x1350
    // 5 cranes at x=579..1039, y=28..315 -> keep headline & subtitle <= x=575
    // All 4 characters end above stone balustrade y=1067; terrace y=1067..1246 clear for QR card
    artBox: { x: 0, y: 0, w: 1080, h: 1350, imgYOffset: -21.7, imgH: 1446.4, featherEdges: false },
    titleLines: ['HIỂU ĐÚNG –', 'LÀM THẬT – LAN TỎA'],
    titleSize: 40,
    titleX: 64,
    titleY: 208,
    titleLineGap: 48,
    subtitleLines: ['Khát vọng Lạc Hồng Số —', 'Bắt đầu từ một việc nhỏ hôm nay.'],
    subtitleY: 298,
    subtitleLineGap: 28,
    qrCard: { x: 64, y: 1076, w: 592, h: 158 },
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
    css = css.replace(/url\(\.\/files\/([^)]+\.woff2)\) format\('woff2'\),\s*url\([^)]+\) format\('woff'\)/g, (_, file) => {
      const woff2Path = path.join(fontDir, 'files', file);
      const b64 = fs.readFileSync(woff2Path).toString('base64');
      return `url(data:font/woff2;base64,${b64}) format('woff2')`;
    });
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

  const fh = ab.featherSpan || 3.5;
  const fv = ab.featherSpan || 2.5;
  const maskDef = ab.featherEdges
    ? `
      <linearGradient id="fade-h-${poster.id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#000000"/>
        <stop offset="${fh}%" stop-color="#FFFFFF"/>
        <stop offset="${100 - fh}%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <linearGradient id="fade-v-${poster.id}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000"/>
        <stop offset="${fv}%" stop-color="#FFFFFF"/>
        <stop offset="${100 - fv}%" stop-color="#FFFFFF"/>
        <stop offset="100%" stop-color="#000000"/>
      </linearGradient>
      <mask id="${maskId}">
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" fill="url(#fade-h-${poster.id})"/>
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" fill="url(#fade-v-${poster.id})" style="mix-blend-mode:multiply"/>
      </mask>`
    : '';

  const clipDef = `
      <clipPath id="${clipId}">
        <rect x="${ab.x}" y="${ab.y}" width="${ab.w}" height="${ab.h}" rx="${ab.featherEdges ? 18 : 0}"/>
      </clipPath>${maskDef}`;

  // Unified LẠC HỒNG SỐ vector signature: subtle Warm Gold Đông Sơn corner geometric
  // line accents + delicate Chim Lạc vector stroke mark shared across all 5 posters.
  const showTopRightBracket = poster.id === 1 || poster.id === 2;
  const topRightBracket = showTopRightBracket
    ? `
        <!-- Top-right geometric stepped corner linework -->
        <path d="M 1002 30 L 1052 30 L 1052 80" stroke-width="2"/>
        <path d="M 1016 42 L 1040 42 L 1040 66" stroke-width="1.25" opacity="0.75"/>
        <path d="M 1052 30 A 26 26 0 0 1 1026 56" stroke-width="1.2" opacity="0.55"/>`
    : '';

  const cornerStrokes = `
      <!-- Subtle Warm Gold Đông Sơn corner geometric accent & tiny Chim Lạc mark -->
      <g id="dong-son-accents-${poster.id}" fill="none" stroke="${palette.warmGold}" stroke-linecap="round" stroke-linejoin="round" opacity="0.74">
        ${topRightBracket}
        <!-- Bottom-left subtle corner frame accent above footer -->
        <path d="M 36 1180 L 36 1228 L 84 1228" stroke-width="1.8" opacity="0.72"/>
        <path d="M 48 1196 L 48 1216 L 68 1216" stroke-width="1.2" opacity="0.58"/>
        <!-- Bottom-right subtle corner frame accent above footer -->
        <path d="M 1044 1180 L 1044 1228 L 996 1228" stroke-width="1.8" opacity="0.72"/>
        <path d="M 1032 1196 L 1032 1216 L 1012 1216" stroke-width="1.2" opacity="0.58"/>
        <!-- Tiny Chim Lạc vector stroke mark (safe clear header zone across 01..05) -->
        <g transform="translate(562, 68) scale(0.95)">
          <path d="M 0 10 Q 10 2 20 8 Q 27 12 36 6 Q 29 14 21 14 Q 14 14 8 18 L 13 12 Q 6 12 0 10 Z" stroke-width="1.6"/>
          <path d="M 14 8 Q 18 -2 28 -4 Q 23 3 19 8" stroke-width="1.4"/>
          <path d="M 36 6 L 44 4" stroke-width="1.4"/>
        </g>
      </g>`;

  const maskAttr = ab.featherEdges ? ` mask="url(#${maskId})"` : '';

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
      <circle cx="540" cy="760" r="446" fill="none" stroke="${palette.warmGold}" stroke-width="1.3" stroke-dasharray="6 10" opacity="0.45"/>`;
  } else if (spec.rhythm === 'community-badge') {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="350" fill="url(#bg-wash-left-${poster.id})"/>
      <line x1="40" y1="56" x2="40" y2="306" stroke="${palette.deepGreen}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>`;
  } else if (spec.rhythm === 'panoramic') {
    accent = `
      <rect x="0" y="0" width="${CANVAS_W}" height="340" fill="url(#bg-wash-left-${poster.id})"/>`;
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
  const subtitle = escapeXml(poster.subtitle);

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
          height="34"
          rx="17"
          fill="#FFFFFF"
          stroke="${palette.warmGold}"
          stroke-width="1.6"
        />
        <text
          id="micro-note-text"
          x="540"
          y="${spec.microNoteY + 22.5}"
          text-anchor="middle"
          fill="${palette.deepNavy}"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="15.5"
          font-weight="600"
        >${noteText}</text>
      </g>`;
    } else {
      microNoteBlock = `
      <g id="micro-note-pill">
        <rect
          data-pill-for="micro-note-text"
          data-pad-x="18"
          x="64"
          y="${spec.microNoteY}"
          width="450"
          height="36"
          rx="18"
          fill="${palette.deepGreen}"
        />
        <circle cx="84" cy="${spec.microNoteY + 18}" r="4" fill="${palette.warmGold}"/>
        <text
          id="micro-note-text"
          x="96"
          y="${spec.microNoteY + 23.5}"
          text-anchor="start"
          fill="#FFFFFF"
          font-family="Be Vietnam Pro, sans-serif"
          font-size="15.5"
          font-weight="700"
          data-left-offset="32"
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

function buildQrCtaLayer(poster, spec, qrInfo) {
  if (!poster.hasQr || !qrInfo) {
    return '';
  }
  const { palette } = poster._config;
  const card = spec.qrCard;
  // Integer scale QR modules (2px per module -> 69 * 2 = 138px crisp integer pixels inside 158px card height)
  const modulePx = 2;
  const qrSize = qrInfo.vbSize * modulePx;
  const qrPad = Math.round((card.h - qrSize) / 2);
  const qrX = card.x + qrPad + 4;
  const qrY = card.y + qrPad;
  const textX = qrX + qrSize + 24;
  const ctaText = escapeXml(poster.cta);

  // Strip outer <svg ...> wrapper and re-host directly as nested <svg> with exact integer dimensions
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
      <rect x="${card.x + 16}" y="${card.y}" width="84" height="4" rx="2" fill="${palette.warmGold}"/>
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

      <rect x="${textX}" y="${card.y + 22}" width="38" height="4" rx="2" fill="${palette.redAccent}"/>
      <text
        id="qr-cta-label"
        x="${textX}"
        y="${card.y + 52}"
        fill="${palette.deepNavy}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="21"
        font-weight="800"
      >
        <tspan x="${textX}" dy="0">QUÉT MÃ ĐỌC</tspan>
        <tspan x="${textX}" dy="26">NGHỊ QUYẾT GỐC</tspan>
      </text>
      <text
        id="qr-cta-hidden-full"
        x="${textX}"
        y="${card.y + 52}"
        opacity="0"
        font-size="1"
      >${ctaText}</text>
      <text
        x="${textX}"
        y="${card.y + 106}"
        fill="${palette.youthBlue}"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="16"
        font-weight="700"
      >mst.gov.vn · Toàn văn 57-NQ/TW</text>
      <text
        x="${textX}"
        y="${card.y + 132}"
        fill="${palette.deepNavy}"
        fill-opacity="0.80"
        font-family="Be Vietnam Pro, sans-serif"
        font-size="14.5"
        font-weight="500"
      >Bộ Chính trị ban hành 22/12/2024</text>
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
      <!-- Subtle Warm Gold Đông Sơn footer emblem -->
      <g transform="translate(966, 1278)" fill="none" stroke="${palette.warmGold}" stroke-width="1.6" stroke-linecap="round" opacity="0.82">
        <circle cx="24" cy="20" r="14" stroke-dasharray="4 3"/>
        <path d="M 10 22 Q 20 14 28 20 Q 34 24 44 17"/>
        <path d="M 22 18 Q 26 8 36 6"/>
      </g>
    </g>`;
  }

  return `
    <g id="layer-footer">
      <rect x="0" y="1210" width="${CANVAS_W}" height="140" fill="url(#cream-footer-fade)"/>
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
    <radialGradient id="bg-radial-${poster.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.85"/>
      <stop offset="65%" stop-color="${palette.warmCream}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${palette.warmCream}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cream-footer-fade" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${palette.warmCream}" stop-opacity="0"/>
      <stop offset="26%" stop-color="${palette.warmCream}" stop-opacity="0.97"/>
      <stop offset="100%" stop-color="${palette.warmCream}" stop-opacity="0.99"/>
    </linearGradient>
    ${clipDef}
  </defs>
  ${bgMarkup}
  ${illustrationMarkup}
  ${headerMarkup}
  ${typoMarkup}
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
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.writeFileSync(svgPath, finalSvg, 'utf8');

  const pngBuf = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H },
  });

  const designPngPath = path.join(DESIGN_DIR, poster.filename);
  const publicPngPath = path.join(PUBLIC_POSTERS_DIR, poster.filename);
  fs.mkdirSync(path.dirname(designPngPath), { recursive: true });
  fs.mkdirSync(path.dirname(publicPngPath), { recursive: true });
  fs.writeFileSync(designPngPath, pngBuf);
  fs.writeFileSync(publicPngPath, pngBuf);

  return { designPngPath, publicPngPath, svgPath, bytes: pngBuf.length };
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
        <div class="eyebrow">CONTACT SHEET · BỘ 05 ẤN PHẨM 1080 × 1350 PX (4:5 sRGB)</div>
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
  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1920, height: 1080 },
  });
  return outPath;
}

async function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
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
    console.log('No source illustrations found yet to export.');
    process.exit(0);
  }

  fs.mkdirSync(EDITABLE_DIR, { recursive: true });
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

    const allFivePresent = config.posters.every((p) =>
      fs.existsSync(path.join(DESIGN_DIR, p.filename))
    );
    if (allFivePresent && requestedIds.length === 0) {
      const sheetPath = await generateContactSheet(page, config, fontCss, emblemDataUri);
      const sheetSize = fs.statSync(sheetPath).size;
      console.log(`[export] CONTACT_SHEET.png (1920x1080, ${sheetSize.toLocaleString()} B)`);
    } else if (missingPosters.length > 0) {
      console.log(
        `[partial] Exported ${availablePosters.length}/5 available posters. Waiting on: ${missingPosters
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
