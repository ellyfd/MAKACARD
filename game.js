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
  selectedOrgDept: null,
  orgFocus: { type: "root" }
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
  orgTitle: document.querySelector("#org-title"),
  orgBack: document.querySelector("#org-back"),
  orgHome: document.querySelector("#org-home"),
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
  "fabric-trim-delay": ["sales-marketing", "tech-rd", "overseas", "ops-mgmt"],
  "pp-sample-loop": ["sales-marketing", "tech-rd", "overseas"],
  "spec-version-drift": ["sales-marketing", "tech-rd", "ops-mgmt"],
  "qc-rework-spike": ["tech-rd", "overseas", "sales-marketing"],
  "capacity-wip-bottleneck": ["sales-marketing", "tech-rd", "overseas", "ops-mgmt"],
  "digital-sample-adoption": ["newbiz", "tech-rd", "sales-marketing"],
  "shipment-booking-crunch": ["sales-marketing", "tech-rd", "overseas"],
  "costing-margin-squeeze": ["sales-marketing", "tech-rd", "ops-mgmt"],
  "sustainability-traceability": ["general-mgmt", "sales-marketing", "tech-rd", "overseas"],
  "ai-plm-visibility": ["newbiz", "ops-mgmt", "sales-marketing", "tech-rd"]
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
    id: "war-room",
    name: "War Room Sprint",
    focus: "限時救火局：先補缺口單位，再用事件卡測 owner、deadline、risk。"
  },
  {
    id: "role-draft",
    name: "Role Balance Draft",
    focus: "像 team-building 桌遊一樣組隊：Sponsor、Domain、Translator、Operator 不能缺太多。"
  },
  {
    id: "handoff-relay",
    name: "Handoff Relay",
    focus: "接力賽局：每張牌都要把輸入轉成下一張牌能執行的輸出。"
  },
  {
    id: "raci",
    name: "RACI Gate",
    focus: "決策閘門局：沒有 Accountable 就不能過關，Consulted 太多會加摩擦。"
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
  return [...GAME_DATA.scenarios, ...GAME_DATA.orgMissions].find((scenario) => scenario.id === id);
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
    status: /^\d{4}-\d{2}-\d{2}$/.test(member.birthday) ? member.birthday : "待補"
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

function orgChartMembers() {
  const members = allOrgMembers();
  const alex = members.find((member) => member.id === "alex");
  const aliases = alex ? [
    { ...alex, id: "alex-newbiz-digital-product", role: "執行長（兼）", department: "數位產品發展中心", orgUnit: "newbiz" },
    { ...alex, id: "alex-newbiz-smart-textile", role: "執行長（兼）", department: "智慧紡織發展中心", orgUnit: "newbiz" }
  ] : [];
  return [...members, ...aliases];
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
  if (!els.memberGrid) return;
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
  fillSelect(els.scenarioSelect, GAME_DATA.orgMissions, (scenario) => scenario.name);
  fillSelect(els.frameworkSelect, TEAM_LENSES, (lens) => lens.name);
  els.personA.value = "elly";
  els.personB.value = "sixian";
  els.personC.value = "douglas-lu";
  els.frameworkSelect.value = "war-room";
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
  const resource = teamResources({ trio, roles, units, scenario, coverage, roleBalance, decisionRights, boundaryLoad, pairFriction });
  const chain = clamp(coverage * .24 + roleBalance * .24 + decisionRights * .22 + boundaryLoad * .15 + lensScore.score * .15);
  const tempo = clamp(average(trio.map((member) => vectorsFor(member).speed)) + (hasRole(roles, "operator") ? 10 : 0) - (required.length - covered.size) * 7);
  const friction = clamp(pairFriction + (100 - boundaryLoad) * .25 + (required.length - covered.size) * 8 - (hasRole(roles, "translator") ? 8 : 0));
  const missing = required.filter((unit) => !covered.has(unit));
  els.pairTitle.textContent = `${a.name} → ${b.name} → ${c.name}`;
  els.fitBadge.textContent = `${chain} · ${chain >= 80 ? "可出任務" : chain >= 62 ? "可打但有洞" : "重抽隊形"}`;
  els.scoreGrid.innerHTML = [
    renderScoreCard("Draft Score", chain, "這組隊形進任務前的可打程度"),
    renderScoreCard("Role Spread", roleBalance, "Sponsor / Domain / Translator / Operator 的互補程度"),
    renderScoreCard("Decision Token", decisionRights, "是否有人能拍板，不只是討論"),
    renderScoreCard("Handoff Tax", 100 - boundaryLoad, "跨單位交接成本，分數越低越好")
  ].join("");
  const laneText = trio.map((member, index) => `${member.name}<b>${["開局", "轉接", "收束"][index]} · ${unitName(unitFor(member))} · ${teamRole(member).name}</b>`).join("<span>→</span>");
  const event = labEvent({ chain, missing, friction, lensScore, roles, units });
  els.pairInsight.innerHTML = `
    <div class="combo-line">${laneText}</div>
    <div class="draft-slots">
      ${trio.map((member, index) => `<span><b>${["開局", "轉接", "收束"][index]}</b>${teamRole(member).name}<i>${unitName(unitFor(member))}</i></span>`).join("")}
    </div>
    <div class="lab-event"><strong>${event.title}</strong><span>${event.text}</span></div>
    <div class="resource-board">
      <span>Time <b>${resource.time}</b></span>
      <span>Authority <b>${resource.authority}</b></span>
      <span>Evidence <b>${resource.evidence}</b></span>
      <span>Trust <b>${resource.trust}</b></span>
    </div>
    <p><strong>Draft Mode：</strong>${lens.name}。${lens.focus}</p>
    <p><strong>任務覆蓋：</strong>${[...covered].map(unitName).join(" / ") || "沒有命中"}；${missing.length ? `缺 ${missing.map(unitName).join(" / ")}` : "關鍵單位已覆蓋"}。</p>
    <p><strong>檢定事件：</strong>${lensScore.text}</p>
    <p><strong>下一張牌：</strong>${nextDraftMove({ missing, roles, units, lens })}</p>
  `;
}

function teamResources({ roles, coverage, decisionRights, boundaryLoad, pairFriction }) {
  return {
    time: clamp(50 + (hasRole(roles, "operator") ? 18 : 0) + coverage * .18 - pairFriction * .2),
    authority: clamp(decisionRights + (hasRole(roles, "sponsor") ? 12 : -18)),
    evidence: clamp(48 + (hasRole(roles, "domain") ? 22 : 0) + coverage * .18),
    trust: clamp(42 + (hasRole(roles, "translator") ? 22 : 0) + boundaryLoad * .18 - pairFriction * .15)
  };
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
  if (id === "war-room") {
    const score = clamp(coverage * .38 + decisionRights * .28 + (100 - pairFriction) * .22 + (hasRole(roles, "operator") ? 12 : -8));
    return { score, text: score >= 70 ? "War Room 成立：先開 30 分鐘決策會，產出 owner / deadline / escalation path。" : "救火隊不完整：先補缺口單位或拍板角色，否則只會把問題轉寄給下一個人。" };
  }
  if (id === "role-draft") {
    const score = clamp(roleBalance - duplicatePenalty(units) + (hasRole(roles, "wildcard") ? -6 : 0));
    return { score, text: uniqueRoleText(roles) };
  }
  if (id === "handoff-relay") {
    const unitSpread = new Set(units).size;
    const score = clamp(boundaryLoad + (unitSpread === 2 ? 12 : unitSpread === 3 ? 4 : -8));
    return { score, text: unitSpread >= 3 ? "這是跨單位接力：每棒都要交付明確輸入/輸出，不然會變成同步會議地獄。" : "隊形偏單一路線，適合快速處理局部問題，但不一定能覆蓋整條成衣流程。" };
  }
  const score = clamp(decisionRights + (hasRole(roles, "sponsor") ? 8 : -12));
  return { score, text: hasRole(roles, "sponsor") ? "RACI 有 Accountable 角色，可以進入決策；下一步要補 Responsible 的交付描述。" : "RACI 缺 Accountable，會議可能變成大家都有意見但沒有人能拍板。" };
}

function uniqueRoleText(roles) {
  const names = [...new Set(roles.map((role) => role.name))];
  return `目前隊形角色是 ${names.join(" / ")}。${names.length >= 3 ? "互補度夠，可以測任務。" : "角色太像，容易同溫層或同一種盲點放大。"}`;
}

function labEvent({ chain, missing, friction, lensScore }) {
  if (missing.length) return { title: "Event Card: Stakeholder Gap", text: `缺 ${missing.map(unitName).join(" / ")}，這隊還不能進場，先補正式接口。` };
  if (friction > 55) return { title: "Event Card: Storming Spike", text: "角色能量夠，但交接稅太高；先換轉接牌或選 Handoff Relay 模式。" };
  if (lensScore.score < 55) return { title: "Event Card: Failed Check", text: "單位覆蓋看似足夠，但隊形沒有通過這種玩法的檢定。" };
  if (chain >= 80) return { title: "Event Card: Combo Window", text: "Draft 成功，可以把這隊丟進 Mission Run 測五回合。" };
  return { title: "Event Card: Narrow Pass", text: "可以進場，但只能打短任務；長任務要補授權或證據鏈。" };
}

function nextDraftMove({ missing, roles, lens }) {
  if (missing.length) return `補一張 ${unitName(missing[0])} 牌。`;
  if (!hasRole(roles, "sponsor")) return "補 Sponsor / Accountable，讓會議有拍板權。";
  if (!hasRole(roles, "translator")) return "補 Translator，降低跨單位語言成本。";
  if (lens.id === "handoff-relay") return "把每棒輸入/輸出寫清楚，避免跨單位只同步不交付。";
  if (lens.id === "war-room") return "開 30 分鐘 war room，只決定 owner、deadline、升級條件。";
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
  const query = (els.orgSearch?.value || "").trim().toLowerCase();
  const hierarchy = orgHierarchy(query);
  const focus = state.orgFocus || { type: "root" };
  const view = orgViewForFocus(hierarchy, focus);
  els.orgTitle.textContent = view.title;
  els.orgLegend.innerHTML = renderOrgBreadcrumb(focus);
  els.orgMap.className = `org-map drill-${view.level}`;
  els.orgMap.innerHTML = `${renderOrgParentNode(view)}<div class="org-child-row">${view.nodes.length ? view.nodes.map(renderOrgFocusNode).join("") : renderOrgEmptyState(view)}</div>`;
  els.orgMap.querySelectorAll("[data-org-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.orgAction;
      if (action === "unit") state.orgFocus = { type: "unit", unit: button.dataset.unit };
      if (action === "dept") state.orgFocus = { type: "dept", unit: button.dataset.unit, dept: button.dataset.dept, deptId: button.dataset.deptId };
      if (action === "person") state.orgFocus = { type: "person", unit: button.dataset.unit, dept: button.dataset.dept, deptId: button.dataset.deptId, person: button.dataset.person };
      renderOrgMap();
    });
  });
  if (els.orgDetail) els.orgDetail.innerHTML = view.detail || "";
  if (els.orgBack) els.orgBack.disabled = focus.type === "root";
}

