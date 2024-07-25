import { ResolveFn } from '@angular/router';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { inject } from '@angular/core';
import { UserService } from '../../../core/users/user.service';
import { ITaskGetDTO } from './models';
import { TaskService } from './task.service';
import { IdentityService } from '../../../core/users/identity.service';
import { PERMISSION_ENUM } from '../../../shared/metadata';
export type TaskResolveData = {
  user: { id: number; name: string; lastName: string };
  adminUsers: Array<{ id: number; name: string; lastName: string }>;
  tasks: ITaskGetDTO[];
  tasksSelfToApprove: ITaskGetDTO[];
};
export const taskResolver: ResolveFn<
  Observable<TaskResolveData | Partial<TaskResolveData> | boolean>
> = (route, state) => {
  const taskService = inject(TaskService);
  const userService = inject(UserService);
  const identityService = inject(IdentityService);

  return identityService.hasPermission$(PERMISSION_ENUM.tasks_approve).pipe(
    switchMap((res) => {
      if (res) {
        return combineLatest({
          tasks: taskService.getTasksSelf$(),
          tasksSelfToApprove: taskService.getTaskSelfAssignedToApprove$(),
          user: userService.userIdentity$.pipe(
            map((ui) => ({
              id: ui.userId,
              name: ui.name,
              lastName: ui.lastName,
            }))
          ),
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
        tasks: taskService.getTasksSelf$(),
        user: userService.userIdentity$.pipe(
          map((ui) => ({ id: ui.userId, name: ui.name, lastName: ui.lastName }))
        ),
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
};
