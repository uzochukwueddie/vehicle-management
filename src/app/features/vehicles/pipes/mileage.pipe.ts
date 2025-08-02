import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mileage',
  standalone: true,
})
export class MileagePipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return 'Mileage not specified';
    }

    if (typeof value === 'number') {
      return `${this.formatter(value)} miles`;
    }

    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue === '') {
        return 'Mileage not specified';
      }
      return isNaN(parseInt(value))
        ? `${trimmedValue} (Not correct mileage)`
        : `${this.formatter(parseInt(value))} miles`;
    }

    // Fallback for any other type
    return 'Mileage not specified';
  }

  private formatter(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }
}
