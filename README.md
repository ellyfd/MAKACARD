# Skillforge Cards

一個可直接放上 GitHub Pages 的靜態卡牌遊戲。玩法靈感來自 Elly 本機 Claude skills 裡的 Makalot / Portal:M / StyTrix 組織架構，以及 Elly 偏好的溝通人格。

## 遊戲概念

玩家要在 6 回合內組出一個能服務 Elly 的策略代理：

- `清晰度` 來自 AI Journey Radar、Opportunity Window、Threat Warning
- `可靠度` 來自 Construction DB、Techpack Creation、Uncertainty Honesty
- `人格` 來自 So What、Concise With Edge、Senior Secretary Mode
- `組織` 來自 Makalot Core、Portal:M HUB、StyTrix、台發案
- `Drift 壓力` 太高就會失敗

## 來源轉譯

目前卡牌資料整理自本機 `Documents/Claude/Scheduled` 的 Claude skills：

- `client-ai-roadmap-weekly-analysis`: Makalot、StyTrix、Techpack Creation、Portal:M HUB、VivaTech 2026、台發案
- `brand-intel-weekly-strategy`: DB2/DB3 情報、AI Journey、機會窗口、威脅預警、行動建議
- `morning-schedule-digest`: Elly 偏好的資深秘書語氣、繁體中文、簡潔有力、不捏造、不客套

註：多個 skill 提到要載入 `elly-preferences skill`，但目前磁碟搜尋沒有找到該檔案本體；人格卡先依已讀到的晨報/週報 skill 規則轉譯。

## 在本機開啟

直接用瀏覽器開啟 `index.html` 即可，不需要安裝套件。

## 架到 GitHub Pages

1. 建立 GitHub repo。
2. 將本資料夾內容推上 GitHub。
3. 到 repo 的 `Settings > Pages`。
4. `Build and deployment` 選 `Deploy from a branch`。
5. Branch 選 `main`，資料夾選 `/root`。

完成後，GitHub 會提供公開網址。
