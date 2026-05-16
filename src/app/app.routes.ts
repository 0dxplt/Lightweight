import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/pages/profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'workouts',
    loadComponent: () => import('./features/workouts/pages/workouts/workouts.page').then( m => m.WorkoutsPage)
  },
  {
    path: 'current-session',
    loadComponent: () => import('./features/session/pages/current-session/current-session.page').then( m => m.CurrentSessionPage)
  },
  {
    path: 'rankings',
    loadComponent: () => import('./features/rankings/pages/rankings/rankings.page').then( m => m.RankingsPage)
  },
  {
    path: 'pts',
    loadComponent: () => import('./features/pts/pages/pts/pts.page').then( m => m.PtsPage)
  },
  {
    path: 'feed',
    loadComponent: () => import('./features/feed/pages/feed/feed.page').then( m => m.FeedPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register.page').then( m => m.RegisterPage)
  },
];
