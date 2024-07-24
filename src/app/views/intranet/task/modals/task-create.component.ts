import { Component, DestroyRef, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaskService } from '../task.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../../../../shared/components/confirm-generic/confirm.component';
import { ITaskCreateDTO, TaskStatus } from '../models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { IdentityService } from '../../../../core/users/identity.service';
import { PERMISSION_ENUM } from '../../../../shared/metadata';
import { UserService } from '../../../../core/users/user.service';
import { IUserGetDTO } from '../../../../core/users/model';
import { ColCountDirective } from '../../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../../shared/directives/colSpan';

@Component({
  selector: 'app-task-create',
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
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss',
})
export class TaskCreateComponent {
  taskCreateForm!: FormGroup;
  fb = inject(FormBuilder);
  submitting = false;
  taskService = inject(TaskService);
  identityService = inject(IdentityService);
  permission = PERMISSION_ENUM;
  admin: IUserGetDTO[] = [];
  constructor(
    public dialogRef: MatDialogRef<TaskCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public Data: {
      user: { id: number; name: string; lastName: string };
      adminUsers: Array<{ id: number; name: string; lastName: string }>;
    }
  ) {}

  ngOnInit() {
    this.taskCreateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: ['Pendiente'],
      userId: [this.Data.user.id, Validators.required],
      approvedUserId: ['', Validators.required],
      initialsName: [
        this.buildInitialsName(this.Data.user.name, this.Data.user.lastName),
      ],
      approvedUserName: [''],
      creatorName: [this.Data.user.name + ' ' + this.Data.user.lastName],
    });

    this.approvedUserId?.valueChanges.subscribe((adminId) => {
      const adminselected = this.Data.adminUsers.find((a) => a.id == adminId)!;

      this.taskCreateForm
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
  onCreateTask() {
    this.submitting = true;
    const formValue = this.taskCreateForm.value as ITaskCreateDTO;
    this.taskCreateForm.disable();
    this.taskService
      .createTask(formValue)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.taskCreateForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.taskCreateForm.enable();
        this.submitting = false;
      });
  }
  get name() {
    return this.taskCreateForm.get('name');
  }
  get description() {
    return this.taskCreateForm.get('description');
  }
  get status() {
    return this.taskCreateForm.get('status');
  }
  get approvedUserId() {
    return this.taskCreateForm.get('approvedUserId');
  }
}
