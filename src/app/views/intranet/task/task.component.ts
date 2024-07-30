import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, ResolveData } from '@angular/router';
import { combineLatest, map, of, tap } from 'rxjs';
import { IdentityService } from '../../../core/users/identity.service';
import { UserService } from '../../../core/users/user.service';
import { TaskListComponent } from '../../../shared/components/tasks/task-list.component';
import { TaskToApproveListComponent } from '../../../shared/components/tasks/task-to-approve-list.component';
import { PERMISSION_ENUM } from '../../../shared/metadata';
import { TaskResolveData } from './task.resolver';
import { TaskService } from './task.service';
import { AsyncPipe } from '@angular/common';
import { StatusSort } from '../../../shared/components/sort/sort.component';

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
  myTasks!: Partial<TaskResolveData>;
  myAssignedTask!: Partial<TaskResolveData>;
  totalToApprove = signal(0);
  @Input() dataTask!: TaskResolveData;
  paramsInTaskList: { filter: string; sort: StatusSort } = {
    filter: '',
    sort: '',
  };
  paramsInTaskListToApproved: { filter: string; sort: StatusSort } = {
    filter: '',
    sort: '',
  };

  ngOnInit() {
    if (this.dataTask) {
      this.myTasks = {
        user: this.dataTask.user,
        adminUsers: this.dataTask.adminUsers,
        tasks: this.dataTask.tasks,
      };
      if (this.dataTask.tasksSelfToApprove) {
        this.myAssignedTask = {
          user: this.dataTask.user,
          adminUsers: this.dataTask.adminUsers,
          tasksSelfToApprove: this.dataTask.tasksSelfToApprove,
        };
        this.totalToApprove.set(
          this.dataTask.tasksSelfToApprove.filter(
            (t) => t.status == 'Completada'
          ).length
        );
      }
    } else {
      this.route.data.subscribe(({ data }) => {
        const resolveData: TaskResolveData = data;
        this.myTasks = {
          user: resolveData.user,
          adminUsers: resolveData.adminUsers,
          tasks: resolveData.tasks,
        };
        if (resolveData.tasksSelfToApprove) {
          this.myAssignedTask = {
            user: resolveData.user,
            adminUsers: resolveData.adminUsers,
            tasksSelfToApprove: resolveData.tasksSelfToApprove,
          };
          this.totalToApprove.set(
            resolveData.tasksSelfToApprove.filter(
              (t) => t.status == 'Completada'
            ).length
          );
        }
      });
    }
  }
  refreshTaskList(event: { sort: StatusSort; filter: string }) {
    this.paramsInTaskList = event;
    if (this.dataTask) {
      combineLatest({
        tasksSelfToApprove: this.taskService.getTaskToApproveByUserId$(
          this.dataTask.user.id,
          this.paramsInTaskListToApproved.filter,
          this.paramsInTaskListToApproved.sort
        ),
        tasks: this.taskService.getTasksByUserId$(
          this.dataTask.user.id,
          event.filter,
          event.sort
        ),
        user: of(this.dataTask.user),
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
          tap(({ tasksSelfToApprove, tasks, user, adminUsers }) => {
            this.myAssignedTask = {
              user,
              adminUsers,
              tasksSelfToApprove,
            };
            this.myTasks = {
              user,
              adminUsers,
              tasks,
            };
          })
        )
        .subscribe();
    } else {
      combineLatest({
        tasksSelfToApprove: this.taskService.getTaskSelfAssignedToApprove$(
          this.paramsInTaskListToApproved.filter,
          this.paramsInTaskListToApproved.sort
        ),
        tasks: this.taskService.getTasksSelf$(event.filter, event.sort),
        user: this.userService.userIdentity$.pipe(
          map((ui) => ({
            id: ui!.userId,
            name: ui!.name,
            lastName: ui!.lastName,
          }))
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
          tap(({ tasksSelfToApprove, tasks, user, adminUsers }) => {
            this.myAssignedTask = {
              user,
              adminUsers,
              tasksSelfToApprove,
            };
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
  refreshListToApprove(event: { sort: StatusSort; filter: string }) {
    this.paramsInTaskListToApproved = event;
    if (this.dataTask) {
      combineLatest({
        tasksSelfToApprove: this.taskService.getTaskToApproveByUserId$(
          this.dataTask.user.id,
          event.filter,
          event.sort
        ),
        tasks: this.taskService.getTasksByUserId$(
          this.dataTask.user.id,
          this.paramsInTaskList.filter,
          this.paramsInTaskList.sort
        ),
        user: of(this.dataTask.user),
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
          tap(({ tasksSelfToApprove, tasks, user, adminUsers }) => {
            this.myAssignedTask = {
              user,
              adminUsers,
              tasksSelfToApprove,
            };
            this.myTasks = {
              user,
              adminUsers,
              tasks,
            };
          })
        )
        .subscribe();
    } else {
      combineLatest({
        tasksSelfToApprove: this.taskService.getTaskSelfAssignedToApprove$(
          event.filter,
          event.sort
        ),
        tasks: this.taskService.getTasksSelf$(
          this.paramsInTaskList.filter,
          this.paramsInTaskList.sort
        ),
        user: this.userService.userIdentity$.pipe(
          map((ui) => ({
            id: ui!.userId,
            name: ui!.name,
            lastName: ui!.lastName,
          }))
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
          tap(({ tasksSelfToApprove, tasks, user, adminUsers }) => {
            this.myAssignedTask = {
              user,
              adminUsers,
              tasksSelfToApprove,
            };
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
  onTotalToApprove(e: number) {
    this.totalToApprove.set(e);
  }
}
