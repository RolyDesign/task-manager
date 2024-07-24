import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../../../../../shared/components/confirm-generic/confirm.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { confirmedValidator } from '../../../../../shared/custom-validators/confirmed-validators';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../../../core/users/user.service';
import { pid } from 'process';
import { catchError, EMPTY, pipe, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-change-password-modal',
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
  ],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.scss',
})
export class ChangePasswordModalComponent {
  changePasswordForm!: FormGroup;
  fb = inject(FormBuilder);
  submitting = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  userService = inject(UserService);
  dr = inject(DestroyRef);
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public Data: DialogData
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: confirmedValidator('newPassword', 'confirmPassword'),
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onChangePassword() {
    this.submitting = true;
    const formValue = {
      currentPassword: this.changePasswordForm.value.currentPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };
    this.changePasswordForm.disable();
    this.userService
      .changePasswordUserSelf$(formValue)
      .pipe(
        takeUntilDestroyed(this.dr),
        catchError((e: HttpErrorResponse) => {
          this.changePasswordForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.changePasswordForm.enable();
        this.submitting = false;
        this.dialogRef.close();
      });
  }

  get currentPass() {
    return this.changePasswordForm.get('currentPassword');
  }
  get newPass() {
    return this.changePasswordForm.get('newPassword');
  }
  get confirmPass() {
    return this.changePasswordForm.get('confirmPassword');
  }
}
