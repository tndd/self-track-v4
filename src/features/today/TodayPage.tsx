import { useMemo, useState } from 'react';
import { StatusScale } from '../../components/StatusScale';
import { conditionLabel, conditionUiValue, type ConditionValue, type TrackRecord } from '../../domain/models';
import { tags as fixtureTags, todayRecords as fixtureRecords } from '../../fixtures/data';

export function TodayPage() {
  const [records, setRecords] = useState<TrackRecord[]>(fixtureRecords);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [condition, setCondition] = useState<ConditionValue>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');

  const tagsById = useMemo(() => new Map(fixtureTags.map((tag) => [tag.id, tag])), []);
  const groups = useMemo(() => {
    const grouped = new Map<string, typeof fixtureTags>();
    for (const tag of fixtureTags.filter((item) => !item.archived)) {
      const group = grouped.get(tag.group) ?? [];
      group.push(tag);
      grouped.set(tag.group, group);
    }
    return grouped;
  }, []);

  const toggleTag = (id: string) => setSelectedTags((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const save = () => {
    const now = new Date();
    setRecords((current) => [{
      id: crypto.randomUUID(),
      timestamp: now.toISOString(),
      condition,
      comment: comment.trim() || undefined,
      tags: selectedTags.map((tagId) => ({ tagId, value: 1 })),
    }, ...current]);
    setComment('');
    setSelectedTags([]);
    setCondition(0);
    setPanelOpen(false);
    setTagsOpen(false);
  };

  return (
    <>
      <main className="page">
        <section className="timeline" aria-label="今日の記録">
          {records.map((record) => {
            const date = new Date(record.timestamp);
            const ui = conditionUiValue(record.condition);
            return (
              <article className="timeline-item" key={record.id}>
                <time className="timeline-time">{date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</time>
                <div className="timeline-body">
                  <div className="status-line"><span className="status-dot" data-ui={ui}>{ui}</span>{conditionLabel(record.condition)}</div>
                  {!!record.tags.length && <div className="tags">{record.tags.map(({ tagId }) => <span className="tag" key={tagId}>{tagsById.get(tagId)?.name ?? tagId}</span>)}</div>}
                  {record.comment && <p className="comment">{record.comment}</p>}
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <div className="composer-wrap">
        <div className="composer">
          {panelOpen && (
            <div className="composer-panel">
              {tagsOpen && (
                <div className="tag-panel">
                  {[...groups.entries()].map(([group, groupTags]) => (
                    <div className="tag-group" key={group}>
                      <div className="tag-group-title">{group}</div>
                      <div className="tags">
                        {groupTags.map((tag) => <button className={`tag${selectedTags.includes(tag.id) ? ' selected' : ''}`} type="button" key={tag.id} onClick={() => toggleTag(tag.id)}>{tag.name}</button>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="panel-head"><span>Status</span><button className="text-button" type="button" onClick={() => setTagsOpen((value) => !value)}>{tagsOpen ? 'タグを閉じる' : 'タグを追加'}</button></div>
              <StatusScale value={condition} onChange={setCondition} />
            </div>
          )}
          {!!selectedTags.length && <div className="tags">{selectedTags.map((id) => <button className="tag selected" type="button" key={id} onClick={() => toggleTag(id)}>{tagsById.get(id)?.name} ×</button>)}</div>}
          <div className="composer-row">
            <button className="circle-button" type="button" aria-label="状態とタグ" onClick={() => setPanelOpen((value) => !value)}>＋</button>
            <input aria-label="コメント" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="コメントを書く…" />
            <button className="circle-button" type="button" aria-label="記録" onClick={save}>↑</button>
          </div>
        </div>
      </div>
    </>
  );
}
