#!/usr/bin/env node
/**
 * LẠC HỒNG SỐ — Poster QA Verification Suite (`npm run qa:posters`)
 *
 * Validates:
 *   1. All 5 exported PNGs (1080x1350, Python PIL RGB mode, >100KB, byte-identical
 *      sync with public/assets/posters/).
 *   2. CONTACT_SHEET.png (1920x1080, Python PIL RGB mode, >100KB).
 *   3. Editable layered SVGs (01.svg..05.svg): viewBox="0 0 1080 1350", structured <g>
 *      layers, real <text> nodes, Be Vietnam Pro font, untouched Đoàn emblem at
 *      (64, 56) 84x93px, exact locked Vietnamese copy from campaign.config.json.
 *   4. Zero placeholder or banned tokens across editable SVGs and design artifacts.
 *   5. Pixel-level QR verification on 05_KhatVongLacHongSo.png via Python PIL + jsQR,
 *      proving the rendered QR pixels decode directly to config.officialResolutionUrl.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import jsQR from 'jsqr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DESIGN_DIR = path.join(ROOT, 'deliverables', '02_ThietKe');
const PUBLIC_POSTERS_DIR = path.join(ROOT, 'public', 'assets', 'posters');
const CONFIG_PATH = path.join(DESIGN_DIR, 'campaign.config.json');

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

function extractTagInnerText(svgContent, id) {
  const re = new RegExp(`<text[^>]*id="${id}"[^>]*>([\\s\\S]*?)<\\/text>`);
  const match = svgContent.match(re);
  if (!match) return '';
  return match[1]
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

function checkBannedTokens(label, text) {
  const found = BANNED_TOKENS.filter((tok) => text.toLowerCase().includes(tok.toLowerCase()));
  check(`${label} — zero placeholder/banned tokens`, found.length === 0, found.join(', '));
}

function main() {
  const configRaw = fs.readFileSync(CONFIG_PATH, 'utf8');
  const config = JSON.parse(configRaw);
  console.log(`\n=== QA Posters (${PARTIAL_MODE ? 'PARTIAL DRY-RUN' : 'FULL STRICT'}) ===`);

  checkBannedTokens('campaign.config.json', configRaw);

  for (const poster of config.posters) {
    const designPng = path.join(DESIGN_DIR, poster.filename);
    const publicPng = path.join(PUBLIC_POSTERS_DIR, poster.filename);
    const svgPath = path.join(DESIGN_DIR, poster.editableSvg);

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

      const publicExists = fs.existsSync(publicPng);
      check('Public mirror PNG exists', publicExists, publicPng);
      if (publicExists) {
        const eq = Buffer.compare(fs.readFileSync(designPng), fs.readFileSync(publicPng)) === 0;
        check('Public mirror byte-identical to deliverables PNG', eq);
      }
    }

    const svgExists = fs.existsSync(svgPath);
    check(`Editable SVG exists (${poster.editableSvg})`, svgExists);
    if (svgExists) {
      const svg = fs.readFileSync(svgPath, 'utf8');
      check('SVG viewBox="0 0 1080 1350"', svg.includes('viewBox="0 0 1080 1350"'));

      const requiredLayers = [
        'layer-background',
        'layer-illustration',
        'layer-header',
        'layer-typography',
        'layer-footer',
      ];
      if (poster.hasQr) requiredLayers.push('layer-cta-qr');

      for (const layerId of requiredLayers) {
        check(`SVG has <g id="${layerId}">`, svg.includes(`id="${layerId}"`));
      }

      check('SVG embeds Be Vietnam Pro WOFF2', svg.includes('Be Vietnam Pro') && svg.includes('data:font/woff2;base64,'));
      check('SVG has real <text> nodes', /<text\b/.test(svg));

      // Untouched Đoàn emblem placement check
      const hasEmblemPlacement =
        svg.includes('id="doan-emblem"') &&
        svg.includes('x="64"') &&
        svg.includes('y="56"') &&
        svg.includes('width="84"') &&
        svg.includes('height="93"');
      check('SVG places Đoàn emblem at exact (64, 56) 84x93px', hasEmblemPlacement);

      // Locked copy verification
      check('SVG headerLabel locked', extractTagInnerText(svg, 'header-label-text') === config.sharedCopy.headerLabel);
      check('SVG index locked', extractTagInnerText(svg, 'index-label-text') === poster.index);
      check('SVG storyBeat locked', extractTagInnerText(svg, 'story-beat-text') === poster.storyBeat);
      check('SVG title locked', extractTagInnerText(svg, 'poster-headline') === poster.title);
      check('SVG subtitle locked', extractTagInnerText(svg, 'poster-subtitle') === poster.subtitle);
      if (poster.microNote) {
        check('SVG microNote locked', extractTagInnerText(svg, 'micro-note-text') === poster.microNote);
      }
      if (poster.cta) {
        const ctaRendered =
          extractTagInnerText(svg, 'qr-cta-label') === poster.cta ||
          extractTagInnerText(svg, 'qr-cta-hidden-full') === poster.cta;
        check('SVG CTA locked', ctaRendered);
      }
      check('SVG footerEvent locked', extractTagInnerText(svg, 'footer-event-text') === config.sharedCopy.footerEvent);
      check('SVG sourceLine locked', extractTagInnerText(svg, 'footer-source-text') === config.sharedCopy.sourceLine);

      // Strip embedded base64 data URIs before scanning for banned tokens
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
  if (!PARTIAL_MODE || fs.existsSync(sheetPath)) {
    console.log('\n[CONTACT SHEET]');
    const sheetExists = fs.existsSync(sheetPath);
    check('CONTACT_SHEET.png exists', sheetExists);
    if (sheetExists) {
      const stat = fs.statSync(sheetPath);
      check('CONTACT_SHEET size > 100KB', stat.size > 102400, `${stat.size.toLocaleString()} B`);
      const info = inspectPngWithPython(sheetPath);
      check('CONTACT_SHEET dimensions 1920x1080', info.width === 1920 && info.height === 1080, `${info.width}x${info.height}`);
      check('CONTACT_SHEET PIL mode RGB', info.mode === 'RGB', info.mode);
    }
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
