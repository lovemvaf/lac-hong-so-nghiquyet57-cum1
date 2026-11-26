/**
 * LẠC HỒNG SỐ — GSAP Stage Transition & Editorial Choreography Controller
 * Smooth 0.55–0.85s stage cuts alternating Light Sweep veil, Chim Lạc flight pass,
 * Đông Sơn radial ripple pulse, and soft parallax (1 clean cue per cut, zero strobing,
 * leaving every poster 100% still after settling).
 */

import gsap from 'gsap';

export function createMotionController() {
  let liteMode = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let transitionTimeline = null;
  let transitionResolve = null;
  let stageTimeline = null;

  function pickTransitionCue(fromStage, toStage) {
    if (fromStage === 0 && toStage === 1) return 'dongson-ripple';
    if (fromStage === 5 && toStage === 6) return 'finale-bloom';
    if (toStage === 3 || (fromStage === 3 && toStage === 2)) return 'chimlac-flight';
    if (toStage === 5) return 'dongson-ripple';
    if (toStage === 4) return 'soft-parallax';
    return 'light-sweep';
  }

  function resetTransitionLayers() {
    const overlay = document.getElementById('scene-transition-overlay');
    const veil = document.getElementById('transition-veil');
    const sweep = document.getElementById('transition-light-sweep');
    const ripple = document.getElementById('transition-dongson-ripple');
    const flight = document.getElementById('transition-chimlac-flight');

    if (overlay) gsap.set(overlay, { autoAlpha: 0 });
    if (veil) gsap.set(veil, { autoAlpha: 0 });
    if (sweep) gsap.set(sweep, { autoAlpha: 0, xPercent: -45 });
    if (ripple) gsap.set(ripple, { autoAlpha: 0, scale: 0.72 });
    if (flight) gsap.set(flight, { autoAlpha: 0, xPercent: -24, yPercent: 10 });
  }

  function playStageTransition(fromStage, toStage, onMidpoint) {
    if (transitionTimeline) {
      transitionTimeline.kill();
      transitionTimeline = null;
    }
    if (transitionResolve) {
      const prevResolve = transitionResolve;
      transitionResolve = null;
      prevResolve('interrupted');
    }

    const overlay = document.getElementById('scene-transition-overlay');
    const veil = document.getElementById('transition-veil');
    const sweep = document.getElementById('transition-light-sweep');
    const ripple = document.getElementById('transition-dongson-ripple');
    const flight = document.getElementById('transition-chimlac-flight');

    if (liteMode || !overlay || fromStage === toStage) {
      if (typeof onMidpoint === 'function') onMidpoint();
      resetTransitionLayers();
      return Promise.resolve('instant');
    }

    const cue = pickTransitionCue(fromStage, toStage);
    overlay.setAttribute('data-cue', cue);
    resetTransitionLayers();

    let midpointFired = false;
    const triggerMidpoint = () => {
      if (!midpointFired) {
        midpointFired = true;
        if (typeof onMidpoint === 'function') onMidpoint();
      }
    };

    return new Promise((resolve) => {
      transitionResolve = resolve;
      const tl = gsap.timeline({
        onComplete: () => {
          triggerMidpoint();
          resetTransitionLayers();
          if (transitionTimeline === tl) transitionTimeline = null;
          if (transitionResolve === resolve) transitionResolve = null;
          resolve('completed');
        },
      });
      transitionTimeline = tl;

      gsap.set(overlay, { autoAlpha: 1 });

      if (cue === 'dongson-ripple') {
        tl.to(veil, { autoAlpha: 0.36, duration: 0.24, ease: 'power2.out' }, 0)
          .fromTo(
            ripple,
            { autoAlpha: 0.62, scale: 0.74 },
            { autoAlpha: 0, scale: 1.24, duration: 0.72, ease: 'power2.out' },
            0.02
          )
          .call(triggerMidpoint, null, 0.22)
          .to(veil, { autoAlpha: 0, duration: 0.42, ease: 'power2.out' }, 0.28);
      } else if (cue === 'chimlac-flight') {
        tl.to(veil, { autoAlpha: 0.3, duration: 0.22, ease: 'power2.out' }, 0)
          .fromTo(
            flight,
            { autoAlpha: 0, xPercent: -24, yPercent: 12 },
            { autoAlpha: 0.9, xPercent: 16, yPercent: -10, duration: 0.42, ease: 'power2.out' },
            0.04
          )
          .call(triggerMidpoint, null, 0.22)
          .to(flight, { autoAlpha: 0, xPercent: 48, yPercent: -24, duration: 0.36, ease: 'power2.in' }, 0.42)
          .to(veil, { autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, 0.32);
      } else if (cue === 'finale-bloom') {
        tl.to(veil, { autoAlpha: 0.46, duration: 0.28, ease: 'power2.out' }, 0)
          .fromTo(
            ripple,
            { autoAlpha: 0.65, scale: 0.8 },
            { autoAlpha: 0, scale: 1.32, duration: 0.78, ease: 'power2.out' },
            0.04
          )
          .fromTo(
            flight,
            { autoAlpha: 0, xPercent: -18, yPercent: 10 },
            { autoAlpha: 0.85, xPercent: 34, yPercent: -18, duration: 0.74, ease: 'power2.out' },
            0.08
          )
          .call(triggerMidpoint, null, 0.28)
          .to(veil, { autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, 0.34);
      } else if (cue === 'soft-parallax') {
        const panel = document.querySelector('#stage-poster .editorial-panel');
        tl.to(veil, { autoAlpha: 0.28, duration: 0.2, ease: 'power2.out' }, 0)
          .fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -40 },
            { autoAlpha: 0.55, xPercent: 12, duration: 0.36, ease: 'power2.out' },
            0.02
          )
          .call(triggerMidpoint, null, 0.2)
          .to(sweep, { autoAlpha: 0, xPercent: 52, duration: 0.34, ease: 'power2.in' }, 0.34)
          .to(veil, { autoAlpha: 0, duration: 0.36, ease: 'power2.out' }, 0.26);
        if (panel) {
          tl.fromTo(panel, { x: 16 }, { x: 0, duration: 0.44, ease: 'power3.out' }, 0.22);
        }
      } else {
        // light-sweep default
        tl.to(veil, { autoAlpha: 0.28, duration: 0.2, ease: 'power2.out' }, 0)
          .fromTo(
            sweep,
            { autoAlpha: 0, xPercent: -44 },
            { autoAlpha: 0.6, xPercent: 44, duration: 0.62, ease: 'power2.inOut' },
            0.02
          )
          .call(triggerMidpoint, null, 0.22)
          .to(veil, { autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 0.28);
      }
    });
  }

  function animateStageEntrance(stage) {
    if (stageTimeline) {
      stageTimeline.kill();
      stageTimeline = null;
    }

    if (liteMode) {
      return;
    }

    const tl = gsap.timeline();
    stageTimeline = tl;

    if (stage === 0) {
      const card = document.querySelector('#stage-landing .landing-card');
      const items = document.querySelectorAll(
        '#stage-landing .landing-crest-row, #stage-landing .landing-title, #stage-landing .landing-subtitle, #stage-landing .landing-tagline, #stage-landing .landing-intro, #stage-landing .beat-card, #stage-landing .landing-actions'
      );
      if (card) {
        tl.fromTo(card, { autoAlpha: 0.6, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' }, 0);
      }
      if (items.length) {
        tl.fromTo(
          items,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.045, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.05
        );
      }
    } else if (stage >= 1 && stage <= 5) {
      const posterFrame = document.querySelector('#stage-poster .poster-frame-btn');
      const panelItems = document.querySelectorAll(
        '#stage-poster .panel-story-head, #stage-poster .panel-summary, #stage-poster .motif-card, #stage-poster .speaker-cue-panel, #stage-poster .panel-official-wrap'
      );
      const keyword = document.querySelector('#stage-poster .keyword-highlight');

      // Poster fades in gently and remains 100% still afterwards
      if (posterFrame) {
        tl.fromTo(
          posterFrame,
          { autoAlpha: 0.4, scale: 0.988 },
          { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0
        );
      }

      if (panelItems.length) {
        tl.fromTo(
          panelItems,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.05, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.04
        );
      }

      if (keyword) {
        tl.fromTo(
          keyword,
          { backgroundColor: 'rgba(240, 193, 75, 0.0)' },
          { backgroundColor: 'rgba(240, 193, 75, 0.24)', duration: 0.45, ease: 'power2.out' },
          0.26
        );
      }
    } else if (stage === 6) {
      const finaleItems = document.querySelectorAll(
        '#stage-finale .finale-badge, #stage-finale .finale-heading, #stage-finale .finale-summary, #stage-finale .finale-thumb-card, #stage-finale .finale-action-panel, #stage-finale .finale-credits'
      );
      if (finaleItems.length) {
        tl.fromTo(
          finaleItems,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
          0.04
        );
      }
    }
  }

  return {
    playStageTransition,
    animateStageEntrance,
    setLiteMode(enabled) {
      liteMode = Boolean(enabled);
      if (liteMode) {
        if (transitionTimeline) {
          transitionTimeline.progress(1).kill();
          transitionTimeline = null;
        }
        if (stageTimeline) {
          stageTimeline.progress(1).kill();
          stageTimeline = null;
        }
        resetTransitionLayers();
      }
    },
  };
}
