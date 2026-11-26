import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const NEW_URL = 'https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/';
const OLD_URL = 'https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/';
const SCREENSHOT_DIRS = [
  path.resolve(process.cwd(), 'test-results', 'lhs-screenshots'),
  path.resolve(process.cwd(), 'LacHongSo_Cum1_NQ57_2026', 'qa', 'screenshots'),
];

const EXPECTED_V2_FILENAMES = [
  '01_dat_cau_hoi_1080x1350.png',
  '02_quan_diem_cot_loi_1080x1350.png',
  '03_muc_tieu_2030_tam_nhin_2045_1080x1350.png',
  '04_thanh_nien_cum1_hanh_dong_1080x1350.png',
  '05_lan_toa_1080x1350.png',
];

const FORBIDDEN_20_11 = [
  'Nét vẽ tri ân',
  'Nhà giáo',
  'Cô Liệu',
  'Cô Ngọc',
  'Sinh viên 5 tốt',
  '20/11',
];

for (const dir of SCREENSHOT_DIRS) {
  fs.mkdirSync(dir, { recursive: true });
}

function assert(cond, msg) {
  if (!cond) {
    throw new Error(`ASSERTION FAILED: ${msg}`);
  }
}

async function saveShot(page, filename) {
  const buf = await page.screenshot({ fullPage: false });
  const savedPaths = [];
  for (const dir of SCREENSHOT_DIRS) {
    const outPath = path.join(dir, filename);
    fs.writeFileSync(outPath, buf);
    savedPaths.push(outPath);
  }
  return savedPaths[1];
}

async function waitForStage(page, targetStage) {
  await page.waitForFunction(
    (s) => {
      const api = window.__LHS_DECK__;
      if (!api) return false;
      const st = api.getState();
      return st.stage === s && !st.isTransitioning;
    },
    targetStage,
    { timeout: 15000 }
  );
  await page.waitForTimeout(550);
}

