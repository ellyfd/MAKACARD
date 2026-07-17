# Phase 1: Formal Organization Source Intake

本模板用於把新的組織圖 PDF、人令或 HR 確認資料安全地匯入 Org Quest。它只接受可追溯的正式資料，禁止以會議紀錄、口頭觀察或推測補組織階層。

## 1. 每次來源批次

```json
{
  "batchId": "2026-08-org-update",
  "source": "部門組織圖202608.pdf 或 人令字第XXXX號",
  "sourceVersion": "2026-08",
  "effectiveFrom": "僅在文件明示時填入 YYYY-MM-DD",
  "owner": "HR / 組織資料 owner",
  "scope": ["受影響的群、處、部、課或團隊"]
}
```

`sourceVersion` 是文件版本，不能代替 `effectiveFrom`。若未明示生效日，欄位保持空白。

## 2. 可匯入的正式變更

| 類型 | 必填欄位 | 檢核 |
| --- | --- | --- |
| 單位新增／移動／停用 | `id`, `nameZh`, `parentId`, `unitType`, `source`, `sourceVersion` | 上層必須存在；不可形成循環 |
| 職位／主管異動 | `personId`, `roleTitle`, `organizationNodeId`, `relationshipType`, `source`, `sourceVersion` | 人員與單位皆必須是已確認記錄 |
| 直屬關係 | `personId`, `reportsToId`, `relationshipType`, `source`, `sourceVersion` | 僅接受 PDF／人令／HR 確認；不可由部門名稱推斷 |
| 兼任／代理 | `personId`, `organizationNodeId`, `relationshipType`, `effectiveFrom`, `source` | 不複製人員卡，使用 assignment |

## 3. 人員子單位補點格式

針對目前未精確對應的成員，需提供以下最小資料才會下展至子課／團隊：

```text
personId 或中英文姓名
完整正式路徑（群 / 處 / 部 / 課 / 團隊）
正式職稱（文件有載才填）
直屬主管（文件有載才填）
來源檔名與版本
```

只有「完整正式路徑」與既有節點完全相同，或來源同時明示新子節點及其上層時，才建立 membership。否則保持未下展，避免把相近名稱誤掛到錯誤單位。

## 4. 匯入後必跑檢查

```powershell
node scripts/validate-org-data.js
node scripts/report-org-coverage.js
node scripts/verify-prototype-readiness.js
```

發布前需確認：

1. 新增正式節點都有來源與版本。
2. 異動的匯報關係都有來源。
3. 公開資料沒有完整生日、私人側寫或 P2/P3 欄位。
4. `report-org-coverage.js` 的未解決部門僅包含尚未取得正式來源的項目。
5. 公開發布清單已重新產生並與正式節點數一致。