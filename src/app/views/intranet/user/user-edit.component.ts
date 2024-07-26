import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

import { catchError, EMPTY } from 'rxjs';
import { IUserGetDTO } from '../../../core/users/model';
import { UserService } from '../../../core/users/user.service';
import { confirmedValidator } from '../../../shared/custom-validators/confirmed-validators';
import { ColCountDirective } from '../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../shared/directives/colSpan';
import { ROLE_ENUM } from '../../../shared/metadata';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ColCountDirective,
    ColSpanDirective,
    MatSelectModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss',
})
export class UserEditComponent {
  route = inject(ActivatedRoute);
  user!: IUserGetDTO;
  userEditForm!: FormGroup;
  fb = inject(FormBuilder);
  userService = inject(UserService);
  submitting = false;
  router = inject(Router);
  patterPassword = new RegExp(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$/
  );
  hidePassword = true;
  hideConfirmPassword = true;
  roleOptions: Array<ROLE_ENUM> = [ROLE_ENUM.admin, ROLE_ENUM.user];
  showConffirmPass = false;

  ngOnInit() {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
    });
    this.userEditForm = this.fb.group(
      {
        name: [this.user.name, Validators.required],
        lastName: [this.user.lastName, Validators.required],
        userName: [this.user.userName, Validators.required],
        age: [this.user.age, Validators.required],
        email: new FormControl(this.user.email, {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.userService.uniqueEmailValidatorAsync('edit')],
          updateOn: 'blur',
        }),
        phoneNumber: [this.user.phoneNumber, Validators.required],
        address: [this.user.address, Validators.required],
        password: [
          this.user.encPassword,
          [Validators.required, Validators.pattern(this.patterPassword)],
        ],

        confirmPassword: [this.user.encPassword, Validators.required],
        role: [this.user.role, Validators.required],
        permissions: [this.userService.setPermissionsByRole(this.user.role)],
      },
      {
        validator: confirmedValidator('password', 'confirmPassword'),
      }
    );

    this.role?.valueChanges.subscribe((res) => {
      if (res == ROLE_ENUM.admin) {
        this.permissions?.setValue(
          this.userService.setPermissionsByRole(ROLE_ENUM.admin)
        );
      } else {
        this.permissions?.setValue(
          this.userService.setPermissionsByRole(ROLE_ENUM.user)
        );
      }
    });

    this.password?.valueChanges.subscribe((res) => {
      if (res !== this.user.encPassword) {
        this.confirmPassword?.setValue('');
        this.showConffirmPass = this.user.encPassword !== res;
      }
    });
  }
  onEdit() {
    const formValue = { ...this.userEditForm.value };
    formValue.initailsName = delete formValue.confirmPassword;
    this.userEditForm.disable();
    this.userService
      .updateUser$(this.user.id, formValue)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.userEditForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.userEditForm.enable();
        this.submitting = false;
        this.router.navigate(['users']);
      });
  }
  get name() {
    return this.userEditForm.get('name');
  }
  get lastName() {
    return this.userEditForm.get('lastName');
  }
  get userName() {
    return this.userEditForm.get('userName');
  }
  get age() {
    return this.userEditForm.get('age');
  }
  get email() {
    return this.userEditForm.get('email');
  }
  get phoneNumber() {
    return this.userEditForm.get('phoneNumber');
  }
  get address() {
    return this.userEditForm.get('address');
  }
  get password() {
    return this.userEditForm.get('password');
  }
  get role() {
    return this.userEditForm.get('role');
  }
  get permissions() {
    return this.userEditForm.get('permissions');
  }
  get confirmPassword() {
    return this.userEditForm.get('confirmPassword');
  }
}
