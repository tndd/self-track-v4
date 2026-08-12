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

export const conditionUiValue = (value: ConditionValue) => value + 3;

export const conditionLabel = (value: ConditionValue) =>
  ({ '-2': '最悪', '-1': '悪い', '0': '普通', '1': '良い', '2': '最高' })[String(value)]!;