async function verifyNewSite(browser) {
  console.log(`\n=== Verifying NEW Live Site (V2): ${NEW_URL} ===`);
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const httpErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));
  page.on('requestfailed', (req) =>
    failedRequests.push(`${req.url()} (${req.failure()?.errorText || 'failed'})`)
  );
  page.on('response', (res) => {
    if (res.status() >= 400) httpErrors.push(`${res.status()} ${res.url()}`);
  });

  const cacheBustUrl = `${NEW_URL}?v=${Date.now()}`;
  const resp = await page.goto(cacheBustUrl, { waitUntil: 'networkidle', timeout: 45000 });
  assert(resp && resp.status() === 200, `Expected HTTP 200 for ${NEW_URL}, got ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await waitForStage(page, 0);

  const landing = await page.evaluate((forbidden) => {
    const drum = document.getElementById('landing-dong-son-svg');
    const canvas = document.getElementById('lac-hong-canvas');
    const emblem = document.querySelector('#stage-landing .emblem-pill img');
    const startBtn = document.getElementById('btn-start');
    const beatImgs = Array.from(document.querySelectorAll('#landing-beats .beat-card img')).map((i) =>
      i.getAttribute('src')
    );
    const debugCount = document.querySelectorAll(
      '[id*="vfx"], [id*="showcase"], [id*="debug"], [class*="debug"]'
    ).length;
    const audioCount = document.querySelectorAll('audio').length;
    const text = (document.body.innerText || '') + '\n' + (document.documentElement.innerHTML || '');
    const forbiddenHits = forbidden.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
    return {
      present: document.getElementById('stage-landing')?.classList.contains('present'),
      drumCircles: drum?.querySelectorAll('circle').length || 0,
      canvasW: canvas?.getBoundingClientRect().width || 0,
      emblemW: emblem?.naturalWidth || 0,
      startVisible: Boolean(startBtn && startBtn.offsetParent !== null),
      beatImgs,
      debugCount,
      audioCount,
      forbiddenHits,
      title: document.title,
    };
  }, FORBIDDEN_20_11);

  assert(landing.present, 'Stage 0 Landing must be present');
  assert(landing.drumCircles >= 10, `Expected Dong Son SVG circles >= 10, got ${landing.drumCircles}`);
  assert(landing.canvasW > 1000, `Expected #lac-hong-canvas width > 1000, got ${landing.canvasW}`);
  assert(landing.emblemW > 0, 'Expected Doan emblem naturalWidth > 0');
  assert(landing.startVisible, 'Expected #btn-start visible');
  assert(landing.beatImgs.length === 5, 'Expected 5 landing beat cards');
  EXPECTED_V2_FILENAMES.forEach((fname, idx) => {
    assert(
      landing.beatImgs[idx]?.includes(fname),
      `Landing beat ${idx + 1} expected ${fname}, got ${landing.beatImgs[idx]}`
    );
  });
  assert(landing.debugCount === 0, `Expected 0 debug elements, got ${landing.debugCount}`);
  assert(landing.audioCount === 0, `Expected 0 audio elements, got ${landing.audioCount}`);
  assert(landing.forbiddenHits.length === 0, `Forbidden 20/11 hits: ${landing.forbiddenHits.join(', ')}`);

  const landingShot = await saveShot(page, 'live_lhs_landing.png');
  console.log(`  PASS Landing verified (${landing.title}) -> ${landingShot}`);

  await page.click('#btn-start');
  await waitForStage(page, 1);

  for (let stage = 1; stage <= 5; stage++) {
    if (stage > 1) {
      await page.click('#btn-next');
      await waitForStage(page, stage);
    }
    const expectedFilename = EXPECTED_V2_FILENAMES[stage - 1];
    const p = await page.evaluate((forbidden) => {
      const img = document.getElementById('poster-stage-img');
      const dl = document.getElementById('btn-download-poster');
      const policyPanel = document.getElementById('panel-policy-highlights');
      const rect = img.getBoundingClientRect();
      const cs = window.getComputedStyle(img);
      const text = document.body.innerText || '';
      return {
        src: img.getAttribute('src') || '',
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        objectFit: cs.objectFit,
        downloadAttr: dl?.getAttribute('download') || '',
        policyVisible: policyPanel ? !policyPanel.hidden && policyPanel.offsetParent !== null : false,
        policyText: policyPanel?.innerText || '',
        rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
        debugCount: document.querySelectorAll('[id*="vfx"], [id*="showcase"], [id*="debug"]').length,
        forbiddenHits: forbidden.filter((t) => text.toLowerCase().includes(t.toLowerCase())),
        badge: document.getElementById('stage-badge')?.textContent?.trim(),
      };
    }, FORBIDDEN_20_11);

    assert(p.src.includes(expectedFilename), `Stage ${stage} expected ${expectedFilename}, got ${p.src}`);
    assert(p.downloadAttr === expectedFilename, `Stage ${stage} download attr mismatch: ${p.downloadAttr}`);
    assert(p.complete && p.naturalWidth === 1080 && p.naturalHeight === 1350, `Poster 0${stage} dimensions invalid: ${p.naturalWidth}x${p.naturalHeight}`);
    assert(p.objectFit === 'contain', `Poster 0${stage} objectFit must be contain, got ${p.objectFit}`);
    assert(p.rect.left >= 0 && p.rect.top >= 0 && p.rect.right <= 1920.5 && p.rect.bottom <= 1080.5, `Poster 0${stage} clipped outside viewport`);
    assert(p.debugCount === 0, `Debug elements found on stage ${stage}`);
    assert(p.forbiddenHits.length === 0, `Forbidden 20/11 strings on stage ${stage}: ${p.forbiddenHits.join(', ')}`);

    if (stage === 3) {
      assert(p.policyVisible, 'Stage 3 #panel-policy-highlights must be visible automatically');
      for (const tok of ['2030', '2045', '30%', '80%', '50%', 'TOP 30', 'MỤC TIÊU', 'TẦM NHÌN', 'KHÔNG PHẢI KẾT QUẢ HIỆN TẠI']) {
        assert(p.policyText.includes(tok), `Stage 3 policy panel missing "${tok}"`);
      }
      const s3Shot = await saveShot(page, 'live_lhs_scene_03.png');
      console.log(`  PASS Stage 3 2030/2045 highlights verified -> ${s3Shot}`);
    }

    console.log(`  PASS Poster ${p.badge} (${expectedFilename}, 1080x1350, contain, zero clipping)`);

    if (stage === 5) {
      const s5Shot = await saveShot(page, 'live_lhs_scene_05.png');
      console.log(`  Saved Scene 05 live screenshot -> ${s5Shot}`);
    }
  }

  // Test Sources Modal via KeyI on live site
  await page.keyboard.press('KeyI');
  await page.waitForSelector('#sources-modal:not([hidden])', { timeout: 5000 });
  const sourcesOk = await page.evaluate(() => {
    const body = document.getElementById('sources-modal-body');
    const txt = body?.innerText || '';
    const html = body?.innerHTML || '';
    return {
      pillars: document.querySelectorAll('#sources-modal-body .sources-pillar-card').length,
      tasks: document.querySelectorAll('#sources-modal-body .sources-task-item').length,
      qas: document.querySelectorAll('#sources-modal-body .sources-qa-card').length,
      hasChinhPhu: html.includes('xaydungchinhsach.chinhphu.vn'),
      hasMst: html.includes('mst.gov.vn'),
      has03: txt.includes('03/NQ-CP'),
      has71: txt.includes('71/NQ-CP'),
    };
  });
  assert(sourcesOk.pillars === 4 && sourcesOk.tasks === 7 && sourcesOk.qas === 5, 'Live Sources modal missing 4 pillars / 7 tasks / 5 Q&As');
  assert(sourcesOk.hasChinhPhu && sourcesOk.hasMst && sourcesOk.has03 && sourcesOk.has71, 'Live Sources modal missing official citations');
  await page.keyboard.press('Escape');
  await page.waitForSelector('#sources-modal[hidden]', { state: 'attached', timeout: 5000 });
  console.log('  PASS Live Sources Modal (4 pillars, 7 tasks, 5 Q&As, chinhphu.vn/mst.gov.vn/03/71)');

  await page.click('#btn-next');
  await waitForStage(page, 6);

  const finale = await page.evaluate((forbidden) => {
    const thumbs = Array.from(document.querySelectorAll('#finale-gallery .finale-thumb-card img'));
    const qrSvg = document.querySelector('#finale-qr-box svg');
    const link = document.getElementById('btn-finale-official')?.getAttribute('href') || '';
    const mirror = document.getElementById('btn-finale-secondary-official')?.getAttribute('href') || '';
    const text = document.body.innerText || '';
    return {
      present: document.getElementById('stage-finale')?.classList.contains('present'),
      thumbCount: thumbs.length,
      thumbsOk: thumbs.every((i) => i.complete && i.naturalWidth === 1080 && i.naturalHeight === 1350),
      hasQr: Boolean(qrSvg && qrSvg.getBoundingClientRect().width > 40),
      link,
      mirror,
      debugCount: document.querySelectorAll('[id*="vfx"], [id*="showcase"], [id*="debug"]').length,
      audioCount: document.querySelectorAll('audio').length,
      forbiddenHits: forbidden.filter((t) => text.toLowerCase().includes(t.toLowerCase())),
    };
  }, FORBIDDEN_20_11);

  assert(finale.present, 'Stage 6 Finale must be present');
  assert(finale.thumbCount === 5 && finale.thumbsOk, 'All 5 Finale thumbnails must load at 1080x1350');
  assert(finale.hasQr, 'Finale QR SVG must render');
  assert(finale.link.includes('xaydungchinhsach.chinhphu.vn'), `Expected chinhphu.vn primary link, got ${finale.link}`);
  assert(finale.mirror.includes('mst.gov.vn'), `Expected mst.gov.vn secondary link, got ${finale.mirror}`);
  assert(finale.debugCount === 0 && finale.audioCount === 0, 'Finale purity check failed');
  assert(finale.forbiddenHits.length === 0, `Forbidden 20/11 strings on Finale: ${finale.forbiddenHits.join(', ')}`);

  const finaleShot = await saveShot(page, 'live_lhs_finale.png');
  console.log(`  PASS Finale verified (QR SVG + chinhphu.vn + mst.gov.vn + 5 thumbs) -> ${finaleShot}`);

  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join(' | ')}`);
  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join(' | ')}`);
  assert(failedRequests.length === 0, `Failed requests: ${failedRequests.join(' | ')}`);
  assert(httpErrors.length === 0, `HTTP errors: ${httpErrors.join(' | ')}`);

  await context.close();
}

