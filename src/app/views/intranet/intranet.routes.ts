import { Routes } from '@angular/router';
import { profileResolver } from './profile/profile.resolver';
import { PROFILE_ROUTES } from './profile/prifile.routes';
import { TASKS_ROUTES } from './task/tasks.routes';
import { USERS_ROUTES } from './user/users.routes';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () =>
      import('./welcome/welcome.component').then((m) => m.WelcomeComponent),
  },
  ...PROFILE_ROUTES,
  ...TASKS_ROUTES,
  ...USERS_ROUTES,
];
