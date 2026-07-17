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
  vm.runInContext(fs.readFileSync(path.join(root, source), "utf8"), context, { filename: source });
});
vm.runInContext("this.result = GAME_DATA", context);

const data = context.result;
const people = [...(data.members || []), ...(data.orgPeople || [])];
const directory = data.orgDirectory || [];
const personIds = new Set(people.map((person) => person.id));
const assignedIds = new Set(directory.flatMap((item) => item.members || []).filter((id) => personIds.has(id)));
const normalize = (value) => String(value || "").replace(/[\s／/（）()]/g, "").toLowerCase();
const directoryByName = new Map();

directory.forEach((item) => {
  const key = normalize(item.name);
  directoryByName.set(key, [...(directoryByName.get(key) || []), item]);
});

const unassigned = people.filter((person) => !assignedIds.has(person.id));
const exactNameMatch = unassigned.filter((person) => (directoryByName.get(normalize(person.department)) || []).length === 1);
const departmentGaps = unassigned
  .filter((person) => !exactNameMatch.includes(person))
  .reduce((groups, person) => {
    const key = person.department || "(未提供部門)";
    groups.set(key, (groups.get(key) || 0) + 1);
    return groups;
  }, new Map());
const reportingLines = people.filter((person) => person.reportsTo);
const sourceReportingLines = reportingLines.filter((person) => person.reportingSource);
const byUnit = (data.orgUnits || []).map((unit) => {
  const members = people.filter((person) => person.orgUnit === unit.id);
  return {
    unit: unit.name,
    people: members.length,
    directoryMembership: members.filter((person) => assignedIds.has(person.id)).length,
    reportingLines: members.filter((person) => person.reportsTo).length
  };
});

console.log(JSON.stringify({
  people: people.length,
  directoryMembership: `${assignedIds.size}/${people.length}`,
  exactDepartmentCandidates: exactNameMatch.length,
  reportingSourceCoverage: `${sourceReportingLines.length}/${reportingLines.length}`,
  byUnit,
  unresolvedDepartments: [...departmentGaps.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 25)
    .map(([department, count]) => ({ department, count }))
}, null, 2));
