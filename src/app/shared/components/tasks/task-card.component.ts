import { DragDropModule } from '@angular/cdk/drag-drop';
import { SlicePipe, UpperCasePipe, NgClass, AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IdentityService } from '../../../core/users/identity.service';
import { TaskDetailModalComponent } from '../../../views/intranet/task/modals/task-detail-modal.component';
import { TaskEditModalComponent } from '../../../views/intranet/task/modals/task-edit-modal.component';
import { ITaskGetDTO } from '../../../views/intranet/task/models';
import { TaskService } from '../../../views/intranet/task/task.service';
import { ColCountDirective } from '../../directives/colCount';
import { ColSpanDirective } from '../../directives/colSpan';
import { PERMISSION_ENUM } from '../../metadata';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import {
  ConfirmComponent,
  DialogData,
} from '../confirm-generic/confirm.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    SlicePipe,
    UpperCasePipe,
    TruncatePipe,
    NgClass,
    ColCountDirective,
    ColSpanDirective,
    MatButtonModule,
    AsyncPipe,
    DragDropModule,
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input({ required: true }) task!: ITaskGetDTO;
  @Input({ required: true }) userSelf!: {
    id: number;
    name: string;
    lastName: string;
  };
  @Input({ required: true }) adminUsers!: Array<{
    id: number;
    name: string;
    lastName: string;
  }>;
  @Output() onDeleteEmit = new EventEmitter<number>();
  @Output() onEditEmit = new EventEmitter<number>();
  taskService = inject(TaskService);
  dialogRef = inject(MatDialog);
  identityService = inject(IdentityService);
  permission = PERMISSION_ENUM;
  onDelete() {
    const dialog = this.dialogRef.open(ConfirmComponent, {
      data: {
        title: 'Cuidado',
        message: `Va a eliminar la tarea: "${this.task.name}". ¿Está seguro?`,
        confirmButton: {
          color: 'primary',
          confirmButtonName: 'Si',
        },
        clearButtonClose: false,
        closeButtonName: 'Cerrar',
      } as DialogData,
      disableClose: true,
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.onDeleteEmit.emit(this.task.id);
      }
    });
  }
  onDetail() {
    const dialog = this.dialogRef.open(TaskDetailModalComponent, {
      data: {
        task: this.task,
        user: this.userSelf,
        adminUsers: this.adminUsers,
      },
      minWidth: '50rem',
    });
  }
  onEdit() {
    const dialog = this.dialogRef.open(TaskEditModalComponent, {
      data: {
        task: this.task,
        user: this.userSelf,
        adminUsers: this.adminUsers,
      },
      minWidth: '50rem',
    });

    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.onEditEmit.emit(this.task.id);
      }
    });
  }
}
