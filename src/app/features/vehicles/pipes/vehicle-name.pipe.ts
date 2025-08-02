import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleName',
  standalone: true,
})
export class VehicleNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || value.trim() === '') {
      return 'Unnamed Vehicle';
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length <= 35) {
      return trimmedValue;
    }
    return trimmedValue.substring(0, 32) + '...';
  }
}
