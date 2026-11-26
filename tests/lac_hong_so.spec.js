import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(process.cwd(), 'test-results', 'lhs-screenshots');
const FORBIDDEN_20_11_TOKENS = [
  'Nét vẽ tri ân',
  'Nhà giáo',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
  '20/11',
];

const EXPECTED_POSTERS = [
  {
    stage: 1,
    index: '01/05',
    badge: '01 / 05',
    filename: '01_KhoiNguonNhanThuc.png',
    title: 'NGHỊ QUYẾT 57 GẦN THANH NIÊN THẾ NÀO?',
  },
  {
    stage: 2,
    index: '02/05',
    badge: '02 / 05',
    filename: '02_HieuDungNoiDung.png',
    title: 'HIỂU ĐÚNG ĐỂ HÀNH ĐỘNG ĐÚNG',
  },
  {
    stage: 3,
    index: '03/05',
    badge: '03 / 05',
    filename: '03_HanhDongThietThuc.png',
    title: 'THANH NIÊN HÀNH ĐỘNG',
  },
  {
    stage: 4,
    index: '04/05',
    badge: '04 / 05',
    filename: '04_LanToaCongDong.png',
    title: 'TỪ MỘT NGƯỜI ĐẾN CẢ CỘNG ĐỒNG',
  },
  {
    stage: 5,
    index: '05/05',
    badge: '05 / 05',
    filename: '05_KhatVongLacHongSo.png',
    title: 'HIỂU ĐÚNG – LÀM THẬT – LAN TỎA',
  },
];

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

