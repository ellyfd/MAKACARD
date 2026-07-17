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
  orgZoom: 1,
  orgPan: null,
  orgPanMoved: false,
  localDraftMessage: ""
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
  capabilityFilter: document.querySelector("#capability-filter"),
  peopleSelect: document.querySelector("#people-select"),
  peopleProfile: document.querySelector("#people-profile"),
  capabilitySummary: document.querySelector("#capability-summary"),
  capabilityMap: document.querySelector("#capability-map"),
  personA: document.querySelector("#person-a"),
  personB: document.querySelector("#person-b"),
  personC: document.querySelector("#person-c"),
  draftSponsor: document.querySelector("#draft-sponsor"),
  draftDecisionOwner: document.querySelector("#draft-decision-owner"),
  draftTechnicalAuthority: document.querySelector("#draft-technical-authority"),
  draftDeliveryOwner: document.querySelector("#draft-delivery-owner"),
  draftDataOwner: document.querySelector("#draft-data-owner"),
  draftBridge: document.querySelector("#draft-bridge"),
  orgUnitCount: document.querySelector("#org-unit-count"),
  scenarioSelect: document.querySelector("#scenario-select"),
  frameworkSelect: document.querySelector("#framework-select"),
  analyzePair: document.querySelector("#analyze-pair"),
  pairTitle: document.querySelector("#pair-title"),
  fitBadge: document.querySelector("#fit-badge"),
  scoreGrid: document.querySelector("#score-grid"),
  pairInsight: document.querySelector("#pair-insight"),
  decisionLedger: document.querySelector("#decision-ledger"),
  sourceRelease: document.querySelector("#source-release"),
  sourceFiles: document.querySelector("#source-files"),
  localDraftStatus: document.querySelector("#local-draft-status"),
  draftCopyRecord: document.querySelector("#copy-draft-record"),
  draftCopyStatus: document.querySelector("#draft-copy-status"),
  meetingTitle: document.querySelector("#meeting-title"),
  meetingScenario: document.querySelector("#meeting-scenario"),
  missionBrief: document.querySelector("#mission-brief"),
  actionCards: document.querySelector("#action-cards"),
  missionAction: document.querySelector("#mission-action"),
  resetMeeting: document.querySelector("#reset-meeting"),
  turnCount: document.querySelector("#turn-count"),
  meetingLog: document.querySelector("#meeting-log"),
  orgMap: document.querySelector("#org-map"),
  orgLegend: document.querySelector("#org-legend"),
  meters: {
    trust: document.querySelector("#trust-meter"),
    clarity: document.querySelector("#clarity-meter"),
    momentum: document.querySelector("#momentum-meter"),
    friction: document.querySelector("#friction-meter"),
    resilience: document.querySelector("#resilience-meter")
  },
  values: {
    trust: document.querySelector("#trust-value"),
    clarity: document.querySelector("#clarity-value"),
    momentum: document.querySelector("#momentum-value"),
    friction: document.querySelector("#friction-value"),
    resilience: document.querySelector("#resilience-value")
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

function publicReleaseLine() {
  const release = GAME_DATA.publicRelease;
  if (!release?.id) return "公開資料快照：未標記";
  const directories = Number.isFinite(release.formalDirectoryCount) ? `${release.formalDirectoryCount} 正式節點` : "節點數未標記";
  const sources = Number.isFinite(release.sourceCount) ? `${release.sourceCount} 來源檔` : "來源數未標記";
  return `公開資料快照：${release.id}（${directories} / ${sources}）`;
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
  const scored = jobs.map((job) => {
    let score = job.unit === unit ? 32 : -12;
    const belongs = (job.belongsTo || "").split("/").map((part) => part.trim()).filter(Boolean);
    score += belongs.some((part) => text.includes(part.toLowerCase())) ? 18 : 0;
    const keywords = [...(job.focus || []), ...(job.traits || []), job.title, job.group].filter(Boolean);
    score += keywords.reduce((sum, keyword) => sum + (text.includes(String(keyword).toLowerCase()) ? 7 : 0), 0);
    return { job, score: clamp(score) };
  }).sort((left, right) => right.score - left.score);
  const best = scored[0];
  return {
    score: best.score,
    jobs: scored,
    label: best.score >= 76 ? `JD FIT: ${best.job.title}` : best.score >= 58 ? `JD PARTIAL: ${best.job.title}` : `JD GAP: ${best.job.title}`
  };
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
    const haystack = `${member.name} ${member.localName || ""} ${member.department} ${member.role} ${birthdayLabel(member)}`.toLowerCase();
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

function switchView(view) {
  state.activeView = view;
  document.body.classList.toggle("org-mode", view === "org");
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === view));
  els.views.forEach((viewEl) => viewEl.classList.toggle("active", viewEl.id === `${view}-view`));
  if (view === "org") renderOrgMap();
  if (view === "people") renderPeopleDirectory();
  if (view === "sources") renderSourceCenter();
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

function beginOrgPan(event) {
  if (state.activeView !== "org" || event.button !== 0) return;
  const canvas = event.target.closest(".org-chart-canvas");
  if (!canvas || event.target.closest("button, input, select, a")) return;
  state.orgPan = { canvas, x: event.clientX, y: event.clientY, left: canvas.scrollLeft, top: canvas.scrollTop };
  state.orgPanMoved = false;
  canvas.classList.add("is-panning");
  canvas.setPointerCapture?.(event.pointerId);
}

function moveOrgPan(event) {
  const pan = state.orgPan;
  if (!pan) return;
  const dx = event.clientX - pan.x;
  const dy = event.clientY - pan.y;
  if (Math.abs(dx) + Math.abs(dy) > 4) state.orgPanMoved = true;
  pan.canvas.scrollLeft = pan.left - dx;
  pan.canvas.scrollTop = pan.top - dy;
}

function endOrgPan(event) {
  const pan = state.orgPan;
  if (!pan) return;
  pan.canvas.classList.remove("is-panning");
  if (event?.pointerId !== undefined) pan.canvas.releasePointerCapture?.(event.pointerId);
  state.orgPan = null;
  setTimeout(() => { state.orgPanMoved = false; }, 0);
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
  const directPeople = topLevelDirectoryMembers(directory, people).map((member) => personOrgNode(member, {
    unit: directory.unit,
    dept: directory.name,
    deptId: directory.id
  }));
  const childDepartments = children.map((child) => orgDirectoryNode(child, people));
  return [...directPeople, ...childDepartments];
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
    detail: `<strong>主架構</strong><span>公開資料版：${GAME_DATA.publicRelease?.id || "未標記"}</span><span>正式節點：${GAME_DATA.publicRelease?.formalDirectoryCount || 0}</span><span>來源檔：${GAME_DATA.publicRelease?.sourceCount || 0}</span><p>點一個組織群放大一層；再點正式部門/中心/課/團隊看下層或成員。</p>`
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

function drawHand() {
  const played = new Set(state.meeting.played);
  const candidates = GAME_DATA.members.filter((member) => !played.has(member.id));
  const pool = candidates.length >= 5 ? candidates : GAME_DATA.members;
  state.meeting.hand = [...pool]
    .sort(() => Math.random() - .5)
    .slice(0, 5)
    .map((member) => member.id);
}

function selectedMissionAction(member) {
  return actionById(els.missionAction?.value) || bestActionForMember(member);
}

function renderActionCards() {
  const disabled = state.meeting.turn > 5 ? "disabled" : "";
  els.actionCards.innerHTML = state.meeting.hand.map((memberId) => {
    const member = memberById(memberId);
    const action = selectedMissionAction(member);
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
    button.addEventListener("click", () => playMeetingTurn(button.dataset.member, els.missionAction?.value));
  });
}

function actionSlotFor(action) {
  return {
    frame: "decision-owner",
    bridge: "bridge",
    prototype: "delivery-owner",
    gate: "risk-controller",
    evidence: "data-owner",
    align: "business-owner"
  }[action.id] || "delivery-owner";
}

function formalActionFit(member, action, mission = state.meeting?.scenario) {
  const jdFit = memberJobFit(member, mission);
  const matchedJob = jdFit.jobs?.[0]?.job;
  const roleText = `${member.role || ""} ${member.department || ""} ${matchedJob?.title || ""} ${(matchedJob?.focus || []).join(" ")}`;
  const keywords = {
    frame: /規格|版本|報價|交期|系統|管理/,
    bridge: /溝通|協調|客戶|窗口|業務|行銷|專案/,
    prototype: /樣品|開發|研發|3D|設計|改善|測試/,
    gate: /品質|檢驗|稽核|驗貨|認證|風險/,
    evidence: /資料|報表|分析|系統|文件|驗收|BOM/,
    align: /客戶|業務|行銷|溝通|協調|品牌/
  };
  const cue = roleHintFit(member, actionSlotFor(action));
  const score = clamp(22 + jdFit.score * .45 + Math.max(0, cue - 38) * .4 + (keywords[action.id]?.test(roleText) ? 12 : 0));
  return { score, jdFit, cue, slotId: actionSlotFor(action) };
}

function cardFit(member, action) {
  const meeting = state.meeting;
  const unit = unitFor(member);
  const required = missionRequires(meeting.scenario);
  const roleFit = formalActionFit(member, action, meeting.scenario);
  const vectorScore = roleFit.score - 60;
  const actionNeed = ((meeting.scenario.weights?.[action.vector] || 1) - 1) * 42;
  const requiredBonus = required.includes(unit) ? 18 : -24;
  const newLaneBonus = required.includes(unit) && !meeting.coveredUnits.includes(unit) ? 11 : 0;
  const repeatPenalty = meeting.lastUnit && meeting.lastUnit === unit ? -16 : 0;
  const jdFit = memberJobFit(member, meeting.scenario);
  const jdBonus = (jdFit.score - 50) / 4;
  const risk = triggeredRisk(member, action, unit);
  const riskPenalty = risk ? risk.penalty : 0;
  const score = vectorScore + actionNeed + requiredBonus + newLaneBonus + repeatPenalty + jdBonus - riskPenalty;

  if (risk?.fatal) return { score, label: "BLOCKER", className: "blocker", risk };
  if (score >= 38) return { score, label: "CORE FIT", className: "core-fit", risk };
  if (score >= 18) return { score, label: "USEFUL", className: "useful-fit", risk };
  if (score >= 0) return { score, label: "RISKY", className: "risky-fit", risk };
  return { score, label: "OFF-LANE", className: "off-lane", risk };
}

function triggeredRisk(member, action, unit) {
  const mission = state.meeting.scenario;
  const required = missionRequires(mission);
  if (!required.includes(unit)) {
    return { title: "單位錯配", text: `${unitName(unit)} 不在這個任務的必要單位中，會增加交接成本。`, penalty: 16 };
  }
  const jdFit = memberJobFit(member, mission);
  if (jdFit.score < 45) {
    return { title: "JD 範圍不足", text: "此任務與該職務的已知職掌重疊有限，需明確補上對口或授權。", penalty: 12 };
  }
  return null;
}
function cardRarity(member, action) {
  const base = formalActionFit(member, action).score;
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
  const unit = unitFor(member);
  const pips = [unitName(unit)];
  const jdFit = memberJobFit(member, state.meeting.scenario);
  if (jdFit.score >= 76) pips.push("JD FIT");
  if (formalActionFit(member, action).cue >= 72) pips.push("ROLE CUE");
  if (jdFit.score < 45) pips.push("JD GAP");
  if (fit?.score < 0) pips.push("MISFIT");
  if (state.meeting.lastUnit && state.meeting.lastUnit !== unit) pips.push("COMBO");
  return pips.slice(0, 3);
}

function bestActionForMember(person) {
  return GAME_DATA.actionTypes
    .map((action) => ({
      action,
      score: formalActionFit(person, action).score + (state.meeting.scenario?.weights?.[action.vector] || 1) * 12
    }))
    .sort((left, right) => right.score - left.score)[0].action;
}

function comboPreview(person) {
  const unit = unitFor(person);
  if (!state.meeting.lastUnit) return "Opening move";
  if (state.meeting.lastUnit !== unit) return "Cross-unit combo +";
  return "Same-lane pressure";
}

/* Digital organization sandbox: task roles, dependency coverage, and mission health. */
function sandboxData() {
  return GAME_DATA.sandbox || { slotCatalog: [], unitRoleHints: {}, healthMetrics: [] };
}

function missionSandbox(mission) {
  return mission?.sandbox || { deliverable: "", slots: [], success: [], events: [] };
}

function missionEventCard(meeting) {
  const events = missionSandbox(meeting.scenario).events || [];
  const text = events[(meeting.turn - 1) % Math.max(1, events.length)] || "確認 owner、版本與下一步。";
  const rules = [
    {
      match: /版本|資料|BOM|使用/,
      title: "資料鏈斷點",
      actionId: "evidence",
      effect: { momentum: 9, clarity: 4, resilience: 2 },
      pressure: { momentum: -7, clarity: -5 }
    },
    {
      match: /客戶|對外|量產端|跨過|跨單位/,
      title: "跨域接口",
      actionId: "bridge",
      effect: { clarity: 9, trust: 5, resilience: 2 },
      pressure: { clarity: -8, trust: -4 }
    },
    {
      match: /縮短|期限|實體成果/,
      title: "時間壓力",
      actionId: "prototype",
      effect: { friction: 10, momentum: 4, resilience: 2 },
      pressure: { friction: -7, momentum: -4 }
    },
    {
      match: /owner|承諾|範圍|例外|流程/,
      title: "責任空窗",
      actionId: "frame",
      effect: { trust: 10, clarity: 4, resilience: 1 },
      pressure: { trust: -7, clarity: -4 }
    }
  ];
  const rule = rules.find((item) => item.match.test(text)) || {
    title: "任務雜訊",
    actionId: "gate",
    effect: { friction: 8, momentum: 4, resilience: 2 },
    pressure: { friction: -6, momentum: -4 }
  };
  const action = actionById(rule.actionId);
  return { ...rule, text, action };
}

function applyMissionEffect(meeting, effect = {}) {
  Object.entries(effect).forEach(([metric, amount]) => {
    if (metric in meeting) meeting[metric] = clamp(meeting[metric] + amount);
  });
}

function missionOutcome(meeting, requiredUnits = missionRequires(meeting.scenario)) {
  if (meeting.turn <= 5) return null;
  const missingUnits = requiredUnits.filter((unit) => !meeting.coveredUnits.includes(unit));
  const shortfalls = [
    meeting.trust < 65 ? "決策閉環" : "",
    meeting.clarity < 70 ? "依賴覆蓋" : "",
    meeting.momentum < 65 ? "事實一致" : "",
    meeting.friction < 65 ? "交付可行" : "",
    meeting.resilience < 55 ? "韌性" : ""
  ].filter(Boolean);
  return { complete: !missingUnits.length && !shortfalls.length, missingUnits, shortfalls };
}
function missionRecord(meeting = state.meeting) {
  const blueprint = missionSandbox(meeting.scenario);
  const requiredUnits = missionRequires(meeting.scenario);
  const outcome = missionOutcome(meeting, requiredUnits);
  const coveredUnits = meeting.coveredUnits.map(unitName);
  const missingUnits = outcome?.missingUnits.map(unitName) || requiredUnits.filter((unit) => !meeting.coveredUnits.includes(unit)).map(unitName);
  const status = outcome ? (outcome.complete ? "任務完成" : "任務未閉環") : "推演進行中";
  const metricRows = [
    ["決策閉環", meeting.trust],
    ["依賴覆蓋", meeting.clarity],
    ["事實一致", meeting.momentum],
    ["交付可行", meeting.friction],
    ["韌性", meeting.resilience]
  ].map(([label, value]) => `${label} ${value}`).join(" / ");
  const log = meeting.log.slice().reverse().map((item) => `- ${item}`).join("\n");
  return [
    "Org Quest 任務紀錄（推演草案）",
    publicReleaseLine(),
    `任務：${meeting.scenario.name}`,
    `狀態：${status}`,
    `交付物：${blueprint.deliverable || "未定義"}`,
    `必要單位：${requiredUnits.map(unitName).join(" / ") || "未定義"}`,
    `已覆蓋單位：${coveredUnits.join(" / ") || "尚未覆蓋"}`,
    missingUnits.length ? `未覆蓋單位：${missingUnits.join(" / ")}` : "未覆蓋單位：無",
    outcome?.shortfalls.length ? `未閉環條件：${outcome.shortfalls.join(" / ")}` : "未閉環條件：無",
    `成功條件：${(blueprint.success || []).join(" / ") || "未定義"}`,
    `任務指標：${metricRows}`,
    "",
    "推演軌跡：",
    log || "- 尚未進行回合",
    "",
    "說明：此紀錄僅為任務推演草案，不構成正式任務指派或人事決定。"
  ].join("\n");
}

function legacyCopyText(value) {
  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  return copied;
}

async function copyMissionRecord() {
  const record = missionRecord();
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(record);
      copied = true;
    } else {
      copied = legacyCopyText(record);
    }
  } catch (error) {
    copied = legacyCopyText(record);
  }
  const status = document.querySelector("#mission-copy-status");
  if (status) status.textContent = copied ? "任務紀錄已複製" : "無法自動複製，請改用選取文字";
}

