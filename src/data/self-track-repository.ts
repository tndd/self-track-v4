import type { Tag, TrackRecord } from '../domain/models';

export interface SelfTrackRepository {
  listRecords(fromInclusive: Date, toExclusive: Date): Promise<TrackRecord[]>;
  saveRecord(record: TrackRecord): Promise<void>;
  deleteRecord(id: string): Promise<void>;
  listTags(options?: { includeArchived?: boolean }): Promise<Tag[]>;
}
