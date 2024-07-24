import { ResolveFn } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { IGetUserSelfDTO } from '../../../core/users/model';
import { UserService } from '../../../core/users/user.service';
import { inject } from '@angular/core';

export const profileResolver: ResolveFn<
  Observable<IGetUserSelfDTO | boolean>
> = (route, state) => {
  const userService = inject(UserService);
  return userService.userIdentity$.pipe(
    switchMap((res) => {
      return userService.getUserSelf$(res.userId);
    })
  );
};
