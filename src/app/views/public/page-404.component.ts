import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-404',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss',
})
export class Page404Component {}
