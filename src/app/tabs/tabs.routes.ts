import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'pts',
        loadComponent: () =>
          import('../features/pts/pages/pts/pts.page').then((m) => m.PtsPage),
      },
      {
        path: 'rankings',
        loadComponent: () =>
          import('../features/rankings/pages/rankings/rankings.page').then((m) => m.RankingsPage),
      },
      {
        path: 'workouts',
        loadComponent: () =>
          import('../features/workouts/pages/workouts/workouts.page').then((m) => m.WorkoutsPage),
      },
      {
        path: 'feed',
        loadComponent: () =>
          import('../features/feed/pages/feed/feed.page').then((m) => m.FeedPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/profile/pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/workouts',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/workouts',
    pathMatch: 'full',
  },
];