function sandboxSlot(id) {
  return sandboxData().slotCatalog.find((slot) => slot.id === id);
}

function roleHintFit(member, slotId) {
  if (!member) return 0;
  const hintedSlots = sandboxData().unitRoleHints[unitFor(member)] || [];
  const title = `${member.role || ""} ${member.department || ""}`;
  let score = hintedSlots.includes(slotId) ? 72 : 38;
  if (slotId === "sponsor" && /執行長|總經理|副總|處長/.test(title)) score += 22;
  if (slotId === "decision-owner" && /執行長|總經理|副總|處長|總監|經理|主管/.test(title)) score += 18;
  if (slotId === "technical-authority" && /技術|研發|3D|品質|工務|資訊|資料|TD/.test(title)) score += 16;
  if (slotId === "data-owner" && /資訊|資料|系統|工務管理|專案/.test(title)) score += 16;
  if (slotId === "bridge" && /業務|行銷|專案|PM|運籌|協調/.test(title)) score += 16;
  if (slotId === "delivery-owner" && /專員|技師|工程|開發|業務|經理/.test(title)) score += 12;
  return clamp(score);
}

function personSelectOptions(selected = "") {
  const roster = allOrgMembers().sort((a, b) => `${a.localName || a.name}`.localeCompare(`${b.localName || b.name}`));
  return [`<option value="">未指派</option>`, ...roster.map((member) => `<option value="${member.id}" ${member.id === selected ? "selected" : ""}>${member.name} · ${member.role || member.department || unitName(unitFor(member))}</option>`)].join("");
}

