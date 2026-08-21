import { StrictMode, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { ChangeEvent, FormEvent } from 'react';
import { addRecord, deleteRecord, makeBackup, parseBackup, readSnapshot, resetLocalData, restoreBackup, saveTag } from './db';
import { conditionLabel, conditionUiValue, type ConditionValue, type Tag, type TagRole, type TrackRecord } from './models';
import './styles.css';

const conditionValues: ConditionValue[] = [-2, -1, 0, 1, 2];
const pages = ['today', 'calendar', 'tags', 'settings'] as const;
type Page = (typeof pages)[number];

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }).format(date);
}
function formatTime(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
function dateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function App() {
  const [page, setPage] = useState<Page>('today');
  const [records, setRecords] = useState<TrackRecord[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const [condition, setCondition] = useState<ConditionValue>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(() => dateKey(new Date()));
  const [tagDraft, setTagDraft] = useState({ name: '', group: '症状', role: 'symptom' as TagRole });

  const refresh = async () => {
    const snapshot = await readSnapshot();
    setRecords(snapshot.records);
    setTags(snapshot.tags);
    setReady(true);
  };

  useEffect(() => { void refresh(); }, []);

  const tagsById = useMemo(() => new Map(tags.map((tag) => [tag.id, tag])), [tags]);
  const activeTags = useMemo(() => tags.filter((tag) => !tag.archived), [tags]);
  const today = dateKey(new Date());
  const todayRecords = useMemo(() => records.filter((record) => dateKey(record.timestamp) === today), [records, today]);

  const saveRecord = async () => {
    const hasContent = condition !== 0 || selectedTags.length > 0 || comment.trim().length > 0;
    if (!hasContent) {
      setNotice('状態・タグ・コメントのどれかを入力してください');
      return;
    }
    await addRecord({
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      condition,
      comment: comment.trim() || undefined,
      tags: selectedTags.map((tagId) => ({ tagId, value: 1 })),
    });
    setCondition(0);
    setSelectedTags([]);
    setComment('');
    setComposerOpen(false);
    setNotice('保存しました');
    await refresh();
  };

  const removeRecord = async (record: TrackRecord) => {
    if (!confirm(`${formatTime(record.timestamp)} の記録を削除しますか？`)) return;
    await deleteRecord(record.id);
    await refresh();
  };

  const createTag = async (event: FormEvent) => {
    event.preventDefault();
    const name = tagDraft.name.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g, '-')}-${crypto.randomUUID().slice(0, 8)}`;
    await saveTag({ id, name, group: tagDraft.group.trim() || 'その他', role: tagDraft.role, archived: false });
    setTagDraft((current) => ({ ...current, name: '' }));
    await refresh();
  };

  const editTag = async (tag: Tag) => {
    const name = prompt('タグ名', tag.name);
    if (name === null || !name.trim()) return;
    const group = prompt('グループ', tag.group);
    if (group === null) return;
    await saveTag({ ...tag, name: name.trim(), group: group.trim() || 'その他' });
    await refresh();
  };

  const toggleArchive = async (tag: Tag) => {
    await saveTag({ ...tag, archived: !tag.archived });
    setSelectedTags((current) => current.filter((id) => id !== tag.id));
    await refresh();
  };

  const exportBackup = () => {
    const payload = makeBackup(records, tags);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `self-track-${dateKey(new Date())}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const payload = parseBackup(JSON.parse(await file.text()));
      if (!confirm(`記録 ${payload.records.length} 件・タグ ${payload.tags.length} 件で現在のローカルデータを置き換えますか？`)) return;
      await restoreBackup(payload);
      setSelectedTags([]);
      setNotice('バックアップを復元しました');
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : '復元に失敗しました');
    }
  };

  const reset = async () => {
    if (!confirm('ローカルの記録をすべて削除します。先にエクスポートしましたか？')) return;
    if (!confirm('本当に削除しますか？ この操作は元に戻せません。')) return;
    await resetLocalData();
    setSelectedTags([]);
    setNotice('ローカルデータを初期化しました');
    await refresh();
  };

  if (!ready) return <div className="loading">self-track を読み込み中…</div>;

  return (
    <div className="app-shell">
      <header className="app-bar">
        <div>
          <h1>self-track</h1>
          <p>{page === 'today' ? formatDate(new Date()) : pageLabel(page)}</p>
        </div>
        <span className="local-badge">ローカル</span>
      </header>

      <nav className="top-nav" aria-label="主要ナビゲーション">
        {pages.map((item) => <button key={item} className={page === item ? 'active' : ''} onClick={() => setPage(item)}>{pageLabel(item)}</button>)}
      </nav>

      {notice && <button className="notice" onClick={() => setNotice('')}>{notice} ×</button>}

      {page === 'today' && (
        <main className="page today-page">
          <section className="records" aria-label="今日の記録">
            {todayRecords.length === 0 && <div className="empty">今日はまだ記録がありません。</div>}
            {todayRecords.map((record) => <RecordCard key={record.id} record={record} tagsById={tagsById} onDelete={() => void removeRecord(record)} />)}
          </section>
          <div className="composer-wrap">
            <div className="composer">
              {composerOpen && (
                <div className="composer-panel">
                  <div className="condition-grid">
                    {conditionValues.map((value) => <button key={value} className={condition === value ? 'selected condition-button' : 'condition-button'} onClick={() => setCondition(value)}><span className="status-dot" data-ui={conditionUiValue(value)}>{conditionUiValue(value)}</span>{conditionLabel(value)}</button>)}
                  </div>
                  <div className="tag-picker">
                    {activeTags.map((tag) => <button key={tag.id} className={selectedTags.includes(tag.id) ? 'tag selected' : 'tag'} onClick={() => setSelectedTags((current) => current.includes(tag.id) ? current.filter((id) => id !== tag.id) : [...current, tag.id])}>{tag.name}</button>)}
                  </div>
                </div>
              )}
              <div className="composer-row">
                <button className="round" aria-label="状態とタグ" onClick={() => setComposerOpen((value) => !value)}>＋</button>
                <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="コメントを書く…" onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing) void saveRecord(); }} />
                <button className="round primary" aria-label="保存" onClick={() => void saveRecord()}>↑</button>
              </div>
              {selectedTags.length > 0 && <div className="selected-row">{selectedTags.map((id) => <span className="tag selected" key={id}>{tagsById.get(id)?.name ?? id}</span>)}</div>}
            </div>
          </div>
        </main>
      )}

      {page === 'calendar' && <CalendarPage records={records} tagsById={tagsById} month={month} setMonth={setMonth} selectedDay={selectedDay} setSelectedDay={setSelectedDay} onDelete={removeRecord} />}

      {page === 'tags' && (
        <main className="page">
          <form className="tag-form card" onSubmit={(event) => void createTag(event)}>
            <input aria-label="タグ名" placeholder="タグ名" value={tagDraft.name} onChange={(event) => setTagDraft({ ...tagDraft, name: event.target.value })} />
            <input aria-label="グループ" placeholder="グループ" value={tagDraft.group} onChange={(event) => setTagDraft({ ...tagDraft, group: event.target.value })} />
            <select aria-label="種類" value={tagDraft.role} onChange={(event) => setTagDraft({ ...tagDraft, role: event.target.value as TagRole })}>
              <option value="symptom">症状</option><option value="action">行動 / 薬</option><option value="event">要因 / イベント</option>
            </select>
            <button className="primary-action">追加</button>
          </form>
          <div className="tag-list">
            {tags.map((tag) => <div className="card tag-row" key={tag.id}><div><strong>{tag.name}</strong><small>{tag.group} · {tagRoleLabel(tag.role)}{tag.archived ? ' · アーカイブ済み' : ''}</small></div><div className="tag-actions"><button onClick={() => void editTag(tag)}>編集</button><button onClick={() => void toggleArchive(tag)}>{tag.archived ? '復元' : 'アーカイブ'}</button></div></div>)}
          </div>
        </main>
      )}

      {page === 'settings' && (
        <main className="page settings-grid">
          <section className="card"><h2>ローカル保存</h2><p>IndexedDB に記録 {records.length} 件、タグ {tags.length} 件を保存しています。ブラウザを閉じても残ります。</p></section>
          <section className="card"><h2>バックアップ</h2><p>JSONはアプリなしでも読める形式です。GitHub同期を入れるまでは定期的なエクスポートを推奨します。</p><div className="actions"><button className="primary-action" onClick={exportBackup}>JSONを書き出す</button><label className="file-action">JSONを読み込む<input type="file" accept="application/json,.json" onChange={(event) => void importBackup(event)} /></label></div></section>
          <section className="card danger"><h2>ローカルデータを初期化</h2><p>記録を削除し、タグだけ既定値へ戻します。</p><button onClick={() => void reset()}>すべて削除</button></section>
          <section className="card"><h2>v4.1 以降へ延期</h2><p>GitHub自動同期・認証・競合解決・統計分析は、v4.0の日常利用を妨げないよう切り離しています。</p></section>
        </main>
      )}
    </div>
  );
}

