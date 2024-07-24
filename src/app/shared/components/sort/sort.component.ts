import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type StatusSort = 'asc' | 'desc' | '';

@Component({
  selector: 'sort',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './sort.component.html',
  styleUrl: './sort.component.scss',
})
export class SortComponent {
  currentStatus: StatusSort = '';
  @Output() orderEmit = new EventEmitter<StatusSort>();
  changeOrder(order: StatusSort) {
    this.currentStatus = order;
    this.orderEmit.emit(this.currentStatus);
  }
}
