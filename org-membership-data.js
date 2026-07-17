/*
 * Strict, source-derived membership normalization.
 * A membership is added only when a person's existing department label exactly
 * matches one formal directory node after punctuation normalization.
 */
(function resolveExactOrganizationMembership() {
  const normalize = (value) => String(value || "").replace(/[\s／/（）()]/g, "").toLowerCase();
  const directories = GAME_DATA.orgDirectory || [];
  const byNormalizedName = new Map();

  directories.forEach((directory) => {
    const key = normalize(directory.name);
    byNormalizedName.set(key, [...(byNormalizedName.get(key) || []), directory]);
  });

  const membershipResolutions = [];
  const assignedIds = new Set(directories.flatMap((directory) => directory.members || []));
  ["members", "orgPeople"].forEach((collection) => {
    (GAME_DATA[collection] || []).forEach((person) => {
      if (person.hiddenFromOrg || !person.department) return;
      const matches = byNormalizedName.get(normalize(person.department)) || [];
      if (matches.length !== 1) return;

      const directory = matches[0];
      if (assignedIds.has(person.id)) return;
      directory.members = [...directory.members, person.id];
      assignedIds.add(person.id);
      person.orgDirectory = directory.id;
      person.membershipSource = directory.source;
      person.membershipSourceVersion = directory.sourceVersion;
      person.membershipResolution = "exact-department-label";
      membershipResolutions.push({ personId: person.id, directoryId: directory.id });
    });
  });

  GAME_DATA.orgMembershipResolutions = membershipResolutions;
})();


