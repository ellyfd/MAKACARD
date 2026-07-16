// Behavioral intel distilled into game-ready role effects.
(function addPeopleIntelData() {
  GAME_DATA.distillations = GAME_DATA.distillations || {};
  GAME_DATA.peopleIntel = GAME_DATA.peopleIntel || {};

  const people = () => [...GAME_DATA.members, ...(GAME_DATA.orgPeople || [])];
  const hasValue = (value) => value && value !== "待補";

  function matches(member, key) {
    return member.id === key || member.localName === key || member.name === key;
  }

  function patch(keys, patchData) {
    people().forEach((member) => {
      if (!keys.some((key) => matches(member, key))) return;
      Object.assign(member, patchData);
    });
  }

  function distill(keys, profile) {
    people().forEach((member) => {
      if (!keys.some((key) => matches(member, key))) return;
      GAME_DATA.distillations[member.id] = { source: "people-intel 2026/06-07", ...profile };
    });
  }

  function addMission(mission) {
    if (GAME_DATA.orgMissions.some((item) => item.id === mission.id)) return;
    GAME_DATA.orgMissions.push(mission);
  }

  [
    {
      keys: ["alex", "周心鵬", "Alex Chou"],
      patch: {
        style: "高層決策與客戶視角優先；最有效的輸入是可看的實體、極短大標、明確取捨，不適合先丟厚細節。",
        gameMove: "Prototype Oracle：先做一個能看的版本，他的否定會反推真正方向。",
        riskTell: "Dense text、太多選項或只講內部流程會讓判斷失焦。"
      },
      profile: {
        mode: "高層需求源與不確定源，需用實體與大標收斂。",
        trigger: "看到 prototype、demo 或一頁式高層 narrative 後，決策訊號會變清楚。",
        limiter: "口頭描述容易跳躍；細節太密會失去客戶視角。",
        assignment: "最終方向判斷、客戶價值主張、跨群資源取捨。",
        leverage: "能把題目拉到公司級 strategy 與客戶價值。",
        risk: "若未先轉成可視化版本，團隊會在猜測中反覆改稿。",
        aiFit: 3
      }
    },
    {
      keys: ["翟君宜", "Emily Chak", "emily-chak"],
      patch: {
        style: "分析型、情緒穩定、能翻譯 Alex 意圖；適合放在高層訊號與專案執行之間。",
        gameMove: "Signal Translator：把高層否定翻成下一版可行方向。",
        riskTell: "她說不確定通常是在保留討論空間，不代表沒有判斷。"
      },
      profile: {
        mode: "高層訊號翻譯者，分析穩、邊界清楚。",
        trigger: "給她一個分析型問題或高層反應，她能拆出背後原因與下一步。",
        limiter: "若只丟純執行任務，會浪費她的判斷力。",
        assignment: "高層來訪 prep、Alex 意圖翻譯、專案訊號校準。",
        leverage: "能在情緒場裡保持旁觀，將否定轉成可修改方向。",
        risk: "週末與非工作時間需尊重邊界，否則 Trust 下降。",
        aiFit: 3
      }
    },
    {
      keys: ["celia-hsu", "許佳瑛", "Celia Hsu"],
      patch: {
        style: "診斷型主管，先問結構再定行動；適合處理 TD、客戶規範、escalation 與責任邊界。",
        gameMove: "Escalation Coach：把甩鍋風險改成正式信件、主管對主管、責任歸屬。",
        riskTell: "不要餵她半生不熟的抱怨，要先整理成已往前推一層的判斷。"
      },
      profile: {
        mode: "診斷型提問者，擅長把責任邊界和升級路徑釐清。",
        trigger: "收到已整理過的事實、客戶規範與待決策點時最有效。",
        limiter: "若問題停在情緒或現象，會先拉回結構。",
        assignment: "TD/3D/escalation gate、客戶爛決定回推、正式對口保護。",
        leverage: "能替團隊背書，並把對話升級到正確主管層。",
        risk: "資料主要來自特定會議場景，資源分配與人事衝突資料仍薄。",
        aiFit: 3
      }
    },
    {
      keys: ["douglas-lu", "呂少傑", "Douglas Lu"],
      patch: {
        style: "設計端客戶對口，能理解 AI 輔助設計與 beta 需求；需求可能片段化，需產品線協助收斂。",
        gameMove: "Design Demand Radar：快速抓到 PD/MD 想試的功能與展示切口。",
        riskTell: "功能點太散時，要用 roadmap 和驗證目標收斂。"
      },
      profile: {
        mode: "設計端需求雷達，懂應用但需產品化收斂。",
        trigger: "看到具體 UX、Frame/Canvas 類互動與設計端價值時會給出有效回饋。",
        limiter: "容易從單點功能出發，模型層與技術深水區需搭配專家。",
        assignment: "StyTrix beta、PD/MD 客戶對口、商品開發與材質敘事。",
        leverage: "能把客戶設計端語言帶回內部產品驗證。",
        risk: "若沒有產品 owner 收束，功能需求會碎片化。",
        aiFit: 4
      }
    },
    {
      keys: ["mandy-chen", "陳瑋今", "Mandy Chen"],
      patch: {
        style: "業務七處主管，ON VD/PQA 與來訪 prep 的情報整合角色；適合跨帳戶協調與高層接待準備。",
        gameMove: "Visit Commander：把客戶來訪拆成 agenda、角色、說法與風險清單。",
        riskTell: "ON 業務本體與 VD/PQA 面向不可混為同一條線。"
      },
      profile: {
        mode: "來訪準備與情報整合者。",
        trigger: "有明確客戶來訪、agenda、內部角色分工時能快速成局。",
        limiter: "若把 ON 業務/開發本體與 VD/PQA 混在一起，會造成對口錯位。",
        assignment: "GAP/ON 來訪 prep、高層接待分工、跨帳戶訊息整合。",
        leverage: "能把分散郵件與逐字稿訊號整理成可執行 agenda。",
        risk: "需要正式 org 對口確認，避免暱稱或情境標籤誤導。",
        aiFit: 2
      }
    },
    {
      keys: ["brian-lin", "林欣煇", "Brian Lin"],
      patch: {
        style: "AI 種子計畫主推者，推動力強；涉及系統事實時需要文件佐證，避免憑印象代言。",
        gameMove: "Seed Builder：把 AI 倡議變成 step-by-step 建置節奏。",
        riskTell: "口頭說有做過不等於範圍相同，Techpack 類題目必須要求 evidence chain。"
      },
      profile: {
        mode: "AI 種子計畫推動者，制度化動能強但需證據護欄。",
        trigger: "公司級授權、明確種子名單、工具建置節奏。",
        limiter: "系統細節與歸屬容易憑印象代言，需要文件與 owner 佐證。",
        assignment: "AI 種子推進、工務管理資訊、跨單位導入節奏。",
        leverage: "能把變革倡議轉成可跑的節奏與訓練場。",
        risk: "在 Alex 或高層場域過度篤定會放大錯誤歸因。",
        aiFit: 4
      }
    },
    {
      keys: ["jeff-yang-楊璿融", "楊璿融", "Jeff Yang"],
      patch: {
        style: "數轉部代理與現代化工程接口；對不熟的系統會保留，不裝懂，適合釐清 API、圖像辨識與平台邊界。",
        gameMove: "Boundary Witness：把『我理解是』和『事實是』分開，降低錯誤承諾。",
        riskTell: "若被迫替歷史系統背書，需要同步找原 owner 或文件。"
      },
      profile: {
        mode: "技術邊界見證者，誠實但需資料源補位。",
        trigger: "被要求釐清資料平台、API、圖像辨識、系統現代化邊界時。",
        limiter: "對歷史系統不一定熟，不能單點當唯一真相源。",
        assignment: "API/MCP/數轉接口、L1-L3 圖像辨識與現代化工程邊界。",
        leverage: "不裝懂，能保留不確定並避免錯誤承諾。",
        risk: "若沒有 Judy/Kisa/原 owner 補證，會停在理解層。",
        aiFit: 4
      }
    },
    {
      keys: ["lilly-cheng-鄭俐俐", "鄭俐俐", "Lilly Cheng"],
      patch: {
        style: "策管部盤點型角色，正式會議可沉默觀察，會後逐層追問收斂真相與 follow-up。",
        gameMove: "After-Meeting Interrogator：不在大場掀桌，會後把 owner、範圍、事實追到清楚。",
        riskTell: "她適合收斂複雜真相，不適合拿來做場面上的即興背書。"
      },
      profile: {
        mode: "會後盤點者，擅長把混亂敘事收斂成真相地圖。",
        trigger: "會議中資訊互相矛盾、owner 不清、需要私下追問時。",
        limiter: "若只要求她在大場即時表態，效果會下降。",
        assignment: "Techpack 解析範圍釐清、跨部門 follow-up、AI/流程盤點。",
        leverage: "能管理情緒、停錄音、擋錯怪，同時把待辦接住。",
        risk: "需要後續資料回收，否則只得到初步判斷。",
        aiFit: 3
      }
    },
    {
      keys: ["judy-lee-李宛真", "李宛真", "Judy Lee"],
      patch: {
        style: "Techpack BOM 與訂單基本資料解析的實際執行者；不是 POM/做工完整結構化 owner。",
        gameMove: "Actual Operator：確認『真的誰在做』，避免名義 owner 誤導。",
        riskTell: "不能把 BOM 解析直接等同 POM/做工結構化。"
      },
      profile: {
        mode: "Techpack 解析實際執行者，範圍需精準界定。",
        trigger: "需要確認 BOM、訂單基本資料解析現況時。",
        limiter: "POM 與做工結構化不在現有範圍內。",
        assignment: "Techpack BOM/訂單基本資料解析事實確認。",
        leverage: "能提供真正執行層資料，而不是名義流程。",
        risk: "若沒有範圍標註，會被誤認成全 techpack 解析完成。",
        aiFit: 4
      }
    },
    {
      keys: ["kisa-lin-林嘉慧", "林嘉慧", "Kisa Lin"],
      patch: {
        style: "翻譯平台 owner，掌握 POM/做工翻譯資料；資料若缺款號與前後端 mapping，價值會卡住。",
        gameMove: "Translation Vault：把已有翻譯資產找出來，再判斷補 mapping 或重做。",
        riskTell: "有資料不等於可用資料，需檢查款號、mapping、database 接口。"
      },
      profile: {
        mode: "翻譯資產持有者，資料價值取決於 mapping。",
        trigger: "需要回收 POM/做工翻譯資料、評估重用成本時。",
        limiter: "若缺款號與前後端 mapping，資料無法直接進 techpack database。",
        assignment: "翻譯資料回收、AI 檢驗文字、POM/做工翻譯線索。",
        leverage: "已有資料可回收，可能比重做便宜。",
        risk: "資料存在但不可用，容易造成完成度錯覺。",
        aiFit: 4
      }
    },
    {
      keys: ["alice-chiu-邱瀞儀", "邱瀞儀", "Alice Chiu"],
      patch: {
        style: "守 IE 專業與 pilot 範圍的人，適合把技術驗證收斂到明確款式與流程。",
        gameMove: "Pilot Scope Lock：把發散題收斂到可驗證品類。",
        riskTell: "不要用 AI 題目稀釋 IE 的現場專業。"
      },
      profile: {
        mode: "IE 專業守門與 pilot 收斂者。",
        trigger: "需要把 AI/圖像辨識 pilot 收斂到實際款式與 IE 流程時。",
        limiter: "若討論漂到抽象平台願景，會回到現場專業與可驗證範圍。",
        assignment: "Old Navy pants pilot、IE 介面權益、流程驗證。",
        leverage: "能守住現場專業，避免 pilot 變成空泛展示。",
        risk: "若不給明確驗證範圍，會增加跨部門摩擦。",
        aiFit: 3
      }
    },
    {
      keys: ["anne-hu", "胡怡靜", "Anne Hu"],
      patch: {
        style: "工務處主管，會守團隊介面與 option 可追溯性；適合在工務/IE/品質議題中保護現場接口。",
        gameMove: "Interface Shield：先確認工務團隊不被錯接、資料流可追溯。",
        riskTell: "跨系統對接若沒有 option trace，後續責任會失真。"
      },
      profile: {
        mode: "工務介面守門者。",
        trigger: "工務、IE、品質或 MTM 對接需要保護團隊介面時。",
        limiter: "資料若無法追溯，會回到接口與責任問題。",
        assignment: "工務處介面權益、品質/IE 對接、option trace。",
        leverage: "能保護工務團隊免於錯接和責任漂移。",
        risk: "若太晚進場，系統/流程可能已形成不可逆錯接。",
        aiFit: 2
      }
    },
    {
      keys: ["sylvia-chou", "周育君", "Sylvia Chou"],
      patch: {
        style: "估碼中心副理，有把 9000 格 Excel、2D 搜尋與 KPI 報表轉成工具的能力；資料仍偏單場。",
        gameMove: "Excel Forge：把痛點鍛造成可跑的工具。",
        riskTell: "目前側寫只來自 AI 分享切面，不能過度外推。"
      },
      profile: {
        mode: "工具化實作者，能把痛點變成 Excel/搜尋/KPI 系統。",
        trigger: "有明確痛點與可自動化資料欄位時。",
        limiter: "觀察資料仍薄，需更多主導情境補厚。",
        assignment: "估碼、2D 搜尋、KPI 報表與開發節點工具化。",
        leverage: "能把工作痛點做成可持續工具。",
        risk: "單場資料不足，不能直接推定完整管理風格。",
        aiFit: 4
      }
    },
    {
      keys: ["teresa-hsueh", "薛菀之", "Teresa Hsueh"],
      patch: {
        style: "樣品研發部資深經理，已知負責配版、開單吊卡、Teams/郵件 To-do 協調；目前資料薄。",
        gameMove: "Sample Queue Keeper：把樣品、配版、吊卡與待辦接成節點。",
        riskTell: "曝光低不代表份量低，需更多她主導的會議資料。"
      },
      profile: {
        mode: "樣品研發節點協調者，資料仍待補厚。",
        trigger: "需要串樣品、配版、開單吊卡與 Teams/郵件待辦時。",
        limiter: "目前缺少她主導場景，不能做過度側寫。",
        assignment: "樣品研發部節點管理、配版與開單協調。",
        leverage: "能把樣品相關待辦集中整理。",
        risk: "資料極薄，遊戲中應視為低情報確定度牌。",
        aiFit: 2
      }
    }
  ].forEach((entry) => {
    patch(entry.keys, entry.patch);
    distill(entry.keys, entry.profile);
  });

  addMission({
    id: "gap-exec-visit",
    name: "GAP Executive Visit Prep",
    prompt: "GAP/ATH 高層來訪前，agenda、展示、客戶訊息與內部分工必須在短時間內定版；玩家要把高層 narrative、產品 demo、業務帳戶與技術回應接成一條線。",
    goal: "定版高層簡報主軸、demo 範圍、客戶機會點與現場回應角色。",
    jobNeeds: ["apparel-dev-sales", "technical-designer", "engineering-project-specialist"],
    pressure: { trust: 39, clarity: 28, momentum: 42, friction: 45 },
    weights: { clarity: 1.3, context: 1.25, speed: 1.15, warmth: 1.05, data: .9, risk: .9 }
  });

  addMission({
    id: "techpack-truth-map",
    name: "Techpack Truth Map",
    prompt: "Techpack 解析被多個單位說『有做』，但 BOM、POM、做工、翻譯、圖像辨識其實是不同層。玩家要找出真正 owner、資料範圍與下一步回收策略。",
    goal: "釐清 BOM/POM/做工/圖像辨識邊界，指定 owner，決定補 mapping 或重做。",
    jobNeeds: ["engineering-project-specialist", "technical-designer", "ie-engineer"],
    pressure: { trust: 34, clarity: 22, momentum: 36, friction: 55 },
    weights: { data: 1.45, clarity: 1.35, risk: 1.2, context: 1.15, speed: .85, warmth: .8 }
  });

  addMission({
    id: "ai-seed-rollout",
    name: "AI Seed Rollout",
    prompt: "AI 種子計畫已啟動，但各單位理解、工具環境、資料權限與三個月成果期待不同。玩家要把倡議變成可追蹤的落地節奏。",
    goal: "定義種子名單、工具環境、資料邊界、三個月成果與回報節奏。",
    jobNeeds: ["hrd-specialist", "engineering-project-specialist", "technical-designer"],
    pressure: { trust: 42, clarity: 30, momentum: 41, friction: 40 },
    weights: { context: 1.3, clarity: 1.25, data: 1.15, speed: 1, risk: 1, warmth: 1 }
  });
})();
