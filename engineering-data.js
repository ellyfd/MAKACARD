// Supplemental people and PDF-derived directory membership for 工務處 2026/05.
// Source files: 工務處*.pdf, 工務處處本部*.pdf, 工務處驗布團隊*.pdf, 工務處大貨技師團隊*.pdf,
// 工務處工業工程部*.pdf, 工務處品質管理部*.pdf.
(function addEngineeringOrgData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `eng-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
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
    "engineering-office": ids("工務處", [
      ["胡怡靜", "Anne Hu"]
    ]),
    "engineering-hq": ids("工務處 / 處本部", [
      ["胡怡靜", "Anne Hu"],
      ["薛永和", "Henry Hsueh"],
      ["林健閔", "Ming Lin"],
      ["林欣煇", "Brian Lin"],
      ["黃財源", "Jason Huang"],
      ["蔡長特", "Jerry Tsai"],
      ["廖柔黌", "Rose Liao"],
      ["楊東龍", "Allan Yang"],
      ["張景翔", "JohnCH Chang"]
    ]),
    "bulk-technician-team": ids("工務處 / 大貨技師團隊", [
      ["余翠晃", "Tracy Yu"],
      ["胡怡靜", "Anne Hu"],
      ["徐培倫", "Ellan Hsu"]
    ]),
    "industrial-engineering": ids("工務處 / 工業工程部", [
      ["胡怡靜", "Anne Hu"],
      ["蔡佩芸", "Daphne Tsai"],
      ["朱玉燕", "Angela Chu"],
      ["陳吟函", "Selina Chen"],
      ["林敏榮", "Minrong Lin"],
      ["林栢賢", "Paihsien Lin"],
      ["李佩珊", "Shan Lee"],
      ["林詩盈", "Lucy Lin"],
      ["陳舒涵", "Sophie Chen"],
      ["陳柔蒨", "Echo Chen"],
      ["廖盈芊", "Alison Liao"],
      ["吳祥銘", "Miro Wu"],
      ["邱瀞儀", "Alice Chiu"],
      ["李欣薇", "Sinwei Li"],
      ["許博鈞", "Jasper Hsu"],
      ["王思晴", "Layla Wang"],
      ["施冠宏", "Eric Shi"],
      ["陳暐凱", "Tim Chen"],
      ["閔容欣", "Aria Min"],
      ["張嘉妤", "Cynthia Chang"]
    ]),
    "quality-management": ids("工務處 / 品質管理部", [
      ["余翊寧", "Nara Yu"],
      ["黃琮楫", "Jerry Huang"],
      ["蔡立群", "Rick Tsai"],
      ["陳巧妤", "Amber Chen"],
      ["吳育騰", "Allen Wu"],
      ["古育倫", "Alan Ku"],
      ["胡怡靜", "Anne Hu"],
      ["馮欣欣", "Ashley Fung"],
      ["黃天佑", "Tony Huang"],
      ["周依庭", "Betty Chou"],
      ["康芳榕", "Asther Kang"],
      ["黃文健", "Ned Huang"],
      ["王逢茂", "Bill Wang"],
      ["陳信福", "Ivan Chen"],
      ["陳柏均", "Neal Chen"],
      ["陳咨姍", "Shan Chen"],
      ["蔡東儒", "Eric Tsai"],
      ["鄭茵", "Vicky Cheng"],
      ["王葦勝", "Wilson Wang"],
      ["沈冰琳", "沈冰琳"],
      ["葉婷", "葉婷"]
    ]),
    "fabric-inspection-team": ids("工務處 / 驗布團隊", [
      ["沈冰琳", "沈冰琳"],
      ["鄭茵", "Vicky Cheng"],
      ["古育倫", "Alan Ku"],
      ["康芳榕", "Asther Kang"],
      ["黃文健", "Ned Huang"],
      ["蔡立群", "Rick Tsai"],
      ["胡怡靜", "Anne Hu"],
      ["吳育騰", "Allen Wu"],
      ["王逢茂", "Bill Wang"],
      ["黃天佑", "Tony Huang"],
      ["馮欣欣", "Ashley Fung"],
      ["蔡東儒", "Eric Tsai"],
      ["周依庭", "Betty Chou"],
      ["王葦勝", "Wilson Wang"],
      ["陳巧妤", "Amber Chen"],
      ["葉婷", "葉婷"],
      ["石振華", "石振華"],
      ["李勇", "李勇"],
      ["王國安", "王國安"],
      ["張建高", "張建高"],
      ["李年華", "李年華"],
      ["陳強", "陳強"],
      ["鄧堯", "鄧堯"],
      ["黃錫金", "黃錫金"],
      ["張俊德", "張俊德"],
      ["王昌智", "王昌智"],
      ["何緒君", "何緒君"],
      ["孔祥松", "孔祥松"],
      ["嚴君", "嚴君"],
      ["Hoa Nguyen", "Hoa Nguyen"],
      ["Dani Ngocbich", "Dani Ngocbich"],
      ["Jessie", "Jessie"]
    ])
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();
