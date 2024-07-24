import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  finalize,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

//export const CONTENT_TYPE = new HttpContextToken(() => 'application/json');

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url == `${environment.API_URL}/users`) {
    return next(req);
  }

  // json-server no implementa refreshToken
  //this will never happen
  if (authService.isRefreshing) {
    return EMPTY;
  }

  const session = authService.getSession();
  if (!session || (session && !session.accessToken)) {
    authService.exitApp();
    return EMPTY;
  }
  const reqClone = authService.addTokenHeader(req);
  return next(reqClone);
}

export function errorApiInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      //this will never happen json-server no expira el token. Implementando solo por fines demostrativos de un refreshToken handler
      if (e.status === HttpStatusCode.Unauthorized) {
        if (req.url == `${environment.API_URL}/auth/refresh-token`) {
          authService.isRefreshing = false;
          authService.exitApp();
          return EMPTY;
        }
        authService.isRefreshing = true;
        return authService.refreshToken().pipe(
          concatMap((response: any) => {
            const newToken = response.accessToken.token;
            authService.updateToken(newToken);
            const reqClone = authService.addTokenHeader(req);
            return next(reqClone);
          }),
          finalize(() => (authService.isRefreshing = false))
        );
      }
      return throwError(() => e);
    })
  );
}
