import { PERMISSION_ENUM, ROLE_ENUM } from '../../../shared/metadata';
import { INav } from './model';

export const NAV_ITEMS: INav[] = [
  {
    id: 1,
    name: 'Bienvenido',
    path: '/welcome',
  },
  {
    id: 2,
    name: 'Tareas',
    path: '/tasks',
  },
  {
    id: 3,
    name: 'Usuarios',
    path: '/users',
    permission: PERMISSION_ENUM.users_list,
  },
];
