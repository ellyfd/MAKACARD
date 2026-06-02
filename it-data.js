// Supplemental people and PDF-derived directory membership for 營運管理群 / 資訊處 2026/06.
// Source files: 資訊處*.pdf.
(function addItOrgData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `it-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
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
      orgUnit: "ops-mgmt",
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
    "it-office": ids("資訊處", [
      ["謝孔超", "Benjamin Hsieh"],
      ["黃渝晴", "Mandy Huang"]
    ]),
    "app-development": ids("資訊處 / 應用開發部", [
      ["楊宗憲", "Ken Yang"],
      ["黃渝晴", "Mandy Huang"],
      ["謝孔超", "Benjamin Hsieh"]
    ]),
    "app-modernization-engineering": ids("資訊處 / 應用開發部 / 現代化工程", [
      ["林彥輝", "Wayne Lin"]
    ]),
    "app-dev-1": ids("資訊處 / 應用開發部 / 開發I課", [
      ["林彥輝", "Wayne Lin"]
    ]),
    "app-dev-2": ids("資訊處 / 應用開發部 / 開發II課", [
      ["林嘉慧", "Kisa Lin"],
      ["楊明志", "Nick Yang"],
      ["黃靖晏", "Gin Huang"],
      ["李沂禪", "Josefa Lee"],
      ["林祐丞", "Zach Lin"],
      ["朱洵", "Marco Chu"]
    ]),
    "app-dev-3": ids("資訊處 / 應用開發部 / 開發III課", [
      ["沈郁欣", "Shin Shen"],
      ["黃岡陵", "Laura Huang"],
      ["連詠華", "Jasper Lian"],
      ["蔡慈茵", "Christine Tsai"],
      ["陳瑞森", "Reason Chen"],
      ["徐志堯", "Chihyao Hsu"]
    ]),
    "app-dev-4": ids("資訊處 / 應用開發部 / 開發IV課", [
      ["陳詠君", "Phyllis Chen"]
    ]),
    "erp-development": ids("資訊處 / ERP開發部", [
      ["林虹君", "Angela Lin"],
      ["張肯銘", "Jimbo Chang"],
      ["周玉芳", "Partricia Chou"],
      ["黃渝晴", "Mandy Huang"],
      ["謝孔超", "Benjamin Hsieh"],
      ["邱煥盛", "Hanson Chiu"],
      ["陳佳麟", "Roger Chen"]
    ]),
    "erp-modernization-engineering": ids("資訊處 / ERP開發部 / 現代化工程", [
      ["張肯銘", "Jimbo Chang"]
    ]),
    "engineering-system": ids("資訊處 / 工務系統部", [
      ["楊宗憲", "Ken Yang"],
      ["詹祥麟", "Alex Chan"],
      ["黃渝晴", "Mandy Huang"],
      ["黃耀毅", "Ian Huang"],
      ["黃筠筑", "Yunchu Huang"],
      ["謝孔超", "Benjamin Hsieh"],
      ["郭妍彣", "Yenwen Kuo"],
      ["洪子汧", "Ed Hong"],
      ["陳玟華", "Wenna Chen"],
      ["蔡佳君", "Novia Tsai"]
    ]),
    "engineering-system-modernization": ids("資訊處 / 工務系統部 / 現代化工程", [
      ["蔡佳君", "Novia Tsai"],
      ["黃耀毅", "Ian Huang"],
      ["黃筠筑", "Yunchu Huang"],
      ["洪子汧", "Ed Hong"],
      ["連詠華", "Jasper Lian"]
    ]),
    "system-operations": ids("資訊處 / 系統營運部", [
      ["劉祥威", "Ray Liu"],
      ["黃渝晴", "Mandy Huang"],
      ["謝孔超", "Benjamin Hsieh"]
    ]),
    "security-group": ids("資訊處 / 系統營運部 / 資安組", [
      ["劉祥威", "Ray Liu"],
      ["龔文成", "Vincent Gong"],
      ["楊萍琦", "Jason Yang"],
      ["許瀚", "Hans Hsu"],
      ["鄭儒嶽", "Lou Zheng"]
    ]),
    "system-maintenance": ids("資訊處 / 系統營運部 / 系統維護課", [
      ["劉祥威", "Ray Liu"],
      ["葉騏銘", "Jack Yeh"],
      ["趙文瑄", "Sunny Chao"],
      ["任懷恩", "Wayne Ren"]
    ]),
    "digital-transformation": ids("資訊處 / 數位轉型部", [
      ["楊璿融", "Jeff Yang"],
      ["黃渝晴", "Mandy Huang"],
      ["謝孔超", "Benjamin Hsieh"]
    ]),
    "dt-modernization-engineering": ids("資訊處 / 數位轉型部 / 現代化工程", [
      ["吳堃源", "Kevin Wu"]
    ]),
    "dt-engineering": ids("資訊處 / 數位轉型部 / 工程師群", [
      ["李宛真", "Judy Lee"],
      ["蔡智宏", "Welles Nicolas"]
    ]),
    "ai-ops-project": ids("資訊處 / 數位轉型部 / AI應用/營運與專案管理", [
      ["朱心怡", "Hsinyi Chu"],
      ["郭文光", "Wongsatorn T"],
      ["孫晉崴", "Jerry Sun"]
    ]),
    "data-platform": ids("資訊處 / 資料平台部", [
      ["林虹君", "Angela Lin"],
      ["郭昀甄", "Jennifer Guo"],
      ["徐志堯", "Chihyao Hsu"],
      ["黃宇傑", "YuJiet Vong"],
      ["高奕莘", "Sean Kao"]
    ]),
    "software-architecture-committee": ids("資訊處 / 軟體架構委員會", [
      ["謝孔超", "Benjamin Hsieh"],
      ["黃渝晴", "Mandy Huang"],
      ["蔡佳君", "Novia Tsai"]
    ]),
    "api-review": ids("資訊處 / 軟體架構委員會 / API審查小組", [
      ["詹祥麟", "Alex Chan"],
      ["蔡佳君", "Novia Tsai"]
    ]),
    "data-governance": ids("資訊處 / 軟體架構委員會 / 資料治理小組", [
      ["詹祥麟", "Alex Chan"],
      ["朱心怡", "Hsinyi Chu"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
