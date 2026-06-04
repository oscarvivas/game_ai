(() => {
  const GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing",
    PAUSED: "paused",
    VICTORY: "victory",
    GAMEOVER: "gameover"
  };

  const AI_MODE = {
    CALM: "CALM",
    PRESSURE: "PRESSURE",
    AGGRO: "AGGRO"
  };

  const TARGET_SCORE = 5000;
  const CANVAS_MARGIN = 70;

  const app = document.getElementById("app");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const scoreValue = document.getElementById("scoreValue");
  const timeValue = document.getElementById("timeValue");
  const livesValue = document.getElementById("livesValue");
  const multiplierValue = document.getElementById("multiplierValue");
  const aiModeValue = document.getElementById("aiModeValue");
  const targetValue = document.getElementById("targetValue");

  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlayTitle");
  const overlayMessage = document.getElementById("overlayMessage");
  const howToPlay = document.getElementById("howToPlay");
  const controlsHint = document.getElementById("controlsHint");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");

  const state = {
    gameState: GAME_STATE.MENU,
    width: window.innerWidth,
    height: window.innerHeight,
    laneGap: 130,
    centerY: window.innerHeight / 2,
    player: {
      x: 0,
      y: 0,
      startY: 0,
      targetY: 0,
      laneSwitchT: 0,
      laneSwitchDuration: 0.14,
      tilt: 0,
      size: 26,
      isTop: true,
      trail: []
    },
    obstacles: [],
    orbs: [],
    shots: [],
    ripple: [],
    stars: [],
    explosionShards: [],
    asteroidDebris: [],
    fireworks: [],
    score: 0,
    multiplier: 1,
    combo: 0,
    aiMode: AI_MODE.CALM,
    outcome: "",
    changeCountWindow: 0,
    aiWindowTimer: 0,
    isOverdrive: false,
    overdriveTimer: 0,
    shieldCharges: 0,
    spawnTimer: 0,
    orbTimer: 0,
    shotCooldown: 0,
    enemySpawnCounter: 0,
    orbSequenceCounter: 0,
    elapsed: 0,
    speed: 320,
    pausedTime: 0,
    lastTs: 0,
    ambientSoundTimer: 0,
    fireworkTimer: 0
    ,crashPending: false
    ,crashDelay: 0
  };

  let audioContext = null;
  let ambientOscillator = null;

  function initAudio() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, duration, type, gainValue) {
    if (!audioContext) {
      return;
    }
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);
    gain.gain.setValueAtTime(gainValue, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
  }

  function playVictorySound() {
    if (!audioContext) return;
    const notes = [
      { freq: 523, time: 0, duration: 0.15 },
      { freq: 659, time: 0.15, duration: 0.15 },
      { freq: 784, time: 0.3, duration: 0.15 },
      { freq: 1047, time: 0.45, duration: 0.4 },
      { freq: 880, time: 0.65, duration: 0.1 },
      { freq: 1047, time: 0.8, duration: 0.5 }
    ];
    
    notes.forEach(note => {
      setTimeout(() => playTone(note.freq, note.duration, "sine", 0.15), note.time * 1000);
    });
  }

  function playDefeatSound() {
    if (!audioContext) return;
    const notes = [
      { freq: 400, time: 0, duration: 0.2 },
      { freq: 350, time: 0.15, duration: 0.2 },
      { freq: 300, time: 0.3, duration: 0.2 },
      { freq: 200, time: 0.45, duration: 0.3 },
      { freq: 150, time: 0.7, duration: 0.5 }
    ];
    
    notes.forEach(note => {
      setTimeout(() => playTone(note.freq, note.duration, "sawtooth", 0.12), note.time * 1000);
    });
    
    setTimeout(() => playTone(100, 0.6, "square", 0.08), 800);
  }

  function startAmbientSound() {
    if (!audioContext || ambientOscillator) return;
    
    ambientOscillator = audioContext.createOscillator();
    const ambientGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    ambientOscillator.type = "sine";
    ambientOscillator.frequency.setValueAtTime(55, audioContext.currentTime);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, audioContext.currentTime);
    filter.Q.setValueAtTime(1, audioContext.currentTime);
    
    ambientGain.gain.setValueAtTime(0, audioContext.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 1);
    
    ambientOscillator.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(audioContext.destination);
    
    ambientOscillator.start();
  }

  function stopAmbientSound() {
    if (!ambientOscillator) return;
    
    const gain = audioContext.createGain();
    ambientOscillator.connect(gain);
    gain.connect(audioContext.destination);
    gain.gain.setValueAtTime(0.03, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    setTimeout(() => {
      if (ambientOscillator) {
        ambientOscillator.stop();
        ambientOscillator = null;
      }
    }, 500);
  }

  function updateAmbientSound(dt) {
    if (!ambientOscillator || !audioContext) return;
    
    state.ambientSoundTimer += dt;
    
    if (state.ambientSoundTimer >= 0.5) {
      const baseFreq = 55;
      const variation = Math.sin(state.elapsed * 0.5) * 10;
      const speedFactor = Math.min(state.speed / 320, 2);
      const targetFreq = baseFreq + variation + (speedFactor * 15);
      
      ambientOscillator.frequency.setValueAtTime(
        targetFreq,
        audioContext.currentTime
      );
      
      state.ambientSoundTimer = 0;
    }
  }

  function laneY(isTop) {
    return isTop ? state.centerY - state.laneGap : state.centerY + state.laneGap;
  }

  function initStars() {
    state.stars = [];
    const starCount = 150;
    for (let i = 0; i < starCount; i++) {
      state.stars.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        radius: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.centerY = state.height / 2;
    canvas.width = state.width;
    canvas.height = state.height;
    state.player.x = Math.max(100, Math.round(state.width * 0.16));
    state.player.y = laneY(state.player.isTop);
    state.player.startY = state.player.y;
    state.player.targetY = state.player.y;
    initStars();
  }

  function resetRun() {
    state.obstacles = [];
    state.orbs = [];
    state.shots = [];
    state.ripple = [];
    state.score = 0;
    state.explosionShards = [];
    state.asteroidDebris = [];
    state.fireworks = [];
    state.multiplier = 1;
    state.combo = 0;
    state.aiMode = AI_MODE.CALM;
    state.outcome = "";
    state.changeCountWindow = 0;
    state.aiWindowTimer = 0;
    state.isOverdrive = false;
    state.overdriveTimer = 0;
    state.shieldCharges = 0;
    state.spawnTimer = 0;
    state.orbTimer = 0;
    state.shotCooldown = 0;
    state.enemySpawnCounter = 0;
    state.orbSequenceCounter = 0;
    state.elapsed = 0;
    state.fireworkTimer = 0;
    state.speed = 320;
    state.player.isTop = true;
    state.player.y = laneY(true);
    state.player.startY = state.player.y;
    state.player.targetY = state.player.y;
    state.player.laneSwitchT = state.player.laneSwitchDuration;
    state.player.tilt = 0;
    state.player.visible = true;
    state.player.trail = [];
    targetValue.textContent = String(TARGET_SCORE);
    syncHud();
    app.classList.remove("warp-active", "spin-360-once", "paused", "shake");
    state.crashPending = false;
    state.crashDelay = 0;
  }

  function startRun() {
    resetRun();
    state.gameState = GAME_STATE.PLAYING;
    app.classList.add("state-playing");
    overlayTitle.textContent = "Shift Axis: Overdrive";
    overlayMessage.textContent = "";
    howToPlay.hidden = false;
    controlsHint.hidden = false;
    startBtn.hidden = true;
    restartBtn.hidden = true;
    overlay.style.display = "none";
    startAmbientSound();
  }

  function setMenu() {
    state.gameState = GAME_STATE.MENU;
    app.classList.remove("state-playing", "paused", "warp-active", "spin-360-once", "shake");
    overlay.style.display = "grid";
    overlayTitle.textContent = "Shift Axis: Overdrive";
    overlayMessage.textContent = "Pulsa Space, click o touch para comenzar";
    howToPlay.hidden = false;
    controlsHint.hidden = false;
    controlsHint.textContent = "Controles: Space / Click / Touch · Disparo: Flecha Arriba · Pausa: P";
    startBtn.hidden = false;
    restartBtn.hidden = true;
    startBtn.textContent = "Iniciar";
  }

  function setPaused() {
    if (state.gameState !== GAME_STATE.PLAYING) {
      return;
    }
    state.gameState = GAME_STATE.PAUSED;
    app.classList.add("paused");
    overlay.style.display = "grid";
    overlayTitle.textContent = "Pausa";
    overlayMessage.textContent = "Presiona P o Continuar para volver";
    howToPlay.hidden = true;
    controlsHint.hidden = false;
    controlsHint.textContent = "Controles: Space / Click / Touch · Disparo: Flecha Arriba · Reanudar: P";
    startBtn.hidden = false;
    startBtn.textContent = "Continuar";
    restartBtn.hidden = false;
  }

  function resumeRun() {
    if (state.gameState !== GAME_STATE.PAUSED) {
      return;
    }
    state.gameState = GAME_STATE.PLAYING;
    app.classList.remove("paused");
    overlay.style.display = "none";
    controlsHint.textContent = "Controles: Space / Click / Touch · Disparo: Flecha Arriba · Pausa: P";
    startBtn.textContent = "Iniciar";
    startBtn.hidden = true;
    restartBtn.hidden = true;
  }

  function setGameOver(outcome, message) {
    state.gameState = outcome === "victory" ? GAME_STATE.VICTORY : GAME_STATE.GAMEOVER;
    state.outcome = outcome;
    overlay.style.display = "grid";
    overlayTitle.textContent = outcome === "victory" ? "Victoria" : "Game Over";
    overlayMessage.textContent = message;
    howToPlay.hidden = true;
    controlsHint.hidden = false;
    controlsHint.textContent = `Score final: ${Math.floor(state.score)} · Objetivo: ${TARGET_SCORE}`;
    startBtn.hidden = true;
    restartBtn.hidden = false;
    app.classList.remove("state-playing", "paused", "warp-active");
    stopAmbientSound();
    
    if (outcome === "victory") {
      playVictorySound();
      state.fireworkTimer = 0;
      spawnFireworkBurst(state.width * 0.3, state.height * 0.32);
      spawnFireworkBurst(state.width * 0.68, state.height * 0.27);
    } else {
      playDefeatSound();
    }
  }

  function spawnFireworkBurst(x, y) {
    const palette = ["#ffe55c", "#65b6ff", "#ff3e6c", "#23f4ee", "#ffffff"];
    const pieces = 28;
    for (let i = 0; i < pieces; i++) {
      const angle = (Math.PI * 2 * i) / pieces + (Math.random() - 0.5) * 0.2;
      const speed = 80 + Math.random() * 240;
      state.fireworks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.9 + Math.random() * 0.45,
        size: 2 + Math.random() * 3.5,
        color: palette[Math.floor(Math.random() * palette.length)]
      });
    }
  }

  function updateFireworks(dt) {
    for (let i = state.fireworks.length - 1; i >= 0; i -= 1) {
      const spark = state.fireworks[i];
      spark.vy += 260 * dt;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.vx *= 0.99;
      spark.life -= dt;
      if (spark.life <= 0) {
        state.fireworks.splice(i, 1);
      }
    }

    if (state.gameState === GAME_STATE.VICTORY) {
      state.fireworkTimer += dt;
      if (state.fireworkTimer >= 0.45) {
        state.fireworkTimer = 0;
        const x = state.width * (0.15 + Math.random() * 0.7);
        const y = state.height * (0.12 + Math.random() * 0.38);
        spawnFireworkBurst(x, y);
      }
    }
  }

  function toggleLane() {
    if (state.gameState === GAME_STATE.MENU) {
      startRun();
      return;
    }
    if (state.gameState !== GAME_STATE.PLAYING) {
      return;
    }
    if (state.crashPending) {
      return;
    }
    state.player.startY = state.player.y;
    state.player.isTop = !state.player.isTop;
    state.player.targetY = laneY(state.player.isTop);
    state.player.laneSwitchT = 0;
    state.changeCountWindow += 1;
    playTone(540, 0.05, "square", 0.06);
  }

  function shoot() {
    if (state.gameState !== GAME_STATE.PLAYING || state.crashPending) {
      return;
    }
    if (state.shotCooldown > 0) {
      return;
    }

    state.shotCooldown = 0.16;
    state.shots.push({
      x: state.player.x + state.player.size * 0.65,
      y: state.player.y,
      width: 16,
      height: 4,
      speed: 820,
      life: 1.2
    });
    playTone(1020, 0.05, "triangle", 0.07);
  }

  function updatePlayerLane(dt) {
    if (state.player.laneSwitchT < state.player.laneSwitchDuration) {
      const prevY = state.player.y;
      state.player.laneSwitchT += dt;
      const t = Math.min(1, state.player.laneSwitchT / state.player.laneSwitchDuration);
      const eased = t * t * (3 - 2 * t);
      state.player.y = state.player.startY + (state.player.targetY - state.player.startY) * eased;
      const verticalVelocity = state.player.y - prevY;
      state.player.tilt = Math.max(-0.35, Math.min(0.35, verticalVelocity * 0.06));
      return;
    }
    state.player.tilt *= 0.82;
    state.player.y = state.player.targetY;
  }

  function spawnObstacle() {
    const width = 36 + Math.random() * 30;
    const height = 44 + Math.random() * 34;
    const isTop = Math.random() > 0.5;
    const isAlien = state.enemySpawnCounter % 2 === 1;
    state.enemySpawnCounter += 1;

    if (isAlien) {
      state.obstacles.push({
        type: "alien",
        x: state.width + width,
        y: laneY(isTop) - height / 2,
        width,
        height,
        color: "#7df78a",
        pulseTime: 0,
        eyeBlinkTime: Math.random() * 4,
        bobOffset: Math.random() * Math.PI * 2
      });
      return;
    }
    
    const vertexCount = 6 + Math.floor(Math.random() * 3);
    const vertices = [];
    const centerX = width / 2;
    const centerY = height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    
    for (let i = 0; i < vertexCount; i++) {
      const angle = (Math.PI * 2 * i) / vertexCount;
      const randomness = 0.6 + Math.random() * 0.4;
      const x = centerX + Math.cos(angle) * radiusX * randomness;
      const y = centerY + Math.sin(angle) * radiusY * randomness;
      vertices.push({ x, y });
    }
    
    const colorVariation = Math.floor(Math.random() * 30);
    const baseColor = `rgb(${255 - colorVariation}, ${62 + colorVariation}, ${108 + colorVariation})`;
    
    state.obstacles.push({
      type: "asteroid",
      x: state.width + width,
      y: laneY(isTop) - height / 2,
      width,
      height,
      color: baseColor,
      vertices,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.5
    });
  }

  function spawnOrb() {
    const sequence = ["slow", "slow", "shield", "red"];
    const type = sequence[state.orbSequenceCounter % 4];
    state.orbSequenceCounter += 1;
    
    const isTop = Math.random() > 0.5;
    state.orbs.push({
      x: state.width + 30,
      y: laneY(isTop),
      radius: 10,
      type,
      color: type === "slow" ? "#65b6ff" : type === "shield" ? "#ffe55c" : "#ff3e6c",
      pulseTime: 0,
      baseRadius: 10
    });
  }

  function triggerSpin360Once() {
    app.classList.remove("spin-360-once");
    void app.offsetWidth;
    app.classList.add("spin-360-once");
  }

  function triggerShipExplosion(x, y) {
    state.explosionShards = [];
    const pieces = 18;
    for (let i = 0; i < pieces; i++) {
      const angle = (Math.PI * 2 * i) / pieces + (Math.random() - 0.5) * 0.35;
      const speed = 120 + Math.random() * 220;
      state.explosionShards.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 7,
        life: 0.55 + Math.random() * 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 14,
        color: Math.random() > 0.3 ? "#23f4ee" : "#65b6ff"
      });
    }
  }

  function triggerAsteroidExplosion(x, y, color) {
    const pieces = 12;
    for (let i = 0; i < pieces; i++) {
      const angle = (Math.PI * 2 * i) / pieces + (Math.random() - 0.5) * 0.4;
      const speed = 90 + Math.random() * 180;
      state.asteroidDebris.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 5,
        life: 0.45 + Math.random() * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: color || "#ff3e6c"
      });
    }
    playTone(220, 0.08, "square", 0.08);
  }

  function updateExplosion(dt) {
    for (let i = state.explosionShards.length - 1; i >= 0; i -= 1) {
      const shard = state.explosionShards[i];
      shard.vy += 560 * dt;
      shard.x += shard.vx * dt;
      shard.y += shard.vy * dt;
      shard.rotation += shard.rotationSpeed * dt;
      shard.life -= dt;
      if (shard.life <= 0) {
        state.explosionShards.splice(i, 1);
      }
    }
  }

  function updateAsteroidDebris(dt) {
    for (let i = state.asteroidDebris.length - 1; i >= 0; i -= 1) {
      const piece = state.asteroidDebris[i];
      piece.vy += 460 * dt;
      piece.x += piece.vx * dt;
      piece.y += piece.vy * dt;
      piece.rotation += piece.rotationSpeed * dt;
      piece.life -= dt;
      if (piece.life <= 0) {
        state.asteroidDebris.splice(i, 1);
      }
    }
  }

  function rectCollision(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }

  function circleRectCollision(circle, rect) {
    const testX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const testY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const dx = circle.x - testX;
    const dy = circle.y - testY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  function updateAi(dt) {
    state.aiWindowTimer += dt;
    if (state.aiWindowTimer < 2.5) {
      return;
    }

    if (state.changeCountWindow <= 1) {
      state.aiMode = AI_MODE.PRESSURE;
    } else if (state.changeCountWindow >= 6) {
      state.aiMode = AI_MODE.AGGRO;
    } else {
      state.aiMode = AI_MODE.CALM;
    }

    state.aiWindowTimer = 0;
    state.changeCountWindow = 0;
  }

  function currentSpeedFactor() {
    if (state.aiMode === AI_MODE.PRESSURE) {
      return 0.95;
    }
    if (state.aiMode === AI_MODE.AGGRO) {
      return 1.2;
    }
    return 1;
  }

  function currentSpawnFactor() {
    if (state.aiMode === AI_MODE.PRESSURE) {
      return 0.82;
    }
    if (state.aiMode === AI_MODE.AGGRO) {
      return 1.18;
    }
    return 1;
  }

  function applyOrb(orbType) {
    state.combo += 1;
    if (state.combo >= 4) {
      state.multiplier = 4;
    } else if (state.combo >= 2) {
      state.multiplier = 2;
    } else {
      state.multiplier = 1;
    }

    state.score += 100 * state.multiplier;

    if (orbType === "slow") {
      playTone(300, 0.12, "triangle", 0.08);
    } else if (orbType === "shield") {
      state.shieldCharges = Math.min(2, state.shieldCharges + 1);
      playTone(780, 0.07, "sine", 0.07);
    } else if (orbType === "red") {
      state.score += 140;
      triggerSpin360Once();
      playTone(880, 0.09, "square", 0.08);
    }

    if (state.multiplier >= 4 && !state.isOverdrive) {
      state.isOverdrive = true;
      state.overdriveTimer = 10;
      app.classList.add("warp-active");
      playTone(940, 0.2, "sawtooth", 0.09);
    }
  }

  function updatePlaying(dt) {
    state.elapsed += dt;
    state.shotCooldown = Math.max(0, state.shotCooldown - dt);

    if (state.crashPending) {
      state.crashDelay -= dt;
      if (state.crashDelay <= 0) {
        state.crashPending = false;
        setGameOver("lose", "Colision fatal. Presiona Reiniciar.");
      }
      return;
    }

    updatePlayerLane(dt);

    state.speed += dt * 8;
    updateAi(dt);
    updateAmbientSound(dt);

    const overdriveSpeedFactor = state.isOverdrive ? 1.5 : 1;
    const speed = state.speed * currentSpeedFactor() * overdriveSpeedFactor;
    const spawnFactor = currentSpawnFactor();

    state.spawnTimer += dt;
    state.orbTimer += dt;

    const obstacleGap = (1.05 / spawnFactor) + Math.random() * 0.35;
    const orbGap = (1.5 / Math.max(0.9, spawnFactor)) + Math.random() * 0.7;

    if (state.spawnTimer >= obstacleGap) {
      spawnObstacle();
      state.spawnTimer = 0;
    }

    if (state.orbTimer >= orbGap) {
      spawnOrb();
      state.orbTimer = 0;
    }

    for (let i = state.shots.length - 1; i >= 0; i -= 1) {
      const shot = state.shots[i];
      shot.x += shot.speed * dt;
      shot.life -= dt;
      if (shot.x > state.width + 30 || shot.life <= 0) {
        state.shots.splice(i, 1);
      }
    }

    const playerRect = {
      x: state.player.x - state.player.size / 2,
      y: state.player.y - state.player.size / 2,
      width: state.player.size,
      height: state.player.size
    };

    for (let i = state.obstacles.length - 1; i >= 0; i -= 1) {
      const obs = state.obstacles[i];
      obs.x -= speed * dt;

      if (obs.type === "alien") {
        obs.pulseTime += dt;
        obs.eyeBlinkTime += dt;
        obs.y += Math.sin(state.elapsed * 4 + obs.bobOffset) * 0.55;
      }
      
      if (obs.rotation !== undefined) {
        obs.rotation += obs.rotationSpeed * dt;
      }

      let destroyedByShot = false;
      for (let j = state.shots.length - 1; j >= 0; j -= 1) {
        const shot = state.shots[j];
        const shotRect = {
          x: shot.x - shot.width / 2,
          y: shot.y - shot.height / 2,
          width: shot.width,
          height: shot.height
        };
        if (rectCollision(shotRect, obs)) {
          state.shots.splice(j, 1);
          const centerX = obs.x + obs.width / 2;
          const centerY = obs.y + obs.height / 2;
          triggerAsteroidExplosion(centerX, centerY, obs.color);
          state.score += 80;
          state.obstacles.splice(i, 1);
          destroyedByShot = true;
          break;
        }
      }
      if (destroyedByShot) {
        continue;
      }

      if (rectCollision(playerRect, obs)) {
        if (state.isOverdrive) {
          continue;
        }

        if (state.shieldCharges > 0) {
          state.shieldCharges -= 1;
          state.score += 60;
          playTone(650, 0.08, "triangle", 0.07);
          app.classList.add("shake");
          setTimeout(() => app.classList.remove("shake"), 120);
          state.obstacles.splice(i, 1);
          continue;
        }

        playTone(130, 0.16, "square", 0.1);
        app.classList.add("shake");
        setTimeout(() => app.classList.remove("shake"), 120);
        state.player.visible = false;
        triggerShipExplosion(state.player.x, state.player.y);
        state.crashPending = true;
        state.crashDelay = 0.55;
        return;
      }

      if (obs.x + obs.width < -CANVAS_MARGIN) {
        state.obstacles.splice(i, 1);
      }
    }

    for (let i = state.orbs.length - 1; i >= 0; i -= 1) {
      const orb = state.orbs[i];
      orb.x -= speed * dt;
      
      if (orb.pulseTime !== undefined) {
        orb.pulseTime += dt;
      }

      if (circleRectCollision(orb, playerRect)) {
        applyOrb(orb.type);
        state.ripple.push({ x: orb.x, y: orb.y, radius: 6, life: 0.4, color: orb.color });
        state.orbs.splice(i, 1);
        continue;
      }

      if (orb.x + orb.radius < -CANVAS_MARGIN) {
        state.combo = 0;
        state.multiplier = 1;
        state.orbs.splice(i, 1);
      }
    }

    for (let i = state.ripple.length - 1; i >= 0; i -= 1) {
      state.ripple[i].life -= dt;
      state.ripple[i].radius += dt * 150;
      if (state.ripple[i].life <= 0) {
        state.ripple.splice(i, 1);
      }
    }

    const survivalRate = state.isOverdrive ? 90 : 30;
    state.score += dt * (survivalRate * state.multiplier);

    if (state.score >= TARGET_SCORE) {
      setGameOver("victory", "Objetivo alcanzado. Reinicia para otra ronda.");
      return;
    }

    if (state.isOverdrive) {
      state.overdriveTimer -= dt;
      if (state.overdriveTimer <= 0) {
        state.isOverdrive = false;
        state.overdriveTimer = 0;
        state.multiplier = 1;
        state.combo = 0;
        app.classList.remove("warp-active");
      }
    }

    state.player.trail.push({ x: state.player.x, y: state.player.y, life: 0.4 });
    if (state.player.trail.length > 20) {
      state.player.trail.shift();
    }

    for (let i = state.player.trail.length - 1; i >= 0; i -= 1) {
      state.player.trail[i].life -= dt;
      if (state.player.trail[i].life <= 0) {
        state.player.trail.splice(i, 1);
      }
    }

    syncHud();
  }

  function syncHud() {
    scoreValue.textContent = Math.floor(state.score).toString();
    timeValue.textContent = `${state.elapsed.toFixed(1)}s`;
    livesValue.textContent = `${1 + state.shieldCharges}`;
    multiplierValue.textContent = `x${state.multiplier}`;
    aiModeValue.textContent = state.aiMode;
  }

  function drawBackground() {
    if (state.isOverdrive) {
      ctx.fillStyle = "rgba(15, 15, 19, 0.1)";
      ctx.fillRect(0, 0, state.width, state.height);
    } else {
      ctx.clearRect(0, 0, state.width, state.height);
      
      const gradient = ctx.createRadialGradient(
        state.width * 0.3, state.height * 0.3, 0,
        state.width * 0.5, state.height * 0.5, state.width * 0.8
      );
      gradient.addColorStop(0, "#1a1a3e");
      gradient.addColorStop(0.4, "#0d0d1f");
      gradient.addColorStop(1, "#050510");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, state.width, state.height);
      
      const nebula1 = ctx.createRadialGradient(
        state.width * 0.2, state.height * 0.25, 0,
        state.width * 0.2, state.height * 0.25, state.width * 0.35
      );
      nebula1.addColorStop(0, "rgba(101, 182, 255, 0.08)");
      nebula1.addColorStop(1, "rgba(101, 182, 255, 0)");
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, state.width, state.height);
      
      const nebula2 = ctx.createRadialGradient(
        state.width * 0.75, state.height * 0.6, 0,
        state.width * 0.75, state.height * 0.6, state.width * 0.3
      );
      nebula2.addColorStop(0, "rgba(255, 62, 108, 0.06)");
      nebula2.addColorStop(1, "rgba(255, 62, 108, 0)");
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, state.width, state.height);
    }
    
    for (const star of state.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
      
      if (state.gameState === GAME_STATE.PLAYING) {
        star.x -= star.speed * (state.speed / 100);
        if (star.x < -10) {
          star.x = state.width + 10;
          star.y = Math.random() * state.height;
        }
      }
    }

    ctx.strokeStyle = "rgba(35, 244, 238, 0.2)";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(0, state.centerY);
    ctx.lineTo(state.width, state.centerY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawPlayer() {
    if (!state.player.visible) {
      return;
    }
    for (const mark of state.player.trail) {
      const alpha = Math.max(0, mark.life / 0.4) * 0.35;
      const trailSize = state.player.size * 0.7;
      
      ctx.save();
      ctx.translate(mark.x, mark.y);
      ctx.fillStyle = `rgba(35, 244, 238, ${alpha})`;
      
      ctx.beginPath();
      ctx.moveTo(trailSize * 0.5, 0);
      ctx.lineTo(-trailSize * 0.3, -trailSize * 0.4);
      ctx.lineTo(-trailSize * 0.3, trailSize * 0.4);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();
    }

    const shipSize = state.player.size;
    const glowIntensity = state.isOverdrive ? 28 : 16;
    const enginePulse = 0.7 + Math.sin(state.elapsed * 24) * 0.2;
    const thrustIntensity = Math.min(1.7, state.speed / 320) * (state.isOverdrive ? 1.5 : 1);
    
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    ctx.rotate(state.player.tilt);

    // Engine flame layers for a hot exhaust effect.
    const exhaustLength = shipSize * (0.85 + thrustIntensity * 0.65) * enginePulse;
    const outerFlame = ctx.createLinearGradient(-shipSize * 0.65, 0, -shipSize * 1.35 - exhaustLength, 0);
    outerFlame.addColorStop(0, "rgba(255, 186, 58, 0.9)");
    outerFlame.addColorStop(0.45, "rgba(255, 112, 46, 0.85)");
    outerFlame.addColorStop(1, "rgba(255, 48, 32, 0)");
    ctx.fillStyle = outerFlame;
    ctx.beginPath();
    ctx.moveTo(-shipSize * 0.2, -shipSize * 0.22);
    ctx.lineTo(-shipSize * 0.95 - exhaustLength, 0);
    ctx.lineTo(-shipSize * 0.2, shipSize * 0.22);
    ctx.closePath();
    ctx.fill();

    const coreFlame = ctx.createLinearGradient(-shipSize * 0.45, 0, -shipSize * 1.05 - exhaustLength * 0.75, 0);
    coreFlame.addColorStop(0, "rgba(255, 255, 210, 0.95)");
    coreFlame.addColorStop(0.5, "rgba(127, 229, 255, 0.9)");
    coreFlame.addColorStop(1, "rgba(80, 180, 255, 0)");
    ctx.fillStyle = coreFlame;
    ctx.beginPath();
    ctx.moveTo(-shipSize * 0.16, -shipSize * 0.11);
    ctx.lineTo(-shipSize * 0.8 - exhaustLength * 0.75, 0);
    ctx.lineTo(-shipSize * 0.16, shipSize * 0.11);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowColor = "#23f4ee";
    ctx.shadowBlur = glowIntensity;
    const hullGradient = ctx.createLinearGradient(-shipSize * 0.35, -shipSize * 0.5, shipSize * 0.55, shipSize * 0.5);
    hullGradient.addColorStop(0, "#d2f8ff");
    hullGradient.addColorStop(0.35, "#67d5ff");
    hullGradient.addColorStop(0.75, "#2ba5f4");
    hullGradient.addColorStop(1, "#1568b6");
    ctx.fillStyle = hullGradient;
    
    ctx.beginPath();
    ctx.moveTo(shipSize * 0.5, 0);
    ctx.lineTo(-shipSize * 0.3, -shipSize * 0.5);
    ctx.lineTo(-shipSize * 0.15, -shipSize * 0.25);
    ctx.lineTo(-shipSize * 0.15, shipSize * 0.25);
    ctx.lineTo(-shipSize * 0.3, shipSize * 0.5);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = glowIntensity * 0.6;
    const noseGradient = ctx.createLinearGradient(shipSize * 0.06, -shipSize * 0.16, shipSize * 0.55, shipSize * 0.16);
    noseGradient.addColorStop(0, "#b8ebff");
    noseGradient.addColorStop(1, "#3a8aff");
    ctx.fillStyle = noseGradient;
    ctx.beginPath();
    ctx.moveTo(shipSize * 0.5, 0);
    ctx.lineTo(shipSize * 0.1, -shipSize * 0.15);
    ctx.lineTo(shipSize * 0.1, shipSize * 0.15);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(12, 54, 104, 0.45)";
    ctx.beginPath();
    ctx.moveTo(shipSize * 0.35, 0);
    ctx.lineTo(-shipSize * 0.22, shipSize * 0.34);
    ctx.lineTo(-shipSize * 0.06, shipSize * 0.12);
    ctx.closePath();
    ctx.fill();

    const canopyGradient = ctx.createRadialGradient(
      shipSize * 0.1,
      -shipSize * 0.08,
      shipSize * 0.02,
      shipSize * 0.15,
      -shipSize * 0.04,
      shipSize * 0.24
    );
    canopyGradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    canopyGradient.addColorStop(0.45, "rgba(145, 220, 255, 0.8)");
    canopyGradient.addColorStop(1, "rgba(43, 122, 214, 0.35)");
    ctx.fillStyle = canopyGradient;
    ctx.beginPath();
    ctx.ellipse(shipSize * 0.1, -shipSize * 0.01, shipSize * 0.2, shipSize * 0.12, -0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-shipSize * 0.12, -shipSize * 0.27);
    ctx.lineTo(shipSize * 0.34, -shipSize * 0.02);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawExplosion() {
    for (const shard of state.explosionShards) {
      const alpha = Math.max(0, Math.min(1, shard.life));
      ctx.save();
      ctx.translate(shard.x, shard.y);
      ctx.rotate(shard.rotation);
      ctx.fillStyle = shard.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-shard.size / 2, -shard.size / 2, shard.size, shard.size);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function drawAsteroidDebris() {
    for (const piece of state.asteroidDebris) {
      const alpha = Math.max(0, Math.min(1, piece.life));
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function drawFireworks() {
    for (const spark of state.fireworks) {
      const alpha = Math.max(0, Math.min(1, spark.life));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = spark.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  function drawObstacles() {
    for (const obs of state.obstacles) {
      if (obs.type === "alien") {
        const cx = obs.x + obs.width / 2;
        const cy = obs.y + obs.height / 2;
        const pulse = 1 + Math.sin((obs.pulseTime || 0) * 8) * 0.04;
        const blink = ((obs.eyeBlinkTime || 0) % 3.2) < 0.16;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(pulse, pulse);

        ctx.shadowColor = "#7df78a";
        ctx.shadowBlur = 12;

        ctx.fillStyle = "rgba(92, 255, 130, 0.95)";
        ctx.beginPath();
        ctx.ellipse(0, 0, obs.width * 0.42, obs.height * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(160, 255, 185, 0.9)";
        ctx.beginPath();
        ctx.ellipse(0, -obs.height * 0.08, obs.width * 0.24, obs.height * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();

        if (!blink) {
          ctx.fillStyle = "#081617";
          ctx.beginPath();
          ctx.arc(-obs.width * 0.07, -obs.height * 0.1, 2.2, 0, Math.PI * 2);
          ctx.arc(obs.width * 0.07, -obs.height * 0.1, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.restore();
        continue;
      }

      if (!obs.vertices) {
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        continue;
      }
      
      ctx.save();
      ctx.translate(obs.x + obs.width / 2, obs.y + obs.height / 2);
      ctx.rotate(obs.rotation || 0);
      
      ctx.shadowColor = "#ff3e6c";
      ctx.shadowBlur = 12;
      
      ctx.beginPath();
      ctx.moveTo(obs.vertices[0].x - obs.width / 2, obs.vertices[0].y - obs.height / 2);
      for (let i = 1; i < obs.vertices.length; i++) {
        ctx.lineTo(obs.vertices[i].x - obs.width / 2, obs.vertices[i].y - obs.height / 2);
      }
      ctx.closePath();
      
      ctx.fillStyle = obs.color;
      ctx.fill();
      
      ctx.strokeStyle = "rgba(255, 100, 140, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  function drawOrbs() {
    for (const orb of state.orbs) {
      ctx.save();
      
      if (orb.type === "shield" || orb.type === "red") {
        const flicker = 0.7 + Math.sin(orb.pulseTime * 12) * 0.15 + Math.random() * 0.15;
        const radiusFlicker = orb.baseRadius * (0.95 + Math.sin(orb.pulseTime * 10) * 0.1);
        
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = 15 + Math.sin(orb.pulseTime * 8) * 5;
        
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, radiusFlicker);
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.6, orb.color);
        gradient.addColorStop(1, `rgba(${orb.type === "shield" ? "255, 229, 92" : "255, 62, 108"}, 0)`);
        
        ctx.globalAlpha = flicker;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, radiusFlicker, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.globalAlpha = 0.8 + Math.sin(orb.pulseTime * 15) * 0.2;
        ctx.fillStyle = "rgba(255, 255, 200, " + (0.6 * flicker) + ")";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, radiusFlicker * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }

    for (const ring of state.ripple) {
      ctx.beginPath();
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = Math.max(0, ring.life / 0.4);
      ctx.lineWidth = 2;
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawShots() {
    for (const shot of state.shots) {
      ctx.save();
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 8;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(shot.x - shot.width / 2, shot.y - shot.height / 2, shot.width, shot.height);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  function drawPausedTag() {
    if (state.gameState !== GAME_STATE.PAUSED) {
      return;
    }
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.font = "bold 34px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("PAUSA", state.width / 2, state.height * 0.2);
  }

  function render() {
    drawBackground();
    drawObstacles();
    drawOrbs();
    drawShots();
    drawPlayer();
    drawAsteroidDebris();
    drawExplosion();
    drawFireworks();
    drawPausedTag();
  }

  function gameLoop(ts) {
    const delta = Math.min(0.033, (ts - state.lastTs) / 1000 || 0.016);
    state.lastTs = ts;

    updateExplosion(delta);
    updateAsteroidDebris(delta);
    updateFireworks(delta);

    if (state.gameState === GAME_STATE.PLAYING) {
      updatePlaying(delta);
    }

    render();
    requestAnimationFrame(gameLoop);
  }

  function onPrimaryAction(event) {
    if (event.type === "touchstart") {
      event.preventDefault();
    }
    initAudio();
    if (state.gameState === GAME_STATE.PAUSED) {
      return;
    }
    toggleLane();
  }

  function onKeyDown(event) {
    if (event.code === "Space") {
      event.preventDefault();
      onPrimaryAction(event);
      return;
    }
    if (event.code === "ArrowUp") {
      event.preventDefault();
      initAudio();
      shoot();
      return;
    }
    if (event.code === "KeyP") {
      if (state.gameState === GAME_STATE.PLAYING) {
        setPaused();
      } else if (state.gameState === GAME_STATE.PAUSED) {
        resumeRun();
      }
    }
  }

  startBtn.addEventListener("click", () => {
    initAudio();
    if (state.gameState === GAME_STATE.PAUSED) {
      resumeRun();
      return;
    }
    startRun();
  });

  restartBtn.addEventListener("click", () => {
    initAudio();
    startRun();
  });

  window.addEventListener("keydown", onKeyDown, { passive: false });
  window.addEventListener("mousedown", onPrimaryAction);
  window.addEventListener("touchstart", onPrimaryAction, { passive: false });
  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  setMenu();
  requestAnimationFrame(gameLoop);
})();
