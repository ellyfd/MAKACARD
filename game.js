const state = {
  activeView: "meeting",
  meeting: {
    turn: 1,
    scenario: null,
    trust: 45,
    clarity: 40,
    momentum: 35,
    friction: 25,
    hand: [],
    played: [],
    coveredUnits: [],
    lastDepartment: null,
    lastUnit: null,
    log: []
  },
  selectedOrgUnit: "all",
  selectedOrgDept: null
};

const els = {
  memberCount: document.querySelector("#member-count"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  memberGrid: document.querySelector("#member-grid"),
  memberSearch: document.querySelector("#member-search"),
  departmentFilter: document.querySelector("#department-filter"),
  orgSearch: document.querySelector("#org-search"),
  orgUnitFilter: document.querySelector("#org-unit-filter"),
  orgRosterCount: document.querySelector("#org-roster-count"),
  orgDetail: document.querySelector("#org-detail"),
  personA: document.querySelector("#person-a"),
  personB: document.querySelector("#person-b"),
  personC: document.querySelector("#person-c"),
  scenarioSelect: document.querySelector("#scenario-select"),
  frameworkSelect: document.querySelector("#framework-select"),
  analyzePair: document.querySelector("#analyze-pair"),
  pairTitle: document.querySelector("#pair-title"),
  fitBadge: document.querySelector("#fit-badge"),
  scoreGrid: document.querySelector("#score-grid"),
  pairInsight: document.querySelector("#pair-insight"),
  meetingTitle: document.querySelector("#meeting-title"),
  meetingScenario: document.querySelector("#meeting-scenario"),
  missionBrief: document.querySelector("#mission-brief"),
  actionCards: document.querySelector("#action-cards"),
  resetMeeting: document.querySelector("#reset-meeting"),
  turnCount: document.querySelector("#turn-count"),
  meetingLog: document.querySelector("#meeting-log"),
  orgMap: document.querySelector("#org-map"),
  orgLegend: document.querySelector("#org-legend"),
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

const MISSION_REQUIREMENTS = {
  "rc-lock": ["tech-rd", "newbiz", "ops-mgmt"],
  "debbie-gap": ["tech-rd", "newbiz"],
  "taipei-chiayi": ["tech-rd", "overseas"],
  "ai-seed": ["general-mgmt", "tech-rd", "newbiz", "ops-mgmt"],
  "sttrix-gtm": ["newbiz", "sales-marketing", "tech-rd"],
  "nunox-ip": ["newbiz", "tech-rd", "sales-marketing"],
  "vivatech-booth": ["ceo", "newbiz", "tech-rd", "sales-marketing"],
  "ai-education-gap": ["newbiz", "tech-rd", "general-mgmt"],
  "pilot-feedback": ["newbiz", "sales-marketing", "tech-rd"],
  "dicks-placement-print": ["sales-marketing", "tech-rd"],
  "dpo-training-data": ["newbiz", "tech-rd"],
  "fabric-api-78": ["tech-rd", "newbiz"],
  "sequin-qipao": ["tech-rd", "newbiz"],
  "seoul-dev-trip": ["sales-marketing", "newbiz"]
};

const MEMBER_TRAITS = {
  adia: ["visual-exec", "needs-boundary"],
  alan: ["waits-for-brief", "interface"],
  alex: ["authority", "big-picture"],
  andy: ["research-depth", "deadline-needed", "over-research"],
  chieh: ["throughput", "motivation-risk"],
  "celia-hsu": ["formal-lead", "tech-rd"],
  debbie: ["presentation-candidate", "profile-thin"],
  dianne: ["market-sense", "story"],
  doris: ["coordination", "taste"],
  elly: ["org-sense", "so-what"],
  emily: ["visual-quality", "teaching"],
  "erica-chang": ["meeting-observed", "sales-dev"],
  "hazel-lin": ["sales-dev", "market-signal"],
  jessica: ["workshop", "audience-design"],
  jan: ["pm", "direct", "remote-owner"],
  jean: ["content-ai", "route-boundary"],
  karen: ["architect", "quality-gate-gap"],
  "lillian-lin": ["tech-design", "brief-builder"],
  maggie: ["dev-trip", "material-need"],
  rock: ["ground-truth", "knowledge-lock"],
  rou: ["quality-eye", "weak-expression"],
  rosa: ["workshop", "content-support"],
  ruochen: ["workshop", "project-sense"],
  sharon: ["meeting-observed", "role-pending"],
  sixian: ["reserve", "low-visibility"],
  tinley: ["growth", "needs-transfer"],
  vanessa: ["tradeoff", "coordination"],
  winnie: ["meeting-observed", "role-pending"],
  yoko: ["reliable", "overloaded", "soft-force"],
  yota: ["remote-owner", "geo-blindspot"]
};

const UNIT_COLORS = {
  ceo: "#f6b44b",
  consulting: "#d7c7a3",
  "general-mgmt": "#ff7d66",
  "sales-marketing": "#b78cff",
  "ops-mgmt": "#26d5d0",
  "tech-rd": "#56a8ff",
  overseas: "#9be96f",
  newbiz: "#ffcf5a",
  investment: "#ff8ad6",
  pending: "#d7c7a3"
};

const TEAM_LENSES = [
  {
    id: "tuckman",
    name: "Tuckman Stage Check",
    focus: "看隊伍是在 forming / storming / norming / performing 哪一段卡住。"
  },
  {
    id: "belbin",
    name: "Role Balance Draft",
    focus: "看隊形裡有沒有協調、創意、執行、評估、收尾等互補角色。"
  },
  {
    id: "topologies",
    name: "Team Topologies Mode",
    focus: "看跨單位應該用 collaboration、facilitating 或 X-as-a-Service，避免無限協調。"
  },
  {
    id: "raci",
    name: "RACI Decision Gate",
    focus: "看 Responsible / Accountable / Consulted / Informed 權責有沒有長出來。"
  }
];

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function memberById(id) {
  return allOrgMembers().find((member) => member.id === id);
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

function unitById(id) {
  return GAME_DATA.orgUnits.find((unit) => unit.id === id);
}

function allOrgMembers() {
  const seen = new Set();
  const enriched = GAME_DATA.members.map((member) => ({
    ...member,
    status: /^\d{4}-\d{2}-\d{2}$/.test(member.birthday) ? "已補資料" : "待補"
  }));
  const merged = [];
  [...enriched, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    const key = `${member.name}|${member.localName || ""}`.toLowerCase();
    const looseKey = member.name.toLowerCase();
    if (seen.has(key) || seen.has(looseKey)) return;
    seen.add(key);
    seen.add(looseKey);
    merged.push(member);
  });
  return merged;
}

function unitFor(member) {
  if (member.orgUnit) return member.orgUnit;
  if (member.department.includes("待定位")) return "pending";
  if (member.department.includes("數位產品發展中心") || member.department.includes("智慧紡織")) return "newbiz";
  if (member.department.includes("3D研發中心") || member.department.includes("開發暨技術處") || member.department.includes("工務處")) return "tech-rd";
  if (member.department.includes("業務") || member.department.includes("行銷發展處")) return "sales-marketing";
  if (member.department.includes("資訊處") || member.department.includes("財會管理處")) return "ops-mgmt";
  if (member.department.includes("總管理處")) return "general-mgmt";
  if (member.department.includes("海外")) return "overseas";
  return "pending";
}

function traitsFor(member) {
  return MEMBER_TRAITS[member.id] || [];
}

function missionRequires(mission) {
  return MISSION_REQUIREMENTS[mission.id] || ["newbiz", "tech-rd", "sales-marketing"];
}

function missingUnits() {
  const covered = new Set(state.meeting.coveredUnits);
  return missionRequires(state.meeting.scenario).filter((unit) => !covered.has(unit));
}

function unitName(id) {
  return unitById(id)?.name || id;
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
  const sameUnit = unitFor(a) === unitFor(b);
  const crossUnitNeed = ["handoff", "innovation", "conflict"].includes(scenario.id);
  const tunnelPenalty = sameUnit && crossUnitNeed ? 10 : sameUnit ? 4 : 0;
  const mismatchPenalty = Object.values(closeness).filter((value) => value < 48).length * 6;
  const aElement = birthProfile(a).element;
  const bElement = birthProfile(b).element;
  const elementBonus = aElement === bElement ? 4 : relationFor(a, b).includes("相生") ? 6 : relationFor(a, b).includes("相剋") ? -3 : 0;
  const strategyBonus = strategy.fits.includes(scenario.id) ? 8 : -2;

  const work = clamp(weightedAverage + sameDept + roleSpread + strategyBonus * .35 - tunnelPenalty - mismatchPenalty);
  const communication = clamp(average([closeness.clarity, closeness.context, closeness.warmth]) + elementBonus + strategyBonus - mismatchPenalty);
  const decision = clamp(average([closeness.risk, closeness.data, closeness.speed]) + roleSpread + strategyBonus * .5 - tunnelPenalty * .5);
  const stress = clamp(100 - average([closeness.risk, closeness.speed, closeness.warmth]) + (strategy.fits.includes(scenario.id) ? -4 : 10) + tunnelPenalty + mismatchPenalty);
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
  const hasBirthday = /^\d{4}-\d{2}-\d{2}$/.test(member.birthday);
  return `
    <article class="member-card ${elementClass(birth.element)}" data-member="${member.id}">
      <div class="avatar" aria-hidden="true">${initials(member.name)}</div>
      <div class="member-main">
        <div class="member-topline">
          <h3>${member.name}</h3>
          <span>${unitName(unitFor(member))}</span>
        </div>
        <p class="role">${member.localName ? `${member.localName} · ` : ""}${member.role || "待補"} · ${member.department || "待補"}</p>
        <div class="chips">
          ${hasBirthday ? `
            <span class="chip number">靈數 ${birth.numerology}</span>
            <span class="chip ${elementClass(birth.element)}">${birth.element}行</span>
            <span class="chip sign">${birth.zodiac}</span>
          ` : `
            <span class="chip pending">生日 待補</span>
            <span class="chip pending">資料 待補</span>
          `}
        </div>
        <p class="meta">${hasBirthday ? `${birth.animal}年` : "待補"}</p>
        <p class="style-copy">${member.style || "待補"}</p>
      </div>
    </article>
  `;
}

function renderMembers() {
  const query = (els.orgSearch?.value || "").trim().toLowerCase();
  const activeUnit = els.orgUnitFilter?.value || "all";
  const selectedDept = state.selectedOrgDept;
  const members = allOrgMembers().filter((member) => {
    const profile = GAME_DATA.distillations?.[member.id];
    const birth = birthProfile(member);
    const haystack = `${member.name} ${member.localName || ""} ${member.department} ${member.role} ${birth.element} ${birth.zodiac} ${profile ? Object.values(profile).join(" ") : ""}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesUnit = activeUnit === "all" || unitFor(member) === activeUnit;
    const matchesDept = !selectedDept || member.department === selectedDept;
    return matchesQuery && matchesUnit && matchesDept;
  });
  els.memberGrid.innerHTML = members.map(renderMember).join("");
  if (els.orgRosterCount) els.orgRosterCount.textContent = `${members.length} cards`;
}

function fillSelect(select, items, label) {
  select.innerHTML = items.map((item) => `<option value="${item.id}">${label(item)}</option>`).join("");
}

function fillStaticControls() {
  const roster = allOrgMembers();
  els.memberCount.textContent = roster.length;
  if (els.orgUnitFilter) {
    els.orgUnitFilter.innerHTML = ["all", ...GAME_DATA.orgUnits.map((unit) => unit.id)]
      .map((unitId) => `<option value="${unitId}">${unitId === "all" ? "全部組織" : unitName(unitId)}</option>`)
      .join("");
  }
  fillSelect(els.personA, roster, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.personB, roster, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.personC, roster, (member) => `${member.name} · ${member.department}`);
  fillSelect(els.scenarioSelect, GAME_DATA.scenarios, (scenario) => scenario.name);
  fillSelect(els.frameworkSelect, TEAM_LENSES, (lens) => lens.name);
  els.personA.value = "elly";
  els.personB.value = "sixian";
  els.personC.value = "douglas-lu";
  els.frameworkSelect.value = "topologies";
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
  const c = memberById(els.personC.value);
  const scenario = scenarioById(els.scenarioSelect.value);
  const lens = TEAM_LENSES.find((item) => item.id === els.frameworkSelect.value) || TEAM_LENSES[0];
  if (!a || !b || !c || new Set([a.id, b.id, c.id]).size < 3) {
    els.pairTitle.textContent = "請選三張不同人物牌";
    return;
  }
  const trio = [a, b, c];
  const required = missionRequires(scenario);
  const units = trio.map(unitFor);
  const covered = new Set(units.filter((unit) => required.includes(unit)));
  const pairScores = [scorePair(a, b, scenario, bestStrategyFor(a, b, scenario)), scorePair(b, c, scenario, bestStrategyFor(b, c, scenario)), scorePair(a, c, scenario, bestStrategyFor(a, c, scenario))];
  const coverage = clamp((covered.size / required.length) * 100);
  const roles = trio.map(teamRole);
  const uniqueRoles = new Set(roles.map((role) => role.id));
  const roleBalance = clamp(uniqueRoles.size / 3 * 78 + (hasRole(roles, "sponsor") ? 10 : 0) + (hasRole(roles, "operator") ? 8 : 0) + (hasRole(roles, "translator") ? 6 : 0));
  const decisionRights = clamp((hasRole(roles, "sponsor") ? 38 : 0) + (hasRole(roles, "operator") ? 24 : 0) + (hasRole(roles, "domain") ? 22 : 0) + coverage * .16 - duplicatePenalty(units));
  const boundaryLoad = clamp(100 - (new Set(units).size - 1) * 14 - (required.length - covered.size) * 18 - duplicatePenalty(units) + (hasRole(roles, "translator") ? 14 : 0));
  const pairFriction = average(pairScores.map((score) => score.stress));
  const lensScore = lensCheck(lens.id, { trio, roles, units, scenario, coverage, roleBalance, decisionRights, boundaryLoad, pairFriction });
  const chain = clamp(coverage * .24 + roleBalance * .24 + decisionRights * .22 + boundaryLoad * .15 + lensScore.score * .15);
  const tempo = clamp(average(trio.map((member) => vectorsFor(member).speed)) + (hasRole(roles, "operator") ? 10 : 0) - (required.length - covered.size) * 7);
  const friction = clamp(pairFriction + (100 - boundaryLoad) * .25 + (required.length - covered.size) * 8 - (hasRole(roles, "translator") ? 8 : 0));
  const missing = required.filter((unit) => !covered.has(unit));
  els.pairTitle.textContent = `${a.name} → ${b.name} → ${c.name}`;
  els.fitBadge.textContent = `${chain} · ${chain >= 80 ? "可出任務" : chain >= 62 ? "可打但有洞" : "重抽隊形"}`;
  els.scoreGrid.innerHTML = [
    renderScoreCard("Mission Fit", chain, "組織覆蓋、角色互補與管理檢定的總判定"),
    renderScoreCard("Role Balance", roleBalance, "隊伍是否同時有 sponsor / domain / translator / operator"),
    renderScoreCard("Decision Rights", decisionRights, "權責是否足以讓會議有 owner 和下一步"),
    renderScoreCard("Boundary Cost", 100 - boundaryLoad, "跨單位協調成本，分數越低越好")
  ].join("");
  const laneText = trio.map((member, index) => `${member.name}<b>${["開局", "轉接", "收束"][index]} · ${unitName(unitFor(member))} · ${teamRole(member).name}</b>`).join("<span>→</span>");
  const event = labEvent({ chain, missing, friction, lensScore, roles, units });
  els.pairInsight.innerHTML = `
    <div class="combo-line">${laneText}</div>
    <div class="lab-event"><strong>${event.title}</strong><span>${event.text}</span></div>
    <p><strong>檢定：</strong>${lens.name}。${lens.focus}</p>
    <p><strong>命中單位：</strong>${[...covered].map(unitName).join(" / ") || "沒有命中"}。</p>
    <p><strong>缺口：</strong>${missing.length ? missing.map(unitName).join(" / ") : "關鍵單位已覆蓋"}。</p>
    <p><strong>框架判定：</strong>${lensScore.text}</p>
    <p><strong>下一手：</strong>${nextDraftMove({ missing, roles, units, lens })}</p>
  `;
}

function teamRole(member) {
  const unit = unitFor(member);
  const roleText = `${member.role || ""} ${member.department || ""}`;
  const vectors = vectorsFor(member);
  if (["ceo", "general-mgmt"].includes(unit) || /總|處長|經理|主管|head|lead/i.test(roleText)) {
    return { id: "sponsor", name: "Sponsor" };
  }
  if (["tech-rd", "newbiz", "sales-marketing"].includes(unit) && average([vectors.data, vectors.risk, vectors.clarity]) >= 68) {
    return { id: "domain", name: "Domain Expert" };
  }
  if (vectors.context + vectors.warmth >= 130 || /行銷|專案|PM|協調|統籌/.test(roleText)) {
    return { id: "translator", name: "Translator" };
  }
  if (vectors.speed + vectors.clarity >= 130) {
    return { id: "operator", name: "Operator" };
  }
  return { id: "wildcard", name: "Wildcard" };
}

function hasRole(roles, id) {
  return roles.some((role) => role.id === id);
}

function duplicatePenalty(units) {
  return (units.length - new Set(units).size) * 14;
}

function lensCheck(id, context) {
  const { roles, units, scenario, coverage, roleBalance, decisionRights, boundaryLoad, pairFriction } = context;
  if (id === "tuckman") {
    const storming = scenario.pressure.friction > 42 || pairFriction > 42;
    const score = clamp((storming ? decisionRights * .45 + boundaryLoad * .35 + roleBalance * .2 : coverage * .45 + roleBalance * .35 + boundaryLoad * .2));
    return { score, text: storming ? "這局像 Storming：先處理權責和摩擦，不要直接衝交付。" : "這局可進 Norming：角色和節奏若固定，就能穩定推進。" };
  }
  if (id === "belbin") {
    const score = clamp(roleBalance - duplicatePenalty(units) + (hasRole(roles, "wildcard") ? -6 : 0));
    return { score, text: uniqueRoleText(roles) };
  }
  if (id === "topologies") {
    const unitSpread = new Set(units).size;
    const score = clamp(boundaryLoad + (unitSpread === 2 ? 12 : unitSpread === 3 ? 4 : -8));
    return { score, text: unitSpread >= 3 ? "這是 collaboration 模式，適合短期攻堅，但需要明確接口避免開成大拜拜。" : "這比較像 facilitating / X-as-a-Service，可以用一個主責單位拉另一個單位支援。" };
  }
  const score = clamp(decisionRights + (hasRole(roles, "sponsor") ? 8 : -12));
  return { score, text: hasRole(roles, "sponsor") ? "RACI 有 Accountable 角色，可以進入決策；下一步要補 Responsible 的交付描述。" : "RACI 缺 Accountable，會議可能變成大家都有意見但沒有人能拍板。" };
}

function uniqueRoleText(roles) {
  const names = [...new Set(roles.map((role) => role.name))];
  return `目前隊形角色是 ${names.join(" / ")}。${names.length >= 3 ? "互補度夠，可以測任務。" : "角色太像，容易同溫層或同一種盲點放大。"}`;
}

function labEvent({ chain, missing, friction, lensScore }) {
  if (missing.length) return { title: "Event: Missing Stakeholder", text: `缺 ${missing.map(unitName).join(" / ")}，下一輪如果不補，方案會在交接處斷掉。` };
  if (friction > 55) return { title: "Event: Storming Spike", text: "摩擦過高，先做權責澄清或一頁 brief，不然越討論越散。" };
  if (lensScore.score < 55) return { title: "Event: Framework Fail", text: "組織覆蓋看似足夠，但管理檢定沒過，需要換角色或換互動模式。" };
  if (chain >= 80) return { title: "Event: Combo Window", text: "這組隊形可以進 Mission Run，適合測一次五回合推進。" };
  return { title: "Event: Narrow Pass", text: "可以打，但要先決定誰拍板、誰交付、誰只被諮詢。" };
}

function nextDraftMove({ missing, roles, lens }) {
  if (missing.length) return `補一張 ${unitName(missing[0])} 牌。`;
  if (!hasRole(roles, "sponsor")) return "補 Sponsor / Accountable，讓會議有拍板權。";
  if (!hasRole(roles, "translator")) return "補 Translator，降低跨單位語言成本。";
  if (lens.id === "topologies") return "把互動模式寫清楚：collaboration 只限短衝，之後要轉成固定接口。";
  return "進 Mission Run，測五回合內是否能把 Friction 壓下來。";
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
  if (view === "org") renderOrgMap();
}

function renderOrgMap() {
  if (!els.orgMap) return;
  const mission = state.meeting.scenario;
  const required = new Set(missionRequires(mission));
  const covered = new Set(state.meeting.coveredUnits);
  const query = (els.orgSearch?.value || "").trim().toLowerCase();
  const activeUnit = els.orgUnitFilter?.value || "all";
  const membersByUnit = GAME_DATA.orgUnits.reduce((acc, unit) => ({ ...acc, [unit.id]: [] }), {});
  allOrgMembers().forEach((member) => {
    const unit = unitFor(member);
    if (!membersByUnit[unit]) membersByUnit[unit] = [];
    membersByUnit[unit].push(member);
  });
  const directoryGroups = GAME_DATA.orgDirectory || [];

  els.orgLegend.innerHTML = `
    <span><b>${mission.name}</b></span>
    <span>Required lanes: ${missionRequires(mission).map(unitName).join(" / ")}</span>
  `;
  const visibleUnits = GAME_DATA.orgUnits.filter((unit) => activeUnit === "all" || unit.id === activeUnit);
  els.orgMap.innerHTML = visibleUnits.map((unit) => {
    const status = covered.has(unit.id) ? "covered" : required.has(unit.id) ? "required" : "optional";
    const members = (membersByUnit[unit.id] || []).filter((member) => {
      if (!query) return true;
      return `${member.name} ${member.localName || ""} ${member.department} ${member.role}`.toLowerCase().includes(query);
    });
    const departments = [...members.reduce((map, member) => {
      const dept = member.department || "待補";
      if (!map.has(dept)) map.set(dept, []);
      map.get(dept).push(member);
      return map;
    }, new Map()).entries()].sort((a, b) => b[1].length - a[1].length);
    const isOpen = state.selectedOrgUnit === unit.id || activeUnit === unit.id || required.has(unit.id);
    return `
      <article class="org-node ${status} ${state.selectedOrgUnit === unit.id ? "selected" : ""}" style="--unit:${UNIT_COLORS[unit.id] || "#fff"}" data-unit="${unit.id}">
        <details class="org-tree-unit" ${isOpen ? "open" : ""}>
          <summary>
            <span>${status.toUpperCase()}</span>
            <h3>${unit.name}</h3>
            <b>${members.length} members · ${departments.length} teams</b>
          </summary>
          <p>${unit.tagline}</p>
          <div class="node-tags">${unit.capability.map((item) => `<b>${item}</b>`).join("")}</div>
          <small>${unit.risk}</small>
          <button class="org-open" type="button" data-unit="${unit.id}">看整個 ${unit.name}</button>
          <div class="org-branches">
            ${departments.map(([dept, deptMembers]) => `
              <details class="org-branch" ${state.selectedOrgDept === dept ? "open" : ""}>
                <summary>
                  <button class="org-dept" type="button" data-unit="${unit.id}" data-dept="${dept}">${dept}</button>
                  <b>${deptMembers.length}</b>
                </summary>
                <div class="branch-people">
                  ${deptMembers.slice(0, 16).map((member) => `<button class="person-chip" type="button" data-unit="${unit.id}" data-dept="${dept}" data-member="${member.id}">${member.name}${member.localName ? ` / ${member.localName}` : ""}</button>`).join("")}
                  ${deptMembers.length > 16 ? `<i>+${deptMembers.length - 16} more</i>` : ""}
                </div>
              </details>
            `).join("")}
          </div>
        </details>
      </article>
    `;
  }).join("");
  els.orgMap.querySelectorAll(".org-open").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedOrgUnit = button.dataset.unit;
      state.selectedOrgDept = null;
      if (els.orgUnitFilter) els.orgUnitFilter.value = button.dataset.unit;
      renderOrgMap();
      renderMembers();
    });
  });
  els.orgMap.querySelectorAll(".org-dept, .person-chip").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      state.selectedOrgUnit = button.dataset.unit;
      state.selectedOrgDept = button.dataset.dept;
      if (els.orgUnitFilter) els.orgUnitFilter.value = button.dataset.unit;
      renderOrgMap();
      renderMembers();
    });
  });
  const selected = activeUnit !== "all" ? activeUnit : state.selectedOrgUnit;
  const selectedMembers = (selected === "all" ? allOrgMembers() : (membersByUnit[selected] || []))
    .filter((member) => !state.selectedOrgDept || member.department === state.selectedOrgDept);
  if (els.orgDetail) {
    const byDept = [...selectedMembers.reduce((map, member) => {
      const dept = member.department || "待補";
      map.set(dept, (map.get(dept) || 0) + 1);
      return map;
    }, new Map()).entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    els.orgDetail.innerHTML = `
      <strong>${state.selectedOrgDept || (selected === "all" ? "全部組織" : unitName(selected))}</strong>
      ${byDept.map(([dept, count]) => `<span>${dept}<b>${count}</b></span>`).join("")}
    `;
  }
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
    played: [],
    coveredUnits: [],
    lastDepartment: null,
    lastUnit: null,
    log: [`任務展開：${mission.goal}`]
  };
  drawHand();
  renderMeeting();
}

function renderMeeting() {
  const meeting = state.meeting;
  const requiredUnits = missionRequires(meeting.scenario);
  const covered = new Set(meeting.coveredUnits);
  const missing = requiredUnits.filter((unit) => !covered.has(unit));
  els.meetingTitle.textContent = meeting.scenario.name;
  els.meetingScenario.textContent = meeting.scenario.prompt;
  els.missionBrief.innerHTML = `
    <strong>Win</strong>
    <span>五回合內讓 Trust / Clarity / Momentum 達 70，Friction 低於 45，且關鍵單位必須都上場。</span>
    <b>${meeting.played.length} cards played</b>
    <b>${missing.length ? `missing: ${missing.map(unitName).join(" / ")}` : "coverage: complete"}</b>
    <div class="lane-strip">${requiredUnits.map((unit) => `<i class="${covered.has(unit) ? "covered" : ""}" style="--unit:${UNIT_COLORS[unit] || "#fff"}">${unitName(unit)}</i>`).join("")}</div>
  `;
  els.turnCount.textContent = `Turn ${Math.min(meeting.turn, 5)} / 5`;
  ["trust", "clarity", "momentum", "friction"].forEach((key) => {
    els.meters[key].value = meeting[key];
    els.values[key].textContent = meeting[key];
  });
  els.meetingLog.innerHTML = meeting.log.map((item) => `<li>${item}</li>`).join("");
  renderActionCards();
  renderOrgMap();
}

function drawHand() {
  const played = new Set(state.meeting.played);
  const candidates = GAME_DATA.members.filter((member) => !played.has(member.id));
  const pool = candidates.length >= 5 ? candidates : GAME_DATA.members;
  state.meeting.hand = [...pool]
    .sort(() => Math.random() - .5)
    .slice(0, 5)
    .map((member) => member.id);
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
  els.actionCards.innerHTML = state.meeting.hand.map((memberId) => {
    const member = memberById(memberId);
    const action = bestActionForMember(member);
    const birth = birthProfile(member);
    const fit = cardFit(member, action);
    const rarity = cardRarity(member, action);
    const pips = cardPips(member, action, fit);
    const unit = unitFor(member);
    return `
      <button class="action-card play-card ${elementClass(birth.element)} ${rarity} ${fit.className}" type="button" data-member="${member.id}" ${disabled}>
        <span class="sigil">${action.icon}</span>
        <i>${fit.label}</i>
        <strong>${member.name}</strong>
        <em>${unitName(unit)} · ${member.department || "待補"}</em>
        <small>${action.name}: ${action.copy}</small>
        <div class="card-pips">${pips.map((pip) => `<mark>${pip}</mark>`).join("")}</div>
        <b>${fit.risk ? `Risk: ${fit.risk.title}` : comboPreview(member)}</b>
      </button>
    `;
  }).join("");
  els.actionCards.querySelectorAll(".action-card").forEach((button) => {
    button.addEventListener("click", () => playMeetingTurn(button.dataset.member));
  });
}

function cardFit(member, action) {
  const meeting = state.meeting;
  const unit = unitFor(member);
  const required = missionRequires(meeting.scenario);
  const traits = traitsFor(member);
  const profile = GAME_DATA.distillations?.[member.id];
  const vectorScore = vectorsFor(member)[action.vector] - 66;
  const requiredBonus = required.includes(unit) ? 24 : -18;
  const newLaneBonus = required.includes(unit) && !meeting.coveredUnits.includes(unit) ? 14 : 0;
  const repeatPenalty = meeting.lastUnit && meeting.lastUnit === unit ? -12 : 0;
  const profileBonus = actionProfileBonus(action, profile) / 3;
  const risk = triggeredRisk(member, action, unit);
  const riskPenalty = risk ? risk.penalty : 0;
  const score = vectorScore + requiredBonus + newLaneBonus + repeatPenalty + profileBonus - riskPenalty;

  if (risk?.fatal) return { score, label: "BLOCKER", className: "blocker", risk };
  if (score >= 32) return { score, label: "CORE FIT", className: "core-fit", risk };
  if (score >= 12) return { score, label: "USEFUL", className: "useful-fit", risk };
  if (score >= -8) return { score, label: "RISKY", className: "risky-fit", risk };
  return { score, label: "OFF-LANE", className: "off-lane", risk };
}

function triggeredRisk(member, action, unit) {
  const mission = state.meeting.scenario;
  const traits = traitsFor(member);
  const required = missionRequires(mission);
  if (!required.includes(unit)) {
    return { title: "打錯戰場", text: `${unitName(unit)} 不是這張任務的關鍵缺口，會製造更多交接噪音。`, penalty: 16 };
  }
  if (member.id === "rock" && ["rc-lock", "fabric-api-78", "nunox-ip"].includes(mission.id)) {
    return { title: "知識鎖倉", text: "技術真相有了，但如果不綁文件化義務，單點風險會變更大。", penalty: 18 };
  }
  if (traits.includes("waits-for-brief") && ["ai-seed", "sttrix-gtm", "pilot-feedback"].includes(mission.id) && action.id !== "frame") {
    return { title: "等待模式", text: "需要主動定義需求的局，若沒先授權，會退回等規格。", penalty: 14 };
  }
  if (traits.includes("over-research") && ["vivatech-booth", "sttrix-gtm", "debbie-gap"].includes(mission.id) && action.id === "prototype") {
    return { title: "研究過深", text: "這局缺的是取捨節奏，過度研究會讓 demo 窗口被吃掉。", penalty: 13 };
  }
  if (traits.includes("weak-expression") && ["taipei-chiayi", "rc-lock", "fabric-api-78"].includes(mission.id) && action.id === "bridge") {
    return { title: "表達斷點", text: "細節判斷很準，但直接放到跨部門翻譯位會卡在說不清。", penalty: 15 };
  }
  if (traits.includes("overloaded") && ["debbie-gap", "sttrix-gtm"].includes(mission.id)) {
    return { title: "超載", text: "可靠牌不是免洗資源，繼續加壓會讓 Trust 看似上升、Friction 暗中累積。", penalty: 12 };
  }
  if (traits.includes("quality-gate-gap") && ["rc-lock", "sequin-qipao", "dicks-placement-print"].includes(mission.id) && action.id === "gate") {
    return { title: "白臉真空", text: "架構可以設，但品質 gate 需要外部標準撐住，不然現場會滑動。", penalty: 10 };
  }
  if (traits.includes("profile-thin") && state.meeting.turn <= 2) {
    return { title: "資料薄", text: "太早把低觀察資料的人放核心位，會增加推演不確定性。", penalty: 10 };
  }
  return null;
}

function cardRarity(member, action) {
  const profile = GAME_DATA.distillations?.[member.id];
  const base = vectorsFor(member)[action.vector] + actionProfileBonus(action, profile);
  if (base >= 96) return "legendary";
  if (base >= 86) return "rare";
  return "common";
}

function rarityLabel(rarity) {
  return {
    legendary: "LEGEND",
    rare: "RARE",
    common: "CORE"
  }[rarity];
}

function cardPips(member, action, fit) {
  const vector = vectorsFor(member)[action.vector];
  const profile = GAME_DATA.distillations?.[member.id];
  const unit = unitFor(member);
  const pips = [unitName(unit), `${axisName(action.vector)} ${vector}`];
  if (profile?.aiFit >= 4) pips.push("AI+");
  if (fit?.score < 0) pips.push("MISFIT");
  if (state.meeting.lastUnit && state.meeting.lastUnit !== unit) pips.push("COMBO");
  return pips.slice(0, 3);
}

function bestActionForMember(person) {
  const profile = GAME_DATA.distillations?.[person.id];
  return GAME_DATA.actionTypes
    .map((action) => ({
      action,
      score: vectorsFor(person)[action.vector] + (state.meeting.scenario.weights[action.vector] || 1) * 16 + actionProfileBonus(action, profile)
    }))
    .sort((left, right) => right.score - left.score)[0].action;
}

function comboPreview(person) {
  const unit = unitFor(person);
  if (!state.meeting.lastUnit) return "Opening move";
  if (state.meeting.lastUnit !== unit) return "Cross-unit combo +";
  return "Same-lane pressure";
}

function playMeetingTurn(memberId) {
  const meeting = state.meeting;
  const person = memberById(memberId);
  const action = bestActionForMember(person);
  const unit = unitFor(person);
  const fit = cardFit(person, action);
  const self = memberById("elly");
  const pseudoScenario = { id: meeting.scenario.id, weights: meeting.scenario.weights };
  const strategy = strategyFromAction(action);
  const scores = scorePair(self, person, pseudoScenario, strategy);
  const boost = action.boosts;
  const vectorFit = (vectorsFor(person)[action.vector] - 50) / 6;
  const orgFit = actionProfileBonus(action, GAME_DATA.distillations?.[person.id]) / 4;
  const crossUnit = meeting.lastUnit && meeting.lastUnit !== unit;
  const sameLane = meeting.lastUnit && meeting.lastUnit === unit;
  const elementText = relationFor(self, person);
  const elementBoost = elementText.includes("相生") ? 4 : elementText.includes("相剋") ? -2 : 1;
  const laneBonus = missionRequires(meeting.scenario).includes(unit) ? 3 : -8;
  const newRequiredLane = missionRequires(meeting.scenario).includes(unit) && !meeting.coveredUnits.includes(unit);
  const riskPenalty = fit.risk ? fit.risk.penalty : 0;
  const offLane = fit.className === "off-lane" || fit.className === "blocker";

  meeting.trust = clamp(meeting.trust + (boost.trust || 0) + (scores.communication - 64) / 11 + orgFit + (crossUnit ? 3 : 0) + (offLane ? -7 : 0));
  meeting.clarity = clamp(meeting.clarity + (boost.clarity || 0) + vectorFit + (scores.work - 66) / 13 + elementBoost + laneBonus - riskPenalty / 5);
  meeting.momentum = clamp(meeting.momentum + (boost.momentum || 0) + (scores.decision - 64) / 12 + (sameLane ? 2 : 0) + (newRequiredLane ? 5 : 0) - (offLane ? 5 : 0));
  meeting.friction = clamp(meeting.friction + (boost.friction || 0) + (scores.stress - 50) / 8 - orgFit + (crossUnit ? -3 : 0) + (sameLane ? 8 : 0) + riskPenalty / 2 + (offLane ? 8 : 0));

  const profile = GAME_DATA.distillations?.[person.id];
  const solution = profile ? profile.leverage : `${unitName(unit)} 進場，補上一個正式組織視角。`;
  const comboText = crossUnit ? `跨單位 combo：${unitName(meeting.lastUnit)} → ${unitName(unit)}` : sameLane ? "同單位連打：速度上升，但 tunnel vision 增加" : "開場佈局";
  const riskText = fit.risk ? `風險觸發「${fit.risk.title}」：${fit.risk.text}` : "沒有明顯錯配。";
  meeting.log.unshift(`T${meeting.turn}: ${person.name} / ${unitName(unit)} 打出「${action.name}」〔${fit.label}〕。${comboText}。${riskText}`);
  meeting.log.unshift(`組織效果：${solution}`);
  meeting.played.push(person.id);
  if (!meeting.coveredUnits.includes(unit) && missionRequires(meeting.scenario).includes(unit)) {
    meeting.coveredUnits.push(unit);
  }
  meeting.lastDepartment = person.department;
  meeting.lastUnit = unit;
  meeting.turn += 1;

  if (meeting.turn > 5) {
    const missing = missingUnits();
    const win = meeting.trust >= 70 && meeting.clarity >= 70 && meeting.momentum >= 70 && meeting.friction < 45 && missing.length === 0;
    meeting.log.unshift(win ? `任務完成：${meeting.scenario.goal}` : `任務卡住：${missing.length ? `缺 ${missing.map(unitName).join(" / ")}` : "數值未達標或摩擦過高"}。下一輪需要換地形，不是只換人。`);
  }
  drawHand();
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
  els.orgSearch?.addEventListener("input", () => {
    renderOrgMap();
    renderMembers();
  });
  els.orgUnitFilter?.addEventListener("change", () => {
    state.selectedOrgUnit = els.orgUnitFilter.value;
    state.selectedOrgDept = null;
    renderOrgMap();
    renderMembers();
  });
  els.analyzePair.addEventListener("click", analyzePair);
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
