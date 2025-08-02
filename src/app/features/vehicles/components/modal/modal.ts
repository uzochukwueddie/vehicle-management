import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  output,
  OutputEmitterRef,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  defaultVehicleData,
  FUEL_TYPES,
  MANUFACTURERS,
  Vehicle,
  VEHICLE_TYPES,
} from '../../interfaces/vehicle.interface';
import { VehicleService } from '../../services/vehicle';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class VehicleModalComponent {
  private vehicleService: VehicleService = inject(VehicleService);

  close: OutputEmitterRef<void> = output<void>();
  vehicleAdded: OutputEmitterRef<Vehicle> = output<Vehicle>();

  vehicleForm: FormGroup;
  vehicle: WritableSignal<Vehicle> = signal(defaultVehicleData);
  submitting: WritableSignal<boolean> = signal(false);
  submitError: WritableSignal<string | null> = signal(null);

  fuelTypes: string[] = FUEL_TYPES;
  vehicleTypes: string[] = VEHICLE_TYPES;
  manufacturers: string[] = MANUFACTURERS;

  constructor() {
    this.vehicleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      manufacturer: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      fuel: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      vin: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/),
      ]),
      color: new FormControl(''),
      mileage: new FormControl('', [Validators.min(0)]),
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.valid) {
      this.submitting.set(true);
      this.submitError.set(null);

      const formValue = this.vehicleForm.value;
      const vehicleData: Vehicle = {
        name: formValue.name.trim(),
        manufacturer: formValue.manufacturer,
        model: formValue.model.trim(),
        fuel: formValue.fuel,
        type: formValue.type,
        vin: formValue.vin.trim().toUpperCase(),
        color: formValue.color?.trim() || null,
        mileage: formValue.mileage ? Number(formValue.mileage) : null,
      };

      this.vehicleService
        .addVehicle(vehicleData)
        .pipe(finalize(() => this.submitting.set(false)))
        .subscribe({
          next: (data: Vehicle) => {
            this.vehicleAdded.emit(data);
          },
          error: () => {
            this.submitError.set('Failed to add vehicle. Please try again.');
          },
        });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  checkInputFieldStatus(name: string): boolean | undefined {
    return (
      this.vehicleForm.get(name)?.invalid && this.vehicleForm.get(name)?.dirty
    );
  }
}
