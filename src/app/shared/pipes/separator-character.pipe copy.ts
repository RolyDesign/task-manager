import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separatorChar',
  standalone: true,
})
export class SeparatorCharPipe implements PipeTransform {
  transform(value: string, char: string, separator: string = ' | '): string {
    if (!value) return value;

    const val = value.split(char).join(separator);

    return val;
  }
}
