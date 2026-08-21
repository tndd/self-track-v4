export type ConditionValue = -2 | -1 | 0 | 1 | 2;
export type TagRole = 'action' | 'symptom' | 'event';

export interface Tag {
  id: string;
  name: string;
  group: string;
  role: TagRole;
  archived: boolean;
}

export interface TagOccurrence {
  tagId: string;
  value: number;
}

export interface TrackRecord {
  id: string;
  timestamp: string;
  condition: ConditionValue;
  comment?: string;
  tags: TagOccurrence[];
}

export interface BackupPayload {
  format: 'self-track-v4';
  version: 1;
  exportedAt: string;
  records: TrackRecord[];
  tags: Tag[];
}

export const conditionUiValue = (value: ConditionValue) => value + 3;
export const conditionLabel = (value: ConditionValue) =>
  ({ '-2': '最悪', '-1': '悪い', '0': '普通', '1': '良い', '2': '最高' })[String(value)]!;

export const defaultTags: Tag[] = [
  { id: 'headache', name: '頭痛', group: '症状', role: 'symptom', archived: false },
  { id: 'fatigue', name: '倦怠感', group: '症状', role: 'symptom', archived: false },
  { id: 'tramadol', name: 'トラマドール', group: '薬', role: 'action', archived: false },
  { id: 'pregabalin', name: 'プレガバリン', group: '薬', role: 'action', archived: false },
  { id: 'meal', name: '食事', group: '行動', role: 'action', archived: false },
  { id: 'poor-sleep', name: '睡眠不足', group: '要因', role: 'event', archived: false },
];
