import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';
import { modAuthGuard } from './features/mod/guards/mod-auth-guard';
import { hasCurrentSessionGuard } from './features/session/guards/has-current-session-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard(true)],
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'workouts',
    redirectTo: 'tabs/workouts',
    pathMatch: 'full'
  },
  {
    path: 'rankings',
    redirectTo: 'tabs/rankings',
    pathMatch: 'full'
  },
  {
    path: 'pts',
    redirectTo: 'tabs/pts',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    redirectTo: 'tabs/feed',
    pathMatch: 'full'
  },
  {
    path: 'profile',
    redirectTo: 'tabs/profile',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [authGuard(false)],
    loadComponent: () => import('./features/auth/pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    canActivate: [authGuard(false)],
    loadComponent: () => import('./features/auth/pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'session',
    canActivate: [authGuard(true), hasCurrentSessionGuard],
    loadComponent: () => import('./features/session/pages/current-session/current-session.page').then(m => m.CurrentSessionPage)
  },
  {
    path: 'workout',
    loadComponent: () => import('./features/workout/pages/workout.page').then(m => m.WorkoutPage)
  },
  {
    path: 'workout/:id',
    loadComponent: () => import('./features/workout/pages/workout.page').then(m => m.WorkoutPage)
  },
  {
    path: 'mod',
    canActivate: [modAuthGuard(true)],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/mod/pages/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'solved',
        loadComponent: () => import('./features/mod/pages/solved/solved.page').then(m => m.SolvedPage)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/mod/pages/reports/reports.page').then(m => m.ReportsPage)
      },
      {
        path: 'requests',
        loadComponent: () => import('./features/mod/pages/requests/requests.page').then(m => m.RequestsPage)
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
    loadComponent: () => import('./features/mod/pages/mod-login/mod-login.page').then(m => m.ModLoginPage)
  },
];
