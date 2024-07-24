import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NavService } from './nav.service';
import { INav } from './model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  navService = inject(NavService);
  navItems!: INav[];

  ngOnInit() {
    this.navService.getNavItemsWithPermissions().subscribe((res) => {
      this.navItems = res;
    });
  }
}
