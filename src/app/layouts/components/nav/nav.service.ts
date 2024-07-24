import { inject, Injectable } from '@angular/core';
import { NAV_ITEMS } from './nav.data';
import { of, switchMap } from 'rxjs';
import { IdentityService } from '../../../core/users/identity.service';
import { UserService } from '../../../core/users/user.service';
import { INav } from './model';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  private navItems = NAV_ITEMS;
  private userService = inject(UserService);
  constructor() {}

  getNavItemsWithPermissions() {
    return this.userService.userIdentity$.pipe(
      switchMap((i) => {
        const navItems: INav[] = [];
        this.navItems.forEach((e) => {
          if (
            !e.permission ||
            (e.permission && i.permissions.includes(e.permission))
          ) {
            navItems.push(e);
          }
        });
        return of(navItems);
      })
    );
  }
}
