import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'manufacturerName',
  standalone: true,
})
export class ManufacturerNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.trim() === '') {
      return 'Manufacturer not specified';
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length <= 15) {
      return trimmedValue;
    }
    return trimmedValue.substring(0, 15) + '...';
  }
}
