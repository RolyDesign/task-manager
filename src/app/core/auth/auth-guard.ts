import { afterRender, inject, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../users/user.service';
import { AppInfoService } from '../../shared/services/app-info.service';
import { IUserIdentity } from '../users/model';

export const AuthGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const appService = inject(AppInfoService);
  if (isPlatformBrowser(platformId)) {
    const session = authService.getSession();
    const userIdentityLocalCache = localStorage.getItem(
      appService.title + '_Identity'
    )
      ? (JSON.parse(
          localStorage.getItem(appService.title + '_Identity')!
        ) as IUserIdentity)
      : null;

    if (
      !session ||
      !userIdentityLocalCache ||
      (session && !session.accessToken)
    ) {
      authService.exitApp();
      return of(false);
    }
    return of(true);
  } else {
    return of(false);
  }
};
