// Supplemental people and PDF-derived directory membership for 開發暨技術處 2026/05.
// Source files: 開發暨技術處*.pdf and 嘉義樣品中心202605.pdf.
(function addDevTechOrgData() {
  const supplementalPeople = [
    ["devtech-hsu-feng-ying", "許鳳英", "嘉義樣品中心 / 製樣組"],
    ["devtech-chen-mei-juan", "陳玫娟", "嘉義樣品中心 / 製版組"],
    ["devtech-li-yi-bei", "李宜蓓", "嘉義樣品中心 / 估碼"],
    ["devtech-liao-yi-ying", "廖宜穎", "嘉義樣品中心 / 估碼 / A組"],
    ["devtech-ho-pei-chi", "何佩錡", "嘉義樣品中心 / 估碼"],
    ["devtech-chien-rui-ze", "簡睿澤", "嘉義樣品中心 / 估碼"],
    ["devtech-chen-su-xia", "陳素霞", "開發暨技術處 / 估碼中心"],
    ["devtech-chang-chia-hsuan", "張佳璇", "開發暨技術處 / 估碼中心"],
    ["devtech-huang-shu-ping", "黃淑萍", "開發暨技術處 / 估碼中心"],
    ["devtech-lu-ya-lan", "呂雅嵐", "開發暨技術處 / 估碼中心"],
    ["devtech-lai-yi-chun", "賴怡君", "開發暨技術處 / 估碼中心"],
    ["devtech-lai-ko-yu", "賴可喻", "開發暨技術處 / 估碼中心"],
    ["devtech-li-yu-ju", "李育儒", "開發暨技術處 / 估碼中心"],
    ["devtech-yang-ya-wen", "楊雅雯", "開發暨技術處 / 估碼中心 / 嘉義報價"],
    ["devtech-chang-chia-yun", "張嘉芸", "開發暨技術處 / 估碼中心 / 嘉義報價"],
    ["devtech-kou-hui-ching", "寇惠卿", "開發暨技術處 / 估碼中心 / 大貨台北"],
    ["devtech-chin-kuan-ting", "金冠廷", "開發暨技術處 / 估碼中心 / 大貨台北"],
    ["devtech-hung-ming-hui", "洪明慧", "開發暨技術處 / 估碼中心"],
    ["devtech-tsai-shao-hsun", "蔡邵勳", "開發暨技術處 / 估碼中心"],
    ["devtech-chen-hui-fen", "陳慧芬", "開發暨技術處 / 估碼中心"],
    ["devtech-su-yi-chen", "蘇怡禎", "開發暨技術處 / 估碼中心"],
    ["devtech-chen-chia-wen", "陳嘉文", "開發暨技術處 / 估碼中心"],
    ["devtech-huang-zi-hua", "黃姿華", "開發暨技術處 / 技術設計部"],
    ["devtech-hung-pei-tzu", "洪珮慈", "開發暨技術處 / 技術設計部"],
    ["devtech-tao-chen-ya", "陶真雅", "開發暨技術處 / 技術設計部"],
    ["devtech-tsai-yun-chieh", "蔡畇婕", "開發暨技術處 / 技術設計部"],
    ["devtech-chang-hsuan", "張璿", "開發暨技術處 / 技術設計部"],
    ["devtech-lin-chia-yen", "林佳燕", "開發暨技術處 / 技術設計部"],
    ["devtech-wu-yen-chieh", "吳彥頡", "開發暨技術處 / 技術設計部"],
    ["devtech-lai-yu-ting", "賴昱婷", "開發暨技術處 / 技術設計部"],
    ["devtech-cho-wan-chen", "卓婉禎", "開發暨技術處 / 技術設計部"],
    ["devtech-wu-a-hsiu", "吳阿秀", "開發暨技術處 / 技術設計部"],
    ["devtech-yao-ling-ling", "姚玲玲", "開發暨技術處 / 技術設計部 / 海外"],
    ["devtech-huang-hsiu-chi", "黃綉琪", "開發暨技術處 / 技術設計部 / 平湖"],
    ["devtech-hsu-hsiao-hung", "徐曉虹", "開發暨技術處 / 技術設計部 / 柬埔寨"],
    ["devtech-huang-yu-hsiang", "黃郁翔", "開發暨技術處 / 技術設計部"],
    ["devtech-wang-li-hsueh", "王儷學", "開發暨技術處 / 技術設計部"],
    ["devtech-tsai-tzu-yu", "蔡姿瑜", "開發暨技術處 / 技術設計部"],
    ["devtech-yen-che-hui", "顏哲徽", "開發暨技術處 / 技術設計部"],
    ["devtech-wang-wan-tzu", "王婉慈", "開發暨技術處 / 技術設計部"],
    ["devtech-chiu-pei-hsuan", "邱珮玄", "開發暨技術處 / 技術設計部"],
    ["devtech-lin-wan-ting", "林琬庭", "開發暨技術處 / 技術設計部"],
    ["devtech-li-pei-tzu", "李沛慈", "開發暨技術處 / 技術設計部"],
    ["devtech-huang-hsiang-lin", "黃湘麟", "開發暨技術處 / 技術設計部"],
    ["devtech-lin-chia-li", "林佳莉", "開發暨技術處 / 樣品研發部"],
    ["devtech-wang-hsin", "王馨", "開發暨技術處 / 樣品研發部"],
    ["devtech-chen-jo-lan", "陳若蘭", "開發暨技術處 / 樣品研發部 / 製版課"],
    ["devtech-chen-tzu-yu", "陳慈語", "開發暨技術處 / 樣品研發部 / 製版課"],
    ["devtech-lu-wei-ling", "呂瑋玲", "開發暨技術處 / 樣品研發部 / 製版課"],
    ["devtech-lu-yen-han", "呂晏涵", "開發暨技術處 / 樣品研發部 / 製樣課"],
    ["devtech-chen-hui-chuan", "陳慧娟", "開發暨技術處 / 樣品研發部 / 製樣課"],
    ["devtech-pu-yi-hsin", "卜怡馨", "開發暨技術處 / 樣品研發部 / 製樣課"],
    ["devtech-wu-hui-chuan", "吳惠娟", "開發暨技術處 / 樣品研發部 / 製樣課"],
    ["devtech-lin-shih-ching", "林詩晴", "開發暨技術處 / 樣品研發部 / 智慧服飾"],
    ["devtech-yeh-yu-tzu", "葉彧慈", "開發暨技術處 / 樣品研發部 / 智慧服飾"],
    ["devtech-kuo-yi-chi", "郭依淇", "開發暨技術處 / 樣品研發部 / 智慧服飾"],
    ["devtech-liang-ching-hsiang", "梁景翔", "開發暨技術處 / 特工研發中心 / 技術開發"],
    ["devtech-lin-shih-chieh", "林世杰", "開發暨技術處 / 特工研發中心 / 技術開發"],
    ["devtech-cheng-man-tan", "鄭曼丹", "開發暨技術處 / 特工研發中心 / 大貨技術管理"],
    ["devtech-chen-po-yueh", "陳伯岳", "開發暨技術處 / 特工研發中心 / 訂單管理"],
    ["devtech-chen-ya-fei", "陳亞菲", "開發暨技術處 / 特工研發中心 / 水洗印繡"],
    ["devtech-li-cheng-hsien", "李政賢", "開發暨技術處 / 特工研發中心"],
    ["devtech-ou-tai-chi", "歐岱錡", "開發暨技術處 / 特工研發中心"],
    ["devtech-chang-wei-che", "張維哲", "開發暨技術處 / 特工研發中心"],
    ["devtech-kuo-shu-chih", "郭淑枝", "開發暨技術處 / 運籌課"],
    ["devtech-li-yi-chen", "李羿臻", "開發暨技術處 / 運籌課"],
    ["devtech-cheng-chiao-po", "鄭巧帛", "開發暨技術處 / 運籌課"]
  ].map(([id, localName, department]) => ({
    id,
    name: localName,
    localName,
    role: "待補",
    department,
    orgUnit: "tech-rd",
    birthday: "待補",
    status: "待補"
  }));

  const existingKeys = new Set([...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].flatMap((member) => [
    member.id,
    `${member.name}|${member.localName || ""}`.toLowerCase(),
    member.localName || ""
  ]));
  GAME_DATA.orgPeople = GAME_DATA.orgPeople || [];
  supplementalPeople.forEach((member) => {
    const keys = [member.id, `${member.name}|${member.localName}`.toLowerCase(), member.localName];
    if (!keys.some((key) => existingKeys.has(key))) {
      GAME_DATA.orgPeople.push(member);
      keys.forEach((key) => existingKeys.add(key));
    }
  });

  const directoryMembers = {
    "dev-tech": ["celia-hsu"],
    "rd-3d": ["karen", "huihui", "debbie", "elly", "yoko", "sixian", "celia-hsu", "tinley", "rock", "yota", "chieh", "jan", "jean", "adia", "rou"],
    "chiayi-sample-center": ["sammi-lin-林倩如", "devtech-hsu-feng-ying", "devtech-chen-mei-juan", "lillian-lin", "celia-hsu", "artie-yu", "sylvia-chou", "devtech-li-yi-bei", "devtech-liao-yi-ying", "devtech-ho-pei-chi", "devtech-chien-rui-ze", "teresa-hsueh"],
    "costing-center": ["sylvia-chou", "devtech-chen-su-xia", "devtech-chang-chia-hsuan", "devtech-huang-shu-ping", "devtech-lu-ya-lan", "devtech-lai-yi-chun", "devtech-lai-ko-yu", "devtech-li-yu-ju", "celia-hsu", "devtech-yang-ya-wen", "devtech-chang-chia-yun", "devtech-kou-hui-ching", "devtech-chin-kuan-ting", "devtech-hung-ming-hui", "devtech-tsai-shao-hsun", "devtech-chen-hui-fen", "devtech-su-yi-chen", "devtech-chen-chia-wen"],
    "technical-design": ["lillian-lin", "devtech-huang-zi-hua", "devtech-hung-pei-tzu", "devtech-tao-chen-ya", "devtech-tsai-yun-chieh", "celia-hsu", "devtech-chang-hsuan", "devtech-lin-chia-yen", "devtech-wu-yen-chieh", "devtech-lai-yu-ting", "devtech-cho-wan-chen", "devtech-wu-a-hsiu", "devtech-yao-ling-ling", "devtech-huang-hsiu-chi", "devtech-hsu-hsiao-hung", "devtech-huang-yu-hsiang", "devtech-wang-li-hsueh", "devtech-tsai-tzu-yu", "devtech-yen-che-hui", "devtech-wang-wan-tzu", "devtech-chiu-pei-hsuan", "devtech-lin-wan-ting", "devtech-li-pei-tzu", "devtech-huang-hsiang-lin"],
    "sample-rd": ["teresa-hsueh", "sammi-lin-林倩如", "emily-wang-王翎澖", "celia-hsu", "tina-shih-史明玉", "devtech-lin-chia-li", "devtech-chen-mei-juan", "devtech-hsu-feng-ying", "devtech-wang-hsin", "devtech-chen-jo-lan", "devtech-chen-tzu-yu", "devtech-lu-wei-ling", "devtech-lu-yen-han", "devtech-chen-hui-chuan", "devtech-pu-yi-hsin", "devtech-wu-hui-chuan", "devtech-lin-shih-ching", "devtech-yeh-yu-tzu", "devtech-kuo-yi-chi"],
    "special-rd": ["artie-yu", "devtech-liang-ching-hsiang", "devtech-lin-shih-chieh", "devtech-cheng-man-tan", "devtech-chen-po-yueh", "devtech-chen-ya-fei", "celia-hsu", "devtech-li-cheng-hsien", "devtech-ou-tai-chi", "devtech-chang-wei-che"],
    "dev-logistics-section": ["celia-hsu", "teresa-hsueh", "devtech-kuo-shu-chih", "sylvia-chou", "devtech-li-yi-chen", "devtech-cheng-chiao-po"]
  };

  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set([...(directory.members || []), ...members])];
  });
})();
