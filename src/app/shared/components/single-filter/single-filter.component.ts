import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { debounceTime } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'single-filter',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './single-filter.component.html',
  styleUrl: './single-filter.component.scss',
})
export class SingleFilterComponent {
  searchForm!: FormGroup;
  fb = inject(FormBuilder);
  @Input() visible: boolean = true;
  @Input() debounceTime: number = 500;
  @Input() initialValue: string = '';
  @Output() filterChange = new EventEmitter<string>();
  ngOnInit() {
    this.searchForm = this.fb.group({
      searchControl: [this.initialValue],
    });
    this.searchForm
      .get('searchControl')
      ?.valueChanges.pipe(debounceTime(this.debounceTime))
      .subscribe((res) => {
        this.filterChange.emit(res);
      });
  }
  clearFilter() {
    this.searchForm.get('searchControl')?.patchValue('');
  }
}
