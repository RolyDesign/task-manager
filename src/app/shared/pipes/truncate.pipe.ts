import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(
    value: string,
    limit: number = 150,
    ellipsis: string = '...'
  ): string {
    if (!value.includes(' ') && value.length > 20) {
      return value.substring(0, 20) + ellipsis;
    }

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit) + ellipsis;
  }
}