function suggestedMemberFor(slotId) {
  return allOrgMembers().find((member) => roleHintFit(member, slotId) >= 88)?.id || "";
}

function fillStaticControls() {
  const roster = allOrgMembers();
  els.memberCount.textContent = roster.length;
  if (els.orgUnitCount) els.orgUnitCount.textContent = (GAME_DATA.orgDirectory || []).length;
  fillSelect(els.scenarioSelect, GAME_DATA.orgMissions, (mission) => mission.name);
  if (els.missionAction) {
    els.missionAction.innerHTML = [
      '<option value="">依職務自動建議</option>',
      ...GAME_DATA.actionTypes.map((action) => `<option value="${action.id}">${action.icon} ${action.name}</option>`)
    ].join("");
  }
  const draftSlots = [
    [els.draftSponsor, "sponsor"],
    [els.draftDecisionOwner, "decision-owner"],
    [els.draftTechnicalAuthority, "technical-authority"],
    [els.draftDeliveryOwner, "delivery-owner"],
    [els.draftDataOwner, "data-owner"],
    [els.draftBridge, "bridge"]
  ];
  draftSlots.forEach(([select, slotId]) => {
    if (!select) return;
    select.innerHTML = personSelectOptions(suggestedMemberFor(slotId));
  });
  els.scenarioSelect.value = GAME_DATA.orgMissions.some((mission) => mission.id === "gap-exec-visit") ? "gap-exec-visit" : GAME_DATA.orgMissions[0]?.id;
  if (els.peopleSelect) {
    const people = allOrgMembers().filter((member) => member.name).sort((a, b) => a.name.localeCompare(b.name));
    els.peopleSelect.innerHTML = people.map((member) => `<option value="${member.id}">${member.name}${member.localName ? ` / ${member.localName}` : ""}</option>`).join("");
    const elly = people.find((member) => member.id === "elly");
    if (elly) els.peopleSelect.value = elly.id;
    renderPeopleDirectory();
  }
  renderSourceCenter();
  if (els.capabilityFilter) {
    els.capabilityFilter.innerHTML = [`<option value="all">全部已建檔 JD</option>`, ...GAME_DATA.orgUnits.filter((unit) => (GAME_DATA.jobProfiles || []).some((job) => job.unit === unit.id)).map((unit) => `<option value="${unit.id}">${unit.name}</option>`)].join("");
    renderCapabilityMap();
  }
}