function renderOrgParentNode(view) {
  return `
    <article class="org-parent-node">
      <span>${view.level === "root" ? "ROOT" : "FOCUS"}</span>
      <h3>${view.title}</h3>
      <p>${view.summary || `${view.nodes.length} 個下層節點`}</p>
    </article>
  `;
}

function renderOrgEmptyState(view) {
  return `
    <article class="org-empty-state">
      <strong>${view.emptyTitle || "成員資料待補"}</strong>
      <p>${view.emptyText || "這個正式組織節點已建立；待匯入 PDF/VSD 內的人員名單後，這裡會展開成員卡。"}</p>
    </article>
  `;
}

function orgHierarchy(query = "") {
  const normalized = query.trim().toLowerCase();
  const people = orgChartMembers().filter((member) => {
    if (!normalized) return true;
    return `${member.name} ${member.localName || ""} ${member.department || ""} ${member.role || ""} ${unitName(unitFor(member))}`.toLowerCase().includes(normalized);
  });
  const units = GAME_DATA.orgUnits.map((unit) => {
    const unitPeople = people.filter((member) => unitFor(member) === unit.id);
    const departments = orgDirectories(unit.id).filter((dept) => !dept.parent);
    return { ...unit, people: unitPeople, departments };
  }).filter((unit) => unit.people.length || !normalized);
  return { units, people };
}

