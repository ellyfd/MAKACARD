/*
 * Public release manifest for the organization snapshot.
 * A source version is not treated as an effective date; effective dates require
 * a personnel announcement or HR-confirmed record.
 */
(function addPublicReleaseManifest() {
  const formalDirectories = (GAME_DATA.orgDirectory || []).filter((item) => !item.generated);
  const sourceFiles = [...formalDirectories.reduce((sources, item) => {
    const key = `${item.source || ""}::${item.sourceVersion || ""}`;
    const current = sources.get(key) || { source: item.source, sourceVersion: item.sourceVersion, directoryCount: 0 };
    current.directoryCount += 1;
    sources.set(key, current);
    return sources;
  }, new Map()).values()].sort((left, right) => left.source.localeCompare(right.source, "zh-Hant"));

  GAME_DATA.publicRelease = {
    id: "2026-07-17-public-org-v1",
    publishedAt: "2026-07-17",
    classification: "P0 公開組織快照",
    formalDirectoryCount: formalDirectories.length,
    sourceCount: sourceFiles.length,
    sourceFiles
  };
})();