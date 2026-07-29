import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MapService {
  getRouteStops() {
    return [
      { label: 'Donor location', lat: 12.9716, lng: 77.5946, type: 'donor' },
      { label: 'Volunteer location', lat: 12.965, lng: 77.603, type: 'volunteer' },
      { label: 'NGO location', lat: 12.958, lng: 77.61, type: 'ngo' },
    ];
  }

  openDirections(destination: string): void {
    const query = encodeURIComponent(destination);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank', 'noopener,noreferrer');
  }
}