function renderSourceCenter() {
  if (!els.sourceRelease || !els.sourceFiles) return;
  const release = GAME_DATA.publicRelease || {};
  const sourceFiles = release.sourceFiles || [];
  const sourceVersionCount = new Set(sourceFiles.map((item) => item.sourceVersion).filter(Boolean)).size;
  els.sourceRelease.innerHTML = `
    <article><span>發布快照</span><strong>${release.id || "未標記"}</strong><small>發布日期：${release.publishedAt || ""}</small></article>
    <article><span>正式節點</span><strong>${release.formalDirectoryCount || 0}</strong><small>只計入已確認組織節點</small></article>
    <article><span>來源文件</span><strong>${release.sourceCount || sourceFiles.length}</strong><small>${sourceVersionCount} 個資料版本</small></article>
    <article><span>可見範圍</span><strong>${release.classification || "P0"}</strong><small>不含 P1 任務紀錄與 P2/P3 人才資料</small></article>
  `;
  els.sourceFiles.innerHTML = sourceFiles.length ? sourceFiles.map((item) => `
    <article class="source-file"><div><span class="file-seal">PDF</span><strong>${item.source}</strong></div><p>${item.directoryCount} 個正式組織節點</p><small>資料版本：${item.sourceVersion || "未標記"}</small></article>
  `).join("") : `<article class="source-empty"><strong>尚無可發布來源</strong><p>公開版不以推測建立來源紀錄。</p></article>`;
}
function peopleJobs(member) {
  const text = `${member.name} ${member.localName || ""} ${member.role || ""} ${member.department || ""}`.toLowerCase();
  return (GAME_DATA.jobProfiles || []).filter((job) => {
    if (job.unit === unitFor(member)) return true;
    return (job.belongsTo || "").toLowerCase().split("/").some((part) => part.trim() && text.includes(part.trim()));
  }).slice(0, 4);
}

function renderPeopleDirectory() {
  if (!els.peopleProfile) return;
  const member = memberById(els.peopleSelect?.value) || allOrgMembers().find((person) => person.id === "elly") || allOrgMembers()[0];
  if (!member) return;
  const manager = member.reportsTo ? orgChartMembers().find((person) => person.id === member.reportsTo) : null;
  const reports = directReportsFor(member.id);
  const jobs = peopleJobs(member);
  const taskRoles = (sandboxData().unitRoleHints[unitFor(member)] || []).map((slotId) => sandboxSlot(slotId)?.zh || slotId).filter(Boolean);
  const sourceRows = [
    ["任職來源", member.membershipSource, member.membershipSourceVersion],
    ["匯報來源", member.reportingSource, member.reportingSourceVersion]
  ].filter(([, source]) => !isMissingValue(source));
  const role = [member.localName, member.role].filter((value) => !isMissingValue(value)).join(" · ") || "正式職稱未提供";
  const jobRows = jobs.length ? jobs.map((job) => `<li><strong>${job.title}</strong><span>${job.group || "JD"} · ${job.evidenceClass || "JD"}</span></li>`).join("") : `<li class="record-empty"><strong>尚無可對應 JD</strong><span>不以推測建立能力紀錄。</span></li>`;
  const sourceHtml = sourceRows.length ? sourceRows.map(([label, source, version]) => `<li><strong>${label}</strong><span>${source}${version ? ` · ${version}` : ""}</span></li>`).join("") : `<li class="record-empty"><strong>來源未標記</strong><span>公開版不補造資料。</span></li>`;
  els.peopleProfile.innerHTML = `
    <article class="person-summary">
      <div class="person-seal">${initials(member.name)}</div>
      <div><p class="label">P0 · Formal organization</p><h2>${member.name}</h2><p>${role}</p><div class="person-path">${member.department || unitName(unitFor(member))}</div></div>
      <div class="record-state"><span>公開範圍</span><strong>正式資料</strong><small>${publicReleaseLine()}</small></div>
    </article>
    <div class="person-record-grid">
      <section class="record-card"><p>任職關係</p><dl><div><dt>主單位</dt><dd>${member.department || unitName(unitFor(member))}</dd></div><div><dt>直屬主管</dt><dd>${manager?.name || ""}</dd></div><div><dt>直屬成員</dt><dd>${reports.length ? `${reports.length} 位` : ""}</dd></div><div><dt>生日</dt><dd>${birthdayLabel(member) || ""}</dd></div></dl></section>
      <section class="record-card"><p>任務席位</p>${taskRoles.length ? `<ul class="record-list">${taskRoles.map((roleName) => `<li><strong>${roleName}</strong><span>依單位職掌提示</span></li>`).join("")}</ul>` : `<div class="record-empty"><strong>未建立任務席位</strong><span>不以個人特質推斷。</span></div>`}</section>
      <section class="record-card"><p>已對應職務能力</p><ul class="record-list">${jobRows}</ul></section>
      <section class="record-card"><p>資料來源與版本</p><ul class="record-list">${sourceHtml}</ul></section>
    </div>
    <section class="access-notice"><span>受限資料區</span><strong>P1 任務紀錄、P2 人資機密與 P3 原始證據須登入、用途聲明與稽核後才可調閱。</strong><button type="button" disabled>需企業登入</button></section>
  `;
}
function renderScoreCard(label, value, helper) {
  const safeValue = clamp(value);
  return `<article class="score-card"><span>${label}</span><strong>${safeValue}</strong><meter min="0" max="100" value="${safeValue}"></meter><p>${helper}</p></article>`;
}

function capabilityLevel(value) {
  const match = /L(\d)/.exec(value || "");
  return match ? Number(match[1]) : 0;
}

