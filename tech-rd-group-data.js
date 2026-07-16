// Formal 工務研發群 hierarchy and lead alignment.
(function addTechRdGroupData() {
  GAME_DATA.orgDirectory = GAME_DATA.orgDirectory || [];
  GAME_DATA.orgPeople = GAME_DATA.orgPeople || [];

  const people = () => [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])];

  function upsertDirectory(node) {
    const existing = GAME_DATA.orgDirectory.find((item) => item.id === node.id);
    if (existing) {
      Object.assign(existing, node);
      return existing;
    }
    const created = { unit: "tech-rd", members: [], ...node };
    GAME_DATA.orgDirectory.push(created);
    return created;
  }

  function patchPerson(keys, patch) {
    people().forEach((member) => {
      if (keys.some((key) => member.id === key || member.localName === key || member.name === key)) {
        Object.assign(member, patch);
      }
    });
  }

  upsertDirectory({
    id: "tech-rd-group",
    unit: "tech-rd",
    name: "工務研發群",
    members: ["alex", "leo-tsai"],
    note: "工務研發群涵蓋開發暨技術處、工務處與運籌處。主管為執行長周心鵬（兼）；群總協調為產區總經理蔡宏麟（兼）Leo Tsai。3D研發中心屬開發暨技術處，與新事業群的數位產品發展中心相關但不同部門。",
    leads: [
      { name: "Alex Chou", localName: "周心鵬", title: "執行長（兼工務研發群主管）" },
      { name: "Leo Tsai", localName: "蔡宏麟", title: "產區總經理（兼群總協調）" }
    ]
  });

  [
    { id: "dev-tech", parent: "tech-rd-group", name: "開發暨技術處", members: ["celia-hsu"], leads: [{ name: "Celia Hsu", localName: "許佳瑛", title: "處副總經理" }] },
    { id: "engineering-office", parent: "tech-rd-group", name: "工務處" },
    { id: "logistics-office", parent: "tech-rd-group", name: "運籌處" },
    { id: "technical-design", parent: "dev-tech", name: "技術設計部", members: ["lillian-lin"], leads: [{ name: "Lillian Lin", localName: "林佳盈", title: "資深經理" }] },
    { id: "sample-rd", parent: "dev-tech", name: "樣品研發部", members: ["teresa-hsueh"], leads: [{ name: "Teresa Hsueh", localName: "薛菀之", title: "資深經理" }] },
    { id: "rd-3d", parent: "dev-tech", name: "3D研發中心", members: ["elly", "karen"], leads: [{ name: "Elly Cheng", localName: "程麗如", title: "數位產品開發總監（兼）" }] },
    { id: "special-rd", parent: "dev-tech", name: "特工研發中心", members: ["artie-yu"], leads: [{ name: "Artie Yu", localName: "游怡專", title: "經理" }] },
    { id: "dev-logistics-section", parent: "dev-tech", name: "運籌課", members: ["teresa-hsueh"], leads: [{ name: "Teresa Hsueh", localName: "薛菀之", title: "資深經理（兼）" }] },
    { id: "costing-center", parent: "dev-tech", name: "估碼中心", members: ["sylvia-chou"], leads: [{ name: "Sylvia Chou", localName: "周育君", title: "副理" }] }
  ].forEach((node) => {
    const directory = upsertDirectory({ unit: "tech-rd", members: [], ...node });
    directory.members = [...new Set(directory.members || [])];
  });

  [
    { id: "technical-design-v1", parent: "technical-design", name: "V1（KOH / HM / ANF）" },
    { id: "technical-design-v2", parent: "technical-design", name: "V2" },
    { id: "technical-design-v3", parent: "technical-design", name: "V3（WMT / HANS）" },
    { id: "technical-design-v5", parent: "technical-design", name: "V5" },
    { id: "technical-design-v7", parent: "technical-design", name: "V7" }
  ].forEach((node) => upsertDirectory({ unit: "tech-rd", members: [], ...node }));


  const devTechOrder = ["technical-design", "sample-rd", "rd-3d", "special-rd", "dev-logistics-section", "costing-center", "chiayi-sample-center"];
  const devTechChildren = GAME_DATA.orgDirectory
    .filter((item) => item.parent === "dev-tech")
    .sort((left, right) => (devTechOrder.indexOf(left.id) === -1 ? 999 : devTechOrder.indexOf(left.id)) - (devTechOrder.indexOf(right.id) === -1 ? 999 : devTechOrder.indexOf(right.id)));
  GAME_DATA.orgDirectory = GAME_DATA.orgDirectory.filter((item) => item.parent !== "dev-tech");
  const devTechIndex = GAME_DATA.orgDirectory.findIndex((item) => item.id === "dev-tech");
  GAME_DATA.orgDirectory.splice(devTechIndex + 1, 0, ...devTechChildren);
  patchPerson(["leo-tsai", "蔡宏麟", "Leo Tsai"], {
    localName: "蔡宏麟",
    role: "產區總經理（兼工務研發群群總協調）",
    department: "海外產區 / 工務研發群協調",
    style: "工務研發群群總協調，負責把產區現實、工務研發節奏與跨處協作接起來。"
  });
  patchPerson(["celia-hsu", "許佳瑛", "Celia Hsu"], {
    localName: "許佳瑛",
    role: "處副總經理",
    department: "開發暨技術處",
    reportsTo: "alex"
  });
  patchPerson(["lillian-lin", "林佳盈", "Lillian Lin"], {
    localName: "林佳盈",
    role: "資深經理",
    department: "開發暨技術處 / 技術設計部",
    reportsTo: "celia-hsu"
  });
  patchPerson(["teresa-hsueh", "薛菀之", "Teresa Hsueh"], {
    localName: "薛菀之",
    role: "資深經理（兼運籌課）",
    department: "開發暨技術處 / 樣品研發部；運籌課（兼）",
    reportsTo: "celia-hsu"
  });
  patchPerson(["elly", "程麗如", "Elly Cheng"], {
    localName: "程麗如",
    role: "數位產品開發總監（兼3D研發中心）",
    department: "開發暨技術處 / 3D研發中心",
    reportsTo: "celia-hsu"
  });
  patchPerson(["artie-yu", "游怡專", "Artie Yu"], {
    localName: "游怡專",
    role: "經理",
    department: "開發暨技術處 / 特工研發中心",
    reportsTo: "celia-hsu"
  });
  patchPerson(["sylvia-chou", "周育君", "Sylvia Chou"], {
    localName: "周育君",
    role: "副理",
    department: "開發暨技術處 / 估碼中心",
    reportsTo: "celia-hsu"
  });
})();
