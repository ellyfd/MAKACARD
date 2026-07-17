# Phase 5: Enterprise Readiness

本文件定義 Org Quest 從公開 GitHub Pages 原型移入企業環境時的登入、授權、敏感資料與驗收要求。它是建置規格，不代表公開版已啟用這些功能。

## 1. 產品邊界

| 面向 | 公開原型 | 企業版 |
| --- | --- | --- |
| 正式組織 | 可顯示已確認的群、處、部、課、團隊與公開職稱 | 由 HR/組織資料來源同步，保留來源、版本與異動歷程 |
| 成員資料 | 姓名、公開職稱、部門、月日生日、已確認匯報關係 | 加上職等、正式決策權、管轄範圍與有效日期 |
| JD 能力 | 職務層級能力與工作重心 | 可加入職務版本、技能證據、培訓與需求缺口 |
| 任務沙盤 | 任務、角色槽位、組織單位與遊戲機制 | 可儲存任務草案、正式指派、RACI、風險與決議 |
| 人才情報 | 不存放、不顯示 | 受限資料，僅能以明確用途、最小權限與可稽核流程存取 |

## 2. 資料分級

| 等級 | 資料 | 儲存與使用規則 |
| --- | --- | --- |
| P0 公開組織 | 正式單位、公開職稱、已核准姓名、來源版本 | 可發布至公開原型；不得帶入會議側寫、個人評分或完整生日 |
| P1 內部營運 | 職務 JD、任務草案、組織異動草案、部門能力矩陣 | 需公司登入；依單位與任務範圍授權 |
| P2 人事機密 | 職等、正式決策權、績效、繼任、個人能力證據 | 僅 HR 與經授權管理者；目的限定、到期回收、全程稽核 |
| P3 高敏感 | 會議逐字稿、私人觀察、醫療/家庭/聯絡資訊、完整生日 | 不進公開資料庫；若業務必要，採獨立受控系統與資料保留期限 |

## 3. 角色與最小權限

| 角色 | 主要權限 | 明確限制 |
| --- | --- | --- |
| 全員 | 查看自己可見的 P0/P1 組織與任務 | 不可查看他人 P2/P3 資料、不可改正式組織 |
| 任務 Owner | 建立／編輯自己任務的編隊與推演 | 不可宣告正式職等、匯報或決策權 |
| 部門主管 | 檢視所轄單位 P1 能力矩陣、提報組織或任務草案 | P2 僅限經核准的直屬治理用途 |
| HR／組織管理者 | 管理正式組織版本、職等與核准流程 | 不可將 P2/P3 同步到公開視圖 |
| 高階決策者 | 查看核准後的跨群任務與組織比較 | 不可繞過稽核直接匯出 P2/P3 |
| 系統管理者 | 管理身分整合、權限設定與安全事件 | 預設不閱讀業務內容，採 break-glass 程序 |

## 4. 登入與授權架構

1. 使用公司 IdP 的 SSO（OIDC 或 SAML）；不建立獨立密碼帳戶。
2. 登入後由 IdP 群組、HR 主檔與任務範圍共同決定角色，不以前端隱藏 UI 當作授權。
3. 後端每筆資料都帶 `classification`、`ownerUnit`、`source`、`sourceVersion`、`effectiveFrom`、`effectiveTo` 與 `accessPolicy`。
4. 所有讀取、搜尋、匯出、權限提升、資料修改與草案核准寫入不可竄改的 audit event。
5. 高敏感資料查閱採短時效授權；到期自動撤銷，匯出預設關閉。

## 5. 核心資料模型

```text
OrganizationNode
  id, parentId, name, type, source, sourceVersion, effectiveFrom, effectiveTo

PersonAssignment
  personId, organizationNodeId, roleTitle, reportsToId, assignmentType,
  source, sourceVersion, effectiveFrom, effectiveTo

JobCapabilityProfile
  jobProfileId, organizationScope, competencies, jdSource, jdVersion

MissionDraft
  id, scenarioId, ownerId, participants, roleSlots, eventTrail,
  decisionLog, status, accessPolicy

SensitiveEvidence
  id, subjectId, classification, purpose, retentionUntil,
  sourceReference, accessPolicy, auditRequired

AuditEvent
  id, actorId, action, objectType, objectId, purpose, timestamp, outcome
```

## 6. 工作流程

### 正式組織異動

1. HR/組織管理者匯入 PDF、人令或 HR 主檔版本。
2. 系統產生差異草案：新增、移動、職稱改名、直屬關係異動與失效資料。
3. 指定的組織 owner 審核；涉及跨群或高階職務時要求第二核。
4. 核准後建立新有效版本，保留舊版本供比較；公開 P0 視圖只讀取核准版本。

### 任務編隊與推演

1. 任務 Owner 選情境與交付物，配置角色槽位。
2. 系統僅以 JD、正式組織席位與明確授權提示檢查缺口。
3. 推演結果是草案，不會寫回績效或人事主檔。
4. 要轉成正式任務時，必須有 owner、決策紀錄、期限與 P1 存取範圍。

### 敏感人才資訊

1. 查閱者需選擇用途，例如繼任、人才發展、組織設計或指定管理流程。
2. 系統驗證角色、管理範圍與資料分級；拒絕預設、批次或無用途的瀏覽。
3. 顯示最小必要欄位，完整證據要額外核准。
4. 每次存取、匯出或判斷結果都寫入 audit event，並可由 HR 定期覆核。

## 7. 上線驗收條件

### 資料與組織

- 每個正式節點具有來源、版本、有效日期與上層節點。
- 每筆匯報關係具有來源；無來源者不得顯示為正式直屬。
- 異動可比較前後版本，且不可覆寫歷史。
- 公開資料檢查不得出現完整生日、私人側寫、個人評分或 P2/P3 欄位。

### 授權與安全

- 未登入無法讀取 P1/P2/P3 API；前端路由與 API 都須強制驗證。
- 權限變更立即生效，且有審計紀錄與回復路徑。
- 部門主管無法讀取非所轄 P2 資料；系統管理者無預設內容存取權。
- 所有匯出都有分類標記、操作者、用途與可追溯紀錄。

### 任務產品

- Draft Room 的角色槽位與 Mission Run 結果皆清楚標示為任務推演，不是績效、升遷或人格結論。
- 任務結果可保存為草案、指定 owner、建立期限與決策紀錄。
- 被引用的 JD、組織節點與資料版本可回查。

## 8. 建置順序

1. 建立企業資料庫與 SSO／RBAC 基線，先遷入 P0/P1。
2. 建立組織版本匯入、差異審核與 audit log。
3. 將 Digital Org、Capability Map、Draft Room 與 Mission Run 換成受權 API。
4. 以小範圍部門試行任務草案與 RACI 流程。
5. 最後才評估 P2 人才功能；P3 不納入 Org Quest 的預設範圍。
