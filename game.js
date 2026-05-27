const state = {
  activeView: "members",
  meeting: {
    turn: 1,
    scenario: null,
    trust: 45,
    clarity: 40,
    momentum: 35,
    friction: 25,
    hand: [],
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
  analyzePair: document.querySelector("#analyze-pair"),
  pairTitle: document.querySelector("#pair-title"),
  fitBadge: document.querySelector("#fit-badge"),
  scoreGrid: document.querySelector("#score-grid"),
  pairInsight: document.querySelector("#pair-insight"),
  meetingTitle: document.querySelector("#meeting-title"),
  meetingScenario: document.querySelector("#meeting-scenario"),
  meetingPerson: document.querySelector("#meeting-person"),
  missionBrief: document.querySelector("#mission-brief"),
  actionCards: document.querySelector("#action-cards"),
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

function actionById(id) {
  return GAME_DATA.actionTypes.find((action) => action.id === id);
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

function birthProfile(member) {
  const birthday = member.birthday;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return {
      birthday,
      numerology: "待補",
      element: "土",
      zodiac: "待補",
      animal: "待補",
      archetype: "待觀察"
    };
  }
  const [year, month, day] = birthday.split("-").map(Number);
  const sum = String(year).split("").concat(String(month).padStart(2, "0").split(""), String(day).padStart(2, "0").split(""))
    .reduce((total, digit) => total + Number(digit), 0);
  const reduced = [11, 22, 33].includes(sum) ? sum : reduceNumber(sum);
  const elementsByStem = ["金", "金", "水", "水", "木", "木", "火", "火", "土", "土"];
  const animals = ["猴", "雞", "狗", "豬", "鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊"];
  return {
    birthday,
    numerology: reduced,
    element: elementsByStem[year % 10],
    zodiac: westernZodiac(month, day),
    animal: animals[year % 12],
    archetype: numerologyArchetype(reduced)
  };
}

function reduceNumber(value) {
  let current = value;
  while (current > 9 && ![11, 22, 33].includes(current)) {
    current = String(current).split("").reduce((sum, digit) => sum + Number(digit), 0);
  }
  return current;
}

function westernZodiac(month, day) {
  const signs = [
    ["摩羯座", 1, 20], ["水瓶座", 2, 19], ["雙魚座", 3, 21], ["牡羊座", 4, 20],
    ["金牛座", 5, 21], ["雙子座", 6, 22], ["巨蟹座", 7, 23], ["獅子座", 8, 23],
    ["處女座", 9, 23], ["天秤座", 10, 24], ["天蠍座", 11, 23], ["射手座", 12, 22],
    ["摩羯座", 13, 1]
  ];
  return signs.find(([, endMonth, endDay]) => month < endMonth || (month === endMonth && day < endDay))[0];
}

function numerologyArchetype(number) {
  return {
    1: "領導者",
    2: "協調者",
    3: "表達者",
    4: "建設者",
    5: "自由者",
    6: "照護者",
    7: "探索者",
    8: "成就者",
    9: "人道者",
    11: "啟示者",
    22: "建構者",
    33: "引導者"
  }[number] || "待觀察";
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
  const aElement = birthProfile(a).element;
  const bElement = birthProfile(b).element;
  if (aElement === bElement) return `同元素：兩人都是${aElement}行，起手默契高，但盲點可能相似。`;
  return GAME_DATA.elementRelations[`${aElement}-${bElement}`]
    || GAME_DATA.elementRelations[`${bElement}-${aElement}`]
    || "元素關係中性：需要靠情境和策略決定合作手感。";
}

function vectorDistance(a, b, key) {
  return Math.abs(vectorsFor(a)[key] - vectorsFor(b)[key]);
}

function vectorsFor(member) {
  return member.vectors || { clarity: 60, context: 60, speed: 60, risk: 60, data: 60, warmth: 60 };
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
  const aElement = birthProfile(a).element;
  const bElement = birthProfile(b).element;
  const elementBonus = aElement === bElement ? 4 : relationFor(a, b).includes("相生") ? 6 : relationFor(a, b).includes("相剋") ? -3 : 0;
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
  const birth = birthProfile(member);
  return `
    <article class="member-card ${elementClass(birth.element)}" data-member="${member.id}">
      <div class="avatar" aria-hidden="true">${initials(member.name)}</div>
      <div class="member-main">
        <div class="member-topline">
          <h3>${member.name}</h3>
          <span>${member.department}</span>
        </div>
        <p class="role">${member.role} · ${member.birthday}</p>
        <div class="chips">
          <span class="chip number">靈數 ${birth.numerology}</span>
          <span class="chip ${elementClass(birth.element)}">${birth.element}行</span>
          <span class="chip sign">${birth.zodiac}</span>
        </div>
        <p class="meta">${birth.archetype} · ${birth.animal}年</p>
        <p class="style-copy">${member.style}</p>
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
    const birth = birthProfile(member);
    const haystack = `${member.name} ${member.department} ${member.role} ${birth.archetype} ${birth.element} ${birth.zodiac} ${profile ? Object.values(profile).join(" ") : ""}`.toLowerCase();
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
  const strategy = bestStrategyFor(a, b, scenario);
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
    <p><strong>蒸餾提醒：</strong>${distillHint(a)} / ${distillHint(b)}</p>
    <p><strong>最合的軸：</strong>${axisName(strongest)}。<strong>最需要翻譯：</strong>${axisName(weakest)}。</p>
    <p><strong>系統解法：</strong>${strategy.text}${fit ? " 這個解法命中目前情境。" : " 這個解法可用，但需要補一層翻譯。"}</p>
    <p><strong>開場句：</strong>${openingLine(a, b, scenario, strategy)}</p>
  `;
}

function bestStrategyFor(a, b, scenario) {
  return GAME_DATA.strategies
    .map((strategy) => ({ strategy, score: scorePair(a, b, scenario, strategy).overall + (strategy.fits.includes(scenario.id) ? 8 : 0) }))
    .sort((left, right) => right.score - left.score)[0].strategy;
}

function distillHint(member) {
  const profile = GAME_DATA.distillations?.[member.id];
  return profile ? `${member.name}: ${profile.mode}` : `${member.name}: 深度蒸餾待補`;
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
  const mission = GAME_DATA.orgMissions[Math.floor(Math.random() * GAME_DATA.orgMissions.length)];
  state.meeting = {
    turn: 1,
    scenario: mission,
    trust: mission.pressure.trust,
    clarity: mission.pressure.clarity,
    momentum: mission.pressure.momentum,
    friction: mission.pressure.friction,
    hand: [],
    log: [`任務展開：${mission.goal}`]
  };
  refreshActionCards();
  renderMeeting();
}

function renderMeeting() {
  const meeting = state.meeting;
  els.meetingTitle.textContent = meeting.scenario.name;
  els.meetingScenario.textContent = meeting.scenario.prompt;
  els.missionBrief.innerHTML = `
    <strong>Victory condition</strong>
    <span>Trust / Clarity / Momentum 需達 70，Friction 低於 45。</span>
  `;
  els.turnCount.textContent = `Turn ${Math.min(meeting.turn, 5)} / 5`;
  ["trust", "clarity", "momentum", "friction"].forEach((key) => {
    els.meters[key].value = meeting[key];
    els.values[key].textContent = meeting[key];
  });
  els.meetingLog.innerHTML = meeting.log.map((item) => `<li>${item}</li>`).join("");
  renderActionCards();
}

function refreshActionCards() {
  const person = memberById(els.meetingPerson.value);
  if (!person || !state.meeting.scenario) return;
  const profile = GAME_DATA.distillations?.[person.id];
  const ranked = GAME_DATA.actionTypes
    .map((action) => ({
      action,
      score: vectorsFor(person)[action.vector] + (state.meeting.scenario.weights[action.vector] || 1) * 16 + actionProfileBonus(action, profile)
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map((item) => item.action.id);
  state.meeting.hand = ranked;
}

function actionProfileBonus(action, profile) {
  if (!profile) return 0;
  const text = `${profile.mode} ${profile.trigger} ${profile.assignment} ${profile.leverage} ${profile.risk}`;
  const map = {
    frame: ["定義", "PM", "判斷", "架構"],
    bridge: ["跨地", "協調", "interface", "翻譯", "溝通"],
    prototype: ["prototype", "研究", "工具", "內容", "AI"],
    gate: ["標準", "文件", "品質", "風險"],
    evidence: ["記錄", "資料", "英文", "樣本", "證據"],
    align: ["授權", "白臉", "被看見", "關係", "表達"]
  };
  return (map[action.id] || []).some((keyword) => text.includes(keyword)) ? 14 : 0;
}

function renderActionCards() {
  const disabled = state.meeting.turn > 5 ? "disabled" : "";
  els.actionCards.innerHTML = state.meeting.hand.map((id) => {
    const action = actionById(id);
    return `
      <button class="action-card" type="button" data-action="${action.id}" ${disabled}>
        <span>${action.icon}</span>
        <strong>${action.name}</strong>
        <small>${action.copy}</small>
      </button>
    `;
  }).join("");
  els.actionCards.querySelectorAll(".action-card").forEach((button) => {
    button.addEventListener("click", () => playMeetingTurn(button.dataset.action));
  });
}

function playMeetingTurn(actionId) {
  const meeting = state.meeting;
  const person = memberById(els.meetingPerson.value);
  const action = actionById(actionId);
  const self = memberById("elly");
  const pseudoScenario = { id: meeting.scenario.id, weights: meeting.scenario.weights };
  const strategy = strategyFromAction(action);
  const scores = scorePair(self, person, pseudoScenario, strategy);
  const boost = action.boosts;
  const vectorFit = (vectorsFor(person)[action.vector] - 50) / 6;
  const orgFit = actionProfileBonus(action, GAME_DATA.distillations?.[person.id]) / 4;

  meeting.trust = clamp(meeting.trust + (boost.trust || 0) + (scores.communication - 62) / 9 + orgFit);
  meeting.clarity = clamp(meeting.clarity + (boost.clarity || 0) + vectorFit + (scores.work - 62) / 11);
  meeting.momentum = clamp(meeting.momentum + (boost.momentum || 0) + (scores.decision - 60) / 10);
  meeting.friction = clamp(meeting.friction + (boost.friction || 0) + (scores.stress - 52) / 10 - orgFit);

  const profile = GAME_DATA.distillations?.[person.id];
  const solution = profile ? profile.assignment : "先補資料，再建立可交接節點。";
  meeting.log.unshift(`T${meeting.turn}: ${person.name} 打出「${action.name}」；${solution}`);
  meeting.turn += 1;

  if (meeting.turn > 5) {
    const win = meeting.trust >= 70 && meeting.clarity >= 70 && meeting.momentum >= 70 && meeting.friction < 45;
    meeting.log.unshift(win ? `任務完成：${meeting.scenario.goal}` : "任務卡住：solution 還沒成形，下一輪需要換單位或補一張結構牌。");
  }
  refreshActionCards();
  renderMeeting();
}

function strategyFromAction(action) {
  const fitsByAction = {
    frame: ["vague", "conflict", "delay"],
    bridge: ["handoff", "conflict", "vague"],
    prototype: ["innovation", "demo"],
    gate: ["delay", "handoff"],
    evidence: ["handoff", "innovation"],
    align: ["conflict", "vague"]
  };
  return {
    id: action.id,
    name: action.name,
    text: action.copy,
    boosts: action.boosts,
    fits: fitsByAction[action.id] || []
  };
}

function bindEvents() {
  els.tabs.forEach((tab) => tab.addEventListener("click", () => switchView(tab.dataset.view)));
  els.memberSearch.addEventListener("input", renderMembers);
  els.departmentFilter.addEventListener("change", renderMembers);
  els.analyzePair.addEventListener("click", analyzePair);
  els.meetingPerson.addEventListener("change", () => {
    refreshActionCards();
    renderMeeting();
  });
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