async function verifyOldSite(browser) {
  console.log(`\n=== Verifying OLD Restored Site: ${OLD_URL} ===`);
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await context.newPage();

  const resp = await page.goto(OLD_URL, { waitUntil: 'networkidle', timeout: 45000 });
  assert(resp && resp.status() === 200, `Expected HTTP 200 for ${OLD_URL}, got ${resp?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);

  const oldState = await page.evaluate(() => {
    const posterImg = document.getElementById('landing-full-poster-img');
    const bodyText = document.body.innerText || '';
    return {
      title: document.title,
      hasLandingPage: Boolean(document.getElementById('landing-page')),
      has2011Text: bodyText.includes('20/11') || bodyText.includes('NÉT VẼ TRI ÂN'),
      hasLacHongText: bodyText.includes('LẠC HỒNG SỐ') || bodyText.includes('Nghị quyết 57'),
      posterComplete: Boolean(posterImg && posterImg.complete && posterImg.naturalWidth > 0),
      posterW: posterImg?.naturalWidth || 0,
      posterH: posterImg?.naturalHeight || 0,
    };
  });

  assert(oldState.hasLandingPage, 'Old site #landing-page missing');
  assert(oldState.has2011Text, 'Old site missing Nét vẽ tri ân / 20/11 copy');
  assert(!oldState.hasLacHongText, 'Old site appears overwritten with Lạc Hồng Số / NQ57!');
  assert(oldState.posterComplete, `Old site poster image not loaded (${oldState.posterW}x${oldState.posterH})`);

  const oldShot = await saveShot(page, 'live_old_net_ve_tri_an.png');
  console.log(
    `  PASS Old site intact (${oldState.title}, poster ${oldState.posterW}x${oldState.posterH}) -> ${oldShot}`
  );

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  try {
    await verifyNewSite(browser);
    await verifyOldSite(browser);
    console.log('\nALL LIVE CHECKS PASSED FOR BOTH SITES.');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('\nLIVE VERIFICATION FAILED:', err);
  process.exit(1);
});
