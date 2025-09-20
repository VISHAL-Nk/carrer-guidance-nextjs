export interface College {
  id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  established: number;
  courses: string[];
  website?: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  state?: string;
}

export interface CollegeWithDistance extends College {
  distance: number;
  travelTime: number;
}