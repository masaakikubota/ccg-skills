# CCG MCP Server

Claude Code から Codex CLI / Gemini CLI を自動で呼び出すための MCP サーバー。

## 前提条件

- Node.js 18+
- CCG がインストール済み（`npx ccg-workflow`）
- `~/.claude/bin/codeagent-wrapper` が存在すること
- Codex CLI / Gemini CLI がセットアップ済み

## インストール

```bash
cd ~/.claude/mcp-servers/ccg-mcp-server
npm install
```

## 提供ツール

### ask_codex

バックエンド・ロジック・アルゴリズム・デバッグのタスク向け。

**パラメータ:**
- `task` (必須): Codex に依頼するタスク内容
- `workdir`: 作業ディレクトリ（デフォルト: "."）
- `role`: 専門家ロール（architect, analyzer, debugger, optimizer, reviewer, tester）

### ask_gemini

フロントエンド・UI・CSS・コンポーネント設計向け。

**パラメータ:**
- `task` (必須): Gemini に依頼するタスク内容
- `workdir`: 作業ディレクトリ（デフォルト: "."）
- `role`: 専門家ロール（frontend, analyzer, debugger, optimizer, reviewer, tester）

### ask_both

両方のモデルに同じ質問を送り、回答を比較する。

**パラメータ:**
- `task` (必須): 両モデルに依頼するタスク内容
- `workdir`: 作業ディレクトリ（デフォルト: "."）

### smart_route

タスク内容を分析し、最適なモデルを自動選択する。

**パラメータ:**
- `task` (必須): 実行したいタスク内容
- `workdir`: 作業ディレクトリ（デフォルト: "."）

## Claude Code 設定

`~/.claude/settings.json` に以下を追加:

```json
{
  "mcpServers": {
    "ccg": {
      "command": "node",
      "args": ["/Users/masaaki/.claude/mcp-servers/ccg-mcp-server/index.js"]
    }
  }
}
```

## テスト

```bash
# サーバー単体起動テスト
node index.js
# Ctrl+C で終了
```

## ルーティングロジック

### フロントエンド向け（→ Gemini）

react, vue, angular, css, scss, tailwind, html, ui, ux, component, frontend, design, button, form, modal, next.js, nuxt, svelte など

### バックエンド向け（→ Codex）

api, database, sql, server, backend, node, express, fastapi, django, authentication, algorithm, debug, performance, cache, graphql, rest など

スコアが同点の場合は Codex がデフォルト。
