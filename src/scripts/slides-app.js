import Reveal from 'reveal.js';
import QRCode from 'qrcode';
import {
  EMBLEM_ASSET,
  FINALE_DATA,
  LANDING_DATA,
  MOTIF_SVGS,
  OFFICIAL_RESOLUTION_URL,
  POSTERS,
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

  // Concentric rings
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

  // 16-ray solar center star + interleaved chevron wedges
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

    // Small chevron diamond between rays
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

  // Radial sawtooth ticks in inner fret ring (r=190..232)
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

  // Tangent circle-dots band (r=356)
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const x = (cx + Math.cos(a) * 356).toFixed(2);
    const y = (cy + Math.sin(a) * 356).toFixed(2);
    parts.push(
      `<circle cx="${x}" cy="${y}" r="5.5" stroke="#F0C14B" stroke-width="1.2" opacity="0.65" />` +
        `<circle cx="${x}" cy="${y}" r="1.8" fill="#1464B4" opacity="0.7" />`
    );
  }

  // Chim Lạc band (8 stylized bronze drum cranes orbiting counter-clockwise at r=288)
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
  return String(str)
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

export async function initLacHongApp() {
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  const state = {
    stage: 0, // 0 = Landing, 1..5 = Posters 01..05, 6 = Finale
    isLiteMode: prefersReduced,
    isNotesOpen: false,
    isLightboxOpen: false,
    lightboxPosterId: 1,
    isTransitioning: false,
  };

  if (state.isLiteMode) {
    document.body.classList.add('lite-mode');
  }

  // 1. Mount Đông Sơn drum SVG backdrops
  const drumMarkup = buildDongSonDrumMarkup();
  const landingDrum = document.getElementById('landing-dong-son-svg');
  const finaleDrum = document.getElementById('finale-dong-son-svg');
  if (landingDrum) landingDrum.innerHTML = drumMarkup;
  if (finaleDrum) finaleDrum.innerHTML = drumMarkup;

  // 2. Render real QR SVG for Finale using bundled `qrcode` package
  const qrBox = document.getElementById('finale-qr-box');
  if (qrBox) {
    try {
      const qrSvg = await QRCode.toString(OFFICIAL_RESOLUTION_URL, {
        type: 'svg',
        errorCorrectionLevel: 'H',
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

  // 3. Preload all 5 posters & emblem for instantaneous zero-flicker switching
  [EMBLEM_ASSET.src, ...POSTERS.map((p) => p.posterPath)].forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  // 4. Initialize Heritage Canvas & GSAP Motion Controller
  const canvasEl = document.getElementById('lac-hong-canvas');
  const heritageCanvas = createLacHongCanvas(canvasEl);
  const motion = createMotionController();
  heritageCanvas.setLiteMode(state.isLiteMode);
  motion.setLiteMode(state.isLiteMode);

  // 5. Initialize Reveal.js with layout & input delegated cleanly to our 7-stage controller
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

  // 6. Build Stage Pills navigation inside #stage-poster
  const stagePillsNav = document.getElementById('stage-pills-nav');
  if (stagePillsNav) {
    stagePillsNav.innerHTML = STAGE_PILLS.map(
      (pill) =>
        `<button type="button" class="stage-pill" data-stage-pill="${pill.stage}" aria-label="${pill.fullLabel}">${pill.shortLabel}</button>`
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
  const stageBadge = document.getElementById('stage-badge');
  const panelRole = document.getElementById('panel-role');
  const panelTitle = document.getElementById('panel-title');
  const panelSubtitle = document.getElementById('panel-subtitle');
  const panelMicroNote = document.getElementById('panel-micro-note');
  const panelSummary = document.getElementById('panel-summary');
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

  const speakerDrawer = document.getElementById('speaker-drawer');
  const speakerDrawerTitle = document.getElementById('speaker-drawer-title');
  const speakerDrawerText = document.getElementById('speaker-drawer-text');

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const hudProgress = document.getElementById('hud-progress');
  const btnNotes = document.getElementById('btn-notes');
  const btnZoom = document.getElementById('btn-zoom');
  const btnRestart = document.getElementById('btn-restart');
  const btnLite = document.getElementById('btn-lite');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxIndex = document.getElementById('lightbox-index');
  const lightboxTitle = document.getElementById('lightbox-title');

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
    if (stageBadge) stageBadge.textContent = poster.badgeLabel;
    if (panelRole) panelRole.textContent = poster.role;
    if (panelTitle) panelTitle.textContent = poster.title;
    if (panelSubtitle) panelSubtitle.textContent = poster.subtitle;

    if (panelMicroNote) {
      if (poster.microNote) {
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

    // Reset mobile scroll neatly to top when switching stages
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
  }

  function openLightbox(posterId) {
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

  // Keyboard Controller
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (e.code === 'Escape') {
      if (state.isLightboxOpen) {
        e.preventDefault();
        closeLightbox();
      } else if (state.isNotesOpen && (state.stage === 0 || state.stage === 6)) {
        e.preventDefault();
        toggleNotes(false);
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
      isTransitioning: state.isTransitioning,
    }),
    goToStage,
    nextStage,
    prevStage,
  };
}
