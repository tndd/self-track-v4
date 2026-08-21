import Dexie, { type Table } from 'dexie';
import type { BackupPayload, Tag, TrackRecord } from './models';
import { defaultTags } from './models';

class SelfTrackDb extends Dexie {
  records!: Table<TrackRecord, string>;
  tags!: Table<Tag, string>;

  constructor() {
    super('self-track-v4');
    this.version(1).stores({
      records: 'id,timestamp,condition',
      tags: 'id,name,group,role,archived',
    });
  }
}

export const db = new SelfTrackDb();

export async function ensureSeedData() {
  if ((await db.tags.count()) === 0) await db.tags.bulkPut(defaultTags);
}

export async function readSnapshot() {
  await ensureSeedData();
  const [records, tags] = await Promise.all([
    db.records.orderBy('timestamp').reverse().toArray(),
    db.tags.orderBy('name').toArray(),
  ]);
  return { records, tags };
}

export async function addRecord(record: TrackRecord) {
  await db.records.put(record);
}

export async function deleteRecord(id: string) {
  await db.records.delete(id);
}

export async function saveTag(tag: Tag) {
  await db.tags.put(tag);
}

export async function resetLocalData() {
  await db.transaction('rw', db.records, db.tags, async () => {
    await db.records.clear();
    await db.tags.clear();
    await db.tags.bulkPut(defaultTags);
  });
}

export function makeBackup(records: TrackRecord[], tags: Tag[]): BackupPayload {
  return {
    format: 'self-track-v4',
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
    tags,
  };
}

export function parseBackup(value: unknown): BackupPayload {
  if (!value || typeof value !== 'object') throw new Error('バックアップ形式が不正です');
  const candidate = value as Partial<BackupPayload>;
  if (candidate.format !== 'self-track-v4' || candidate.version !== 1) throw new Error('未対応のバックアップ形式です');
  if (!Array.isArray(candidate.records) || !Array.isArray(candidate.tags)) throw new Error('records / tags がありません');
  for (const record of candidate.records) {
    if (!record || typeof record !== 'object') throw new Error('record が不正です');
    const item = record as TrackRecord;
    if (typeof item.id !== 'string' || typeof item.timestamp !== 'string' || ![-2, -1, 0, 1, 2].includes(item.condition) || !Array.isArray(item.tags)) {
      throw new Error('record の内容が不正です');
    }
  }
  for (const tag of candidate.tags) {
    if (!tag || typeof tag !== 'object') throw new Error('tag が不正です');
    const item = tag as Tag;
    if (typeof item.id !== 'string' || typeof item.name !== 'string' || typeof item.group !== 'string' || !['action', 'symptom', 'event'].includes(item.role)) {
      throw new Error('tag の内容が不正です');
    }
  }
  return candidate as BackupPayload;
}

export async function restoreBackup(payload: BackupPayload) {
  await db.transaction('rw', db.records, db.tags, async () => {
    await db.records.clear();
    await db.tags.clear();
    if (payload.records.length) await db.records.bulkPut(payload.records);
    if (payload.tags.length) await db.tags.bulkPut(payload.tags);
    else await db.tags.bulkPut(defaultTags);
  });
}
