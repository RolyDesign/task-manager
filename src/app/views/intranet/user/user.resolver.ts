import { ResolveFn } from '@angular/router';
import { UserService } from '../../../core/users/user.service';
import { inject } from '@angular/core';
import { IUserGetDTO } from '../../../core/users/model';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { TaskService } from '../task/task.service';
import { ITaskGetDTO } from '../task/models';
import { IdentityService } from '../../../core/users/identity.service';
import { PERMISSION_ENUM } from '../../../shared/metadata';

export type UserDetailResolve = {
  userDetail: IUserGetDTO;
  tasksToApproveByUser: ITaskGetDTO[];
  taskByUser: ITaskGetDTO[];
  adminUsers: Array<{ id: number; name: string; lastName: string }>;
};

export const userResolver: ResolveFn<
  Observable<
    IUserGetDTO[] | IUserGetDTO | UserDetailResolve | Partial<UserDetailResolve>
  >
> = (route, state) => {
  const userService = inject(UserService);
  const taskService = inject(TaskService);
  const identityService = inject(IdentityService);
  const id = Number(route.paramMap.get('id'));
  if (route.paramMap.has('id')) {
    if (route.routeConfig?.path?.includes('edit')) {
      return userService.getUserById$(id);
    }

    return userService.getUserById$(id).pipe(
      switchMap((res) => {
        if (res.permissions.includes(PERMISSION_ENUM.tasks_approve)) {
          return combineLatest({
            userDetail: userService.getUserById$(id),
            tasksToApproveByUser: taskService.getTaskToApproveByUserId$(id),
            taskByUser: taskService.getTasksByUserId$(id),
            adminUsers: userService.getAdminUsers$().pipe(
              map((us) =>
                us.map((ui) => ({
                  id: ui.id,
                  name: ui.name,
                  lastName: ui.lastName,
                }))
              )
            ),
          });
        }
        return combineLatest({
          userDetail: userService.getUserById$(id),
          taskByUser: taskService.getTasksByUserId$(id),
          adminUsers: userService.getAdminUsers$().pipe(
            map((us) =>
              us.map((ui) => ({
                id: ui.id,
                name: ui.name,
                lastName: ui.lastName,
              }))
            )
          ),
        });
      })
    );
  }

  return userService.getUsers$();
};
