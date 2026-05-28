// Supplemental people and PDF-derived directory membership for 公司頂層 / 顧問室本部 / 轉投資企業 2026/05.
// Source files: 公司組織圖202605.pdf, 顧問室本部組織圖202605.pdf, 轉投資企業組織圖202605.pdf.
(function addTopOrgData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `top-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
  }

  function ensurePerson(localName, name, department, orgUnit = "ceo") {
    const existing = peopleByLocalName.get(localName);
    if (existing) return existing.id;
    const person = {
      id: makeId(localName),
      name: name || localName,
      localName,
      role: "待補",
      department,
      orgUnit,
      birthday: "待補",
      status: "待補"
    };
    GAME_DATA.orgPeople = GAME_DATA.orgPeople || [];
    GAME_DATA.orgPeople.push(person);
    peopleByLocalName.set(localName, person);
    return person.id;
  }

  function ids(department, orgUnit, entries) {
    return entries.map(([localName, name]) => ensurePerson(localName, name, department, orgUnit));
  }

  const directoryMembers = {
    board: ids("董事會", "ceo", [
      ["周心鵬", "Alex Chou"],
      ["王安妮", "Annie Wang"]
    ]),
    "audit-office": ids("稽核室", "ceo", [
      ["王安妮", "Annie Wang"]
    ]),
    "ceo-office": ids("執行長 / 公司頂層", "ceo", [
      ["周心鵬", "Alex Chou"]
    ]),
    "decision-integration-committee": ids("決策整合委員會", "ceo", [
      ["郭良祿", "Arthur Kuo"],
      ["周理平", "Li-Ping Chou"],
      ["周心鵬", "Alex Chou"]
    ]),
    "audit-committee": ids("審計委員會", "ceo", [
      ["周心鵬", "Alex Chou"]
    ]),
    "compensation-committee": ids("薪資報酬委員會", "ceo", [
      ["周心鵬", "Alex Chou"]
    ]),
    "sustainability-committee": ids("永續委員會", "ceo", [
      ["周心鵬", "Alex Chou"]
    ]),
    "consulting-office": ids("顧問室本部", "consulting", [
      ["宋光漢", "Michael Song"],
      ["王謙", "Charley Wang"],
      ["黃宏仁", "Richard Huang"],
      ["廖白蓉", "Amy Liao"],
      ["何煌清", "Huangching Ho"],
      ["周心鵬", "Alex Chou"]
    ]),
    "investment-companies": ids("轉投資企業", "investment", [
      ["黃宏仁", "Richard Huang"],
      ["蒲麗玉", "Puli Yu"],
      ["周理平", "Li-Ping Chou"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
