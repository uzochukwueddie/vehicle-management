import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Vehicle } from '../interfaces/vehicle.interface';

const API_URL = 'https://67d4273b8bca322cc26c5b38.mockapi.io/vehicles';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private http: HttpClient = inject(HttpClient);

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(API_URL).pipe(catchError(this.handleError));
  }

  getVehicleById(id: string): Observable<Vehicle> {
    return this.http
      .get<Vehicle>(`${API_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  addVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http
      .post<Vehicle>(API_URL, vehicle)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