function orgDirectories(unitId) {
  return (GAME_DATA.orgDirectory || []).filter((item) => item.unit === unitId);
}

function orgDirectoryById(id) {
  return (GAME_DATA.orgDirectory || []).find((item) => item.id === id);
}

function orgDirectoryChildren(parentId) {
  return (GAME_DATA.orgDirectory || []).filter((item) => item.parent === parentId);
}

function orgDirectoryMembers(directory, people = orgChartMembers()) {
  const ids = new Set(directory?.members || []);
  const explicit = people.filter((member) => ids.has(member.id));
  const inferred = people.filter((member) => !ids.has(member.id) && isInferredDirectoryMember(member, directory));
  return [...explicit, ...inferred].sort((left, right) => (left.localName || left.name).localeCompare(right.localName || right.name));
}

function isInferredDirectoryMember(member, directory) {
  if (!directory?.name || unitFor(member) !== directory.unit) return false;
  const dept = member.department || "";
  if (dept === directory.name) return true;
  if (directory.id === "rd-3d" && dept.includes("3D研發中心")) return true;
  if (directory.id === "technical-design" && dept.includes("技術設計部")) return true;
  if (directory.id === "special-rd" && dept.includes("特工研發中心")) return true;
  if (directory.id === "costing-center" && dept.includes("估碼中心")) return true;
  if (directory.id === "sample-rd" && dept.includes("樣品研發部")) return true;
  if (directory.id === "engineering-hq" && dept.includes("工務管理課")) return true;
  return false;
}

