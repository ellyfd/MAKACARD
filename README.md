# MAKACARD

一個可直接放上 GitHub Pages 的靜態 Team Chemistry Deck。玩法把 Makalot 團隊成員做成平等人物卡，結合組織角色、溝通偏好與任務情境，分析跨單位隊形在工作事件中的合拍度。

## 遊戲概念

MAKACARD 目前有三個頁面：

- `成員總覽`：成員人物卡，含部門、角色與生日。
- `Chemistry Lab`：選兩個人 + 一個工作情境 + 一張溝通策略卡，計算 Work Fit、Communication、Decision、Stress Friction。
- `Meeting Game`：用 5 回合推進一個專案，透過選人與溝通策略提高 Trust、Clarity、Momentum 並降低 Friction。

## 資料層

每個人物卡目前包含三層：

- `組織層`：部門、職務、專案位置。
- `行為層`：結論需求、脈絡需求、節奏、風險敏感度、資料依賴、情緒溫度。
- `基本資料`：生日只保留月日；遊戲判斷以 org、職等、決策權、直屬關係與任務情境為主。

第一版先以 DPC、數發、Portal:M 相關成員作為 MVP。行為層是可調整的推論值，之後可以用會議紀錄、Teams、Email、Notion 摘要或 Elly 的人工標註校準。

## 在本機開啟

直接用瀏覽器開啟 `index.html` 即可，不需要安裝套件。

## 架到 GitHub Pages

1. 建立 GitHub repo。
2. 將本資料夾內容推上 GitHub。
3. 到 repo 的 `Settings > Pages`。
4. `Build and deployment` 選 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/root`。

完成後，GitHub 會提供公開網址。
