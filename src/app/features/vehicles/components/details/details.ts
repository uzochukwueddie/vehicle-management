import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  defaultVehicleData,
  Vehicle,
} from '../../interfaces/vehicle.interface';
import { VehicleService } from '../../services/vehicle';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MileagePipe } from '../../pipes/mileage.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehicle-details',
  imports: [CommonModule, MileagePipe],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class VehicleDetailsComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private destroy$ = new Subject<void>();
  private vehicleService: VehicleService = inject(VehicleService);

  vehicle: WritableSignal<Vehicle> = signal(defaultVehicleData);
  error: WritableSignal<string | null> = signal(null);
  loading: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVehicle(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicle(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.vehicleService
      .getVehicleById(id)
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data: Vehicle) => {
          this.vehicle.set(data);
        },
        error: (error) => {
          this.error = error.message;
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
