import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, tap } from 'rxjs';
import { PERMISSION_ENUM } from '../../shared/metadata';
import { AppInfoService } from '../../shared/services/app-info.service';
import { ToastService } from '../../shared/services/toast.service';
import { IdentityService } from '../users/identity.service';
import { UserService } from '../users/user.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const identity = inject(IdentityService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const permissions: PERMISSION_ENUM = route.data[
    'permissions'
  ] as PERMISSION_ENUM;

  if (permissions.length) {
    return identity.hasPermission$(permissions).pipe(
      tap((res) => {
        console.log(res, permissions);
        if (!res) {
          toast.errorNotify('You do not have permission to access this route');
          router.navigate(['welcome']);
        }
      })
    );
  } else {
    return of(true);
  }
};