function orgDirectoryOwnCount(directory, people = orgChartMembers()) {
  return orgDirectoryMembers(directory, people).length;
}

function orgDirectoryCount(directory, people = orgChartMembers()) {
  const own = orgDirectoryOwnCount(directory, people);
  const childCount = orgDirectoryChildren(directory.id).reduce((sum, child) => sum + orgDirectoryCount(child, people), 0);
  return own + childCount;
}

function orgDirectoryPath(directory) {
  if (!directory) return [];
  const parents = [];
  let cursor = directory;
  while (cursor?.parent) {
    cursor = orgDirectoryById(cursor.parent);
    if (cursor) parents.unshift(cursor.name);
  }
  return [unitName(directory.unit), ...parents, directory.name];
}

function orgDirectoryDetail(directory, unit, people) {
  const children = orgDirectoryChildren(directory.id);
  const ownMembers = orgDirectoryMembers(directory, people);
  const ownCount = orgDirectoryOwnCount(directory, people);
  const totalCount = orgDirectoryCount(directory, people);
  const path = orgDirectoryPath(directory).join(" / ");
  return `
    <strong>${directory.name}</strong>
    <span>路徑：${path}</span>
    <span>${children.length ? `下層單位：${children.length}` : "下層單位：無"}</span>
    <span>${ownCount ? `直屬成員：${ownCount}` : "直屬成員：待補"}</span>
    ${children.length ? `<span>含下層成員：${totalCount || "待補"}</span>` : ""}
    ${ownMembers.length ? `<p>直屬成員：${ownMembers.map((member) => `${member.name}${member.localName ? ` / ${member.localName}` : ""}`).join("、")}</p>` : ""}
    <p>${unit?.name || unitName(directory.unit)} 的正式節點；沒有成員時代表名單尚未從 PDF/VSD 匯入，不代表組織不存在。</p>
  `;
}

function orgDirectoryNode(directory, people) {
  const children = orgDirectoryChildren(directory.id);
  const count = orgDirectoryCount(directory, people);
  const ownCount = orgDirectoryOwnCount(directory, people);
  return {
    type: "dept",
    unit: directory.unit,
    dept: directory.name,
    deptId: directory.id,
    title: directory.name,
    count: children.length ? `${children.length} 下層` : count ? `${count} 成員` : "待補",
    subtitle: children.length ? `下層單位 ${children.length}；含成員 ${count || "待補"}` : ownCount ? `成員 ${ownCount}` : "成員資料待補",
    departments: children.length,
    members: orgDirectoryMembers(directory, people)
  };
}

