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
import { TaskComponent } from '../task/task.component';
import { TaskResolveData } from '../task/task.resolver';
import { UserDetailResolve } from './user.resolver';

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
    TaskComponent,
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
        fieldName: 'role',
        fieldDisplayName: 'Role',
      },
      {
        fieldName: 'encPassword',
        fieldDisplayName: 'Password',
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
  taskData!: TaskResolveData;
  ngOnInit() {
    this.route.data.subscribe(({ userData }) => {
      const data: UserDetailResolve = userData;
      this.user = data.userDetail;
      this.taskData = {
        adminUsers: data.adminUsers,
        tasks: data.taskByUser,
        tasksSelfToApprove: data.tasksToApproveByUser,
        user: {
          id: data.userDetail.id,
          name: data.userDetail.name,
          lastName: data.userDetail.lastName,
        },
      };
    });
  }
}
