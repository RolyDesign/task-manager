import { Routes } from '@angular/router';
import { permissionGuard } from '../../../core/guards/permission.guard';
import { PERMISSION_ENUM } from '../../../shared/metadata';
import { userResolver } from './user.resolver';

export const USERS_ROUTES: Routes = [
  {
    path: 'users',
    resolve: { users: userResolver },
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('./user-list.component').then((m) => m.UserListComponent),
    data: {
      permissions: PERMISSION_ENUM.users_list,
    },
  },
  {
    path: 'users/add',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('./user-create.component').then((m) => m.UserCreateComponent),
    data: {
      permissions: PERMISSION_ENUM.users_create,
    },
  },
  {
    path: 'users/:id',
    resolve: { userData: userResolver },
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('./user-detail.component').then((m) => m.UserDetailComponent),
    data: {
      permissions: PERMISSION_ENUM.users_read,
    },
  },
  {
    path: 'users/:id/edit',
    resolve: { user: userResolver },
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('./user-edit.component').then((m) => m.UserEditComponent),
    data: {
      permissions: PERMISSION_ENUM.users_update,
    },
  },
];
