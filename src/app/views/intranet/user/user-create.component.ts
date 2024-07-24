import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { IUserCreateDTO, IUserGetDTO } from '../../../core/users/model';
import { UserService } from '../../../core/users/user.service';
import { ColCountDirective } from '../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../shared/directives/colSpan';
import { PERMISSION_ENUM, ROLE_ENUM } from '../../../shared/metadata';
import { confirmedValidator } from '../../../shared/custom-validators/confirmed-validators';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-create',
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
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent {
  route = inject(ActivatedRoute);
  user!: IUserGetDTO;
  userCreateForm!: FormGroup;
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

  ngOnInit() {
    this.userCreateForm = this.fb.group(
      {
        name: ['', Validators.required],
        lastName: ['', Validators.required],
        userName: ['', Validators.required],
        age: ['', Validators.required],
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.userService.uniqueEmailValidatorAsync()],
          updateOn: 'blur',
        }),
        phoneNumber: ['', Validators.required],
        address: ['', Validators.required],
        password: [
          '',
          [Validators.required, Validators.pattern(this.patterPassword)],
        ],
        confirmPassword: ['', Validators.required],
        role: [ROLE_ENUM.user, Validators.required],
        permissions: [this.userService.setPermissionsByRole(ROLE_ENUM.user)],
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
  }
  onCreate() {
    const formValue = { ...this.userCreateForm.value };
    delete formValue.confirmPassword;
    this.userService
      .createUser$(formValue)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.userCreateForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.userCreateForm.enable();
        this.submitting = false;
        this.router.navigate(['users']);
      });
  }
  get name() {
    return this.userCreateForm.get('name');
  }
  get lastName() {
    return this.userCreateForm.get('lastName');
  }
  get userName() {
    return this.userCreateForm.get('userName');
  }
  get age() {
    return this.userCreateForm.get('age');
  }
  get email() {
    return this.userCreateForm.get('email');
  }
  get phoneNumber() {
    return this.userCreateForm.get('phoneNumber');
  }
  get address() {
    return this.userCreateForm.get('address');
  }
  get password() {
    return this.userCreateForm.get('password');
  }
  get role() {
    return this.userCreateForm.get('role');
  }
  get permissions() {
    return this.userCreateForm.get('permissions');
  }
  get confirmPassword() {
    return this.userCreateForm.get('confirmPassword');
  }
}
