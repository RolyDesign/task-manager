import { NgStyle, CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';

import { catchError, EMPTY } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AppInfoService } from '../../../shared/services/app-info.service';
import { MESSAGES_TEXT } from '../login/message.const';
import { confirmedValidator } from '../../../shared/custom-validators/confirmed-validators';
import { IUserGetDTO } from '../../../core/users/model';
import { UserService } from '../../../core/users/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgStyle,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  userService = inject(UserService);
  appService = inject(AppInfoService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  appInfoService = inject(AppInfoService);
  registerForm!: FormGroup;
  appName = this.appService.title;
  appDescription = this.appService.description;
  submitting = false;
  modePassword = 'password';
  hidePassword = true;
  hideConfirmPassword = true;
  patterPassword = new RegExp(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,15}$/
  );
  constructor() {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
        }),
        password: [
          '',
          [Validators.required, Validators.pattern(this.patterPassword)],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: confirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  onRegister() {
    this.submitting = true;
    const formValue = {
      name: this.registerForm.value.name,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };
    this.registerForm.disable();
    this.authService
      .registerUser(formValue)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.registerForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.registerForm.enable();
        this.submitting = false;
        this.router.navigate(['login']);
      });
  }
  get name() {
    return this.registerForm.get('name');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
