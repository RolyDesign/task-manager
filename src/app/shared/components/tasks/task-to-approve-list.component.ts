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
  Component,
  OnChanges,
  inject,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
  DestroyRef,
} from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject, tap, switchMap } from 'rxjs';
import { IdentityService } from '../../../core/users/identity.service';
import { ITaskGetDTO, TaskStatus } from '../../../views/intranet/task/models';
import { TaskService } from '../../../views/intranet/task/task.service';
import { ColCountDirective } from '../../directives/colCount';
import { PERMISSION_ENUM } from '../../metadata';
import { SingleFilterComponent } from '../single-filter/single-filter.component';
import { SortComponent, StatusSort } from '../sort/sort.component';
import { TaskCardComponent } from './task-card.component';
import { TaskResolveData } from '../../../views/intranet/task/task.resolver';
import { TaskCreateComponent } from '../../../views/intranet/task/modals/task-create.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-to-approve-list',
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
    DragDropModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './task-to-approve-list.component.html',
  styleUrl: './task-to-approve-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskToApproveListComponent implements OnChanges {
  identityService = inject(IdentityService);
  taskService = inject(TaskService);
  permission = PERMISSION_ENUM;
  completedTasks: ITaskGetDTO[] = [];
  approvedTasks: ITaskGetDTO[] = [];
  tasks$ = new BehaviorSubject<ITaskGetDTO[]>([]);
  searchValue = '';
  sortOrder: StatusSort = '';
  dialog = inject(MatDialog);
  dr = inject(DestroyRef);
  @Input({ required: true }) data!: Partial<TaskResolveData>;
  @Output() totalToApprove = new EventEmitter<number>();
  @Output() onRefreshed = new EventEmitter();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.tasks$.next(this.data.tasksSelfToApprove!);
      this.totalToApprove.emit(this.completedTasks.length);
    }
  }
  ngOnInit() {
    this.tasks$.pipe(takeUntilDestroyed(this.dr)).subscribe((tasks) => {
      this.completedTasks = tasks.filter((t) => t.status == 'Completada');
      this.approvedTasks = tasks.filter((t) => t.status == 'Aprobada');
    });
  }
  refreshData() {
    return this.taskService
      .getTaskSelfAssignedToApprove$(this.searchValue, this.sortOrder)
      .pipe(
        tap((res) => {
          this.tasks$.next(res);
          this.onRefreshed.emit();
          this.totalToApprove.emit(this.completedTasks.length);
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
    if (currentContainerId == 'completed') {
      return 'Completada' as TaskStatus;
    } else {
      return 'Aprobada' as TaskStatus;
    }
  }
}
