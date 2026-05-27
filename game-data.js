const GAME_DATA = {
  orgUnits: [
    {
      id: "exec",
      name: "管理層",
      tagline: "方向、資源、取捨",
      capability: ["決策授權", "商業取捨", "跨單位優先級"],
      risk: "離現場太遠時，會把複雜問題壓成口號。",
      counters: ["scope", "authority", "tradeoff"],
      links: ["dpc", "digital-dev", "portal"]
    },
    {
      id: "dpc",
      name: "DPC / 數位服飾",
      tagline: "3D 內容、視覺驗證、樣衣數位化",
      capability: ["3D 產出", "視覺判斷", "跨地執行"],
      risk: "需求邊界不清時，會用很高執行力做出錯方向。",
      counters: ["demo", "visual", "fit"],
      links: ["material", "factory", "digital-dev"]
    },
    {
      id: "digital-dev",
      name: "數發 / 系統與 AI",
      tagline: "API、AI 流程、平台整合",
      capability: ["資料管線", "系統整合", "AI prototype"],
      risk: "如果 brief 不精準，會等規格或做出技術正確但業務錯位的版本。",
      counters: ["api", "data", "prototype"],
      links: ["dpc", "material", "portal"]
    },
    {
      id: "material",
      name: "數位布料",
      tagline: "布料標準、物性驗證、NunoX / Jack API",
      capability: ["布料標準", "物性資料", "驗證 gate"],
      risk: "知識鎖倉會讓整條工作線變成單點風險。",
      counters: ["standard", "fabric", "gate"],
      links: ["dpc", "digital-dev", "factory"]
    },
    {
      id: "portal",
      name: "Portal:M / GTM",
      tagline: "品牌情報、內容、外部觸達",
      capability: ["品牌洞察", "內容敘事", "feedback loop"],
      risk: "沒有真實產品或 demo 時，聲量無法轉成採用。",
      counters: ["market", "outreach", "feedback"],
      links: ["exec", "digital-dev", "dpc"]
    },
    {
      id: "factory",
      name: "工廠 / 供應鏈",
      tagline: "2D 定位、開布、實碼驗證",
      capability: ["2D 版型", "布廠溝通", "量產容差"],
      risk: "前端規格不清，錯誤會在全碼展開時被放大。",
      counters: ["2d", "production", "tolerance"],
      links: ["dpc", "material"]
    }
  ],
  members: [
    {
      id: "adia",
      name: "Adia",
      role: "專員",
      department: "DPC",
      birthday: "1991-10-28",
      numerology: 4,
      element: "金",
      zodiac: "天蠍座",
      archetype: "建設者",
      animal: "羊",
      star: "天相星",
      style: "重視穩定與交付，適合用清楚範圍和檢核點對齊。",
      distilled: { confidence: "中", turns: 54, traits: ["短句確認", "現場補位", "快速接話"] },
      vectors: { clarity: 82, context: 62, speed: 54, risk: 76, data: 72, warmth: 58 }
    },
    {
      id: "alan",
      name: "Alan",
      role: "專員",
      department: "數發",
      birthday: "1992-01-31",
      numerology: 8,
      element: "水",
      zodiac: "水瓶座",
      archetype: "成就者",
      animal: "猴",
      star: "天同星",
      style: "偏好有目標、有邊界的討論，能接受新方法但需要看到產出。",
      distilled: { confidence: "高", turns: 178, traits: ["進度核對", "工程交接", "問題回覆"] },
      vectors: { clarity: 76, context: 58, speed: 70, risk: 55, data: 68, warmth: 50 }
    },
    {
      id: "alex",
      name: "Alex",
      role: "CEO",
      department: "管理層",
      birthday: "1984-05-01",
      numerology: 1,
      element: "木",
      zodiac: "金牛座",
      archetype: "領導者",
      animal: "鼠",
      star: "天府星",
      style: "適合用願景、取捨與商業結果對話，避免陷入過細的執行枝節。",
      vectors: { clarity: 88, context: 70, speed: 68, risk: 72, data: 66, warmth: 52 }
    },
    {
      id: "andy",
      name: "Andy",
      role: "專員",
      department: "數發",
      birthday: "1996-11-01",
      numerology: 1,
      element: "火",
      zodiac: "天蠍座",
      archetype: "領導者",
      animal: "鼠",
      star: "七殺星",
      style: "推進感強，適合給明確目標和可立即動手的切入點。",
      vectors: { clarity: 74, context: 48, speed: 82, risk: 50, data: 60, warmth: 48 }
    },
    {
      id: "chieh",
      name: "Chieh",
      role: "專員",
      department: "DPC",
      birthday: "1990-03-24",
      numerology: 1,
      element: "土",
      zodiac: "牡羊座",
      archetype: "領導者",
      animal: "馬",
      star: "破軍星",
      style: "能快速開局，也容易被模糊需求消耗；最好把問題變成選項。",
      distilled: { confidence: "低", turns: 18, traits: ["進度回報", "先解眼前問題", "實作導向"] },
      vectors: { clarity: 80, context: 45, speed: 84, risk: 46, data: 56, warmth: 44 }
    },
    {
      id: "debbie",
      name: "Debbie",
      role: "專員",
      department: "DPC",
      birthday: "1985-04-01",
      numerology: 1,
      element: "木",
      zodiac: "牡羊座",
      archetype: "領導者",
      animal: "牛",
      star: "廉貞星",
      style: "適合直接講重點和預期成果，節奏拖太長會降低耐心。",
      vectors: { clarity: 78, context: 50, speed: 82, risk: 54, data: 58, warmth: 45 }
    },
    {
      id: "dianne",
      name: "Dianne",
      role: "專員",
      department: "Portal:M",
      birthday: "1993-03-18",
      numerology: 7,
      element: "水",
      zodiac: "雙魚座",
      archetype: "探索者",
      animal: "雞",
      star: "太陰星",
      style: "擅長感受脈絡和受眾反應，適合先對齊語氣再進入任務。",
      vectors: { clarity: 62, context: 84, speed: 52, risk: 64, data: 62, warmth: 78 }
    },
    {
      id: "doris",
      name: "Doris",
      role: "專員",
      department: "DPC",
      birthday: "1995-10-22",
      numerology: 11,
      element: "木",
      zodiac: "天秤座",
      archetype: "啟示者",
      animal: "豬",
      star: "天同星",
      style: "在協調和美感判斷上敏銳，適合用共識框架推進。",
      distilled: { confidence: "高", turns: 53, traits: ["deadline 意識", "流程協調", "友善收斂"] },
      vectors: { clarity: 64, context: 78, speed: 54, risk: 60, data: 58, warmth: 82 }
    },
    {
      id: "elly",
      name: "Elly",
      role: "主管",
      department: "數位產品創造處",
      birthday: "1983-04-27",
      numerology: 7,
      element: "木",
      zodiac: "金牛座",
      archetype: "探索者",
      animal: "豬",
      star: "武曲星",
      style: "偏好結論有立場、脈絡夠完整、能回答 so what 的討論。",
      distilled: { confidence: "高", turns: 779, traits: ["高頻提問", "脈絡整合", "行動收斂"] },
      vectors: { clarity: 86, context: 88, speed: 66, risk: 70, data: 78, warmth: 56 }
    },
    {
      id: "emily",
      name: "Emily",
      role: "專員",
      department: "DPC",
      birthday: "1994-04-29",
      numerology: 11,
      element: "木",
      zodiac: "金牛座",
      archetype: "啟示者",
      animal: "狗",
      star: "廉貞星",
      style: "重視品質與穩定判斷，適合用具體案例和明確標準溝通。",
      distilled: { confidence: "高", turns: 125, traits: ["品牌想像", "視覺語言", "教學轉譯"] },
      vectors: { clarity: 78, context: 66, speed: 52, risk: 74, data: 72, warmth: 62 }
    },
    {
      id: "jan",
      name: "Jan",
      role: "專員",
      department: "DPC",
      birthday: "1996-02-26",
      numerology: 8,
      element: "火",
      zodiac: "雙魚座",
      archetype: "成就者",
      animal: "鼠",
      star: "紫微星",
      style: "能把情緒感知轉成成果導向，適合先說目標再保留彈性。",
      distilled: { confidence: "低", turns: 12, traits: ["進度回報", "確認追問", "客戶回饋"] },
      vectors: { clarity: 72, context: 70, speed: 62, risk: 58, data: 62, warmth: 76 }
    },
    {
      id: "jean",
      name: "Jean",
      role: "專員",
      department: "DPC",
      birthday: "2002-05-21",
      numerology: 3,
      element: "水",
      zodiac: "雙子座",
      archetype: "表達者",
      animal: "馬",
      star: "七殺星",
      style: "反應快、點子多，適合用短迭代和可視化產物聚焦。",
      distilled: { confidence: "低", turns: 12, traits: ["執行回報", "版型比較", "做工調整"] },
      vectors: { clarity: 58, context: 56, speed: 86, risk: 42, data: 54, warmth: 66 }
    },
    {
      id: "karen",
      name: "Karen",
      role: "主管",
      department: "DPC",
      birthday: "1986-04-22",
      numerology: 5,
      element: "火",
      zodiac: "金牛座",
      archetype: "自由者",
      animal: "虎",
      star: "七殺星",
      style: "能快速判斷現場可不可行，適合用決策選項和風險交換溝通。",
      distilled: { confidence: "高", turns: 259, traits: ["現場判斷", "催動進度", "直接追問"] },
      vectors: { clarity: 82, context: 56, speed: 74, risk: 68, data: 62, warmth: 50 }
    },
    {
      id: "rock",
      name: "Rock",
      role: "專員",
      department: "數發",
      birthday: "1990-01-28",
      numerology: 3,
      element: "金",
      zodiac: "水瓶座",
      archetype: "表達者",
      animal: "馬",
      star: "天機星",
      style: "適合討論系統關係與替代方案，溝通時要給空間發散再收斂。",
      distilled: { confidence: "低", turns: 12, traits: ["支援補位", "工具操作", "流程整理"] },
      vectors: { clarity: 64, context: 66, speed: 76, risk: 50, data: 68, warmth: 60 }
    },
    {
      id: "rou",
      name: "ROU",
      role: "專員",
      department: "Portal:M",
      birthday: "1999-04-04",
      numerology: 9,
      element: "火",
      zodiac: "牡羊座",
      archetype: "人道者",
      animal: "兔",
      star: "貪狼星",
      style: "對人和內容氛圍敏銳，適合給舞台、方向和清楚的成功樣貌。",
      distilled: { confidence: "低", turns: 19, traits: ["內容跟催", "語氣回報", "社群節奏"] },
      vectors: { clarity: 66, context: 68, speed: 78, risk: 48, data: 54, warmth: 78 }
    },
    {
      id: "sixian",
      name: "Sixian",
      role: "專員",
      department: "DPC",
      birthday: "1990-05-02",
      numerology: 8,
      element: "金",
      zodiac: "金牛座",
      archetype: "成就者",
      animal: "馬",
      star: "太陰星",
      style: "穩定、務實、重視成果，適合用明確 deliverable 對齊。",
      distilled: { confidence: "低", turns: 15, traits: ["支援排程", "確認召集", "短句回覆"] },
      vectors: { clarity: 84, context: 60, speed: 58, risk: 78, data: 74, warmth: 56 }
    },
    {
      id: "tinley",
      name: "Tinley",
      role: "專員",
      department: "DPC",
      birthday: "1995-10-18",
      numerology: 7,
      element: "木",
      zodiac: "天秤座",
      archetype: "探索者",
      animal: "豬",
      star: "紫微星",
      style: "適合處理探索型議題，先給脈絡和判斷準則會更穩。",
      distilled: { confidence: "中", turns: 42, traits: ["詢問可行性", "風險感知", "彈性配合"] },
      vectors: { clarity: 68, context: 82, speed: 54, risk: 62, data: 66, warmth: 72 }
    },
    {
      id: "vanessa",
      name: "Vanessa",
      role: "主管",
      department: "DPC",
      birthday: "1984-12-25",
      numerology: 5,
      element: "木",
      zodiac: "摩羯座",
      archetype: "自由者",
      animal: "鼠",
      star: "巨門星",
      style: "擅長把自由度和現實限制拉在一起，適合討論優先級與資源取捨。",
      distilled: { confidence: "高", turns: 87, traits: ["脈絡說明", "目的重述", "跨方協調"] },
      vectors: { clarity: 84, context: 68, speed: 62, risk: 82, data: 70, warmth: 54 }
    },
    {
      id: "yoko",
      name: "Yoko",
      role: "專員",
      department: "DPC",
      birthday: "1989-07-30",
      numerology: 1,
      element: "金",
      zodiac: "獅子座",
      archetype: "領導者",
      animal: "蛇",
      star: "巨門星",
      style: "適合用明確主張和成果舞台溝通，避免只給零碎任務。",
      distilled: { confidence: "中", turns: 71, traits: ["款式進度", "資源需求", "變更回報"] },
      vectors: { clarity: 76, context: 54, speed: 76, risk: 58, data: 62, warmth: 62 }
    },
    {
      id: "yota",
      name: "Yota",
      role: "專員",
      department: "數發",
      birthday: "1999-04-02",
      numerology: 7,
      element: "土",
      zodiac: "牡羊座",
      archetype: "探索者",
      animal: "兔",
      star: "天府星",
      style: "適合做探索與落地之間的橋接，需要清楚問題和可試驗範圍。",
      distilled: { confidence: "中", turns: 38, traits: ["進度更新", "急件處理", "執行排程"] },
      vectors: { clarity: 72, context: 72, speed: 72, risk: 58, data: 72, warmth: 58 }
    },
    {
      id: "celia",
      name: "Celia",
      role: "專員",
      department: "DPC",
      birthday: "待補",
      style: "3D 周會出現的內部成員，先以低觀察資料補入，可在後續用生日與會議表現校準。",
      distilled: { confidence: "低", turns: 3, traits: ["3D 周會", "資料待補", "需觀察"] },
      vectors: { clarity: 62, context: 58, speed: 58, risk: 62, data: 58, warmth: 58 }
    },
    {
      id: "jessica",
      name: "Jessica",
      role: "專員",
      department: "Portal:M",
      birthday: "待補",
      style: "Workshop 與 GTM 情境中的內部協作角色，適合放在活動設計、受眾定位與收斂討論。",
      distilled: { confidence: "低", turns: 2, traits: ["workshop", "活動定位", "資料待補"] },
      vectors: { clarity: 68, context: 76, speed: 56, risk: 62, data: 60, warmth: 70 }
    },
    {
      id: "rosa",
      name: "Rosa",
      role: "專員",
      department: "Portal:M",
      birthday: "待補",
      style: "Workshop 情境中出現的內部角色，先作為品牌互動與內容支援卡。",
      distilled: { confidence: "低", turns: 1, traits: ["workshop", "內容支援", "資料待補"] },
      vectors: { clarity: 60, context: 74, speed: 58, risk: 56, data: 56, warmth: 76 }
    },
    {
      id: "ruochen",
      name: "Ruo Chen",
      role: "專員",
      department: "Portal:M",
      birthday: "待補",
      style: "與 ROU / 林芓葇不同人，先作為 Workshop project 互動與需求理解角色。",
      distilled: { confidence: "低", turns: 2, traits: ["workshop", "project理解", "需避免同名混淆"] },
      vectors: { clarity: 64, context: 78, speed: 54, risk: 64, data: 60, warmth: 72 }
    },
    {
      id: "hazel",
      name: "Hazel",
      role: "專員",
      department: "商品開發 / PA",
      birthday: "待補",
      style: "Seoul Dev Trip 內部成員，適合承接市場觀察、開發素材與款式方向整理。",
      distilled: { confidence: "低", turns: 1, traits: ["dev trip", "市場訊號", "資料待補"] },
      vectors: { clarity: 66, context: 78, speed: 62, risk: 58, data: 64, warmth: 66 }
    },
    {
      id: "lillian",
      name: "Lillian",
      role: "專員",
      department: "商品開發 / PA",
      birthday: "待補",
      style: "Seoul Dev Trip 內部成員，先作為開發 brief、樣布與款式同步角色。",
      distilled: { confidence: "低", turns: 1, traits: ["dev trip", "開發brief", "資料待補"] },
      vectors: { clarity: 68, context: 72, speed: 60, risk: 62, data: 62, warmth: 62 }
    },
    {
      id: "maggie",
      name: "Maggie",
      role: "專員",
      department: "商品開發 / PA",
      birthday: "待補",
      style: "Seoul Dev Trip 內部成員，適合協助把客戶方向轉成素材需求與下一步行動。",
      distilled: { confidence: "低", turns: 1, traits: ["dev trip", "素材需求", "資料待補"] },
      vectors: { clarity: 64, context: 74, speed: 64, risk: 58, data: 60, warmth: 68 }
    },
    {
      id: "erica",
      name: "Erica",
      role: "專員",
      department: "供應鏈 / 2D",
      birthday: "待補",
      style: "DICKS 定位裁印花會議中的內部角色，適合處理 2D 定位、版型與工差風險。",
      distilled: { confidence: "低", turns: 1, traits: ["2D定位", "供應鏈", "資料待補"] },
      vectors: { clarity: 72, context: 58, speed: 62, risk: 78, data: 70, warmth: 52 }
    },
    {
      id: "sharon",
      name: "Sharon",
      role: "專員",
      department: "供應鏈 / 2D",
      birthday: "待補",
      style: "DICKS 定位裁印花會議中的內部角色，先作為版型與花位交接支援卡。",
      distilled: { confidence: "低", turns: 1, traits: ["2D定位", "花位交接", "資料待補"] },
      vectors: { clarity: 68, context: 60, speed: 64, risk: 74, data: 68, warmth: 56 }
    },
    {
      id: "winnie",
      name: "Winnie",
      role: "專員",
      department: "供應鏈 / 2D",
      birthday: "待補",
      style: "DICKS 定位裁印花會議中的內部角色，適合補足工廠端規格確認與量產風險視角。",
      distilled: { confidence: "低", turns: 1, traits: ["2D定位", "量產風險", "資料待補"] },
      vectors: { clarity: 66, context: 62, speed: 60, risk: 76, data: 70, warmth: 58 }
    },
    {
      id: "huihui",
      name: "Huihui",
      role: "專員",
      department: "平湖",
      birthday: "待補",
      numerology: "?",
      element: "土",
      zodiac: "待補",
      archetype: "待觀察",
      animal: "待補",
      star: "待補",
      style: "目前觀察資料極少，先以保留判斷和接手風險標記為主。",
      distilled: { confidence: "低", turns: 1, traits: ["資料稀薄", "2D 接手風險", "需直接觀察"] },
      vectors: { clarity: 58, context: 52, speed: 50, risk: 70, data: 54, warmth: 50 }
    }
  ],
  scenarios: [
    {
      id: "delay",
      name: "專案 delay",
      prompt: "交付日期逼近，但關鍵資料還沒到位，需要兩人快速對齊下一步。",
      weights: { clarity: 1.2, speed: 1.1, risk: 1.15, context: .8, warmth: .8, data: 1 }
    },
    {
      id: "vague",
      name: "需求不清楚",
      prompt: "需求描述太抽象，大家以為理解了，但產出方向可能不同。",
      weights: { clarity: 1.25, context: 1.25, risk: 1, speed: .8, warmth: 1, data: .9 }
    },
    {
      id: "demo",
      name: "高層臨時要 demo",
      prompt: "明天要展示，目前只夠做一個可看的版本，必須取捨。",
      weights: { clarity: 1.15, speed: 1.25, risk: 1.1, context: .7, warmth: .8, data: .8 }
    },
    {
      id: "handoff",
      name: "DPC 與數發交接",
      prompt: "需求、資料與系統限制需要在 DPC 與數發之間翻譯清楚。",
      weights: { clarity: 1.15, context: 1.2, data: 1.15, risk: 1, speed: .85, warmth: 1 }
    },
    {
      id: "conflict",
      name: "會議有分歧",
      prompt: "兩邊都覺得自己有道理，但會議正在失焦，需要重新建立共同問題。",
      weights: { warmth: 1.25, context: 1.1, clarity: 1.1, risk: 1.1, speed: .7, data: .9 }
    },
    {
      id: "innovation",
      name: "新想法探索",
      prompt: "要評估一個新 AI 應用是否值得做 prototype。",
      weights: { context: 1.15, speed: 1, data: 1.05, warmth: 1.1, clarity: .95, risk: .85 }
    }
  ],
  orgMissions: [
    {
      id: "rc-lock",
      name: "數位布料知識鎖倉",
      prompt: "布料標準集中在少數技術核心身上，DPC、3D、數發都在等同一個人輸出。必須在五回合內把隱性知識變成可交接流程。",
      goal: "建立文件化義務、替補路線與跨單位交接節點。",
      pressure: { trust: 38, clarity: 34, momentum: 30, friction: 46 },
      weights: { clarity: 1.25, data: 1.3, risk: 1.25, speed: .75, context: 1, warmth: .8 }
    },
    {
      id: "debbie-gap",
      name: "Debbie 產假缺口",
      prompt: "台北線吸收缺口後負載升高，回歸前如果沒有重設分工，穩定的人會被默默耗損。",
      goal: "重設承接、回歸定位與對外窗口。",
      pressure: { trust: 42, clarity: 36, momentum: 34, friction: 38 },
      weights: { clarity: 1.1, context: 1.2, risk: 1.15, warmth: 1, data: .9, speed: .8 }
    },
    {
      id: "taipei-chiayi",
      name: "台北視角低估嘉義",
      prompt: "嘉義和平湖成員曝光不足，台北主視角把地理成本誤讀成態度問題，跨地資訊正在變形。",
      goal: "讓遠端單位被看見，建立同步節奏和正式紀錄。",
      pressure: { trust: 36, clarity: 32, momentum: 34, friction: 44 },
      weights: { context: 1.3, warmth: 1.15, clarity: 1.1, risk: 1, data: 1, speed: .75 }
    },
    {
      id: "ai-seed",
      name: "AI 種子隊成形",
      prompt: "AI 轉型不能只靠工具熱情，需要把研究、內容、技術標準、PM 節奏接成一條可運作的線。",
      goal: "組出跨單位 seed team，交付一個可驗證 prototype。",
      pressure: { trust: 44, clarity: 38, momentum: 38, friction: 28 },
      weights: { speed: 1.15, context: 1.1, data: 1.15, clarity: 1, warmth: .9, risk: .9 }
    },
    {
      id: "sttrix-gtm",
      name: "StyTrix Soft Launch",
      prompt: "Notion: StyTrix GTM。五月底前要問卷，六月中 VivaTech 要能 demo，六月底收內部回饋，七月底收外部回饋；同時還有 tutorial、FAQ、LinkedIn outreach、誘因機制和付款功能要接起來。",
      goal: "在時間壓力下打出 launch loop：Demo -> Feedback -> Tutorial -> Outreach -> Conversion。",
      pressure: { trust: 39, clarity: 31, momentum: 42, friction: 41 },
      weights: { clarity: 1.25, speed: 1.25, context: 1.15, data: 1.1, warmth: .9, risk: 1.05 }
    },
    {
      id: "nunox-ip",
      name: "NunoX IP 權益迷霧",
      prompt: "Notion: StyTrix GTM。AI 物料模型到底共有、獨有，還是自行開發？合作方技術進度不透明，但可能主張 50% 權益。",
      goal: "釐清權利義務、貢獻比例與替代方案，避免被不確定合作綁住。",
      pressure: { trust: 34, clarity: 28, momentum: 30, friction: 52 },
      weights: { risk: 1.35, data: 1.25, clarity: 1.25, context: 1, speed: .75, warmth: .8 }
    },
    {
      id: "vivatech-booth",
      name: "VivaTech Booth Crisis",
      prompt: "Notion: Vivatech 和群創的互動。攤位費 60-70 萬來源被誤解，合作方可能退出，三台螢幕與展示內容要重排，UI 延遲已壓縮測試時間。",
      goal: "在成本、硬體、展示內容和合作關係之間做出可執行展位配置。",
      pressure: { trust: 32, clarity: 30, momentum: 36, friction: 55 },
      weights: { clarity: 1.2, risk: 1.3, speed: 1.15, data: 1.15, context: 1.05, warmth: .95 }
    },
    {
      id: "ai-education-gap",
      name: "AI Education Gap",
      prompt: "Notion: Close-Door AI Meeting。產業和教育端都想用 AI，但設計師、學生、小品牌卡在工具門檻、成本、標準化和信任問題。",
      goal: "把 AI 能力轉成可教、可試、可標準化的培訓與 mentor loop。",
      pressure: { trust: 40, clarity: 33, momentum: 35, friction: 44 },
      weights: { context: 1.3, warmth: 1.15, clarity: 1.15, data: 1, risk: 1, speed: .9 }
    },
    {
      id: "pilot-feedback",
      name: "Startup Pilot Feedback Loop",
      prompt: "Notion: Close-Door AI Meeting。大公司有場域與供應鏈，小團隊有技術和彈性；如果沒有真實問題 brief 和 early feedback，pilot 會做成沒人要的東西。",
      goal: "建立 pilot brief、回饋節奏與成功指標，讓合作從展示變成迭代。",
      pressure: { trust: 37, clarity: 35, momentum: 40, friction: 39 },
      weights: { data: 1.25, context: 1.2, clarity: 1.15, warmth: 1, speed: 1, risk: .95 }
    },
    {
      id: "dicks-placement-print",
      name: "DICKS 定位裁印花",
      prompt: "TXT: DICKS SPORTING GOODS MAX156P_Q227。客人只給小彩圖，前片要定位，後片袖子領子口袋要宿舍處理；若先全套出圖，可能最後才發現花位、斜度、工差錯誤。",
      goal: "先用小圖鎖定前片定位，再讓 2D、布廠、3D 依序驗證，避免全碼展開後返工。",
      pressure: { trust: 43, clarity: 29, momentum: 37, friction: 48 },
      weights: { clarity: 1.25, risk: 1.35, data: 1.1, speed: 1, context: 1, warmth: .75 }
    },
    {
      id: "dpo-training-data",
      name: "台科 DPO 資料標註迷宮",
      prompt: "TXT: 聚陽 X 台科大雙週會。要做 DPO / LoRA 前，必須先定義品牌風格、人種、光線、構圖、驗收標準，還要處理好圖/壞圖標註和 prompt 定位不準。",
      goal: "把抽象風格需求變成可標註資料、訓練流程和驗收規則。",
      pressure: { trust: 38, clarity: 27, momentum: 31, friction: 46 },
      weights: { clarity: 1.35, data: 1.35, context: 1.15, risk: 1.1, speed: .7, warmth: .8 }
    },
    {
      id: "fabric-api-78",
      name: "Jack API 只有 78 筆",
      prompt: "TXT: Meeting Transcription。期待的是完整布料資料庫，但 API 測到只有 78 筆，關鍵字不知道怎麼下，marketplace、AI 生成、3D 成像、物性資料又分成不同階段。",
      goal: "把 API 測試站、資料欄位、階段切分和上線範圍釐清，先求可用再談商業包裝。",
      pressure: { trust: 35, clarity: 30, momentum: 39, friction: 50 },
      weights: { data: 1.35, clarity: 1.25, risk: 1.2, speed: 1.1, context: 1, warmth: .75 }
    },
    {
      id: "sequin-qipao",
      name: "3D 亮片旗袍失真",
      prompt: "TXT: 3D 周會。亮片材質在 Clo / Substance / AI 流程間反覆測試，Gemini 可能太誇張，自家流程比較真但花會變形；資料夾裡 map 和最終 3D 版本也需要整理。",
      goal: "在材質真實度、AI 修圖、3D 效能和檔案版本之間找到可展示方案。",
      pressure: { trust: 41, clarity: 33, momentum: 34, friction: 47 },
      weights: { risk: 1.25, data: 1.2, clarity: 1.15, speed: 1.05, context: .9, warmth: .85 }
    },
    {
      id: "seoul-dev-trip",
      name: "SP27 Seoul Dev Trip",
      prompt: "TXT: Seoul Dev trip / workshop 類會議。出差回來有客戶方向、款式開發、樣布/版型/影像素材要同步，如果沒有快速整理，市場訊號會散掉。",
      goal: "把 trip insight 轉成款式方向、素材需求和下一輪開發 brief。",
      pressure: { trust: 44, clarity: 35, momentum: 42, friction: 34 },
      weights: { context: 1.25, speed: 1.15, clarity: 1.1, warmth: 1, data: 1, risk: .85 }
    }
  ],
  actionTypes: [
    {
      id: "frame",
      name: "定義問題",
      icon: "◇",
      copy: "把混亂任務切成共同問題、邊界與決策點。",
      vector: "clarity",
      boosts: { clarity: 16, trust: 3, momentum: 4, friction: -3 }
    },
    {
      id: "bridge",
      name: "跨域翻譯",
      icon: "↔",
      copy: "把兩個單位的語言翻成彼此可執行的版本。",
      vector: "context",
      boosts: { trust: 9, clarity: 9, momentum: 3, friction: -8 }
    },
    {
      id: "prototype",
      name: "做出樣本",
      icon: "▣",
      copy: "用小型 prototype 取代空轉討論。",
      vector: "speed",
      boosts: { momentum: 17, clarity: 5, trust: 2, friction: -1 }
    },
    {
      id: "gate",
      name: "設品質閘門",
      icon: "◆",
      copy: "把標準、驗收和文件化義務放進流程。",
      vector: "risk",
      boosts: { clarity: 10, trust: 4, momentum: 2, friction: -10 }
    },
    {
      id: "evidence",
      name: "補證據鏈",
      icon: "◎",
      copy: "用樣本、數據、會議紀錄保護決策。",
      vector: "data",
      boosts: { clarity: 8, trust: 8, momentum: 5, friction: -5 }
    },
    {
      id: "align",
      name: "修復關係",
      icon: "✦",
      copy: "先降低誤讀和防衛，再推進任務。",
      vector: "warmth",
      boosts: { trust: 15, clarity: 3, momentum: 1, friction: -12 }
    }
  ],
  strategies: [
    {
      id: "bottom-line",
      name: "結論先行",
      text: "先講要做什麼，再補三個理由。",
      boosts: { clarity: 12, speed: 8, trust: 2, friction: -3 },
      fits: ["delay", "demo"]
    },
    {
      id: "context-brief",
      name: "一頁脈絡 brief",
      text: "用一頁說明背景、限制、目標和待決策點。",
      boosts: { clarity: 8, context: 12, trust: 6, friction: -5 },
      fits: ["vague", "handoff", "innovation"]
    },
    {
      id: "owner-risk",
      name: "拆 owner / deadline / risk",
      text: "把模糊討論拆成負責人、期限和風險。",
      boosts: { clarity: 14, trust: 4, momentum: 8, friction: -2 },
      fits: ["delay", "handoff", "demo"]
    },
    {
      id: "data-proof",
      name: "用數據說服",
      text: "先拿證據和樣本，再要求決策。",
      boosts: { clarity: 8, trust: 8, momentum: 4, friction: -3 },
      fits: ["handoff", "innovation"]
    },
    {
      id: "private-align",
      name: "先私下對齊",
      text: "先一對一校準，再進大會議。",
      boosts: { trust: 12, clarity: 4, momentum: 2, friction: -10 },
      fits: ["conflict", "vague"]
    },
    {
      id: "prototype",
      name: "轉成 prototype",
      text: "用可看的小版本取代長時間抽象辯論。",
      boosts: { momentum: 14, clarity: 7, trust: 3, friction: -1 },
      fits: ["innovation", "demo"]
    },
    {
      id: "options",
      name: "把問題變選項題",
      text: "提供 A/B/C 選項和各自代價，讓對方比較好決定。",
      boosts: { clarity: 12, momentum: 8, trust: 5, friction: -4 },
      fits: ["vague", "conflict", "delay"]
    },
    {
      id: "uncertainty",
      name: "先承認不確定",
      text: "先說哪些已知、哪些未知，再決定要補什麼資料。",
      boosts: { trust: 10, clarity: 7, momentum: 2, friction: -6 },
      fits: ["vague", "innovation", "conflict"]
    }
  ],
  elementRelations: {
    "木-火": "相生：願景能推動速度，適合開新局。",
    "火-土": "相生：推動力能落成流程，但要防止過度催促。",
    "土-金": "相生：現實感能長出標準，適合定規格。",
    "金-水": "相生：標準與資訊流能形成判斷，適合做系統化分析。",
    "水-木": "相生：洞察滋養新方向，適合探索。",
    "木-土": "相剋：擴張遇到現實限制，要先講取捨。",
    "土-水": "相剋：穩定與流動拉扯，要用明確邊界保護彈性。",
    "水-火": "相剋：靈感與速度易互相消耗，需要節奏管理。",
    "火-金": "相剋：推動力碰到標準，摩擦高但能打磨決策。",
    "金-木": "相剋：標準會修剪願景，適合做策略取捨。"
  },
  distillations: {
    karen: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "架構型整合者，前線偵測器不夠靈敏。",
      trigger: "需要整合多地資源、協調複雜分工時會啟動。",
      limiter: "被要求直接說出意見時會猶豫，需要明確授權發聲。",
      assignment: "跨地 coordination、人員分工架構設計；品質 gate 需要外部結構支撐。",
      leverage: "架構設計能力與人員配置邏輯。",
      risk: "Elly 不在場時品質標準容易滑動；需要強硬介入時可能形成真空。",
      aiFit: 3
    },
    alan: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "判斷力在，但等待模式預設開啟。",
      trigger: "把「甲方需求定義者」角色講清楚，並授權他主動要求資源。",
      limiter: "交接邊界模糊會加重等待傾向。",
      assignment: "產品規格決策、業務判斷介入、與 Karen 組的需求 interface。",
      leverage: "看得出什麼值得做，商業判斷力可用。",
      risk: "若只被當執行者，會用執行力完成任務但不主動 claim 資源。",
      aiFit: 3
    },
    andy: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "全端獨立研究者，時間節奏需要外部錨點。",
      trigger: "明確 deadline、展會或里程碑壓力，加上研究自主空間。",
      limiter: "沒有外部節點時，自我驅動節奏容易漂移。",
      assignment: "AI 轉型技術研究、前沿工具評估、VR/AR 研發。",
      leverage: "技術深度、自主評估工具、後設反思能力。",
      risk: "完美主義會把標準拉高，形成拖延。",
      aiFit: 5
    },
    yoko: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "組織可靠度的壓艙石，承壓能力被低估。",
      trigger: "給明確授權和足夠資訊，她會自主把事情做好。",
      limiter: "需要強硬介入時偏白臉；目前吸收 Debbie 缺口，負載偏高。",
      assignment: "AI 種子首選、英文對外溝通培養、Debbie 回來後分工重設關鍵點。",
      leverage: "穩定郵件品質、英文能力、主動承接缺口。",
      risk: "超載和強硬度不足。",
      aiFit: 4
    },
    debbie: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "Profile 建立中，英文 presentation 候選之一。",
      trigger: "產假回來是自然重分工節點。",
      limiter: "實際工作觀察資料有限。",
      assignment: "提前設計回歸後定位，不要直接插回舊位置。",
      leverage: "presentation 培養潛力。",
      risk: "資料不足，回歸定位若未設計會延續舊混亂。",
      aiFit: 2
    },
    adia: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "執行力有，主體性需要被點燃。",
      trigger: "給帶邊界的 AI 專案獨立主導，可能啟動主動性。",
      limiter: "開放式任務容易卡住，需要具體方向。",
      assignment: "視覺製作執行、特定專案主導。",
      leverage: "IG 視覺輸出能力與穩定執行。",
      risk: "等指令模式穩定，可能不是短期狀態。",
      aiFit: 2
    },
    jean: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "內容製作者，已在自主導入 AI 工具。",
      trigger: "給品牌視覺和 3D 建模任務，搭配 AI 輔助工作流。",
      limiter: "業務流程理解仍在建立；不要把 VFX/Unreal 工作誤歸給她。",
      assignment: "品牌視覺內容產出、3D 建模執行、AI 輔助工作流建立。",
      leverage: "影片、IG、建模與 AI 半操作模式的自主導入。",
      risk: "技術路線邊界需要保護。",
      aiFit: 3
    },
    rou: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "細節把關者，表達是弱環。",
      trigger: "用 AI 輔助強化表達，並設計 RC 溝通結構。",
      limiter: "知道答案但說不清楚；對外溝通需配對表達能力強的人。",
      assignment: "3D 品質把關、布料驗證。",
      leverage: "布料驗證與 3D 品質細節能力。",
      risk: "與 RC 的溝通障礙若無結構解法，會卡住流程。",
      aiFit: 2
    },
    sixian: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "穩定低調的儲備能量，尚未被充分使用。",
      trigger: "主動增加工作量，觀察較高負載下的判斷品質。",
      limiter: "曝光度低、review 資料薄。",
      assignment: "UA 支援、布料掃測、GAP 布料。",
      leverage: "不出錯、有餘力，曾主動分享 plug-in。",
      risk: "觀察深度不足，潛力可能被低估。",
      aiFit: 2
    },
    chieh: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "執行力穩定，但投入感有觸發點後退潮。",
      trigger: "先直接問撤退原因，再決定 KPI 或支持策略。",
      limiter: "在理解原因前施壓，可能加速離開。",
      assignment: "量產高通量執行；動機結構需先釐清。",
      leverage: "工作量翻倍仍能撐住，執行力穩定。",
      risk: "從主動改善退回 KPI 施壓，速度過快，疑似有未被理解的觸發點。",
      aiFit: 1
    },
    yota: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "獨立主體型技術人員，被地理因素系統性低估。",
      trigger: "跨地協作需主動設計，直接問出差意願，不代替她決定。",
      limiter: "台北視角曝光不足；出差成本不能用台北標準判斷。",
      assignment: "AI 種子候選、流程優化、高技術作工、嘉義在地工作線統籌。",
      leverage: "TD 溝通、主體想法、AI 學習意願。",
      risk: "地理距離造成低估與資訊不對稱。",
      aiFit: 4
    },
    jan: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "PM 型思考者，邏輯清晰、記憶力強、喜歡直接講。",
      trigger: "在 review 中給直接發言位置，讓她被聽到而不只是被討論。",
      limiter: "英文郵件需修；與 Zizi 摩擦需正式會議記錄保護。",
      assignment: "ATH Project Managing、GAP 協調、PM 培養。",
      leverage: "大局觀、1-2-3 直線溝通、專案協調潛力。",
      risk: "地理曝光不足與跨部門摩擦結構化不足。",
      aiFit: 3
    },
    huihui: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "Profile 資料極稀薄，無法做有意義判斷。",
      trigger: "需要先取得直接觀察或自評資料。",
      limiter: "平湖成員在 review 中幾乎缺席。",
      assignment: "若請假，需確認誰能接手 2D 工作。",
      leverage: "目前不可判斷。",
      risk: "接手設計不清時會形成 2D 工作斷點。",
      aiFit: 0
    },
    rock: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "組織的技術 ground truth，也是最大的單點風險。",
      trigger: "展會、交付等外部截止節點有效；需要制度壓力。",
      limiter: "知識嚴重不輸出，口頭要求無效，需文件化義務。",
      assignment: "技術標準制定；必須配套知識輸出和文件交付。",
      leverage: "驗證標準制定、NunoX 應用測試深度。",
      risk: "知識鎖倉與時間管理失誤影響至少三條工作線。",
      aiFit: 1
    },
    tinley: {
      source: "三場績效評估 + org chart + 工作觀察",
      mode: "成長曲線清晰可見，接手意願強。",
      trigger: "繼續接手重要工作，讓成長速度被看見。",
      limiter: "技術深度仍在建立，需要 RC 知識轉移配合。",
      assignment: "TGT 數位布料接手、VivaTech 支援、AI + 布料工作流整合。",
      leverage: "英文郵件改善明顯，主動填補能力缺口。",
      risk: "若 RC 不輸出知識，成長會被上游卡住。",
      aiFit: 3
    }
  }
};
