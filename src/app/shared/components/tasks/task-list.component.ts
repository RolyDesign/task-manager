import {
  DragDropModule,
  CdkDropListGroup,
  CdkDropList,
  CdkDrag,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, tap, switchMap, EMPTY } from 'rxjs';
import { IdentityService } from '../../../core/users/identity.service';
import { TaskCreateComponent } from '../../../views/intranet/task/modals/task-create.component';
import { ITaskGetDTO, TaskStatus } from '../../../views/intranet/task/models';
import { TaskService } from '../../../views/intranet/task/task.service';
import { ColCountDirective } from '../../directives/colCount';
import { PERMISSION_ENUM } from '../../metadata';
import { SingleFilterComponent } from '../single-filter/single-filter.component';
import { SortComponent, StatusSort } from '../sort/sort.component';
import { TaskCardComponent } from './task-card.component';
import { TaskToApproveListComponent } from './task-to-approve-list.component';
import { TaskResolveData } from '../../../views/intranet/task/task.resolver';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ColCountDirective,
    TaskCardComponent,
    AsyncPipe,
    MatBadgeModule,
    MatIconModule,
    SingleFilterComponent,
    SortComponent,
    MatToolbarModule,
    RouterLink,
    DragDropModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  identityService = inject(IdentityService);
  taskService = inject(TaskService);
  permission = PERMISSION_ENUM;
  pendingTasks: ITaskGetDTO[] = [];
  inProgressTasks: ITaskGetDTO[] = [];
  completedTasks: ITaskGetDTO[] = [];
  approvedTasks: ITaskGetDTO[] = [];
  tasks$ = new BehaviorSubject<ITaskGetDTO[]>([]);
  searchValue = '';
  sortOrder: StatusSort = '';
  dialog = inject(MatDialog);
  dr = inject(DestroyRef);
  totalWithoutapprove = 0;
  @Input({ required: true }) data!: Partial<TaskResolveData>;
  @Output() onRefreshed = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.tasks$.next(this.data.tasks!);
    }
  }
  ngOnInit() {
    this.tasks$.pipe(takeUntilDestroyed(this.dr)).subscribe((tasks) => {
      this.pendingTasks = tasks.filter((t) => t.status == 'Pendiente');
      this.inProgressTasks = tasks.filter((t) => t.status == 'En progreso');
      this.completedTasks = tasks.filter((t) => t.status == 'Completada');
      this.approvedTasks = tasks.filter((t) => t.status == 'Aprobada');
    });
  }

  refreshData() {
    return this.taskService
      .getTasksSelf$(this.searchValue, this.sortOrder)
      .pipe(
        tap((res) => {
          this.tasks$.next(res);
          this.onRefreshed.emit();
        })
      );
  }
  filterChange(e: string) {
    this.searchValue = e;
    this.refreshData().subscribe();
  }
  sortChange(e: StatusSort) {
    this.sortOrder = e;
    this.refreshData().subscribe();
  }
  onCreateTask() {
    const dialog = this.dialog.open(TaskCreateComponent, {
      data: { user: this.data.user, adminUsers: this.data.adminUsers },
      minWidth: '50rem',
    });
    dialog
      .afterClosed()
      .pipe(
        switchMap((res) => {
          if (res) {
            return this.taskService
              .getTasksSelf$(this.searchValue, this.sortOrder)
              .pipe(
                tap((res) => {
                  this.tasks$.next(res);
                })
              );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
  onDeleteTask(taskId: number) {
    this.taskService
      .deleteTask$(taskId)
      .pipe(
        switchMap(() => {
          return this.refreshData();
        })
      )
      .subscribe();
  }
  onEdit(taskId: number) {
    this.refreshData().subscribe();
  }
  drop(event: CdkDragDrop<ITaskGetDTO[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const item = event.container.data[event.currentIndex];
      item.status = this.getCurrentColumAsTaskStatus(event.container.id);
      this.taskService
        .updateTask$(item.id, item)
        .pipe(switchMap((res) => this.refreshData()))
        .subscribe();
    }
  }
  getCurrentColumAsTaskStatus(currentContainerId: string) {
    if (currentContainerId == 'pendding') {
      return 'Pendiente' as TaskStatus;
    } else if (currentContainerId == 'progress') {
      return 'En progreso' as TaskStatus;
    } else {
      return 'Completada' as TaskStatus;
    }
  }
}
