import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { PERMISSION_ENUM, ROLE_ENUM } from '../../shared/metadata';
import { of, switchMap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private userService = inject(UserService);
  hasPermission$(permission: PERMISSION_ENUM) {
    return this.userService.userIdentity$.pipe(
      switchMap((ui) => {
        return of(ui.permissions.includes(permission));
      })
    );
  }
}
