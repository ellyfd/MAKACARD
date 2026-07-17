/*
 * Public prototype boundary.
 * This runs after all public data files and removes fields that require a
 * private, permissioned talent-intelligence environment.
 */
(function applyPublicDataGovernance() {
  const missing = new Set(["待補", "資料待補", "生日待補", "?"]);
  const normalizeBirthday = (value) => {
    if (typeof value !== "string" || missing.has(value)) return "";
    const full = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (full) return `${full[2]}-${full[3]}`;
    const zh = /^(\d{1,2})月(\d{1,2})日$/.exec(value);
    if (zh) return `${zh[1].padStart(2, "0")}-${zh[2].padStart(2, "0")}`;
    return /^\d{2}-\d{2}$/.test(value) ? value : "";
  };

  GAME_DATA.members = (GAME_DATA.members || []).filter((person) => !person.hiddenFromOrg);
  GAME_DATA.orgPeople = (GAME_DATA.orgPeople || []).filter((person) => !person.hiddenFromOrg);
  const people = [...(GAME_DATA.members || []), ...(GAME_DATA.orgPeople || [])];
  people.forEach((person) => {
    const birthday = normalizeBirthday(person.birthdayText || person.birthday);
    if (birthday) {
      person.birthday = birthday;
      person.birthdayText = birthday;
    } else {
      delete person.birthday;
      delete person.birthdayText;
    }

    ["role", "department", "localName", "status", "zodiac", "element", "animal", "star"].forEach((field) => {
      if (missing.has(person[field])) delete person[field];
    });

    // Individual meeting-derived assessments belong in the future permissioned product, not GitHub Pages.
    delete person.distilled;
    delete person.gameMove;
    delete person.riskTell;
  });

  delete GAME_DATA.distillations;
  delete GAME_DATA.peopleIntel;
  GAME_DATA.publicDataVersion = "2026-07-17-governance";
})();


