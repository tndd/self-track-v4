const values: Array<number | null> = [null, null, null, null, null, 3, 4, 3, 2, 2, 3, 4, 4, 3, 2, 1, 2, 3, 4, 5, 4, 3, 3, 2, 3, 4, 4, 3, 2, 3, 4];

export function CalendarPage() {
  return (
    <main className="page">
      <div className="calendar-nav"><button className="circle-button">‹</button><strong>2026年8月</strong><button className="circle-button">›</button></div>
      <div className="calendar-grid" aria-label="2026年8月">
        {'日月火水木金土'.split('').map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
        {Array.from({ length: 6 }, (_, i) => <span key={`blank-${i}`} />)}
        {values.map((ui, index) => <div className={`calendar-day${ui ? ' has-value' : ''}`} data-ui={ui ?? undefined} key={index}>{index + 1}</div>)}
      </div>
      <div className="summary-grid">
        <section className="summary-card"><strong>今月</strong><p className="muted">日ごとの状態分布と月平均を置く領域。表現は後で差し替える。</p></section>
        <section className="summary-card"><strong>7日間の傾向</strong><p className="muted">時系列の傾向を置く領域。グラフライブラリは実装段階で確定する。</p></section>
      </div>
    </main>
  );
}
