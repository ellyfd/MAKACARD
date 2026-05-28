// Supplemental people and PDF-derived directory membership for 營運管理群 / 財會管理處 2026/05.
// Source files: 營運管理群組織圖202605.pdf and 財會管理處*.pdf.
(function addFinanceOrgData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `finance-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
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
    "finance-admin-office": ids("財會管理處", [
      ["溫玉岑", "Christine Wen"],
      ["黃渝晴", "Mandy Huang"]
    ]),
    "accounting-1": ids("財會管理處 / 會計一部", [
      ["楊曦琳", "Yvonne Yang"],
      ["吳佩伊", "Dori Wu"],
      ["陳立榕", "Lr Chen"],
      ["劉梅斯", "Mavis Liu"],
      ["張芮瑄", "Rema Chang"],
      ["陳品瑄", "Serena Chen"],
      ["林玉婷", "Lisayt Lin"],
      ["Deni Hoang", "Deni Hoang"],
      ["陳柏文", "Derek Chen"],
      ["張傳亞", "ArielCY Chang"]
    ]),
    "accounting-2": ids("財會管理處 / 會計二部", [
      ["陳忍", "Areen Chen"],
      ["簡于甄", "Sylvia Jian"],
      ["張登凱", "Eddie Chang"],
      ["李麗芬", "Cathy Lee"],
      ["王怡心", "Kristy Wang"],
      ["曾怡惠", "Alice Tseng"],
      ["鄭喬琳", "Eileen Cheng"],
      ["陳品穎", "Peggy Chen"]
    ]),
    "accounting-3": ids("財會管理處 / 會計三部", [
      ["陳宣蓓", "Cathyhp Chen"],
      ["王韻涵", "Hannah Wang"],
      ["林紜棋", "Amber Lin"],
      ["朱以安", "Ann Chu"],
      ["洪祖安", "Joanne Horng"],
      ["廖春霖", "Charlie Liao"],
      ["張珈瑜", "Amber Chang"],
      ["鄭以寧", "Nancy Cheng"],
      ["黃詩雅", "Sarah Huang"],
      ["王麗嵐", "Rei Wang"]
    ]),
    "finance-dept": ids("財會管理處 / 財務部", [
      ["林伯峰", "Joseph Lin"],
      ["馮以萱", "Sharon Feng"],
      ["巫敏惠", "Mandy Wu"],
      ["陳慧蓉", "Elissa Chen"],
      ["陳思琦", "Szuchi Chen"],
      ["倪敏", "Amy Ni"],
      ["楊家懿", "Jenny Yang"],
      ["溫玉岑", "Christine Wen"],
      ["黃渝晴", "Mandy Huang"]
    ]),
    "stock-affairs-project": ids("財會管理處 / 股務暨專案組", [
      ["溫玉岑", "Christine Wen"],
      ["王凰凰", "Rita Wang"],
      ["黃渝晴", "Mandy Huang"],
      ["許翠紋", "Elin Hsu"],
      ["洪苡庭", "Tiffany Hong"],
      ["廖敏伶", "Mingling Liao"],
      ["曾筠婷", "Tina Tseng"]
    ]),
    "risk-investment-project": ids("財會管理處 / 風控/投資評估專案小組", [
      ["溫玉岑", "Christine Wen"]
    ]),
    "overseas-finance-investment": ids("財會管理處 / 海外財會組織/轉投資", [
      ["溫玉岑", "Christine Wen"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
