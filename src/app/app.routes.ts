import { Routes } from '@angular/router';
import { VehicleListComponent } from './features/vehicles/components/list/list';
import { VehicleDetailsComponent } from './features/vehicles/components/details/details';

export const routes: Routes = [
  { path: '', component: VehicleListComponent },
  { path: 'vehicle/:id', component: VehicleDetailsComponent },
  { path: '**', redirectTo: '' },
];
