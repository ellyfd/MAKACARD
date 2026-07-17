/*
 * Formal organization provenance. Sources are attached to the most specific
 * known PDF; descendants inherit the nearest documented organization source.
 */
(function addOrganizationProvenance() {
  const sourceByNode = {
    board: "公司組織圖202605.pdf",
    "audit-office": "公司組織圖202605.pdf",
    "ceo-office": "公司組織圖202605.pdf",
    "consulting-office": "顧問室本部組織圖202605.pdf",
    "general-office": "總管理處組織圖202605.pdf",
    "sales-group": "業務行銷群組織圖202605.pdf",
    "finance-admin-office": "財會管理處組織圖202605.pdf",
    "it-office": "資訊處組織圖202606.pdf",
    "tech-rd-group": "工務研發群組織圖202605.pdf",
    "dev-tech": "開發暨技術處202605.pdf",
    "technical-design": "開發暨技術處技術設計部202605.pdf",
    "sample-rd": "開發暨技術處樣品研發部202605.pdf",
    "rd-3d": "開發暨技術處3D研發中心202605.pdf",
    "special-rd": "開發暨技術處特工研發中心202605.pdf",
    "dev-logistics-section": "開發暨技術處運籌課202605.pdf",
    "costing-center": "開發暨技術處估碼中心202605.pdf",
    "chiayi-sample-center": "嘉義樣品中心202605.pdf",
    "engineering-office": "工務處組織圖202606.pdf",
    "industrial-engineering": "工務處工業工程部組織圖202606.pdf",
    "quality-management": "工務處品質管理部組織圖202606.pdf",
    "logistics-office": "運籌處組織圖202605.pdf",
    "logistics-management": "運籌處物流管理部組織圖202605.pdf",
    "production-sales-management": "運籌處產銷管理部組織圖202605.pdf",
    "app-development": "資訊處應用開發部組織圖202606.pdf",
    "erp-development": "資訊處ERP開發部組織圖202606.pdf",
    "system-operations": "資訊處系統營運部組織圖202606.pdf",
    "digital-transformation": "資訊處數位轉型部組織圖202606.pdf",
    "engineering-system": "資訊處工務系統部組織圖202606.pdf",
    "data-platform": "資訊處資料平台部組織圖202606.pdf",
    "software-architecture-committee": "資訊處軟體架構委員會組織圖202606.pdf",
    "digital-product": "數位產品發展中心202605.pdf",
    "smart-textile": "智慧紡織發展中心202605.pdf",
    "overseas-region": "公司組織圖202605.pdf",
    "investment-companies": "轉投資企業組織圖202605.pdf"
  };

  const sourceVersion = (source) => {
    const match = /(20\d{2})(\d{2})/.exec(source || "");
    return match ? `${match[1]}-${match[2]}` : "";
  };
  const byId = new Map((GAME_DATA.orgDirectory || []).map((item) => [item.id, item]));
  const sourceFor = (item) => {
    let cursor = item;
    while (cursor) {
      if (sourceByNode[cursor.id]) return sourceByNode[cursor.id];
      cursor = cursor.parent ? byId.get(cursor.parent) : null;
    }
    return "公司組織圖202605.pdf";
  };

  GAME_DATA.orgDirectory = (GAME_DATA.orgDirectory || [])
    .filter((item) => item.id !== "pending-members")
    .map((item) => {
      const source = item.source || sourceFor(item);
      return { ...item, source, sourceVersion: item.sourceVersion || sourceVersion(source) };
    });

  ["members", "orgPeople"].forEach((collection) => {
    GAME_DATA[collection] = (GAME_DATA[collection] || []).map((person) => (
      person.orgUnit === "pending" ? { ...person, hiddenFromOrg: true } : person
    ));
  });
  const reportingSourceByUnit = {
    ceo: "公司組織圖202605.pdf",
    "general-mgmt": "總管理處組織圖202605.pdf",
    "sales-marketing": "業務行銷群組織圖202605.pdf",
    "ops-mgmt": "資訊處組織圖202606.pdf",
    "tech-rd": "工務研發群組織圖202605.pdf",
    newbiz: "數位產品發展中心202605.pdf"
  };
  ["members", "orgPeople"].forEach((collection) => {
    (GAME_DATA[collection] || []).forEach((person) => {
      if (person.reportsTo && !person.reportingSource && reportingSourceByUnit[person.orgUnit]) {
        person.reportingSource = reportingSourceByUnit[person.orgUnit];
      }
      if (person.reportingSource && !person.reportingSourceVersion) {
        person.reportingSourceVersion = sourceVersion(person.reportingSource);
      }
    });
  });})();






