import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpContextToken,
  HttpContext,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../shared/components/loader/loader.service';

export function loaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loaderService = inject(LoaderService);
  const clonReq = req.clone();
  loaderService.show();
  return next(clonReq).pipe(finalize(() => loaderService.hide()));
}
