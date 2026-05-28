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
      ["黃渝晴", "Mandy Huang"],
      ["周心鵬", "Alex Chou"]
    ]),
    "strategy-management": ids("策略暨經營管理部", [
      ["黃渝晴", "Mandy Huang"],
      ["鄭俐俐", "Lilly Cheng"]
    ]),
    "industry-strategy": ids("產業策略課", [
      ["易佳蓉", "Rosa Yi"],
      ["周襄", "Maeve Chou"]
    ]),
    "business-management": ids("經營管理課", [
      ["鄭俐俐", "Lilly Cheng"],
      ["陸玟瑄", "Michelle Lu"],
      ["謝佩如", "Ruby Hsieh"]
    ]),
    "human-resources": ids("人力資源部", [
      ["黃渝晴", "Mandy Huang"],
      ["謝宜儒", "Sam Hsieh"]
    ]),
    "compensation-management": ids("薪酬管理課", [
      ["林政祐", "Josh Lin"],
      ["王如玉", "Fiona Wang"],
      ["楊麒弘", "Albert Yang"]
    ]),
    "talent-development": ids("人才發展課", [
      ["汪宜嫻", "Cathy Wang"],
      ["陳薇年", "Weinien Chen"],
      ["黃詩涵", "Nancy Huang"],
      ["廖明月", "Luna Liao"],
      ["謝欣晏", "Kim Hsieh"],
      ["蔡一駖", "Christina Tsai"]
    ]),
    "general-affairs": ids("總務管理課", [
      ["林嘉宏", "Alden Lin"],
      ["鍾佩樺", "Jessie Chung"],
      ["黃伊嘉", "Eva Huang"]
    ]),
    hrbp: ids("HRBP", [
      ["蔡一駖", "Christina Tsai"],
      ["汪宜嫻", "Cathy Wang"],
      ["柳映汝", "Ann Liu"],
      ["張育誠", "Roland Chang"],
      ["林芃妤", "Angelapy Lin"],
      ["陳薇年", "Weinien Chen"],
      ["鍾佩樺", "Jessie Chung"],
      ["阮芳英", "Andie Nguyen"]
    ]),
    recruiting: ids("招募暨任用管理課", [
      ["蔡一駖", "Christina Tsai"],
      ["葉芷吟", "Eliza Yeh"],
      ["黃虹婷", "Julia Huang"],
      ["張育誠", "Roland Chang"]
    ]),
    "sustainability-development": ids("永續發展部", [
      ["黃渝晴", "Mandy Huang"],
      ["林健生", "Johnson Lin"],
      ["李婷玉", "Tina Lee"],
      ["鄭佳容", "Winnie Cheng"],
      ["林勝偉", "Stenfer Lin"],
      ["洪孟瑛", "Mengying Hong"],
      ["林璽容", "Kelly Lin"],
      ["程暐婷", "Elodie Cheng"],
      ["王郁菱", "Treasta Wang"]
    ]),
    "investor-relations": ids("投資人關係組", [
      ["黃渝晴", "Mandy Huang"],
      ["林恆宇", "Henry Lin"],
      ["黃仲傑", "Jacky Huang"]
    ]),
    "audit-legal": ids("稽核暨法務組", [
      ["黃渝晴", "Mandy Huang"],
      ["葉辰涓", "Eva Yeh"],
      ["李維勇", "Steve Lee"],
      ["高儀芬", "Even Kao"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
