import { inject, Injectable } from '@angular/core';
import { UserService } from '../../../core/users/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, identity, map, switchMap, tap, throwError } from 'rxjs';
import { ITaskCreateDTO, ITaskGetDTO, ITaskUpdateDTO } from './models';
import { StatusSort } from '../../../shared/components/sort/sort.component';
import { ToastService } from '../../../shared/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = environment.API_URL;
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private toastService = inject(ToastService);

  getTasksSelf$(filter: string = '', sortOrder: StatusSort = '') {
    return this.userService.userIdentity$.pipe(
      switchMap((identity) => {
        return this.http
          .get<ITaskGetDTO[]>(`${this.baseUrl}/tasks`, {
            params: {
              userId: identity.userId,
              _sort: 'name',
              _order: sortOrder,
              q: filter,
            },
          })
          .pipe(
            map((tasks) =>
              tasks.filter(
                (t) =>
                  t.status == 'Pendiente' ||
                  t.status == 'En progreso' ||
                  t.status == 'Completada'
              )
            )
          );
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify('Error Obteniendo la lista tareas');
        return throwError(() => e);
      })
    );
  }
  getTaskSelfAssignedToApprove$(
    filter: string = '',
    sortOrder: StatusSort = ''
  ) {
    return this.userService.userIdentity$.pipe(
      switchMap((identity) => {
        return this.http
          .get<ITaskGetDTO[]>(`${this.baseUrl}/tasks`, {
            params: {
              _sort: 'name',
              _order: sortOrder,
              q: filter,
            },
          })
          .pipe(
            map((us) => {
              return us.filter(
                (u) =>
                  //u.userId == identity.userId ||
                  u.approvedUserId == identity.userId &&
                  (u.status == 'Completada' || u.status == 'Aprobada')
              );
            })
          );
      }),

      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify('Error Obteniendo la lista tareas');
        return throwError(() => e);
      })
    );
  }
  getTasksByUserId$(userId: number) {
    return this.http
      .get<ITaskGetDTO[]>(`${this.baseUrl}/tasks`, {
        params: {
          userId,
        },
      })
      .pipe(
        catchError((e: HttpErrorResponse) => {
          this.toastService.errorNotify('Error Obteniendo la lista tareas');
          return throwError(() => e);
        })
      );
  }
  createTask(data: ITaskCreateDTO) {
    return this.http.post<ITaskGetDTO>(`${this.baseUrl}/tasks`, data).pipe(
      tap(() => {
        this.toastService.successNotify('Tarea creada satisfactoriamente');
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify('Error creando la tarea');
        return throwError(() => e);
      })
    );
  }
  deleteTask$(taskId: number) {
    return this.http.delete<never>(`${this.baseUrl}/tasks/${taskId}`).pipe(
      tap(() => {
        this.toastService.successNotify('Tarea eliminada satisfactoriamente');
      }),
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify('Error eliminando la tarea');
        return throwError(() => e);
      })
    );
  }
  gatTaskById$(taskId: number) {
    return this.http.get<ITaskGetDTO>(`${this.baseUrl}/tasks/${taskId}`).pipe(
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify(`Error obteniendo la tarea" ${taskId}`);
        return throwError(() => e);
      })
    );
  }
  updateTask$(id: number, task: ITaskUpdateDTO) {
    return this.http.put<never>(`${this.baseUrl}/tasks/${id}`, task).pipe(
      catchError((e: HttpErrorResponse) => {
        this.toastService.errorNotify(`Error actualizando la tarea" ${id}`);
        return throwError(() => e);
      })
    );
  }
}
