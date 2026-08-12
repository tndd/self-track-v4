import { createHashRouter } from 'react-router';
import { AppShell } from '../components/AppShell';
import { AnalysisPage } from '../features/analysis/AnalysisPage';
import { CalendarPage } from '../features/calendar/CalendarPage';
import { SettingsPage } from '../features/settings/SettingsPage';
import { TagsPage } from '../features/tags/TagsPage';
import { TodayPage } from '../features/today/TodayPage';

export const router = createHashRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <TodayPage /> },
      { path: '/calendar', element: <CalendarPage /> },
      { path: '/analysis', element: <AnalysisPage /> },
      { path: '/tags', element: <TagsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
]);
