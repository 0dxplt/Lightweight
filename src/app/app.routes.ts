import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { modAuthGuard } from './features/mod/guards/mod-auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard(true)],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'profile',
    canActivate: [authGuard(true)],
    children: [
      {
        path: '',
          loadComponent: () => import('./features/profile/pages/profile/profile.page').then( m => m.ProfilePage)
      },
      {
        // TODO: aggiungere una pagina 'PublicProfilePage'
        path: ':username',
        loadComponent: () => import('./features/profile/pages/profile/profile.page').then(m => m.ProfilePage)
      }
    ],
  },
  {
    path: 'workouts',
    canActivate: [authGuard(true)],
    loadComponent: () => import('./features/workouts/pages/workouts/workouts.page').then( m => m.WorkoutsPage)
  },
  {
    path: 'current-session',
    canActivate: [authGuard(true)],
    loadComponent: () => import('./features/session/pages/current-session/current-session.page').then( m => m.CurrentSessionPage)
  },
  {
    path: 'rankings',
    canActivate: [authGuard(true)],
    loadComponent: () => import('./features/rankings/pages/rankings/rankings.page').then( m => m.RankingsPage)
  },
  {
    path: 'pts',
    canActivate: [authGuard(true)],
    loadComponent: () => import('./features/pts/pages/pts/pts.page').then( m => m.PtsPage)
  },
  {
    path: 'feed',
    canActivate: [authGuard(true)],
    loadComponent: () => import('./features/feed/pages/feed/feed.page').then( m => m.FeedPage)
  },
  {
    path: 'login',
    canActivate: [authGuard(false)],
    loadComponent: () => import('./features/auth/pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    canActivate: [authGuard(false)],
    loadComponent: () => import('./features/auth/pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'mod',
    canActivate: [modAuthGuard(true)],
    children: [
      {
        path: '',
          loadComponent: () => import('./features/mod/pages/dashboard/dashboard.page').then( m => m.DashboardPage)
      },
      {
        path: 'solved',
        loadComponent: () => import('./features/mod/pages/solved/solved.page').then( m => m.SolvedPage)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/mod/pages/reports/reports.page').then( m => m.ReportsPage)
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/mod/pages/requests/requests.page').then( m => m.RequestsPage)
      },
      {
        path: 'profile-view/:username',
        loadComponent: () => import('./features/mod/pages/profile-view/profile-view.page').then(m => m.ProfileViewPage)
      },
      {
        path: 'sessions-view/:username',
        loadComponent: () => import('./features/mod/pages/sessions-view/sessions-view.page').then(m => m.SessionViewPage)
      }
    ],
  },
  {
    path: 'mod/login',
    canActivate: [modAuthGuard(false)],
    loadComponent: () => import('./features/mod/pages/mod-login/mod-login.page').then( m => m.ModLoginPage)
  },
];
