import { ResolveFn } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';

import { inject } from '@angular/core';
import { UserService } from '../../../core/users/user.service';
import { ITaskGetDTO } from './models';
import { TaskService } from './task.service';
export type TaskResolveData = {
  user: { id: number; name: string; lastName: string };
  adminUsers: Array<{ id: number; name: string; lastName: string }>;
  tasks: ITaskGetDTO[];
  tasksSelfToApprove: ITaskGetDTO[];
};
export const taskResolver: ResolveFn<Observable<TaskResolveData | boolean>> = (
  route,
  state
) => {
  const taskService = inject(TaskService);
  const userService = inject(UserService);

  return combineLatest({
    tasks: taskService.getTasksSelf$(),
    tasksSelfToApprove: taskService.getTaskSelfAssignedToApprove$(),
    user: userService.userIdentity$.pipe(
      map((ui) => ({ id: ui.userId, name: ui.name, lastName: ui.lastName }))
    ),
    adminUsers: userService
      .getAdminUsers$()
      .pipe(
        map((us) =>
          us.map((ui) => ({ id: ui.id, name: ui.name, lastName: ui.lastName }))
        )
      ),
  });
};
