# MAKACARD | Org Quest

Makalot 的 Digital Organization Sandbox。這個 GitHub Pages 原型把正式組織結構、任務角色與跨單位推演放在同一個介面；它不是人資主檔或人格評量工具。

## 目前可用

- **Digital Org**：依正式群／處／中心／部／課／團隊向下展開的組織圖；支援搜尋、滑鼠縮放、平移、置中、回上層與節點詳情。
- **Draft Room**：先選任務，再配置 Sponsor、Decision Owner、Technical Authority、Delivery Owner、Data Owner 與 Bridge；系統檢查決策閉環、依賴覆蓋、事實一致、交付可行與韌性。
- **Mission Run**：以任務交付物、必要席位、跨單位依賴與事件卡推進五回合，而非以人格合拍度評分。

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

## 本機開啟

直接在瀏覽器開啟 `index.html` 即可。

## GitHub Pages

在 repo 的 `Settings > Pages` 設定：`Deploy from a branch`，選 `main` 與 `/root`。GitHub 會發布網站。