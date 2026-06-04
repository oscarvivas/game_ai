(() => {
  const GAME_STATE = {
    MENU: "menu",
    PLAYING: "playing",
    PAUSED: "paused",
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
      size: 26,
      isTop: true,
      trail: []
    },
    obstacles: [],
    orbs: [],
    ripple: [],
    score: 0,
    multiplier: 1,
    combo: 0,
    aiMode: AI_MODE.CALM,
    outcome: "",
    changeCountWindow: 0,
    aiWindowTimer: 0,
    wowTimer: 0,
    shieldCharges: 0,
    spawnTimer: 0,
    orbTimer: 0,
    elapsed: 0,
    speed: 320,
    pausedTime: 0,
    lastTs: 0
  };

  let audioContext = null;

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

  function laneY(isTop) {
    return isTop ? state.centerY - state.laneGap : state.centerY + state.laneGap;
  }

  function resizeCanvas() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    state.centerY = state.height / 2;
    canvas.width = state.width;
    canvas.height = state.height;
    state.player.x = Math.max(100, Math.round(state.width * 0.16));
    state.player.y = laneY(state.player.isTop);
  }

  function resetRun() {
    state.obstacles = [];
    state.orbs = [];
    state.ripple = [];
    state.score = 0;
    state.multiplier = 1;
    state.combo = 0;
    state.aiMode = AI_MODE.CALM;
    state.outcome = "";
    state.changeCountWindow = 0;
    state.aiWindowTimer = 0;
    state.wowTimer = 0;
    state.shieldCharges = 0;
    state.spawnTimer = 0;
    state.orbTimer = 0;
    state.elapsed = 0;
    state.speed = 320;
    state.player.isTop = true;
    state.player.y = laneY(true);
    state.player.trail = [];
    targetValue.textContent = String(TARGET_SCORE);
    syncHud();
    app.classList.remove("wow", "paused", "shake");
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
  }

  function setMenu() {
    state.gameState = GAME_STATE.MENU;
    app.classList.remove("state-playing", "paused", "wow", "shake");
    overlay.style.display = "grid";
    overlayTitle.textContent = "Shift Axis: Overdrive";
    overlayMessage.textContent = "Pulsa Space, click o touch para comenzar";
    howToPlay.hidden = false;
    controlsHint.hidden = false;
    controlsHint.textContent = "Controles: Space / Click / Touch · Pausa: P";
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
    controlsHint.textContent = "Controles: Space / Click / Touch · Reanudar: P";
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
    controlsHint.textContent = "Controles: Space / Click / Touch · Pausa: P";
    startBtn.textContent = "Iniciar";
    startBtn.hidden = true;
    restartBtn.hidden = true;
  }

  function setGameOver(outcome, message) {
    state.gameState = GAME_STATE.GAMEOVER;
    state.outcome = outcome;
    overlay.style.display = "grid";
    overlayTitle.textContent = outcome === "victory" ? "Victoria" : "Game Over";
    overlayMessage.textContent = message;
    howToPlay.hidden = true;
    controlsHint.hidden = false;
    controlsHint.textContent = `Score final: ${Math.floor(state.score)} · Objetivo: ${TARGET_SCORE}`;
    startBtn.hidden = true;
    restartBtn.hidden = false;
    app.classList.remove("state-playing", "paused");
  }

  function toggleLane() {
    if (state.gameState === GAME_STATE.MENU) {
      startRun();
      return;
    }
    if (state.gameState !== GAME_STATE.PLAYING) {
      return;
    }
    state.player.isTop = !state.player.isTop;
    state.player.y = laneY(state.player.isTop);
    state.changeCountWindow += 1;
    playTone(540, 0.05, "square", 0.06);
  }

  function spawnObstacle() {
    const width = 36 + Math.random() * 30;
    const height = 44 + Math.random() * 34;
    const isTop = Math.random() > 0.5;
    state.obstacles.push({
      x: state.width + width,
      y: laneY(isTop) - height / 2,
      width,
      height,
      color: "#ff3e6c"
    });
  }

  function spawnOrb() {
    const types = ["slow", "shield"];
    const type = types[Math.floor(Math.random() * types.length)];
    const isTop = Math.random() > 0.5;
    state.orbs.push({
      x: state.width + 30,
      y: laneY(isTop),
      radius: 10,
      type,
      color: type === "slow" ? "#65b6ff" : "#ffe55c"
    });
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
      state.wowTimer = Math.max(state.wowTimer, 4.5);
      playTone(300, 0.12, "triangle", 0.08);
    } else {
      state.shieldCharges = Math.min(2, state.shieldCharges + 1);
      state.wowTimer = Math.max(state.wowTimer, 3.2);
      playTone(780, 0.07, "sine", 0.07);
    }

    if (state.multiplier >= 4) {
      state.wowTimer = Math.max(state.wowTimer, 9);
      playTone(940, 0.2, "sawtooth", 0.09);
    }
  }

  function updatePlaying(dt) {
    state.elapsed += dt;

    state.speed += dt * 8;
    updateAi(dt);

    const speed = state.speed * currentSpeedFactor();
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

    const playerRect = {
      x: state.player.x - state.player.size / 2,
      y: state.player.y - state.player.size / 2,
      width: state.player.size,
      height: state.player.size
    };

    for (let i = state.obstacles.length - 1; i >= 0; i -= 1) {
      const obs = state.obstacles[i];
      obs.x -= speed * dt;

      if (rectCollision(playerRect, obs)) {
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
        setGameOver("lose", "Colision fatal. Presiona Reiniciar.");
        return;
      }

      if (obs.x + obs.width < -CANVAS_MARGIN) {
        state.obstacles.splice(i, 1);
      }
    }

    for (let i = state.orbs.length - 1; i >= 0; i -= 1) {
      const orb = state.orbs[i];
      orb.x -= speed * dt;

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

    state.score += dt * (30 * state.multiplier);

    if (state.score >= TARGET_SCORE) {
      playTone(980, 0.26, "triangle", 0.12);
      setGameOver("victory", "Objetivo alcanzado. Reinicia para otra ronda.");
      return;
    }

    if (state.wowTimer > 0) {
      state.wowTimer -= dt;
      app.classList.add("wow");
    } else {
      app.classList.remove("wow");
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
    ctx.clearRect(0, 0, state.width, state.height);

    const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
    gradient.addColorStop(0, "#0f1020");
    gradient.addColorStop(1, "#17172b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, state.centerY);
    ctx.lineTo(state.width, state.centerY);
    ctx.stroke();
  }

  function drawPlayer() {
    for (const mark of state.player.trail) {
      const alpha = Math.max(0, mark.life / 0.4) * 0.45;
      ctx.fillStyle = `rgba(35, 244, 238, ${alpha})`;
      ctx.fillRect(mark.x - 10, mark.y - 10, 20, 20);
    }

    ctx.shadowColor = "#23f4ee";
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#23f4ee";
    ctx.fillRect(
      state.player.x - state.player.size / 2,
      state.player.y - state.player.size / 2,
      state.player.size,
      state.player.size
    );
    ctx.shadowBlur = 0;
  }

  function drawObstacles() {
    for (const obs of state.obstacles) {
      ctx.fillStyle = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }

  function drawOrbs() {
    for (const orb of state.orbs) {
      ctx.beginPath();
      ctx.fillStyle = orb.color;
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
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
    drawPlayer();
    drawPausedTag();
  }

  function gameLoop(ts) {
    const delta = Math.min(0.033, (ts - state.lastTs) / 1000 || 0.016);
    state.lastTs = ts;

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
