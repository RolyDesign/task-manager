import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { catchError, EMPTY } from 'rxjs';
import { IdentityService } from '../../../../core/users/identity.service';
import { IUserGetDTO } from '../../../../core/users/model';
import { ColCountDirective } from '../../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../../shared/directives/colSpan';
import { PERMISSION_ENUM } from '../../../../shared/metadata';
import { ITaskCreateDTO, ITaskGetDTO, TaskStatus } from '../models';
import { TaskService } from '../task.service';
import { TaskCreateComponent } from './task-create.component';

@Component({
  selector: 'app-task-edit-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ColCountDirective,
    ColSpanDirective,
  ],
  templateUrl: './task-edit-modal.component.html',
  styleUrl: './task-edit-modal.component.scss',
})
export class TaskEditModalComponent {
  taskEditForm!: FormGroup;
  fb = inject(FormBuilder);
  submitting = false;
  taskService = inject(TaskService);
  identityService = inject(IdentityService);
  permission = PERMISSION_ENUM;
  admin: IUserGetDTO[] = [];
  statusOptions: Array<TaskStatus> = [
    'Pendiente',
    'En progreso',
    'Completada',
    'Aprobada',
  ];
  constructor(
    public dialogRef: MatDialogRef<TaskEditModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public Data: {
      user: { id: number; name: string; lastName: string };
      task: ITaskGetDTO;
      adminUsers: Array<{ id: number; name: string; lastName: string }>;
    }
  ) {}

  ngOnInit() {
    const { task, user, adminUsers } = this.Data;
    this.taskEditForm = this.fb.group({
      name: [task.name, Validators.required],
      description: [task.description, Validators.required],
      status: [task.status],
      userId: [task.userId, Validators.required],
      approvedUserId: [task.approvedUserId, Validators.required],
      initialsName: [task.initialsName],
      approvedUserName: [task.approvedUserName],
      creatorName: [task.creatorName],
    });

    this.approvedUserId?.valueChanges.subscribe((adminId) => {
      const adminselected = this.Data.adminUsers.find((a) => a.id == adminId)!;

      this.taskEditForm
        .get('approvedUserName')
        ?.patchValue(adminselected?.name + ' ' + adminselected?.lastName);
    });
  }

  buildInitialsName(name: string, lastName: string) {
    return (
      name.trim().slice(0, 1).toUpperCase() +
      lastName.trim().slice(0, 1).toUpperCase()
    );
  }

  onEditTask() {
    this.submitting = true;
    const formValue = this.taskEditForm.value as ITaskCreateDTO;
    this.taskEditForm.disable();
    this.taskService
      .updateTask$(this.Data.task.id, formValue)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.taskEditForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.taskEditForm.enable();
        this.submitting = false;
      });
  }

  get name() {
    return this.taskEditForm.get('name');
  }
  get description() {
    return this.taskEditForm.get('description');
  }
  get status() {
    return this.taskEditForm.get('status');
  }

  get approvedUserId() {
    return this.taskEditForm.get('approvedUserId');
  }
}