function renderCapabilityMap() {
  if (!els.capabilityMap || !els.capabilitySummary) return;
  const unitId = els.capabilityFilter?.value || "all";
  const jobs = (GAME_DATA.jobProfiles || []).filter((job) => unitId === "all" || job.unit === unitId);
  const competencies = new Map();
  jobs.forEach((job) => Object.entries(job.competencies || {}).forEach(([name, level]) => {
    const current = competencies.get(name) || { count: 0, level: 0 };
    competencies.set(name, { count: current.count + 1, level: Math.max(current.level, capabilityLevel(level)) });
  }));
  const unitCount = new Set(jobs.map((job) => job.unit)).size;
  const taskSeatCount = new Set(jobs.flatMap((job) => sandboxData().unitRoleHints[job.unit] || [])).size;
  els.capabilitySummary.innerHTML = [
    ["JD profiles", jobs.length, "已建檔職務"],
    ["Units", unitCount, "涵蓋正式組織群"],
    ["Competencies", competencies.size, "JD 明列核心職能"],
    ["Task seats", taskSeatCount, "依單位職掌提示的任務席位"],
    ["Data boundary", "JD only", "不含個人評分或側寫"]
  ].map(([label, value, helper]) => `<article><span>${label}</span><strong>${value}</strong><small>${helper}</small></article>`).join("");
  els.capabilityMap.innerHTML = jobs.map((job) => {
    const competencyRows = Object.entries(job.competencies || {}).map(([name, level]) => `<span><b>${name}</b><i>${level}</i></span>`).join("");
    const timeRows = Object.entries(job.time || {}).slice(0, 4).map(([name, share]) => `<span>${name}<b>${share}%</b></span>`).join("");
    const taskSeats = (sandboxData().unitRoleHints[job.unit] || []).map((slotId) => sandboxSlot(slotId)?.zh || slotId);
    const taskSeatRows = taskSeats.length ? `<div class="capability-task-seats"><span>任務席位</span><p>${taskSeats.join(" / ")}</p></div>` : "";
    return `<article class="capability-card"><div class="capability-topline"><span>${unitName(job.unit)}</span><b>${job.group}</b></div><div class="capability-source"><span>${job.evidenceClass || "JD"}</span><small>${job.source || ""}${job.sourceVersion ? ` · ${job.sourceVersion}` : ""}</small></div><h3>${job.title}</h3><p>${job.belongsTo}</p><div class="capability-competencies">${competencyRows}</div><div class="capability-focus">${(job.focus || []).slice(0, 4).map((item) => `<i>${item}</i>`).join("")}</div>${taskSeatRows}${timeRows ? `<div class="capability-time">${timeRows}</div>` : ""}</article>`;
  }).join("") || `<article class="capability-empty"><strong>此單位尚無已建檔 JD</strong><p>不以推測補齊職務能力。</p></article>`;
}

function assignmentCue(fit) {
  if (fit >= 88) return "職務線索強";
  if (fit >= 72) return "單位線索";
  return "需確認授權";
}

function draftAssignments() {
  return [
    { slotId: "sponsor", member: memberById(els.draftSponsor?.value) },
    { slotId: "decision-owner", member: memberById(els.draftDecisionOwner?.value) },
    { slotId: "technical-authority", member: memberById(els.draftTechnicalAuthority?.value) },
    { slotId: "delivery-owner", member: memberById(els.draftDeliveryOwner?.value) },
    { slotId: "data-owner", member: memberById(els.draftDataOwner?.value) },
    { slotId: "bridge", member: memberById(els.draftBridge?.value) }
  ];
}

const LOCAL_DRAFT_KEY = "makacard-p0-decision-drafts";