function orgViewForFocus(hierarchy, focus) {
  if (focus.type === "unit") {
    const unit = hierarchy.units.find((item) => item.id === focus.unit) || GAME_DATA.orgUnits.find((item) => item.id === focus.unit);
    const source = hierarchy.units.find((item) => item.id === focus.unit) || { ...unit, departments: [], people: [] };
    return {
      level: "unit",
      title: unit?.name || "組織群",
      nodes: source.departments.map((dept) => orgDirectoryNode(dept, hierarchy.people)),
      summary: `${source.departments.length} 個正式下層單位`,
      detail: `<strong>${unit?.name || ""}</strong><span>下層單位：${source.departments.length}</span><span>已掛成員：${source.people.length || "待補"}</span><p>${unit?.tagline || ""}</p>`
    };
  }
  if (focus.type === "dept") {
    const unit = GAME_DATA.orgUnits.find((item) => item.id === focus.unit);
    const directory = orgDirectoryById(focus.deptId) || (GAME_DATA.orgDirectory || []).find((item) => item.unit === focus.unit && item.name === focus.dept);
    const children = directory ? orgDirectoryChildren(directory.id) : [];
    const ownMembers = directory ? orgDirectoryMembers(directory, hierarchy.people) : [];
    if (children.length) {
      return {
        level: "dept",
        title: directory.name,
        nodes: children.map((child) => orgDirectoryNode(child, hierarchy.people)),
        summary: `${children.length} 個下層單位；直屬成員 ${ownMembers.length || "待補"}`,
        detail: orgDirectoryDetail(directory, unit, hierarchy.people)
      };
    }
    const members = directory ? orgDirectoryMembers(directory, hierarchy.people) : hierarchy.people
      .filter((member) => unitFor(member) === focus.unit && member.department === focus.dept)
      .sort((left, right) => orgChartRank(focus.dept, left) - orgChartRank(focus.dept, right) || left.name.localeCompare(right.name));
    return {
      level: "dept",
      title: directory?.name || focus.dept,
      nodes: members.map((member) => ({ type: "person", unit: focus.unit, dept: directory?.name || focus.dept, deptId: directory?.id || focus.deptId, title: member.name, subtitle: `${member.localName || "中文名待補"} · ${member.role || "職務待補"}`, count: /^\d{4}-\d{2}-\d{2}$/.test(member.birthday || "") ? member.birthday : "生日待補", member })),
      summary: members.length ? `${members.length} 位成員` : "成員資料待補",
      emptyTitle: "成員資料待補",
      emptyText: `${directory?.name || focus.dept} 是正式組織節點；目前只建立架構，待 PDF/VSD 內的人員名單匯入。`,
      detail: directory ? orgDirectoryDetail(directory, unit, hierarchy.people) : `<strong>${focus.dept}</strong><span>路徑：${unit?.name || ""} / ${focus.dept}</span><span>成員：${members.length || "待補"}</span>`
    };
  }
  if (focus.type === "person") {
    const member = orgChartMembers().find((item) => item.id === focus.person);
    return {
      level: "person",
      title: member?.name || "成員",
      nodes: member ? [{ type: "profile", title: member.name, subtitle: member.localName || "中文名待補", member }] : [],
      detail: member ? renderPersonDetail(member) : ""
    };
  }
  return {
    level: "root",
    title: "Makalot 主架構",
    nodes: hierarchy.units.map((unit) => ({ type: "unit", unit: unit.id, title: unit.name, subtitle: unit.tagline, count: `${unit.people.length || "待補"} 成員`, departments: unit.departments.length })),
    summary: `${hierarchy.units.length} 個組織群`,
    detail: "<strong>主架構</strong><p>點一個組織群放大一層；再點正式部門/中心/課/團隊看下層或成員。</p>"
  };
}

