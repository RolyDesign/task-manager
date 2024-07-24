import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { PERMISSION_ENUM, ROLE_ENUM } from '../../shared/metadata';
import { of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private userService = inject(UserService);

  hasPermission$(perrmission: PERMISSION_ENUM) {
    return this.userService.userIdentity$.pipe(
      switchMap((ui) => {
        return of(ui.permissions.includes(perrmission));
      })
    );
  }

  hasRole$(role: ROLE_ENUM) {
    return this.userService.userIdentity$.pipe(
      switchMap((ui) => {
        return of(ui.role == role);
      })
    );
  }

  hasPermissions$(permissions: PERMISSION_ENUM[]) {
    return this.userService.userIdentity$.pipe(
      switchMap((ui) => {
        let result = true;
        for (let index = 0; index < permissions.length; index++) {
          if (!ui.permissions.includes(permissions[index])) {
            result = false;
            break;
          }
        }
        return of(result);
      })
    );
  }
}