function readLocalDrafts() {
  try {
    const value = JSON.parse(localStorage.getItem(LOCAL_DRAFT_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function writeLocalDrafts(drafts) {
  try {
    localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(drafts.slice(0, 8)));
    return true;
  } catch (error) {
    return false;
  }
}

function localDraftSnapshot() {
  const mission = scenarioById(els.scenarioSelect?.value);
  if (!mission) return null;
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toLocaleString("zh-TW", { dateStyle: "short", timeStyle: "short" }),
    missionId: mission.id,
    missionName: mission.name,
    releaseId: GAME_DATA.publicRelease?.id || "P0",
    assignments: draftAssignments().map((item) => ({ slotId: item.slotId, memberId: item.member?.id || "" }))
  };
}

function saveLocalDraft() {
  const snapshot = localDraftSnapshot();
  if (!snapshot) return;
  const saved = writeLocalDrafts([snapshot, ...readLocalDrafts()]);
  state.localDraftMessage = saved ? "已儲存於此瀏覽器" : "無法使用此瀏覽器儲存空間";
  analyzePair();
}

function loadLocalDraft(id) {
  const draft = readLocalDrafts().find((item) => item.id === id);
  if (!draft) return;
  if (els.scenarioSelect) els.scenarioSelect.value = draft.missionId;
  const assignments = new Map((draft.assignments || []).map((item) => [item.slotId, item.memberId]));
  [
    ["sponsor", els.draftSponsor], ["decision-owner", els.draftDecisionOwner], ["technical-authority", els.draftTechnicalAuthority],
    ["delivery-owner", els.draftDeliveryOwner], ["data-owner", els.draftDataOwner], ["bridge", els.draftBridge]
  ].forEach(([slotId, select]) => {
    if (select && assignments.get(slotId)) select.value = assignments.get(slotId);
  });
  state.localDraftMessage = "已載入本機草案";
  analyzePair();
}

function deleteLocalDraft(id) {
  writeLocalDrafts(readLocalDrafts().filter((item) => item.id !== id));
  state.localDraftMessage = "已移除本機草案";
  analyzePair();
}
function renderDecisionLedger(mission, blueprint, assignments, missingSlots, missingUnits) {
  if (!els.decisionLedger || !mission) return;
  const assigned = assignments.filter((item) => item.member);
  const roleRows = assigned.length ? assigned.map((item) => {
    const slot = sandboxSlot(item.slotId)?.zh || item.slotId;
    return `<li><span>${slot}</span><strong>${item.member.name}</strong><small>${unitName(unitFor(item.member))}</small></li>`;
  }).join("") : `<li class="ledger-empty"><strong>尚未配置任務角色</strong></li>`;
  const gaps = [...missingSlots.map((slotId) => sandboxSlot(slotId)?.zh || slotId), ...missingUnits.map(unitName)];
  const localDrafts = readLocalDrafts().slice(0, 5);
  const historyRows = localDrafts.length ? localDrafts.map((draft) => `<li><div><strong>${draft.missionName || draft.missionId}</strong><span>${draft.createdAt || ""} · ${draft.releaseId || "P0"}</span></div><div><button type="button" class="local-draft-load" data-local-draft-load="${draft.id}">載入</button><button type="button" class="local-draft-delete" data-local-draft-delete="${draft.id}" aria-label="刪除本機草案" title="刪除本機草案">×</button></div></li>`).join("") : `<li class="ledger-empty"><strong>尚未儲存本機草案</strong></li>`;
  els.decisionLedger.innerHTML = `
    <div class="ledger-heading"><div><p class="label">Decision Ledger</p><h3>決策草案</h3></div><span class="ledger-status">草案 · 未核准</span></div>
    <div class="ledger-question"><span>決策問題</span><strong>${mission.goal}</strong><p>${mission.prompt}</p></div>
    <div class="ledger-grid">
      <section><p>預期交付</p><strong>${blueprint.deliverable}</strong></section>
      <section><p>資料範圍</p><strong>P0 正式組織</strong><small>${publicReleaseLine()}</small></section>
      <section><p>核准門檻</p><strong>owner、期限、決策紀錄、P1 存取範圍</strong><small>公開原型僅示範流程，不建立正式任務。</small></section>
    </div>
    <div class="ledger-roles"><p>責任席位</p><ul>${roleRows}</ul></div>
    <div class="ledger-gaps"><p>待確認項目</p><strong>${gaps.length ? gaps.join(" / ") : "角色與必要單位已齊備；仍須企業版核准後才能成立。"}</strong></div>
    <div class="local-draft-bar"><div><span>本機草案</span><strong>僅保存在目前瀏覽器，不會送出或寫回正式系統。</strong></div><button type="button" id="save-local-draft" class="secondary-button compact">儲存本機草案</button></div><small id="local-draft-status" class="local-draft-status" aria-live="polite">${state.localDraftMessage || ""}</small><section class="local-draft-history"><p>本機歷程</p><ul>${historyRows}</ul></section>
  `;
}
function analyzePair() {
  const mission = scenarioById(els.scenarioSelect.value);
  if (!mission) return;
  const blueprint = missionSandbox(mission);
  const assignments = draftAssignments();
  const requiredUnits = missionRequires(mission);
  const selected = assignments.filter((assignment) => assignment.member);
  const selectedUnits = new Set(selected.map((assignment) => unitFor(assignment.member)));
  const coveredUnits = requiredUnits.filter((unit) => selectedUnits.has(unit));
  const missingUnits = requiredUnits.filter((unit) => !selectedUnits.has(unit));
  const missingSlots = blueprint.slots.filter((slotId) => !assignments.find((assignment) => assignment.slotId === slotId)?.member);
  const roleFits = selected.map((assignment) => roleHintFit(assignment.member, assignment.slotId));
  const decision = clamp((assignments.find((item) => item.slotId === "decision-owner")?.member ? 60 : 0) + (assignments.find((item) => item.slotId === "sponsor")?.member ? 25 : 0) + (selected.length >= 4 ? 10 : 0));
  const dependency = clamp(requiredUnits.length ? coveredUnits.length / requiredUnits.length * 100 : 0);
  const facts = clamp((assignments.find((item) => item.slotId === "data-owner")?.member ? 58 : 0) + (assignments.find((item) => item.slotId === "technical-authority")?.member ? 25 : 0) + (missingUnits.length ? 0 : 12));
  const delivery = clamp((assignments.find((item) => item.slotId === "delivery-owner")?.member ? 60 : 0) + (assignments.find((item) => item.slotId === "bridge")?.member ? 18 : 0) + (selected.length >= 4 ? 12 : 0));
  const resilience = clamp(new Set(selected.map((assignment) => assignment.member.id)).size / Math.max(1, selected.length) * 45 + new Set(selected.map((assignment) => unitFor(assignment.member))).size * 12 + (assignments.find((item) => item.slotId === "bridge")?.member ? 12 : 0));
  const overall = clamp(average([decision, dependency, facts, delivery, resilience]) + (roleFits.length ? average(roleFits) - 55 : -20) * .15);

  els.pairTitle.textContent = mission.name;
  els.fitBadge.textContent = `${overall} · ${overall >= 78 ? "可進場" : overall >= 58 ? "需補位" : "尚未成隊"}`;
  els.scoreGrid.innerHTML = [
    renderScoreCard("決策閉環", decision, "授權者與最終拍板是否到位"),
    renderScoreCard("依賴覆蓋", dependency, "任務必要單位是否已接上"),
    renderScoreCard("事實一致", facts, "資料與技術判定是否有人負責"),
    renderScoreCard("交付可行", delivery, "是否有交付與跨單位轉譯者"),
    renderScoreCard("韌性", resilience, "人員與單位是否過度集中")
  ].join("");

  const assignmentList = assignments.map((assignment) => {
    const slot = sandboxSlot(assignment.slotId);
    const member = assignment.member;
    const fit = member ? roleHintFit(member, assignment.slotId) : 0;
    return `<article class="assignment-card ${member ? "assigned" : "missing"}"><span>${slot?.zh || assignment.slotId}</span><strong>${member ? member.name : "未指派"}</strong><small>${member ? `${unitName(unitFor(member))} · ${assignmentCue(fit)}` : slot?.detail || ""}</small></article>`;
  }).join("");
  els.pairInsight.innerHTML = `
    <div class="draft-deliverable"><span>任務交付物</span><strong>${blueprint.deliverable}</strong></div>
    <div class="assignment-grid">${assignmentList}</div>
    <div class="draft-columns">
      <section><b>已覆蓋單位</b><p>${coveredUnits.map(unitName).join(" / ") || "尚未覆蓋"}</p></section>
      <section><b>需要補位</b><p>${[...missingSlots.map((slotId) => sandboxSlot(slotId)?.zh || slotId), ...missingUnits.map(unitName)].join(" / ") || "角色與單位已覆蓋"}</p></section>
      <section><b>成功條件</b><p>${blueprint.success.join(" / ")}</p></section>
    </div>
  `;
  renderDecisionLedger(mission, blueprint, assignments, missingSlots, missingUnits);
}

function draftRecord() {
  const mission = scenarioById(els.scenarioSelect?.value);
  if (!mission) return "";
  const blueprint = missionSandbox(mission);
  const assignments = draftAssignments();
  const requiredUnits = missionRequires(mission);
  const selectedUnits = new Set(assignments.filter((item) => item.member).map((item) => unitFor(item.member)));
  const coveredUnits = requiredUnits.filter((unit) => selectedUnits.has(unit));
  const missingUnits = requiredUnits.filter((unit) => !selectedUnits.has(unit));
  const missingSlots = blueprint.slots.filter((slotId) => !assignments.find((item) => item.slotId === slotId)?.member);
  const selected = assignments.filter((item) => item.member);
  const roleFits = selected.map((item) => roleHintFit(item.member, item.slotId));
  const decision = clamp((assignments.find((item) => item.slotId === "decision-owner")?.member ? 60 : 0) + (assignments.find((item) => item.slotId === "sponsor")?.member ? 25 : 0) + (selected.length >= 4 ? 10 : 0));
  const dependency = clamp(requiredUnits.length ? coveredUnits.length / requiredUnits.length * 100 : 0);
  const facts = clamp((assignments.find((item) => item.slotId === "data-owner")?.member ? 58 : 0) + (assignments.find((item) => item.slotId === "technical-authority")?.member ? 25 : 0) + (missingUnits.length ? 0 : 12));
  const delivery = clamp((assignments.find((item) => item.slotId === "delivery-owner")?.member ? 60 : 0) + (assignments.find((item) => item.slotId === "bridge")?.member ? 18 : 0) + (selected.length >= 4 ? 12 : 0));
  const resilience = clamp(new Set(selected.map((item) => item.member.id)).size / Math.max(1, selected.length) * 45 + selectedUnits.size * 12 + (assignments.find((item) => item.slotId === "bridge")?.member ? 12 : 0));
  const overall = clamp(average([decision, dependency, facts, delivery, resilience]) + (roleFits.length ? average(roleFits) - 55 : -20) * .15);
  const readiness = overall >= 78 ? "可進場" : overall >= 58 ? "需補位" : "尚未成隊";
  const roleRows = assignments.map((item) => {
    const slot = sandboxSlot(item.slotId)?.zh || item.slotId;
    return `- ${slot}：${item.member ? `${item.member.name}（${unitName(unitFor(item.member))}）` : "未指派"}`;
  }).join("\n");
  return [
    "Org Quest 決策草案（任務推演）",
    publicReleaseLine(),
    `任務：${mission.name}`,
    `編隊狀態：${overall} · ${readiness}`,
    `交付物：${blueprint.deliverable || "未定義"}`,
    "",
    "角色配置：",
    roleRows,
    "",
    `已覆蓋單位：${coveredUnits.map(unitName).join(" / ") || "尚未覆蓋"}`,
    `需要補位：${[...missingSlots.map((slotId) => sandboxSlot(slotId)?.zh || slotId), ...missingUnits.map(unitName)].join(" / ") || "無"}`,
    `成功條件：${(blueprint.success || []).join(" / ") || "未定義"}`,
    `任務指標：決策閉環 ${decision} / 依賴覆蓋 ${dependency} / 事實一致 ${facts} / 交付可行 ${delivery} / 韌性 ${resilience}`,
    "",
    "說明：此草案僅供任務編隊與後續確認使用，不構成正式任務指派或人事決定。"
  ].join("\n");
}

async function copyDraftRecord() {
  const record = draftRecord();
  if (!record) return;
  let copied = false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(record);
      copied = true;
    } else {
      copied = legacyCopyText(record);
    }
  } catch (error) {
    copied = legacyCopyText(record);
  }
  if (els.draftCopyStatus) els.draftCopyStatus.textContent = copied ? "決策草案已複製" : "無法自動複製，請改用選取文字";
}

