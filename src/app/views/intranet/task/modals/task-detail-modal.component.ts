import { Component, inject, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ITaskGetDTO } from '../models';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ColCountDirective } from '../../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../../shared/directives/colSpan';
import { EmptyDataPipe } from '../../../../shared/pipes/empty-data.pipe';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IdentityService } from '../../../../core/users/identity.service';
import { PERMISSION_ENUM } from '../../../../shared/metadata';
import { AsyncPipe } from '@angular/common';
import { TaskEditModalComponent } from './task-edit-modal.component';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ColCountDirective,
    ColSpanDirective,
    EmptyDataPipe,
    MatToolbarModule,
    AsyncPipe,
  ],
  templateUrl: './task-detail-modal.component.html',
  styleUrl: './task-detail-modal.component.scss',
})
export class TaskDetailModalComponent {
  identityService = inject(IdentityService);
  permission = PERMISSION_ENUM;
  dialog = inject(MatDialog);
  constructor(
    public dialogRef: MatDialogRef<TaskDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public Data: {
      user: { id: number; name: string; lastName: string };
      task: ITaskGetDTO;
      adminUsers: Array<{ id: number; name: string; lastName: string }>;
    }
  ) {}

  onEdit() {
    this.dialogRef.close();
    this.dialog.open(TaskEditModalComponent, {
      data: {
        user: this.Data.user,
        task: this.Data.task,
        adminUsers: this.Data.adminUsers,
      },
    });
  }
}
