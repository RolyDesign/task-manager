import { ResolveFn } from '@angular/router';
import { UserService } from '../../../core/users/user.service';
import { inject } from '@angular/core';
import { IUserGetDTO } from '../../../core/users/model';

export const userResolver: ResolveFn<IUserGetDTO[] | IUserGetDTO> = (
  route,
  state
) => {
  const userService = inject(UserService);
  const id = Number(route.paramMap.get('id'));
  if (route.paramMap.has('id')) {
    return userService.getUserById$(Number(id));
  }

  return userService.getUsers$();
};
