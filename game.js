(() => {
  "use strict";

  const W = 360;
  const H = 780;
  const GAME_W = 430;
  const GAME_H = 932;
  const ARENA = { x: 16, y: 74, w: 328, h: 596 };
  const SPRITE_BASE = "assets/characters/";
  const BROADCAST_BASE = "assets/broadcast/";
  const SUMMON_COST = 3;
  const STAR = {
    1: { hp: 1, atk: 1, science: 100 },
    2: { hp: 1.6, atk: 1.5, science: 110 },
    3: { hp: 2.4, atk: 2.2, science: 120 },
    4: { hp: 3.3, atk: 3, science: 130 },
    5: { hp: 4.4, atk: 4, science: 145 },
    6: { hp: 5.6, atk: 5.2, science: 160 },
    7: { hp: 7, atk: 6.5, science: 180 }
  };

  syncGameScale();
  window.addEventListener("resize", syncGameScale);
  window.visualViewport?.addEventListener("resize", syncGameScale);
  window.visualViewport?.addEventListener("scroll", syncGameScale);

  const characters = {
    doan: {
      name: "정도안", short: "도안", sprite: "doan", color: "#efc45d", role: "후열 지휘형 서포터", ai: "support",
      base: { hp: 420, atk: 22, range: 3.0, speed: 1.05 },
      basic: { name: "관찰 기록", text: "가장 가까운 적에게 관찰 표식을 남기는 기록 투사체." },
      skill1: { name: "관찰", text: "적 군집에 관찰 표식을 부여하고 피해를 준다." },
      skill2: { name: "현상화", text: "아군 과학력을 회복시키고 노트 스킬 재사용을 앞당긴다." },
      passive: { name: "전설부 노트", text: "관찰 표식 대상이 받는 피해가 증가한다." },
      routes: { A: "관찰 특화", B: "현상화 특화" },
      weapon: "note"
    },
    newton: {
      name: "뉴턴 계승 학생", short: "뉴턴", sprite: "newton", color: "#70b7ff", role: "전열 탱커 / 중력 제어", ai: "tank",
      base: { hp: 900, atk: 45, range: 1.2, speed: .85 },
      basic: { name: "사과 타격", text: "근접 대상에게 사과 충돌 피해." },
      skill1: { name: "사과 낙하", text: "대상 위치에 중력장을 만들고 적을 끌어당긴다." },
      skill2: { name: "레이저", text: "직선 관통 광선으로 후열 적까지 공격한다." },
      passive: { name: "F=ma", text: "이동 중 공격과 스킬 피해가 증가한다." },
      routes: { A: "사과 특화", B: "레이저 특화" }, weapon: "apple"
    },
    lavoisier: {
      name: "라부아지에 계승 학생", short: "라부", sprite: "lavoisier", color: "#ff8f62", role: "광역 장판 딜러 / 보호 구역", ai: "ranged",
      base: { hp: 430, atk: 34, range: 3.2, speed: .9 },
      basic: { name: "플라스크 투척", text: "플라스크를 던져 작은 범위 피해." },
      skill1: { name: "알코올램프", text: "적 밀집 위치에 연소 장판을 만든다." },
      skill2: { name: "산소통", text: "아군 주변에 회복과 피해 감소 구역을 만든다." },
      passive: { name: "질량보존법칙", text: "주변에서 생성된 장판 지속시간이 증가한다." },
      routes: { A: "알코올램프 특화", B: "산소통 특화" }, weapon: "flask"
    },
    mendel: {
      name: "멘델 계승 학생", short: "멘델", sprite: "mendel", color: "#75d87c", role: "후열 소환형 / 설치 딜러", ai: "summoner",
      base: { hp: 500, atk: 28, range: 3.0, speed: .95 },
      basic: { name: "완두콩 발사", text: "분열 가능한 완두콩 투사체." },
      skill1: { name: "완두콩", text: "연속 완두콩을 발사한다." },
      skill2: { name: "식물 심기", text: "안전한 위치에 자동 공격 식물을 설치한다." },
      passive: { name: "우성 유전", text: "식물과 완두콩이 낮은 확률로 추가 발동한다." },
      routes: { A: "완두콩 특화", B: "식물 심기 특화" }, weapon: "pea"
    },
    faraday: {
      name: "패러데이 계승 학생", short: "패러", sprite: "faraday", color: "#b78cff", role: "중열 제어형 / 연쇄 감전", ai: "control",
      base: { hp: 580, atk: 36, range: 2.8, speed: .95 },
      basic: { name: "전기 스파크", text: "대상에게 전기 투사체." },
      skill1: { name: "전류", text: "주변 적에게 연쇄되는 전기 피해." },
      skill2: { name: "자석", text: "적을 중앙선으로 모으고 느리게 한다." },
      passive: { name: "전자기 유도", text: "강제로 이동한 적에게 추가 전기 피해." },
      routes: { A: "전류 특화", B: "자석 특화" }, weapon: "current"
    },
    wegener: {
      name: "베게너 계승 학생", short: "베게", sprite: "wegener", color: "#c99a69", role: "근접 제어형 / 진형 붕괴", ai: "bruiser",
      base: { hp: 760, atk: 48, range: 1.1, speed: .9 },
      basic: { name: "암석 타격", text: "근접 대상에게 넉백 피해." },
      skill1: { name: "지각 변동", text: "균열을 일으켜 적을 밀고 피해를 준다." },
      skill2: { name: "대륙 이동", text: "적 군집을 압축하고 진형을 흐트러뜨린다." },
      passive: { name: "판게아", text: "이동 중인 적이 서로 가까워지며 군집된다." },
      routes: { A: "지각 변동 특화", B: "대륙 이동 특화" }, weapon: "rock"
    }
  };
  const allyPool = ["newton", "lavoisier", "mendel", "faraday", "wegener"];

  const stages = [
    { id: "1-1", name: "카메라 테스트", enemies: ["camera"], mul: .28 },
    { id: "1-2", name: "첫 REC", enemies: ["camera", "camera", "camera"], mul: .78 },
    { id: "1-3", name: "마이크 체크", enemies: ["camera", "mic", "mic", "camera"], mul: .92 },
    { id: "1-4", name: "집중 조명", enemies: ["camera", "light", "light", "camera"], mul: 1.05 },
    { id: "1-5", name: "편집점", enemies: ["camera", "editor", "editor", "camera"], mul: 1.16 },
    { id: "1-6", name: "생방송 리허설", enemies: ["miniboss", "camera", "mic", "light"], mul: 1.18 },
    { id: "1-7", name: "악마의 편집", enemies: ["editor", "editor", "camera", "camera", "mic"], mul: 1.32 },
    { id: "1-8", name: "카메라 포커스", enemies: ["camera", "camera", "camera", "camera", "light"], mul: 1.45 },
    { id: "1-9", name: "방송사고", enemies: ["camera", "mic", "light", "editor", "camera", "mic"], mul: 1.58 },
    { id: "1-10", name: "방송부장", enemies: ["boss", "camera", "mic", "light", "editor"], mul: 1.72 }
  ];

  const enemyDefs = {
    camera: { label: "CAM", sprite: "camera", color: "#88b8ff", hp: 170, atk: 16, speed: .72, range: 1.7, icon: "▣" },
    mic: { label: "MIC", sprite: "mic", color: "#eee6d2", hp: 160, atk: 13, speed: .68, range: 2.5, icon: "!" },
    light: { label: "LUX", sprite: "light", color: "#ffe16e", hp: 190, atk: 15, speed: .65, range: 2.2, icon: "✶" },
    editor: { label: "EDIT", sprite: "editor", color: "#8ff0ce", hp: 210, atk: 12, speed: .62, range: 2.3, icon: "▤" },
    miniboss: { label: "LIVE", sprite: "miniboss", color: "#ff98a4", hp: 560, atk: 23, speed: .58, range: 1.9, icon: "◆" },
    boss: { label: "ON AIR", sprite: "boss", color: "#ff6b91", hp: 1320, atk: 29, speed: .55, range: 2.7, icon: "★" }
  };

  const state = {
    phase: "prep",
    inspiration: 8,
    currentStage: 0,
    cleared: -1,
    unlocked: [],
    training: {},
    selected: { from: "board", index: 20 },
    formationRows: 2,
    board: Array(24).fill(null),
    bench: Array(8).fill(null),
    uid: 1
  };
  state.board[20] = makeUnit("doan", 1);

  const el = {
    prep: byId("prep"), battle: byId("battle"), board: byId("board"), bench: byId("bench"), info: byId("info"),
    stageTitle: byId("stageTitle"), stageList: byId("stageList"), inspirationText: byId("inspirationText"), teamText: byId("teamText"),
    poolText: byId("poolText"), summonBtn: byId("summonBtn"), battleBtn: byId("battleBtn"), cleanBtn: byId("cleanBtn"),
    fullscreenBtn: byId("fullscreenBtn"),
    modal: byId("modal"), modalTitle: byId("modalTitle"), modalText: byId("modalText"), modalChoices: byId("modalChoices"), toast: byId("toast"),
    canvas: byId("arena"), battleTitle: byId("battleTitle"), battleStats: byId("battleStats"), battleLog: byId("battleLog"),
    joystick: byId("joystick"), knob: byId("knob"), doanAutoToggle: byId("doanAutoToggle"), noteBtn: byId("noteBtn"), speedBtn: byId("speedBtn"), pauseBtn: byId("pauseBtn")
  };
  const ctx = el.canvas.getContext("2d");
  const sprites = {};
  const enemySprites = {};
  const spriteMeta = {};
  const spriteThumbs = {};
  Object.values(characters).forEach(c => {
    const img = new Image();
    img.onload = () => prepareSprite(c.sprite, img, "character");
    img.src = `${SPRITE_BASE}${c.sprite}.png`;
    sprites[c.sprite] = img;
  });
  Object.values(enemyDefs).forEach(e => {
    const img = new Image();
    img.onload = () => prepareSprite(e.sprite, img, "broadcast");
    img.src = `${BROADCAST_BASE}${e.sprite}.png`;
    enemySprites[e.sprite] = img;
  });

  let battle = null;
  let lastTime = 0;
  let dragSource = null;
  let joystick = { active: false, x: 0, y: 0 };
  const keys = new Set();

  function makeUnit(id, star = 1) {
    return { uid: state.uid++, id, star, route: null };
  }

  function unitStats(unit) {
    const c = characters[unit.id];
    const m = STAR[unit.star];
    const t = state.training[unit.id] || 0;
    const train = 1 + t * .08;
    return {
      maxHp: Math.round(c.base.hp * m.hp * train),
      atk: Math.round(c.base.atk * m.atk * train),
      range: c.base.range * 42,
      speed: c.base.speed * 70,
      scienceMax: m.science
    };
  }

  function render() {
    const stage = stages[state.currentStage];
    el.stageTitle.textContent = `Chapter ${stage.id} ${stage.name}`;
    el.inspirationText.textContent = state.inspiration;
    el.teamText.textContent = `${state.board.filter(Boolean).length}/24`;
    el.poolText.textContent = state.unlocked.length ? `소환 풀: ${state.unlocked.map(id => characters[id].short).join(", ")}` : "1-1 클리어 후 동료 해금";
    renderStages();
    renderBoard();
    renderBench();
    renderInfo();
    el.summonBtn.disabled = state.unlocked.length === 0 || state.inspiration < SUMMON_COST || !state.bench.some(x => !x);
    el.cleanBtn.disabled = state.formationRows >= 4 || state.inspiration < 6;
    el.cleanBtn.textContent = state.formationRows >= 4 ? "진영 최대" : `진영 확장 ${state.formationRows}/4`;
  }

  function renderStages() {
    el.stageList.innerHTML = "";
    stages.forEach((stage, i) => {
      const d = document.createElement("div");
      d.className = `stage ${i === state.currentStage ? "current" : ""} ${i <= state.cleared ? "clear" : ""}`;
      d.textContent = stage.id;
      el.stageList.appendChild(d);
    });
  }

  function renderBoard() {
    el.board.innerHTML = "";
    state.board.forEach((unit, i) => {
      const row = Math.floor(i / 6);
      const locked = row < 4 - state.formationRows;
      const cell = document.createElement("div");
      cell.className = `cell ${locked ? "locked" : ""} ${row >= 2 ? "front" : ""}`;
      if (!locked) {
        bindDrop(cell, "board", i);
        cell.addEventListener("click", () => selectOrMove("board", i));
      }
      if (unit) cell.appendChild(unitCard(unit, isSelected("board", i)));
      el.board.appendChild(cell);
    });
  }

  function renderBench() {
    el.bench.innerHTML = "";
    state.bench.forEach((unit, i) => {
      const slot = document.createElement("div");
      slot.className = `slot ${unit ? "" : "empty"}`;
      bindDrop(slot, "bench", i);
      slot.addEventListener("click", () => selectOrMove("bench", i));
      if (unit) slot.appendChild(unitCard(unit, isSelected("bench", i)));
      el.bench.appendChild(slot);
    });
  }

  function unitCard(unit, selected) {
    const c = characters[unit.id];
    const card = document.createElement("div");
    card.className = `unit-card ${selected ? "selected" : ""}`;
    card.draggable = true;
    card.style.setProperty("--c", c.color);
    card.innerHTML = `<img src="${spriteThumbs[c.sprite] || `${SPRITE_BASE}${c.sprite}.png`}" alt=""><span class="unit-name">${c.short}</span><span class="stars">${"★".repeat(unit.star)}</span>${unit.route ? `<span class="route">${unit.route}</span>` : ""}`;
    card.addEventListener("dragstart", () => { dragSource = selectedLocationOf(unit.uid); });
    return card;
  }

  function bindDrop(target, to, index) {
    target.addEventListener("dragover", event => event.preventDefault());
    target.addEventListener("drop", event => {
      event.preventDefault();
      if (dragSource) moveOrMerge(dragSource.from, dragSource.index, to, index);
      dragSource = null;
    });
  }

  function selectedLocationOf(uid) {
    let i = state.board.findIndex(u => u && u.uid === uid);
    if (i >= 0) return { from: "board", index: i };
    i = state.bench.findIndex(u => u && u.uid === uid);
    return i >= 0 ? { from: "bench", index: i } : null;
  }

  function isSelected(from, index) {
    return state.selected && state.selected.from === from && state.selected.index === index;
  }

  function getArray(from) {
    return from === "board" ? state.board : state.bench;
  }

  function selectOrMove(to, index) {
    const arr = getArray(to);
    if (!state.selected || !getArray(state.selected.from)[state.selected.index]) {
      if (arr[index]) state.selected = { from: to, index };
      render();
      return;
    }
    if (isSelected(to, index)) {
      render();
      return;
    }
    moveOrMerge(state.selected.from, state.selected.index, to, index);
  }

  function moveOrMerge(from, fromIndex, to, toIndex) {
    if (to === "board" && isBoardLocked(toIndex)) {
      toast("아직 확장되지 않은 진영입니다.");
      return;
    }
    const a = getArray(from);
    const b = getArray(to);
    const source = a[fromIndex];
    const target = b[toIndex];
    if (!source) return;
    if (target && canMerge(source, target)) {
      if (source.id === "doan") return toast("정도안은 합성 대상이 아닙니다.");
      const next = makeUnit(source.id, source.star + 1);
      next.route = source.route || target.route;
      b[toIndex] = next;
      a[fromIndex] = null;
      state.selected = { from: to, index: toIndex };
      if (next.star === 4 && !next.route) openRouteModal(next, to, toIndex);
      else toast(`${characters[next.id].short} ${next.star}성 합성`);
    } else if (!target) {
      b[toIndex] = source;
      a[fromIndex] = null;
      state.selected = { from: to, index: toIndex };
    } else {
      b[toIndex] = source;
      a[fromIndex] = target;
      state.selected = { from: to, index: toIndex };
    }
    render();
  }

  function canMerge(a, b) {
    return a.id === b.id && a.star === b.star && a.star < 7 && a.id !== "doan";
  }

  function isBoardLocked(index) {
    const row = Math.floor(index / 6);
    return row < 4 - state.formationRows;
  }

  function openRouteModal(unit, from, index) {
    const c = characters[unit.id];
    openModal("4성 분기 선택", `${c.name}의 강화 방향을 선택합니다. 5성~7성 효과가 이 루트를 따릅니다.`, [
      { title: c.routes.A, text: `${c.skill1.name} 강화`, img: c.sprite, action: () => setRoute(from, index, "A") },
      { title: c.routes.B, text: `${c.skill2.name} 강화`, img: c.sprite, action: () => setRoute(from, index, "B") }
    ]);
  }

  function setRoute(from, index, route) {
    const unit = getArray(from)[index];
    if (unit) unit.route = route;
    closeModal();
    toast(`${characters[unit.id].short} ${route} 루트 선택`);
    render();
  }

  function renderInfo() {
    const selected = state.selected && getArray(state.selected.from)[state.selected.index];
    const unit = selected || state.board.find(Boolean);
    if (!unit) return;
    const c = characters[unit.id];
    const s = unitStats(unit);
    const routeText = unit.route ? `${unit.route}: ${c.routes?.[unit.route]}` : c.routes ? "4성에서 루트 선택" : "고정";
    el.info.innerHTML = `
      <div class="info-head"><span>${c.name}</span><small>${unit.star}성 / ${routeText}</small></div>
      <div class="info-desc">${c.role}</div>
      <div class="stat-row">
        <span><b>체력</b>${s.maxHp}</span><span><b>공격</b>${s.atk}</span><span><b>과학력</b>${s.scienceMax}</span>
      </div>
      <div class="skill-grid">
        <div class="skill"><b>기본: ${c.basic.name}</b>${c.basic.text}</div>
        <div class="skill"><b>스킬1: ${c.skill1.name}</b>${c.skill1.text}</div>
        <div class="skill"><b>스킬2: ${c.skill2.name}</b>${c.skill2.text}</div>
        <div class="skill"><b>패시브: ${c.passive.name}</b>${c.passive.text}</div>
      </div>`;
  }

  function summon() {
    const empty = state.bench.findIndex(x => !x);
    if (empty < 0 || state.inspiration < SUMMON_COST || !state.unlocked.length) return;
    const id = choice(state.unlocked);
    const star = Math.random() < .12 ? 2 : 1;
    state.bench[empty] = makeUnit(id, star);
    state.inspiration -= SUMMON_COST;
    state.selected = { from: "bench", index: empty };
    toast(`${characters[id].name} ${star}성 소환`);
    render();
  }

  function expandFormation() {
    if (state.formationRows >= 4) return toast("이미 모든 진영을 사용 중입니다.");
    if (state.inspiration < 6) return toast("진영 확장에는 영감 6이 필요합니다.");
    state.inspiration -= 6;
    state.formationRows += 1;
    toast(`진영 확장: ${state.formationRows}행 사용 가능`);
    render();
  }

  function startBattle() {
    const units = state.board.map((u, cell) => u ? { ...u, cell } : null).filter(Boolean);
    if (!units.some(u => u.id !== "doan")) toast("정도안만으로도 출전하지만, 동료 배치가 중요합니다.");
    el.prep.classList.remove("active");
    el.battle.classList.add("active");
    state.phase = "battle";
    battle = createBattle(units);
    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function createBattle(units) {
    const stage = stages[state.currentStage];
    const allies = units.map(unit => {
      const c = characters[unit.id];
      const s = unitStats(unit);
      const col = unit.cell % 6;
      const row = Math.floor(unit.cell / 6);
      return {
        side: "ally", ...unit, def: c, stats: s, hp: s.maxHp, science: 20, maxHp: s.maxHp,
        x: ARENA.x + 34 + col * 52, y: ARENA.y + ARENA.h - 56 - (3 - row) * 58,
        r: unit.id === "doan" ? 13 : 12, atkCd: Math.random() * .4, skillCd: 1.2, skill2Cd: 3.8, rec: 0, shield: 0, alive: true, lastHitBy: null
      };
    });
    const enemies = stage.enemies.map((type, i) => makeEnemy(type, i, stage.mul));
    return {
      t: 0, status: "run", paused: false, speed: 1, allies, enemies, projectiles: [], zones: [], plants: [], texts: [],
      scienceSlow: 1, log: "전투 개시. 방송부 장비가 켜집니다.", noteCd: 0
    };
  }

  function makeEnemy(type, i, mul) {
    const d = enemyDefs[type];
    const col = i % 3;
    const row = Math.floor(i / 3);
    return {
      side: "enemy", type, def: d, x: ARENA.x + 70 + col * 92 + (row % 2) * 28, y: ARENA.y + 72 + row * 58,
      r: type === "boss" ? 20 : type === "miniboss" ? 17 : 13,
      maxHp: Math.round(d.hp * mul), hp: Math.round(d.hp * mul), atk: Math.round(d.atk * mul),
      speed: d.speed * 58, range: d.range * 42, atkCd: .5 + Math.random(), skillCd: 1 + Math.random() * 2, buff: 0, marked: 0, slow: 0, lastHitBy: null
    };
  }

  function loop(now) {
    if (!battle || battle.status !== "run") return;
    const raw = Math.min(.033, (now - lastTime) / 1000);
    lastTime = now;
    const dt = battle.paused ? 0 : raw * battle.speed;
    if (dt) updateBattle(dt);
    drawBattle();
    requestAnimationFrame(loop);
  }

  function updateBattle(dt) {
    battle.t += dt;
    battle.noteCd = Math.max(0, battle.noteCd - dt);
    battle.scienceSlow = battle.enemies.some(e => e.type === "mic" && e.hp > 0) ? .52 : 1;
    battle.allies.forEach(a => updateAlly(a, dt));
    battle.enemies.forEach(e => updateEnemy(e, dt));
    applyPangaea(dt);
    battle.plants.forEach(p => updatePlant(p, dt));
    updateProjectiles(dt);
    updateZones(dt);
    battle.allies.forEach(a => a.alive = a.hp > 0);
    battle.enemies = battle.enemies.filter(e => e.hp > 0);
    battle.plants = battle.plants.filter(p => p.hp > 0 && p.life > 0);
    battle.texts = battle.texts.filter(t => (t.life -= dt) > 0);
    if (!battle.enemies.length) finishBattle(true);
    if (!battle.allies.some(a => a.hp > 0)) finishBattle(false);
    el.battleStats.textContent = `아군 ${battle.allies.filter(a => a.hp > 0).length} / 적 ${battle.enemies.length} / 적HP ${Math.max(0, Math.round(battle.enemies.reduce((s, e) => s + e.hp, 0)))}`;
    el.battleLog.textContent = battle.log;
  }

  function updateAlly(a, dt) {
    if (a.hp <= 0) return;
    a.atkCd -= dt;
    a.skillCd -= dt;
    a.skill2Cd -= dt;
    a.rec = Math.max(0, a.rec - dt);
    a.shield = Math.max(0, a.shield - dt);
    a.science = Math.min(a.stats.scienceMax, a.science + 18 * battle.scienceSlow * dt);
    const target = chooseAllyTarget(a);
    if (!target) return;
    moveAlly(a, target, dt);
    if (distance(a, target) <= a.stats.range && a.atkCd <= 0) basicAttack(a, target);
    if (a.science >= a.stats.scienceMax && a.skillCd <= 0) {
      useSkill1(a, target);
      a.science = 0;
      a.skillCd = 3.1 - Math.min(.7, a.star * .05);
    }
    if (a.star >= 4 && a.skill2Cd <= 0) {
      useSkill2(a, target);
      a.skill2Cd = 5.4 - Math.min(1.2, a.star * .12);
    }
  }

  function chooseAllyTarget(a) {
    if (a.def.ai === "ranged" || a.def.ai === "control" || a.def.ai === "bruiser") return densestEnemy(a);
    return nearest(a, battle.enemies);
  }

  function moveAlly(a, target, dt) {
    if (a.id === "doan" && !el.doanAutoToggle.checked) {
      const input = getInputVector();
      if (Math.hypot(input.x, input.y) > .08) {
        moveBy(a, input.x * a.stats.speed * dt, input.y * a.stats.speed * dt);
        return;
      }
      return;
    }
    const ideal = a.def.ai === "tank" || a.def.ai === "bruiser" ? a.stats.range * .74 : a.stats.range * .92;
    const d = distance(a, target);
    if (d > ideal) moveToward(a, target.x, target.y, a.stats.speed * dt);
    if (d < ideal - 18 && !["tank", "bruiser"].includes(a.def.ai)) moveToward(a, a.x - (target.x - a.x), a.y - (target.y - a.y), a.stats.speed * .72 * dt);
  }

  function basicAttack(a, target) {
    const cd = ["tank", "bruiser"].includes(a.def.ai) ? .86 : .64;
    fire(a, target, a.stats.atk, a.def.weapon);
    if (a.id === "newton" && Math.random() < .18) addZone(target.x, target.y, 30, .35, a.stats.atk * .55, "ally", "gravity", "rgba(112,183,255,.18)");
    a.atkCd = cd;
    target.lastHitBy = a.uid;
    if (a.id === "doan") target.marked = 4;
  }

  function useSkill1(a, target) {
    const p = routePower(a, 1);
    if (a.id === "doan") {
      const count = a.star >= 7 && a.route === "A" ? battle.enemies.length : Math.min(battle.enemies.length, 1 + Math.floor(a.star / 2));
      battle.enemies.slice().sort((x, y) => distance(x, target) - distance(y, target)).slice(0, count).forEach(e => {
        e.marked = 5 + a.star * .25;
        hit(e, a.stats.atk * 1.1 * p, a);
      });
      battle.allies.forEach(x => { if (x.hp > 0) x.science = Math.min(x.stats.scienceMax, x.science + 18); });
      battle.log = "정도안: 관찰 표식과 과학력 회복.";
    } else if (a.id === "newton") {
      addZone(target.x, target.y, 54 + a.star * 2, 1.2, a.stats.atk * 1.7 * p, "ally", "gravity", "rgba(112,183,255,.24)");
      if (a.star >= 7 && a.route === "A") addZone(target.x, target.y, 92, 1.6, a.stats.atk * 2.2, "ally", "gravity", "rgba(112,183,255,.32)");
      battle.log = "뉴턴: 사과 낙하.";
    } else if (a.id === "lavoisier") {
      addZone(target.x, target.y, 58 + a.star * 2, 2.4 * durationBonus(a), a.stats.atk * .55 * p, "ally", "fire", "rgba(255,143,98,.25)");
      battle.log = "라부아지에: 알코올램프 장판.";
    } else if (a.id === "mendel") {
      const count = a.route === "A" && a.star >= 5 ? 4 : 2;
      for (let i = 0; i < count; i++) fire(a, target, a.stats.atk * .7 * p, "pea", (i - (count - 1) / 2) * .18);
      battle.log = "멘델: 완두콩 연사.";
    } else if (a.id === "faraday") {
      chainDamage(target, a.stats.atk * 1.25 * p, 110 + a.star * 3, a.star >= 7 && a.route === "A" ? 8 : a.star >= 5 && a.route === "A" ? 5 : 3, a);
      battle.log = "패러데이: 전류 연쇄.";
    } else if (a.id === "wegener") {
      fissure(a, target, a.stats.atk * 1.15 * p);
      battle.log = "베게너: 지각 변동.";
    }
  }

  function useSkill2(a, target) {
    const p = routePower(a, 2);
    if (a.id === "doan") {
      const best = battle.allies.filter(x => x.hp > 0).sort((x, y) => y.star - x.star || y.stats.atk - x.stats.atk)[0];
      if (best) {
        best.science = Math.min(best.stats.scienceMax, best.science + 46 * p);
        if (a.star >= 7 && a.route === "B") {
          best.skillCd = 0;
          best.skill2Cd = Math.min(best.skill2Cd, .2);
        }
      }
      battle.noteCd = Math.max(0, battle.noteCd - 2);
      battle.log = "정도안: 현상화.";
    } else if (a.id === "newton") {
      laser(a, target, a.stats.atk * 1.7 * p);
      if (a.star >= 7 && a.route === "B") {
        laser(a, { x: target.x + 30, y: target.y - 18 }, a.stats.atk * 1.05);
        laser(a, { x: target.x + 30, y: target.y + 18 }, a.stats.atk * 1.05);
      }
      battle.log = "뉴턴: 레이저.";
    } else if (a.id === "lavoisier") {
      addZone(a.x, a.y, 70 + a.star * 3, 3.2 * durationBonus(a), 0, "ally", "oxygen", "rgba(142,224,255,.2)");
      battle.allies.forEach(x => { if (distance(a, x) < 95) { x.shield = 4; x.hp = Math.min(x.maxHp, x.hp + a.stats.atk * .8 * p); } });
      battle.log = "라부아지에: 산소 공급 구역.";
    } else if (a.id === "mendel") {
      plant(a, p);
      if (a.star >= 7 && a.route === "B") {
        plant(a, p * .9);
        plant(a, p * .9);
      }
      battle.log = "멘델: 식물 심기.";
    } else if (a.id === "faraday") {
      addZone(target.x, target.y, 72 + a.star * 4, 1.5, a.stats.atk * .38 * p, "ally", "magnet", "rgba(183,140,255,.2)");
      if (a.star >= 7 && a.route === "B") addZone(target.x, target.y, 118, 2.2, a.stats.atk * .5, "ally", "magnet", "rgba(183,140,255,.28)");
      battle.log = "패러데이: 자석.";
    } else if (a.id === "wegener") {
      battle.enemies.forEach(e => { if (distance(e, target) < 130) { moveToward(e, target.x, target.y, 42); hit(e, a.stats.atk * .9 * p, a); } });
      if (a.star >= 7 && a.route === "B") addZone(target.x, target.y, 76, 2.4, a.stats.atk * .42, "ally", "lava", "rgba(255,92,38,.25)");
      battle.log = "베게너: 대륙 이동.";
    }
  }

  function routePower(a, skillNo) {
    let p = 1;
    if (a.star >= 5 && ((skillNo === 1 && a.route === "A") || (skillNo === 2 && a.route === "B"))) p += .2;
    if (a.star >= 6 && ((skillNo === 1 && a.route === "A") || (skillNo === 2 && a.route === "B"))) p += .22;
    if (a.star >= 7 && ((skillNo === 1 && a.route === "A") || (skillNo === 2 && a.route === "B"))) p += .35;
    return p;
  }

  function durationBonus(a) {
    return a.id === "lavoisier" ? 1.3 + (a.star >= 7 ? .25 : 0) : 1;
  }

  function updateEnemy(e, dt) {
    if (e.hp <= 0) return;
    e.atkCd -= dt * (e.buff > 0 ? 1.35 : 1);
    e.skillCd -= dt;
    e.buff = Math.max(0, e.buff - dt);
    e.marked = Math.max(0, e.marked - dt);
    e.slow = Math.max(0, e.slow - dt);
    const target = chooseEnemyTarget(e);
    if (!target) return;
    if (distance(e, target) > e.range) moveToward(e, target.x, target.y, e.speed * (e.slow > 0 ? .55 : 1) * dt);
    if (distance(e, target) <= e.range && e.atkCd <= 0) {
      fire(e, target, e.atk * (e.buff > 0 ? 1.28 : 1), e.type);
      e.atkCd = 1;
    }
    if (e.skillCd <= 0) enemySkill(e);
  }

  function applyPangaea(dt) {
    const wegener = battle.allies.find(a => a.hp > 0 && a.id === "wegener");
    if (!wegener || battle.enemies.length < 2) return;
    const center = battle.enemies.reduce((p, e) => ({ x: p.x + e.x / battle.enemies.length, y: p.y + e.y / battle.enemies.length }), { x: 0, y: 0 });
    const force = (wegener.star >= 7 ? 18 : 9) * dt;
    battle.enemies.forEach(e => {
      if (distance(e, center) > 42) {
        moveToward(e, center.x, center.y, force);
        e.slow = Math.max(e.slow, .12);
      }
    });
  }

  function chooseEnemyTarget(e) {
    let best = null;
    let bestScore = Infinity;
    battle.allies.forEach(a => {
      if (a.hp <= 0) return;
      let score = distance(e, a);
      const row = Math.floor(a.cell / 6);
      if (row === 3) score /= 1.4;
      if (row === 2) score /= 1.2;
      if (a.uid === e.lastHitBy) score /= 1.25;
      if (a.rec > 0) score /= 1.8;
      if (a.hp / a.maxHp < .35) score /= 1.18;
      if (score < bestScore) { bestScore = score; best = a; }
    });
    return best;
  }

  function enemySkill(e) {
    if (e.type === "camera") {
      const target = battle.allies.filter(a => a.hp > 0).sort((a, b) => b.star - a.star || b.stats.atk - a.stats.atk)[0];
      if (target) target.rec = 5;
      battle.log = "카메라: REC 표식.";
      e.skillCd = 4.2;
    } else if (e.type === "mic") {
      battle.log = "마이크: 과학력 회복 방해.";
      e.skillCd = 5;
    } else if (e.type === "light") {
      const target = choice(battle.allies.filter(a => a.hp > 0));
      if (target) addZone(target.x, target.y, 44, 2.4, e.atk * .7, "enemy", "spotlight", "rgba(255,225,110,.26)");
      battle.log = "조명: 집중 조명.";
      e.skillCd = 4.5;
    } else if (e.type === "editor") {
      battle.enemies.forEach(x => { if (x !== e && distance(e, x) < 95) x.buff = 3.6; });
      battle.log = "편집: 주변 적 강화.";
      e.skillCd = 4.8;
    } else if (e.type === "miniboss") {
      const target = chooseEnemyTarget(e);
      if (target) target.rec = 4;
      addZone(e.x, e.y + 34, 62, 2, e.atk * .65, "enemy", "spotlight", "rgba(255,120,150,.22)");
      battle.log = "생방송 리허설.";
      e.skillCd = 3.5;
    } else if (e.type === "boss") {
      bossPattern(e);
      e.skillCd = 2.6;
    }
  }

  function bossPattern(e) {
    const p = Math.floor(battle.t / 2.6) % 5;
    if (p === 0) battle.enemies.forEach(x => x.buff = 3.2);
    if (p === 1) {
      const target = battle.allies.filter(a => a.hp > 0).sort((a, b) => b.star - a.star)[0];
      if (target) target.rec = 5;
    }
    if (p === 2) battle.scienceSlow = .3;
    if (p === 3) battle.allies.forEach(a => { if (a.hp > 0) addZone(a.x, a.y, 35, 1.7, e.atk * .55, "enemy", "spotlight", "rgba(255,225,110,.22)"); });
    if (p === 4) battle.allies.forEach(a => { if (a.hp > 0 && distance(e, a) < 150) hit(a, e.atk * .7, e); });
    battle.log = ["생방송 시작", "카메라 포커스", "음향 사고", "집중 조명", "클로징 멘트"][p];
  }

  function updatePlant(p, dt) {
    p.life -= dt;
    p.atkCd -= dt;
    const target = nearest(p, battle.enemies);
    if (target && p.atkCd <= 0) {
      fire(p, target, p.atk, "pea");
      p.atkCd = .58;
    }
  }

  function fire(from, target, dmg, kind, spread = 0) {
    const angle = Math.atan2(target.y - from.y, target.x - from.x) + spread;
    battle.projectiles.push({
      x: from.x, y: from.y, vx: Math.cos(angle) * 340, vy: Math.sin(angle) * 340, target,
      dmg, kind, side: from.side || "ally", owner: from.uid, color: from.def?.color || from.color || "#fff", life: 1.6
    });
  }

  function updateProjectiles(dt) {
    battle.projectiles.forEach(p => {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const targets = p.side === "enemy" ? battle.allies.filter(a => a.hp > 0) : battle.enemies;
      const hitTarget = targets.find(t => distance(p, t) < t.r + 5);
      if (hitTarget) {
        const owner = battle.allies.find(a => a.uid === p.owner) || battle.enemies.find(e => e === p.owner);
        hit(hitTarget, p.dmg, owner || p);
        if (p.kind === "flask") {
          battle.enemies.forEach(e => { if (e !== hitTarget && distance(e, hitTarget) < 36) hit(e, p.dmg * .45, owner || p); });
          addZone(hitTarget.x, hitTarget.y, 30, .28, p.dmg * .18, "ally", "fire", "rgba(255,143,98,.18)");
        }
        if (p.kind === "pea" && owner?.id === "mendel" && Math.random() < (owner.star >= 7 && owner.route === "A" ? .72 : .36)) {
          fire(owner, hitTarget, p.dmg * .42, "pea", -.32);
          fire(owner, hitTarget, p.dmg * .42, "pea", .32);
        }
        if (p.kind === "current" && owner?.id === "faraday") chainDamage(hitTarget, p.dmg * .48, 76, 2, owner);
        if (p.kind === "rock") moveBy(hitTarget, Math.sign(p.vx || 1) * 16, Math.sign(p.vy || 1) * 10);
        p.life = 0;
      }
      if (!insideArena(p, 4)) p.life = 0;
    });
    battle.projectiles = battle.projectiles.filter(p => p.life > 0);
  }

  function addZone(x, y, r, life, dmg, side, kind, color) {
    const lavoisier = battle.allies.find(a => a.hp > 0 && a.id === "lavoisier" && distance(a, { x, y }) < 120);
    const finalLife = side === "ally" && lavoisier ? life * durationBonus(lavoisier) : life;
    battle.zones.push({ x: clamp(x, ARENA.x + r, ARENA.x + ARENA.w - r), y: clamp(y, ARENA.y + r, ARENA.y + ARENA.h - r), r, life: finalLife, maxLife: finalLife, tick: .05, dmg, side, kind, color });
  }

  function updateZones(dt) {
    battle.zones.forEach(z => {
      z.life -= dt;
      z.tick -= dt;
      if (z.kind === "gravity" || z.kind === "magnet") {
        battle.enemies.forEach(e => { if (distance(z, e) < z.r) { moveToward(e, z.x, z.y, (z.kind === "magnet" ? 32 : 22) * dt); e.slow = .25; } });
      }
      if (z.tick <= 0) {
        const targets = z.side === "enemy" ? battle.allies.filter(a => a.hp > 0) : battle.enemies;
        targets.forEach(t => { if (distance(z, t) < z.r && z.dmg > 0) hit(t, z.dmg, z); });
        if (z.kind === "oxygen") battle.allies.forEach(a => { if (a.hp > 0 && distance(z, a) < z.r) a.hp = Math.min(a.maxHp, a.hp + 5); });
        z.tick = .45;
      }
      if (z.life <= 0 && !z.exploded && (z.kind === "fire" || z.kind === "lava")) {
        z.exploded = true;
        battle.enemies.forEach(e => { if (distance(z, e) < z.r + 18) hit(e, (z.dmg || 8) * (z.kind === "lava" ? 2.2 : 1.4), z); });
        text(z.x, z.y, z.kind === "lava" ? "화산" : "폭발", "#ffb15d");
      }
    });
    battle.zones = battle.zones.filter(z => z.life > 0);
  }

  function hit(target, amount, source) {
    let final = amount;
    if (target.rec > 0) final *= 1.18;
    if (target.marked > 0) final *= 1.18;
    if (target.shield > 0) final *= .72;
    if (target.side === "ally" && target.id === "newton" && Math.floor(target.cell / 6) >= 2) final *= .82;
    if (target.side === "enemy" && target.slow > 0 && battle.allies.some(a => a.hp > 0 && a.id === "faraday")) final *= 1.12;
    target.hp -= final;
    if (source?.uid) target.lastHitBy = source.uid;
    if (source?.id === "mendel" && target.side === "enemy") applyMendelGene(target, source);
    text(target.x, target.y - target.r, Math.round(final), target.side === "enemy" ? "#ffe6a1" : "#ff9d9d");
  }

  function applyMendelGene(target, source) {
    target.geneHits ||= {};
    target.geneHits[source.uid] = (target.geneHits[source.uid] || 0) + 1;
    if (target.geneHits[source.uid] === 3) {
      fire(source, target, source.stats.atk * .45, "pea", rand(-.24, .24));
    }
    if (target.geneHits[source.uid] === 5) {
      target.slow = Math.max(target.slow, 1.2);
      target.geneHits[source.uid] = 0;
    }
  }

  function chainDamage(start, dmg, range, count, owner) {
    let current = start;
    const hitSet = new Set();
    for (let i = 0; i < count && current; i++) {
      hitSet.add(current);
      hit(current, dmg * Math.pow(.72, i), owner);
      current.slow = .4;
      current = battle.enemies.filter(e => !hitSet.has(e) && distance(e, current) < range).sort((a, b) => distance(a, current) - distance(b, current))[0];
    }
  }

  function laser(a, target, dmg) {
    const angle = Math.atan2(target.y - a.y, target.x - a.x);
    battle.enemies.forEach(e => {
      const forward = (e.x - a.x) * Math.cos(angle) + (e.y - a.y) * Math.sin(angle);
      const side = Math.abs((e.x - a.x) * Math.sin(angle) - (e.y - a.y) * Math.cos(angle));
      if (forward > 0 && side < 18) hit(e, dmg, a);
    });
    battle.zones.push({ x: (a.x + target.x) / 2, y: (a.y + target.y) / 2, r: 8, life: .18, maxLife: .18, tick: 9, dmg: 0, side: "ally", kind: "laser", color: "rgba(120,185,255,.38)", x2: target.x, y2: target.y, x1: a.x, y1: a.y });
  }

  function fissure(a, target, dmg) {
    const angle = Math.atan2(target.y - a.y, target.x - a.x);
    battle.enemies.forEach(e => {
      const forward = (e.x - a.x) * Math.cos(angle) + (e.y - a.y) * Math.sin(angle);
      const side = Math.abs((e.x - a.x) * Math.sin(angle) - (e.y - a.y) * Math.cos(angle));
      const length = a.star >= 7 && a.route === "A" ? 220 : 145;
      const width = a.star >= 7 && a.route === "A" ? 42 : 26;
      if (forward > 0 && forward < length && side < width) {
        hit(e, dmg * (a.star >= 7 && a.route === "A" ? 1.45 : 1), a);
        moveBy(e, Math.cos(angle) * (a.star >= 7 ? 30 : 18), Math.sin(angle) * (a.star >= 7 ? 30 : 18));
        if (a.star >= 7 && a.route === "A") e.slow = Math.max(e.slow, 1);
      }
    });
    addZone(a.x + Math.cos(angle) * 70, a.y + Math.sin(angle) * 70, a.star >= 7 && a.route === "A" ? 72 : 42, .32, 0, "ally", "fissure", "rgba(201,154,105,.25)");
  }

  function plant(a, power) {
    battle.plants.push({ side: "ally", x: clamp(a.x + rand(-36, 36), ARENA.x + 12, ARENA.x + ARENA.w - 12), y: clamp(a.y + rand(-26, 26), ARENA.y + 12, ARENA.y + ARENA.h - 12), r: 10, hp: 120 + a.star * 25, life: 8 + a.star, atk: a.stats.atk * .7 * power, atkCd: .2, color: a.def.color });
  }

  function noteSkill() {
    const doan = battle?.allies.find(a => a.id === "doan" && a.hp > 0);
    if (!doan || battle.noteCd > 0 || battle.status !== "run") return;
    battle.enemies.forEach(e => { e.marked = doan.star >= 7 && doan.route === "A" ? 8 : 5; hit(e, doan.stats.atk * (doan.star >= 7 ? 1.25 : .9), doan); });
    battle.allies.forEach(a => { if (a.hp > 0) a.science = Math.min(a.stats.scienceMax, a.science + 30); });
    if (doan.star >= 7 && doan.route === "B") {
      const best = battle.allies.filter(a => a.hp > 0 && a.id !== "doan").sort((a, b) => b.star - a.star || b.stats.atk - a.stats.atk)[0];
      if (best) {
        best.skillCd = 0;
        best.skill2Cd = 0;
      }
    }
    battle.noteCd = 8;
    battle.log = "노트 스킬: 전장 전체 관찰.";
  }

  function finishBattle(win) {
    if (battle.status !== "run") return;
    battle.status = win ? "win" : "lose";
    drawBattle();
    setTimeout(() => {
      el.battle.classList.remove("active");
      el.prep.classList.add("active");
      state.phase = "prep";
      if (win) {
        state.cleared = Math.max(state.cleared, state.currentStage);
        state.inspiration += 3 + Math.floor(state.currentStage / 2);
        if (state.currentStage === 0 && !state.unlocked.length) openRecruitReward();
        else if (state.currentStage >= stages.length - 1) openModal("Chapter 1 클리어", "방송부장을 이겼습니다. 현재 버전은 여기까지입니다.", [{ title: "확인", text: "준비 화면으로", action: closeModal }]);
        else openStageReward();
        state.currentStage = Math.min(stages.length - 1, state.currentStage + 1);
      } else {
        toast("패배. 정도안이 쓰러져도 계속되지만 동료 전멸은 패배입니다.");
      }
      render();
    }, 900);
  }

  function openRecruitReward() {
    const picks = shuffle(allyPool).slice(0, 3).map(id => ({
      title: characters[id].name,
      text: "소환 풀에 추가하고 1성 합류",
      img: characters[id].sprite,
      action: () => {
        if (!state.unlocked.includes(id)) state.unlocked.push(id);
        addToBench(makeUnit(id, 1));
        closeModal();
        render();
      }
    }));
    openModal("첫 동료 후보", "세 명 중 한 명을 전설부에 합류시킵니다.", picks);
  }

  function openStageReward() {
    const locked = allyPool.filter(id => !state.unlocked.includes(id));
    const choices = [];
    if (locked.length) {
      const id = choice(locked);
      choices.push({ title: "새 동료 후보", text: `${characters[id].short} 해금`, img: characters[id].sprite, action: () => { state.unlocked.push(id); addToBench(makeUnit(id, 1)); closeModal(); render(); } });
    }
    choices.push({ title: "영감 +6", text: "동료 소환 재화", action: () => { state.inspiration += 6; closeModal(); render(); } });
    const doan = getDoanUnit();
    if (doan && doan.star < 7) {
      choices.push({ title: "노트 강화", text: `정도안 ${doan.star}성 → ${doan.star + 1}성`, img: characters.doan.sprite, action: upgradeDoan });
    }
    const ownedIds = unique([...state.board, ...state.bench].filter(Boolean).map(u => u.id).filter(id => id !== "doan"));
    const trainId = ownedIds.length ? choice(ownedIds) : "doan";
    choices.push({ title: "캐릭터 강화", text: `${characters[trainId].short} 체력/공격 +8%`, img: characters[trainId].sprite, action: () => { state.training[trainId] = (state.training[trainId] || 0) + 1; closeModal(); render(); } });
    openModal("스테이지 보상", "다음 방송부 기믹에 대비할 보상을 선택하세요.", choices.slice(0, 3));
  }

  function getDoanUnit() {
    return state.board.find(u => u && u.id === "doan") || state.bench.find(u => u && u.id === "doan");
  }

  function upgradeDoan() {
    const loc = selectedLocationOf(getDoanUnit()?.uid);
    const doan = loc && getArray(loc.from)[loc.index];
    if (!doan || doan.star >= 7) return;
    doan.star += 1;
    closeModal();
    if (doan.star === 4 && !doan.route) openRouteModal(doan, loc.from, loc.index);
    else {
      toast(`정도안 ${doan.star}성 강화`);
      render();
    }
  }

  function addToBench(unit) {
    const i = state.bench.findIndex(x => !x);
    if (i >= 0) state.bench[i] = unit;
  }

  function openModal(title, textValue, choices) {
    el.modalTitle.textContent = title;
    el.modalText.textContent = textValue;
    el.modalChoices.innerHTML = "";
    choices.forEach(ch => {
      const b = document.createElement("button");
      b.className = "choice";
      b.innerHTML = `${ch.img ? `<img src="${spriteThumbs[ch.img] || `${SPRITE_BASE}${ch.img}.png`}" alt="">` : ""}<b>${ch.title}</b><small>${ch.text || ""}</small>`;
      b.addEventListener("click", ch.action);
      el.modalChoices.appendChild(b);
    });
    el.modal.classList.add("active");
    el.modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    el.modal.classList.remove("active");
    el.modal.setAttribute("aria-hidden", "true");
  }

  function prepareSprite(id, img) {
    spriteMeta[id] = { sx: 0, sy: 0, sw: img.naturalWidth || img.width, sh: img.naturalHeight || img.height };
    try {
      const scan = document.createElement("canvas");
      scan.width = img.naturalWidth || img.width;
      scan.height = img.naturalHeight || img.height;
      const scanCtx = scan.getContext("2d", { willReadFrequently: true });
      scanCtx.drawImage(img, 0, 0);
      const pixels = scanCtx.getImageData(0, 0, scan.width, scan.height).data;
      let minX = scan.width, minY = scan.height, maxX = -1, maxY = -1;
      for (let y = 0; y < scan.height; y += 1) {
        for (let x = 0; x < scan.width; x += 1) {
          if (pixels[(y * scan.width + x) * 4 + 3] <= 12) continue;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      if (maxX >= minX && maxY >= minY) {
        const pad = 3;
        const sx = Math.max(0, minX - pad);
        const sy = Math.max(0, minY - pad);
        const ex = Math.min(scan.width, maxX + pad + 1);
        const ey = Math.min(scan.height, maxY + pad + 1);
        spriteMeta[id] = { sx, sy, sw: ex - sx, sh: ey - sy };
      }
      spriteThumbs[id] = makeSpriteThumb(img, spriteMeta[id]);
      if (state.phase === "prep") render();
    } catch {
      spriteThumbs[id] = img.src;
    }
  }

  function makeSpriteThumb(img, source) {
    const targetH = 96;
    const targetW = Math.max(1, Math.round(targetH * source.sw / source.sh));
    const c = document.createElement("canvas");
    c.width = targetW;
    c.height = targetH;
    const cctx = c.getContext("2d");
    cctx.drawImage(img, source.sx, source.sy, source.sw, source.sh, 0, 0, targetW, targetH);
    return c.toDataURL("image/png");
  }

  function drawCroppedSprite(img, id, x, y, targetH, alpha = 1, fallback = "#efc45d") {
    ctx.save();
    ctx.globalAlpha = alpha;
    let box = { x: x - targetH * .2, y: y - targetH * .72, w: targetH * .4, h: targetH };
    if (img?.complete && img.naturalWidth > 0) {
      const source = spriteMeta[id] || { sx: 0, sy: 0, sw: img.naturalWidth, sh: img.naturalHeight };
      const ratio = source.sw / source.sh;
      let drawH = targetH;
      let drawW = drawH * ratio;
      const maxW = targetH * .92;
      if (drawW > maxW) {
        drawW = maxW;
        drawH = drawW / ratio;
      }
      const dx = x - drawW / 2;
      const dy = y - drawH * .68;
      box = { x: dx, y: dy, w: drawW, h: drawH };
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.beginPath();
      ctx.ellipse(x, y + Math.min(16, drawH * .24), Math.max(10, drawW * .32), 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.drawImage(img, source.sx, source.sy, source.sw, source.sh, dx, dy, drawW, drawH);
    } else {
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.beginPath();
      ctx.ellipse(x, y + targetH * .23, targetH * .18, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = fallback;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(10, targetH * .22), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return box;
  }

  function drawBattle() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0e141c";
    ctx.fillRect(0, 0, W, H);
    drawArena();
    battle.zones.forEach(drawZone);
    battle.plants.forEach(drawPlant);
    battle.enemies.forEach(drawEnemy);
    battle.allies.forEach(drawAlly);
    battle.projectiles.forEach(drawProjectile);
    battle.texts.forEach(drawText);
    if (battle.status !== "run") drawResult(battle.status === "win");
    el.noteBtn.disabled = !battle.allies.some(a => a.id === "doan" && a.hp > 0) || battle.noteCd > 0;
    el.noteBtn.textContent = battle.noteCd > 0 ? `노트 ${Math.ceil(battle.noteCd)}` : "노트";
  }

  function drawArena() {
    ctx.fillStyle = "#17202c";
    rect(ARENA.x, ARENA.y, ARENA.w, ARENA.h, 10, true);
    ctx.strokeStyle = "rgba(255,255,255,.11)";
    for (let x = ARENA.x + 54; x < ARENA.x + ARENA.w; x += 54) line(x, ARENA.y, x, ARENA.y + ARENA.h);
    for (let y = ARENA.y + 54; y < ARENA.y + ARENA.h; y += 54) line(ARENA.x, y, ARENA.x + ARENA.w, y);
    ctx.fillStyle = "rgba(255,255,255,.045)";
    ctx.fillRect(ARENA.x, ARENA.y + ARENA.h - 168, ARENA.w, 168);
    ctx.fillStyle = "#d8e0ef";
    ctx.font = "700 10px system-ui";
    ctx.fillText("방송부 고정 아레나", ARENA.x + 10, ARENA.y + 18);
  }

  function drawAlly(a) {
    if (a.hp <= 0) {
      drawSprite(a, .32);
      badge(a.x, a.y, "DOWN", "#555");
      return;
    }
    drawSprite(a, 1);
    if (a.rec > 0) badge(a.x, a.y - a.r - 14, "REC", "#ff3d51");
    if (a.id === "doan") badge(a.x, a.y + a.r + 13, el.doanAutoToggle.checked ? "AI" : "P", "#efc45d");
    bars(a);
  }

  function drawEnemy(e) {
    e.drawBox = drawCroppedSprite(enemySprites[e.def.sprite], e.def.sprite, e.x, e.y, e.type === "boss" ? e.r * 4.2 : e.r * 3.7, 1, e.def.color);
    if (e.buff > 0) badge(e.x, e.y - e.r - 12, "UP", "#6ee7a8");
    if (e.marked > 0) badge(e.x, e.y + e.r + 10, "OBS", "#efc45d");
    bars(e);
  }

  function drawSprite(a, alpha) {
    const img = sprites[a.def.sprite];
    a.drawBox = drawCroppedSprite(img, a.def.sprite, a.x, a.y, a.r * 4.25, alpha, a.def.color);
  }

  function drawPlant(p) {
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0b2513"; ctx.fillRect(p.x - 2, p.y - 14, 4, 20);
  }

  function drawZone(z) {
    if (z.kind === "laser") {
      ctx.strokeStyle = z.color; ctx.lineWidth = 6; line(z.x1, z.y1, z.x2, z.y2); return;
    }
    ctx.fillStyle = z.color;
    ctx.beginPath(); ctx.arc(z.x, z.y, z.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = z.side === "enemy" ? "rgba(255,235,140,.55)" : "rgba(255,255,255,.2)";
    ctx.stroke();
  }

  function drawProjectile(p) {
    if (p.kind === "current") { ctx.strokeStyle = "rgba(128,233,255,.8)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p.x - 7, p.y - 2); ctx.lineTo(p.x, p.y + 4); ctx.lineTo(p.x + 8, p.y - 4); ctx.stroke(); return; }
    if (p.kind === "pea") { ctx.fillStyle = "#78d96a"; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill(); return; }
    if (p.kind === "apple") { ctx.fillStyle = "#e44f45"; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#5fb46f"; ctx.fillRect(p.x + 1, p.y - 8, 5, 3); return; }
    if (p.kind === "flask") { ctx.fillStyle = "#ff8f62"; ctx.beginPath(); ctx.ellipse(p.x, p.y, 5, 7, .25, 0, Math.PI * 2); ctx.fill(); return; }
    if (p.kind === "rock") { ctx.fillStyle = "#a77b55"; ctx.beginPath(); ctx.moveTo(p.x - 6, p.y + 3); ctx.lineTo(p.x - 2, p.y - 6); ctx.lineTo(p.x + 7, p.y - 2); ctx.lineTo(p.x + 4, p.y + 6); ctx.closePath(); ctx.fill(); return; }
    ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
  }

  function bars(u) {
    const w = Math.max(26, Math.min(42, (u.drawBox?.w || u.r * 2.25) * .72));
    const x = u.x - w / 2;
    const y = Math.max(ARENA.y + 8, (u.drawBox?.y ?? (u.y - u.r)) - (u.side === "ally" ? 11 : 9));
    ctx.fillStyle = "rgba(0,0,0,.45)"; ctx.fillRect(x, y, w, 4);
    ctx.fillStyle = u.side === "enemy" ? "#ff6b75" : "#6ee7a8"; ctx.fillRect(x, y, w * clamp(u.hp / u.maxHp, 0, 1), 4);
    if (u.side === "ally" && u.hp > 0) { ctx.fillStyle = "#78b9ff"; ctx.fillRect(x, y + 5, w * (u.science / u.stats.scienceMax), 3); }
  }

  function drawText(t) {
    ctx.globalAlpha = clamp(t.life / .65, 0, 1);
    ctx.fillStyle = t.color;
    ctx.font = "800 11px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(t.value, t.x, t.y - (1 - t.life / .65) * 18);
    ctx.textAlign = "start";
    ctx.globalAlpha = 1;
  }

  function drawResult(win) {
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = win ? "#efc45d" : "#ff6969";
    ctx.font = "900 30px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(win ? "승리" : "패배", W / 2, H / 2);
    ctx.textAlign = "start";
  }

  function badge(x, y, value, color) {
    ctx.fillStyle = color; rect(x - 16, y - 7, 32, 14, 4, true);
    ctx.fillStyle = "#12151d"; ctx.font = "900 8px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(value, x, y); ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  function text(x, y, value, color) {
    battle.texts.push({ x, y, value, color, life: .65 });
  }

  function syncGameScale() {
    const viewport = window.visualViewport;
    const vw = viewport?.width || window.innerWidth || GAME_W;
    const vh = viewport?.height || window.innerHeight || GAME_H;
    const margin = 8;
    const scale = Math.min(1, Math.max(.1, Math.min((vw - margin) / GAME_W, (vh - margin) / GAME_H)));
    document.documentElement.style.setProperty("--game-scale", scale.toFixed(4));
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      toast("이 브라우저에서는 전체화면을 사용할 수 없습니다.");
    } finally {
      setTimeout(syncGameScale, 80);
      updateFullscreenButton();
    }
  }

  function updateFullscreenButton() {
    el.fullscreenBtn.textContent = document.fullscreenElement ? "창모드" : "전체";
  }

  function getInputVector() {
    let x = joystick.x;
    let y = joystick.y;
    if (keys.has("KeyA") || keys.has("ArrowLeft")) x -= 1;
    if (keys.has("KeyD") || keys.has("ArrowRight")) x += 1;
    if (keys.has("KeyW") || keys.has("ArrowUp")) y -= 1;
    if (keys.has("KeyS") || keys.has("ArrowDown")) y += 1;
    const d = Math.hypot(x, y);
    return d > 1 ? { x: x / d, y: y / d } : { x, y };
  }

  function setJoystick(clientX, clientY) {
    const r = el.joystick.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const max = r.width * .32;
    const d = Math.hypot(dx, dy);
    const m = d > max ? max / d : 1;
    joystick.x = dx * m / max;
    joystick.y = dy * m / max;
    el.knob.style.transform = `translate(${dx * m}px, ${dy * m}px)`;
  }

  function resetJoystick() {
    joystick = { active: false, x: 0, y: 0 };
    el.knob.style.transform = "translate(0,0)";
  }

  function densestEnemy(from) {
    let best = null;
    let score = -Infinity;
    battle.enemies.forEach(e => {
      const cluster = battle.enemies.reduce((s, other) => s + (distance(e, other) < 105 ? 1 : 0), 0);
      const value = cluster * 80 - distance(from, e);
      if (value > score) { score = value; best = e; }
    });
    return best || nearest(from, battle.enemies);
  }

  function nearest(from, list) {
    let best = null;
    let score = Infinity;
    list.forEach(x => { const d = distance(from, x); if (d < score) { score = d; best = x; } });
    return best;
  }

  function moveToward(o, x, y, amount) {
    const dx = x - o.x;
    const dy = y - o.y;
    const d = Math.hypot(dx, dy) || 1;
    moveBy(o, dx / d * amount, dy / d * amount);
  }

  function moveBy(o, dx, dy) {
    o.x = clamp(o.x + dx, ARENA.x + o.r, ARENA.x + ARENA.w - o.r);
    o.y = clamp(o.y + dy, ARENA.y + o.r, ARENA.y + ARENA.h - o.r);
  }

  function insideArena(o, r) {
    return o.x >= ARENA.x - r && o.x <= ARENA.x + ARENA.w + r && o.y >= ARENA.y - r && o.y <= ARENA.y + ARENA.h + r;
  }

  function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function choice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) { return arr.slice().sort(() => Math.random() - .5); }
  function unique(arr) { return [...new Set(arr)]; }
  function byId(id) { return document.getElementById(id); }
  function line(x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function rect(x, y, w, h, r, fill) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    if (fill) ctx.fill(); else ctx.stroke();
  }

  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.toast.classList.remove("show"), 1600);
  }

  el.summonBtn.addEventListener("click", summon);
  el.fullscreenBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", () => {
    updateFullscreenButton();
    syncGameScale();
  });
  el.battleBtn.addEventListener("click", startBattle);
  el.cleanBtn.addEventListener("click", expandFormation);
  el.noteBtn.addEventListener("click", noteSkill);
  el.speedBtn.addEventListener("click", () => {
    if (!battle) return;
    battle.speed = battle.speed === 1 ? 1.5 : battle.speed === 1.5 ? 2 : 1;
    el.speedBtn.textContent = `${battle.speed}x`;
  });
  el.pauseBtn.addEventListener("click", () => {
    if (!battle) return;
    battle.paused = !battle.paused;
    el.pauseBtn.textContent = battle.paused ? "재개" : "일시정지";
  });
  el.joystick.addEventListener("pointerdown", e => { joystick.active = true; el.joystick.setPointerCapture(e.pointerId); setJoystick(e.clientX, e.clientY); });
  el.joystick.addEventListener("pointermove", e => { if (joystick.active) setJoystick(e.clientX, e.clientY); });
  el.joystick.addEventListener("pointerup", resetJoystick);
  el.joystick.addEventListener("pointercancel", resetJoystick);
  window.addEventListener("keydown", event => {
    if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.code)) {
      keys.add(event.code);
      event.preventDefault();
    }
  });
  window.addEventListener("keyup", event => keys.delete(event.code));

  render();
})();