function attachPurityMonitors(page) {
  const errors = [];
  const badResponses = [];
  const externalRequests = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`console.error: ${msg.text()}`);
    }
  });
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });
  page.on('requestfailed', (req) => {
    errors.push(`requestfailed: ${req.url()} (${req.failure()?.errorText || 'unknown'})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) {
      badResponses.push(`${res.status()} ${res.url()}`);
    }
  });
  page.on('request', (req) => {
    const url = req.url();
    if (
      !url.startsWith('http://127.0.0.1:5174/') &&
      !url.startsWith('data:') &&
      !url.startsWith('blob:')
    ) {
      externalRequests.push(url);
    }
  });

  return { errors, badResponses, externalRequests };
}

async function waitForStageSettled(page, expectedStage) {
  await page.waitForFunction(
    (target) => {
      const api = window.__LHS_DECK__;
      if (!api) return false;
      const s = api.getState();
      return s.stage === target && !s.isTransitioning;
    },
    expectedStage,
    { timeout: 10000 }
  );
  // Allow GSAP entrance stagger (~0.45s) to reach opacity 1 cleanly
  await page.waitForTimeout(550);
}

async function assertCleanDomPurity(page) {
  const purity = await page.evaluate((forbiddenTokens) => {
    const debugEls = document.querySelectorAll(
      '[id*="vfx"], [id*="showcase"], [id*="debug"], [class*="debug"]'
    );
    const audioEls = document.querySelectorAll('audio');
    const bodyText = document.body.innerText || '';
    const htmlText = document.documentElement.innerHTML || '';
    const hits = forbiddenTokens.filter(
      (token) =>
        bodyText.toLowerCase().includes(token.toLowerCase()) ||
        htmlText.toLowerCase().includes(token.toLowerCase())
    );
    return {
      debugCount: debugEls.length,
      audioCount: audioEls.length,
      forbiddenHits: hits,
    };
  }, FORBIDDEN_20_11_TOKENS);

  expect(purity.debugCount, 'Must have zero debug/vfx/showcase overlays').toBe(0);
  expect(purity.audioCount, 'Must have zero <audio> elements').toBe(0);
  expect(purity.forbiddenHits, 'Must have zero 20/11 strings').toEqual([]);
}

async function assertPosterGeometry(page, viewport, posterMeta) {
  const geom = await page.evaluate((expected) => {
    const img = document.getElementById('poster-stage-img');
    const frameBtn = document.getElementById('poster-frame-btn');
    const hudBar = document.getElementById('hud-bar');
    if (!img || !frameBtn || !hudBar) {
      return { ok: false, reason: 'Missing DOM elements' };
    }
    const imgRect = img.getBoundingClientRect();
    const frameRect = frameBtn.getBoundingClientRect();
    const hudRect = hudBar.getBoundingClientRect();
    const cs = window.getComputedStyle(img);
    return {
      ok: true,
      src: img.getAttribute('src'),
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      objectFit: cs.objectFit,
      imgRect: {
        left: imgRect.left,
        top: imgRect.top,
        right: imgRect.right,
        bottom: imgRect.bottom,
        width: imgRect.width,
        height: imgRect.height,
      },
      frameRect: {
        left: frameRect.left,
        top: frameRect.top,
        right: frameRect.right,
        bottom: frameRect.bottom,
      },
      hudRect: {
        top: hudRect.top,
        bottom: hudRect.bottom,
      },
      titleText: document.getElementById('panel-title')?.textContent?.trim(),
      badgeText: document.getElementById('stage-badge')?.textContent?.trim(),
      filenameChip: document.getElementById('poster-filename-chip')?.textContent?.trim(),
      motifSvgCount: document.querySelectorAll('#motif-art svg').length,
      docScrollWidth: document.documentElement.scrollWidth,
    };
  }, posterMeta);

  expect(geom.ok).toBe(true);
  expect(geom.complete).toBe(true);
  expect(geom.naturalWidth).toBe(1080);
  expect(geom.naturalHeight).toBe(1350);
  expect(geom.objectFit).toBe('contain');
  expect(geom.src).toContain(posterMeta.filename);
  expect(geom.filenameChip).toBe(posterMeta.filename);
  expect(geom.badgeText).toBe(posterMeta.badge);
  expect(geom.titleText).toBe(posterMeta.title);
  expect(geom.motifSvgCount).toBe(1);
  expect(geom.imgRect.width).toBeGreaterThan(150);
  expect(geom.imgRect.height).toBeGreaterThan(180);

  // Zero horizontal clipping at all viewports
  expect(geom.imgRect.left).toBeGreaterThanOrEqual(0);
  expect(geom.imgRect.right).toBeLessThanOrEqual(viewport.width + 0.5);

  if (viewport.width > 1024) {
    // Desktop: completely within viewport with zero vertical clipping and zero overlap with HUD
    expect(geom.imgRect.top).toBeGreaterThanOrEqual(0);
    expect(geom.imgRect.bottom).toBeLessThanOrEqual(viewport.height + 0.5);
    expect(geom.frameRect.bottom).toBeLessThanOrEqual(geom.hudRect.top + 2);
  }
}

test.describe('LẠC HỒNG SỐ — 7-Stage Exhibition QA Suite', () => {
  test('1920x1080 full 7-stage flow, keyboard shortcuts, posters 01-05, finale QR & purity', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const monitors = attachPurityMonitors(page);

    await page.goto('./', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStageSettled(page, 0);

    // Stage 0 Landing checks
    const landing = await page.evaluate(() => {
      const section = document.getElementById('stage-landing');
      const drum = document.getElementById('landing-dong-son-svg');
      const canvas = document.getElementById('lac-hong-canvas');
      const emblem = document.querySelector('#stage-landing .emblem-pill img');
      const startBtn = document.getElementById('btn-start');
      const beats = document.querySelectorAll('#landing-beats .beat-card');
      const cardRect = document.querySelector('#stage-landing .landing-card')?.getBoundingClientRect();
      const hudRect = document.getElementById('hud-bar')?.getBoundingClientRect();
      return {
        isPresent: section?.classList.contains('present'),
        drumCircles: drum?.querySelectorAll('circle').length || 0,
        drumPaths: drum?.querySelectorAll('path').length || 0,
        canvasW: canvas?.getBoundingClientRect().width || 0,
        canvasH: canvas?.getBoundingClientRect().height || 0,
        emblemComplete: emblem?.complete,
        emblemW: emblem?.naturalWidth || 0,
        emblemH: emblem?.naturalHeight || 0,
        startVisible: Boolean(startBtn && startBtn.offsetParent !== null),
        beatsCount: beats.length,
        cardBottom: cardRect?.bottom || 0,
        hudTop: hudRect?.top || 0,
      };
    });

    expect(landing.isPresent).toBe(true);
    expect(landing.drumCircles).toBeGreaterThanOrEqual(10);
    expect(landing.drumPaths).toBeGreaterThanOrEqual(8);
    expect(landing.canvasW).toBeGreaterThan(1800);
    expect(landing.canvasH).toBeGreaterThan(1000);
    expect(landing.emblemComplete).toBe(true);
    expect(landing.emblemW).toBeGreaterThan(0);
    expect(landing.emblemH).toBeGreaterThan(0);
    expect(landing.startVisible).toBe(true);
    expect(landing.beatsCount).toBe(5);
    expect(landing.cardBottom).toBeLessThanOrEqual(landing.hudTop + 2);
    await assertCleanDomPurity(page);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'landing_1920x1080.png'),
      fullPage: false,
    });

    // Forward navigation: 6 clicks (#btn-start then 5x #btn-next) Landing -> 01..05 -> Finale
    await page.click('#btn-start');
    await waitForStageSettled(page, 1);

    for (const posterMeta of EXPECTED_POSTERS) {
      if (posterMeta.stage > 1) {
        await page.click('#btn-next');
        await waitForStageSettled(page, posterMeta.stage);
      }
      await assertPosterGeometry(page, { width: 1920, height: 1080 }, posterMeta);
      await assertCleanDomPurity(page);
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, `scene_0${posterMeta.stage}_1920x1080.png`),
        fullPage: false,
      });
    }

    // 6th forward click -> Stage 6 Finale
    await page.click('#btn-next');
    await waitForStageSettled(page, 6);

    const finaleCheck = await page.evaluate(() => {
      const section = document.getElementById('stage-finale');
      const thumbs = Array.from(document.querySelectorAll('#finale-gallery .finale-thumb-card img'));
      const qrSvg = document.querySelector('#finale-qr-box svg');
      const qrRect = qrSvg?.getBoundingClientRect();
      const officialLink = document.getElementById('btn-finale-official');
      const cardRect = document.querySelector('#stage-finale .finale-card')?.getBoundingClientRect();
      const hudRect = document.getElementById('hud-bar')?.getBoundingClientRect();
      return {
        isPresent: section?.classList.contains('present'),
        thumbCount: thumbs.length,
        thumbsValid: thumbs.every((img) => img.complete && img.naturalWidth === 1080 && img.naturalHeight === 1350),
        hasQrSvg: Boolean(qrSvg),
        qrWidth: qrRect?.width || 0,
        qrHeight: qrRect?.height || 0,
        officialHref: officialLink?.getAttribute('href') || '',
        cardBottom: cardRect?.bottom || 0,
        hudTop: hudRect?.top || 0,
      };
    });

    expect(finaleCheck.isPresent).toBe(true);
    expect(finaleCheck.thumbCount).toBe(5);
    expect(finaleCheck.thumbsValid).toBe(true);
    expect(finaleCheck.hasQrSvg).toBe(true);
    expect(finaleCheck.qrWidth).toBeGreaterThan(40);
    expect(finaleCheck.qrHeight).toBeGreaterThan(40);
    expect(finaleCheck.officialHref).toContain('mst.gov.vn/toan-van-nghi-quyet-57-nq-tw');
    expect(finaleCheck.cardBottom).toBeLessThanOrEqual(finaleCheck.hudTop + 2);
    await assertCleanDomPurity(page);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'finale_1920x1080.png'),
      fullPage: false,
    });

    // Test Finale thumbnail zoom lightbox
    await page.click('[data-zoom-poster="5"]');
    await expect(page.locator('#lightbox-modal')).toBeVisible();
    await expect(page.locator('#lightbox-index')).toHaveText('05 / 05');
    const lbImgNatural = await page.evaluate(() => {
      const img = document.getElementById('lightbox-img');
      return { w: img?.naturalWidth || 0, h: img?.naturalHeight || 0 };
    });
    expect(lbImgNatural.w).toBe(1080);
    expect(lbImgNatural.h).toBe(1350);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).toBeHidden();

    // Return to Landing using 6 #btn-prev clicks (6 -> 5 -> 4 -> 3 -> 2 -> 1 -> 0)
    for (let target = 5; target >= 0; target--) {
      await page.click('#btn-prev');
      await waitForStageSettled(page, target);
    }
    expect(await page.evaluate(() => window.__LHS_DECK__.getState().stage)).toBe(0);

    // Also test 6 consecutive #btn-next clicks directly from Stage 0 -> Stage 6
    for (let target = 1; target <= 6; target++) {
      await page.click('#btn-next');
      await waitForStageSettled(page, target);
    }
    expect(await page.evaluate(() => window.__LHS_DECK__.getState().stage)).toBe(6);

    // Keyboard shortcuts verification
    await page.keyboard.press('Home');
    await waitForStageSettled(page, 0);

    await page.keyboard.press('ArrowRight');
    await waitForStageSettled(page, 1);

    // Blur button so Space triggers stage advance per slides-app.js
    await page.evaluate(() => document.activeElement?.blur?.());
    await page.keyboard.press('Space');
    await waitForStageSettled(page, 2);

    await page.keyboard.press('ArrowLeft');
    await waitForStageSettled(page, 1);

    // Toggle Notes (N) on Poster stage
    const notesBefore = await page.evaluate(() => window.__LHS_DECK__.getState().isNotesOpen);
    await page.keyboard.press('KeyN');
    const notesAfter = await page.evaluate(() => window.__LHS_DECK__.getState().isNotesOpen);
    expect(notesAfter).toBe(!notesBefore);
    if (notesAfter) {
      await expect(page.locator('#speaker-cue-body')).toBeVisible();
    } else {
      await expect(page.locator('#speaker-cue-body')).toBeHidden();
    }
    await page.keyboard.press('KeyN');

    // Toggle Lite mode (L)
    const liteBefore = await page.evaluate(() => window.__LHS_DECK__.getState().isLiteMode);
    await page.keyboard.press('KeyL');
    const liteAfter = await page.evaluate(() => ({
      state: window.__LHS_DECK__.getState().isLiteMode,
      hasClass: document.body.classList.contains('lite-mode'),
    }));
    expect(liteAfter.state).toBe(!liteBefore);
    expect(liteAfter.hasClass).toBe(liteAfter.state);
    await page.keyboard.press('KeyL');

    // Zoom (Z) + Escape
    await page.keyboard.press('KeyZ');
    await expect(page.locator('#lightbox-modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).toBeHidden();

    // End -> Stage 6, R -> Stage 0
    await page.keyboard.press('End');
    await waitForStageSettled(page, 6);
    await page.keyboard.press('KeyR');
    await waitForStageSettled(page, 0);

    expect(monitors.errors, 'Zero console/page/network errors').toEqual([]);
    expect(monitors.badResponses, 'Zero HTTP 4xx/5xx responses').toEqual([]);
    expect(monitors.externalRequests, 'Zero external CDN requests').toEqual([]);
  });

  test('1366x768 laptop viewport: zero clipping on Landing, Posters 01-05, and Finale', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    const monitors = attachPurityMonitors(page);

    await page.goto('./', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStageSettled(page, 0);

    const landingBounds = await page.evaluate(() => {
      const card = document.querySelector('#stage-landing .landing-card')?.getBoundingClientRect();
      const btn = document.getElementById('btn-start')?.getBoundingClientRect();
      const hud = document.getElementById('hud-bar')?.getBoundingClientRect();
      return {
        cardTop: card?.top || 0,
        cardBottom: card?.bottom || 0,
        cardScrollHeight: document.querySelector('#stage-landing .landing-card')?.scrollHeight || 0,
        cardClientHeight: document.querySelector('#stage-landing .landing-card')?.clientHeight || 0,
        btnBottom: btn?.bottom || 0,
        hudTop: hud?.top || 0,
      };
    });
    expect(landingBounds.cardTop).toBeGreaterThanOrEqual(0);
    expect(landingBounds.cardBottom).toBeLessThanOrEqual(landingBounds.hudTop + 2);
    expect(landingBounds.btnBottom).toBeLessThanOrEqual(landingBounds.hudTop + 2);
    expect(landingBounds.cardScrollHeight).toBeLessThanOrEqual(landingBounds.cardClientHeight + 2);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'landing_1366x768.png'),
      fullPage: false,
    });

    for (const posterMeta of EXPECTED_POSTERS) {
      await page.click('#btn-next');
      await waitForStageSettled(page, posterMeta.stage);
      await assertPosterGeometry(page, { width: 1366, height: 768 }, posterMeta);
      if (posterMeta.stage === 1 || posterMeta.stage === 5) {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `scene_0${posterMeta.stage}_1366x768.png`),
          fullPage: false,
        });
      }
    }

    await page.click('#btn-next');
    await waitForStageSettled(page, 6);
    const finaleBounds = await page.evaluate(() => {
      const card = document.querySelector('#stage-finale .finale-card')?.getBoundingClientRect();
      const hud = document.getElementById('hud-bar')?.getBoundingClientRect();
      const qr = document.querySelector('#finale-qr-box svg')?.getBoundingClientRect();
      return {
        cardTop: card?.top || 0,
        cardBottom: card?.bottom || 0,
        cardScrollHeight: document.querySelector('#stage-finale .finale-card')?.scrollHeight || 0,
        cardClientHeight: document.querySelector('#stage-finale .finale-card')?.clientHeight || 0,
        hudTop: hud?.top || 0,
        qrBottom: qr?.bottom || 0,
      };
    });
    expect(finaleBounds.cardTop).toBeGreaterThanOrEqual(0);
    expect(finaleBounds.cardBottom).toBeLessThanOrEqual(finaleBounds.hudTop + 2);
    expect(finaleBounds.qrBottom).toBeLessThanOrEqual(finaleBounds.hudTop + 2);
    expect(finaleBounds.cardScrollHeight).toBeLessThanOrEqual(finaleBounds.cardClientHeight + 2);
    await assertCleanDomPurity(page);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'finale_1366x768.png'),
      fullPage: false,
    });

    expect(monitors.errors).toEqual([]);
    expect(monitors.badResponses).toEqual([]);
    expect(monitors.externalRequests).toEqual([]);
  });

  test('390x844 mobile viewport: clean vertical scroll and zero horizontal overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const monitors = attachPurityMonitors(page);

    await page.goto('./', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStageSettled(page, 0);

    const mobileLanding = await page.evaluate(() => {
      const cs = window.getComputedStyle(document.body);
      return {
        overflowY: cs.overflowY,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
      };
    });
    expect(mobileLanding.overflowY).toBe('auto');
    expect(mobileLanding.scrollWidth).toBeLessThanOrEqual(390);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'landing_390x844.png'),
      fullPage: false,
    });

    // Verify clean scrolling and zero horizontal overflow across all stages 1..5 and Finale
    for (const posterMeta of EXPECTED_POSTERS) {
      await page.evaluate((s) => window.__LHS_DECK__.goToStage(s), posterMeta.stage);
      await waitForStageSettled(page, posterMeta.stage);
      await assertPosterGeometry(page, { width: 390, height: 844 }, posterMeta);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw).toBeLessThanOrEqual(390);
      if (posterMeta.stage === 5) {
        // Test real vertical scroll on mobile
        await page.evaluate(() => window.scrollTo(0, 260));
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'scene_05_390x844.png'),
          fullPage: false,
        });
      }
    }

    await page.evaluate(() => window.__LHS_DECK__.goToStage(6));
    await waitForStageSettled(page, 6);
    const mobileFinale = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      hasQrSvg: Boolean(document.querySelector('#finale-qr-box svg')),
      overflowY: window.getComputedStyle(document.body).overflowY,
    }));
    expect(mobileFinale.scrollWidth).toBeLessThanOrEqual(390);
    expect(mobileFinale.hasQrSvg).toBe(true);
    expect(mobileFinale.overflowY).toBe('auto');
    await assertCleanDomPurity(page);

    expect(monitors.errors).toEqual([]);
    expect(monitors.badResponses).toEqual([]);
    expect(monitors.externalRequests).toEqual([]);
  });
});
