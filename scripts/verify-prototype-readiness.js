const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const game = fs.readFileSync(path.join(root, "game.js"), "utf8");
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

[
  'data-view="meeting"',
  'data-view="org"',
  'data-view="talent"',
  'data-view="lab"',
  'id="org-map"',
  'id="org-zoom-in"',
  'id="scenario-select"',
  'id="copy-draft-record"',
  'id="mission-brief"'
].forEach((marker) => check(html.includes(marker), `Missing public UI marker: ${marker}`));

[
  "function renderOrgMap()",
  "function renderCapabilityMap()",
  "function analyzePair()",
  "function missionOutcome(",
  "function missionRecord(",
  "function draftRecord(",
  "copyMissionRecord",
  "copyDraftRecord",
  "function publicReleaseLine()",
  "公開資料快照：${release.id}"
].forEach((marker) => check(game.includes(marker), `Missing prototype behavior: ${marker}`));

const sources = [...html.matchAll(/<script src="([^"?]+)\?[^\"]*"><\/script>/g)]
  .map((match) => match[1])
  .filter((source) => source !== "game.js");
const context = { console };
vm.createContext(context);
sources.forEach((source) => vm.runInContext(fs.readFileSync(path.join(root, source), "utf8"), context, { filename: source }));
vm.runInContext("this.result = GAME_DATA", context);
const data = context.result;
const people = [...(data.members || []), ...(data.orgPeople || [])];
const formalDirectory = (data.orgDirectory || []).filter((item) => !item.generated);

check(data.publicRelease?.formalDirectoryCount === formalDirectory.length, "Public release does not match formal directory count");
check(data.publicRelease?.sourceCount === data.publicRelease?.sourceFiles?.length, "Public release source count is invalid");
check((data.jobProfiles || []).every((job) => job.source && job.sourceVersion && job.evidenceClass === "JD"), "JD source evidence is incomplete");
check((data.sandbox?.slotCatalog || []).length >= 6, "Task role catalog is incomplete");
check((data.orgMissions || []).every((mission) => mission.sandbox?.deliverable && mission.sandbox?.slots?.length), "Mission sandbox blueprint is incomplete");
check(people.every((person) => !/^\d{4}-\d{2}-\d{2}$/.test(person.birthday || "")), "Public prototype exposes a full birthday");
check(people.every((person) => !["distilled", "gameMove", "riskTell", "vectors"].some((field) => field in person)), "Public prototype exposes a private person field");
check(fs.existsSync(path.join(root, "docs", "phase-0-data-governance.md")), "Missing Phase 0 governance specification");
check(fs.existsSync(path.join(root, "docs", "phase-5-enterprise-readiness.md")), "Missing enterprise readiness specification");

console.log(JSON.stringify({
  views: 4,
  formalDirectories: formalDirectory.length,
  publicPeople: people.length,
  jdProfiles: (data.jobProfiles || []).length,
  missionBlueprints: (data.orgMissions || []).length,
  release: data.publicRelease?.id || "",
  errors
}, null, 2));

if (errors.length) process.exit(1);