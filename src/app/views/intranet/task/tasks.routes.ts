import { Routes } from '@angular/router';
import { taskResolver } from './task.resolver';

export const TASKS_ROUTES: Routes = [
  {
    path: 'tasks',
    resolve: { data: taskResolver },
    loadComponent: () =>
      import('./task.component').then((m) => m.TaskComponent),
  },
];
