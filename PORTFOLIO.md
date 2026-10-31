# 待辦清單 Web App 作品集

這是我在 **GitHub Copilot 實戰工作坊**中完成的待辦清單 Web App。專案以純前端技術實作,並透過 GitHub Copilot 的 Agent Mode、MCP 與自訂的 agentic workflow 逐步建構與維護。

## 線上展示

https://hertzberg205020.github.io/copilot-workshop-agent-mode-mcp/

## 功能

- 新增待辦事項,空白內容不會被加入。
- 勾選標記完成,或取消完成。
- 刪除單筆待辦事項。
- 底部顯示「未完成:N 項」,數量以全部資料計算,不受篩選影響。
- 篩選檢視:全部 / 未完成 / 已完成。
- 篩選後若有項目被隱藏,會提示隱藏的筆數,並說明項目並未刪除。
- 清除所有已完成項目,執行前會跳出確認對話框;沒有已完成項目時按鈕為停用狀態。
- 深色 / 淺色模式切換,偏好會被記住;未手動切換時會跟隨作業系統設定。
- 待辦資料與主題偏好存在瀏覽器,重新整理後仍會保留。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 無框架、無套件、無建置流程,也沒有引用外部 CDN,可離線運作。
- 資料以 `localStorage` 儲存。
- 深淺色主題以 CSS 變數搭配 `prefers-color-scheme` 實作。
- 檔案結構:`index.html`(版面)、`styles.css`(樣式)、`app.js`(互動邏輯)。

## 開發方式

專案依工作坊的步驟,逐步使用 GitHub Copilot 的不同能力:

- **Agent Mode**:以需求描述請 Copilot 建立三個檔案,之後再跨檔案加入深色模式與篩選功能。
- **MCP**:在 [.vscode/mcp.json](.vscode/mcp.json) 設定 GitHub 與 Microsoft Learn 兩個 MCP Server,讓 Copilot 能讀取本 repo 的 issue 並查詢官方文件。
- **專案規範**:[.github/copilot-instructions.md](.github/copilot-instructions.md) 定義回覆語言、技術限制與程式風格,並要求動手前先說明變更計畫。
- **Agentic workflow**:[.github/prompts/fix-issue.prompt.md](.github/prompts/fix-issue.prompt.md) 將修復 issue 的流程寫成可重複執行的提示檔,步驟為讀取 issue、提出計畫並等待確認、建立分支、修改、說明驗證方式、提交推送、開 Pull Request。

功能變更紀錄請見 [CHANGELOG.md](CHANGELOG.md)。

## 我學到什麼

- Agent Mode 以目標為導向,Copilot 會自行規劃並跨多個檔案修改,與逐行自動補完的使用方式不同。
- 需求與限制寫得越明確,產出越接近預期;專案層級的規範檔能讓每次對話維持一致的規則。
- MCP 讓 Copilot 能存取本機檔案以外的資訊,例如 GitHub issue 與官方文件。
- 在動手前先確認計畫,並搭配版本控制,才能放心地審查與還原 AI 的修改。
- 將重複的工作流程寫成提示檔,可以納入版本控制、接受審查並重複使用。
