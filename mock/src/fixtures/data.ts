import type { Tag, TrackRecord } from '../domain/models';

export const tags: Tag[] = [
  { id: 'headache', name: '頭痛', group: '症状', role: 'symptom', archived: false },
  { id: 'fatigue', name: '倦怠感', group: '症状', role: 'symptom', archived: false },
  { id: 'tramadol', name: 'トラマドール', group: '薬', role: 'action', archived: false },
  { id: 'pregabalin', name: 'プレガバリン', group: '薬', role: 'action', archived: false },
  { id: 'meal', name: '食事', group: '行動', role: 'action', archived: false },
  { id: 'poor-sleep', name: '睡眠不足', group: '要因', role: 'event', archived: false },
];

export const todayRecords: TrackRecord[] = [
  {
    id: 'r3',
    timestamp: '2026-08-12T16:40:00+09:00',
    condition: 1,
    comment: '少し復旧。頭の不快感が下がった。',
    tags: [{ tagId: 'tramadol', value: 1 }],
  },
  {
    id: 'r2',
    timestamp: '2026-08-12T15:20:00+09:00',
    condition: -2,
    comment: '気分がまるで乗らない。心が痛むよう。',
    tags: [{ tagId: 'fatigue', value: 1 }],
  },
  {
    id: 'r1',
    timestamp: '2026-08-12T09:10:00+09:00',
    condition: 0,
    comment: '通常。',
    tags: [],
  },
];
