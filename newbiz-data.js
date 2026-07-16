// Supplemental structure for 新事業發展群: 數位產品發展中心 + 智慧紡織發展中心.
(function addNewbizData() {
  const people = [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])];
  const byId = new Map(people.map((member) => [member.id, member]));

  // Keep the official skill-derived Wayi card and remove the legacy short-id duplicate.
  GAME_DATA.members = GAME_DATA.members.filter((member) => member.id !== "wayi-tsai");

  function update(id, patch) {
    const person = byId.get(id);
    if (!person) return;
    Object.assign(person, patch);
  }

  update("alex", {
    role: "執行長（兼新事業發展群主管）",
    style: "新事業發展群最高主管，兼管數位產品發展中心與智慧紡織發展中心。"
  });

  [
    ["elly", "數位產品開發總監（Line 1；負責產品 / 3D 開發；兼3D研發中心）", "數位產品發展中心 / Line 1 — 產品 / 3D 開發", "alex"],
    ["alan", "資深3D技師", "數位產品發展中心 / Line 1 — 產品 / 3D 開發", "elly"],
    ["andy", "3D技師", "數位產品發展中心 / Line 1 — 產品 / 3D 開發", "elly"],
    ["vanessa", "行銷策略總監（Line 2；負責行銷 / 專案 / 對外）", "數位產品發展中心 / Line 2 — 行銷 / 專案 / 對外", "alex"],
    ["doris", "專案專員", "數位產品發展中心 / Line 2 — 行銷 / 專案 / 對外", "vanessa"],
    ["emily", "行銷專員", "數位產品發展中心 / Line 2 — 行銷 / 專案 / 對外", "vanessa"],
    ["dianne", "行銷專員", "數位產品發展中心 / Line 2 — 行銷 / 專案 / 對外", "vanessa"]
  ].forEach(([id, role, department, reportsTo]) => update(id, {
    role,
    department,
    reportsTo,
    orgUnit: "newbiz"
  }));

  [
    ["wayi-tsai-蔡維溢", "資深經理", "智慧紡織發展中心", "alex"],
    ["shirley-sun-孫雪", "專案經理（Line 1）", "智慧紡織發展中心 / Line 1 — Shirley Sun", "wayi-tsai-蔡維溢"],
    ["tanis-lee-李利翔", "專案副理", "智慧紡織發展中心 / Line 1 — Shirley Sun", "shirley-sun-孫雪"],
    ["evan-sheu-許航碩", "專案副理（Line 2）", "智慧紡織發展中心 / Line 2 — Evan Sheu", "wayi-tsai-蔡維溢"],
    ["jonathan-wu-鄔宗甫", "專案專員", "智慧紡織發展中心 / Line 2 — Evan Sheu", "evan-sheu-許航碩"],
    ["gary-yen-顏家靖", "專案專員", "智慧紡織發展中心 / Line 2 — Evan Sheu", "evan-sheu-許航碩"],
    ["dean-lo-羅皓文", "專案專員", "智慧紡織發展中心 / Line 2 — Evan Sheu", "evan-sheu-許航碩"],
    ["ian-tseng-曾奕恩", "專案專員", "智慧紡織發展中心 / Line 2 — Evan Sheu", "evan-sheu-許航碩"],
    ["jimmy-chou-周子揚", "專案副理（Line 3）", "智慧紡織發展中心 / Line 3 — Jimmy Chou", "wayi-tsai-蔡維溢"],
    ["sunny-shih-施禹安", "專案專員", "智慧紡織發展中心 / Line 3 — Jimmy Chou", "jimmy-chou-周子揚"]
  ].forEach(([id, role, department, reportsTo]) => update(id, {
    role,
    department,
    reportsTo,
    orgUnit: "newbiz"
  }));

  const notes = {
    digitalProduct:
      "數位產品發展中心是 Portal:M / StyTrix 核心團隊，雙總監雙線匯報：Elly 負責產品/3D 開發；Vanessa 負責行銷/專案/對外。",
    smartTextile:
      "智慧紡織發展中心由 Wayi Tsai 下設三條 sub-team 線：Shirley/Tanis、Evan/Jonathan/Gary/Dean/Ian、Jimmy/Sunny。"
  };

  const digital = GAME_DATA.orgDirectory.find((item) => item.id === "digital-product");
  if (digital) digital.note = notes.digitalProduct;
  const smart = GAME_DATA.orgDirectory.find((item) => item.id === "smart-textile");
  if (smart) smart.note = notes.smartTextile;
})();
