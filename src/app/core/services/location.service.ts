import { Injectable, signal } from '@angular/core';

export interface LocationData {
  city: string;
  state: string;
  country: string;
  formattedAddress: string;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  status: 'detecting' | 'granted' | 'denied' | 'unavailable';
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  readonly location = signal<LocationData>({
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    formattedAddress: '📍 Chennai, Tamil Nadu, India',
    latitude: 13.0827,
    longitude: 80.2707,
    accuracy: null,
    status: 'detecting',
  });

  constructor() {
    this.detectLocation();
  }

  detectLocation(): void {
    this.location.update(s => ({ ...s, status: 'detecting' }));

    if (!navigator.geolocation) {
      this.location.set({
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
        formattedAddress: '📍 Chennai, Tamil Nadu, India (Default)',
        latitude: 13.0827,
        longitude: 80.2707,
        accuracy: null,
        status: 'unavailable',
        errorMessage: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || 'Chennai';
            const state = addr.state || 'Tamil Nadu';
            const country = addr.country || 'India';
            const formatted = data.display_name || `📍 ${city}, ${state}, ${country}`;

            this.location.set({
              city,
              state,
              country,
              formattedAddress: formatted,
              latitude: lat,
              longitude: lon,
              accuracy,
              status: 'granted',
            });
          })
          .catch(() => {
            this.location.set({
              city: 'Current Location',
              state: '',
              country: '',
              formattedAddress: `📍 Lat: ${lat.toFixed(4)}, Long: ${lon.toFixed(4)}`,
              latitude: lat,
              longitude: lon,
              accuracy,
              status: 'granted',
            });
          });
      },
      (error) => {
        this.location.set({
          city: 'Location Unavailable',
          state: '',
          country: '',
          formattedAddress: 'Location access denied. Click "Enable Location" to allow access.',
          latitude: null,
          longitude: null,
          accuracy: null,
          status: 'denied',
          errorMessage: error.message,
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }
}
