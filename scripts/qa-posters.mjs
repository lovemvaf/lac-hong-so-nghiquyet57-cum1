#!/usr/bin/env node
/**
 * LẠC HỒNG SỐ — V2 Poster QA Verification Suite (`npm run qa:posters`)
 *
 * Single Source of Truth: LacHongSo_Cum1_NQ57_2026/content/campaign-content.json
 *
 * Validates:
 *   1. Alignment between canonical campaign-content.json and deliverables/02_ThietKe/campaign.config.json.
 *   2. All 5 exported PNGs (1080x1350, Python PIL RGB mode, >100KB) in:
 *        - deliverables/02_ThietKe/
 *        - LacHongSo_Cum1_NQ57_2026/design/
 *        - public/assets/posters/
 *      are exact byte-identical mirrors, and stale V1 PNGs are cleaned out.
 *   3. Editable layered SVGs (01.svg..05.svg) mirrored identically between
 *      deliverables/02_ThietKe/editable/ and LacHongSo_Cum1_NQ57_2026/design/editable/:
 *      viewBox="0 0 1080 1350", structured <g> layers (including layer-data-panels on 02..04
 *      and layer-cta-qr on 05), real <text> nodes, Be Vietnam Pro WOFF2, untouched Đoàn emblem
 *      at (64, 56) 84x93px, and exact locked Vietnamese copy from campaign-content.json.
 *   4. Mandatory V2 policy/action strings:
 *      - Poster 03: '2030', '2045', '30%', '80%', '50%', 'TOP 30', 'MỤC TIÊU', 'TẦM NHÌN',
 *        plus 'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI'
 *      - Poster 04: 'Cụm 1', 'HỌC KỸ NĂNG SỐ', 'HỖ TRỢ NGƯỜI DÂN',
 *        'ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN', 'SÁNG TẠO GIẢI PHÁP', 'AN TOÀN THÔNG TIN'
 *      - Shared footer: 'Cụm 1', '22/12/2024'
 *   5. Zero placeholder or banned tokens across JSONs and editable SVGs.
 *   6. Pixel-level QR verification on 05_lan_toa_1080x1350.png via Python PIL + jsQR,
 *      proving the rendered QR pixels decode directly to officialResolutionUrl.
 *   7. CONTACT_SHEET.png (1920x1080 RGB), LacHongSo_Cum1_NQ57_2026/qa/CONTACT_SHEET_v2.png
 *      (byte-identical), and MOBILE_READABILITY_25PCT.png (1520x500 RGB).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CANONICAL_CONTENT_PATH = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'content', 'campaign-content.json');
const DESIGN_DIR = path.join(ROOT, 'deliverables', '02_ThietKe');
const CONFIG_MIRROR_PATH = path.join(DESIGN_DIR, 'campaign.config.json');
const PACKAGE_DESIGN_DIR = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'design');
const PACKAGE_QA_DIR = path.join(ROOT, 'LacHongSo_Cum1_NQ57_2026', 'qa');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');

const STALE_V1_FILES = [
  '01_KhoiNguonNhanThuc.png',
  '02_HieuDungNoiDung.png',
  '03_HanhDongThietThuc.png',
  '04_LanToaCongDong.png',
  '05_KhatVongLacHongSo.png',
];

const BANNED_TOKENS = [
  '{{',
  '}}',
  '[TBD]',
  'Lorem',
  '20/11',
  'Nhà giáo',
  'Nét vẽ tri ân',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
];

const PARTIAL_MODE = process.argv.includes('--partial');

let passed = 0;
let failed = 0;

function check(label, ok, detail = '') {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${label}${detail ? ` (${detail})` : ''}`);
  } else {
    failed += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function inspectPngWithPython(filePath) {
  const pyCode = [
    'import json, sys',
    'from PIL import Image',
    'im = Image.open(sys.argv[1])',
    'print(json.dumps({"width": im.width, "height": im.height, "mode": im.mode}))',
  ].join('; ');
  const out = execFileSync('python', ['-c', pyCode, filePath], { encoding: 'utf8' }).trim();
  return JSON.parse(out);
}

function extractRgbaBytesWithPython(filePath) {
  const pyCode = [
    'import sys',
    'from PIL import Image',
    'im = Image.open(sys.argv[1]).convert("RGBA")',
    'sys.stdout.buffer.write(im.tobytes())',
  ].join('; ');
  return execFileSync('python', ['-c', pyCode, filePath], {
    maxBuffer: 16 * 1024 * 1024,
  });
}

function stripXmlEntities(str) {
  return str
    .replace(/<tspan[^>]*>/g, ' ')
    .replace(/<\/tspan>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTagInnerText(svgContent, id) {
  const re = new RegExp(`<text[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/text>`);
  const match = svgContent.match(re);
  if (!match) return '';
  return stripXmlEntities(match[1]);
}

function extractAllVisibleSvgText(svgContent) {
  const noData = svgContent.replace(/data:[^"']+/g, '');
  const noStyle = noData.replace(/<style[\s\S]*?<\/style>/g, '');
  const texts = [...noStyle.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((m) =>
    stripXmlEntities(m[1])
  );
  return texts.join(' | ');
}

function checkBannedTokens(label, text) {
  const found = BANNED_TOKENS.filter((tok) => text.toLowerCase().includes(tok.toLowerCase()));
  check(`${label} — zero placeholder/banned tokens`, found.length === 0, found.join(', '));
}

function main() {
  const configRaw = fs.readFileSync(CANONICAL_CONTENT_PATH, 'utf8');
  const config = JSON.parse(configRaw);
  console.log(`\n=== QA Posters V2 (${PARTIAL_MODE ? 'PARTIAL DRY-RUN' : 'FULL STRICT'}) ===`);

  checkBannedTokens('campaign-content.json', configRaw);

  if (fs.existsSync(CONFIG_MIRROR_PATH)) {
    const mirrorRaw = fs.readFileSync(CONFIG_MIRROR_PATH, 'utf8');
    const mirror = JSON.parse(mirrorRaw);
    check(
      'campaign.config.json aligned with campaign-content.json URLs & filenames',
      mirror.officialResolutionUrl === config.officialResolutionUrl &&
        JSON.stringify(mirror.posters.map((p) => p.filename)) ===
          JSON.stringify(config.posters.map((p) => p.filename))
    );
  }

  for (const dir of [DESIGN_DIR, PUBLIC_POSTERS_DIR]) {
    for (const stale of STALE_V1_FILES) {
      const stalePath = path.join(dir, stale);
      check(`Stale V1 removed (${path.relative(ROOT, stalePath)})`, !fs.existsSync(stalePath));
    }
  }

  for (const poster of config.posters) {
    const designPng = path.join(DESIGN_DIR, poster.filename);
    const pkgPng = path.join(PACKAGE_DESIGN_DIR, poster.filename);
    const publicPng = path.join(PUBLIC_POSTERS_DIR, poster.filename);
    const svgPath = path.join(DESIGN_DIR, poster.editableSvg);
    const pkgSvgPath = path.join(PACKAGE_DESIGN_DIR, poster.editableSvg);

    if (PARTIAL_MODE && !fs.existsSync(designPng)) {
      console.log(`  SKIP  ${poster.index} (${poster.filename} not exported yet)`);
      continue;
    }

    console.log(`\n[${poster.index}] ${poster.filename}`);
    const pngExists = fs.existsSync(designPng);
    check('Design PNG exists', pngExists, designPng);
    if (pngExists) {
      const stat = fs.statSync(designPng);
      check('Design PNG size > 100KB', stat.size > 102400, `${stat.size.toLocaleString()} B`);
      const info = inspectPngWithPython(designPng);
      check('Design PNG dimensions 1080x1350', info.width === 1080 && info.height === 1350, `${info.width}x${info.height}`);
      check('Design PNG Python PIL mode RGB', info.mode === 'RGB', info.mode);

      const designBuf = fs.readFileSync(designPng);
      const pkgExists = fs.existsSync(pkgPng);
      check('Package design PNG exists', pkgExists, pkgPng);
      if (pkgExists) {
        check('Package design PNG byte-identical to deliverables PNG', Buffer.compare(designBuf, fs.readFileSync(pkgPng)) === 0);
      }

      const publicExists = fs.existsSync(publicPng);
      check('Public mirror PNG exists', publicExists, publicPng);
      if (publicExists) {
        check('Public mirror PNG byte-identical to deliverables PNG', Buffer.compare(designBuf, fs.readFileSync(publicPng)) === 0);
      }
    }

    const svgExists = fs.existsSync(svgPath);
    check(`Editable SVG exists (${poster.editableSvg})`, svgExists);
    if (svgExists) {
      const svg = fs.readFileSync(svgPath, 'utf8');
      const pkgSvgExists = fs.existsSync(pkgSvgPath);
      check(`Package editable SVG exists (${poster.editableSvg})`, pkgSvgExists);
      if (pkgSvgExists) {
        check(
          'Package SVG byte-identical to deliverables SVG',
          Buffer.compare(fs.readFileSync(svgPath), fs.readFileSync(pkgSvgPath)) === 0
        );
      }

      check('SVG viewBox="0 0 1080 1350"', svg.includes('viewBox="0 0 1080 1350"'));

      const requiredLayers = [
        'layer-background',
        'layer-illustration',
        'layer-header',
        'layer-typography',
        'layer-footer',
      ];
      if (poster.id >= 2 && poster.id <= 4) requiredLayers.push('layer-data-panels');
      if (poster.hasQr) requiredLayers.push('layer-cta-qr');

      for (const layerId of requiredLayers) {
        check(`SVG has <g id="${layerId}">`, svg.includes(`id="${layerId}"`));
      }

      check('SVG embeds Be Vietnam Pro WOFF2', svg.includes('Be Vietnam Pro') && svg.includes('data:font/woff2;base64,'));
      check('SVG has real <text> nodes', /<text\b/.test(svg));

      const hasEmblemPlacement =
        svg.includes('id="doan-emblem"') &&
        svg.includes('x="64"') &&
        svg.includes('y="56"') &&
        svg.includes('width="84"') &&
        svg.includes('height="93"');
      check('SVG places Đoàn emblem at exact (64, 56) 84x93px', hasEmblemPlacement);

      check('SVG headerLabel locked', extractTagInnerText(svg, 'header-label-text') === config.sharedCopy.headerLabel);
      check('SVG index locked', extractTagInnerText(svg, 'index-label-text') === poster.index);
      check('SVG storyBeat locked', extractTagInnerText(svg, 'story-beat-text') === poster.storyBeat);
      check('SVG title locked', extractTagInnerText(svg, 'poster-headline') === poster.title);
      check('SVG subtitle locked', extractTagInnerText(svg, 'poster-subtitle') === poster.subtitle);
      if (poster.microNote) {
        check('SVG microNote locked', extractTagInnerText(svg, 'micro-note-text') === poster.microNote);
      }
      if (poster.cta) {
        check('SVG CTA locked', extractTagInnerText(svg, 'qr-cta-label') === poster.cta);
      }
      check('SVG footerEvent locked', extractTagInnerText(svg, 'footer-event-text') === config.sharedCopy.footerEvent);
      check('SVG sourceLine locked', extractTagInnerText(svg, 'footer-source-text') === config.sharedCopy.sourceLine);

      const allText = extractAllVisibleSvgText(svg);
      check('Shared footer contains Cụm 1 & 22/12/2024', allText.includes('Cụm 1') && allText.includes('22/12/2024'));

      if (poster.id === 2) {
        for (const f of poster.displayFacts) {
          check(`Poster 02 renders fact badge "${f.badgeTitle}"`, allText.includes(f.badgeTitle));
        }
      }
      if (poster.id === 3) {
        for (const tok of ['2030', '2045', '30%', '80%', '50%', 'TOP 30', 'MỤC TIÊU', 'TẦM NHÌN', 'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI']) {
          check(`Poster 03 contains mandatory string "${tok}"`, allText.includes(tok));
        }
      }
      if (poster.id === 4) {
        for (const tok of [
          'Cụm 1',
          'HỌC KỸ NĂNG SỐ',
          'HỖ TRỢ NGƯỜI DÂN',
          'ỨNG DỤNG TRONG CÔNG TÁC ĐOÀN',
          'SÁNG TẠO GIẢI PHÁP',
          'AN TOÀN THÔNG TIN',
        ]) {
          check(`Poster 04 contains mandatory string "${tok}"`, allText.includes(tok));
        }
      }
      if (poster.id === 5) {
        check('Poster 05 contains secondary CTA', allText.includes(poster.ctaSecondary));
        check('Poster 05 cites official domain', allText.includes('xaydungchinhsach.chinhphu.vn'));
      }

      const svgTextOnly = svg.replace(/data:[^"']+/g, '');
      checkBannedTokens(poster.editableSvg, svgTextOnly);
    }

    if (poster.hasQr && pngExists) {
      const rgba = extractRgbaBytesWithPython(designPng);
      const decoded = jsQR(new Uint8ClampedArray(rgba), 1080, 1350);
      check('jsQR decodes QR from 05 PNG pixels', Boolean(decoded), decoded ? 'decoded' : 'null');
      if (decoded) {
        check(
          'Decoded QR payload equals officialResolutionUrl',
          decoded.data === config.officialResolutionUrl,
          decoded.data
        );
      }
    }
  }

  const sheetPath = path.join(DESIGN_DIR, 'CONTACT_SHEET.png');
  const sheetV2Path = path.join(PACKAGE_QA_DIR, 'CONTACT_SHEET_v2.png');
  const mobileStripPath = path.join(PACKAGE_QA_DIR, 'MOBILE_READABILITY_25PCT.png');

  if (!PARTIAL_MODE || fs.existsSync(sheetPath)) {
    console.log('\n[CONTACT SHEETS & 25% MOBILE STRIP]');
    const sheetExists = fs.existsSync(sheetPath);
    check('CONTACT_SHEET.png exists', sheetExists);
    if (sheetExists) {
      const stat = fs.statSync(sheetPath);
      check('CONTACT_SHEET size > 100KB', stat.size > 102400, `${stat.size.toLocaleString()} B`);
      const info = inspectPngWithPython(sheetPath);
      check('CONTACT_SHEET dimensions 1920x1080', info.width === 1920 && info.height === 1080, `${info.width}x${info.height}`);
      check('CONTACT_SHEET PIL mode RGB', info.mode === 'RGB', info.mode);
    }

    const v2Exists = fs.existsSync(sheetV2Path);
    check('CONTACT_SHEET_v2.png exists', v2Exists);
    if (sheetExists && v2Exists) {
      check(
        'CONTACT_SHEET_v2.png byte-identical to CONTACT_SHEET.png',
        Buffer.compare(fs.readFileSync(sheetPath), fs.readFileSync(sheetV2Path)) === 0
      );
    }

    const stripExists = fs.existsSync(mobileStripPath);
    check('MOBILE_READABILITY_25PCT.png exists', stripExists);
    if (stripExists) {
      const stat = fs.statSync(mobileStripPath);
      check('MOBILE_READABILITY_25PCT size > 100KB', stat.size > 102400, `${stat.size.toLocaleString()} B`);
      const info = inspectPngWithPython(mobileStripPath);
      check('MOBILE_READABILITY_25PCT dimensions 1520x500', info.width === 1520 && info.height === 500, `${info.width}x${info.height}`);
      check('MOBILE_READABILITY_25PCT PIL mode RGB', info.mode === 'RGB', info.mode);
    }
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
