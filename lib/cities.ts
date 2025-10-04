export interface CityInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
  description?: string;
  image?: string;
}

export type CityClickHandler = (city: CityInfo) => void;

// A small sample list of cities used by the EarthGlobe component. You can extend this with more entries or load dynamically.
export const cities: CityInfo[] = [
  { id: 'cairo', name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', description: 'Cairo from orbit', image: '/egypt-cupola.jpg' },
  { id: 'newyork', name: 'New York', lat: 40.7128, lng: -74.0060, country: 'United States', description: 'New York City from orbit', image: '/usa-night.jpg' },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', description: 'Tokyo from orbit', image: '/japan-night.jpg' },
  { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278, country: 'United Kingdom', description: 'London from orbit', image: '/uk-night.jpg' },
  { id: 'paris', name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', description: 'Paris from orbit', image: '/france-night.jpg' },
  { id: 'berlin', name: 'Berlin', lat: 52.52, lng: 13.4050, country: 'Germany', description: 'Berlin from orbit', image: '/germany-night.jpg' },
  { id: 'rio', name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: 'Brazil', description: 'Rio from orbit', image: '/brazil-night.jpg' },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', description: 'Sydney from orbit', image: '/australia-night.jpg' },
  { id: 'delhi', name: 'Delhi', lat: 28.7041, lng: 77.1025, country: 'India', description: 'Delhi from orbit', image: '/india-night.jpg' },
  { id: 'beijing', name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China', description: 'Beijing from orbit', image: '/china-night.jpg' },
];
