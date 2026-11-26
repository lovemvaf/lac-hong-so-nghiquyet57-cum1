/**
 * LẠC HỒNG SỐ — Pure Canvas 2D Atmospheric Heritage Backdrop
 * Per-scene heritage personality strictly behind text & posters:
 *  - Stage 0/1: opening concentric Đông Sơn arcs + soft warm paper motes
 *  - Stage 2: warm human-centered radial aurora rings around hero focal point
 *  - Stage 3: steady dignified 2030->2045 horizon glow + graceful outer Chim Lạc orbit toward upper sunrise
 *  - Stage 4: lively outer-corridor community Chim Lạc flocks (4-7s soft -> medium -> soft -> grand cadence)
 *  - Stage 5/6: warm ascending sunrise aura + grand calm Chim Lạc glide
 */

const STAGE4_CADENCE = [
  { tier: 'soft', interval: 4.4, count: 4, scaleMul: 0.82, speedMul: 0.92, alphaMul: 0.78 },
  { tier: 'medium', interval: 5.3, count: 5, scaleMul: 0.96, speedMul: 1.0, alphaMul: 0.88 },
  { tier: 'soft', interval: 4.6, count: 4, scaleMul: 0.86, speedMul: 0.95, alphaMul: 0.8 },
  { tier: 'grand', interval: 6.4, count: 6, scaleMul: 1.08, speedMul: 1.04, alphaMul: 0.96 },
];

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
  let flockTimer = 4.4;
  let stage4CadenceIndex = 0;

  const auraState = {
    xRatio: 0.5,
    yRatio: 0.46,
    targetXRatio: 0.5,
    targetYRatio: 0.46,
    strength: 0.16,
    targetStrength: 0.16,
    ringPresence: 0.15,
    targetRingPresence: 0.15,
    horizonGlow: 0.08,
    targetHorizonGlow: 0.08,
    sunriseMix: 0.1,
    targetSunriseMix: 0.1,
    orbitOpacity: 0,
    targetOrbitOpacity: 0,
  };

  const MOTES_COUNT = 36;
  const motes = Array.from({ length: MOTES_COUNT }, (_, idx) => ({
    x: ((idx * 197) % 1000) / 1000,
    y: ((idx * 353) % 1000) / 1000,
    radius: 0.95 + (idx % 4) * 0.52,
    speedY: 0.0075 + (idx % 5) * 0.0032,
    phase: idx * 0.85,
    alpha: 0.16 + (idx % 5) * 0.07,
    warmCream: idx % 3 === 0,
  }));

  const flocks = [];

  function updateStageTarget(stage) {
    currentStage = stage;
    const isDesktop = width > 1024;
    const focalX = isDesktop ? 0.34 : 0.5;
    const focalY = isDesktop ? 0.47 : 0.36;

    if (stage === 0) {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.46;
      auraState.targetStrength = 0.16;
      auraState.targetRingPresence = 0.22;
      auraState.targetHorizonGlow = 0.08;
      auraState.targetSunriseMix = 0.1;
      auraState.targetOrbitOpacity = 0;
    } else if (stage === 1) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.18;
      auraState.targetRingPresence = 0.28;
      auraState.targetHorizonGlow = 0.08;
      auraState.targetSunriseMix = 0.14;
      auraState.targetOrbitOpacity = 0;
    } else if (stage === 2) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.21;
      auraState.targetRingPresence = 0.95;
      auraState.targetHorizonGlow = 0.12;
      auraState.targetSunriseMix = 0.22;
      auraState.targetOrbitOpacity = 0;
    } else if (stage === 3) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = isDesktop ? 0.48 : 0.38;
      auraState.targetStrength = 0.17;
      auraState.targetRingPresence = 0.16;
      auraState.targetHorizonGlow = 0.95;
      auraState.targetSunriseMix = 0.65;
      auraState.targetOrbitOpacity = 1;
    } else if (stage === 4) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = focalY;
      auraState.targetStrength = 0.19;
      auraState.targetRingPresence = 0.32;
      auraState.targetHorizonGlow = 0.32;
      auraState.targetSunriseMix = 0.34;
      auraState.targetOrbitOpacity = 0;
    } else if (stage === 5) {
      auraState.targetXRatio = focalX;
      auraState.targetYRatio = isDesktop ? 0.44 : 0.36;
      auraState.targetStrength = 0.22;
      auraState.targetRingPresence = 0.34;
      auraState.targetHorizonGlow = 0.72;
      auraState.targetSunriseMix = 0.95;
      auraState.targetOrbitOpacity = 0;
    } else {
      auraState.targetXRatio = 0.5;
      auraState.targetYRatio = 0.45;
      auraState.targetStrength = 0.24;
      auraState.targetRingPresence = 0.38;
      auraState.targetHorizonGlow = 0.82;
      auraState.targetSunriseMix = 1.0;
      auraState.targetOrbitOpacity = 0;
    }
  }

  function snapAuraState() {
    auraState.xRatio = auraState.targetXRatio;
    auraState.yRatio = auraState.targetYRatio;
    auraState.strength = auraState.targetStrength;
    auraState.ringPresence = auraState.targetRingPresence;
    auraState.horizonGlow = auraState.targetHorizonGlow;
    auraState.sunriseMix = auraState.targetSunriseMix;
    auraState.orbitOpacity = auraState.targetOrbitOpacity;
  }

  function stepAuraInterpolation() {
    const rate = 0.08;
    auraState.xRatio += (auraState.targetXRatio - auraState.xRatio) * rate;
    auraState.yRatio += (auraState.targetYRatio - auraState.yRatio) * rate;
    auraState.strength += (auraState.targetStrength - auraState.strength) * rate;
    auraState.ringPresence += (auraState.targetRingPresence - auraState.ringPresence) * rate;
    auraState.horizonGlow += (auraState.targetHorizonGlow - auraState.horizonGlow) * rate;
    auraState.sunriseMix += (auraState.targetSunriseMix - auraState.sunriseMix) * rate;
    auraState.orbitOpacity += (auraState.targetOrbitOpacity - auraState.orbitOpacity) * rate;
  }

  function getNextFlockProfile() {
    if (currentStage === 4) {
      const profile = STAGE4_CADENCE[stage4CadenceIndex % STAGE4_CADENCE.length];
      stage4CadenceIndex = (stage4CadenceIndex + 1) % STAGE4_CADENCE.length;
      return profile;
    }
    if (currentStage >= 5) {
      return {
        tier: 'grand-calm',
        interval: 6.2,
        count: 5 + (Math.random() > 0.5 ? 1 : 0),
        scaleMul: 1.04,
        speedMul: 0.82,
        alphaMul: 0.88,
      };
    }
    return {
      tier: 'soft',
      interval: 6.0,
      count: 4,
      scaleMul: 0.86,
      speedMul: 0.9,
      alphaMul: 0.72,
    };
  }

  function spawnChimLacFlock(profile) {
    if (flocks.length >= 2) return;
    const goRight = Math.random() > 0.3;
    // Strictly routed along upper-sky corridor (4.5%..13.5% viewport height)
    const baseY = height * (0.048 + Math.random() * 0.082);
    const startX = goRight ? -120 : width + 120;
    const baseSpeed = (goRight ? 1 : -1) * (54 + Math.random() * 18) * profile.speedMul;
    const verticalDrift = (Math.random() - 0.5) * 6;

    const birds = [];
    for (let i = 0; i < profile.count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const row = Math.ceil(i / 2);
      birds.push({
        offsetX: (goRight ? -1 : 1) * row * (32 + Math.random() * 8),
        offsetY: side * row * (13 + Math.random() * 5) + (i === 0 ? 0 : 2),
        scale: (0.72 + (1 - Math.min(row, 3) * 0.12) * 0.34) * profile.scaleMul,
        wingPhase: i * 0.72 + Math.random() * 0.45,
        wingSpeed: 2.9 + Math.random() * 0.55,
      });
    }

    flocks.push({
      x: startX,
      y: baseY,
      vx: baseSpeed,
      vy: verticalDrift,
      dir: goRight ? 1 : -1,
      alphaMul: profile.alphaMul,
      life: 0,
      maxLife: (width + 280) / Math.abs(baseSpeed),
      birds,
    });
  }

  function drawChimLacBird(x, y, scale, dir, wingPhase, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir * scale, scale);
    ctx.globalAlpha = alpha;

    const flap = Math.sin(wingPhase) * 7.2;
    const trailWing = Math.cos(wingPhase * 0.9) * 4.2;

    ctx.strokeStyle = 'rgba(247, 243, 232, 0.92)';
    ctx.fillStyle = 'rgba(240, 193, 75, 0.88)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineWidth = 1.85;
    ctx.beginPath();
    ctx.moveTo(-14, 1.5);
    ctx.quadraticCurveTo(-2, -1, 12, -2.5);
    ctx.lineTo(19, -4.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.quadraticCurveTo(-1, -13 - flap, 10, -16 - flap * 0.9);
    ctx.quadraticCurveTo(3, -8 - flap * 0.5, 4, -1);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.72;
    ctx.beginPath();
    ctx.moveTo(-7, 1);
    ctx.quadraticCurveTo(-10, -7 - trailWing, -2, -11 - trailWing * 0.8);
    ctx.quadraticCurveTo(-4, -4, -1, 0);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-13, 1.5);
    ctx.lineTo(-22, 4.5);
    ctx.moveTo(-12, 2);
    ctx.lineTo(-19, 6.2);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.restore();
  }

  function drawDongSonOuterArcs(t) {
    const cx = width * 0.5;
    const cy = height * 0.52;
    const outerRadius = Math.max(width, height) * 0.48;
    const baseAngle = liteMode ? 0.2 : t * 0.016;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(baseAngle);

    const ringAlpha = currentStage === 6 ? 0.115 : currentStage <= 1 ? 0.095 : 0.07;
    ctx.strokeStyle = `rgba(240, 193, 75, ${ringAlpha})`;
    ctx.lineWidth = 1.1;

    for (let rIdx = 0; rIdx < 3; rIdx++) {
      const r = outerRadius * (0.76 + rIdx * 0.1);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.strokeStyle = `rgba(247, 243, 232, ${ringAlpha * 0.82})`;
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

  function drawHumanAuroraRings(t, ax, ay) {
    if (auraState.ringPresence < 0.05) return;
    const baseR = Math.min(width, height) * 0.18;
    const pulse = liteMode ? 0 : Math.sin(t * 0.65) * 6;

    ctx.save();
    for (let i = 0; i < 3; i++) {
      const r = baseR * (1 + i * 0.48) + pulse * (i + 1) * 0.35;
      const alpha = auraState.ringPresence * (0.11 - i * 0.024);
      ctx.beginPath();
      ctx.arc(ax, ay, r, 0, Math.PI * 2);
      ctx.strokeStyle =
        i % 2 === 0
          ? `rgba(240, 193, 75, ${alpha.toFixed(3)})`
          : `rgba(247, 243, 232, ${(alpha * 0.78).toFixed(3)})`;
      ctx.lineWidth = i === 0 ? 1.5 : 1.1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHorizonAndSunrise(t) {
    if (auraState.horizonGlow > 0.04) {
      const horizonY = height * 0.76;
      const bandGrad = ctx.createLinearGradient(0, horizonY - height * 0.24, 0, height);
      bandGrad.addColorStop(0, 'rgba(240, 193, 75, 0)');
      bandGrad.addColorStop(0.55, `rgba(240, 193, 75, ${(0.075 * auraState.horizonGlow).toFixed(3)})`);
      bandGrad.addColorStop(1, `rgba(247, 243, 232, ${(0.055 * auraState.horizonGlow).toFixed(3)})`);
      ctx.fillStyle = bandGrad;
      ctx.fillRect(0, horizonY - height * 0.24, width, height);
    }

    if (auraState.sunriseMix > 0.05) {
      const sx = currentStage === 3 ? width * 0.86 : width * 0.5;
      const sy = currentStage === 3 ? height * 0.16 : height * 0.24;
      const sr = Math.max(width, height) * (currentStage === 3 ? 0.34 : 0.44);
      const breathe = liteMode ? 1 : 1 + Math.sin(t * 0.45) * 0.025;
      const sunGrad = ctx.createRadialGradient(sx, sy, 6, sx, sy, sr * breathe);
      sunGrad.addColorStop(0, `rgba(240, 193, 75, ${(0.16 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(0.45, `rgba(247, 243, 232, ${(0.065 * auraState.sunriseMix).toFixed(3)})`);
      sunGrad.addColorStop(1, 'rgba(13, 43, 82, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  function drawOuterSunriseOrbitCranes(t) {
    if (auraState.orbitOpacity < 0.05) return;
    // Steady, dignified outer Chim Lạc orbit toward upper-right sunrise (zero clutter over data)
    const cx = width * 0.88;
    const cy = height * 0.17;
    const rx = Math.min(width * 0.14, 170);
    const ry = Math.min(height * 0.08, 72);

    ctx.save();
    for (let i = 0; i < 3; i++) {
      const phase = liteMode ? 0.6 + i * 0.5 : t * 0.22 + i * 0.65;
      const theta = -Math.PI * 0.85 + ((Math.sin(phase * 0.5) + 1) * 0.38) + i * 0.24;
      const bx = cx - Math.cos(theta) * rx;
      const by = cy + Math.sin(theta) * ry - i * 10;
      const wing = liteMode ? 0.4 : t * 2.4 + i * 0.9;
      const alpha = auraState.orbitOpacity * (0.64 - i * 0.12);
      drawChimLacBird(bx, by, 0.72 - i * 0.08, 1, wing, alpha);
    }
    ctx.restore();
  }

  function renderFrame(t) {
    if (!liteMode) {
      stepAuraInterpolation();
    }

    // 1. Deep #0D2B52 -> #1464B4 twilight-youth gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width * 0.35, height);
    bgGrad.addColorStop(0, '#091B36');
    bgGrad.addColorStop(0.48, '#0D2B52');
    bgGrad.addColorStop(1, '#1464B4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Soft museum aura behind active focal region
    const ax = width * auraState.xRatio;
    const ay = height * auraState.yRatio;
    const auraRadius = Math.max(width, height) * 0.46;
    const auraGrad = ctx.createRadialGradient(ax, ay, 10, ax, ay, auraRadius);
    auraGrad.addColorStop(0, `rgba(247, 243, 232, ${auraState.strength.toFixed(3)})`);
    auraGrad.addColorStop(0.42, `rgba(240, 193, 75, ${(auraState.strength * 0.42).toFixed(3)})`);
    auraGrad.addColorStop(1, 'rgba(13, 43, 82, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Stage-aware horizon glow / ascending sunrise aura
    drawHorizonAndSunrise(t);

    // 4. Warm human-centered radial aurora rings (Stage 2 spotlight, subtle elsewhere)
    drawHumanAuroraRings(t, ax, ay);

    // 5. Slowly turning faint Đông Sơn outer arc highlights
    drawDongSonOuterArcs(t);

    // 6. Stage 3 outer Chim Lạc orbit toward upper sunrise
    drawOuterSunriseOrbitCranes(t);

    // 7. Soft warm paper & gold motes
    const moteBoost = currentStage <= 1 ? 1.15 : 0.9;
    for (let i = 0; i < motes.length; i++) {
      const m = motes[i];
      const yPos = liteMode
        ? m.y * height
        : (((m.y - t * m.speedY) % 1) + 1) % 1 * height;
      const sway = liteMode ? 0 : Math.sin(t * 0.72 + m.phase) * 12;
      const xPos = m.x * width + sway;
      const twinkle = liteMode ? 1 : 0.65 + 0.35 * Math.sin(t * 1.35 + m.phase);
      const a = Math.min(0.42, m.alpha * twinkle * moteBoost);

      ctx.beginPath();
      ctx.arc(xPos, yPos, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = m.warmCream
        ? `rgba(247, 243, 232, ${a.toFixed(3)})`
        : `rgba(240, 193, 75, ${a.toFixed(3)})`;
      ctx.fill();
    }

    // 8. Outer-corridor Chim Lạc flocks (paused completely in Lite Mode)
    if (!liteMode) {
      for (let fIdx = flocks.length - 1; fIdx >= 0; fIdx--) {
        const flock = flocks[fIdx];
        const fadeIn = Math.min(1, flock.life / 1.1);
        const fadeOut = Math.min(1, Math.max(0, (flock.maxLife - flock.life) / 1.2));
        const baseAlpha = 0.72 * flock.alphaMul * Math.min(fadeIn, fadeOut);

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

    // Stage 3 stays steady & dignified without cluttering sky flocks; other stages cycle cleanly
    if (currentStage !== 3) {
      flockTimer += dt;
      const nextProfile = getNextFlockProfile();
      if (flockTimer >= nextProfile.interval) {
        flockTimer = 0;
        spawnChimLacFlock(nextProfile);
      }
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
    if (liteMode) {
      snapAuraState();
    }
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
    snapAuraState();
    renderFrame(0);
  } else {
    startLoop();
  }

  return {
    setStage(stage) {
      updateStageTarget(stage);
      if (liteMode) {
        snapAuraState();
        renderFrame(elapsed);
      } else if (stage === 4) {
        // Begin fresh rhythmic soft -> medium -> soft -> grand cadence on Stage 4
        stage4CadenceIndex = 0;
        flockTimer = 3.8;
      } else if (stage >= 5 && flocks.length === 0) {
        // Gentle celebratory Chim Lạc flight when arriving at Finale/Lan tỏa
        flockTimer = 5.4;
      } else if (stage === 3) {
        flocks.length = 0;
      }
    },
    setLiteMode(enabled) {
      liteMode = Boolean(enabled);
      if (liteMode) {
        stopLoop();
        flocks.length = 0;
        snapAuraState();
        renderFrame(elapsed);
      } else {
        flockTimer = 4.4;
        startLoop();
      }
    },
    destroy() {
      stopLoop();
      window.removeEventListener('resize', resize);
    },
  };
}
