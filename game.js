const state = {
  activeView: "members",
  meeting: {
    turn: 1,
    scenario: null,
    trust: 45,
    clarity: 40,
    momentum: 35,
    friction: 25,
    log: []
  }
};

const els = {
  memberCount: document.querySelector("#member-count"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  memberGrid: document.querySelector("#member-grid"),
  memberSearch: document.querySelector("#member-search"),
  departmentFilter: document.querySelector("#department-filter"),
  personA: document.querySelector("#person-a"),
  personB: document.querySelector("#person-b"),
  scenarioSelect: document.querySelector("#scenario-select"),
  strategySelect: document.querySelector("#strategy-select"),
  analyzePair: document.querySelector("#analyze-pair"),
  pairTitle: document.querySelector("#pair-title"),
  fitBadge: document.querySelector("#fit-badge"),
  scoreGrid: document.querySelector("#score-grid"),
  pairInsight: document.querySelector("#pair-insight"),
  meetingTitle: document.querySelector("#meeting-title"),
  meetingScenario: document.querySelector("#meeting-scenario"),
  meetingPerson: document.querySelector("#meeting-person"),
  meetingStrategy: document.querySelector("#meeting-strategy"),
  playTurn: document.querySelector("#play-turn"),
  resetMeeting: document.querySelector("#reset-meeting"),
  turnCount: document.querySelector("#turn-count"),
  meetingLog: document.querySelector("#meeting-log"),
  meters: {
    trust: document.querySelector("#trust-meter"),
    clarity: document.querySelector("#clarity-meter"),
    momentum: document.querySelector("#momentum-meter"),
    friction: document.querySelector("#friction-meter")
  },
  values: {
    trust: document.querySelector("#trust-value"),
    clarity: document.querySelector("#clarity-value"),
    momentum: document.querySelector("#momentum-value"),
    friction: document.querySelector("#friction-value")
  }
};

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function memberById(id) {
  return GAME_DATA.members.find((member) => member.id === id);
}

function scenarioById(id) {
  return GAME_DATA.scenarios.find((scenario) => scenario.id === id);
}

function strategyById(id) {
  return GAME_DATA.strategies.find((strategy) => strategy.id === id);
}

function initials(name) {
  return name.slice(0, 2);
}

function elementClass(element) {
  return {
    木: "wood",
    火: "fire",
    土: "earth",
    金: "metal",
    水: "water"
  }[element] || "wood";
}

function distilledMarkup(member) {
  if (!member.distilled) {
    return `<p class="distilled muted">會議蒸餾：尚未有足夠逐字稿訊號</p>`;
  }
  const traits = member.distilled.traits.map((trait) => `<span>${trait}</span>`).join("");
  return `
    <div class="distilled">
      <strong>會議蒸餾 ${member.distilled.confidence}</strong>
      <small>${member.distilled.turns} turns</small>
      <div>${traits}</div>
    </div>
  `;
}

function deepDistillationMarkup(member) {
  const profile = GAME_DATA.distillations?.[member.id];
  if (!profile) return "";
  const aiFit = Number(profile.aiFit || 0);
  const blocks = [
    ["啟動", profile.trigger],
    ["限制", profile.limiter],
    ["派任", profile.assignment],
    ["槓桿", profile.leverage],
    ["風險", profile.risk]
  ];
  return `
    <details class="deep-distill">
      <summary class="deep-head">
        <strong>${profile.mode}</strong>
        <span>AI ${"■".repeat(aiFit)}${"□".repeat(Math.max(0, 5 - aiFit))}</span>
      </summary>
      <div>${blocks.map(([label, text]) => `<p><b>${label}</b>${text}</p>`).join("")}</div>
    </details>
  `;
}

function relationFor(a, b) {
  if (a.element === b.element) return `同元素：兩人都是${a.element}行，起手默契高，但盲點可能相似。`;
  return GAME_DATA.elementRelations[`${a.element}-${b.element}`]
    || GAME_DATA.elementRelations[`${b.element}-${a.element}`]
    || "元素關係中性：需要靠情境和策略決定合作手感。";
}

function vectorDistance(a, b, key) {
  return Math.abs(a.vectors[key] - b.vectors[key]);
}

function scorePair(a, b, scenario, strategy) {
  const weights = scenario.weights;
  const closeness = {
    clarity: 100 - vectorDistance(a, b, "clarity"),
    context: 100 - vectorDistance(a, b, "context"),
    speed: 100 - vectorDistance(a, b, "speed"),
    risk: 100 - vectorDistance(a, b, "risk"),
    data: 100 - vectorDistance(a, b, "data"),
    warmth: 100 - vectorDistance(a, b, "warmth")
  };
  const weightedFit = Object.entries(closeness).map(([key, value]) => value * (weights[key] || 1));
  const weightedBase = Object.entries(closeness).map(([key]) => weights[key] || 1);
  const weightedAverage = weightedFit.reduce((sum, value) => sum + value, 0) / weightedBase.reduce((sum, value) => sum + value, 0);
  const sameDept = a.department === b.department ? 6 : -2;
  const roleSpread = a.role !== b.role ? 4 : 1;
  const elementBonus = a.element === b.element ? 4 : relationFor(a, b).includes("相生") ? 6 : relationFor(a, b).includes("相剋") ? -3 : 0;
  const strategyBonus = strategy.fits.includes(scenario.id) ? 8 : -2;

  const work = clamp(weightedAverage + sameDept + roleSpread + strategyBonus * .35);
  const communication = clamp(average([closeness.clarity, closeness.context, closeness.warmth]) + elementBonus + strategyBonus);
  const decision = clamp(average([closeness.risk, closeness.data, closeness.speed]) + roleSpread + strategyBonus * .5);
  const stress = clamp(100 - average([closeness.risk, closeness.speed, closeness.warmth]) + (strategy.fits.includes(scenario.id) ? -8 : 6));
  const overall = clamp(average([work, communication, decision, 100 - stress]));

  return { work, communication, decision, stress, overall, closeness };
}

function scoreLabel(score) {
  if (score >= 82) return "高合拍";
  if (score >= 68) return "可推進";
  if (score >= 52) return "需翻譯";
  return "高摩擦";
}

function renderMember(member) {
  return `
    <article class="member-card ${elementClass(member.element)}" data-member="${member.id}">
      <div class="avatar" aria-hidden="true">${initials(member.name)}</div>
      <div class="member-main">
        <div class="member-topline">
          <h3>${member.name}</h3>
          <span>${member.department}</span>
        </div>
        <p class="role">${member.role} · ${member.birthday}</p>
        <div class="chips">
          <span class="chip number">靈數 ${member.numerology}</span>
          <span class="chip ${elementClass(member.element)}">${member.element}行</span>
          <span class="chip sign">${member.zodiac}</span>
        </div>
        <p class="meta">${member.archetype} · ${member.animal}年 · ${member.star}</p>
        <p class="style-copy">${member.style}</p>
        ${distilledMarkup(member)}
        ${deepDistillationMarkup(member)}
      </div>
    </article>
  `;
}

function renderMembers() {
  const query = els.memberSearch.value.trim().toLowerCase();
  const department = els.departmentFilter.value;
  const members = GAME_DATA.members.filter((member) => {
    const profile = GAME_DATA.distillations?.[member.id];
    const haystack = `${member.name} ${member.department} ${member.role} ${member.archetype} ${member.element} ${member.zodiac} ${profile ? Object.values(profile).join(" ") : ""}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesDept = department === "all" || member.department === department;
    return matchesQuery && matchesDept;
  });
  els.memberGrid.innerHTML = members.map(renderMember).join("");
}

function fillSelect(select, items, label) {
  select.innerHTML = items.map((item) => `<option value="${item.id}">${label(item)}</option>`).join("");
}

function fillStaticControls() {
  els.memberCount.textContent = GAME_DATA.members.length;
  const departments = ["all", ...new Set(GAME_DATA.members.map((member) => member.department))];
  els.departmentFilter.innerHTML = departments
    .map((department) => `<option value="${department}">${department === "all" ? "全部部門" : department}</option>`)
    .join("");
  fillSelect(els.personA, GAME_DATA.members, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.personB, GAME_DATA.members, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.meetingPerson, GAME_DATA.members, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.scenarioSelect, GAME_DATA.scenarios, (scenario) => scenario.name);
  fillSelect(els.strategySelect, GAME_DATA.strategies, (strategy) => strategy.name);
  fillSelect(els.meetingStrategy, GAME_DATA.strategies, (strategy) => strategy.name);
  els.personA.value = "elly";
  els.personB.value = "sixian";
  els.meetingPerson.value = "sixian";
}

function renderScoreCard(label, value, helper) {
  const safeValue = clamp(value);
  return `
    <article class="score-card">
      <span>${label}</span>
      <strong>${safeValue}</strong>
      <meter min="0" max="100" value="${safeValue}"></meter>
      <p>${helper}</p>
    </article>
  `;
}

function analyzePair() {
  const a = memberById(els.personA.value);
  const b = memberById(els.personB.value);
  const scenario = scenarioById(els.scenarioSelect.value);
  const strategy = strategyById(els.strategySelect.value);
  if (!a || !b || a.id === b.id) {
    els.pairTitle.textContent = "請選兩位不同成員";
    return;
  }

  const scores = scorePair(a, b, scenario, strategy);
  els.pairTitle.textContent = `${a.name} × ${b.name}`;
  els.fitBadge.textContent = `${scores.overall} · ${scoreLabel(scores.overall)}`;
  els.scoreGrid.innerHTML = [
    renderScoreCard("Work Fit", scores.work, "工作任務與組織角色的配合度"),
    renderScoreCard("Communication", scores.communication, "語氣、脈絡與資訊密度是否合拍"),
    renderScoreCard("Decision", scores.decision, "速度、風險與資料證據的決策節奏"),
    renderScoreCard("Stress Friction", scores.stress, "壓力下互卡機率，分數越低越好")
  ].join("");

  const strongest = Object.entries(scores.closeness).sort((left, right) => right[1] - left[1])[0][0];
  const weakest = Object.entries(scores.closeness).sort((left, right) => left[1] - right[1])[0][0];
  const fit = strategy.fits.includes(scenario.id);
  els.pairInsight.innerHTML = `
    <p><strong>情境：</strong>${scenario.prompt}</p>
    <p><strong>象徵層：</strong>${relationFor(a, b)}</p>
    <p><strong>會議信心：</strong>${meetingConfidence(a)} × ${meetingConfidence(b)}。分數以實際會議訊號、組織角色與象徵層混合推估。</p>
    <p><strong>蒸餾提醒：</strong>${distillHint(a)} / ${distillHint(b)}</p>
    <p><strong>最合的軸：</strong>${axisName(strongest)}。<strong>最需要翻譯：</strong>${axisName(weakest)}。</p>
    <p><strong>建議打法：</strong>${strategy.text}${fit ? " 這張策略很適合此情境。" : " 這張策略可用，但不是此情境的最佳解。"}</p>
    <p><strong>開場句：</strong>${openingLine(a, b, scenario, strategy)}</p>
  `;
}

function distillHint(member) {
  const profile = GAME_DATA.distillations?.[member.id];
  return profile ? `${member.name}: ${profile.mode}` : `${member.name}: 深度蒸餾待補`;
}

function meetingConfidence(member) {
  return member.distilled ? `${member.distilled.confidence} (${member.distilled.turns} turns)` : "低 (待補資料)";
}

function axisName(key) {
  return {
    clarity: "結論清晰度",
    context: "脈絡需求",
    speed: "節奏速度",
    risk: "風險敏感度",
    data: "資料依賴",
    warmth: "情緒溫度"
  }[key];
}

function openingLine(a, b, scenario, strategy) {
  const lines = {
    "bottom-line": `我先講結論：這件事在「${scenario.name}」裡最需要先決定一個方向，細節我接著補。`,
    "context-brief": `我先用一頁把背景、限制和要決定的點整理清楚，我們再看哪裡需要補資料。`,
    "owner-risk": `我們先把 owner、deadline、risk 拆開，這樣今天可以至少定下一步。`,
    "data-proof": `我先拿現有資料和樣本對齊，避免我們只是在猜彼此的意思。`,
    "private-align": `我想先跟你一對一校準一下，確定進會議時我們不會各講各的。`,
    "prototype": `與其先辯完所有可能性，我們先做一個小版本，看起來後再決定。`,
    "options": `我整理成 A/B/C 三個選項，每個選項都有代價，我們先選方向。`,
    "uncertainty": `我先說清楚哪些是已知、哪些還不確定，然後一起決定要補哪個缺口。`
  };
  return `${a.name} 對 ${b.name} 可以這樣開：${lines[strategy.id]}`;
}

function switchView(view) {
  state.activeView = view;
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  els.views.forEach((viewEl) => viewEl.classList.toggle("active", viewEl.id === `${view}-view`));
}

function resetMeeting() {
  state.meeting = {
    turn: 1,
    scenario: GAME_DATA.scenarios[Math.floor(Math.random() * GAME_DATA.scenarios.length)],
    trust: 45,
    clarity: 40,
    momentum: 35,
    friction: 25,
    log: ["新局開始：選一位成員與策略，讓專案在五回合內達到 Trust / Clarity / Momentum 70 以上。"]
  };
  renderMeeting();
}

function renderMeeting() {
  const meeting = state.meeting;
  els.meetingTitle.textContent = meeting.scenario.name;
  els.meetingScenario.textContent = meeting.scenario.prompt;
  els.turnCount.textContent = `Turn ${Math.min(meeting.turn, 5)} / 5`;
  ["trust", "clarity", "momentum", "friction"].forEach((key) => {
    els.meters[key].value = meeting[key];
    els.values[key].textContent = meeting[key];
  });
  els.meetingLog.innerHTML = meeting.log.map((item) => `<li>${item}</li>`).join("");
  els.playTurn.disabled = meeting.turn > 5;
}

function playMeetingTurn() {
  const meeting = state.meeting;
  const person = memberById(els.meetingPerson.value);
  const strategy = strategyById(els.meetingStrategy.value);
  const self = memberById("elly");
  const scores = scorePair(self, person, meeting.scenario, strategy);
  const fit = strategy.fits.includes(meeting.scenario.id);
  const boost = strategy.boosts;

  meeting.trust = clamp(meeting.trust + (boost.trust || 0) + (scores.communication - 60) / 8);
  meeting.clarity = clamp(meeting.clarity + (boost.clarity || 0) + (scores.work - 60) / 10);
  meeting.momentum = clamp(meeting.momentum + (boost.momentum || 0) + (scores.decision - 60) / 9);
  meeting.friction = clamp(meeting.friction + (boost.friction || 0) + (scores.stress - 50) / 8 + (fit ? -3 : 4));

  const outcome = fit ? "策略命中情境" : "策略不完全對題";
  meeting.log.unshift(`T${meeting.turn}: 找 ${person.name}，使用「${strategy.name}」；${outcome}，整體合拍 ${scores.overall}。`);
  meeting.turn += 1;

  if (meeting.turn > 5) {
    const win = meeting.trust >= 70 && meeting.clarity >= 70 && meeting.momentum >= 70 && meeting.friction < 55;
    meeting.log.unshift(win ? "專案過關：對話節奏穩住，團隊可以往下一步推進。" : "專案未過關：有些資訊或信任還沒補齊，需要換策略。");
  }
  renderMeeting();
}

function bindEvents() {
  els.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  els.memberSearch.addEventListener("input", renderMembers);
  els.departmentFilter.addEventListener("change", renderMembers);
  els.analyzePair.addEventListener("click", analyzePair);
  els.playTurn.addEventListener("click", playMeetingTurn);
  els.resetMeeting.addEventListener("click", resetMeeting);
}

function init() {
  fillStaticControls();
  bindEvents();
  renderMembers();
  analyzePair();
  resetMeeting();
}

init();
