# self-track-v4

Vite + React + TypeScript で作り直した、個人用の体調・行動記録アプリです。

## 公開ページ

- **本番アプリ:** https://tndd.github.io/self-track-v4/app/
- **操作モック:** https://tndd.github.io/self-track-v4/mock/
- **仕様書:** https://tndd.github.io/self-track-v4/spec/
- **Pages入口:** https://tndd.github.io/self-track-v4/

本番アプリ・モック・仕様書は意図的に分離しています。`app/` は日常利用する本番面、`mock/` は交換可能な操作・情報設計の実験用、`spec/` は採用済みの製品・ドメイン・アーキテクチャ判断を記録する正本です。

## v4.0 の範囲

v4.0 は、実際に完成させて毎日使える大きさへ意図的に絞っています。

- Today: 体調・タグ・コメントを IndexedDB に保存
- Calendar / 履歴: 月・日単位で過去の記録を閲覧
- Tags: タグの作成・編集・アーカイブ・復元
- Settings: ローカル保存状態、JSON の書き出し・読み込み、全データ初期化
- 本番アプリには fixture の体調記録を含めない

GitHub を正本とする自動同期・認証・競合解決と統計分析は、日常利用を妨げないよう v4.1 以降へ延期しています。

## リポジトリ構成

```text
app/               日常利用する本番アプリ
mock/              Vite + React の操作モック
spec/              Markdown で管理する仕様書の正本
scripts/           仕様書・Pages のビルドスクリプト
.github/workflows/ 検証と GitHub Pages デプロイ
```

## 正本の優先順位

1. `spec/` — 製品・データ・アーキテクチャ判断の正本。
2. `app/` — 現在の本番実装。
3. `mock/` — 交換可能な操作・見た目の試作。参考資料ではあるが仕様そのものではない。
4. `self-track-v3/mock/` — Today / Calendar / ナビゲーションの旧版参考資料。
5. `self-track-v3/docs/` と `lib/domain/` — 旧版のドメイン規則、データ意味論、分析挙動の参考資料。

## 開発

```sh
npm install
npm run dev          # 本番アプリ
npm run dev:mock     # 操作モック
npm run typecheck
npm test
npm run build:pages  # app + mock + 仕様書を含む Pages 全体
```

## 永続化とプライバシー

v4.0 の個人記録はブラウザの IndexedDB に保存します。持ち運べるバックアップが必要な場合は Settings から JSON を書き出してください。JSON は人間が直接読め、アプリ本体に依存しない形式です。

実際の体調・個人記録をこのソースリポジトリへコミットしてはいけません。v4.1 以降では、別の非公開 GitHub データリポジトリをリモート側の正本にする予定です。
