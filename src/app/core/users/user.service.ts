import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

import { isPlatformBrowser } from '@angular/common';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  delay,
  forkJoin,
  from,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppInfoService } from '../../shared/services/app-info.service';
import {
  IGetUserSelfDTO,
  IUpdateUserSelfDTO,
  IUserCreateDTO,
  IUserGetDTO,
  IUserIdentity,
  IUserUpdateDTO,
} from './model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { StatusSort } from '../../shared/components/sort/sort.component';
import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { PERMISSION_ENUM, ROLE_ENUM } from '../../shared/metadata';
import { ITaskGetDTO } from '../../views/intranet/task/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private toastService = inject(ToastService);
  private appService = inject(AppInfoService);
  private platformId = inject(PLATFORM_ID);
  private userIdentitySubject = new ReplaySubject<IUserIdentity>();
  router = inject(Router);
  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const identity = localStorage.getItem(this.appService.title + '_Identity')
        ? (JSON.parse(
            localStorage.getItem(this.appService.title + '_Identity')!
          ) as IUserIdentity)
        : null;
      if (identity) {
        this.userIdentitySubject.next(identity);
      } else {
        this.router.navigate(['login']);
      }
    }
  }
  get userIdentity$() {
    return this.userIdentitySubject.asObservable();
  }
  getUsers$(filter: string = '', sortOrder: StatusSort = 'asc') {
    return this.http
      .get<IUserGetDTO[]>(`${environment.API_URL}/users`, {
        params: {
          _sort: 'id',
          _order: sortOrder,
          q: filter,
        },
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error obteniendo lista de usuarios`);
          return throwError(() => e);
        })
      );
  }
  getUserByEmail$(email: string) {
    return this.http
      .get<IUserGetDTO[]>(`${environment.API_URL}/users`, {
        params: {
          email,
        },
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error obteniendo usuario  ${email}`);
          return throwError(() => e);
        })
      );
  }
  getUserById$(id: number) {
    return this.http
      .get<IUserGetDTO>(`${environment.API_URL}/users/${id}`)
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error obteniendo usuario  ${id}`);
          return throwError(() => e);
        })
      );
  }
  getAdminUsers$() {
    return this.http
      .get<IUserGetDTO[]>(`${environment.API_URL}/users`, {
        params: {
          role: ROLE_ENUM.admin,
        },
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error obteniendo administradores`);
          return throwError(() => e);
        })
      );
  }
  updateUserSelf$(userId: number, user: IUpdateUserSelfDTO) {
    return this.getUserById$(userId).pipe(
      switchMap((res) => {
        const currentUser: IUserGetDTO = {
          ...res,
          ...user,
        };
        return this.http
          .put(`${environment.API_URL}/users/${currentUser.id}`, currentUser)
          .pipe(
            tap(() => {
              this.toastService.successNotify(
                'Usuario actualizado satisfactoriamente'
              );
              //update identity cache
              this.setUserSelfIdentity$(currentUser);
            }),
            //update task userCreator and InitialsName
            switchMap(() => {
              return this.http
                .get<ITaskGetDTO[]>(`${environment.API_URL}/tasks`, {
                  params: {
                    userId,
                  },
                })
                .pipe(
                  switchMap((res) => {
                    const batchUpdate: ITaskGetDTO[] = res.map((t) => {
                      const taskUpdated: ITaskGetDTO = {
                        ...t,
                        creatorName:
                          user.name.trim() + ' ' + user.lastName.trim(),
                        initialsName:
                          user.name.trim().slice(0, 1).toUpperCase() +
                          user.lastName.trim().slice(0, 1).toUpperCase(),
                      };
                      return taskUpdated;
                    });
                    return of(batchUpdate).pipe(
                      concatMap((ts) => {
                        return forkJoin(
                          ts.map((t) =>
                            this.http
                              .put(`${environment.API_URL}/tasks/${t.id}`, t)
                              .pipe(
                                catchError((e) => {
                                  this.toastService.errorNotify(
                                    `Error actualizando la tarea ${t.name}`
                                  );
                                  return throwError(() => e);
                                })
                              )
                          )
                        );
                      })
                    );
                  })
                );
            }),

            catchError((e: HttpErrorResponse) => {
              this.toastService.errorNotify(
                `Erro al actualizar el usuario ${
                  currentUser.name + ' ' + currentUser.lastName
                }`
              );
              return throwError(() => e);
            })
          );
      })
    );
  }
  changePasswordUserSelf$(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.userIdentity$.pipe(
      switchMap((res) => {
        return this.getUserById$(res.userId).pipe(
          switchMap((user) => {
            if (data.currentPassword !== user.encPassword) {
              return throwError(
                () =>
                  new HttpErrorResponse({
                    error: 'Error cambiando su contrasena',
                    status: 400,
                  })
              );
            }
            user.password = data.newPassword;
            user.encPassword = data.newPassword;
            return this.http.put<never>(
              `${environment.API_URL}/users/${res!.userId}`,
              user
            );
          }),
          tap(() =>
            this.toastService.successNotify('Contraseña cambiada exitosamente')
          ),
          catchError((e: HttpErrorResponse) => {
            this.toastService.errorNotify(e.error);
            return throwError(() => e);
          })
        );
      })
    );
  }
  setUserSelfIdentity$(user: IUserGetDTO) {
    if (user.id && user.role) {
      const userIdentity = <IUserIdentity>{
        userId: user.id,
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
      };
      localStorage.setItem(
        this.appService.title + '_Identity',
        JSON.stringify(userIdentity)
      );
      this.userIdentitySubject.next(userIdentity);
    }
  }
  createUser$(user: IUserCreateDTO) {
    user.encPassword = user.password;
    return this.http
      .post<IUserGetDTO>(`${environment.API_URL}/users`, user)
      .pipe(
        tap(() => {
          this.toastService.successNotify(`Usuario creado satisfactoriamente`);
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error creando usuario`);
          return throwError(() => e);
        })
      );
  }
  deleteUser$(userId: number) {
    return this.http
      .delete<never>(`${environment.API_URL}/users/${userId}`)
      .pipe(
        tap(() => {
          this.toastService.successNotify(
            `Usuario eliminado satisfactoriamente`
          );
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error eliminando usuario`);
          return throwError(() => e);
        })
      );
  }
  updateUser$(userId: number, user: IUserUpdateDTO) {
    user.encPassword = user.password;
    return this.http
      .put<never>(`${environment.API_URL}/users/${userId}`, user)
      .pipe(
        tap(() => {
          this.toastService.successNotify(
            `Usuario Actualizado satisfactoriamente`
          );
        }),
        //update task userCreator and InitialsName
        switchMap((res) => {
          return this.http
            .get<ITaskGetDTO[]>(`${environment.API_URL}/tasks`, {
              params: {
                userId,
              },
            })
            .pipe(
              switchMap((res) => {
                const batchUpdate: ITaskGetDTO[] = res.map((t) => {
                  const taskUpdated: ITaskGetDTO = {
                    ...t,
                    creatorName: user.name.trim() + ' ' + user.lastName.trim(),
                    initialsName:
                      user.name.trim().slice(0, 1).toUpperCase() +
                      user.lastName.trim().slice(0, 1).toUpperCase(),
                  };
                  return taskUpdated;
                });
                return of(batchUpdate).pipe(
                  concatMap((ts) => {
                    return forkJoin(
                      ts.map((t) =>
                        this.http
                          .put(`${environment.API_URL}/tasks/${t.id}`, t)
                          .pipe(
                            catchError((e) => {
                              this.toastService.errorNotify(
                                `Error actualizando la tarea ${t.name}`
                              );
                              return throwError(() => e);
                            })
                          )
                      )
                    );
                  })
                );
              }),
              //update identity cache
              switchMap(() => {
                return this.userIdentity$.pipe(
                  take(1),
                  tap((res) => {
                    if (res.userId == userId) {
                      const u: IUserGetDTO = {
                        ...user,
                        id: userId,
                        permissions: res.permissions,
                        role: res.role,
                      };

                      this.setUserSelfIdentity$(u);
                    }
                  })
                );
              })
            );
        }),
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify(`Error actualizando el usuario`);
          return throwError(() => e);
        })
      );
  }
  uniqueEmailValidatorAsync(
    context: 'edit' | 'create' = 'create'
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.getUserByEmail$(control.value).pipe(
        map((users) => {
          if (context == 'edit') {
            return users.length > 1 ? { emailExists: true } : null;
          }
          return users.length ? { emailExists: true } : null;
        }),
        catchError((err) => of(null))
      );
    };
  }
  setPermissionsByRole(role: ROLE_ENUM) {
    if (role == ROLE_ENUM.admin) {
      return [
        PERMISSION_ENUM.tasks_create,
        PERMISSION_ENUM.tasks_update,
        PERMISSION_ENUM.tasks_delete,
        PERMISSION_ENUM.tasks_list,
        PERMISSION_ENUM.tasks_read,
        PERMISSION_ENUM.tasks_approve,
        PERMISSION_ENUM.users_create,
        PERMISSION_ENUM.users_update,
        PERMISSION_ENUM.users_delete,
        PERMISSION_ENUM.users_list,
        PERMISSION_ENUM.users_read,
      ];
    }
    return [
      PERMISSION_ENUM.tasks_create,
      PERMISSION_ENUM.tasks_update,
      PERMISSION_ENUM.tasks_delete,
      PERMISSION_ENUM.tasks_list,
      PERMISSION_ENUM.tasks_read,
    ];
  }
}
