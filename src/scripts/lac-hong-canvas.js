/**
 * LẠC HỒNG SỐ — Pure Canvas 2D Atmospheric Heritage Backdrop
 * Renders deep #0D2B52 -> #1464B4 twilight-youth gradient, subtle warm cream/gold aura,
 * slowly turning faint Đông Sơn outer arc highlights, ambient golden light motes,
 * and periodic graceful Chim Lạc / Hạc bird flocks routed strictly along outer/upper corridors.
 */

export function createLacHongCanvas(canvas) {
  if (!canvas || !canvas.getContext) {
    return {
      setStage: () => {},
      setLiteMode: () => {},
      destroy: () => {},
    };
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  let currentStage = 0;
  let liteMode = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  let rafId = null;
  let lastTs = 0;
  let elapsed = 0;
  let flockTimer = 4.6; // Initial flock appears gently ~1.2s after load

  // Aura interpolation for smooth stage shifts
  const auraState = {
    xRatio: 0.5,
    yRatio: 0.48,
    targetXRatio: 0.5,
    targetYRatio: 0.48,
    strength: 0.14,
    targetStrength: 0.14,
  };

  // Ambient golden light motes
  const MOTES_COUNT = 34;
  const motes = Array.from({ length: MOTES_COUNT }, (_, idx) => ({
    x: ((idx * 197) % 1000) / 1000,
    y: ((idx * 353) % 1000) / 1000,
    radius: 0.9 + (idx % 4) * 0.55,
    speedY: 0.008 + (idx % 5) * 0.0035,
    phase: idx * 0.85,
    alpha: 0.16 + (idx % 5) * 0.08,
  }));

  // Active Chim Lạc flocks (each flock = 4..6 cranes gliding across upper/outer safe corridors)
  const flocks = [];

  function updateStageTarget(stage) {
    currentStage = stage;
    const isDesktop = width > 1024;
    if (stage === 0) {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.46;
      auraState.targetStrength = 0.16;
    } else if (stage >= 1 && stage <= 5) {
      auraState.targetXRatio = isDesktop ? 0.34 : 0.5;
      auraState.targetYRatio = isDesktop ? 0.47 : 0.36;
      auraState.targetStrength = 0.19;
    } else {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.22;
    }
  }

  function spawnChimLacFlock() {
    if (flocks.length >= 2) return;
    const count = 4 + Math.floor(Math.random() * 3); // 4..6 birds
    const goRight = Math.random() > 0.35;
    // Keep strictly in upper-sky corridor (4%..16% viewport height) or outer upper corner arc
    // so flocks never cross over center poster or Finale QR code.
    const baseY = height * (0.055 + Math.random() * 0.085);
    const startX = goRight ? -110 : width + 110;
    const baseSpeed = (goRight ? 1 : -1) * (58 + Math.random() * 24);
    const verticalDrift = (Math.random() - 0.5) * 8;

    const birds = [];
    for (let i = 0; i < count; i++) {
      const rank = i;
      const side = i % 2 === 0 ? 1 : -1;
      const row = Math.ceil(i / 2);
      birds.push({
        offsetX: (goRight ? -1 : 1) * row * (32 + Math.random() * 8),
        offsetY: side * row * (13 + Math.random() * 5) + (rank === 0 ? 0 : 2),
        scale: 0.72 + (1 - Math.min(row, 3) * 0.12) * 0.36,
        wingPhase: i * 0.75 + Math.random() * 0.5,
        wingSpeed: 3.1 + Math.random() * 0.6,
      });
    }

    flocks.push({
      x: startX,
      y: baseY,
      vx: baseSpeed,
      vy: verticalDrift,
      dir: goRight ? 1 : -1,
      life: 0,
      maxLife: (width + 260) / Math.abs(baseSpeed),
      birds,
    });
  }

  function drawChimLacBird(x, y, scale, dir, wingPhase, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * scale, scale);
    ctx.globalAlpha = alpha;

    const flap = Math.sin(wingPhase) * 7.5;
    const trailWing = Math.cos(wingPhase * 0.9) * 4.5;

    // Slender golden-cream body & elongated neck/beak
    ctx.strokeStyle = 'rgba(247, 243, 232, 0.92)';
    ctx.fillStyle = 'rgba(240, 193, 75, 0.88)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Body line + head + beak
    ctx.lineWidth = 1.9;
    ctx.beginPath();
    ctx.moveTo(-14, 1.5);
    ctx.quadraticCurveTo(-2, -1, 12, -2.5);
    ctx.lineTo(19, -4.5);
    ctx.stroke();

    // Swept upper wing
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(-1, -13 - flap, 10, -16 - flap * 0.9);
    ctx.quadraticCurveTo(3, -8 - flap * 0.5, 4, -1);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Secondary rear wing silhouette
    ctx.globalAlpha = alpha * 0.72;
    ctx.beginPath();
    ctx.moveTo(-7, 1);
    ctx.quadraticCurveTo(-10, -7 - trailWing, -2, -11 - trailWing * 0.8);
    ctx.quadraticCurveTo(-4, -4, -1, 0);
    ctx.closePath();
    ctx.fill();

    // Tail crest stream
    ctx.beginPath();
    ctx.moveTo(-13, 1.5);
    ctx.lineTo(-22, 4.5);
    ctx.moveTo(-12, 2);
    ctx.lineTo(-19, 6.2);
    ctx.lineWidth = 1.25;
    ctx.stroke();

    ctx.restore();
  }

  function drawDongSonOuterArcs(t) {
    const cx = width * 0.5;
    const cy = height * 0.52;
    const outerRadius = Math.max(width, height) * 0.48;
    const baseAngle = liteMode ? 0.2 : t * 0.018;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(baseAngle);

    // Subtle concentric gold arc rings along outer framing
    const ringAlpha = currentStage === 6 ? 0.11 : 0.075;
    ctx.strokeStyle = `rgba(240, 193, 75, ${ringAlpha})`;
    ctx.lineWidth = 1.1;

    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const r = outerRadius * (0.76 + rIdx * 0.1);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 16 subtle radial solar tick marks on the outer arc
    ctx.strokeStyle = `rgba(247, 243, 232, ${ringAlpha * 0.85})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rIn = outerRadius * 0.84;
      const rOut = outerRadius * 0.88;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
      ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderFrame(t) {
    // Smoothly interpolate aura position
    auraState.xRatio += (auraState.targetXRatio - auraState.xRatio) * 0.08;
    auraState.yRatio += (auraState.targetYRatio - auraState.yRatio) * 0.08;
    auraState.strength += (auraState.targetStrength - auraState.strength) * 0.08;

    // 1. Deep #0D2B52 -> #1464B4 atmospheric twilight-youth gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.35, height);
    bgGrad.addColorStop(0, '#091B36');
    bgGrad.addColorStop(0.48, '#0D2B52');
    bgGrad.addColorStop(1, '#1464B4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Soft warm cream & gold museum aura behind active focal area
    const ax = width * auraState.xRatio;
    const ay = height * auraState.yRatio;
    const auraRadius = Math.max(width, height) * 0.46;
    const auraGrad = ctx.createRadialGradient(ax, ay, 10, ax, ay, auraRadius);
    auraGrad.addColorStop(0, `rgba(247, 243, 232, ${auraState.strength})`);
    auraGrad.addColorStop(0.42, `rgba(240, 193, 75, ${auraState.strength * 0.42})`);
    auraGrad.addColorStop(1, 'rgba(13, 43, 82, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Slowly turning faint Đông Sơn outer arc highlights
    drawDongSonOuterArcs(t);

    // 4. Ambient golden star/light motes
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      const yPos = liteMode
        ? m.y * height
        : ((m.y - t * m.speedY) % 1 + 1) % 1 * height;
      const sway = liteMode ? 0 : Math.sin(t * 0.75 + m.phase) * 14;
      const xPos = m.x * width + sway;
      const twinkle = liteMode ? 1 : 0.65 + 0.35 * Math.sin(t * 1.4 + m.phase);

      ctx.beginPath();
      ctx.arc(xPos, yPos, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 193, 75, ${(m.alpha * twinkle).toFixed(3)})`;
      ctx.fill();
    }

    // 5. Periodic graceful Chim Lạc / Hạc bird flocks (paused completely in Lite Mode)
    if (!liteMode) {
      for (let fIdx = flocks.length - 1; fIdx >= 0; fIdx--) {
        const flock = flocks[fIdx];
        const fadeIn = Math.min(1, flock.life / 1.1);
        const fadeOut = Math.min(1, Math.max(0, (flock.maxLife - flock.life) / 1.2));
        const baseAlpha = 0.72 * Math.min(fadeIn, fadeOut);

        if (baseAlpha > 0.01) {
          for (let b = 0; b < flock.birds.length; b++) {
            const bird = flock.birds[b];
            const bx = flock.x + bird.offsetX;
            const by = flock.y + bird.offsetY + Math.sin(t * 1.1 + b) * 3;
            drawChimLacBird(
              bx,
              by,
              bird.scale,
              flock.dir,
              bird.wingPhase + flock.life * bird.wingSpeed,
              baseAlpha
            );
          }
        }

        if (flock.life >= flock.maxLife) {
          flocks.splice(fIdx, 1);
        }
      }
    }
  }

  function tick(ts) {
    if (liteMode) {
      rafId = null;
      return;
    }
    if (!lastTs) lastTs = ts;
    const dt = Math.min((ts - lastTs) / 1000, 0.08);
    lastTs = ts;
    elapsed += dt;

    flockTimer += dt;
    const interval = currentStage === 0 || currentStage === 6 ? 5.6 : 6.5;
    if (flockTimer >= interval) {
      flockTimer = 0;
      spawnChimLacFlock();
    }

    for (let i = 0; i < flocks.length; i++) {
      const f = flocks[i];
      f.life += dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
    }

    renderFrame(elapsed);
    rafId = window.requestAnimationFrame(tick);
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    updateStageTarget(currentStage);
    renderFrame(elapsed);
  }

  function startLoop() {
    if (liteMode || rafId !== null) return;
    lastTs = 0;
    rafId = window.requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('resize', resize);
  resize();

  if (liteMode) {
    renderFrame(0);
  } else {
    startLoop();
  }

  return {
    setStage(stage) {
      updateStageTarget(stage);
      if (liteMode) {
        auraState.xRatio = auraState.targetXRatio;
        auraState.yRatio = auraState.targetYRatio;
        auraState.strength = auraState.targetStrength;
        renderFrame(elapsed);
      } else if (stage === 6 && flocks.length === 0) {
        // Gentle celebratory Chim Lạc flight when arriving at Finale
        flockTimer = 5.2;
      }
    },
    setLiteMode(enabled) {
      liteMode = Boolean(enabled);
      if (liteMode) {
        stopLoop();
        flocks.length = 0;
        auraState.xRatio = auraState.targetXRatio;
        auraState.yRatio = auraState.targetYRatio;
        auraState.strength = auraState.targetStrength;
        renderFrame(elapsed);
      } else {
        flockTimer = 4.6;
        startLoop();
      }
    },
    destroy() {
      stopLoop();
      window.removeEventListener('resize', resize);
    },
  };
}
