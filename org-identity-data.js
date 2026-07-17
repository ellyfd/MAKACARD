/*
 * Canonical identity cleanup for records that are confirmed to describe the
 * same person. Concurrent posts become assignments instead of duplicate cards.
 */
(function normalizeOrganizationIdentities() {
  const aliases = {
    "alex-chou-周心鵬": "alex",
    "elly-cheng-發中心由": "elly",
    "elly-cheng-兼任數位": "elly",
    "celia-hsu-許佳瑛": "celia-hsu",
    "szuchi-huang-理黃思綺": "szuchi-huang-黃思綺",
    "szuchi-huang-統籌": "szuchi-huang-黃思綺",
    "jasmine-yuan-統籌": "jasmine-yuan-袁怡茹",
    "rita-lai-統籌": "rita-lai-賴韻如",
    "performance-production-王湘洳": "chloe-wang-王湘洳"
  };
  const hiddenIds = new Set(["levis-dev-仍兼任", "lucy-仍兼任"]);
  const collections = ["members", "orgPeople"];
  const people = collections.flatMap((collection) => GAME_DATA[collection] || []);
  const byId = new Map(people.map((person) => [person.id, person]));

  Object.entries(aliases).forEach(([duplicateId, canonicalId]) => {
    const duplicate = byId.get(duplicateId);
    const canonical = byId.get(canonicalId);
    if (!duplicate || !canonical) return;

    if (duplicate.orgUnit && duplicate.orgUnit !== canonical.orgUnit) {
      canonical.additionalAssignments = canonical.additionalAssignments || [];
      const assignment = {
        orgUnit: duplicate.orgUnit,
        department: duplicate.department,
        role: duplicate.role,
        reportsTo: duplicate.reportsTo,
        source: duplicate.reportingSource
      };
      if (!canonical.additionalAssignments.some((item) => item.orgUnit === assignment.orgUnit && item.department === assignment.department)) {
        canonical.additionalAssignments.push(assignment);
      }
    }

    ["role", "department", "reportsTo", "reportingSource", "leadAssignments"].forEach((field) => {
      if (!canonical[field] && duplicate[field]) canonical[field] = duplicate[field];
    });
  });

  collections.forEach((collection) => {
    GAME_DATA[collection] = (GAME_DATA[collection] || [])
      .filter((person) => !aliases[person.id] && !hiddenIds.has(person.id))
      .map((person) => ({
        ...person,
        reportsTo: aliases[person.reportsTo] || person.reportsTo
      }));
  });

  GAME_DATA.orgDirectory = (GAME_DATA.orgDirectory || []).map((directory) => ({
    ...directory,
    members: [...new Set((directory.members || [])
      .map((memberId) => aliases[memberId] || memberId)
      .filter((memberId) => !hiddenIds.has(memberId)))]
  }));
})();