function orgChartRank(dept, member) {
  const digitalProduct = ["Alex Chou", "Elly Cheng", "Vanessa Chou", "Alan Liu", "Andy Liu", "Doris Lin", "Emily Shen", "Dianne Chen"];
  const smartTextile = ["Alex Chou", "Wayi Tsai", "Shirley Sun", "Evan Sheu", "Jimmy Chou", "Tanis Lee", "Jonathan Wu", "Gary Yen", "Dean Lo", "Ian Tseng", "Sunny Shih"];
  const list = dept === "數位產品發展中心" ? digitalProduct : dept === "智慧紡織發展中心" ? smartTextile : [];
  const index = list.indexOf(member.name);
  return index === -1 ? 999 : index;
}

function renderOrgFocusNode(node) {
  const unitColor = UNIT_COLORS[node.unit] || UNIT_COLORS[unitFor(node.member || {})] || "#fff";
  if (node.type === "profile") {
    const member = node.member;
    return `
      <article class="org-focus-node profile" style="--unit:${unitColor}">
        <span>PROFILE</span>
        <h3>${member.name}</h3>
        <p>${member.localName || "中文名 待補"}</p>
        <div class="profile-grid">
          <b>單位</b><i>${unitName(unitFor(member))}</i>
          <b>部門</b><i>${member.department || "待補"}</i>
          <b>職務</b><i>${member.role || "待補"}</i>
          <b>生日</b><i>${member.birthday || "待補"}</i>
        </div>
      </article>
    `;
  }
  const action = node.type === "unit" ? "unit" : node.type === "dept" ? "dept" : "person";
  return `
    <button class="org-focus-node ${node.type}" type="button" data-org-action="${action}" data-unit="${node.unit || ""}" data-dept="${node.dept || ""}" data-dept-id="${node.deptId || ""}" data-person="${node.member?.id || ""}" style="--unit:${unitColor}">
      <span>${node.type.toUpperCase()}</span>
      <h3>${node.title}</h3>
      <p>${node.subtitle || ""}</p>
      <strong>${node.count || ""}</strong>
      ${node.departments ? `<em>${node.departments} departments</em>` : ""}
    </button>
  `;
}

function renderOrgBreadcrumb(focus) {
  const parts = [`<button type="button" data-crumb="root">Makalot</button>`];
  if (focus.unit) parts.push(`<button type="button" data-crumb="unit">${unitName(focus.unit)}</button>`);
  if (focus.dept) parts.push(`<button type="button" data-crumb="dept">${focus.dept}</button>`);
  if (focus.person) {
    const member = orgChartMembers().find((item) => item.id === focus.person);
    parts.push(`<button type="button" data-crumb="person">${member?.name || "成員"}</button>`);
  }
  setTimeout(() => {
    els.orgLegend?.querySelectorAll("[data-crumb]").forEach((button) => {
      button.addEventListener("click", () => {
        const crumb = button.dataset.crumb;
        if (crumb === "root") state.orgFocus = { type: "root" };
        if (crumb === "unit") state.orgFocus = { type: "unit", unit: focus.unit };
        if (crumb === "dept") state.orgFocus = { type: "dept", unit: focus.unit, dept: focus.dept, deptId: focus.deptId };
        renderOrgMap();
      });
    });
  }, 0);
  return parts.join("<span>/</span>");
}

