const GAME_DATA = {
  missions: [
    {
      title: "把 AI Roadmap 變成可行動策略",
      copy: "在第 6 回合前讓洞察、執行、人格、組織都達到 8，並控制 Drift 壓力低於 12。"
    },
    {
      title: "建立 Portal:M 的戰情室",
      copy: "收集品牌情報、客戶訊號、高管動態與行動建議，讓每張牌都回答 so what。"
    },
    {
      title: "做出 Elly 會想看的晨報",
      copy: "整合多來源資訊，用精準、簡潔、有立場的語氣輸出，不照系統流水帳。"
    }
  ],
  personas: [
    {
      threshold: 0,
      name: "尚未校準",
      desc: "代理還沒有 Elly 的語氣，也還不理解 Makalot 的組織脈絡。"
    },
    {
      threshold: 5,
      name: "資深專業秘書",
      desc: "能交叉比對來源、抓出今日重點，語氣簡潔而不客套。"
    },
    {
      threshold: 10,
      name: "品牌情報分析師",
      desc: "懂 Portal:M 的品牌語境，能把貼文、受眾、競品與建議行動串起來。"
    },
    {
      threshold: 15,
      name: "內部策略顧問",
      desc: "同時理解時尚供應鏈、Gen AI 落地與 Makalot / StyTrix / Portal:M 戰略位置。"
    }
  ],
  cards: [
    {
      name: "Makalot Core",
      type: "組織",
      source: "client-ai-roadmap",
      quote: "台灣上市成衣代工集團",
      text: "把聚陽定位為時尚供應鏈裡能承接品牌 AI 需求的製造核心。",
      clarity: 1,
      reliability: 1,
      persona: 0,
      context: 4,
      drift: -1
    },
    {
      name: "Portal:M HUB",
      type: "產品",
      source: "brand-intel-strategy",
      quote: "品牌-供應商協作平台",
      text: "把品牌訊號轉成供應商協作機會，強化組織連結。",
      clarity: 1,
      reliability: 2,
      persona: 0,
      context: 3,
      drift: -1
    },
    {
      name: "StyTrix",
      type: "產品",
      source: "client-ai-roadmap",
      quote: "AI 時尚設計平台",
      text: "用 Concept Creator、Mix & Match、Photoshooting、Image to Sketch 打開設計端機會。",
      clarity: 2,
      reliability: 1,
      persona: 1,
      context: 2,
      drift: 0
    },
    {
      name: "Techpack Creation",
      type: "產品",
      source: "client-ai-roadmap",
      quote: "AI 驅動的 techpack 自動生成",
      text: "把設計和生產之間最磨人的文件流程變成可複製能力。",
      clarity: 1,
      reliability: 3,
      persona: 0,
      context: 2,
      drift: -1
    },
    {
      name: "Construction DB",
      type: "架構",
      source: "client-ai-roadmap",
      quote: "五階層工時系統",
      text: "將做工資料系統化，讓策略不是停在概念，而是能落到工序。",
      clarity: 1,
      reliability: 4,
      persona: 0,
      context: 1,
      drift: -1
    },
    {
      name: "VivaTech 2026",
      type: "節點",
      source: "client-ai-roadmap",
      quote: "巴黎 VivaTech 展示 StyTrix",
      text: "建立外部展示壓力與敘事目標，讓 Roadmap 有時間感。",
      clarity: 2,
      reliability: 0,
      persona: 1,
      context: 2,
      drift: 1
    },
    {
      name: "台發案",
      type: "節點",
      source: "client-ai-roadmap",
      quote: "與台科大合作的政府科研專案",
      text: "把科研合作放進組織資源盤點，增加長期技術可信度。",
      clarity: 0,
      reliability: 2,
      persona: 0,
      context: 3,
      drift: 0
    },
    {
      name: "DB2 高管情報",
      type: "資料源",
      source: "brand-intel-strategy",
      quote: "高管貼文 & 新聞情報",
      text: "讀取高管貼文與新聞，找出品牌意圖與接觸窗口。",
      clarity: 2,
      reliability: 1,
      persona: 0,
      context: 2,
      drift: 0
    },
    {
      name: "DB3 品牌動態",
      type: "資料源",
      source: "brand-intel-strategy",
      quote: "品牌 AI 動態情報庫",
      text: "追蹤品牌 AI 行動，把市場變化轉成聚陽的機會與風險。",
      clarity: 2,
      reliability: 1,
      persona: 0,
      context: 2,
      drift: 0
    },
    {
      name: "AI Journey Radar",
      type: "分析",
      source: "brand-intel-strategy",
      quote: "探索期 / 試點期 / 規模化 / 自建中",
      text: "判斷客戶在哪個 AI adoption 階段，避免把所有訊號混成同一件事。",
      clarity: 4,
      reliability: 1,
      persona: 0,
      context: 1,
      drift: -1
    },
    {
      name: "Opportunity Window",
      type: "分析",
      source: "client-ai-roadmap",
      quote: "哪個品牌 × 哪個環節 × 哪個產品",
      text: "把機會具體到品牌、痛點、產品與時間窗口。",
      clarity: 4,
      reliability: 0,
      persona: 1,
      context: 1,
      drift: -1
    },
    {
      name: "Threat Warning",
      type: "分析",
      source: "brand-intel-strategy",
      quote: "自建風險、競爭威脅",
      text: "標記品牌自建 AI 或競爭供應商動向，避免樂觀偏誤。",
      clarity: 3,
      reliability: 2,
      persona: 0,
      context: 0,
      drift: -1
    },
    {
      name: "So What",
      type: "人格",
      source: "client-ai-roadmap",
      quote: "對聚陽意味著什麼",
      text: "每段分析都必須落到意義與行動，不准停在摘要。",
      clarity: 3,
      reliability: 0,
      persona: 3,
      context: 0,
      drift: -1
    },
    {
      name: "Concise With Edge",
      type: "人格",
      source: "client-ai-roadmap",
      quote: "簡潔有力、有立場、不教條",
      text: "語氣要像策略備忘錄，不要像泛泛的 AI 報告。",
      clarity: 2,
      reliability: 0,
      persona: 4,
      context: 0,
      drift: 1
    },
    {
      name: "Senior Secretary Mode",
      type: "人格",
      source: "morning-digest",
      quote: "融滙貫通後整理滙報",
      text: "不按系統流水帳，而是交叉比對來源，抓出今天真正重要的事。",
      clarity: 2,
      reliability: 2,
      persona: 3,
      context: 0,
      drift: -1
    },
    {
      name: "No Empty Politeness",
      type: "人格",
      source: "morning-digest",
      quote: "不要客套開場",
      text: "開頭直接切入重點，結尾不加無意義祝福。",
      clarity: 2,
      reliability: 0,
      persona: 3,
      context: 0,
      drift: 0
    },
    {
      name: "Traditional Chinese",
      type: "規範",
      source: "morning-digest",
      quote: "絕不使用簡體中文",
      text: "繁體中文輸出，技術術語與人名保留英文。",
      clarity: 1,
      reliability: 3,
      persona: 1,
      context: 0,
      drift: -1
    },
    {
      name: "Uncertainty Honesty",
      type: "規範",
      source: "morning-digest",
      quote: "不確定的事直說不確定",
      text: "降低幻覺風險，也讓報告更像可信的內部幕僚。",
      clarity: 1,
      reliability: 4,
      persona: 1,
      context: 0,
      drift: -2
    },
    {
      name: "Actionable Executives",
      type: "行動",
      source: "client-ai-roadmap",
      quote: "建議主動接觸的高管",
      text: "把情報轉成下一步接觸名單與切入話題。",
      clarity: 2,
      reliability: 1,
      persona: 1,
      context: 2,
      drift: 0
    },
    {
      name: "Mobile-first Email",
      type: "執行",
      source: "brand-intel-strategy",
      quote: "適合在手機上閱讀",
      text: "輸出不只要漂亮，還要能被忙碌決策者快速掃讀。",
      clarity: 1,
      reliability: 3,
      persona: 1,
      context: 0,
      drift: -1
    }
  ]
};
