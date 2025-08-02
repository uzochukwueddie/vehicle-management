export interface Vehicle {
  id?: string;
  name: string;
  manufacturer: string;
  model: string;
  fuel: string;
  type: string;
  vin: string;
  color?: string | null;
  mileage?: number | string | null;
}

export const defaultVehicleData: Vehicle = {
  // id: '',
  name: '',
  manufacturer: '',
  model: '',
  fuel: '',
  type: '',
  vin: '',
  color: null,
  mileage: null,
};

export const FUEL_TYPES: string[] = [
  'Gasoline',
  'Diesel',
  'Electric',
  'Hybrid',
  'Hydrogen',
  'Plug-in Hybrid',
];

export const VEHICLE_TYPES: string[] = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Coupe',
  'Convertible',
  'Wagon',
  'Pickup Truck',
  'Crew Cab Pickup',
  'Van',
  'Cargo Van',
  'Minivan',
  'Sports Car',
  'Luxury Car',
  'Compact Car',
  'Crossover',
];

export const MANUFACTURERS: string[] = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Volkswagen',
  'Nissan',
  'Hyundai',
  'Kia',
  'Mazda',
  'Subaru',
  'Lexus',
  'Infiniti',
  'Acura',
  'Jeep',
  'Ram',
  'GMC',
  'Cadillac',
  'Buick',
  'Lincoln',
  'Volvo',
  'Land Rover',
  'Jaguar',
  'Porsche',
  'Tesla',
  'Bentley',
];
