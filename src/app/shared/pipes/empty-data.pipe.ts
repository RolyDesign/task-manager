import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyData',
  standalone: true,
})
export class EmptyDataPipe implements PipeTransform {
  transform(value: unknown, symbol: string = '---'): unknown {
    if (typeof value == 'number') {
      return value;
    }
    if (value) {
      return value;
    }

    return symbol;
  }
}
