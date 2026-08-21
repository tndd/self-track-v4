# アーキテクチャ

## 1. レイヤー構造

```text
UI / features
    ↓ ドメイン向け repository のみ参照
self-track domain
    ↓
SelfTrackRepository
    ↓
RepoStore + 任意の LocalReplica
    ↓
GitHub repository（将来のリモート正本）
```

依存方向は下向きに限定する。GitHub固有の処理を React の feature component に持ち込まない。

v4.0 の本番アプリでは IndexedDB を日常利用の永続化先として使う。上記の GitHub-backed 構成は v4.1 以降のリモート同期境界を示すものであり、v4.0 の利用に必須ではない。

## 2. ディレクトリ境界

想定する責務分割は以下。

```text
src/
  app/          routing とアプリ全体の構成
  components/   再利用可能な表示コンポーネント
  domain/       モデルと純粋なアルゴリズム
  data/         保存interface・adapter・sync境界
  features/     画面単位のUIと状態
  fixtures/     mock専用データ
  styles/       共通tokenとskin
```

将来のデザイン変更では、主として `components/`、`features/*/*.css`、token値を差し替える。`domain/` や `data/` の書き直しを要求してはならない。

## 3. RepoStore: 狭い汎用層

RepoStore は**データベース抽象化ではない**。小規模な個人データ向けの、version付き document / event store adapter として扱う。

必要な形:

```ts
export interface RepoStore {
  readText(path: string): Promise<RepoDocument | null>;
  list(path: string): Promise<RepoEntry[]>;
  writeText(input: RepoWrite): Promise<RepoDocument>;
  delete(path: string, expectedVersion: string): Promise<void>;
}
```

`expectedVersion` は Git の blob / content SHA に自然に対応し、競合を明示的に扱える。

対象外:
- 任意クエリ
- join
- 多数Recordをまたぐtransaction
- 高頻度write
- 多人数向けrow locking

## 4. リモート正本のデータ配置案

個人記録には、ソースコードとは別の**非公開**リポジトリを使う。

```text
schema/
  version.json
catalog/
  tags.json
events/
  2026/
    08/
      2026-08-12.jsonl
      2026-08-13.jsonl
```

日単位の JSONL にすると、append中心のイベント履歴を小さく保ち、人間が直接読め、Git diffでも追いやすい。タグや設定は通常のversion付きdocumentとして保存する。

## 5. ローカル保存とオフライン経路

「保存」操作をネットワーク成功に依存させない。

v4.0:
1. Record / Tag を IndexedDB に保存する。
2. UIへ即時反映する。
3. JSON export / import で持ち運び可能性を確保する。

v4.1 以降でリモート同期を追加する場合:
1. ローカル変更を outbox として扱う。
2. GitHubへのwriteをbatch / serializeする。
3. リモートversion / SHAで競合を検出する。
4. 起動時やfocus時にリモート変更を取得し、reconcileする。

GitHub同期を導入した後も、ネットワーク障害によって日常の記録操作が失敗する設計にはしない。

## 6. 認証境界

ブラウザ用tokenをソースへ直書きしてはいけない。productionの認証方式は、GitHub APIをブラウザから直接呼ぶか、薄い信頼済みproxyを挟むかにも影響するため、v4.1 の独立した設計判断とする。

モックには認証を持ち込まない。

## 7. Vite を使う理由

self-track は主として対話型の個人用 SPA / PWA であり、現時点では SSR、SEO、Server Components は要件ではない。既存の Vite / React / TypeScript の構成を再利用することで、不要なアーキテクチャ選択を減らし、ブラウザQAの反復を短くする。
