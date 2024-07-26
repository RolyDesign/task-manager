import { CommonModule, isPlatformBrowser, NgStyle } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { afterRender, Component, inject, PLATFORM_ID } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { catchError, EMPTY, tap } from 'rxjs';
import { AppInfoService } from '../../../shared/services/app-info.service';
import { MESSAGES_TEXT } from './message.const';
import { AuthService } from '../../../core/auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColCountDirective } from '../../../shared/directives/colCount';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgStyle,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  appService = inject(AppInfoService);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  appInfoService = inject(AppInfoService);
  loginForm!: FormGroup;
  appName = this.appService.title;
  appDescription = this.appService.description;
  submitting = false;
  errorMessage = '';
  modePassword = 'password';
  hidePassword = true;

  constructor() {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
    if (isPlatformBrowser(this.platformId)) {
      const emailRemembered = localStorage.getItem(
        this.appInfoService.title + '_Remembered'
      )
        ? JSON.parse(
            localStorage.getItem(this.appInfoService.title + '_Remembered')!
          )
        : undefined;
      if (emailRemembered) {
        this.loginForm.patchValue({
          email: emailRemembered,
          rememberMe: true,
        });
      }
    }
  }

  onLogin() {
    this.submitting = true;
    this.errorMessage = '';
    const { email, password, rememberMe } = this.loginForm.value;
    this.loginForm.disable();
    this.authService
      .logIn(email, password)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          console.log(e);
          this.loginForm.enable();
          this.submitting = false;
          this.errorMessage = e.error;
          return EMPTY;
        })
      )
      .subscribe(() => {
        if (rememberMe) {
          localStorage.setItem(
            this.appInfoService.title + '_Remembered',
            JSON.stringify(email)
          );
        } else {
          localStorage.removeItem(this.appInfoService.title + '_Remembered');
        }
        this.loginForm.enable();
        this.errorMessage = '';
        this.submitting = false;
        this.router.navigate(['welcome']);
      });
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
