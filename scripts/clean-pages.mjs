import { rm } from 'node:fs/promises';

await rm(new URL('../dist-pages/', import.meta.url), { recursive: true, force: true });
