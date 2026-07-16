// Supplemental hierarchy and PDF-derived membership for 業務行銷群 2026/05.
// Source files: 業務行銷群, Marketing Team, 業務一/二/三/五/六/七處, 行銷發展處, 區域型供應鏈, 瓜地馬拉團隊, 河內團隊.
(function addSalesMarketingData() {
  const peopleByLocalName = new Map();
  [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].forEach((member) => {
    if (member.localName) peopleByLocalName.set(member.localName, member);
  });

  function makeId(localName) {
    return `sales-${localName.split("").map((char) => char.charCodeAt(0).toString(16)).join("-")}`;
  }

  function ensurePerson(localName, name, department) {
    if (localName === "待補") return null;
    const existing = peopleByLocalName.get(localName);
    if (existing) return existing.id;
    const person = {
      id: makeId(localName),
      name: name || localName,
      localName,
      role: "待補",
      department,
      orgUnit: "sales-marketing",
      birthday: "待補",
      status: "待補"
    };
    GAME_DATA.orgPeople = GAME_DATA.orgPeople || [];
    GAME_DATA.orgPeople.push(person);
    peopleByLocalName.set(localName, person);
    return person.id;
  }

  function ids(department, entries) {
    return entries
      .map(([localName, name]) => ensurePerson(localName, name, department))
      .filter(Boolean);
  }

  function upsertDirectory(node) {
    const existing = GAME_DATA.orgDirectory.find((item) => item.id === node.id);
    if (existing) {
      Object.assign(existing, node, { members: existing.members || [] });
      return existing;
    }
    const created = { unit: "sales-marketing", members: [], ...node };
    GAME_DATA.orgDirectory.push(created);
    return created;
  }

  [
    { id: "sales-group", name: "業務行銷群", members: [] },
    { id: "sales-1", parent: "sales-group", name: "業務一處", members: [] },
    { id: "sales-1-project", parent: "sales-1", name: "專案整合", members: [] },
    { id: "sales-1-a", parent: "sales-1", name: "A部（BR/UA/ATH/GS/GO/IPSS）", members: [] },
    { id: "sales-1-a-dev", parent: "sales-1-a", name: "Development", members: [] },
    { id: "sales-1-a-prod", parent: "sales-1-a", name: "Production", members: [] },
    { id: "sales-1-new-client", parent: "sales-1-a", name: "一處新客戶開發", members: [] },
    { id: "sales-1-b", parent: "sales-1", name: "B部（GAP/GO Knits）", members: [] },
    { id: "sales-1-b-dev", parent: "sales-1-b", name: "Development", members: [] },
    { id: "sales-1-b-prod", parent: "sales-1-b", name: "Production", members: [] },
    { id: "sales-1-purchasing", parent: "sales-1", name: "採購課", members: [] },
    { id: "sales-1-purchasing-fab", parent: "sales-1-purchasing", name: "FAB（主料）", members: [] },
    { id: "sales-1-purchasing-acc", parent: "sales-1-purchasing", name: "ACC（副料）", members: [] },
    { id: "sales-2", parent: "sales-group", name: "業務二處", members: [] },
    { id: "sales-2-a", parent: "sales-2", name: "A部（DKS-Calia/VRST + Sanmar）", members: [] },
    { id: "sales-2-a-dks-dev", parent: "sales-2-a", name: "DKS-Calia/VRST Development", members: [] },
    { id: "sales-2-a-dks-prod-buy", parent: "sales-2-a", name: "DKS-Calia/VRST Production/採購", members: [] },
    { id: "sales-2-a-sanmar", parent: "sales-2-a", name: "Sanmar", members: [] },
    { id: "sales-2-b", parent: "sales-2", name: "B部（DKS-DSG/PG/AP/Golf）", members: [] },
    { id: "sales-2-b-dev", parent: "sales-2-b", name: "Development", members: [] },
    { id: "sales-2-b-prod-buy", parent: "sales-2-b", name: "Production/採購", members: [] },
    { id: "sales-3", parent: "sales-group", name: "業務三處", members: [] },
    { id: "sales-3-a", parent: "sales-3", name: "A部（NET + TOMS/Joe Fresh）", members: [] },
    { id: "sales-3-b", parent: "sales-3", name: "B部（HLF/ACS-EU/A&F + WMT/Zara/Quince/Gildan/新客戶）", members: [] },
    { id: "sales-3-b-hlf", parent: "sales-3-b", name: "HLF/ACS-EU/A&F", members: [] },
    { id: "sales-3-b-wmt", parent: "sales-3-b", name: "WMT/Zara/Quince/Gildan/新客戶", members: [] },
    { id: "sales-3-c", parent: "sales-3", name: "C部（KOH）", members: [] },
    { id: "sales-3-c-dev", parent: "sales-3-c", name: "KOH Development", members: [] },
    { id: "sales-3-c-prod", parent: "sales-3-c", name: "KOH Production", members: [] },
    { id: "sales-3-purchasing", parent: "sales-3", name: "採購課", members: [] },
    { id: "sales-3-purchasing-fab", parent: "sales-3-purchasing", name: "主料", members: [] },
    { id: "sales-3-purchasing-acc", parent: "sales-3-purchasing", name: "副料", members: [] },
    { id: "sales-5", parent: "sales-group", name: "業務五處", members: [] },
    { id: "sales-5-a", parent: "sales-5", name: "A部（TGT Performance）", members: [] },
    { id: "sales-5-a-dev", parent: "sales-5-a", name: "Development", members: [] },
    { id: "sales-5-a-prod", parent: "sales-5-a", name: "Production", members: [] },
    { id: "sales-5-b", parent: "sales-5", name: "B部（TGT Underwear, Family Kids Sleep）", members: [] },
    { id: "sales-5-b-dev", parent: "sales-5-b", name: "Development", members: [] },
    { id: "sales-5-b-prod", parent: "sales-5-b", name: "Production", members: [] },
    { id: "sales-5-c", parent: "sales-5", name: "C部（TGT Adult Sleepwear & New Business + GAP_TSD）", members: [] },
    { id: "sales-5-c-tgt-dev", parent: "sales-5-c", name: "TGT Adult Sleepwear & New Business Development", members: [] },
    { id: "sales-5-c-tgt-prod", parent: "sales-5-c", name: "TGT Adult Sleepwear & New Business Production", members: [] },
    { id: "sales-5-c-gap-dev", parent: "sales-5-c", name: "GAP_TSD Development", members: [] },
    { id: "sales-5-c-gap-prod", parent: "sales-5-c", name: "GAP_TSD Production", members: [] },
    { id: "sales-6", parent: "sales-group", name: "業務六處", members: [] },
    { id: "sales-6-hq", parent: "sales-6", name: "處本部", members: [] },
    { id: "sales-6-a", parent: "sales-6", name: "A部", members: [] },
    { id: "sales-6-a-dev", parent: "sales-6-a", name: "Development", members: [] },
    { id: "sales-6-a-prod", parent: "sales-6-a", name: "Production", members: [] },
    { id: "sales-6-b", parent: "sales-6", name: "B部", members: [] },
    { id: "sales-6-b-dev", parent: "sales-6-b", name: "Development", members: [] },
    { id: "sales-6-b-prod", parent: "sales-6-b", name: "Production", members: [] },
    { id: "sales-6-c", parent: "sales-6", name: "C部", members: [] },
    { id: "sales-6-expat", parent: "sales-6-c", name: "派駐業務組", members: [] },
    { id: "sales-6-procurement", parent: "sales-6-c", name: "採購組", members: [] },
    { id: "sales-6-procurement-fabric", parent: "sales-6-procurement", name: "Fabric", members: [] },
    { id: "sales-6-procurement-accessories", parent: "sales-6-procurement", name: "Accessories", members: [] },
    { id: "sales-7", parent: "sales-group", name: "業務七處", members: [] },
    { id: "sales-7-special", parent: "sales-7", name: "特殊角色 / 專案", members: [] },
    { id: "sales-7-a", parent: "sales-7", name: "A部（IPS）", members: [] },
    { id: "sales-7-a-dev", parent: "sales-7-a", name: "Development", members: [] },
    { id: "sales-7-a-prod", parent: "sales-7-a", name: "Production", members: [] },
    { id: "sales-7-b", parent: "sales-7", name: "B部（SWIM/FLEECE/FR + Beyond Yoga）", members: [] },
    { id: "sales-7-b-swim-dev", parent: "sales-7-b", name: "SWIM/FLEECE/FR Development", members: [] },
    { id: "sales-7-b-swim-prod", parent: "sales-7-b", name: "SWIM/FLEECE/FR Production", members: [] },
    { id: "sales-7-b-beyond-yoga", parent: "sales-7-b", name: "Beyond Yoga", members: [] },
    { id: "sales-7-c", parent: "sales-7", name: "C課（TSD/WKN/KNIT TOP + LEVIS）", members: [] },
    { id: "sales-7-c-dev", parent: "sales-7-c", name: "Development", members: [] },
    { id: "sales-7-c-prod", parent: "sales-7-c", name: "Production", members: [] },
    { id: "sales-7-purchasing", parent: "sales-7", name: "採購部", members: [] },
    { id: "sales-7-purchasing-fabric", parent: "sales-7-purchasing", name: "Fabric", members: [] },
    { id: "sales-7-purchasing-access", parent: "sales-7-purchasing", name: "Access", members: [] },
    { id: "marketing-dev", parent: "sales-group", name: "行銷發展處", members: [] },
    { id: "material-rd", parent: "marketing-dev", name: "材質研發部", members: [] },
    { id: "material-rd-1", parent: "material-rd", name: "材質研發一課（含趨勢開發）", members: [] },
    { id: "material-rd-2", parent: "material-rd", name: "材質研發二課（含副料）", members: [] },
    { id: "product-dev", parent: "marketing-dev", name: "商品開發部", members: [] },
    { id: "product-planning-1", parent: "product-dev", name: "商品企劃一課", members: [] },
    { id: "product-planning-2", parent: "product-dev", name: "商品企劃二課", members: [] },
    { id: "product-planning-3", parent: "product-dev", name: "商品企劃三課", members: [] },
    { id: "marketing-product-strategy", parent: "product-dev", name: "行銷產品策略整合課", members: [] },
    { id: "regional-supply-chain", parent: "sales-group", name: "區域型供應鏈（虛線）", members: [] },
    { id: "marketing-team", parent: "sales-group", name: "Marketing Team（虛線）", members: [] },
    { id: "guatemala-team", parent: "sales-group", name: "瓜地馬拉團隊", members: [] },
    { id: "hanoi-team", parent: "sales-group", name: "河內團隊", members: [] }
  ].forEach(upsertDirectory);

  const directoryMembers = {
    "sales-group": ids("業務行銷群", [["宋佩芳", "Tiffany Sung"], ["周心鵬", "Alex Chou"], ["郭良祿", "Arthur Kuo"]]),
    "sales-1": ids("業務一處", [["周心皓", "Karen Chou"]]),
    "sales-1-project": ids("業務一處 / 專案整合", [["廖映瑜", "Ivy Liao"], ["林怡欣", "Tracy Lin"]]),
    "sales-1-a": ids("業務一處 / A部", [["廖映瑜", "Ivy Liao"]]),
    "sales-1-a-dev": ids("業務一處 / A部 / Development", [
      ["吳季芳", "Rosa Wu"], ["陳宥安", "Avis Chen"], ["韓瑀", "Jessie Han"], ["黃柏閎", "Baron Huang"],
      ["戚薇", "Kiwi Chi"], ["陳于心", "Erin Chen"], ["張育瑄", "Ariel Chang"], ["凃蕙心", "Judy Tu"]
    ]),
    "sales-1-a-prod": ids("業務一處 / A部 / Production", [
      ["林美珠", "Doreen Lin"], ["李秋宜", "Serena Li"], ["林吟潔", "Jye Lin"], ["鍾明瑜", "Katie Chung"],
      ["黃鈺傑", "Tommy Huang"], ["林怡嫺", "Tracy Lin"], ["黃亮鈞", "William Huang"]
    ]),
    "sales-1-new-client": ids("業務一處 / 一處新客戶開發", [["廖映瑜", "Ivy Liao"], ["林怡欣", "Tracy Lin"]]),
    "sales-1-b": ids("業務一處 / B部", [["許惠雯", "Erica Hsu"]]),
    "sales-1-b-dev": ids("業務一處 / B部 / Development", [
      ["陳奕心", "Demi Chen"], ["王毓婷", "Adeline Wang"], ["劉佳妤", "Adela Liu"],
      ["張雅雯", "Carol Chang"], ["溫惠娟", "Emily Wen"], ["吳聲佑", "Benny Wu"], ["馮元貞", "Rene Feng"], ["謝佳霓", "Jenny Hsieh"]
    ]),
    "sales-1-b-prod": ids("業務一處 / B部 / Production", [
      ["許惠雯", "Erica Hsu"], ["李宜菱", "Iris Lee"], ["郭姿妤", "Claire Kuo"], ["王聿璇", "Adeline Wang"], ["曾盈慈", "Inez Tseng"],
      ["潘青梅", "Zoe"], ["銅芳英", "Emily"], ["阮倕莊", "Ivy"], ["趙芳儀", "Daphne Chao"], ["楊國瑄", "Andrew Yang"], ["傅玥綺", "Colleen Fu"],
      ["林詩涵", "Laurina Lin"], ["蔣偉綸", "Alan Chiang"], ["團氏垂玲", "Lyn"], ["阮氏雲英", "Evelyn"]
    ]),
    "sales-1-purchasing": ids("業務一處 / 採購課", [["張兆渝", "Ellen Chang"]]),
    "sales-1-purchasing-fab": ids("業務一處 / 採購課 / FAB", [
      ["劉芷含", "Kelly Liu"], ["洪千鈺", "Katherine Hung"], ["邱怡旻", "Mira Chiu"], ["林韶瑩", "Shine Lin"],
      ["陳婕欣", "Jessie Chen"], ["陳璟瑩", "Emma Chen"], ["徐珮慈", "Coco Hsu"], ["陳式尊庄", "Emma"]
    ]),
    "sales-1-purchasing-acc": ids("業務一處 / 採購課 / ACC", [
      ["王舒屏", "Juby Wang"], ["黃語霏", "Fefe Huang"], ["王嘉瑜", "Melody Wang"], ["陳韻珏", "Aasta Chen"],
      ["黃佩芳", "Erin Huang"], ["柯佳彣", "Leona Ke"], ["範梅英", "Elena"]
    ]),

    "sales-2": ids("業務二處", [["宋佩芳", "Tiffany Sung"], ["劉雅如", "Tania Liu"]]),
    "sales-2-a": ids("業務二處 / A部", [["劉雅如", "Tania Liu"]]),
    "sales-2-a-dks-dev": ids("業務二處 / A部 / DKS-Calia/VRST Development", [
      ["王彥慈", "Jessica Wang"], ["王聖晴", "Jasmine Wang"], ["陳笙文", "Athena Chen"], ["梁祐嘉", "Crystal Liang"],
      ["李雅婷", "Ember Lee"], ["張友芃", "Erica Chang"], ["黃富靖", "Louis Huang"]
    ]),
    "sales-2-a-dks-prod-buy": ids("業務二處 / A部 / DKS-Calia/VRST Production/採購", [
      ["盧昭如", "Angel Lu"], ["呂冠伶", "May Lu"], ["王臆禎", "Jane Wang"], ["廖姸綾", "Angel Liao"], ["黃敬庭", "CarolCT Huang"],
      ["曾塘菱", "Molly Tseng"], ["吳家誼", "Aimee Wu"], ["王怡雯", "Shelbee Wang"], ["王建華", "HelenCH Wang"], ["彭榆茜", "Gina Peng"], ["楊曉如", "Vanessa Yang"]
    ]),
    "sales-2-a-sanmar": ids("業務二處 / A部 / Sanmar", [
      ["王彥慈", "Jessica Wang"], ["吳詠涵", "Ivy Wu"], ["阮氏俄", "Ruby"], ["劉氏鳳", "July"], ["阮氏香", "Tessa"], ["阮氏梅", "Miley"],
      ["鄭韻涵", "Laura Cheng"], ["張韶舫", "Fion Chang"], ["江俐蓉", "Etta Chiang"], ["楊曉如", "Vanessa Yang"], ["陳麒安", "IrisCA Chen"]
    ]),
    "sales-2-b": ids("業務二處 / B部", [["許貿昇", "Vince Hsu"]]),
    "sales-2-b-dev": ids("業務二處 / B部 / Development", [
      ["王慧琦", "Michelle Wang"], ["邱子倫", "Ellen Chiu"], ["梁芷瑋", "Natasha Liang"], ["吳坤芳", "Reni Wu"], ["梁容", "Luby Liang"],
      ["蕭于傑", "Jeffrey Hsiao"], ["田育妮", "Ivy Tien"], ["陳聖文", "Yamaha Chen"], ["林維禎", "AmberWJ Lin"], ["李沛瑄", "Lorrita Li"], ["楊筱凡", "Molly Yang"]
    ]),
    "sales-2-b-prod-buy": ids("業務二處 / B部 / Production/採購", [
      ["吳卓芝", "Julia Wu"], ["林宜儒", "Lydia Lin"], ["陳憶茹", "Queena Chen"], ["黃筱捷", "Cheryel Huang"], ["蔡欣妤", "Ophelia Tsai"],
      ["謝秉皓", "Alan Hsieh"], ["李孟謙", "Angela Lee"], ["黃孟芳", "Elain Huang"], ["許亞渲", "Sherry Hsu"], ["顏美玲", "Sandra Yen"], ["藍智翎", "Catherine Lan"],
      ["林怡嫺", "Lisa Lin"], ["黃雪榕", "Belinda Huang"], ["林巧薇", "EvelynCW Lin"], ["曾珮雅", "Gloria Tseng"], ["黃涵群", "April Huang"], ["李璐", "Lu Lee"], ["鮑暐函", "Hillary Bao"], ["何若筠", "Zoe Ho"]
    ]),

    "sales-3": ids("業務三處", [["傅亞寧", "Cynthia Fu"]]),
    "sales-3-a": ids("業務三處 / A部", [
      ["李錦森", "Eric Lee"], ["施依莉", "Emilia Shih"], ["吳致萱", "Betty Wu"], ["林俞伶", "Amy Lin"],
      ["黃瓊萩", "Carrie Huang"], ["賴思筑", "Szuchu Lai"], ["陳以婷", "Crystal Chen"]
    ]),
    "sales-3-b": ids("業務三處 / B部", [["傅亞寧", "Cynthia Fu"]]),
    "sales-3-b-hlf": ids("業務三處 / B部 / HLF-ACS-EU-A&F", [
      ["袁怡茹", "Jasmine Yuan"], ["蔡幸宜", "Louisa Tsai"], ["俞璇", "Cher Yu"], ["莊雅雯", "Brenda Chuang"],
      ["石政國", "Danny Shih"], ["陳秀滿", "Megan Chen"], ["王耀君", "Jackie Wang"], ["阮冰心", "Eden"]
    ]),
    "sales-3-b-wmt": ids("業務三處 / B部 / WMT-Zara-Quince-Gildan-新客戶", [
      ["吳承隽", "Scott Wu"], ["蘇心紋", "Kit Su"], ["楊珮雯", "Mavis Yang"], ["陳品伃", "Phoebe Chen"], ["陳璵皙", "Ophelia Chen"], ["李廸璇", "VivianDS Lee"],
      ["吳巧思", "Joyce Wu"], ["林怡君", "Luna Lin"], ["王郁文", "Annia Wang"], ["陳柔安", "Ann Chen"], ["楊梅淵", "Linda"], ["陶氏紅絨", "Rosa"]
    ]),
    "sales-3-c": ids("業務三處 / C部", [["游蓓玟", "Masaki Yu"]]),
    "sales-3-c-dev": ids("業務三處 / C部 / KOH Development", [
      ["游蓓玟", "Masaki Yu"], ["李金世鑫", "Ekko Lichin"], ["康曣冘", "Chloe Kang"], ["陳俞璇", "Shirley Chen"], ["路茜茹", "AngelCJ Lu"],
      ["李昕芸", "Cindy Lee"], ["林昭辰", "Charlotte Lin"]
    ]),
    "sales-3-c-prod": ids("業務三處 / C部 / KOH Production", [
      ["吳巧思", "Joyce Wu"], ["黃毓琇", "Michelle Huang"], ["陳俞靜", "Anitayc Chen"], ["賴仕軒", "Sandy Lai"], ["徐婉瑜", "Cathy Hsu"],
      ["阮氏玲", "Monica"], ["範氏耀玲", "Kara"], ["鄧氏瓊英", "Finn"], ["裴熟兒", "Hanah"]
    ]),
    "sales-3-purchasing": ids("業務三處 / 採購課", [["李錦森", "Eric Lee"]]),
    "sales-3-purchasing-fab": ids("業務三處 / 採購課 / 主料", [["陳玉書", "Susan Chen"], ["呂沛旺", "Daniel Lu"], ["黃美禎", "Nina Huang"], ["詹靖宜", "Jenna Chan"], ["鄧進東", "Felix"], ["藍文琦", "Vivian Lan"], ["吳靜芳", "Amei Wu"], ["林慧錦", "Michelle Lin"]]),
    "sales-3-purchasing-acc": ids("業務三處 / 採購課 / 副料", [["林惠儀", "Lois Lin"], ["邱春惠", "Spring Chiu"], ["林珊如", "Sanya Lin"], ["顏妏伃", "Melody Yen"], ["周婉如", "Laura Chou"]]),

    "sales-5": ids("業務五處", [["賴曉瑄", "Sasha Lai"]]),
    "sales-5-a": ids("業務五處 / A部", [["陳婉華", "Flora Chen"]]),
    "sales-5-a-dev": ids("業務五處 / A部 / Development", [["陳若華", "Ruo Chen"], ["葉又瑀", "Sarah Yeh"], ["詹韶茹", "Effie Chan"], ["許瑄庭", "Vivienne Hsu"], ["鄺慧卿", "Jesslyn Florence"], ["陳威宇", "RogerWY Chen"]]),
    "sales-5-a-prod": ids("業務五處 / A部 / Production", [["王湘洳", "Chloe Wang"], ["孫貫哲", "Jason Sun"], ["陳可縈", "Melody Chen"], ["駱品任", "Emily Lo"], ["銅秋芳", "Sophie"], ["吳淑雯", "Eva Wu"], ["傅棨梵", "Fion Fu"], ["阮芳青", "Sophia"], ["王聖雄", "Alan Wang"], ["溫筱萱", "Minnie Wen"], ["陳翊婕", "Bonnie Chen"], ["蔣韶玲", "Celin Chiang"], ["羅氏黎", "Lucie"], ["羅怡婷", "Lucy Lo"], ["方映涵", "Freesia Fang"], ["張志堅", "Chris"]]),
    "sales-5-b": ids("業務五處 / B部", [["林雪芬", "Stephanie Lin"]]),
    "sales-5-b-dev": ids("業務五處 / B部 / Development", [["田倩宜", "Cherry Tien"], ["李耕文", "Amy Lee"], ["陳昱璇", "Crystalyh Chen"], ["賴叡琪", "ChloeRC Lai"], ["林祐竹", "June Lin"], ["范瑋珊", "Sophia Fan"]]),
    "sales-5-b-prod": ids("業務五處 / B部 / Production", [["蔡瑜惠", "Kelly Tsai"], ["馬瑞鴻", "Niki Ma"], ["康家瑜", "Chloecy Kang"], ["陳柔婷", "Angela Chen"], ["胡銥芸", "Ariel Hu"], ["張韋姍", "Sarah Chang"], ["范衣樺", "Joan Fan"], ["唐溶鍾", "Wendy Tang"], ["吳巧琳", "Anya Wu"], ["阮氏金銀", "Kim"], ["阮氏嬌英", "Olivia"]]),
    "sales-5-c": ids("業務五處 / C部", [["林雪芬", "Stephanie Lin"]]),
    "sales-5-c-tgt-dev": ids("業務五處 / C部 / TGT Adult Sleepwear & New Business Development", [["林祐竹", "June Lin"], ["郭芸均", "Daisy Kuo"]]),
    "sales-5-c-tgt-prod": ids("業務五處 / C部 / TGT Adult Sleepwear & New Business Production", [["王湘洳", "Chloe Wang"], ["蔡亞玹", "Maggie Tsai"], ["李育蒨", "Eva Lee"], ["徐雪瑤", "Zola Hsu"], ["武氏明豔", "Sam"], ["阮懷英", "Stacy"]]),
    "sales-5-c-gap-dev": ids("業務五處 / C部 / GAP_TSD Development", [["賴若琦", "Cerita Lai"], ["張捷茵", "Vera Chang"]]),
    "sales-5-c-gap-prod": ids("業務五處 / C部 / GAP_TSD Production", [["蔡瑜惠", "Kelly Tsai"], ["劉曼欣", "Amanda Liu"], ["吳宣慧", "Nina Wu"], ["梁氏瓊英", "Monica"], ["杜氏翠恆", "Josie"], ["梁尹宣", "Sunny Liang"], ["韓宇佳", "Vanessa Han"], ["範氏秋芳", "Jolie"]]),

    "sales-6": ids("業務六處", [["郭良祿", "Arthur Kuo"]]),
    "sales-6-hq": ids("業務六處 / 處本部", [["陳麗玲", "Joyce Chen"]]),
    "sales-6-a": ids("業務六處 / A部", [["賴姵妘", "Stephy Lai"]]),
    "sales-6-a-dev": ids("業務六處 / A部 / Development", [["賴姵妘", "Stephy Lai"], ["蔡萱", "Claire Tsai"], ["鄭凱尹", "Catherine Cheng"], ["徐以恆", "Joy Hsu"], ["鄭雅方", "Miyabi Cheng"], ["張亞築", "Irene Cheng"], ["劉亭昀", "Tanya Liu"], ["許筑婷", "Chiku Hsu"], ["張家瑄", "Maggie Chang"]]),
    "sales-6-a-prod": ids("業務六處 / A部 / Production", [["黃世旻", "Rene Huang"], ["廖婕宏", "Hally Liao"], ["郭育汝", "Ruby Kuo"], ["賴可馨", "Karen Lai"], ["游淳喻", "Pan Yu"], ["李昱萱", "Sharon Lee"], ["鄭鈞文", "Kevin Cheng"]]),
    "sales-6-b": ids("業務六處 / B部", [["郭良祿", "Arthur Kuo"]]),
    "sales-6-b-dev": ids("業務六處 / B部 / Development", [["陳昀昀", "Sofia Chen"], ["許瑋君", "Kimi Hsu"], ["邱郁婷", "Olga Ciou"], ["鄭凱勻", "Bruce Cheng"], ["楊淳安", "Andie Yang"], ["陳韋剛", "Kenta Chen"], ["張凱瑩", "Kai Chang"], ["吳宜縈", "Doris Wu"]]),
    "sales-6-b-prod": ids("業務六處 / B部 / Production", [["鄭佩文", "Peggy Cheng"], ["楊子儀", "Wendy Yang"], ["朱思盈", "Francis Chu"], ["曾俞樺", "Chloe Tseng"], ["謝依婕", "Phoebe Hsieh"], ["王潔恩", "Jamie Wang"], ["許瑋君", "Kimi Hsu"], ["邵亭嘉", "Vera Shao"], ["蔡浥平", "Sophie Tsai"]]),
    "sales-6-c": ids("業務六處 / C部", [["陳麗玲", "Joyce Chen"]]),
    "sales-6-expat": ids("業務六處 / C部 / 派駐業務組", [["詹培志", "Robert Chan"], ["張念平", "Louis Zhang"], ["陳玟臻", "Christine Chen"], ["鍾絲宇", "Sylvia Chung"], ["王家恩", "Jamie Wang"], ["黃貞瑋", "Jenny Huang"], ["陳書瑋", "Charlotte Chen"], ["俞邯", "Yuffie Yu"], ["葛昌軒", "Ryan Ko"]]),
    "sales-6-procurement": ids("業務六處 / C部 / 採購組", [["陳麗玲", "Joyce Chen"]]),
    "sales-6-procurement-fabric": ids("業務六處 / C部 / 採購組 / Fabric", [["陳西圳", "Bill Chen"], ["張漢林", "Helen Zhang"], ["顧晶晶", "Yina Gu"], ["余盼", "Alice Yu"], ["郭心皓", "Lily Guo"], ["沈燕", "Yan Shen"], ["徐瑜穗", "Anita Hsu"], ["陳律妏", "Cynthia Chen"], ["許貴茵", "Grace Hsu"], ["黃暐翔", "Willson Huang"], ["邱映瑜", "Erica Chiu"], ["楊茹芳", "Lomi Yang"]]),
    "sales-6-procurement-accessories": ids("業務六處 / C部 / 採購組 / Accessories", [["楊馥如", "Queenie Yang"], ["李玉婷", "Sandy Li"], ["丁琦芳", "Nicky Ting"], ["朱芊芊", "Vivian Chu"]]),

    "sales-7": ids("業務七處", [["陳瑋今", "Mandy Chen"]]),
    "sales-7-special": ids("業務七處 / 特殊角色", [["翟君宜", "Emily Chak"], ["林莉詩", "Melody Lin"], ["謝宜君", "Eva Hsieh"]]),
    "sales-7-a": ids("業務七處 / A部", [["陳雯婷", "Wendy Chen"]]),
    "sales-7-a-dev": ids("業務七處 / A部 / Development", [["林怡均", "Hazel Lin"], ["林子嫙", "Jess Lin"], ["吳欣穎", "Cindy Wu"], ["胡憶庭", "Hailey Hu"], ["王奕婷", "Phoebe Wang"], ["洪佳蓁", "Carrie Hung"], ["官思瑜", "Ellen Guan"], ["陳薇竹", "Maggie Chen"], ["倪宜莎", "Nisa Ni"], ["張詠翔", "Johnny Chang"], ["陳書璇", "Kate Chen"]]),
    "sales-7-a-prod": ids("業務七處 / A部 / Production", [["石瑞珺", "Sherry Shih"], ["潘柏揚", "Roy Pan"], ["汪嫚妮", "Emilia Wang"], ["廖虹雅", "Ivyhy Liao"], ["潘瓊莊", "Jessi"], ["王嘉鈺", "Alisa Wang"], ["陳俐蓁", "Anita Chen"], ["陳思穎", "Winnie Chen"], ["吳書嫻", "Queenie Wu"], ["蔡佳芳", "Yvonne Tsai"], ["阮氏美萍", "Irene"], ["阮瓊灣", "Jenny"], ["阮玉英", "Reen"]]),
    "sales-7-b": ids("業務七處 / B部", [["林莉詩", "Melody Lin"]]),
    "sales-7-b-swim-dev": ids("業務七處 / B部 / SWIM-FLEECE-FR Development", [["楊蕾", "Carolina Yang"], ["林明慧", "Penny Lin"], ["曹祖瑜", "Joy Tsao"], ["林亮怡", "Jane Lin"], ["蔡佳芳", "Yvonne Tsai"]]),
    "sales-7-b-swim-prod": ids("業務七處 / B部 / SWIM-FLEECE-FR Production", [["謝宜君", "Eva Hsieh"], ["袁薏帆", "Eileen Yuan"], ["陳思瑜", "Angel Chen"], ["劉宇軒", "Elaine Liu"], ["陳瓊英", "Stella"], ["黃奕豪", "Hao Huang"], ["陳冠儒", "Dustin Chen"], ["範倕蓉", "Claire"]]),
    "sales-7-b-beyond-yoga": ids("業務七處 / B部 / Beyond Yoga", [["林莉詩", "Melody Lin"], ["顏子璇", "Sandy Yen"], ["楊博丞", "Ryan Yang"], ["賴盈臻", "Janet Lai"]]),
    "sales-7-c": ids("業務七處 / C課", [["高逸鈴", "Ling Kao"]]),
    "sales-7-c-dev": ids("業務七處 / C課 / Development", [["高逸鈴", "Ling Kao"], ["林君育", "Anny Lin"], ["線世珍", "Jessica Xian"], ["柯予涵", "Joanne Ko"], ["康愷倫", "Karen Kang"], ["林佳昀", "Lucy Lin"]]),
    "sales-7-c-prod": ids("業務七處 / C課 / Production", [["陳冠儒", "Dustin Chen"], ["賴昀辰", "Chloe Lai"], ["林佳昀", "Lucy Lin"], ["銅氏芳", "Jay"], ["阮氏平原", "Min"]]),
    "sales-7-purchasing": ids("業務七處 / 採購部", [["楊之槿", "Tina Yang"]]),
    "sales-7-purchasing-fabric": ids("業務七處 / 採購部 / Fabric", [["王芯玟", "Gloria Wang"], ["王彥智", "Dash Wang"], ["戴敏玲", "Jammy Tai"], ["張春暖", "Amy Chang"], ["巫心瑜", "Vivian Wu"], ["徐芷涵", "Anita Hsu"], ["呂青燕", "Olivia Lu"], ["丁俐妏", "Chezia Ding"]]),
    "sales-7-purchasing-access": ids("業務七處 / 採購部 / Access", [["劉之泠", "Kristy Liu"], ["袁啓泓", "Ivy Yuan"], ["張文雅", "Manga Cheung"], ["陳淑燕", "Grace Chen"], ["范氏泰安", "Annie"], ["吳氏芳草", "Julie"]]),

    "marketing-dev": ids("行銷發展處", [["呂少傑", "Douglas Lu"], ["宋佩芳", "Tiffany Sung"]]),
    "material-rd": ids("行銷發展處 / 材質研發部", [["何善泰", "Michael Ho"]]),
    "material-rd-1": ids("行銷發展處 / 材質研發部 / 材質研發一課", [["蔡欣佑", "Lik Tsai"], ["黃稜融", "Rita Huang"], ["孫俐婷", "Christine Suan"], ["陳崇訓", "Paul Chen"]]),
    "material-rd-2": ids("行銷發展處 / 材質研發部 / 材質研發二課", [["黃彥瑜", "Yulia Huang"], ["吳采蓁", "Judith Wu"], ["陳怡婷", "Evelyn Chen"], ["羅苡丹", "Elaine Lo"], ["鄭亦倩", "Diane Cheng"], ["胡玉婷", "Judy Hu"], ["汪真誼", "Alex Wang"], ["童慧玲", "Trista Tung"], ["林碧娟", "Pichuan Lin"], ["宋盈霆", "Ting Song"]]),
    "product-dev": ids("行銷發展處 / 商品開發部", [["呂少傑", "Douglas Lu"]]),
    "product-planning-1": ids("行銷發展處 / 商品開發部 / 商品企劃一課", [["盧逸君", "Iris Lu"], ["麥萱", "Maggie Mai"], ["王彤", "Crystal Wang"], ["陳葳如", "Nicole Chan"]]),
    "product-planning-2": ids("行銷發展處 / 商品開發部 / 商品企劃二課", [["盧逸君", "Iris Lu"], ["高紹程", "Rocco Kao"], ["郭家誌", "Eric Kuo"], ["王思云", "Urit Wang"], ["施力嘉", "Lizzy Shih"], ["黃佩宇", "Joyce Huang"], ["倪佩如", "Patty Ni"], ["陳葳如", "Nicole Chan"]]),
    "product-planning-3": ids("行銷發展處 / 商品開發部 / 商品企劃三課", [["黃威然", "William Huang"], ["邱美瑜", "Alison Chiu"], ["鐘育慈", "Nika Chung"], ["鐘麗華", "Emily Chung"], ["牟士銜", "Simon Mo"], ["牟方圓", "Mou Mou"], ["郭志熙", "Ben Kuo"]]),
    "marketing-product-strategy": ids("行銷發展處 / 商品開發部 / 行銷產品策略整合課", [["黃思綺", "Szuchi Huang"], ["蘇羽庭", "Rebecca Su"], ["邱美瑜", "Alison Chiu"], ["許彥宇", "Nathan Hsu"]]),
    "regional-supply-chain": ids("區域型供應鏈", [["何善泰", "Michael Ho"], ["許芷綾", "Emily Hsu"], ["蔡欣佑", "Lik Tsai"], ["黃彥瑜", "Yulia Huang"], ["陸玟瑄", "Michelle Lu"], ["賴韻如", "Rita Lai"], ["張濬綸", "Marco Chang"], ["支力成", "Karl Chih"]]),
    "marketing-team": ids("Marketing Team", [["宋佩芳", "Tiffany Sung"], ["周襄", "Maeve Chou"], ["翟君宜", "Emily Chak"], ["呂少傑", "Douglas Lu"], ["盧逸君", "Iris Lu"], ["周心皓", "Karen Chou"], ["廖映瑜", "Ivy Liao"], ["劉雅如", "Tania Liu"], ["傅亞寧", "Cynthia Fu"], ["賴曉瑄", "Sasha Lai"], ["徐驪", "Rebecca Shyu"], ["陳瑋今", "Mandy Chen"], ["林莉詩", "Melody Lin"]]),
    "guatemala-team": ids("瓜地馬拉團隊", [["宋佩芳", "Tiffany Sung"], ["翟君宜", "Emily Chak"], ["Joseandres Arriola", "Joseandres Arriola"], ["何善泰", "Michael Ho"], ["Francisco Rodriguez", "Francisco Rodriguez"], ["賴韻如", "Rita Lai"], ["Laura Valdez", "Laura Valdez"], ["張濬綸", "Marco Chang"], ["支力成", "Karl Chih"]]),
    "hanoi-team": ids("河內團隊", [
      ["阮芳英", "Andie"], ["黃氏幸源", "Deni"], ["武氏明豔", "Sam"], ["張志堅", "Chris"], ["阮氏玲", "Monica"], ["劉氏鳳", "July"], ["阮氏俄", "Ruby"], ["阮氏香", "Tessa"], ["阮氏梅", "Miley"], ["阮氏金銀", "Kim"], ["梁氏瓊英", "Monica"], ["阮芳青", "Sophia"], ["銅芳英", "Emily"], ["潘青梅", "Zoe"], ["阮冰心", "Eden"], ["團氏垂玲", "Lyn"], ["範氏秋芳", "Jolie"], ["李錦森", "Eric Lee"], ["陶氏紅絨", "Rosa"], ["範氏耀玲", "Kara"], ["範梅英", "Elena"], ["阮氏嬌英", "Olivia"], ["鄧氏瓊英", "Finn"], ["陳氏尊庄", "Emma"], ["阮氏雲英", "Evelyn"], ["羅氏黎", "Lucie"], ["杜氏翠恆", "Josie"], ["阮倕莊", "Ivy"], ["銅氏芳", "Jay"], ["阮氏美萍", "Irene"], ["阮瓊灣", "Jenny"], ["潘瓊莊", "Jessi"], ["範倕蓉", "Claire"], ["鄧進東", "Felix"], ["楊梅淵", "Linda"], ["裴熟兒", "Hanah"], ["阮氏平原", "Min"], ["吳氏芳草", "Julie"], ["范氏泰安", "Annie"], ["銅秋芳", "Sophie"], ["團氏俄", "Alice"], ["陳瓊英", "Stella"], ["阮玉英", "Reen"], ["阮懷英", "Stacy"]
    ])
  };


  const salesLeadIndex = [
    { office: "業務一處", directoryId: "sales-1-a", department: "業務一處 / A部", localName: "廖映瑜", name: "Ivy Liao", title: "A部（BR/UA/ATH/GS/GO/IPSS）部 lead" },
    { office: "業務一處", directoryId: "sales-1-a-prod", department: "業務一處 / A部 / Production", localName: "林美珠", name: "Doreen Lin", title: "A部 Production lead" },
    { office: "業務一處", directoryId: "sales-1-b", department: "業務一處 / B部", localName: "許惠雯", name: "Erica Hsu", title: "B部（GAP/GO Knits）部 lead" },
    { office: "業務一處", directoryId: "sales-1-b-dev", department: "業務一處 / B部 / Development", localName: "陳奕心", name: "Demi Chen", title: "B部 Development（一處新客戶開發/GS LOGO male）lead" },
    { office: "業務一處", directoryId: "sales-1-b-dev", department: "業務一處 / B部 / Development", localName: "張雅雯", name: "Carol Chang", title: "B部 Development（GO LOGO/GS LOGO female/KIDS FR/ROSS）lead" },
    { office: "業務一處", directoryId: "sales-1-b-prod", department: "業務一處 / B部 / Production", localName: "許惠雯", name: "Erica Hsu", title: "B部 Production（GS LOGO adult）lead（兼）" },
    { office: "業務一處", directoryId: "sales-1-b-prod", department: "業務一處 / B部 / Production", localName: "趙芳儀", name: "Daphne Chao", title: "B部 Production（GO LOGO/KIDS FR/ROSS）lead" },
    { office: "業務一處", directoryId: "sales-1-purchasing", department: "業務一處 / 採購課", localName: "張兆渝", name: "Ellen Chang", title: "採購課部 lead" },
    { office: "業務一處", directoryId: "sales-1-project", department: "業務一處 / 專案整合", localName: "廖映瑜", name: "Ivy Liao", title: "專案整合（兼）" },

    { office: "業務二處", directoryId: "sales-2-a", department: "業務二處 / A部", localName: "劉雅如", name: "Tania Liu", title: "A部（DKS-Calia/VRST + Sanmar）統籌" },
    { office: "業務二處", directoryId: "sales-2-a-dks-dev", department: "業務二處 / A部 / DKS-Calia/VRST Development", localName: "王彥慈", name: "Jessica Wang", title: "A部 DKS-Calia/VRST + Sanmar Development lead" },
    { office: "業務二處", directoryId: "sales-2-a-dks-prod-buy", department: "業務二處 / A部 / DKS-Calia/VRST Production/採購", localName: "盧昭如", name: "Angel Lu", title: "A部 DKS-Calia/VRST Production/採購 lead" },
    { office: "業務二處", directoryId: "sales-2-b", department: "業務二處 / B部", localName: "許貿昇", name: "Vince Hsu", title: "B部（DKS-DSG/PG/AP/Golf）統籌" },
    { office: "業務二處", directoryId: "sales-2-b-dev", department: "業務二處 / B部 / Development", localName: "王慧琦", name: "Michelle Wang", title: "B部 DSG/PG/AP Development lead" },
    { office: "業務二處", directoryId: "sales-2-b-prod-buy", department: "業務二處 / B部 / Production/採購", localName: "吳卓芝", name: "Julia Wu", title: "B部 DSG/PG/AP Production lead" },
    { office: "業務二處", directoryId: "sales-2-b-dev", department: "業務二處 / B部 / Development", localName: "蕭于傑", name: "Jeffrey Hsiao", title: "B部 DSG/PG/AP Fabric lead" },
    { office: "業務二處", directoryId: "sales-2-b-dev", department: "業務二處 / B部 / Development", localName: "李沛瑄", name: "Lorrita Li", title: "B部 Golf Development lead" },
    { office: "業務二處", directoryId: "sales-2-b-prod-buy", department: "業務二處 / B部 / Production/採購", localName: "林怡嫺", name: "Lisa Lin", title: "B部 Golf Production lead" },

    { office: "業務三處", directoryId: "sales-3-a", department: "業務三處 / A部", localName: "李錦森", name: "Eric Lee", title: "A部（NET + TOMS/Joe Fresh）資深經理" },
    { office: "業務三處", directoryId: "sales-3-b", department: "業務三處 / B部", localName: "袁怡茹", name: "Jasmine Yuan", title: "B部 HLF/ACS-EU/A&F 統籌" },
    { office: "業務三處", directoryId: "sales-3-b-hlf", department: "業務三處 / B部 / HLF-ACS-EU-A&F", localName: "莊雅雯", name: "Brenda Chuang", title: "B部 HLF/ACS-EU/A&F Production lead" },
    { office: "業務三處", directoryId: "sales-3-b-wmt", department: "業務三處 / B部 / WMT-Zara-Quince-Gildan-新客戶", localName: "吳承隽", name: "Scott Wu", title: "B部 WMT/Zara/Quince/Gildan/新客戶 Development lead" },
    { office: "業務三處", directoryId: "sales-3-b-wmt", department: "業務三處 / B部 / WMT-Zara-Quince-Gildan-新客戶", localName: "吳巧思", name: "Joyce Wu", title: "B部 WMT等 Production lead" },
    { office: "業務三處", directoryId: "sales-3-c", department: "業務三處 / C部", localName: "游蓓玟", name: "Masaki Yu", title: "C部（KOH）資深經理" },
    { office: "業務三處", directoryId: "sales-3-purchasing-acc", department: "業務三處 / 採購課 / 副料", localName: "林惠儀", name: "Lois Lin", title: "採購課 副料 lead" },
    { office: "業務三處", directoryId: "sales-3-purchasing-fab", department: "業務三處 / 採購課 / 主料", localName: "陳玉書", name: "Susan Chen", title: "採購課 主料 lead" },

    { office: "業務五處", directoryId: "sales-5-a", department: "業務五處 / A部", localName: "陳婉華", name: "Flora Chen", title: "A部（TGT Performance）資深經理" },
    { office: "業務五處", directoryId: "sales-5-a-prod", department: "業務五處 / A部 / Production", localName: "王湘洳", name: "Chloe Wang", title: "A部 Production lead（C部本職兼 A）" },
    { office: "業務五處", directoryId: "sales-5-a-prod", department: "業務五處 / A部 / Production", localName: "王聖雄", name: "Alan Wang", title: "A部 Production lead" },
    { office: "業務五處", directoryId: "sales-5-b", department: "業務五處 / B部", localName: "林雪芬", name: "Stephanie Lin", title: "B+C部 資深經理" },
    { office: "業務五處", directoryId: "sales-5-b-prod", department: "業務五處 / B部 / Production", localName: "蔡瑜惠", name: "Kelly Tsai", title: "B部（Underwear）Production lead（兼 C部 GAP_TSD）" },
    { office: "業務五處", directoryId: "sales-5-b-dev", department: "業務五處 / B部 / Development", localName: "林祐竹", name: "June Lin", title: "B/C 部 Development lead" },
    { office: "業務五處", directoryId: "sales-5-c-gap-dev", department: "業務五處 / C部 / GAP_TSD Development", localName: "賴若琦", name: "Cerita Lai", title: "C部 GAP_TSD Development lead" },

    { office: "業務六處", directoryId: "sales-6-hq", department: "業務六處 / 處本部", localName: "陳麗玲", name: "Joyce Chen", title: "處本部資深經理（兼 C部）" },
    { office: "業務六處", directoryId: "sales-6-a", department: "業務六處 / A部", localName: "賴姵妘", name: "Stephy Lai", title: "A部 資深經理", change: "2026/05 變更：先前由陳麗玲統籌" },
    { office: "業務六處", directoryId: "sales-6-a-prod", department: "業務六處 / A部 / Production", localName: "黃世旻", name: "Rene Huang", title: "A部 Production lead" },
    { office: "業務六處", directoryId: "sales-6-b-dev", department: "業務六處 / B部 / Development", localName: "陳昀昀", name: "Sofia Chen", title: "B部 Development（23/33）lead" },
    { office: "業務六處", directoryId: "sales-6-b-dev", department: "業務六處 / B部 / Development", localName: "邱郁婷", name: "Olga Ciou", title: "B部 Development（24/27/32/34/37/KIDS）lead" },
    { office: "業務六處", directoryId: "sales-6-b-prod", department: "業務六處 / B部 / Production", localName: "鄭佩文", name: "Peggy Cheng", title: "B部 Production lead" },
    { office: "業務六處", directoryId: "sales-6-b-prod", department: "業務六處 / B部 / Production", localName: "朱思盈", name: "Francis Chu", title: "B部 Production（24/34/37 + 27/32/KIDS）sub-lead" },
    { office: "業務六處", directoryId: "sales-6-expat", department: "業務六處 / C部 / 派駐業務組", localName: "詹培志", name: "Robert Chan", title: "C部 派駐業務組主管", change: "2026/05 變更：從 top-level 降至 C 部底下" },
    { office: "業務六處", directoryId: "sales-6-procurement-fabric", department: "業務六處 / C部 / 採購組 / Fabric", localName: "陳西圳", name: "Bill Chen", title: "C部 採購組 Fabric lead" },
    { office: "業務六處", directoryId: "sales-6-procurement-accessories", department: "業務六處 / C部 / 採購組 / Accessories", localName: "楊馥如", name: "Queenie Yang", title: "C部 採購組 Accessories lead" },

    { office: "業務七處", directoryId: "sales-7-a", department: "業務七處 / A部", localName: "陳雯婷", name: "Wendy Chen", title: "A部（IPS）head", change: "2026/05 變更：先前是 B 部 Dev" },
    { office: "業務七處", directoryId: "sales-7-a-dev", department: "業務七處 / A部 / Development", localName: "林怡均", name: "Hazel Lin", title: "A部 Powersoft/Cloudcomfy Development lead" },
    { office: "業務七處", directoryId: "sales-7-a-dev", department: "業務七處 / A部 / Development", localName: "吳欣穎", name: "Cindy Wu", title: "A部 Studiosmooth/Sleektech Development lead" },
    { office: "業務七處", directoryId: "sales-7-a-prod", department: "業務七處 / A部 / Production", localName: "石瑞珺", name: "Sherry Shih", title: "A部 Production（Powersoft/Cloudcomfy/MAC/BAC）lead" },
    { office: "業務七處", directoryId: "sales-7-a-prod", department: "業務七處 / A部 / Production", localName: "王嘉鈺", name: "Alisa Wang", title: "A部 Production（Studiosmooth/Sleektech/GAC/VMI）lead" },
    { office: "業務七處", directoryId: "sales-7-b", department: "業務七處 / B部", localName: "林莉詩", name: "Melody Lin", title: "B部（SWIM/FLEECE/FR + Beyond Yoga）head", change: "2026/05 變更" },
    { office: "業務七處", directoryId: "sales-7-b-swim-dev", department: "業務七處 / B部 / SWIM-FLEECE-FR Development", localName: "楊蕾", name: "Carolina Yang", title: "B部 SWIM/FLEECE/FR Development lead" },
    { office: "業務七處", directoryId: "sales-7-b-swim-prod", department: "業務七處 / B部 / SWIM-FLEECE-FR Production", localName: "謝宜君", name: "Eva Hsieh", title: "B部 SWIM/FLEECE/FR Production lead；VD/PQA for ON 對口" },
    { office: "業務七處", directoryId: "sales-7-c", department: "業務七處 / C課", localName: "高逸鈴", name: "Ling Kao", title: "C課（TSD/WKN/KNIT TOP + LEVIS）head", change: "2026/05 變更：先前是林佳昀兼" },
    { office: "業務七處", directoryId: "sales-7-c-prod", department: "業務七處 / C課 / Production", localName: "陳冠儒", name: "Dustin Chen", title: "C課 Production lead" },
    { office: "業務七處", directoryId: "sales-7-purchasing", department: "業務七處 / 採購部", localName: "楊之槿", name: "Tina Yang", title: "採購部 head", change: "2026/05 變更：先前廖虹雅，廖實為 5/27 報到新人" },
    { office: "業務七處", directoryId: "sales-7-special", department: "業務七處 / 特殊角色", localName: "翟君宜", name: "Emily Chak", title: "VMI/RnR/CA 專案" }
  ];

  GAME_DATA.salesLeadIndex = salesLeadIndex.map((lead) => ({ ...lead }));
  salesLeadIndex.forEach((lead) => {
    const personId = ensurePerson(lead.localName, lead.name, lead.department);
    const person = [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])].find((member) => member.id === personId);
    if (person) {
      person.name = lead.name || person.name;
      person.department = lead.department;
      person.leadAssignments = person.leadAssignments || [];
      if (!person.leadAssignments.some((item) => item.title === lead.title && item.department === lead.department)) {
        person.leadAssignments.push({ office: lead.office, department: lead.department, title: lead.title, change: lead.change });
      }
      person.role = person.leadAssignments.map((item) => item.title).join("；");
      if (lead.change) person.leadChange = lead.change;
    }
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === lead.directoryId);
    if (directory) {
      directory.leads = directory.leads || [];
      if (!directory.leads.some((item) => item.localName === lead.localName && item.title === lead.title)) {
        directory.leads.push({ localName: lead.localName, name: lead.name, title: lead.title, change: lead.change });
      }
    }
  });
  Object.entries(directoryMembers).forEach(([id, members]) => {
    const directory = GAME_DATA.orgDirectory.find((item) => item.id === id);
    if (!directory) return;
    directory.members = [...new Set(members)];
  });
})();

