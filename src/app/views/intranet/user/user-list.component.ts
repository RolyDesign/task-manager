import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SingleFilterComponent } from '../../../shared/components/single-filter/single-filter.component';
import { TaskService } from '../task/task.service';
import { StatusSort } from '../../../shared/components/sort/sort.component';
import { BehaviorSubject, EMPTY, switchMap, tap } from 'rxjs';
import { UserService } from '../../../core/users/user.service';
import { IUserGetDTO } from '../../../core/users/model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IdentityService } from '../../../core/users/identity.service';
import { PERMISSION_ENUM } from '../../../shared/metadata';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  ConfirmComponent,
  DialogData,
} from '../../../shared/components/confirm-generic/confirm.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatToolbarModule,
    SingleFilterComponent,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    NgClass,
    MatPaginatorModule,
    MatSortModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  route = inject(ActivatedRoute);
  identityService = inject(IdentityService);
  userService = inject(UserService);
  permission = PERMISSION_ENUM;
  users$ = new BehaviorSubject<IUserGetDTO[]>([]);
  searchValue = '';
  sortOrder: StatusSort = '';
  dialog = inject(MatDialog);
  displayedColumns: string[] = [
    'name',
    'lastName',
    'userName',
    'age',
    'email',
    'phoneNumber',
    'address',
    'role',
    'actions',
  ];
  selectedRowIndex = -1;
  dataSource: MatTableDataSource<IUserGetDTO> =
    new MatTableDataSource<IUserGetDTO>([]);
  router = inject(Router);
  dr = inject(DestroyRef);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.route.data.subscribe(({ users }) => {
      this.dataSource = new MatTableDataSource(users);
    });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  refreshData() {
    return this.userService.getUsers$(this.searchValue, this.sortOrder).pipe(
      tap((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    );
  }
  filterChange(e: string) {
    this.searchValue = e;
    this.refreshData().subscribe();
  }
  onDetail(id: number) {
    this.identityService
      .hasPermission$(this.permission.users_read)
      .pipe(
        takeUntilDestroyed(this.dr),
        tap(() => this.router.navigate(['users', id]))
      )
      .subscribe();
  }
  onDelete(user: IUserGetDTO) {
    const dialog = this.dialog.open(ConfirmComponent, {
      data: {
        title: 'Cuidado',
        message: `Va a eliminar al user:${user.name} ${user.lastName} ¿Está seguro?`,
        confirmButton: {
          color: 'primary',
          confirmButtonName: 'Si',
        },
        clearButtonClose: false,
        closeButtonName: 'Cerrar',
      } as DialogData,
      disableClose: true,
    });

    dialog
      .afterClosed()
      .pipe(
        switchMap((res) => {
          if (res) {
            return this.userService.deleteUser$(user.id).pipe(
              switchMap(() => {
                return this.refreshData();
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
  highlight(i: number) {
    this.selectedRowIndex = i;
  }
}
