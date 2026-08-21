import { describe, expect, it } from 'vitest';
import { makeBackup, parseBackup } from './backup';

const record = { id: 'r1', timestamp: '2026-08-22T00:00:00.000Z', condition: 0 as const, tags: [] };
const tag = { id: 't1', name: 'test', group: 'test', role: 'event' as const, archived: false };

describe('backup format', () => {
  it('round-trips valid data', () => {
    const payload = makeBackup([record], [tag]);
    expect(parseBackup(JSON.parse(JSON.stringify(payload)))).toMatchObject({ format: 'self-track-v4', version: 1, records: [record], tags: [tag] });
  });

  it('rejects unsupported data', () => {
    expect(() => parseBackup({ format: 'other', version: 1, records: [], tags: [] })).toThrow();
  });
});
