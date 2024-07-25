import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, tap } from 'rxjs';
import { IdentityService } from '../../../core/users/identity.service';
import { UserService } from '../../../core/users/user.service';
import { TaskListComponent } from '../../../shared/components/tasks/task-list.component';
import { TaskToApproveListComponent } from '../../../shared/components/tasks/task-to-approve-list.component';
import { PERMISSION_ENUM } from '../../../shared/metadata';
import { TaskResolveData } from './task.resolver';
import { TaskService } from './task.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    MatTabsModule,
    TaskListComponent,
    TaskToApproveListComponent,
    MatCardModule,
    MatBadgeModule,
    AsyncPipe,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  route = inject(ActivatedRoute);
  identityService = inject(IdentityService);
  taskService = inject(TaskService);
  userService = inject(UserService);
  permission = PERMISSION_ENUM;
  totalWithoutapprove = 0;
  myTasks!: Partial<TaskResolveData>;
  myAssignedTask!: Partial<TaskResolveData>;
  totalToApprove = 0;

  ngOnInit() {
    this.route.data.subscribe(({ data }) => {
      const resolveData: TaskResolveData = data;
      this.myTasks = {
        user: resolveData.user,
        adminUsers: resolveData.adminUsers,
        tasks: resolveData.tasks,
      };
      this.myAssignedTask = {
        user: resolveData.user,
        adminUsers: resolveData.adminUsers,
        tasksSelfToApprove: resolveData.tasksSelfToApprove,
      };
    });
  }
  taskListRefreshed() {
    combineLatest({
      tasksSelfToApprove: this.taskService.getTaskSelfAssignedToApprove$(),
      user: this.userService.userIdentity$.pipe(
        map((ui) => ({ id: ui.userId, name: ui.name, lastName: ui.lastName }))
      ),
      adminUsers: this.userService.getAdminUsers$().pipe(
        map((us) =>
          us.map((ui) => ({
            id: ui.id,
            name: ui.name,
            lastName: ui.lastName,
          }))
        )
      ),
    })
      .pipe(
        tap(({ tasksSelfToApprove, user, adminUsers }) => {
          this.myAssignedTask = {
            user,
            adminUsers,
            tasksSelfToApprove,
          };
        })
      )
      .subscribe();
  }
  taskToApproveListRefreshed() {
    combineLatest({
      tasks: this.taskService.getTasksSelf$(),
      user: this.userService.userIdentity$.pipe(
        map((ui) => ({ id: ui.userId, name: ui.name, lastName: ui.lastName }))
      ),
      adminUsers: this.userService.getAdminUsers$().pipe(
        map((us) =>
          us.map((ui) => ({
            id: ui.id,
            name: ui.name,
            lastName: ui.lastName,
          }))
        )
      ),
    })
      .pipe(
        tap(({ tasks, user, adminUsers }) => {
          this.myTasks = {
            user,
            adminUsers,
            tasks,
          };
        })
      )
      .subscribe();
  }
}
