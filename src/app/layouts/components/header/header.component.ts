import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from '../nav/nav.component';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/users/user.service';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ConfirmComponent,
  DialogData,
} from '../../../shared/components/confirm-generic/confirm.component';
import { EMPTY, switchMap } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    NavComponent,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  userIdentity = inject(UserService).userIdentity$;
  authService = inject(AuthService);

  constructor(private dialog: MatDialog) {}

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Cuidado',
        message: 'Va a cerrar la sesion. ¿Está seguro?',
        confirmButton: {
          color: 'primary',
          confirmButtonName: 'Si',
        },
        clearButtonClose: false,
        closeButtonName: 'Cerrar',
      } as DialogData,
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((res) => {
          if (res) {
            this.authService.logOut();
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
}
