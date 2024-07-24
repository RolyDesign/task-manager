import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
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
import { IGetUserSelfDTO, IUpdateUserSelfDTO } from '../../../core/users/model';
import { UserService } from '../../../core/users/user.service';
import { ColCountDirective } from '../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../shared/directives/colSpan';

@Component({
  selector: 'app-profile-edit',
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
  ],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss',
})
export class ProfileEditComponent {
  route = inject(ActivatedRoute);
  user!: IGetUserSelfDTO;
  profileEditForm!: FormGroup;
  fb = inject(FormBuilder);
  userService = inject(UserService);
  submitting = false;
  dr = inject(DestroyRef);
  router = inject(Router);
  ngOnInit() {
    this.route.data.subscribe(({ profile }) => {
      this.user = profile;
    });
    this.profileEditForm = this.fb.group({
      name: [this.user.name, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      userName: [this.user.userName, Validators.required],
      age: [this.user.age, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      phoneNumber: [this.user.phoneNumber, Validators.required],
      address: [this.user.address, Validators.required],
    });
  }

  onEdit() {
    const formValue: IUpdateUserSelfDTO = this.profileEditForm.value;
    this.userService
      .updateUserSelf$(this.user.id, formValue)
      .pipe(
        takeUntilDestroyed(this.dr),
        catchError((e: HttpErrorResponse) => {
          this.profileEditForm.enable();
          this.submitting = false;
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.profileEditForm.enable();
        this.submitting = false;
        this.router.navigate(['profile']);
      });
  }

  get name() {
    return this.profileEditForm.get('name');
  }
  get lastName() {
    return this.profileEditForm.get('lastName');
  }
  get userName() {
    return this.profileEditForm.get('userName');
  }
  get age() {
    return this.profileEditForm.get('age');
  }
  get email() {
    return this.profileEditForm.get('email');
  }
  get phoneNumber() {
    return this.profileEditForm.get('phoneNumber');
  }
  get address() {
    return this.profileEditForm.get('address');
  }
}