function RecordCard({ record, tagsById, onDelete }: { record: TrackRecord; tagsById: Map<string, Tag>; onDelete: () => void }) {
  return <article className="record card"><div className="record-time">{formatTime(record.timestamp)}</div><div className="record-main"><div className="status-line"><span className="status-dot" data-ui={conditionUiValue(record.condition)}>{conditionUiValue(record.condition)}</span><strong>{conditionLabel(record.condition)}</strong></div>{record.tags.length > 0 && <div className="tag-picker">{record.tags.map(({ tagId }) => <span className="tag" key={tagId}>{tagsById.get(tagId)?.name ?? tagId}</span>)}</div>}{record.comment && <p>{record.comment}</p>}</div><button className="delete" aria-label="記録を削除" onClick={onDelete}>…</button></article>;
}

function CalendarPage({ records, tagsById, month, setMonth, selectedDay, setSelectedDay, onDelete }: { records: TrackRecord[]; tagsById: Map<string, Tag>; month: Date; setMonth: (date: Date) => void; selectedDay: string; setSelectedDay: (value: string) => void; onDelete: (record: TrackRecord) => Promise<void> }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const days = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const byDay = useMemo(() => {
    const map = new Map<string, TrackRecord[]>();
    for (const record of records) {
      const key = dateKey(record.timestamp);
      const list = map.get(key) ?? [];
      list.push(record);
      map.set(key, list);
    }
    return map;
  }, [records]);
  const selected = byDay.get(selectedDay) ?? [];
  const moveMonth = (offset: number) => {
    const next = new Date(year, monthIndex + offset, 1);
    setMonth(next);
    setSelectedDay(dateKey(next));
  };
  return <main className="page"><div className="calendar-nav"><button onClick={() => moveMonth(-1)}>‹</button><strong>{year}年{monthIndex + 1}月</strong><button onClick={() => moveMonth(1)}>›</button></div><div className="calendar-grid">{'日月火水木金土'.split('').map((day) => <div className="weekday" key={day}>{day}</div>)}{Array.from({ length: firstWeekday }, (_, index) => <span key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => { const key = dateKey(new Date(year, monthIndex, index + 1)); const dayRecords = byDay.get(key) ?? []; const last = dayRecords[0]; return <button key={key} className={selectedDay === key ? 'day selected-day' : 'day'} data-ui={last ? conditionUiValue(last.condition) : undefined} onClick={() => setSelectedDay(key)}><span>{index + 1}</span>{dayRecords.length > 0 && <small>{dayRecords.length}</small>}</button>; })}</div><section className="day-detail"><h2>{selectedDay}</h2>{selected.length === 0 ? <div className="empty">記録はありません。</div> : selected.map((record) => <RecordCard key={record.id} record={record} tagsById={tagsById} onDelete={() => void onDelete(record)} />)}</section></main>;
}

function pageLabel(page: Page) { return ({ today: '今日', calendar: '履歴', tags: 'タグ', settings: '設定' })[page]; }
function tagRoleLabel(role: TagRole) { return ({ symptom: '症状', action: '行動 / 薬', event: '要因 / イベント' })[role]; }

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