function resetMeeting() {
  const mission = GAME_DATA.orgMissions[Math.floor(Math.random() * GAME_DATA.orgMissions.length)];
  state.meeting = {
    turn: 1,
    scenario: mission,
    trust: mission.pressure.trust,
    clarity: mission.pressure.clarity,
    momentum: mission.pressure.momentum,
    friction: clamp(100 - mission.pressure.friction),
    resilience: 42,
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
  const blueprint = missionSandbox(meeting.scenario);
  const event = missionEventCard(meeting);
  const requiredUnits = missionRequires(meeting.scenario);
  const covered = new Set(meeting.coveredUnits);
  const missing = requiredUnits.filter((unit) => !covered.has(unit));
  const outcome = missionOutcome(meeting, requiredUnits);
  els.meetingTitle.textContent = meeting.scenario.name;
  els.meetingScenario.textContent = meeting.scenario.prompt;
  els.missionBrief.innerHTML = `
    <div class="mission-meta"><span>交付物</span><strong>${blueprint.deliverable}</strong></div>
    <div class="mission-meta"><span>必要席位</span><strong>${blueprint.slots.map((slotId) => sandboxSlot(slotId)?.zh || slotId).join(" / ")}</strong></div>
    <article class="mission-event-card">
      <span>EVENT ${Math.min(meeting.turn, 5)}</span>
      <strong>${event.title}</strong>
      <p>${event.text}</p>
      <b>破解牌：${event.action?.icon || ""} ${event.action?.name || event.actionId}</b>
    </article>
    <div class="lane-strip">${requiredUnits.map((unit) => `<i class="${covered.has(unit) ? "covered" : ""}" style="--unit:${UNIT_COLORS[unit] || "#fff"}">${unitName(unit)}</i>`).join("")}</div>
    ${outcome ? `<article class="mission-outcome ${outcome.complete ? "complete" : "incomplete"}"><span>${outcome.complete ? "MISSION COMPLETE" : "MISSION UNRESOLVED"}</span><strong>${outcome.complete ? meeting.scenario.goal : "這局尚未形成可交付解法"}</strong><p>${outcome.complete ? "必要單位與五項任務條件皆已閉環。" : [outcome.missingUnits.length ? `未覆蓋：${outcome.missingUnits.map(unitName).join(" / ")}` : "", outcome.shortfalls.length ? `未閉環：${outcome.shortfalls.join(" / ")}` : ""].filter(Boolean).join("；")}</p><button class="secondary-button compact mission-copy-button" type="button" data-copy-mission-record>複製任務紀錄</button><small id="mission-copy-status" aria-live="polite"></small></article>` : ""}

  `;
  els.turnCount.textContent = `Turn ${Math.min(meeting.turn, 5)} / 5`;
  ["trust", "clarity", "momentum", "friction", "resilience"].forEach((key) => {
    if (els.meters[key]) els.meters[key].value = meeting[key];
    if (els.values[key]) els.values[key].textContent = meeting[key];
  });
  els.meetingLog.innerHTML = meeting.log.map((item) => `<li>${item}</li>`).join("");
  renderActionCards();
  renderOrgMap();
}

function playMeetingTurn(memberId, actionId = els.missionAction?.value) {
  const meeting = state.meeting;
  const person = memberById(memberId);
  if (!person || meeting.turn > 5) return;
  const action = actionById(actionId) || bestActionForMember(person);
  const unit = unitFor(person);
  const fit = cardFit(person, action);
  const required = missionRequires(meeting.scenario);
  const newLane = required.includes(unit) && !meeting.coveredUnits.includes(unit);
  const crossUnit = meeting.lastUnit && meeting.lastUnit !== unit;
  const riskPenalty = fit.risk ? fit.risk.penalty : 0;
  const actionBoost = action.boosts || {};
  const event = missionEventCard(meeting);
  const eventCountered = action.id === event.actionId;
  const decisionGain = (action.id === "frame" ? 16 : 4) + (newLane ? 4 : 0) - riskPenalty / 6;
  const factGain = (action.id === "evidence" ? 17 : action.id === "gate" ? 10 : 4) - riskPenalty / 7;
  const deliveryGain = (action.id === "prototype" ? 17 : action.id === "bridge" ? 10 : 5) + (newLane ? 5 : 0) - riskPenalty / 7;
  const dependencyGain = newLane ? 24 : crossUnit ? 8 : 2;
  const resilienceGain = crossUnit ? 7 : 2;

  meeting.trust = clamp(meeting.trust + decisionGain + (actionBoost.clarity || 0) / 3);
  meeting.clarity = clamp(meeting.clarity + dependencyGain);
  meeting.momentum = clamp(meeting.momentum + factGain + (actionBoost.trust || 0) / 4);
  meeting.friction = clamp(meeting.friction + deliveryGain + (actionBoost.momentum || 0) / 5);
  meeting.resilience = clamp(meeting.resilience + resilienceGain);
  applyMissionEffect(meeting, eventCountered ? event.effect : event.pressure);

  if (newLane) meeting.coveredUnits.push(unit);
  meeting.played.push(person.id);
  meeting.lastDepartment = person.department;
  meeting.lastUnit = unit;
  const signal = fit.risk ? `風險：${fit.risk.title}` : `補上 ${unitName(unit)} 視角`;
  const eventResult = eventCountered ? `事件破解：${event.title}` : `事件未解：${event.title}`;
  meeting.log.unshift(`T${meeting.turn}：${person.name} 以「${action.name}」進場。${signal}。${eventResult}。`);
  meeting.turn += 1;
  if (meeting.turn > 5) {
    const outcome = missionOutcome(meeting, required);
    meeting.log.unshift(outcome.complete ? `任務完成：${meeting.scenario.goal}` : `任務未閉環：${outcome.missingUnits.length ? `仍缺 ${outcome.missingUnits.map(unitName).join(" / ")}` : `需補 ${outcome.shortfalls.join(" / ")}`}。`);
  }
  drawHand();
  renderMeeting();
}

function renderDirectoryLeads(directory) {
  if (!directory?.leads?.length) return "";
  const leads = directory.leads.map((lead) => `${lead.name}${lead.localName ? ` / ${lead.localName}` : ""}：${lead.title}`).join("；");
  return `<div class="detail-block"><b>正式主管／對口</b><p>${leads}</p></div>`;
}

function orgDirectoryDetail(directory, unit, people) {
  const children = orgDirectoryChildren(directory.id);
  const ownMembers = orgDirectoryMembers(directory, people);
  const path = orgDirectoryPath(directory).join(" / ");
  const source = directory.source || unit?.verification || "正式組織資料";
  return `<div class="detail-kicker">${directory.generated ? "系統推導節點" : "正式組織節點"}</div><strong>${directory.name}</strong><span>路徑：${path}</span><div class="detail-grid"><span>下層單位：${children.length}</span><span>直屬成員：${ownMembers.length}</span><span>資料來源：${source}</span>${directory.sourceVersion ? `<span>來源版本：${directory.sourceVersion}</span>` : ""}</div>${directory.note ? `<div class="detail-block"><b>職掌／備註</b><p>${directory.note}</p></div>` : ""}${renderDirectoryLeads(directory)}${ownMembers.length ? `<div class="detail-block"><b>本層成員</b><p>${ownMembers.map((member) => member.name).join("、")}</p></div>` : ""}`;
}

function renderPersonDetail(member) {
  const manager = member.reportsTo ? orgChartMembers().find((person) => person.id === member.reportsTo) : null;
  const reports = directReportsFor(member.id);
  const birth = birthdayLabel(member);
  const details = [
    ["主單位", member.department || unitName(unitFor(member))],
    ["直屬主管", manager?.name],
    ["直屬成員", reports.length ? `${reports.length} 位` : ""],
    ["生日", birth],
    ["歸屬來源", member.membershipSource],
    ["歸屬版本", member.membershipSourceVersion],
    ["匯報來源", member.reportingSource],
    ["匯報版本", member.reportingSourceVersion]
  ].filter(([, value]) => !isMissingValue(value));
  const taskRoles = (sandboxData().unitRoleHints[unitFor(member)] || [])
    .map((slotId) => sandboxSlot(slotId)?.zh || slotId)
    .filter(Boolean);
  const assignments = (member.additionalAssignments || [])
    .filter((assignment) => assignment.department || assignment.orgUnit)
    .map((assignment) => [assignment.department || unitName(assignment.orgUnit), assignment.role].filter((value) => !isMissingValue(value)).join(" · "));
  const decisionRights = Array.isArray(member.decisionRights) ? member.decisionRights.filter(Boolean) : [];

  return `<div class="detail-kicker">PERSON</div><strong>${member.name}</strong><span>${[member.localName, member.role].filter((item) => !isMissingValue(item)).join(" · ")}</span>${details.length ? `<div class="detail-grid">${details.map(([label, value]) => `<span>${label}：${value}</span>`).join("")}</div>` : ""}${taskRoles.length ? `<div class="detail-block"><b>任務定位</b><p>${taskRoles.join(" / ")}</p></div>` : ""}${assignments.length ? `<div class="detail-block"><b>兼任／矩陣關係</b><p>${assignments.join("；")}</p></div>` : ""}${decisionRights.length ? `<div class="detail-block"><b>正式決策權</b><p>${decisionRights.join(" / ")}</p></div>` : ""}`;
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
  els.orgMap?.addEventListener("pointerdown", beginOrgPan);
  els.orgMap?.addEventListener("pointermove", moveOrgPan);
  els.orgMap?.addEventListener("pointerup", endOrgPan);
  els.orgMap?.addEventListener("pointercancel", endOrgPan);
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
  els.analyzePair?.addEventListener("click", analyzePair);
  els.draftCopyRecord?.addEventListener("click", copyDraftRecord);
  els.resetMeeting?.addEventListener("click", resetMeeting);
  els.missionAction?.addEventListener("change", renderActionCards);
  els.missionBrief?.addEventListener("click", (event) => {
    if (event.target.closest("[data-copy-mission-record]")) copyMissionRecord();
  });
  els.scenarioSelect?.addEventListener("change", analyzePair);
  els.capabilityFilter?.addEventListener("change", renderCapabilityMap);
  els.peopleSelect?.addEventListener("change", renderPeopleDirectory);
  els.decisionLedger?.addEventListener("click", (event) => {
    const save = event.target.closest("#save-local-draft");
    const load = event.target.closest("[data-local-draft-load]");
    const remove = event.target.closest("[data-local-draft-delete]");
    if (save) saveLocalDraft();
    if (load) loadLocalDraft(load.dataset.localDraftLoad);
    if (remove) deleteLocalDraft(remove.dataset.localDraftDelete);
  });
}

function init() {
  fillStaticControls();
  bindEvents();
  analyzePair();
  resetMeeting();
}

init();




