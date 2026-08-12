import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';

const nav = [
  ['/', 'Today'],
  ['/calendar', 'Calendar'],
  ['/analysis', 'Analysis'],
  ['/tags', 'Tags'],
  ['/settings', 'Settings'],
] as const;

const titles: Record<string, string> = Object.fromEntries(nav.map(([path, title]) => [path, title]));

export function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] ?? 'self-track';

  return (
    <div className="app-shell">
      <header className="app-bar">
        <button className="icon-button" type="button" aria-label="メニュー" onClick={() => setOpen(true)}>☰</button>
        <div>
          <h1 className="page-title">{title}</h1>
          {location.pathname === '/' && <div className="page-subtitle">8月12日 水曜</div>}
        </div>
      </header>
      <Outlet />
      {open && (
        <>
          <button className="drawer-scrim" aria-label="メニューを閉じる" onClick={() => setOpen(false)} />
          <aside className="drawer">
            <strong>self-track</strong>
            <nav>
              {nav.map(([path, label]) => (
                <NavLink key={path} to={path} onClick={() => setOpen(false)}>{label}</NavLink>
              ))}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}
