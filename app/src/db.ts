import Dexie, { type Table } from 'dexie';
import type { BackupPayload, Tag, TrackRecord } from './models';
import { defaultTags } from './models';
export { makeBackup, parseBackup } from './backup';

class SelfTrackDb extends Dexie {
  records!: Table<TrackRecord, string>;
  tags!: Table<Tag, string>;

  constructor() {
    super('self-track-v4');
    this.version(1).stores({ records: 'id,timestamp,condition', tags: 'id,name,group,role' });
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

export async function addRecord(record: TrackRecord) { await db.records.put(record); }
export async function deleteRecord(id: string) { await db.records.delete(id); }
export async function saveTag(tag: Tag) { await db.tags.put(tag); }

export async function resetLocalData() {
  await db.transaction('rw', db.records, db.tags, async () => {
    await db.records.clear();
    await db.tags.clear();
    await db.tags.bulkPut(defaultTags);
  });
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
