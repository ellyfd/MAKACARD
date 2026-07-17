/*
 * Strict, source-derived membership normalization.
 * A membership is added only when a person's existing department label exactly
 * matches a formal node name or its unique formal path (without the org group).
 */
(function resolveExactOrganizationMembership() {
  const normalize = (value) => String(value || "").replace(/[\s／/（）()]/g, "").toLowerCase();
  const directories = GAME_DATA.orgDirectory || [];
  const byId = new Map(directories.map((directory) => [directory.id, directory]));
  const byNormalizedName = new Map();
  const byNormalizedPath = new Map();

  const directoryPath = (directory) => {
    const parts = [directory.name];
    let cursor = directory;
    while (cursor.parent) {
      cursor = byId.get(cursor.parent);
      if (!cursor) break;
      parts.unshift(cursor.name);
    }
    return (parts.length > 1 ? parts.slice(1) : parts).join(" / ");
  };

  directories.forEach((directory) => {
    const nameKey = normalize(directory.name);
    byNormalizedName.set(nameKey, [...(byNormalizedName.get(nameKey) || []), directory]);
    const pathKey = normalize(directoryPath(directory));
    byNormalizedPath.set(pathKey, [...(byNormalizedPath.get(pathKey) || []), directory]);
  });

  const membershipResolutions = [];
  const assignedIds = new Set(directories.flatMap((directory) => directory.members || []));
  ["members", "orgPeople"].forEach((collection) => {
    (GAME_DATA[collection] || []).forEach((person) => {
      if (person.hiddenFromOrg || !person.department || assignedIds.has(person.id)) return;
      const departmentKey = normalize(person.department);
      const nameMatches = byNormalizedName.get(departmentKey) || [];
      const pathMatches = byNormalizedPath.get(departmentKey) || [];
      const match = nameMatches.length === 1
        ? { directory: nameMatches[0], method: "exact-department-label" }
        : pathMatches.length === 1
          ? { directory: pathMatches[0], method: "exact-department-path" }
          : null;
      if (!match) return;

      const { directory, method } = match;
      directory.members = [...directory.members, person.id];
      assignedIds.add(person.id);
      person.orgDirectory = directory.id;
      person.membershipSource = directory.source;
      person.membershipSourceVersion = directory.sourceVersion;
      person.membershipResolution = method;
      membershipResolutions.push({ personId: person.id, directoryId: directory.id, method });
    });
  });

  GAME_DATA.orgMembershipResolutions = membershipResolutions;
})();

