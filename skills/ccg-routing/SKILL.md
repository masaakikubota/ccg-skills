# CCG Multi-Model Routing Skill

CCG（Claude + Codex + Gemini）ワークフローのためのマルチモデルルーティングルール。

## 利用可能なツール

### 1. ask_codex
**用途:** バックエンド・ロジック・アルゴリズム・デバッグ

以下のタスクに使用:
- API 設計・実装
- データベース操作（SQL, PostgreSQL, MySQL, MongoDB）
- サーバーサイドロジック
- 認証・認可の実装
- パフォーマンス最適化
- バッチ処理・キュー・ワーカー
- GraphQL / REST API
- アルゴリズムの実装
- デバッグ・エラー解析

**専門家ロール:**
- `architect`: システム設計・アーキテクチャ
- `analyzer`: コード分析
- `debugger`: デバッグ・問題解決
- `optimizer`: パフォーマンス最適化
- `reviewer`: コードレビュー
- `tester`: テスト作成

### 2. ask_gemini
**用途:** フロントエンド・UI・CSS・コンポーネント設計

以下のタスクに使用:
- React / Vue / Angular コンポーネント
- CSS / SCSS / Tailwind スタイリング
- UI/UX デザイン実装
- レスポンシブデザイン
- アニメーション
- フォーム・モーダル・ナビゲーション
- Next.js / Nuxt / Svelte

**専門家ロール:**
- `frontend`: フロントエンド専門
- `analyzer`: コード分析
- `debugger`: デバッグ・問題解決
- `optimizer`: パフォーマンス最適化
- `reviewer`: コードレビュー
- `tester`: テスト作成

### 3. ask_both
**用途:** 両モデルの回答を比較・検証

以下の場合に使用:
- 複数の視点が欲しい場合
- 回答の交差検証が必要な場合
- フルスタックな質問
- どちらのモデルが適切か不明な場合

### 4. smart_route
**用途:** 自動でモデルを選択

タスク内容を分析し、キーワードベースで最適なモデルを自動選択。
- フロントエンド関連キーワードが多い → Gemini
- バックエンド関連キーワードが多い → Codex
- 同点の場合 → Codex（デフォルト）

## ルーティング判断基準

### Gemini を選択するキーワード
```
react, vue, angular, css, scss, sass, tailwind, html, ui, ux,
component, frontend, フロントエンド, コンポーネント, スタイル,
レイアウト, responsive, レスポンシブ, animation, アニメーション,
design, デザイン, button, ボタン, form, フォーム, modal, モーダル,
navigation, ナビ, next.js, nuxt, svelte
```

### Codex を選択するキーワード
```
api, database, db, sql, postgresql, mysql, mongodb, server,
backend, バックエンド, node, express, fastapi, django,
authentication, 認証, authorization, 認可, algorithm, アルゴリズム,
logic, ロジック, debug, デバッグ, error, エラー, performance,
パフォーマンス, cache, キャッシュ, queue, キュー, worker, cron,
batch, バッチ, graphql, rest, microservice
```

## 使用例

### バックエンドタスク
```
「このAPIのN+1問題を解決して」
→ ask_codex を使用

「PostgreSQLのインデックスを最適化して」
→ ask_codex (role: optimizer) を使用
```

### フロントエンドタスク
```
「Reactでモーダルコンポーネントを作って」
→ ask_gemini を使用

「Tailwindでレスポンシブなナビゲーションを作って」
→ ask_gemini (role: frontend) を使用
```

### 比較・検証
```
「このアーキテクチャの設計について意見を聞きたい」
→ ask_both を使用して両モデルの視点を比較
```

### 自動選択
```
「このコードをリファクタリングして」
→ smart_route を使用して自動判断
```

## 注意事項

- Claude Code が「コードの主権」を持つ
- 外部モデルの出力はそのまま使わず、参考情報として活用
- タイムアウトは5分（300秒）
