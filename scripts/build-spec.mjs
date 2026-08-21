import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDir = join(root, 'spec');
const outDir = join(root, 'dist-pages', 'spec');

const docs = [
  ['product-spec.md', '製品仕様', '目的、スコープ、データ意味論、主要機能'],
  ['architecture.md', 'アーキテクチャ', 'RepoStore、データ境界、レイヤー構成'],
  ['ui-contract.md', 'UI契約', '変更耐性を優先したUIの契約と受け入れ基準'],
  ['migration-notes.md', '移行メモ', 'v3から継承するもの・捨てるもの'],
];

marked.setOptions({ gfm: true, breaks: false });
await mkdir(outDir, { recursive: true });

const css = `
:root{color-scheme:light;--bg:#f5f7fb;--paper:#fff;--ink:#18202c;--muted:#697386;--line:#dde3ec;--accent:#2c57d5;--accent-soft:#edf2ff;--code:#111827;--radius:18px;--shadow:0 12px 36px rgba(25,38,63,.08)}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.72 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}.shell{max-width:1320px;margin:auto;display:grid;grid-template-columns:260px minmax(0,1fr);gap:28px;padding:28px}.side{position:sticky;top:20px;align-self:start}.brand{font-weight:850;font-size:20px;letter-spacing:-.03em;margin-bottom:4px}.eyebrow{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.09em}.nav{margin-top:20px;display:grid;gap:7px}.nav a{display:block;padding:9px 11px;border-radius:10px;color:#334155}.nav a.active,.nav a:hover{background:var(--paper);text-decoration:none;box-shadow:0 4px 16px rgba(25,38,63,.06)}.jump{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:20px}.jump a{padding:9px 10px;border:1px solid var(--line);border-radius:10px;text-align:center;background:var(--paper);font-size:12px}.doc{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);padding:clamp(24px,5vw,64px);box-shadow:var(--shadow);min-width:0}.doc>h1:first-child{margin-top:0;font-size:clamp(30px,4vw,48px);letter-spacing:-.045em;line-height:1.08}.doc h2{margin-top:2.2em;padding-top:.3em;border-top:1px solid var(--line);font-size:24px;letter-spacing:-.025em}.doc h3{margin-top:1.7em;font-size:18px}.doc p,.doc li{max-width:82ch}.doc blockquote{margin:1.5em 0;padding:10px 18px;border-left:4px solid var(--accent);background:var(--accent-soft);border-radius:0 12px 12px 0;color:#3b4a62}.doc code{font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;background:#eef1f5;padding:.12em .35em;border-radius:5px}.doc pre{overflow:auto;background:var(--code);color:#e5e7eb;padding:18px;border-radius:14px}.doc pre code{background:transparent;padding:0;color:inherit}.doc table{border-collapse:collapse;width:100%;display:block;overflow:auto;margin:1.4em 0}.doc th,.doc td{border:1px solid var(--line);padding:9px 12px;text-align:left;white-space:nowrap}.doc th{background:#f7f9fc}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:26px}.card{display:block;background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:20px;box-shadow:var(--shadow);color:var(--ink)}.card:hover{text-decoration:none;border-color:#b8c5e7;transform:translateY(-1px)}.card b{display:block;font-size:17px;margin-bottom:5px}.card span{color:var(--muted);font-size:13px}.index{max-width:1100px;margin:auto;padding:48px 28px}.index h1{font-size:clamp(36px,7vw,72px);line-height:1;letter-spacing:-.055em;margin:.25em 0}.index p{color:var(--muted);max-width:65ch}.pill{display:inline-flex;padding:5px 9px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:750}@media(max-width:800px){.shell{display:block;padding:12px}.side{position:static;padding:14px 8px 18px}.nav{grid-template-columns:repeat(2,1fr)}.doc{padding:24px 18px}.jump{max-width:360px}.doc table{font-size:13px}}
`;
await writeFile(join(outDir, 'styles.css'), css);

for (const [file, title] of docs) {
  const markdown = await readFile(join(sourceDir, file), 'utf8');
  const content = await marked.parse(markdown);
  const current = basename(file, '.md');
  const pageNav = docs.map(([navFile, navTitle]) => {
    const slug = basename(navFile, '.md');
    return `<a${slug === current ? ' class="active"' : ''} href="./${slug}.html">${navTitle}</a>`;
  }).join('');
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f7fb"><title>${title} · self-track-v4</title><link rel="stylesheet" href="./styles.css"></head><body><div class="shell"><aside class="side"><div class="eyebrow">self-track-v4</div><div class="brand">仕様書</div><nav class="nav">${pageNav}</nav><div class="jump"><a href="./">仕様書トップ</a><a href="../mock/">モックを開く</a></div></aside><article class="doc">${content}</article></div></body></html>`;
  await writeFile(join(outDir, `${current}.html`), html);
}

const cards = docs.map(([file, title, description]) => `<a class="card" href="./${basename(file, '.md')}.html"><b>${title}</b><span>${description}</span></a>`).join('');
const index = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>仕様書 · self-track-v4</title><link rel="stylesheet" href="./styles.css"></head><body><main class="index"><span class="pill">仕様書</span><h1>self-track-v4<br>仕様書</h1><p>仕様書はモックから独立した正本です。実装・モックが変化しても、受け入れ済みの製品判断、データ意味論、アーキテクチャ契約をここに残します。</p><div class="cards">${cards}</div><p style="margin-top:28px"><a href="../mock/">→ 操作モックを開く</a></p></main></body></html>`;
await writeFile(join(outDir, 'index.html'), index);
