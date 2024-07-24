import { Component, inject } from '@angular/core';
import { LoaderService } from './loader.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class LoaderComponent {
  isLoading = inject(LoaderService).loading;
}
