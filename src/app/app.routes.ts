import { Routes } from '@angular/router';
import { LayoutComponent } from './layouts/app-layout/layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/public/public.routes').then((m) => m.routes),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./views/public/public.routes').then((m) => m.routes),
      },
    ],
  },
  {
    path: '',
    //resolve: { app: appResolve },
    canActivateChild: [AuthGuardService],
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/intranet/intranet.routes').then((m) => m.routes),
      },
    ],
  },

  { path: '**', redirectTo: '404' },
];
