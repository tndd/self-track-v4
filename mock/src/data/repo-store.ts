export interface RepoEntry {
  path: string;
  kind: 'file' | 'directory';
  version?: string;
}

export interface RepoDocument {
  path: string;
  text: string;
  version: string;
}

export interface RepoWrite {
  path: string;
  text: string;
  message: string;
  expectedVersion?: string;
}

/**
 * Small versioned file store. Deliberately NOT a general database interface.
 */
export interface RepoStore {
  readText(path: string): Promise<RepoDocument | null>;
  list(path: string): Promise<RepoEntry[]>;
  writeText(input: RepoWrite): Promise<RepoDocument>;
  delete(path: string, expectedVersion: string): Promise<void>;
}
