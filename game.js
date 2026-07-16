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
  orgFocus: { type: "root" },
  orgExpandedUnit: null,
  orgExpandedPath: [],
  orgSelected: null,
  orgZoom: 1
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
  orgZoomIn: document.querySelector("#org-zoom-in"),
  orgZoomOut: document.querySelector("#org-zoom-out"),
  orgZoomReset: document.querySelector("#org-zoom-reset"),
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
  "ai-plm-visibility": ["newbiz", "ops-mgmt", "sales-marketing", "tech-rd"],
  "gap-exec-visit": ["ceo", "sales-marketing", "newbiz", "tech-rd"],
  "techpack-truth-map": ["ops-mgmt", "tech-rd", "newbiz", "general-mgmt"],
  "ai-seed-rollout": ["general-mgmt", "tech-rd", "ops-mgmt", "newbiz"]
};

const MEMBER_TRAITS = {
  adia: ["visual-exec", "needs-boundary"],
  alan: ["waits-for-brief", "interface"],
  alex: ["authority", "big-picture", "needs-visible-demo"],
  andy: ["research-depth", "deadline-needed", "over-research"],
  chieh: ["throughput", "motivation-risk"],
  "celia-hsu": ["formal-lead", "tech-rd", "escalation-coach"],
  "celia-hsu-許佳瑛": ["formal-lead", "tech-rd", "escalation-coach"],
  debbie: ["presentation-candidate", "profile-thin"],
  dianne: ["market-sense", "story"],
  doris: ["coordination", "taste"],
  elly: ["org-sense", "so-what"],
  emily: ["visual-quality", "teaching"],
  "erica-chang": ["meeting-observed", "sales-dev"],
  "hazel-lin": ["sales-dev", "market-signal"],
  "emily-chak": ["alex-translator", "boundary", "analysis"],
  "emily-chak-翟君宜": ["alex-translator", "boundary", "analysis"],
  jessica: ["workshop", "audience-design"],
  jan: ["pm", "direct", "remote-owner"],
  jean: ["content-ai", "route-boundary"],
  karen: ["architect", "quality-gate-gap"],
  "karen-king-經國媛": ["architect", "quality-gate-gap"],
  "lilly-cheng-鄭俐俐": ["truth-mapper", "after-meeting"],
  "lillian-lin": ["tech-design", "brief-builder"],
  "brian-lin": ["ai-seed", "needs-evidence"],
  "brian-lin-林欣煇": ["ai-seed", "needs-evidence"],
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
  "wayi-tsai-蔡維溢": ["smart-textile", "manager"],
  "judy-lee-李宛真": ["actual-operator", "techpack-bom"],
  "kisa-lin-林嘉慧": ["translation-vault", "needs-mapping"],
  "jeff-yang-楊璿融": ["boundary-witness", "system-modernization"],
  "it-694a-74bf-878d": ["boundary-witness", "system-modernization"],
  "alice-chiu-邱瀞儀": ["pilot-scope", "ie-guardian"],
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
    status: birthdayLabel(member)
  }));
  const merged = [];
  [...enriched, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    const key = member.id || `${member.name}|${member.localName || ""}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
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
  const department = member.department || "";
  if (department.includes("待定位")) return "pending";
  if (department.includes("數位產品發展中心") || department.includes("智慧紡織")) return "newbiz";
  if (department.includes("3D研發中心") || department.includes("開發暨技術處") || department.includes("工務處")) return "tech-rd";
  if (department.includes("業務") || department.includes("行銷發展處")) return "sales-marketing";
  if (department.includes("資訊處") || department.includes("財會管理處")) return "ops-mgmt";
  if (department.includes("總管理處")) return "general-mgmt";
  if (department.includes("海外")) return "overseas";
  return "pending";
}

function traitsFor(member) {
  return MEMBER_TRAITS[member.id] || [];
}

function missionRequires(mission) {
  return MISSION_REQUIREMENTS[mission.id] || ["newbiz", "tech-rd", "sales-marketing"];
}

function jobProfileById(id) {
  return (GAME_DATA.jobProfiles || []).find((job) => job.id === id);
}

function missionJobNeeds(mission) {
  return (mission?.jobNeeds || []).map(jobProfileById).filter(Boolean);
}

function memberJobFit(member, mission) {
  const jobs = missionJobNeeds(mission);
  if (!jobs.length || !member) return { score: 50, jobs: [], label: "JD 未設定" };
  const unit = unitFor(member);
  const text = `${member.name} ${member.localName || ""} ${member.role || ""} ${member.department || ""}`.toLowerCase();
  const vectors = vectorsFor(member);
  const scored = jobs.map((job) => {
    let score = job.unit === unit ? 32 : -12;
    const belongs = (job.belongsTo || "").split("/").map((part) => part.trim()).filter(Boolean);
    score += belongs.some((part) => text.includes(part.toLowerCase())) ? 18 : 0;
    const keywords = [...(job.focus || []), ...(job.traits || []), job.title, job.group].filter(Boolean);
    score += keywords.reduce((sum, keyword) => sum + (text.includes(String(keyword).toLowerCase()) ? 7 : 0), 0);
    score += competencyVectorFit(job, vectors);
    return { job, score: clamp(score) };
  }).sort((left, right) => right.score - left.score);
  const best = scored[0];
  return {
    score: best.score,
    jobs: scored,
    label: best.score >= 76 ? `JD FIT: ${best.job.title}` : best.score >= 58 ? `JD PARTIAL: ${best.job.title}` : `JD GAP: ${best.job.title}`
  };
}

function competencyVectorFit(job, vectors) {
  const competencies = Object.keys(job.competencies || {}).join(" ");
  let score = 0;
  if (competencies.includes("溝通協調")) score += (average([vectors.context, vectors.warmth]) - 62) / 4;
  if (competencies.includes("問題解決")) score += (average([vectors.clarity, vectors.risk, vectors.data]) - 62) / 4;
  if (competencies.includes("目標導向")) score += (average([vectors.speed, vectors.clarity]) - 62) / 5;
  if (competencies.includes("團隊合作")) score += (average([vectors.warmth, vectors.context]) - 60) / 5;
  if (competencies.includes("創新能力")) score += (average([vectors.speed, vectors.data]) - 60) / 5;
  if (competencies.includes("培育部屬")) score += (average([vectors.context, vectors.clarity]) - 60) / 5;
  return score;
}

function renderMissionJobNeeds(mission) {
  const jobs = missionJobNeeds(mission);
  if (!jobs.length) return "";
  return `<div class="job-need-strip">${jobs.map((job) => `<i>${job.title}<b>${job.competencies ? Object.keys(job.competencies).join(" / ") : ""}</b></i>`).join("")}</div>`;
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

function isFullBirthday(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "");
}

function monthDayFromBirthday(value) {
  if (!value) return null;
  const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (full) return { month: Number(full[2]), day: Number(full[3]) };
  const short = /^(\d{1,2})-(\d{1,2})$/.exec(value);
  if (short) return { month: Number(short[1]), day: Number(short[2]) };
  const zh = /^(\d{1,2})月(\d{1,2})日$/.exec(value);
  if (zh) return { month: Number(zh[1]), day: Number(zh[2]) };
  return null;
}

function birthdayLabel(member) {
  const value = member?.birthdayText || member?.birthday || "";
  if (isFullBirthday(value)) return value;
  const monthDay = monthDayFromBirthday(value);
  return monthDay ? `${monthDay.month}月${monthDay.day}日` : "";
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
  const strategyBonus = strategy.fits.includes(scenario.id) ? 8 : -2;

  const work = clamp(weightedAverage + sameDept + roleSpread + strategyBonus * .35 - tunnelPenalty - mismatchPenalty);
  const communication = clamp(average([closeness.clarity, closeness.context, closeness.warmth]) + strategyBonus - mismatchPenalty);
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
  const birth = birthdayLabel(member);
  const roleLine = [member.localName, member.role, member.department].filter((item) => !isMissingValue(item)).join(" · ");
  const chips = birth ? `<span class="chip birthday">${birth}</span>` : "";
  return `
    <article class="member-card" data-member="${member.id}">
      <div class="avatar" aria-hidden="true">${initials(member.name)}</div>
      <div class="member-main">
        <div class="member-topline">
          <h3>${member.name}</h3>
          <span>${unitName(unitFor(member))}</span>
        </div>
        ${roleLine ? `<p class="role">${roleLine}</p>` : ""}
        ${chips ? `<div class="chips">${chips}</div>` : ""}
        ${isMissingValue(member.style) ? "" : `<p class="style-copy">${member.style}</p>`}
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
    const haystack = `${member.name} ${member.localName || ""} ${member.department} ${member.role} ${birthdayLabel(member)} ${profile ? Object.values(profile).join(" ") : ""}`.toLowerCase();
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
  const jdFits = trio.map((member) => memberJobFit(member, scenario));
  const jdCoverage = clamp(average(jdFits.map((fit) => fit.score)));
  const uniqueRoles = new Set(roles.map((role) => role.id));
  const roleBalance = clamp(uniqueRoles.size / 3 * 78 + (hasRole(roles, "sponsor") ? 10 : 0) + (hasRole(roles, "operator") ? 8 : 0) + (hasRole(roles, "translator") ? 6 : 0));
  const decisionRights = clamp((hasRole(roles, "sponsor") ? 38 : 0) + (hasRole(roles, "operator") ? 24 : 0) + (hasRole(roles, "domain") ? 22 : 0) + coverage * .16 - duplicatePenalty(units));
  const boundaryLoad = clamp(100 - (new Set(units).size - 1) * 14 - (required.length - covered.size) * 18 - duplicatePenalty(units) + (hasRole(roles, "translator") ? 14 : 0));
  const pairFriction = average(pairScores.map((score) => score.stress));
  const lensScore = lensCheck(lens.id, { trio, roles, units, scenario, coverage, roleBalance, decisionRights, boundaryLoad, pairFriction, jdCoverage });
  const resource = teamResources({ trio, roles, units, scenario, coverage, roleBalance, decisionRights, boundaryLoad, pairFriction });
  const chain = clamp(coverage * .2 + roleBalance * .2 + decisionRights * .2 + boundaryLoad * .12 + lensScore.score * .13 + jdCoverage * .15);
  const tempo = clamp(average(trio.map((member) => vectorsFor(member).speed)) + (hasRole(roles, "operator") ? 10 : 0) - (required.length - covered.size) * 7);
  const friction = clamp(pairFriction + (100 - boundaryLoad) * .25 + (required.length - covered.size) * 8 - (hasRole(roles, "translator") ? 8 : 0));
  const missing = required.filter((unit) => !covered.has(unit));
  els.pairTitle.textContent = `${a.name} → ${b.name} → ${c.name}`;
  els.fitBadge.textContent = `${chain} · ${chain >= 80 ? "可出任務" : chain >= 62 ? "可打但有洞" : "重抽隊形"}`;
  els.scoreGrid.innerHTML = [
    renderScoreCard("Draft Score", chain, "這組隊形進任務前的可打程度"),
    renderScoreCard("Role Spread", roleBalance, "Sponsor / Domain / Translator / Operator 的互補程度"),
    renderScoreCard("Decision Token", decisionRights, "是否有人能拍板，不只是討論"),
    renderScoreCard("Handoff Tax", 100 - boundaryLoad, "跨單位交接成本，分數越低越好"),
    renderScoreCard("JD Fit", jdCoverage, "這隊是否命中任務需要的職務能力")
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
    <p><strong>JD 需求：</strong>${missionJobNeeds(scenario).map((job) => job.title).join(" / ") || "未設定"}。</p>
    <p><strong>隊形職務命中：</strong>${jdFits.map((fit, index) => `${trio[index].name}: ${fit.label}`).join("；")}</p>
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
  return profile ? `${member.name}: ${profile.mode}` : `${member.name}: 尚未建立深度蒸餾`;
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
  document.body.classList.toggle("org-mode", view === "org");
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
  els.orgMap.innerHTML = renderOrgChart(view, hierarchy);
  applyOrgZoom();
  els.orgMap.querySelectorAll("[data-org-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.orgAction;
      if (action === "unit") {
        state.orgFocus = { type: "root" };
        state.orgExpandedUnit = state.orgExpandedUnit === button.dataset.unit ? null : button.dataset.unit;
        state.orgExpandedPath = [];
        state.orgSelected = state.orgExpandedUnit ? { type: "unit", id: button.dataset.unit } : null;
        renderOrgMap();
        centerSelectedOrgNode();
        return;
      }
      if (action === "dept") {
        const directory = orgDirectoryById(button.dataset.deptId);
        state.orgExpandedUnit = directory?.unit || button.dataset.unit || state.orgExpandedUnit;
        state.orgExpandedPath = orgDirectoryAncestorIds(button.dataset.deptId);
        state.orgSelected = { type: "dept", id: button.dataset.deptId };
        renderOrgMap();
        renderSelectedOrgDetail(button.dataset.deptId, button.dataset.unit);
        centerSelectedOrgNode();
      }
      if (action === "person") {
        state.orgSelected = { type: "person", id: button.dataset.person };
        if (directReportsFor(button.dataset.person, hierarchy.people).length) {
          renderOrgMap();
        } else {
          els.orgMap.querySelectorAll(".org-focus-node.selected").forEach((node) => node.classList.remove("selected"));
          button.classList.add("selected");
        }
        renderSelectedPersonDetail(button.dataset.person);
        centerSelectedOrgNode();
      }
    });
  });
  if (els.orgDetail) els.orgDetail.innerHTML = view.detail || "";
  if (els.orgBack) els.orgBack.disabled = focus.type === "root";
  centerOrgCanvas();
}

