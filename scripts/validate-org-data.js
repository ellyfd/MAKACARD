const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scriptSources = [...html.matchAll(/<script src="([^"?]+)\?[^\"]*"><\/script>/g)]
  .map((match) => match[1])
  .filter((source) => source !== "game.js");
const context = { console };
vm.createContext(context);

scriptSources.forEach((source) => {
  const file = path.join(root, source);
  vm.runInContext(fs.readFileSync(file, "utf8"), context, { filename: source });
});
vm.runInContext("this.result = GAME_DATA", context);

const data = context.result;
const errors = [];
const warnings = [];
const directory = data.orgDirectory || [];
const units = data.orgUnits || [];
const people = [...(data.members || []), ...(data.orgPeople || [])];
const forbiddenPersonFields = ["distilled", "gameMove", "riskTell", "vectors"];
const runtimeSource = fs.readFileSync(path.join(root, "game.js"), "utf8");
const forbiddenRuntimePatterns = [
  { label: "member.vectors", pattern: /\bmember\.vectors\b/ },
  { label: "member.gameMove", pattern: /\bmember\.gameMove\b/ },
  { label: "member.riskTell", pattern: /\bmember\.riskTell\b/ }
];
forbiddenRuntimePatterns.forEach(({ label, pattern }) => {
  if (pattern.test(runtimeSource)) errors.push(`Public runtime reads private field: ${label}`);
});

function duplicates(items, key, label) {
  const counts = new Map();
  items.forEach((item) => counts.set(item[key], (counts.get(item[key]) || 0) + 1));
  [...counts.entries()].filter(([, count]) => count > 1).forEach(([value, count]) => {
    errors.push(`${label} duplicate: ${value} (${count})`);
  });
}

duplicates(units, "id", "Unit id");
duplicates(directory, "id", "Directory id");
duplicates(people, "id", "Person id");

const unitIds = new Set(units.map((unit) => unit.id));
const directoryById = new Map(directory.map((item) => [item.id, item]));
const personIds = new Set(people.map((person) => person.id));

directory.forEach((item) => {
  if (!unitIds.has(item.unit)) errors.push(`Directory ${item.id} references unknown unit ${item.unit}`);
  if (item.parent && !directoryById.has(item.parent)) errors.push(`Directory ${item.id} references missing parent ${item.parent}`);
  (item.members || []).forEach((memberId) => {
    if (!personIds.has(memberId)) errors.push(`Directory ${item.id} references missing member ${memberId}`);
  });
});

directory.forEach((item) => {
  const visited = new Set([item.id]);
  let cursor = item;
  while (cursor.parent) {
    cursor = directoryById.get(cursor.parent);
    if (!cursor) break;
    if (visited.has(cursor.id)) {
      errors.push(`Circular directory hierarchy: ${[...visited, cursor.id].join(" -> ")}`);
      break;
    }
    visited.add(cursor.id);
  }
});

people.forEach((person) => {
  if (person.reportsTo && !personIds.has(person.reportsTo)) {
    warnings.push(`Person ${person.id} reports to a record not currently loaded: ${person.reportsTo}`);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(person.birthday || "")) {
    errors.push(`Person ${person.id} exposes a full birthday`);
  }
  forbiddenPersonFields.forEach((field) => {
    if (field in person) errors.push(`Person ${person.id} exposes private field ${field}`);
  });
});

const jobProfiles = data.jobProfiles || [];
const sourcedJobProfiles = jobProfiles.filter((job) => job.source && job.sourceVersion).length;
if (sourcedJobProfiles < jobProfiles.length) {
  warnings.push(`JD profiles with source and version: ${sourcedJobProfiles}/${jobProfiles.length}`);
}

const formalDirectory = directory.filter((item) => !item.generated);
const publicRelease = data.publicRelease;
if (!publicRelease?.id || !publicRelease?.publishedAt || !Array.isArray(publicRelease?.sourceFiles)) {
  errors.push("Missing structured public release manifest");
} else {
  if (publicRelease.formalDirectoryCount !== formalDirectory.length) {
    errors.push(`Public release formal directory count mismatch: ${publicRelease.formalDirectoryCount}/${formalDirectory.length}`);
  }
  const releaseSources = new Set(publicRelease.sourceFiles.map((entry) => `${entry.source || ""}::${entry.sourceVersion || ""}`));
  formalDirectory.forEach((item) => {
    if (!releaseSources.has(`${item.source || ""}::${item.sourceVersion || ""}`)) {
      errors.push(`Formal directory ${item.id} is absent from the public release manifest`);
    }
  });
  if (publicRelease.sourceCount !== releaseSources.size) {
    errors.push(`Public release source count mismatch: ${publicRelease.sourceCount}/${releaseSources.size}`);
  }
}
const sourceCoverage = formalDirectory.filter((item) => item.source || item.verification).length;
const membershipResolutions = data.orgMembershipResolutions || [];
const sourcedMembershipResolutions = membershipResolutions.filter((item) => {
  const person = people.find((candidate) => candidate.id === item.personId);
  return person?.membershipSource && person?.membershipSourceVersion && ["exact-department-label", "exact-department-path"].includes(person?.membershipResolution);
}).length;
const reportingLines = people.filter((person) => person.reportsTo);
const sourcedReportingLines = reportingLines.filter((person) => person.reportingSource).length;
const sourceVersionCoverage = formalDirectory.filter((item) => item.sourceVersion).length;
if (sourceVersionCoverage < formalDirectory.length) {
  warnings.push(`Formal directories with source version: ${sourceVersionCoverage}/${formalDirectory.length}`);
}

if (sourceCoverage < formalDirectory.length) {
  warnings.push(`Formal directories with source metadata: ${sourceCoverage}/${formalDirectory.length}`);
}

console.log(JSON.stringify({
  scriptsLoaded: scriptSources.length,
  units: units.length,
  directories: directory.length,
  people: people.length,
  jdSourceCoverage: `${sourcedJobProfiles}/${jobProfiles.length}`,
  formalDirectorySourceCoverage: `${sourceCoverage}/${formalDirectory.length}`,
  formalDirectorySourceVersionCoverage: `${sourceVersionCoverage}/${formalDirectory.length}`,
  exactMembershipResolutionCoverage: `${sourcedMembershipResolutions}/${membershipResolutions.length}`,
  reportingLineSourceCoverage: `${sourcedReportingLines}/${reportingLines.length}`,
  errors,
  warnings
}, null, 2));

if (errors.length) process.exit(1);








