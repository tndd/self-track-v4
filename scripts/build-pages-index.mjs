import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'dist-pages');
await mkdir(outDir, { recursive: true });
const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>self-track-v4</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#18202c;font:15px/1.6 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{max-width:900px;margin:auto;padding:clamp(30px,8vw,90px) 24px}h1{font-size:clamp(42px,8vw,78px);letter-spacing:-.06em;line-height:.95;margin:.25em 0}.sub{color:#697386;max-width:58ch}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:36px}a{display:block;background:#fff;border:1px solid #dde3ec;border-radius:18px;padding:26px;color:#18202c;text-decoration:none;box-shadow:0 12px 36px rgba(25,38,63,.08)}a:hover{border-color:#9eb0dd;transform:translateY(-1px)}b{font-size:22px}span{display:block;color:#697386;margin-top:5px}.tag{display:inline-block;background:#edf2ff;color:#2c57d5;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:750}</style></head><body><main class="wrap"><span class="tag">GitHub Pages</span><h1>self-track-v4</h1><p class="sub">仕様とモックを意図的に分離した開発入口。仕様は設計判断の正本、モックは操作感を確かめる交換可能な観測装置です。</p><div class="grid"><a href="./mock/"><b>Interactive Mock</b><span>Vite + React。操作や情報構造をブラウザですぐ確認。</span></a><a href="./spec/"><b>Rich Specification</b><span>Markdown正本から生成したHTML仕様書。アーキテクチャや契約を読む。</span></a></div></main></body></html>`;
await writeFile(join(outDir, 'index.html'), html);
