// Supplemental people and PDF-derived directory membership for 總管理處 2026/05.
// Source files: 總管理處組織圖202605.pdf and its department charts.
(function addGeneralAdminData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `general-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
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
      orgUnit: "general-mgmt",
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
    "general-office": ids("總管理處", [
      ["黃渝晴", "Mandy Huang"]
    ]),
    "human-resources": ids("人力資源部", [
      ["黃渝晴", "Mandy Huang"]
    ]),
    recruiting: ids("招募暨任用管理課", [
      ["蔡一駖", "Christina Tsai"]
    ]),
    "talent-development": ids("人才發展課", [
      ["汪宜嫻", "Cathy Wang"],
      ["陳薇年", "Weinien Chen"],
      ["黃詩涵", "Nancy Huang"],
      ["廖明月", "Luna Liao"],
      ["謝欣晏", "Kim Hsieh"],
      ["葉芷吟", "Eliza Yeh"],
      ["黃伊嘉", "Eva Huang"],
      ["黃虹婷", "Julia Huang"]
    ]),
    "compensation-management": ids("薪酬管理課", [
      ["林政祐", "Josh Lin"]
    ]),
    "general-affairs": ids("總務管理課", [
      ["張育誠", "Roland Chang"]
    ]),
    hrbp: ids("河內子公司 HR", [
      ["阮芳英", "Andie Nguyen"]
    ]),
    "investor-relations": ids("投資人關係組", [
      ["林恆宇", "Henry Lin"],
      ["黃仲傑", "Jacky Huang"]
    ]),
    "strategy-management": ids("策略暨經營管理部", [
      ["鄭俐俐", "Lilly Cheng"]
    ]),
    "industry-strategy": ids("產業策略課", [
      ["易佳蓉", "Rosa Yi"],
      ["周襄", "Maeve Chou"]
    ]),
    "business-management": ids("經營管理課", [
      ["陸玟瑄", "Michelle Lu"],
      ["謝佩如", "Ruby Hsieh"]
    ]),
    "audit-legal": ids("稽核暨法務組", [
      ["葉辰涓", "Eva Yeh"],
      ["李維勇", "Steve Lee"],
      ["高儀芬", "Even Kao"]
    ]),
    "sustainability-development": ids("永續發展部", [
      ["林健生", "Johnson Lin"],
      ["李婷玉", "Tina Lee"],
      ["鄭佳容", "Winnie Cheng"],
      ["林勝偉", "Stenfer Lin"],
      ["林璽容", "Kelly"],
      ["程暐婷", "Elodie"],
      ["王郁菱", "Treasta"]
    ])
  };

  const roleByLocalName = {
    黃渝晴: "群總經理（兼營運管理群群總；AI 種子計畫發起人）",
    蔡一駖: "副理 / 招募暨任用課負責人",
    汪宜嫻: "副理 / 人才發展課負責人",
    林政祐: "副理 / 薪酬管理課負責人",
    張育誠: "副理 / 總務管理課負責人",
    阮芳英: "河內子公司 HR",
    林恆宇: "資深經理 / 投資人關係組",
    黃仲傑: "經理 / 投資人關係組",
    鄭俐俐: "經理 / 策略暨經營管理部",
    葉辰涓: "經理 / 稽核暨法務組",
    李維勇: "資深稽核",
    高儀芬: "稽核",
    林健生: "資深經理 / 永續發展部",
    李婷玉: "資深專案",
    鄭佳容: "資深專案",
    林勝偉: "安全工程",
    林璽容: "永續專員",
    程暐婷: "永續專員",
    王郁菱: "永續專員"
  };

  Object.entries(roleByLocalName).forEach(([localName, role]) => {
    const person = peopleByLocalName.get(localName);
    if (person) person.role = role;
  });
  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();

