import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { VehicleService } from '../../services/vehicle';
import { MileagePipe } from '../../pipes/mileage.pipe';
import { VehicleNamePipe } from '../../pipes/vehicle-name.pipe';
import { PaginationComponent } from './pagination';
import { ManufacturerNamePipe } from '../../pipes/manufacturer.pipe';
import { VehicleModalComponent } from '../modal/modal';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    MileagePipe,
    ManufacturerNamePipe,
    VehicleNamePipe,
    PaginationComponent,
    VehicleModalComponent,
  ],
  templateUrl: './list.html',
  styleUrls: ['./list.scss'],
})
export class VehicleListComponent implements OnInit, OnDestroy {
  private vehicleService: VehicleService = inject(VehicleService);
  private router: Router = inject(Router);
  private destroy$ = new Subject<void>();
  private itemsPerPage: number = 12;
  private vehiclesData: WritableSignal<Vehicle[]> = signal([]);

  currentPage: WritableSignal<number> = signal(1);
  vehicles: Signal<Vehicle[]> = computed(() => {
    const allVehicles: Vehicle[] = this.vehiclesData();
    if (allVehicles.length === 0) return [];

    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      allVehicles.length
    );
    return allVehicles.slice(startIndex, endIndex);
  });
  totalItems: Signal<number> = computed(() => this.vehiclesData().length);
  totalPages: Signal<number> = computed(() =>
    Math.ceil(this.totalItems() / this.itemsPerPage)
  );

  loading: WritableSignal<boolean> = signal(false);
  error: WritableSignal<string | null> = signal(null);
  showModal: WritableSignal<boolean> = signal(false);

  ngOnInit(): void {
    this.loadVehicles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVehicles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.vehicleService
      .getVehicles()
      .pipe(
        finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data: Vehicle[]) => {
          const sortedVehicles: Vehicle[] = this.sortVehicles(data);
          this.vehiclesData.set(sortedVehicles);
        },
        error: (error) => {
          this.error.set(error.message);
        },
      });
  }

  onVehicleClick(vehicle: Vehicle): void {
    if (vehicle.id) {
      this.router.navigate(['/vehicle', vehicle.id]);
    }
  }

  openAddVehicleModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onVehicleAdded(vehicle: Vehicle): void {
    this.closeModal();
    const vehicles = [...this.vehicles(), vehicle];
    const sortedVehicles: Vehicle[] = this.sortVehicles(vehicles);
    this.vehiclesData.set(sortedVehicles);
  }

  onCurrentPageData(event: number): void {
    this.currentPage.set(event);
  }

  private sortVehicles(vehicles: Vehicle[]): Vehicle[] {
    return vehicles.sort((a, b) => a.name.localeCompare(b.name));
  }
}
