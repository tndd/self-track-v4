# v3 → v4 移行メモ

## 維持するもの
- 例外・変化を中心に疎に記録する思想
- condition score の意味
- tag と archive 済み履歴の意味
- 12時間で通常状態へ戻る規則
- 日次AUCモデル
- event-locked average
- Fisher / odds ratio / lift を使う分析方針
- Today / Calendar / Analysis / Tags / Settings の情報構造
- `mock/` で確認できた有効な操作案

## そのまま引き継がないもの
- Flutter widget とlayout実装
- Drift / Riverpod への結合
- v3 のレンダリング済み HTML / Web の挙動
- 端末内保存だけを前提にした設計
- 旧実装の都合で生じた見た目のずれ

## 再構築の順序

当初の段階案は以下だった。
1. 仕様書 + fixture駆動mock
2. domain algorithmを純粋な TypeScript へ移植し、v3 のtest vectorで検証
3. local fixture 上の SelfTrackRepository
4. RepoStore GitHub adapter + local outbox
5. v3 data のexport / migration経路
6. 最終的なvisual redesignとPWAの磨き込み

v4.0 では「日常利用できる状態」を先に完成させるため、4より先に IndexedDB による本番ローカル保存と JSON backup / restore を導入した。GitHub同期は v4.1 以降へ移し、分析・最終デザインと同様に v4.0 の完成を妨げないものとする。
