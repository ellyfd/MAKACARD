// PDF-derived reporting relationships.
// Source: 2026/05 Makalot org chart PDFs and makalot-org extracted references.
(function addReportingData() {
  const people = [...(GAME_DATA.members || []), ...(GAME_DATA.orgPeople || [])];

  function findPerson(name) {
    return people.find((person) => person.id === name || person.localName === name || person.name === name);
  }

  function setReports(managerName, reportNames, source) {
    const manager = findPerson(managerName);
    if (!manager) return;
    reportNames.forEach((reportName) => {
      const report = findPerson(reportName);
      if (!report || report.id === manager.id) return;
      report.reportsTo = manager.id;
      report.reportingSource = source;
    });
  }

  setReports("許佳瑛", ["程麗如", "林佳盈", "薛菀之", "游怡專", "周育君", "林倩如"], "開發暨技術處202605.pdf");
  setReports("程麗如", ["經國媛"], "開發暨技術處3D研發中心202605.pdf");
  setReports("經國媛", ["簡伯容", "葉馨憶", "朱家霈", "洪捷", "吳思嫻", "林芓葇", "黃韋蓁", "宋妍蓉", "涂雅珍", "顧惠", "王元亭", "朱英石"], "開發暨技術處3D研發中心202605.pdf");
  setReports("林佳盈", ["黃姿華", "洪珮慈", "陶真雅", "蔡昀潔", "張萱", "林佳燕", "吳彥頡", "賴昱婷", "卓婉禎", "吳阿秀", "姚玲玲", "黃秀琪", "徐曉虹", "黃宇翔", "王雁學", "蔡姿瑜", "顏哲慧", "王宛慈", "邱珮玄", "林琬庭", "李沛慈", "黃湘麟"], "開發暨技術處技術設計部202605.pdf");
  setReports("薛菀之", ["林倩如"], "開發暨技術處樣品研發部202605.pdf");
  setReports("游怡專", ["楊尚穎", "劉科呈"], "開發暨技術處特工研發中心202605.pdf");
  setReports("周育君", ["黃淑萍", "盧雅蘭", "賴宜君", "賴可毓", "李玉茹"], "開發暨技術處估碼中心202605.pdf");

  setReports("胡怡靜", ["林健閔", "林欣煇", "曾冠人", "鄭志聰", "朱玉燕", "余翊寧", "蔡立群"], "工務處組織圖202605.pdf");
  setReports("朱玉燕", ["蔡佩芸", "陳吟函", "邱瀞儀"], "工務處工業工程部組織圖202605.pdf");
  setReports("陳吟函", ["陳柔蒨", "林詩盈", "陳舒涵"], "工務處工業工程部組織圖202605.pdf");
  setReports("蔡立群", ["黃天佑", "王葦勝"], "工務處品質管理部組織圖202605.pdf");
  setReports("王葦勝", ["翁培志", "許建邦", "顏岱怡"], "工務處品質管理部組織圖202605.pdf");
  setReports("陳明慧", ["賴梅華", "盧彥橋"], "運籌處組織圖202605.pdf");

  setReports("宋佩芳", ["周心皓", "劉雅如", "傅亞寧", "賴曉瑄", "郭良祿", "陳瑋今", "呂少傑", "周襄"], "業務行銷群組織圖202605.pdf");
  setReports("周心皓", ["廖映瑜", "許惠雯", "張兆渝"], "業務一處202605.pdf");
  setReports("劉雅如", ["王彥慈", "盧昭如", "許貿昇"], "業務二處202605.pdf");
  setReports("傅亞寧", ["李錦森", "施依莉", "黃瓊萩", "游蓓玟", "吳巧思", "林惠儀", "陳玉書"], "業務三處202605.pdf");
  setReports("賴曉瑄", ["陳婉華", "林雪芬"], "業務五處202605.pdf");
  setReports("郭良祿", ["陳麗玲", "賴姵妘", "黃世旻", "鄭佩文", "詹培志", "陳西圳", "楊馥如"], "業務六處202605.pdf");
  setReports("陳瑋今", ["陳雯婷", "林莉詩", "謝宜君", "高逸鈴", "陳冠儒", "楊之槿"], "業務七處202605.pdf");
  setReports("呂少傑", ["何善泰", "盧逸君", "黃威然", "黃思綺"], "行銷發展處組織圖202605.pdf");

  setReports("謝孔超", ["楊宗憲", "林虹君", "劉祥威", "楊禧融", "楊景憲"], "資訊處組織圖202605.pdf");
  setReports("溫玉岑", ["楊曉琳", "陳忍", "陳宣蓓", "林伯峰", "王怡心"], "財會管理處組織圖202605.pdf");

  GAME_DATA.reportingReady = true;
})();
