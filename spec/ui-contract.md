# UI 契約

## 1. 参照方針

- `self-track-v3/mock/track.html`、`calendar.html`、`menu.png` は、情報の優先順位と意図した操作の参考資料として有効。
- ただし、v4 の最終ビジュアルデザインを固定するものではない。
- mockではない v3 の HTML / Flutter レンダリング結果は参照対象ではなく、スクリーンショットへ合わせるために複製してはいけない。

## 2. 変更しやすさ自体を要件とする

後からUIを再設計しても、ドメイン・保存ロジックへ手を入れずに済む構造を維持する。

ルール:
- feature component 内へ16進カラー値を直書きしない。
- CSSで持てるレイアウト値を TS / TSX の magic number にしない。
- 意味ベースの CSS variable（`--surface`、`--condition-bad` など）を使う。
- status / tag の基本部品は再利用可能にする。
- ページ固有CSSは基本部品を組み合わせてよいが、storage / domain type を再定義しない。
- responsive breakpoint はdata logicではなくstyle側に置く。

## 3. v4.0 の見た目の目標

最初のskinは意図的に静かで最小限にする。
- 明るいneutral background
- mobile-firstのコンパクトなcontent column
- 明確な5段階condition scale
- tagはchip表示
- Todayの入力欄は下部に配置
- navigationは分かりやすく、狭い画面でも破綻しない

影、角丸、書体、装飾の細部は完成を妨げない。明らかなlayout崩れ、controlの欠け、押しにくいtap target、分かりにくいstate transitionは修正対象とする。

## 4. Today の操作状態

v3 mock を基に、少なくとも以下の状態へ到達できること。
1. timelineの通常状態
2. composerのoption展開
3. tag選択の展開
4. 選択済みtagの表示
5. 保存前にtag / commentが確認できる状態

presentationは簡略化してよいが、これらへ移るために不要な画面遷移を要求しない。

## 5. ブラウザQA契約

大きなUI変更では以下を行う。
- phone幅とdesktop幅の双方で起動する。
- 実際のcontrolを使ってnavigationする。
- Todayでcomposer展開、tag選択、保存まで操作する。
- 主要stateのスクリーンショットを取得する。
- overflow、過密表示、情報階層、壊れたcontrolがないかスクリーンショットを実際に目視する。
- DOM / computed style の調査は、目視で問題を見つけた後の切り分けに使う。

v3 mockとのpixel単位の一致は v4.0 の受け入れ条件ではない。
