import type { BackupPayload, Tag, TrackRecord } from './models';

export function makeBackup(records: TrackRecord[], tags: Tag[]): BackupPayload {
  return { format: 'self-track-v4', version: 1, exportedAt: new Date().toISOString(), records, tags };
}

export function parseBackup(value: unknown): BackupPayload {
  if (!value || typeof value !== 'object') throw new Error('バックアップ形式が不正です');
  const candidate = value as Partial<BackupPayload>;
  if (candidate.format !== 'self-track-v4' || candidate.version !== 1) throw new Error('未対応のバックアップ形式です');
  if (!Array.isArray(candidate.records) || !Array.isArray(candidate.tags)) throw new Error('records / tags がありません');
  for (const record of candidate.records) {
    if (!record || typeof record !== 'object') throw new Error('record が不正です');
    const item = record as TrackRecord;
    if (typeof item.id !== 'string' || typeof item.timestamp !== 'string' || ![-2, -1, 0, 1, 2].includes(item.condition) || !Array.isArray(item.tags)) throw new Error('record の内容が不正です');
  }
  for (const tag of candidate.tags) {
    if (!tag || typeof tag !== 'object') throw new Error('tag が不正です');
    const item = tag as Tag;
    if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.group !== 'string' || !['action', 'symptom', 'event'].includes(item.role)) throw new Error('tag の内容が不正です');
  }
  return candidate as BackupPayload;
}
