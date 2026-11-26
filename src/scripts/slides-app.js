import Reveal from 'reveal.js';
import QRCode from 'qrcode';
import {
  CLAIM_TYPE_LABELS,
  CONCEPT_NOTICE,
  EMBLEM_ASSET,
  EVALUATION_QUESTIONS,
  FINALE_DATA,
  LANDING_DATA,
  MOTIF_SVGS,
  OFFICIAL_RESOLUTION_URL,
  POSTERS,
  RELATED_IMPLEMENTATION_DOCS,
  SECONDARY_OFFICIAL_URL,
  SEVEN_TASKS_GROUPED,
  SHARED_COPY,
  STAGE_PILLS,
  getPosterByStage,
  getStageMeta,
} from '../content/lac-hong-data.js';
import { createLacHongCanvas } from './lac-hong-canvas.js';
import { createMotionController } from './motion-controller.js';

/**
 * Generates crisp inline SVG artwork of the Đông Sơn bronze drum:
 * 16-ray solar center star, concentric tangent-circle & tick fret rings,
 * and a stylized 8-bird Chim Lạc orbital band.
 */
function buildDongSonDrumMarkup() {
  const cx = 400;
  const cy = 400;
  const parts = [];

  const rings = [
    { r: 54, stroke: '#F0C14B', width: 2.2, opacity: 0.9 },
    { r: 142, stroke: '#F0C14B', width: 2.0, opacity: 0.78 },
    { r: 164, stroke: '#1464B4', width: 1.6, opacity: 0.75, dash: '5 6' },
    { r: 186, stroke: '#F0C14B', width: 1.8, opacity: 0.72 },
    { r: 236, stroke: '#F0C14B', width: 1.6, opacity: 0.7 },
    { r: 254, stroke: '#1464B4', width: 1.5, opacity: 0.68, dash: '3 5' },
    { r: 322, stroke: '#F0C14B', width: 2.0, opacity: 0.78 },
    { r: 344, stroke: '#1464B4', width: 1.6, opacity: 0.72, dash: '6 5' },
    { r: 368, stroke: '#F0C14B', width: 1.8, opacity: 0.72 },
    { r: 386, stroke: '#F0C14B', width: 1.2, opacity: 0.45 },
  ];

  rings.forEach((ring) => {
    const dashAttr = ring.dash ? ` stroke-dasharray="${ring.dash}"` : '';
    parts.push(
      `<circle cx="${cx}" cy="${cy}" r="${ring.r}" stroke="${ring.stroke}" stroke-width="${ring.width}" opacity="${ring.opacity}"${dashAttr} />`
    );
  });

  const rays = 16;
  const rInner = 56;
  const rTip = 136;
  const rValley = 84;
  let starPath = '';
  for (let i = 0; i < rays; i++) {
    const aTip = (i / rays) * Math.PI * 2 - Math.PI / 2;
    const aLeft = ((i - 0.34) / rays) * Math.PI * 2 - Math.PI / 2;
    const aRight = ((i + 0.34) / rays) * Math.PI * 2 - Math.PI / 2;
    const aMid = ((i + 0.5) / rays) * Math.PI * 2 - Math.PI / 2;

    const xL = (cx + Math.cos(aLeft) * rInner).toFixed(2);
    const yL = (cy + Math.sin(aLeft) * rInner).toFixed(2);
    const xT = (cx + Math.cos(aTip) * rTip).toFixed(2);
    const yT = (cy + Math.sin(aTip) * rTip).toFixed(2);
    const xR = (cx + Math.cos(aRight) * rInner).toFixed(2);
    const yR = (cy + Math.sin(aRight) * rInner).toFixed(2);

    starPath += `M${xL} ${yL} L${xT} ${yT} L${xR} ${yR} Z `;

    const xW = (cx + Math.cos(aMid) * (rTip - 18)).toFixed(2);
    const yW = (cy + Math.sin(aMid) * (rTip - 18)).toFixed(2);
    const xV1 = (cx + Math.cos(aMid - 0.08) * rValley).toFixed(2);
    const yV1 = (cy + Math.sin(aMid - 0.08) * rValley).toFixed(2);
    const xV2 = (cx + Math.cos(aMid + 0.08) * rValley).toFixed(2);
    const yV2 = (cy + Math.sin(aMid + 0.08) * rValley).toFixed(2);
    parts.push(
      `<polygon points="${xW},${yW} ${xV1},${yV1} ${xV2},${yV2}" fill="#1464B4" fill-opacity="0.32" stroke="#F0C14B" stroke-width="1" />`
    );
  }
  parts.push(`<path d="${starPath}" fill="#F0C14B" fill-opacity="0.45" stroke="#F0C14B" stroke-width="1.5" />`);
  parts.push(`<circle cx="${cx}" cy="${cy}" r="30" fill="#F0C14B" fill-opacity="0.28" stroke="#F0C14B" stroke-width="1.8" />`);

  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const r1 = 194;
    const r2 = i % 2 === 0 ? 228 : 214;
    const x1 = (cx + Math.cos(a) * r1).toFixed(2);
    const y1 = (cy + Math.sin(a) * r1).toFixed(2);
    const x2 = (cx + Math.cos(a) * r2).toFixed(2);
    const y2 = (cy + Math.sin(a) * r2).toFixed(2);
    parts.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#F0C14B" stroke-width="1.15" opacity="0.58" />`
    );
  }

  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x = (cx + Math.cos(a) * 356).toFixed(2);
    const y = (cy + Math.sin(a) * 356).toFixed(2);
    parts.push(
      `<circle cx="${x}" cy="${y}" r="5.5" stroke="#F0C14B" stroke-width="1.2" opacity="0.65" />` +
        `<circle cx="${x}" cy="${y}" r="1.8" fill="#1464B4" opacity="0.7" />`
    );
  }

  for (let i = 0; i < 8; i++) {
    const deg = i * 45;
    parts.push(`
      <g transform="rotate(${deg} ${cx} ${cy})">
        <path d="M 372 115 L 402 104 L 424 111 L 404 117 L 434 123 L 402 124 L 376 130 Z"
          fill="#F0C14B" fill-opacity="0.46" stroke="#F0C14B" stroke-width="1.4" stroke-linejoin="round" />
        <path d="M 388 115 C 392 94, 412 88, 424 98 C 412 98, 404 104, 396 113 Z"
          fill="#F0C14B" fill-opacity="0.56" stroke="#F0C14B" stroke-width="1.3" />
        <line x1="364" y1="117" x2="376" y2="116" stroke="#F0C14B" stroke-width="1.6" stroke-linecap="round" />
      </g>
    `);
  }

  return parts.join('');
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderSummaryWithHighlight(summaryText, keyword) {
  if (!keyword || !summaryText.includes(keyword)) {
    return escapeHtml(summaryText);
  }
  const idx = summaryText.indexOf(keyword);
  const before = escapeHtml(summaryText.slice(0, idx));
  const match = escapeHtml(summaryText.slice(idx, idx + keyword.length));
  const after = escapeHtml(summaryText.slice(idx + keyword.length));
  return `${before}<mark class="keyword-highlight">${match}</mark>${after}`;
}

