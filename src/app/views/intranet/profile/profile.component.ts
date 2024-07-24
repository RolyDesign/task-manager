import { Component, DestroyRef, inject } from '@angular/core';
import { UserService } from '../../../core/users/user.service';
import { MatCardModule } from '@angular/material/card';
import { ColCountDirective } from '../../../shared/directives/colCount';
import { IGetUserSelfDTO, IUserGetDTO } from '../../../core/users/model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmptyDataPipe } from '../../../shared/pipes/empty-data.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordModalComponent } from './modals/change-password-modal/change-password-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ColSpanDirective } from '../../../shared/directives/colSpan';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCardModule,
    ColCountDirective,
    ColSpanDirective,
    EmptyDataPipe,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  userService = inject(UserService);
  dialog = inject(MatDialog);
  profileDetailState = {
    colCount: 3,
    fields: [
      {
        fieldName: 'name',
        fieldDisplayName: 'Nombre',
      },
      {
        fieldName: 'lastName',
        fieldDisplayName: 'Apellidos',
      },
      {
        fieldName: 'userName',
        fieldDisplayName: 'Nombre de Usuario',
      },
      {
        fieldName: 'age',
        fieldDisplayName: 'Edad',
      },
      {
        fieldName: 'email',
        fieldDisplayName: 'Correo',
      },
      {
        fieldName: 'phoneNumber',
        fieldDisplayName: 'Numero de telefono',
      },
      {
        fieldName: 'address',
        fieldDisplayName: 'Dirección',
        colSpan: 3,
      },
    ],
  };
  route = inject(ActivatedRoute);
  user!: IGetUserSelfDTO;
  ngOnInit() {
    this.route.data.subscribe(({ profile }) => {
      this.user = profile;
    });
  }

  changePassword() {
    this.dialog.open(ChangePasswordModalComponent, {});
  }
}
