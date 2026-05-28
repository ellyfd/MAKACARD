// Supplemental people and PDF-derived directory membership for 運籌處 2026/05.
// Source files: 運籌處*.pdf and 工務研發群組織圖202605.pdf.
(function addLogisticsOrgData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `logistics-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
  }

  function ensurePerson(localName, name, department) {
    const existing = peopleByLocalName.get(localName);
    if (existing) return existing.id;
    const person = {
      id: makeId(localName),
      name: name || localName,
      localName,
      role: "待補",
      department,
      orgUnit: "tech-rd",
      birthday: "待補",
      status: "待補"
    };
    GAME_DATA.orgPeople = GAME_DATA.orgPeople || [];
    GAME_DATA.orgPeople.push(person);
    peopleByLocalName.set(localName, person);
    return person.id;
  }

  function ids(department, entries) {
    return entries.map(([localName, name]) => ensurePerson(localName, name, department));
  }

  const directoryMembers = {
    "logistics-office": ids("運籌處", [
      ["陳明慧", "Evy Chen"]
    ]),
    "logistics-management": ids("運籌處 / 物流管理部", [
      ["鄭睿祺", "Debby Jeng"],
      ["陳明慧", "Evy Chen"],
      ["孫紫婕", "Jenny Sun"],
      ["盧彥橋", "George Lu"],
      ["蘇芳儀", "Daisy Su"],
      ["黃乙庭", "Wendy Huang"]
    ]),
    "export-management": ids("運籌處 / 物流管理部 / 出口管理課", [
      ["賴梅華", "Melody Lai"],
      ["呂孟佳", "Lydia Lu"],
      ["陳莉婷", "Iris Chen"],
      ["王俊玲", "Isa Wang"],
      ["蕭羽秀", "Yuhsiu Hsiao"],
      ["黃千育", "Cherry Huang"]
    ]),
    "import-docs": ids("運籌處 / 物流管理部 / 進口文件課", [
      ["鄭睿祺", "Debby Jeng"],
      ["劉燕宜", "Emily Liu"],
      ["黃怡蓁", "Amelia Huang"],
      ["呂靜茹", "Tiffany Lu"],
      ["張建凱", "Here Chang"],
      ["賴大偉", "David Lai"],
      ["江俊吉", "Dennis Chiang"],
      ["林穗純", "Della Lin"]
    ]),
    "production-sales-management": ids("運籌處 / 產銷管理部", [
      ["楊筑涵", "Abby Yang"],
      ["陳明慧", "Evy Chen"],
      ["王朝弘", "Matt Wang"],
      ["曾冠人", "Allen Tseng"],
      ["鄭志聰", "Heaven Cheng"],
      ["何冠穎", "Alice Ho"],
      ["林怡婷", "Iris Lin"],
      ["洪瑄璟", "Freya Hung"],
      ["闕珍如", "Jacqueline Chueh"],
      ["李惠如", "Liz Lee"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