function renderPolicyHighlightsMarkup(poster) {
  const targets2030 = poster.targets2030 || [];
  const vision2045 = poster.vision2045 || [];
  const bannerLabel =
    poster.microNote || 'MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57-NQ/TW (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)';

  return `
    <div class="policy-disclaimer-banner">
      <span class="policy-disclaimer-dot" aria-hidden="true"></span>
      <span>${escapeHtml(bannerLabel)}</span>
    </div>
    <div class="policy-cards-grid">
      <div class="policy-subcard policy-subcard-2030">
        <div class="policy-subcard-head">
          <span class="policy-subcard-title">MỤC TIÊU ĐẾN NĂM 2030</span>
          <span class="policy-section-ref">Mục II.1</span>
        </div>
        <ul class="policy-kpi-list">
          ${targets2030
            .map(
              (item) => `
            <li class="policy-kpi-row">
              <strong class="policy-kpi-metric">${escapeHtml(item.metric)}</strong>
              <span class="policy-kpi-label">${escapeHtml(item.label)}</span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
      <div class="policy-subcard policy-subcard-2045">
        <div class="policy-subcard-head">
          <span class="policy-subcard-title">TẦM NHÌN ĐẾN NĂM 2045</span>
          <span class="policy-section-ref">Mục II.2</span>
        </div>
        <ul class="policy-kpi-list">
          ${vision2045
            .map(
              (item) => `
            <li class="policy-kpi-row">
              <strong class="policy-kpi-metric">${escapeHtml(item.metric)}</strong>
              <span class="policy-kpi-label">${escapeHtml(item.label)}</span>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderFactChipsMarkup(poster) {
  const facts = poster.displayFacts || [];
  if (!facts.length) return '';

  const isActionMode = poster.stage === 4;
  const heading = isActionMode
    ? '5 đề xuất phần việc thanh niên Cụm 1'
    : '4 điểm định hướng cốt lõi (Mục I NQ57)';

  return `
    <div class="fact-chips-head">
      <span class="fact-chips-title">${escapeHtml(heading)}</span>
      <span class="fact-chips-note">${escapeHtml(isActionMode ? 'Đề xuất Cụm 1' : 'Văn kiện 57-NQ/TW')}</span>
    </div>
    <div class="fact-chips-grid${isActionMode ? ' fact-chips-grid-5' : ''}">
      ${facts
        .map((fact) => {
          const badgeTitle = fact.badgeTitle || fact.label || '';
          const summaryText = fact.shortLabel || fact.summary || '';
          const claimLabel = CLAIM_TYPE_LABELS[fact.claimType] || 'Thông tin đối chiếu';
          const claimClass = `claim-tag claim-tag-${escapeHtml(fact.claimType || 'policy_fact')}`;
          return `
            <div class="fact-chip-card">
              <div class="fact-chip-top">
                <strong class="fact-chip-badge">${escapeHtml(badgeTitle)}</strong>
                <span class="${claimClass}">${escapeHtml(claimLabel)}</span>
              </div>
              <p class="fact-chip-desc">${escapeHtml(summaryText)}</p>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function buildSourcesModalMarkup() {
  const tasksHtml = SEVEN_TASKS_GROUPED.map(
    (pillar, idx) => `
      <div class="sources-pillar-card">
        <div class="sources-pillar-head">
          <span class="sources-pillar-num">Trụ ${idx + 1}/4</span>
          <h5 class="sources-pillar-title">${escapeHtml(pillar.pillarTitle)}</h5>
        </div>
        <ul class="sources-task-list">
          ${pillar.tasks
            .map(
              (task) => `
            <li class="sources-task-item">
              <div class="sources-task-top">
                <span class="sources-task-badge">Nhiệm vụ ${task.taskNumber}</span>
                <span class="sources-task-ref">${escapeHtml(task.nq57Section)}</span>
              </div>
              <p class="sources-task-text">${escapeHtml(task.nq57TitleVerbatim)}</p>
              ${
                task.reconciliationNote
                  ? `<p class="sources-task-note">${escapeHtml(task.reconciliationNote)}</p>`
                  : ''
              }
            </li>`
            )
            .join('')}
        </ul>
      </div>
    `
  ).join('');

  const questionsHtml = EVALUATION_QUESTIONS.map((q) => {
    const claimLabel = CLAIM_TYPE_LABELS[q.claimType] || 'Đối chiếu NQ57';
    return `
      <div class="sources-qa-card">
        <div class="sources-qa-head">
          <span class="sources-qa-num">Câu ${q.id}/5 · ${escapeHtml(q.mappedPosterId)}</span>
          <span class="claim-tag claim-tag-${escapeHtml(q.claimType)}">${escapeHtml(claimLabel)}</span>
        </div>
        <h5 class="sources-qa-question">${escapeHtml(q.question)}</h5>
        <p class="sources-qa-answer">${escapeHtml(q.answerSummary)}</p>
        <p class="sources-qa-ref">Đối chiếu: ${escapeHtml(q.nq57Anchor)} · ${escapeHtml(q.excelRef)}</p>
      </div>
    `;
  }).join('');

  const relatedHtml = RELATED_IMPLEMENTATION_DOCS.map(
    (doc) => `
      <div class="sources-doc-item">
        <div class="sources-doc-meta">
          <strong>${escapeHtml(doc.code)}</strong>
          <span>${escapeHtml(doc.issuedBy)} · ${escapeHtml(doc.issuedDate)}</span>
        </div>
        <p class="sources-doc-title">${escapeHtml(doc.title)}</p>
        <p class="sources-doc-note">${escapeHtml(doc.separationNote)}</p>
        <a class="sources-ext-link" href="${escapeHtml(doc.url)}" target="_blank" rel="noopener noreferrer">
          Mở văn bản ${escapeHtml(doc.code)} ↗
        </a>
      </div>
    `
  ).join('');

  return `
    <section class="sources-section" aria-labelledby="sec-seven-tasks">
      <div class="sources-section-head">
        <h4 id="sec-seven-tasks">1. 7 nhóm nhiệm vụ &amp; giải pháp trọng tâm (4 trụ · Mục III NQ57)</h4>
      </div>
      <div class="sources-pillars-grid">${tasksHtml}</div>
    </section>

    <section class="sources-section" aria-labelledby="sec-five-questions">
      <div class="sources-section-head">
        <h4 id="sec-five-questions">2. 5 câu hỏi đánh giá nội dung (Sheet THUYẾT TRÌNH)</h4>
      </div>
      <div class="sources-qa-grid">${questionsHtml}</div>
    </section>

    <section class="sources-section" aria-labelledby="sec-official-links">
      <div class="sources-section-head">
        <h4 id="sec-official-links">3. Nguồn chính thống &amp; Ghi chú minh bạch</h4>
      </div>
      <div class="sources-links-box">
        <div class="sources-primary-links">
          <a class="btn-official-cta" href="${escapeHtml(OFFICIAL_RESOLUTION_URL)}" target="_blank" rel="noopener noreferrer">
            <span>Nguồn chính (Primary): Toàn văn NQ 57-NQ/TW · xaydungchinhsach.chinhphu.vn</span>
            <span aria-hidden="true">↗</span>
          </a>
          <a class="btn-official-secondary" href="${escapeHtml(SECONDARY_OFFICIAL_URL)}" target="_blank" rel="noopener noreferrer">
            <span>Bản đối chiếu (Mirror): Bộ Khoa học &amp; Công nghệ · mst.gov.vn</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="sources-concept-notice">
          <strong>Lưu ý minh bạch tên gọi &amp; khẩu hiệu nhóm:</strong>
          <p>${escapeHtml(CONCEPT_NOTICE)}</p>
          <p class="sources-status-note">${escapeHtml(FINALE_DATA.teamMetadataNotice || '')}</p>
          <p class="sources-status-note">${escapeHtml(SHARED_COPY.aiDisclosureWeb)}</p>
        </div>

        <div class="sources-related-docs">
          <h5>Văn bản triển khai cấp Chính phủ (tách biệt khỏi lời văn gốc 57-NQ/TW):</h5>
          ${relatedHtml}
        </div>
      </div>
    </section>
  `;
}

function syncStaticViewsFromJson() {
  // Landing copy & beat cards bound from campaign-content.json
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === 'string') el.textContent = value;
  };
  const setHref = (id, url) => {
    const el = document.getElementById(id);
    if (el && url) el.setAttribute('href', url);
  };

  setText('landing-eyebrow', LANDING_DATA.eyebrow);
  setText('landing-badge', LANDING_DATA.badge);
  setText('landing-title', LANDING_DATA.conceptTitle);
  setText('landing-subtitle', LANDING_DATA.seriesTitle);
  setText('landing-tagline-text', LANDING_DATA.tagline);
  setText('landing-intro', LANDING_DATA.introSummary);
  setText('btn-start-label', LANDING_DATA.startButtonLabel);
  setText('landing-source-line', SHARED_COPY.sourceLine);
  setText('landing-ai-disclosure', LANDING_DATA.aiDisclosure);
  setText('panel-org-label', SHARED_COPY.panelBadge);

  const landingEmblem = document.getElementById('landing-emblem-img');
  if (landingEmblem) {
    landingEmblem.src = EMBLEM_ASSET.src;
    landingEmblem.alt = EMBLEM_ASSET.alt;
  }

  document.querySelectorAll('#landing-beats .beat-card').forEach((card) => {
    const stage = Number(card.getAttribute('data-jump-stage'));
    const poster = getPosterByStage(stage);
    if (!poster) return;
    const img = card.querySelector('img');
    const num = card.querySelector('.beat-num');
    const label = card.querySelector('.beat-label');
    if (img) {
      img.src = poster.posterPath;
      img.alt = `Ấn phẩm ${poster.index} – ${poster.title}`;
    }
    if (num) num.textContent = poster.index;
    if (label) label.textContent = poster.role;
  });

  // Finale copy, thumbnails & URLs bound from campaign-content.json
  setText('finale-badge', FINALE_DATA.eyebrow);
  setText('finale-heading', FINALE_DATA.heading);
  setText('finale-summary', FINALE_DATA.summary);
  setText('btn-finale-official-label', FINALE_DATA.officialButtonLabel);
  setText('finale-source-credit', FINALE_DATA.sourceCredit);
  setText('finale-ai-disclosure', FINALE_DATA.aiDisclosure);
  setHref('btn-finale-official', FINALE_DATA.officialUrl);
  setHref('btn-finale-secondary-official', FINALE_DATA.secondaryOfficialUrl);
  setHref('btn-official-link', OFFICIAL_RESOLUTION_URL);
  setHref('btn-official-mirror', SECONDARY_OFFICIAL_URL);

  document.querySelectorAll('#finale-gallery .finale-thumb-card').forEach((card) => {
    const stage = Number(card.getAttribute('data-zoom-poster'));
    const poster = getPosterByStage(stage);
    if (!poster) return;
    const img = card.querySelector('img');
    const idx = card.querySelector('.finale-thumb-idx');
    const role = card.querySelector('.finale-thumb-role');
    if (img) {
      img.src = poster.posterPath;
      img.alt = `Ấn phẩm ${poster.index} – ${poster.title}`;
    }
    if (idx) idx.textContent = poster.index;
    if (role) role.textContent = poster.role;
  });
}

export async function initLacHongApp() {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  const state = {
    stage: 0, // 0 = Landing, 1..5 = Posters 01..05, 6 = Finale
    isLiteMode: prefersReduced,
    isNotesOpen: false,
    isLightboxOpen: false,
    isSourcesOpen: false,
    lightboxPosterId: 1,
    isTransitioning: false,
  };

  if (state.isLiteMode) {
    document.body.classList.add('lite-mode');
  }

  // 0. Hydrate Landing, Finale, and default links from Single Source of Truth JSON
  syncStaticViewsFromJson();

  // 1. Mount Đông Sơn drum SVG backdrops
  const drumMarkup = buildDongSonDrumMarkup();
  const landingDrum = document.getElementById('landing-dong-son-svg');
  const finaleDrum = document.getElementById('finale-dong-son-svg');
  if (landingDrum) landingDrum.innerHTML = drumMarkup;
  if (finaleDrum) finaleDrum.innerHTML = drumMarkup;

  // 2. Render real QR SVG for Finale encoding FINALE_DATA.officialUrl (xaydungchinhsach.chinhphu.vn)
  const qrBox = document.getElementById('finale-qr-box');
  if (qrBox) {
    try {
      const qrSvg = await QRCode.toString(FINALE_DATA.officialUrl, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 2,
        color: {
          dark: '#0D2B52',
          light: '#FFFFFF',
        },
      });
      qrBox.innerHTML = qrSvg;
    } catch (err) {
      console.error('QR generation error:', err);
    }
  }

  // 3. Populate non-blocking Sources, 7 Tasks & 5 Questions Modal
  const sourcesModalBody = document.getElementById('sources-modal-body');
  if (sourcesModalBody) {
    sourcesModalBody.innerHTML = buildSourcesModalMarkup();
  }

  // 4. Preload all 5 posters & emblem for instantaneous zero-flicker switching
  [EMBLEM_ASSET.src, ...POSTERS.map((p) => p.posterPath)].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // 5. Initialize Heritage Canvas & GSAP Motion Controller
  const canvasEl = document.getElementById('lac-hong-canvas');
  const heritageCanvas = createLacHongCanvas(canvasEl);
  const motion = createMotionController();
  heritageCanvas.setLiteMode(state.isLiteMode);
  motion.setLiteMode(state.isLiteMode);

  // 6. Initialize Reveal.js with layout & input delegated cleanly to our 7-stage controller
  const deck = new Reveal({
    disableLayout: true,
    scrollActivationWidth: null,
    controls: false,
    progress: false,
    keyboard: false,
    touch: false,
    overview: false,
    center: false,
    history: false,
    hash: false,
    transition: 'none',
    backgroundTransition: 'none',
  });
  await deck.initialize();
  window.Reveal = deck;

  // 7. Build Stage Pills navigation inside #stage-poster
  const stagePillsNav = document.getElementById('stage-pills-nav');
  if (stagePillsNav) {
    stagePillsNav.innerHTML = STAGE_PILLS.map(
      (pill) =>
        `<button type="button" class="stage-pill" data-stage-pill="${pill.stage}" aria-label="${escapeHtml(pill.fullLabel)}">${escapeHtml(pill.shortLabel)}</button>`
    ).join('');
    stagePillsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-stage-pill]');
      if (!btn) return;
      const target = Number(btn.getAttribute('data-stage-pill'));
      if (!Number.isNaN(target)) goToStage(target);
    });
  }

  // DOM References
  const posterStageImg = document.getElementById('poster-stage-img');
  const posterFilenameChip = document.getElementById('poster-filename-chip');
  const btnDownloadPoster = document.getElementById('btn-download-poster');
  const stageBadge = document.getElementById('stage-badge');
  const panelRole = document.getElementById('panel-role');
  const panelVideoChip = document.getElementById('panel-video-chip');
  const panelTitle = document.getElementById('panel-title');
  const panelSubtitle = document.getElementById('panel-subtitle');
  const panelMicroNote = document.getElementById('panel-micro-note');
  const panelSummary = document.getElementById('panel-summary');
  const panelPolicyHighlights = document.getElementById('panel-policy-highlights');
  const panelFactChips = document.getElementById('panel-fact-chips');
  const motifTitle = document.getElementById('motif-title');
  const motifArt = document.getElementById('motif-art');
  const motifPills = document.getElementById('motif-pills');
  const speakerCuePanel = document.getElementById('speaker-cue-panel');
  const speakerCueBody = document.getElementById('speaker-cue-body');
  const speakerCueText = document.getElementById('speaker-cue-text');
  const btnCueToggle = document.getElementById('btn-cue-toggle');
  const cueChevron = document.getElementById('cue-chevron');
  const panelOfficialWrap = document.getElementById('panel-official-wrap');
  const btnOfficialLink = document.getElementById('btn-official-link');
  const btnOfficialMirror = document.getElementById('btn-official-mirror');

  const speakerDrawer = document.getElementById('speaker-drawer');
  const speakerDrawerTitle = document.getElementById('speaker-drawer-title');
  const speakerDrawerText = document.getElementById('speaker-drawer-text');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const hudProgress = document.getElementById('hud-progress');
  const btnNotes = document.getElementById('btn-notes');
  const btnZoom = document.getElementById('btn-zoom');
  const btnHudSources = document.getElementById('btn-hud-sources');
  const btnRestart = document.getElementById('btn-restart');
  const btnLite = document.getElementById('btn-lite');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxIndex = document.getElementById('lightbox-index');
  const lightboxTitle = document.getElementById('lightbox-title');
  const btnLightboxDownload = document.getElementById('btn-lightbox-download');

  const sourcesModal = document.getElementById('sources-modal');

  function getRevealIndexForStage(stage) {
    if (stage === 0) return 0;
    if (stage >= 1 && stage <= 5) return 1;
    return 2;
  }

  function syncNotesUI() {
    const meta = getStageMeta(state.stage);
    if (btnNotes) {
      btnNotes.setAttribute('aria-pressed', String(state.isNotesOpen));
      btnNotes.classList.toggle('is-active', state.isNotesOpen);
    }

    if (state.stage >= 1 && state.stage <= 5) {
      if (speakerDrawer) speakerDrawer.hidden = true;
      if (speakerCuePanel) speakerCuePanel.classList.toggle('is-open', state.isNotesOpen);
      if (speakerCueBody) speakerCueBody.hidden = !state.isNotesOpen;
      if (btnCueToggle) btnCueToggle.setAttribute('aria-expanded', String(state.isNotesOpen));
      if (cueChevron) cueChevron.textContent = state.isNotesOpen ? '▴' : '▾';
    } else {
      if (speakerDrawer) {
        speakerDrawer.hidden = !state.isNotesOpen;
        if (speakerDrawerTitle) {
          speakerDrawerTitle.textContent = `Lời dẫn thuyết trình · ${meta.label}`;
        }
        if (speakerDrawerText) {
          speakerDrawerText.textContent = meta.speakerCue;
        }
      }
    }
  }

  function syncHudAndPills() {
    const meta = getStageMeta(state.stage);
    if (hudProgress) hudProgress.textContent = meta.label;
    if (btnPrev) btnPrev.disabled = state.stage <= 0;
    if (btnNext) btnNext.disabled = state.stage >= 6;

    if (btnLite) {
      btnLite.setAttribute('aria-pressed', String(state.isLiteMode));
      btnLite.classList.toggle('is-active', state.isLiteMode);
    }

    if (btnHudSources) {
      btnHudSources.setAttribute('aria-pressed', String(state.isSourcesOpen));
      btnHudSources.classList.toggle('is-active', state.isSourcesOpen);
    }

    document.querySelectorAll('[data-stage-pill]').forEach((el) => {
      const s = Number(el.getAttribute('data-stage-pill'));
      el.classList.toggle('is-active', s === state.stage);
      el.setAttribute('aria-current', s === state.stage ? 'step' : 'false');
    });

    syncNotesUI();
  }

  function renderPosterStage(stage) {
    const poster = getPosterByStage(stage);
    if (!poster) return;

    const sectionPoster = document.getElementById('stage-poster');
    if (sectionPoster) sectionPoster.setAttribute('data-stage', String(stage));

    if (posterStageImg) {
      posterStageImg.src = poster.posterPath;
      posterStageImg.alt = `Ấn phẩm ${poster.index} – ${poster.title}`;
    }
    if (posterFilenameChip) posterFilenameChip.textContent = poster.filename;
    if (btnDownloadPoster) {
      btnDownloadPoster.href = poster.posterPath;
      btnDownloadPoster.setAttribute('download', poster.filename);
    }
    if (stageBadge) stageBadge.textContent = poster.badgeLabel;
    if (panelRole) panelRole.textContent = poster.role;
    if (panelVideoChip) {
      if (poster.videoSegment) {
        panelVideoChip.textContent = `Video: ${poster.videoSegment}`;
        panelVideoChip.hidden = false;
      } else {
        panelVideoChip.textContent = '';
        panelVideoChip.hidden = true;
      }
    }
    if (panelTitle) panelTitle.textContent = poster.title;
    if (panelSubtitle) panelSubtitle.textContent = poster.subtitle;

    // On Stage 3, the disclaimer lives in #panel-policy-highlights so avoid repeating it twice
    if (panelMicroNote) {
      if (poster.microNote && stage !== 3) {
        panelMicroNote.textContent = poster.microNote;
        panelMicroNote.hidden = false;
      } else {
        panelMicroNote.textContent = '';
        panelMicroNote.hidden = true;
      }
    }

    if (panelSummary) {
      panelSummary.innerHTML = renderSummaryWithHighlight(
        poster.editorialSummary,
        poster.highlightKeyword
      );
    }

    // Stage 3 High-Contrast Policy Panel (automatically visible on Stage 3)
    if (panelPolicyHighlights) {
      if (stage === 3) {
        panelPolicyHighlights.innerHTML = renderPolicyHighlightsMarkup(poster);
        panelPolicyHighlights.hidden = false;
      } else {
        panelPolicyHighlights.innerHTML = '';
        panelPolicyHighlights.hidden = true;
      }
    }

    // Stages 2 & 4 Compact Verified Fact Chips
    if (panelFactChips) {
      if ((stage === 2 || stage === 4) && poster.displayFacts?.length) {
        panelFactChips.innerHTML = renderFactChipsMarkup(poster);
        panelFactChips.hidden = false;
      } else {
        panelFactChips.innerHTML = '';
        panelFactChips.hidden = true;
      }
    }

    if (motifTitle) motifTitle.textContent = poster.motifTitle;
    if (motifArt) motifArt.innerHTML = MOTIF_SVGS[poster.motifSvgKey] || '';
    if (motifPills) {
      motifPills.innerHTML = poster.domainPills
        .map((pill) => `<li class="motif-pill">${escapeHtml(pill)}</li>`)
        .join('');
    }

    if (speakerCueText) speakerCueText.textContent = poster.speakerCue;

    if (panelOfficialWrap && btnOfficialLink) {
      const showOfficial = Boolean(poster.hasQr && poster.qrTargetUrl);
      panelOfficialWrap.hidden = !showOfficial;
      if (showOfficial) {
        btnOfficialLink.href = poster.qrTargetUrl;
        if (btnOfficialMirror) btnOfficialMirror.href = SECONDARY_OFFICIAL_URL;
      }
    }
  }

  function applyStageState(targetStage) {
    state.stage = targetStage;
    const revealIdx = getRevealIndexForStage(targetStage);
    if (deck.getState().indexh !== revealIdx) {
      deck.slide(revealIdx);
    }

    if (targetStage >= 1 && targetStage <= 5) {
      renderPosterStage(targetStage);
    }

    heritageCanvas.setStage(targetStage);
    syncHudAndPills();

    if (window.innerWidth <= 1024) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  let activeTransitionSeq = 0;

  async function goToStage(rawTarget) {
    const targetStage = Math.max(0, Math.min(6, Number(rawTarget)));
    if (Number.isNaN(targetStage)) return;

    if (state.isLightboxOpen) {
      closeLightbox();
    }
    if (state.isSourcesOpen) {
      closeSourcesModal();
    }

    if (targetStage === state.stage && !state.isTransitioning) {
      syncHudAndPills();
      return;
    }

    const fromStage = state.stage;
    const seq = ++activeTransitionSeq;
    state.isTransitioning = true;

    await motion.playStageTransition(fromStage, targetStage, () => {
      if (seq !== activeTransitionSeq) return;
      applyStageState(targetStage);
      motion.animateStageEntrance(targetStage);
    });

    if (seq === activeTransitionSeq) {
      state.isTransitioning = false;
    }
  }

  function nextStage() {
    if (state.stage < 6) {
      return goToStage(state.stage + 1);
    }
    return Promise.resolve();
  }

  function prevStage() {
    if (state.stage > 0) {
      return goToStage(state.stage - 1);
    }
    return Promise.resolve();
  }

  function toggleLiteMode(forceValue) {
    state.isLiteMode = typeof forceValue === 'boolean' ? forceValue : !state.isLiteMode;
    document.body.classList.toggle('lite-mode', state.isLiteMode);
    heritageCanvas.setLiteMode(state.isLiteMode);
    motion.setLiteMode(state.isLiteMode);
    syncHudAndPills();
  }

  function toggleNotes(forceValue) {
    state.isNotesOpen = typeof forceValue === 'boolean' ? forceValue : !state.isNotesOpen;
    syncNotesUI();
  }

  function renderLightboxPoster(posterId) {
    const clamped = Math.max(1, Math.min(5, posterId));
    const poster = getPosterByStage(clamped) || POSTERS[0];
    state.lightboxPosterId = poster.id;
    if (lightboxImg) {
      lightboxImg.src = poster.posterPath;
      lightboxImg.alt = `Phóng to ấn phẩm ${poster.index} – ${poster.title}`;
    }
    if (lightboxIndex) lightboxIndex.textContent = poster.badgeLabel;
    if (lightboxTitle) lightboxTitle.textContent = poster.title;
    if (btnLightboxDownload) {
      btnLightboxDownload.href = poster.posterPath;
      btnLightboxDownload.setAttribute('download', poster.filename);
    }
  }

  function openLightbox(posterId) {
    if (state.isSourcesOpen) closeSourcesModal();
    const defaultId = state.stage >= 1 && state.stage <= 5 ? state.stage : 1;
    renderLightboxPoster(posterId || defaultId);
    state.isLightboxOpen = true;
    if (lightboxModal) {
      lightboxModal.hidden = false;
    }
    document.getElementById('btn-lightbox-close')?.focus();
  }

  function closeLightbox() {
    state.isLightboxOpen = false;
    if (lightboxModal) {
      lightboxModal.hidden = true;
    }
  }

  function openSourcesModal() {
    if (state.isLightboxOpen) closeLightbox();
    state.isSourcesOpen = true;
    if (sourcesModal) {
      sourcesModal.hidden = false;
    }
    syncHudAndPills();
    document.getElementById('btn-sources-close')?.focus();
  }

  function closeSourcesModal() {
    state.isSourcesOpen = false;
    if (sourcesModal) {
      sourcesModal.hidden = true;
    }
    syncHudAndPills();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Ignore fullscreen denial in restricted iframes / headless shells
    }
  }

  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    if (btnFullscreen) {
      btnFullscreen.setAttribute('aria-pressed', String(active));
      btnFullscreen.classList.toggle('is-active', active);
    }
  });

  // Wire UI Buttons
  document.getElementById('btn-start')?.addEventListener('click', () => goToStage(1));
  document.getElementById('btn-replay')?.addEventListener('click', () => goToStage(1));
  document.getElementById('btn-back-landing')?.addEventListener('click', () => goToStage(0));

  document.querySelectorAll('[data-jump-stage]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = Number(btn.getAttribute('data-jump-stage'));
      if (!Number.isNaN(target)) goToStage(target);
    });
  });

  document.querySelectorAll('[data-zoom-poster]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-zoom-poster'));
      openLightbox(id);
    });
  });

  document.querySelectorAll('[data-open-sources="true"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (state.isSourcesOpen) {
        closeSourcesModal();
      } else {
        openSourcesModal();
      }
    });
  });

  document.getElementById('poster-frame-btn')?.addEventListener('click', () => {
    openLightbox(state.stage >= 1 && state.stage <= 5 ? state.stage : 1);
  });
  document.getElementById('btn-inline-zoom')?.addEventListener('click', () => {
    openLightbox(state.stage >= 1 && state.stage <= 5 ? state.stage : 1);
  });

  btnPrev?.addEventListener('click', () => prevStage());
  btnNext?.addEventListener('click', () => nextStage());
  btnNotes?.addEventListener('click', () => toggleNotes());
  btnCueToggle?.addEventListener('click', () => toggleNotes());
  document.getElementById('btn-drawer-close')?.addEventListener('click', () => toggleNotes(false));
  btnZoom?.addEventListener('click', () => {
    if (state.isLightboxOpen) {
      closeLightbox();
    } else {
      openLightbox(state.stage >= 1 && state.stage <= 5 ? state.stage : 1);
    }
  });
  btnRestart?.addEventListener('click', () => goToStage(0));
  btnLite?.addEventListener('click', () => toggleLiteMode());
  btnFullscreen?.addEventListener('click', () => toggleFullscreen());

  // Lightbox Events
  document.getElementById('btn-lightbox-close')?.addEventListener('click', closeLightbox);
  document.getElementById('btn-lightbox-prev')?.addEventListener('click', () => {
    renderLightboxPoster(state.lightboxPosterId > 1 ? state.lightboxPosterId - 1 : 5);
  });
  document.getElementById('btn-lightbox-next')?.addEventListener('click', () => {
    renderLightboxPoster(state.lightboxPosterId < 5 ? state.lightboxPosterId + 1 : 1);
  });
  lightboxModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-lightbox') === 'true') {
      closeLightbox();
    }
  });

  // Sources Modal Events
  document.getElementById('btn-sources-close')?.addEventListener('click', closeSourcesModal);
  sourcesModal?.addEventListener('click', (e) => {
    if (e.target?.getAttribute?.('data-close-sources') === 'true') {
      closeSourcesModal();
    }
  });

  // Keyboard Controller
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Escape') {
      if (state.isSourcesOpen) {
        e.preventDefault();
        closeSourcesModal();
      } else if (state.isLightboxOpen) {
        e.preventDefault();
        closeLightbox();
      } else if (state.isNotesOpen && (state.stage === 0 || state.stage === 6)) {
        e.preventDefault();
        toggleNotes(false);
      }
      return;
    }

    if (e.code === 'KeyI') {
      e.preventDefault();
      if (state.isSourcesOpen) {
        closeSourcesModal();
      } else {
        openSourcesModal();
      }
      return;
    }

    if (e.code === 'KeyZ') {
      e.preventDefault();
      if (state.isLightboxOpen) {
        closeLightbox();
      } else {
        openLightbox(state.stage >= 1 && state.stage <= 5 ? state.stage : 1);
      }
      return;
    }

    if (state.isSourcesOpen) {
      return;
    }

    if (state.isLightboxOpen) {
      if (e.code === 'ArrowRight') {
        e.preventDefault();
        renderLightboxPoster(state.lightboxPosterId < 5 ? state.lightboxPosterId + 1 : 1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        renderLightboxPoster(state.lightboxPosterId > 1 ? state.lightboxPosterId - 1 : 5);
      }
      return;
    }

    switch (e.code) {
      case 'ArrowRight':
        e.preventDefault();
        nextStage();
        break;
      case 'Space':
        if (tag === 'BUTTON' || tag === 'A') return;
        e.preventDefault();
        nextStage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevStage();
        break;
      case 'Home':
      case 'KeyR':
        e.preventDefault();
        goToStage(0);
        break;
      case 'End':
        e.preventDefault();
        goToStage(6);
        break;
      case 'KeyN':
        e.preventDefault();
        toggleNotes();
        break;
      case 'KeyL':
        e.preventDefault();
        toggleLiteMode();
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      default:
        break;
    }
  });

  // Initial state mount on Stage 0 (Landing opens completely & strikingly immediately)
  applyStageState(0);
  motion.animateStageEntrance(0);

  // Lightweight programmatic API for tests (NOT a visible UI/debug overlay)
  window.__LHS_DECK__ = {
    getState: () => ({
      stage: state.stage,
      totalStages: 7,
      stageId: getStageMeta(state.stage).id,
      stageLabel: getStageMeta(state.stage).label,
      posterIndex: state.stage >= 1 && state.stage <= 5 ? getPosterByStage(state.stage)?.index : null,
      isLiteMode: state.isLiteMode,
      isNotesOpen: state.isNotesOpen,
      isLightboxOpen: state.isLightboxOpen,
      isSourcesOpen: state.isSourcesOpen,
      isTransitioning: state.isTransitioning,
    }),
    goToStage,
    nextStage,
    prevStage,
    openSourcesModal,
    closeSourcesModal,
  };
}
