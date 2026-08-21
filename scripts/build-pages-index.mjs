import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, 'dist-pages');
await mkdir(outDir, { recursive: true });
const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>self-track-v4</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#18202c;font:15px/1.6 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.wrap{max-width:900px;margin:auto;padding:clamp(30px,8vw,90px) 24px}h1{font-size:clamp(42px,8vw,78px);letter-spacing:-.06em;line-height:.95;margin:.25em 0}.sub{color:#697386;max-width:58ch}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:36px}a{display:block;background:#fff;border:1px solid #dde3ec;border-radius:18px;padding:26px;color:#18202c;text-decoration:none;box-shadow:0 12px 36px rgba(25,38,63,.08)}a:hover{border-color:#9eb0dd;transform:translateY(-1px)}b{font-size:22px}span{display:block;color:#697386;margin-top:5px}.tag{display:inline-block;background:#18202c;color:white;border-radius:999px;padding:5px 9px;font-size:12px;font-weight:750}</style></head><body><main class="wrap"><span class="tag">v4.0</span><h1>self-track</h1><p class="sub">日常利用できるローカル版を本番面として追加。モックと仕様は参照用に分離したまま残しています。</p><div class="grid"><a href="./app/"><b>Open App</b><span>IndexedDB保存・履歴・タグ・JSONバックアップ。</span></a><a href="./mock/"><b>Interactive Mock</b><span>操作や情報構造を試す交換可能なモック。</span></a><a href="./spec/"><b>Specification</b><span>設計判断と将来のGitHub同期・分析仕様。</span></a></div></main></body></html>`;
await writeFile(join(outDir, 'index.html'), html);
