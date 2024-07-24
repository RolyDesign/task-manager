import { Component, inject } from '@angular/core';
import { UserService } from '../../../core/users/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IUserGetDTO } from '../../../core/users/model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ColCountDirective } from '../../../shared/directives/colCount';
import { ColSpanDirective } from '../../../shared/directives/colSpan';
import { EmptyDataPipe } from '../../../shared/pipes/empty-data.pipe';
import { SeparatorCharPipe } from '../../../shared/pipes/separator-character.pipe copy';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    MatCardModule,
    ColCountDirective,
    ColSpanDirective,
    EmptyDataPipe,
    MatButtonModule,
    RouterLink,
    SeparatorCharPipe,
    MatIconModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  userService = inject(UserService);
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
        fieldName: 'password',
        fieldDisplayName: 'Contraseña',
      },
      {
        fieldName: 'role',
        fieldDisplayName: 'Role',
      },
      {
        fieldName: 'permissions',
        fieldDisplayName: 'Permisos',
        colSpan: 3,
      },
      {
        fieldName: 'address',
        fieldDisplayName: 'Dirección',
        colSpan: 3,
      },
    ],
  };
  route = inject(ActivatedRoute);
  user!: IUserGetDTO;
  ngOnInit() {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
    });
  }
}