function renderPersonDetail(member) {
  const birth = birthProfile(member);
  const hasBirthday = /^\d{4}-\d{2}-\d{2}$/.test(member.birthday);
  return `
    <strong>${member.name}</strong>
    <span>${member.localName || "中文名 待補"}</span>
    <span>${unitName(unitFor(member))}</span>
    <span>${member.department || "部門 待補"}</span>
    <span>${member.role || "職務 待補"}</span>
    <span>${hasBirthday ? `靈數 ${birth.numerology} / ${birth.element}行 / ${birth.zodiac}` : "生日資料 待補"}</span>
  `;
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
    <strong>Crisis Run</strong>
    <span>五回合內打出人物牌解任務。Trust / Clarity / Momentum 要達 70，Friction 低於 45，且關鍵單位必須都上場。</span>
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
  const actionNeed = ((meeting.scenario.weights?.[action.vector] || 1) - 1) * 42;
  const requiredBonus = required.includes(unit) ? 18 : -24;
  const newLaneBonus = required.includes(unit) && !meeting.coveredUnits.includes(unit) ? 11 : 0;
  const repeatPenalty = meeting.lastUnit && meeting.lastUnit === unit ? -16 : 0;
  const profileBonus = actionProfileBonus(action, profile) / 3;
  const risk = triggeredRisk(member, action, unit);
  const riskPenalty = risk ? risk.penalty : 0;
  const score = vectorScore + actionNeed + requiredBonus + newLaneBonus + repeatPenalty + profileBonus - riskPenalty;

  if (risk?.fatal) return { score, label: "BLOCKER", className: "blocker", risk };
  if (score >= 38) return { score, label: "CORE FIT", className: "core-fit", risk };
  if (score >= 18) return { score, label: "USEFUL", className: "useful-fit", risk };
  if (score >= 0) return { score, label: "RISKY", className: "risky-fit", risk };
  return { score, label: "OFF-LANE", className: "off-lane", risk };
}

function triggeredRisk(member, action, unit) {
  const mission = state.meeting.scenario;
  const traits = traitsFor(member);
  const required = missionRequires(mission);
  if (!required.includes(unit)) {
    return { title: "打錯戰場", text: `${unitName(unit)} 不是這張任務的關鍵缺口，會製造更多交接噪音。`, penalty: 16 };
  }
  if (member.id === "rock" && ["qc-rework-spike", "sustainability-traceability", "ai-plm-visibility"].includes(mission.id) && action.id !== "evidence") {
    return { title: "知識鎖倉", text: "技術真相有了，但如果不綁文件化義務，單點風險會變更大。", penalty: 18 };
  }
  if (traits.includes("waits-for-brief") && ["digital-sample-adoption", "ai-plm-visibility", "spec-version-drift"].includes(mission.id) && action.id !== "frame") {
    return { title: "等待模式", text: "需要主動定義需求的局，若沒先授權，會退回等規格。", penalty: 14 };
  }
  if (traits.includes("over-research") && ["fabric-trim-delay", "shipment-booking-crunch", "capacity-wip-bottleneck"].includes(mission.id) && action.id === "prototype") {
    return { title: "研究過深", text: "這局缺的是取捨節奏，過度研究會讓 demo 窗口被吃掉。", penalty: 13 };
  }
  if (traits.includes("weak-expression") && ["spec-version-drift", "qc-rework-spike", "sustainability-traceability"].includes(mission.id) && action.id === "bridge") {
    return { title: "表達斷點", text: "細節判斷很準，但直接放到跨部門翻譯位會卡在說不清。", penalty: 15 };
  }
  if (traits.includes("overloaded") && ["fabric-trim-delay", "pp-sample-loop", "shipment-booking-crunch"].includes(mission.id)) {
    return { title: "超載", text: "可靠牌不是免洗資源，繼續加壓會讓 Trust 看似上升、Friction 暗中累積。", penalty: 12 };
  }
  if (traits.includes("quality-gate-gap") && ["qc-rework-spike", "spec-version-drift", "capacity-wip-bottleneck"].includes(mission.id) && action.id === "gate") {
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
    state.orgFocus = { type: "root" };
    renderOrgMap();
  });
  els.orgUnitFilter?.addEventListener("change", () => {
    state.selectedOrgUnit = els.orgUnitFilter.value;
    state.selectedOrgDept = null;
    renderOrgMap();
    renderMembers();
  });
  els.orgHome?.addEventListener("click", () => {
    state.orgFocus = { type: "root" };
    if (els.orgSearch) els.orgSearch.value = "";
    renderOrgMap();
  });
  els.orgBack?.addEventListener("click", () => {
    const focus = state.orgFocus || { type: "root" };
    if (focus.type === "person") state.orgFocus = { type: "dept", unit: focus.unit, dept: focus.dept, deptId: focus.deptId };
    else if (focus.type === "dept") state.orgFocus = { type: "unit", unit: focus.unit };
    else state.orgFocus = { type: "root" };
    renderOrgMap();
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
