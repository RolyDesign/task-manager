import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  constructor() {}

  capitalizeColumnName(value: string) {
    return value[0].trim().toLocaleUpperCase() + value.slice(1, value.length);
  }
}
