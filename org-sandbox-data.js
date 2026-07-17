/*
 * Organization sandbox schema.
 * This file adds task-level structure without changing formal HR records.
 */
(function addOrganizationSandboxSchema() {
  const slotCatalog = [
    { id: "sponsor", name: "Sponsor", zh: "授權者", detail: "提供資源與跨部門授權。", decision: "Approve" },
    { id: "decision-owner", name: "Decision Owner", zh: "決策 owner", detail: "對方向與取捨做最終拍板。", decision: "Decide" },
    { id: "business-owner", name: "Business Owner", zh: "商業／客戶 owner", detail: "對品牌、客戶或商業結果負責。", decision: "Recommend" },
    { id: "technical-authority", name: "Technical Authority", zh: "技術判定者", detail: "確認標準與技術可行性。", decision: "Review" },
    { id: "delivery-owner", name: "Delivery Owner", zh: "交付 owner", detail: "將任務拆解並完成交付。", decision: "Execute" },
    { id: "data-owner", name: "Data Owner", zh: "資料 owner", detail: "確保資料來源、版本與可追溯性。", decision: "Review" },
    { id: "bridge", name: "Bridge", zh: "跨單位轉譯", detail: "把不同單位的語言轉成可執行輸入。", decision: "Recommend" },
    { id: "risk-controller", name: "Risk Controller", zh: "風險把關", detail: "守住品質、成本、法遵或交期界線。", decision: "Review" }
  ];

  const unitRoleHints = {
    ceo: ["sponsor", "decision-owner"],
    "general-mgmt": ["sponsor", "decision-owner", "bridge"],
    "sales-marketing": ["business-owner", "bridge", "delivery-owner"],
    "tech-rd": ["technical-authority", "delivery-owner", "risk-controller"],
    "ops-mgmt": ["data-owner", "delivery-owner", "risk-controller"],
    overseas: ["delivery-owner", "risk-controller", "bridge"],
    newbiz: ["technical-authority", "bridge", "delivery-owner"],
    consulting: ["sponsor", "bridge"],
    investment: ["sponsor", "decision-owner"]
  };

  const missionBlueprints = {
    "gap-exec-visit": {
      deliverable: "可展示的 demo、對外敘事與明確下一步。",
      slots: ["sponsor", "decision-owner", "business-owner", "technical-authority", "delivery-owner", "bridge"],
      success: ["對外版本一致", "demo 可被看見", "承諾範圍已拍板"],
      events: ["高層要求看到實體成果", "客戶問題跨過產品與量產邊界", "對外承諾需要收束"]
    },
    "techpack-truth-map": {
      deliverable: "資料範圍、版本來源、owner 與使用邊界。",
      slots: ["decision-owner", "technical-authority", "data-owner", "delivery-owner", "bridge", "risk-controller"],
      success: ["資料來源可追溯", "範圍已切清楚", "後續維運 owner 已指定"],
      events: ["同一款號出現多個版本", "BOM 與做工資料被混為一談", "系統需要知道資料可否使用"]
    },
    "ai-seed-rollout": {
      deliverable: "試點範圍、採用路徑、資料與維運責任。",
      slots: ["sponsor", "decision-owner", "data-owner", "delivery-owner", "bridge", "risk-controller"],
      success: ["試點邊界明確", "系統資料可用", "採用與維運有人負責"],
      events: ["工具先行但流程未改", "資料 owner 未確認", "試點成果需要可複製"]
    },
    "digital-sample-adoption": {
      deliverable: "數位樣適用規則、驗收標準與客戶教育路徑。",
      slots: ["business-owner", "technical-authority", "delivery-owner", "risk-controller", "bridge"],
      success: ["適用款式已定義", "例外規則清楚", "客戶與量產端理解一致"],
      events: ["品牌要求縮短樣品循環", "量產端對數位樣信任不足", "需要定義例外款式"]
    }
  };

  const defaultBlueprint = {
    deliverable: "可執行的 owner、時程、版本與風險處理方案。",
    slots: ["decision-owner", "business-owner", "technical-authority", "delivery-owner", "data-owner", "risk-controller"],
    success: ["決策已閉環", "必要單位已接上", "交付與風險 owner 明確"],
    events: ["資訊不一致", "跨單位依賴尚未確認", "交付期限被壓縮"]
  };

  GAME_DATA.sandbox = {
    version: "2026-07-17",
    sourcePolicy: {
      formal: "組織、職位、匯報關係以 PDF、人令與 HR 確認為準。",
      intelligence: "協作訊號僅用於任務支援，不替代人事、績效或任用判斷。",
      birthday: "生日僅保存月日並產生遊戲視覺資訊，不參與管理決策。"
    },
    slotCatalog,
    unitRoleHints,
    decisionRights: ["Input", "Recommend", "Review", "Approve", "Decide", "Execute"],
    healthMetrics: [
      { id: "decision", name: "決策閉環", detail: "是否存在能拍板的角色與明確 owner。" },
      { id: "dependency", name: "依賴覆蓋", detail: "任務所需單位是否都已接上。" },
      { id: "facts", name: "事實一致", detail: "資料、樣品、系統與對外說法是否同版。" },
      { id: "delivery", name: "交付可行", detail: "是否具備時間、能力與執行 owner。" },
      { id: "resilience", name: "韌性", detail: "關鍵人或單位受阻時是否仍能推進。" }
    ]
  };

  GAME_DATA.orgMissions.forEach((mission) => {
    const blueprint = missionBlueprints[mission.id] || defaultBlueprint;
    mission.sandbox = { ...defaultBlueprint, ...blueprint };
  });
})();
