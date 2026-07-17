# MAKACARD | Org Quest

Makalot 的 Digital Organization Sandbox。這個 GitHub Pages 原型把正式組織結構、任務角色與跨單位推演放在同一個介面；它不是人資主檔或人格評量工具。

## 目前可用

- **Digital Org**：依正式群／處／中心／部／課／團隊向下展開的組織圖；被點開的節點同層呈現已知直屬成員與下層單位，支援搜尋、滑鼠縮放、平移、置中、回上層與節點詳情。
- **Capability Map**：以已建檔 JD 顯示職務能力、核心職能、工作重心與單位覆蓋；不包含個人評分或會議側寫。
- **Draft Room**：先選任務，再配置 Sponsor、Decision Owner、Technical Authority、Delivery Owner、Data Owner 與 Bridge；系統檢查決策閉環、依賴覆蓋、事實一致、交付可行與韌性。
- **Mission Run**：以任務交付物、必要席位、跨單位依賴與事件卡推進五回合；可選擇「依職務自動建議」或手動打出戰術牌，牌面會即時以 JD 與單位席位顯示證據、錯配與任務效果，而非以人格合拍度評分。

## 資料原則

- 正式組織、職位、匯報關係以 PDF、人令與已確認資料為準。
- 協作訊號僅用於任務支援，不用於績效、任用、升遷或人格判定。
- 生日僅保存月日，供靈數、星座、五行等遊戲視覺資訊使用，不參與管理決策。
- 沒有正式資料的欄位不顯示，也不自行補造姓名、職稱或直屬關係。

## 資料檔

- `game-data.js`：基礎人物、JD 與任務。
- `*-data.js`：依組織群／資料來源逐步補入的正式組織資料。
- `org-sandbox-data.js`：任務角色槽位、組織健康指標與資料治理規則。
- `game.js`：Digital Org、Draft Room 與 Mission Run 互動邏輯。
## 分期建置

- **Phase 0**：資料字典、來源優先序、敏感資料與公開原型邊界，見 [`docs/phase-0-data-governance.md`](docs/phase-0-data-governance.md)。
- **Phase 1**：依 PDF／人令校正正式組織、職位與直屬／兼任關係。
- **Phase 2**：Digital Org v2 的全寬互動樹與正式資料追溯。
- **Phase 3**：能力、決策權、職掌與情境化協作訊號；公開版先完成 JD 能力底圖與來源版本，見 [`docs/phase-3-talent-intelligence.md`](docs/phase-3-talent-intelligence.md)。
- **Phase 4**：Draft Room 與 Mission Run 的任務編隊與推演。
- **Phase 5+**：草案組織比較、登入權限與企業版資料治理。


## 資料驗證

每次補入 PDF、人令或組織資料後，執行：

```powershell
node scripts/validate-org-data.js
node scripts/report-org-coverage.js
```

驗證器會檢查組織階層、成員 ID、單位來源、公開生日格式，以及不應出現在 GitHub Pages 的私人人才情報欄位。覆蓋稽核會列出已掛組織節點、已驗證匯報來源與仍需 PDF／人令確認的部門缺口；它不會推測直屬關係。
## 本機開啟

直接在瀏覽器開啟 `index.html` 即可。

## GitHub Pages

在 repo 的 `Settings > Pages` 設定：`Deploy from a branch`，選 `main` 與 `/root`。GitHub 會發布網站。

