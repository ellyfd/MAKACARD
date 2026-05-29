const fs = require("fs");
const vm = require("vm");

const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync("game-data.js", "utf8") + ";this.GAME_DATA=GAME_DATA;", ctx);

[
  "org-skill-data.js",
  "top-org-data.js",
  "general-admin-data.js",
  "sales-marketing-data.js",
  "dev-tech-data.js",
  "engineering-data.js",
  "logistics-data.js",
  "finance-data.js",
  "it-data.js",
  "birthday-data.js",
].forEach((file) => vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file }));

const people = [...(ctx.GAME_DATA.members || []), ...(ctx.GAME_DATA.orgPeople || [])];
vm.runInContext(fs.readFileSync("reporting-data.js", "utf8"), ctx, { filename: "reporting-data.js" });
const reports = people.filter((person) => person.reportsTo);
const managers = [...new Set(reports.map((person) => person.reportsTo))];

console.log(JSON.stringify({ people: people.length, reports: reports.length, managers: managers.length }, null, 2));
