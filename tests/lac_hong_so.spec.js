import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIRS = [
  path.resolve(process.cwd(), 'test-results', 'lhs-screenshots'),
  path.resolve(process.cwd(), 'LacHongSo_Cum1_NQ57_2026', 'qa', 'screenshots'),
];

const CAMPAIGN_CONTENT_PATH = path.resolve(
  process.cwd(),
  'LacHongSo_Cum1_NQ57_2026',
  'content',
  'campaign-content.json'
);
const CAMPAIGN_CONTENT = JSON.parse(fs.readFileSync(CAMPAIGN_CONTENT_PATH, 'utf8'));

const FORBIDDEN_20_11_TOKENS = [
  'Nét vẽ tri ân',
  'Nhà giáo',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
  '20/11',
];

const EXPECTED_POSTERS = CAMPAIGN_CONTENT.posters.map((poster) => ({
  stage: poster.id,
  index: poster.index,
  badge: poster.index.replace('/', ' / '),
  filename: poster.filename,
  title: poster.title,
  role: poster.role,
  hasQr: Boolean(poster.hasQr),
}));

for (const dir of SCREENSHOT_DIRS) {
  fs.mkdirSync(dir, { recursive: true });
}

async function saveScreenshotEverywhere(page, filename) {
  const buffer = await page.screenshot({ fullPage: false });
  for (const dir of SCREENSHOT_DIRS) {
    fs.writeFileSync(path.join(dir, filename), buffer);
  }
}

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
  const geom = await page.evaluate(() => {
    const img = document.getElementById('poster-stage-img');
    const frameBtn = document.getElementById('poster-frame-btn');
    const hudBar = document.getElementById('hud-bar');
    const downloadLink = document.getElementById('btn-download-poster');
    if (!img || !frameBtn || !hudBar || !downloadLink) {
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
      downloadAttr: downloadLink.getAttribute('download'),
      downloadHref: downloadLink.getAttribute('href'),
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
  });

  expect(geom.ok).toBe(true);
  expect(geom.complete).toBe(true);
  expect(geom.naturalWidth).toBe(1080);
  expect(geom.naturalHeight).toBe(1350);
  expect(geom.objectFit).toBe('contain');
  expect(geom.src).toContain(posterMeta.filename);
  expect(geom.downloadAttr).toBe(posterMeta.filename);
  expect(geom.downloadHref).toBe(`./assets/posters/${posterMeta.filename}`);
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

async function assertStage3PolicyHighlights(page) {
  const policyPanel = page.locator('#panel-policy-highlights');
  await expect(policyPanel).toBeVisible();
  const text = await policyPanel.innerText();
  for (const requiredToken of [
    '2030',
    '2045',
    '30%',
    '80%',
    '50%',
    'TOP 30',
    'MỤC TIÊU',
    'TẦM NHÌN',
    'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI',
  ]) {
    expect(text, `Stage 3 #panel-policy-highlights must include "${requiredToken}"`).toContain(
      requiredToken
    );
  }
}

async function assertSourcesModalContent(page) {
  const modal = page.locator('#sources-modal');
  await expect(modal).toBeVisible();
  const modalBodyText = await page.locator('#sources-modal-body').innerText();
  const modalHtml = await page.locator('#sources-modal-body').innerHTML();

  // 7 tasks grouped into 4 pillars
  const pillarCount = await page.locator('#sources-modal-body .sources-pillar-card').count();
  const taskCount = await page.locator('#sources-modal-body .sources-task-item').count();
  const qaCount = await page.locator('#sources-modal-body .sources-qa-card').count();
  expect(pillarCount).toBe(4);
  expect(taskCount).toBe(7);
  expect(qaCount).toBe(5);

  for (const q of CAMPAIGN_CONTENT.evaluationQuestions) {
    expect(modalBodyText).toContain(q.question);
  }
  expect(modalHtml).toContain('xaydungchinhsach.chinhphu.vn');
  expect(modalHtml).toContain('mst.gov.vn');
  expect(modalBodyText).toContain('03/NQ-CP');
  expect(modalBodyText).toContain('71/NQ-CP');
  expect(modalBodyText).toContain(CAMPAIGN_CONTENT.conceptNotice);
}

test.describe('LẠC HỒNG SỐ V2 — 7-Stage Exhibition QA Suite', () => {
  test('1920x1080 full 7-stage flow, Stage 3 targets, download PNG, Sources modal, Zoom, Finale QR & purity', async ({
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
      const card = document.querySelector('#stage-landing .landing-card');
      const cardRect = card?.getBoundingClientRect();
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
        cardScrollH: card?.scrollHeight || 0,
        cardClientH: card?.clientHeight || 0,
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
    expect(landing.cardScrollH).toBeLessThanOrEqual(landing.cardClientH + 2);
    await assertCleanDomPurity(page);

    await saveScreenshotEverywhere(page, 'landing_1920x1080.png');

    // Forward navigation: #btn-start -> 1, then #btn-next through 2..5
    await page.click('#btn-start');
    await waitForStageSettled(page, 1);

    for (const posterMeta of EXPECTED_POSTERS) {
      if (posterMeta.stage > 1) {
        await page.click('#btn-next');
        await waitForStageSettled(page, posterMeta.stage);
      }
      await assertPosterGeometry(page, { width: 1920, height: 1080 }, posterMeta);
      await assertCleanDomPurity(page);

      if (posterMeta.stage === 3) {
        // Mandatory: NO extra click inside Stage 3
        await assertStage3PolicyHighlights(page);
      }

      await saveScreenshotEverywhere(page, `scene_0${posterMeta.stage}_1920x1080.png`);

      if (posterMeta.stage === 3) {
        // Capture Zoom Lightbox on Stage 3 + verify download button
        await page.keyboard.press('KeyZ');
        await expect(page.locator('#lightbox-modal')).toBeVisible();
        await expect(page.locator('#lightbox-index')).toHaveText('03 / 05');
        const lbDownload = page.locator('a#btn-lightbox-download');
        await expect(lbDownload).toBeVisible();
        await expect(lbDownload).toHaveAttribute('download', posterMeta.filename);
        await expect(lbDownload).toHaveAttribute('href', `./assets/posters/${posterMeta.filename}`);
        await saveScreenshotEverywhere(page, 'scene_03_zoom_1920x1080.png');
        await page.keyboard.press('Escape');
        await expect(page.locator('#lightbox-modal')).toBeHidden();

        // Verify Sources modal opens from button click + closes via Escape
        await page.click('#btn-sources-modal');
        await assertSourcesModalContent(page);
        await saveScreenshotEverywhere(page, 'sources_modal_1920x1080.png');
        await page.keyboard.press('Escape');
        await expect(page.locator('#sources-modal')).toBeHidden();
      }
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
      const secondaryLink = document.getElementById('btn-finale-secondary-official');
      const card = document.querySelector('#stage-finale .finale-card');
      const cardRect = card?.getBoundingClientRect();
      const hudRect = document.getElementById('hud-bar')?.getBoundingClientRect();
      return {
        isPresent: section?.classList.contains('present'),
        thumbCount: thumbs.length,
        thumbsValid: thumbs.every(
          (img) => img.complete && img.naturalWidth === 1080 && img.naturalHeight === 1350
        ),
        hasQrSvg: Boolean(qrSvg),
        qrWidth: qrRect?.width || 0,
        qrHeight: qrRect?.height || 0,
        qrShapeRendering: qrSvg ? window.getComputedStyle(qrSvg).shapeRendering : '',
        officialHref: officialLink?.getAttribute('href') || '',
        secondaryHref: secondaryLink?.getAttribute('href') || '',
        cardBottom: cardRect?.bottom || 0,
        cardScrollH: card?.scrollHeight || 0,
        cardClientH: card?.clientHeight || 0,
        hudTop: hudRect?.top || 0,
      };
    });

    expect(finaleCheck.isPresent).toBe(true);
    expect(finaleCheck.thumbCount).toBe(5);
    expect(finaleCheck.thumbsValid).toBe(true);
    expect(finaleCheck.hasQrSvg).toBe(true);
    expect(finaleCheck.qrWidth).toBeGreaterThan(40);
    expect(finaleCheck.qrHeight).toBeGreaterThan(40);
    expect(finaleCheck.officialHref).toContain('xaydungchinhsach.chinhphu.vn');
    expect(finaleCheck.secondaryHref).toContain('mst.gov.vn');
    expect(finaleCheck.cardBottom).toBeLessThanOrEqual(finaleCheck.hudTop + 2);
    expect(finaleCheck.cardScrollH).toBeLessThanOrEqual(finaleCheck.cardClientH + 2);
    await assertCleanDomPurity(page);

    await saveScreenshotEverywhere(page, 'finale_1920x1080.png');

    // Test Finale thumbnail zoom lightbox & download link for Poster 05
    await page.click('[data-zoom-poster="5"]');
    await expect(page.locator('#lightbox-modal')).toBeVisible();
    await expect(page.locator('#lightbox-index')).toHaveText('05 / 05');
    await expect(page.locator('a#btn-lightbox-download')).toHaveAttribute(
      'download',
      EXPECTED_POSTERS[4].filename
    );
    const lbImgNatural = await page.evaluate(() => {
      const img = document.getElementById('lightbox-img');
      return { w: img?.naturalWidth || 0, h: img?.naturalHeight || 0 };
    });
    expect(lbImgNatural.w).toBe(1080);
    expect(lbImgNatural.h).toBe(1350);
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).toBeHidden();

    // Verify KeyI shortcut opens Sources modal from anywhere & Escape closes
    await page.keyboard.press('KeyI');
    await assertSourcesModalContent(page);
    await page.keyboard.press('Escape');
    await expect(page.locator('#sources-modal')).toBeHidden();

    // Return to Landing using 6 #btn-prev clicks (6 -> 5 -> 4 -> 3 -> 2 -> 1 -> 0)
    for (let target = 5; target >= 0; target--) {
      await page.click('#btn-prev');
      await waitForStageSettled(page, target);
    }
    expect(await page.evaluate(() => window.__LHS_DECK__.getState().stage)).toBe(0);

    // 6 consecutive #btn-next clicks directly from Stage 0 -> Stage 6
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

    await page.evaluate(() => document.activeElement?.blur?.());
    await page.keyboard.press('Space');
    await waitForStageSettled(page, 2);

    await page.keyboard.press('ArrowLeft');
    await waitForStageSettled(page, 1);

    // Toggle Notes (N)
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

    // Fullscreen toggle (#btn-fullscreen) — ensure visible, wired, and clean (no errors even if headless denies fullscreen)
    await expect(page.locator('#btn-fullscreen')).toBeVisible();
    await page.click('#btn-fullscreen');
    const fullscreenAttr = await page.locator('#btn-fullscreen').getAttribute('aria-pressed');
    expect(['true', 'false']).toContain(fullscreenAttr);
    if (fullscreenAttr === 'true') {
      await page.click('#btn-fullscreen');
    }

    // Zoom (Z) + Escape
    await page.keyboard.press('KeyZ');
    await expect(page.locator('#lightbox-modal')).toBeVisible();
    await expect(page.locator('a#btn-lightbox-download')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#lightbox-modal')).toBeHidden();

    // End -> Stage 6, R -> Stage 0
    await page.keyboard.press('End');
    await waitForStageSettled(page, 6);
    await page.keyboard.press('KeyR');
    await waitForStageSettled(page, 0);

    // Verify all 5 downloadable poster hrefs serve HTTP 200 PNGs
    for (const posterMeta of EXPECTED_POSTERS) {
      const res = await page.request.get(`./assets/posters/${posterMeta.filename}`);
      expect(res.status(), `Downloadable PNG ${posterMeta.filename} must return HTTP 200`).toBe(200);
      expect(res.headers()['content-type'] || '').toContain('image/png');
    }

    expect(monitors.errors, 'Zero console/page/network errors').toEqual([]);
    expect(monitors.badResponses, 'Zero HTTP 4xx/5xx responses').toEqual([]);
    expect(monitors.externalRequests, 'Zero external CDN requests').toEqual([]);
  });

  test('1366x768 laptop viewport: zero clipping on Landing, Posters 01-05 (Stage 3 highlights), and Finale', async ({
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
    await saveScreenshotEverywhere(page, 'landing_1366x768.png');

    for (const posterMeta of EXPECTED_POSTERS) {
      await page.click('#btn-next');
      await waitForStageSettled(page, posterMeta.stage);
      await assertPosterGeometry(page, { width: 1366, height: 768 }, posterMeta);
      if (posterMeta.stage === 3) {
        await assertStage3PolicyHighlights(page);
        await saveScreenshotEverywhere(page, 'scene_03_1366x768.png');
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

    await saveScreenshotEverywhere(page, 'finale_1366x768.png');

    expect(monitors.errors).toEqual([]);
    expect(monitors.badResponses).toEqual([]);
    expect(monitors.externalRequests).toEqual([]);
  });

  test('390x844 mobile viewport: clean vertical scroll, Stage 3 highlights, and zero horizontal overflow', async ({
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
    await saveScreenshotEverywhere(page, 'landing_390x844.png');

    for (const posterMeta of EXPECTED_POSTERS) {
      await page.evaluate((s) => window.__LHS_DECK__.goToStage(s), posterMeta.stage);
      await waitForStageSettled(page, posterMeta.stage);
      await assertPosterGeometry(page, { width: 390, height: 844 }, posterMeta);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw).toBeLessThanOrEqual(390);

      if (posterMeta.stage === 3) {
        await assertStage3PolicyHighlights(page);
        await saveScreenshotEverywhere(page, 'scene_03_390x844.png');
      }

      if (posterMeta.stage === 5) {
        await page.evaluate(() => window.scrollTo(0, 260));
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeGreaterThan(0);
        await page.evaluate(() => window.scrollTo(0, 0));
        await saveScreenshotEverywhere(page, 'scene_05_390x844.png');
      }
    }

    await page.evaluate(() => window.__LHS_DECK__.goToStage(6));
    await waitForStageSettled(page, 6);
    const mobileFinale = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      hasQrSvg: Boolean(document.querySelector('#finale-qr-box svg')),
      officialHref: document.getElementById('btn-finale-official')?.getAttribute('href') || '',
      overflowY: window.getComputedStyle(document.body).overflowY,
    }));
    expect(mobileFinale.scrollWidth).toBeLessThanOrEqual(390);
    expect(mobileFinale.hasQrSvg).toBe(true);
    expect(mobileFinale.officialHref).toContain('xaydungchinhsach.chinhphu.vn');
    expect(mobileFinale.overflowY).toBe('auto');
    await assertCleanDomPurity(page);

    expect(monitors.errors).toEqual([]);
    expect(monitors.badResponses).toEqual([]);
    expect(monitors.externalRequests).toEqual([]);
  });

  test('prefers-reduced-motion: reduce automatically enables Lite Mode & pauses drum spin', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1920, height: 1080 });
    const monitors = attachPurityMonitors(page);

    await page.goto('./', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await waitForStageSettled(page, 0);

    const reducedState = await page.evaluate(() => {
      const state = window.__LHS_DECK__.getState();
      const drum = document.getElementById('landing-dong-son-svg');
      const drumAnimState = drum ? window.getComputedStyle(drum).animationPlayState : '';
      return {
        isLiteMode: state.isLiteMode,
        hasLiteClass: document.body.classList.contains('lite-mode'),
        litePressed: document.getElementById('btn-lite')?.getAttribute('aria-pressed'),
        drumAnimState,
      };
    });

    expect(reducedState.isLiteMode).toBe(true);
    expect(reducedState.hasLiteClass).toBe(true);
    expect(reducedState.litePressed).toBe('true');
    expect(reducedState.drumAnimState).toBe('paused');

    // Stage transition under reduced motion settles cleanly without motion hang
    await page.click('#btn-start');
    await waitForStageSettled(page, 1);
    await page.keyboard.press('ArrowRight');
    await waitForStageSettled(page, 2);
    await page.keyboard.press('ArrowRight');
    await waitForStageSettled(page, 3);
    await assertStage3PolicyHighlights(page);

    expect(monitors.errors).toEqual([]);
    expect(monitors.badResponses).toEqual([]);
    expect(monitors.externalRequests).toEqual([]);
  });
});