function centerSelectedOrgNode() {
  setTimeout(() => {
    const selected = els.orgMap?.querySelector(".org-focus-node.selected");
    selected?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, 0);
}

function setOrgZoom(nextZoom, anchor = null) {
  const canvas = els.orgMap?.querySelector(".org-chart-canvas");
  const rect = canvas?.getBoundingClientRect();
  const anchorX = rect && anchor ? anchor.x - rect.left : canvas ? canvas.clientWidth / 2 : 0;
  const anchorY = rect && anchor ? anchor.y - rect.top : canvas ? canvas.clientHeight / 2 : 0;
  const before = canvas ? {
    left: (canvas.scrollLeft + anchorX) / Math.max(1, canvas.scrollWidth),
    top: (canvas.scrollTop + anchorY) / Math.max(1, canvas.scrollHeight),
    anchorX,
    anchorY
  } : null;
  state.orgZoom = clamp(nextZoom * 100, 55, 150) / 100;
  applyOrgZoom();
  if (canvas && before) {
    requestAnimationFrame(() => {
      canvas.scrollLeft = Math.max(0, canvas.scrollWidth * before.left - before.anchorX);
      canvas.scrollTop = Math.max(0, canvas.scrollHeight * before.top - before.anchorY);
    });
  }
}

function handleOrgWheelZoom(event) {
  if (state.activeView !== "org") return;
  const canvas = event.target.closest(".org-chart-canvas");
  if (!canvas) return;
  event.preventDefault();
  const step = event.deltaY > 0 ? -.08 : .08;
  setOrgZoom((state.orgZoom || 1) + step, { x: event.clientX, y: event.clientY });
}

function applyOrgZoom() {
  const zoom = state.orgZoom || 1;
  els.orgMap?.style.setProperty("--org-zoom", zoom);
  if (els.orgZoomReset) els.orgZoomReset.textContent = `${Math.round(zoom * 100)}%`;
  if (els.orgZoomOut) els.orgZoomOut.disabled = zoom <= .55;
  if (els.orgZoomIn) els.orgZoomIn.disabled = zoom >= 1.5;
}

function centerOrgCanvas() {
  setTimeout(() => {
    const canvas = els.orgMap?.querySelector(".org-chart-canvas");
    if (!canvas) return;
    const selected = canvas.querySelector(".org-focus-node.selected");
    if (selected) {
      selected.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
      return;
    }
    canvas.scrollLeft = Math.max(0, (canvas.scrollWidth - canvas.clientWidth) / 2);
  }, 0);
}

function renderSelectedOrgDetail(deptId, unitId) {
  const directory = orgDirectoryById(deptId);
  const unit = GAME_DATA.orgUnits.find((item) => item.id === unitId);
  if (els.orgDetail && directory) els.orgDetail.innerHTML = orgDirectoryDetail(directory, unit, orgChartMembers());
}

function renderSelectedPersonDetail(personId) {
  const member = orgChartMembers().find((item) => item.id === personId);
  if (els.orgDetail && member) els.orgDetail.innerHTML = renderPersonDetail(member);
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

function renderOrgChart(view, hierarchy) {
  return `
    <div class="org-chart-canvas">
      <div class="org-tree">
        ${renderOrgParentNode(view)}
        ${view.treeRoot ? renderOrgTreeLevel(childOrgNodes(view.treeRoot, hierarchy.people), hierarchy, 1, view) : renderOrgTreeLevel(view.nodes, hierarchy, 1, view)}
      </div>
    </div>
  `;
}

function renderOrgTreeLevel(nodes, hierarchy, depth = 1, view = null) {
  if (!nodes.length) return renderOrgEmptyState(view || {});
  return `
    <div class="org-tree-level depth-${depth}">
      ${nodes.map((node) => renderOrgTreeNode(node, hierarchy, depth)).join("")}
    </div>
  `;
}

function renderOrgTreeNode(node, hierarchy, depth) {
  const shouldExpand = shouldExpandOrgNode(node);
  const children = shouldExpand ? childOrgNodes(node, hierarchy.people) : [];
  const isBranch = children.length > 0;
  return `
    <div class="org-tree-branch ${isBranch ? "has-children" : ""}">
      ${renderOrgFocusNode(node)}
      ${isBranch ? renderOrgTreeLevel(children, hierarchy, depth + 1) : ""}
    </div>
  `;
}

function shouldExpandOrgNode(node) {
  if (node.type === "unit") return state.orgExpandedUnit === node.unit;
  if (node.type === "dept") return state.orgExpandedPath.includes(node.deptId);
  if (node.type === "person") return state.orgSelected?.type === "person" && state.orgSelected.id === node.member?.id;
  return false;
}

function childOrgNodes(node, people) {
  if (node.type === "unit") {
    return orgDirectories(node.unit).filter((dept) => !dept.parent).map((dept) => orgDirectoryNode(dept, people));
  }
  if (node.type === "person") return directReportsFor(node.member?.id, people).map((member) => personOrgNode(member, node));
  if (node.type !== "dept") return [];
  const directory = orgDirectoryById(node.deptId);
  if (!directory) return [];
  const children = orgDirectoryChildren(directory.id);
  if (children.length) return children.map((child) => orgDirectoryNode(child, people));
  return topLevelDirectoryMembers(directory, people).map((member) => personOrgNode(member, {
    unit: directory.unit,
    dept: directory.name,
    deptId: directory.id
  }));
}

function personOrgNode(member, context = {}) {
  const reportCount = directReportsFor(member.id).length;
  return {
    type: "person",
    unit: context.unit || unitFor(member),
    dept: context.dept || member.department,
    deptId: context.deptId || "",
    title: member.name,
    subtitle: [member.localName, member.role].filter((item) => !isMissingValue(item)).join(" · "),
    count: reportCount ? `${reportCount} 直屬` : birthdayLabel(member),
    member
  };
}

function directReportsFor(managerId, people = orgChartMembers()) {
  if (!managerId) return [];
  return people
    .filter((member) => member.reportsTo === managerId)
    .sort((left, right) => orgChartRank("", left) - orgChartRank("", right) || (left.localName || left.name).localeCompare(right.localName || right.name));
}

function topLevelDirectoryMembers(directory, people = orgChartMembers()) {
  const members = orgDirectoryMembers(directory, people);
  const memberIds = new Set(members.map((member) => member.id));
  return members.filter((member) => !member.reportsTo || !memberIds.has(member.reportsTo));
}

function orgDirectoryAncestorIds(deptId) {
  const ids = [];
  let cursor = orgDirectoryById(deptId);
  while (cursor) {
    ids.unshift(cursor.id);
    cursor = cursor.parent ? orgDirectoryById(cursor.parent) : null;
  }
  return ids;
}

function renderOrgEmptyState(view) {
  return `
    <article class="org-empty-state">
      <strong>${view.emptyTitle || "沒有下層資料"}</strong>
      <p>${view.emptyText || "這個正式組織節點目前沒有可下展的資料。"}</p>
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
  return (GAME_DATA.orgDirectory || []).find((item) => item.id === id) || generatedOrgDirectories().find((item) => item.id === id);
}

function orgDirectoryChildren(parentId) {
  const explicit = (GAME_DATA.orgDirectory || []).filter((item) => item.parent === parentId);
  if (explicit.length) return explicit;
  return generatedOrgDirectories().filter((item) => item.parent === parentId);
}

function orgDirectoryMembers(directory, people = orgChartMembers()) {
  const ids = new Set(directory?.members || []);
  const explicit = people.filter((member) => ids.has(member.id));
  if (directory?.generated) return explicit.sort((left, right) => (left.localName || left.name).localeCompare(right.localName || right.name));
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

function generatedOrgDirectories() {
  const explicitDirectories = GAME_DATA.orgDirectory || [];
  const explicitIds = new Set(explicitDirectories.map((item) => item.id));
  const hasExplicitChild = new Set(explicitDirectories.filter((item) => item.parent).map((item) => item.parent));
  const generated = new Map();
  const allPeople = orgChartMembers();

  explicitDirectories.forEach((directory) => {
    if (hasExplicitChild.has(directory.id)) return;
    const members = orgDirectoryMembers({ ...directory, generated: true }, allPeople);
    members.forEach((member) => {
      const segments = departmentSegmentsAfter(directory, member.department);
      if (!segments.length) return;
      let parentId = directory.id;
      segments.forEach((segment, index) => {
        const id = `auto-${parentId}-${safeOrgId(segment)}`;
        if (!generated.has(id)) {
          generated.set(id, {
            id,
            unit: directory.unit,
            parent: parentId,
            name: segment,
            members: [],
            generated: true
          });
        }
        if (index === segments.length - 1) generated.get(id).members.push(member.id);
        parentId = id;
      });
    });
  });

  return [...generated.values()].filter((item) => !explicitIds.has(item.id)).map((item) => ({
    ...item,
    members: [...new Set(item.members)]
  }));
}

function safeOrgId(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "node";
}

function departmentSegmentsAfter(directory, department = "") {
  const parts = department.split("/").map((part) => part.trim()).filter(Boolean);
  const index = parts.findIndex((part) => part === directory.name || part.includes(directory.name) || directory.name.includes(part));
  if (index === -1) return [];
  return parts.slice(index + 1).filter((part) => !isMissingValue(part));
}

function orgVerificationLine(unit) {
  return unit?.verification && !isMissingValue(unit.verification) ? `<span>驗證狀態：${unit.verification}</span>` : "";
}

function isMissingValue(value) {
  return !value || value === "待補" || value === "資料待補" || value === "生日待補" || value === "?";
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

function renderDirectoryLeads(directory) {
  if (!directory?.leads?.length) return "";
  const leads = directory.leads.map((lead) => `${lead.name}${lead.localName ? ` / ${lead.localName}` : ""}：${lead.title}${lead.change ? `（${lead.change}）` : ""}`).join("；");
  return `<p>Lead 對口：${leads}</p>`;
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
    ${children.length ? `<span>下層單位：${children.length}</span>` : ""}
    ${ownCount ? `<span>直屬成員：${ownCount}</span>` : ""}
    ${children.length && totalCount ? `<span>含下層成員：${totalCount}</span>` : ""}
    ${directory.note ? `<p>${directory.note}</p>` : ""}
    ${renderDirectoryLeads(directory)}
    ${ownMembers.length ? `<p>直屬成員：${ownMembers.map((member) => `${member.name}${member.localName ? ` / ${member.localName}` : ""}`).join("、")}</p>` : ""}
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
    count: children.length ? `${children.length} 下層` : count ? `${count} 成員` : "",
    subtitle: children.length ? `下層單位 ${children.length}${count ? `；含成員 ${count}` : ""}` : ownCount ? `成員 ${ownCount}` : "",
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
      treeRoot: { type: "unit", unit: unit.id, title: unit.name, subtitle: unit.tagline, count: source.people.length ? `${source.people.length} 成員` : "", departments: source.departments.length },
      summary: `${source.departments.length} 個正式下層單位`,
      detail: `<strong>${unit?.name || ""}</strong><span>下層單位：${source.departments.length}</span>${source.people.length ? `<span>已掛成員：${source.people.length}</span>` : ""}${orgVerificationLine(unit)}<p>${unit?.tagline || ""}</p>`
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
        treeRoot: orgDirectoryNode(directory, hierarchy.people),
        summary: `${children.length} 個下層單位${ownMembers.length ? `；直屬成員 ${ownMembers.length}` : ""}`,
        detail: orgDirectoryDetail(directory, unit, hierarchy.people)
      };
    }
    const members = directory ? orgDirectoryMembers(directory, hierarchy.people) : hierarchy.people
      .filter((member) => unitFor(member) === focus.unit && member.department === focus.dept)
      .sort((left, right) => orgChartRank(focus.dept, left) - orgChartRank(focus.dept, right) || left.name.localeCompare(right.name));
    return {
      level: "dept",
      title: directory?.name || focus.dept,
      nodes: members.map((member) => ({ type: "person", unit: focus.unit, dept: directory?.name || focus.dept, deptId: directory?.id || focus.deptId, title: member.name, subtitle: [member.localName, member.role].filter((item) => !isMissingValue(item)).join(" · "), count: birthdayLabel(member), member })),
      treeRoot: directory ? orgDirectoryNode(directory, hierarchy.people) : null,
      summary: members.length ? `${members.length} 位成員` : "沒有成員資料",
      emptyTitle: "沒有成員資料",
      emptyText: `${directory?.name || focus.dept} 目前沒有可顯示的成員資料。`,
      detail: directory ? orgDirectoryDetail(directory, unit, hierarchy.people) : `<strong>${focus.dept}</strong><span>路徑：${unit?.name || ""} / ${focus.dept}</span>${members.length ? `<span>成員：${members.length}</span>` : ""}`
    };
  }
  if (focus.type === "person") {
    const member = orgChartMembers().find((item) => item.id === focus.person);
    return {
      level: "person",
      title: member?.name || "成員",
      nodes: member ? [{ type: "profile", title: member.name, subtitle: member.localName || "", member }] : [],
      detail: member ? renderPersonDetail(member) : ""
    };
  }
  return {
    level: "root",
    title: "Makalot 主架構",
    nodes: hierarchy.units.map((unit) => ({ type: "unit", unit: unit.id, title: unit.name, subtitle: unit.tagline, count: unit.people.length ? `${unit.people.length} 成員` : "", departments: unit.departments.length })),
    summary: `${hierarchy.units.length} 個組織群`,
    detail: "<strong>主架構</strong><p>點一個組織群放大一層；再點正式部門/中心/課/團隊看下層或成員。</p>"
  };
}

function orgChartRank(dept, member) {
  const digitalProduct = ["Alex Chou", "Elly Cheng", "Alan Liu", "Andy Liu", "Vanessa Chou", "Doris Lin", "Emily Shen", "Dianne Chen"];
  const smartTextile = ["Alex Chou", "Wayi Tsai", "Shirley Sun", "Tanis Lee", "Evan Sheu", "Jonathan Wu", "Gary Yen", "Dean Lo", "Ian Tseng", "Jimmy Chou", "Sunny Shih"];
  const list = dept === "數位產品發展中心" ? digitalProduct : dept === "智慧紡織發展中心" ? smartTextile : [];
  const index = list.indexOf(member.name);
  return index === -1 ? 999 : index;
}

function renderOrgFocusNode(node) {
  const unitColor = UNIT_COLORS[node.unit] || UNIT_COLORS[unitFor(node.member || {})] || "#fff";
  if (node.type === "profile") {
    const member = node.member;
    const profileRows = [
      ["單位", unitName(unitFor(member))],
      ["部門", member.department],
      ["職務", member.role],
      ["生日", birthdayLabel(member)]
    ].filter(([, value]) => !isMissingValue(value));
    return `
      <article class="org-focus-node profile" style="--unit:${unitColor}">
        <span>PROFILE</span>
        <h3>${member.name}</h3>
        <p>${isMissingValue(member.localName) ? "" : member.localName}</p>
        <div class="profile-grid">
          ${profileRows.map(([label, value]) => `<b>${label}</b><i>${value}</i>`).join("")}
        </div>
      </article>
    `;
  }
  const action = node.type === "unit" ? "unit" : node.type === "dept" ? "dept" : "person";
  const selected = (node.type === "dept" && state.orgSelected?.type === "dept" && state.orgSelected.id === node.deptId)
    || (node.type === "unit" && state.orgSelected?.type === "unit" && state.orgSelected.id === node.unit)
    || (node.type === "person" && state.orgSelected?.type === "person" && state.orgSelected.id === node.member?.id);
  return `
    <button class="org-focus-node ${node.type} ${selected ? "selected" : ""}" type="button" data-org-action="${action}" data-unit="${node.unit || ""}" data-dept="${node.dept || ""}" data-dept-id="${node.deptId || ""}" data-person="${node.member?.id || ""}" style="--unit:${unitColor}">
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
  const manager = member.reportsTo ? orgChartMembers().find((person) => person.id === member.reportsTo) : null;
  const reports = directReportsFor(member.id);
  const details = [
    member.localName,
    unitName(unitFor(member)),
    member.department,
    member.role,
    birthdayLabel(member),
    member.gameMove ? `人物技：${member.gameMove}` : "",
    member.riskTell ? `風險訊號：${member.riskTell}` : "",
    manager ? `直屬主管：${manager.name}` : "",
    reports.length ? `直屬成員：${reports.length}` : "",
    member.leadAssignments?.length ? `Lead 對口：${member.leadAssignments.map((item) => item.title).join("；")}` : "",
    member.leadChange ? `異動：${member.leadChange}` : "",
    member.reportingSource ? `來源：${member.reportingSource}` : ""
  ].filter((item) => !isMissingValue(item));
  return `<strong>${member.name}</strong>${details.map((item) => `<span>${item}</span>`).join("")}`;
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
    ${renderMissionJobNeeds(meeting.scenario)}
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
    const fit = cardFit(member, action);
    const rarity = cardRarity(member, action);
    const pips = cardPips(member, action, fit);
    const unit = unitFor(member);
    return `
      <button class="action-card play-card ${rarity} ${fit.className}" type="button" data-member="${member.id}" ${disabled}>
        <span class="sigil">${action.icon}</span>
        <i>${fit.label}</i>
        <strong>${member.name}</strong>
        <em>${[unitName(unit), member.department].filter((item) => !isMissingValue(item)).join(" · ")}</em>
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
  const jdFit = memberJobFit(member, meeting.scenario);
  const jdBonus = (jdFit.score - 50) / 4;
  const risk = triggeredRisk(member, action, unit);
  const riskPenalty = risk ? risk.penalty : 0;
  const score = vectorScore + actionNeed + requiredBonus + newLaneBonus + repeatPenalty + profileBonus + jdBonus - riskPenalty;

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
  if (traits.includes("needs-visible-demo") && ["gap-exec-visit", "digital-sample-adoption", "ai-plm-visibility"].includes(mission.id) && !["prototype", "frame"].includes(action.id)) {
    return { title: "需要實體", text: "高層場若只講抽象敘事，會進入反覆猜方向；先做可看的版本或凍結主軸。", penalty: 14 };
  }
  if (traits.includes("needs-evidence") && ["techpack-truth-map", "ai-seed-rollout", "ai-plm-visibility"].includes(mission.id) && action.id !== "evidence") {
    return { title: "口頭確認需佐證", text: "這張牌能推動，但系統事實不能只靠印象；要綁 owner、文件與範圍證據。", penalty: 16 };
  }
  if (traits.includes("needs-mapping") && mission.id === "techpack-truth-map" && !["evidence", "bridge"].includes(action.id)) {
    return { title: "資料不可用", text: "翻譯資料若缺款號與前後端 mapping，存在不等於可用。", penalty: 13 };
  }
  if (traits.includes("actual-operator") && mission.id === "techpack-truth-map" && action.id !== "evidence") {
    return { title: "範圍需標註", text: "實際執行者能提供真相，但必須把 BOM、POM、做工範圍切清楚。", penalty: 10 };
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
  const jdFit = memberJobFit(member, state.meeting.scenario);
  if (jdFit.score >= 76) pips.push("JD FIT");
  if (jdFit.score < 45) pips.push("JD GAP");
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
  const jdFit = memberJobFit(person, meeting.scenario);
  const jdBoost = (jdFit.score - 50) / 10;
  const crossUnit = meeting.lastUnit && meeting.lastUnit !== unit;
  const sameLane = meeting.lastUnit && meeting.lastUnit === unit;
  const laneBonus = missionRequires(meeting.scenario).includes(unit) ? 3 : -8;
  const newRequiredLane = missionRequires(meeting.scenario).includes(unit) && !meeting.coveredUnits.includes(unit);
  const riskPenalty = fit.risk ? fit.risk.penalty : 0;
  const offLane = fit.className === "off-lane" || fit.className === "blocker";

  meeting.trust = clamp(meeting.trust + (boost.trust || 0) + (scores.communication - 64) / 11 + orgFit + (crossUnit ? 3 : 0) + (offLane ? -7 : 0));
  meeting.clarity = clamp(meeting.clarity + (boost.clarity || 0) + vectorFit + (scores.work - 66) / 13 + laneBonus + jdBoost - riskPenalty / 5);
  meeting.momentum = clamp(meeting.momentum + (boost.momentum || 0) + (scores.decision - 64) / 12 + (sameLane ? 2 : 0) + (newRequiredLane ? 5 : 0) + jdBoost / 2 - (offLane ? 5 : 0));
  meeting.friction = clamp(meeting.friction + (boost.friction || 0) + (scores.stress - 50) / 8 - orgFit + (crossUnit ? -3 : 0) + (sameLane ? 8 : 0) + riskPenalty / 2 + (offLane ? 8 : 0));

  const profile = GAME_DATA.distillations?.[person.id];
  const solution = profile ? profile.leverage : `${unitName(unit)} 進場，補上一個正式組織視角。`;
  const comboText = crossUnit ? `跨單位 combo：${unitName(meeting.lastUnit)} → ${unitName(unit)}` : sameLane ? "同單位連打：速度上升，但 tunnel vision 增加" : "開場佈局";
  const riskText = fit.risk ? `風險觸發「${fit.risk.title}」：${fit.risk.text}` : "沒有明顯錯配。";
  meeting.log.unshift(`T${meeting.turn}: ${person.name} / ${unitName(unit)} 打出「${action.name}」〔${fit.label}〕。${comboText}。${jdFit.label}。${riskText}`);
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
    state.orgExpandedUnit = null;
    state.orgExpandedPath = [];
    state.orgSelected = null;
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
    state.orgExpandedUnit = null;
    state.orgExpandedPath = [];
    state.orgSelected = null;
    if (els.orgSearch) els.orgSearch.value = "";
    renderOrgMap();
  });
  els.orgZoomOut?.addEventListener("click", () => setOrgZoom((state.orgZoom || 1) - .1));
  els.orgZoomIn?.addEventListener("click", () => setOrgZoom((state.orgZoom || 1) + .1));
  els.orgZoomReset?.addEventListener("click", () => setOrgZoom(1));
  els.orgMap?.addEventListener("wheel", handleOrgWheelZoom, { passive: false });
  els.orgBack?.addEventListener("click", () => {
    if (state.orgExpandedPath.length > 1) {
      state.orgExpandedPath.pop();
      state.orgSelected = { type: "dept", id: state.orgExpandedPath[state.orgExpandedPath.length - 1] };
    } else if (state.orgExpandedPath.length === 1) {
      state.orgExpandedPath = [];
      state.orgSelected = state.orgExpandedUnit ? { type: "unit", id: state.orgExpandedUnit } : null;
    } else {
      state.orgExpandedUnit = null;
      state.orgSelected = null;
    }
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

