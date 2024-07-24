import {
  HttpClient,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  delay,
  EMPTY,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

import { AppInfoService } from '../../shared/services/app-info.service';
import { MESSAGES_TOAST } from './messajes.const';
import { UserService } from '../users/user.service';
import { ToastService } from '../../shared/services/toast.service';
import { environment } from '../../../environments/environment';
import { access } from 'fs';
import { IUserGetDTO } from '../users/model';
import { PERMISSION_ENUM, ROLE_ENUM } from '../../shared/metadata';

export interface ISession {
  [key: string]: any;
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private appInfoService = inject(AppInfoService);
  private toastService = inject(ToastService);
  private baseUrl = environment.API_URL;
  private _isRefreshing = false;
  get isRefreshing() {
    return this._isRefreshing;
  }
  set isRefreshing(value: boolean) {
    this._isRefreshing = value;
  }
  constructor(private router: Router) {}

  private setSession(data: ISession) {
    localStorage.setItem(
      this.appInfoService.title + '_Session',
      JSON.stringify(data)
    );
  }
  private clearStorageCache() {
    localStorage.removeItem(this.appInfoService.title + '_Session');
    localStorage.removeItem(this.appInfoService.title + '_Identity');
  }
  getSession() {
    const session: ISession | null = localStorage.getItem(
      this.appInfoService.title + '_Session'
    )
      ? JSON.parse(
          localStorage.getItem(this.appInfoService.title + '_Session')!
        )
      : null;
    return session;
  }
  addTokenHeader(req: HttpRequest<unknown>) {
    const session = this.getSession();
    const token = session?.accessToken;
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }
  refreshToken() {
    const session = this.getSession();
    return this.http.post<any>(`${this.baseUrl}/auth/refresh-token`, {
      accessToken: session?.accessToken,
    });
  }
  //Simulando login
  logIn(email: string, password: string) {
    return this.userService.getUserByEmail$(email).pipe(
      switchMap((users) => {
        if (
          users.length &&
          users[0].email == email &&
          users[0].password == password
        ) {
          const accessToken = `token_de_ejemplo ${users[0].email}`;
          this.setSession({
            accessToken: accessToken,
          });
          return of(this.userService.setUserSelfIdentity$(users[0]));
        }
        return throwError(
          () =>
            new HttpErrorResponse({
              status: 400,
              error: 'Credenciales Invalidas',
            })
        );
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify(e.error);
        return throwError(() => e);
      })
    );
  }
  updateToken(newToken: string) {
    const session = this.getSession()!;
    session.accessToken = newToken;
    this.setSession(session);
  }
  registerUser(partialUser: {
    name: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const user: Partial<IUserGetDTO> = {
      name: partialUser.name,
      lastName: partialUser.lastName,
      password: partialUser.password,
      email: partialUser.email,
      address: '',
      age: 0,
      phoneNumber: '',
      userName: '',
      role: ROLE_ENUM.user,
      permissions: [
        PERMISSION_ENUM.tasks_list,
        PERMISSION_ENUM.tasks_read,
        PERMISSION_ENUM.tasks_update,
        PERMISSION_ENUM.tasks_delete,
        PERMISSION_ENUM.tasks_create,
      ],
    };
    return this.http.post<any>(`${environment.API_URL}/users`, user).pipe(
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify(e.error);
        return throwError(() => e);
      })
    );
  }
  exitApp() {
    this.clearStorageCache();
    this.router.navigate(['auth/login']);
  }
  logOut() {
    return of(this.exitApp());
  }
}
