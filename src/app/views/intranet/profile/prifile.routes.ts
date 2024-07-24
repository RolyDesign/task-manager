import { Routes } from '@angular/router';
import { profileResolver } from './profile.resolver';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    resolve: { profile: profileResolver },
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'profile/edit',
    resolve: { profile: profileResolver },
    loadComponent: () =>
      import('./profile-edit.component').then((m) => m.ProfileEditComponent),
  },
];
