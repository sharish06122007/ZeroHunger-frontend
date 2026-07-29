import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  getImpactSnapshot() {
    return [
      { label: 'Meals rescued', value: 182000, trend: '+12%' },
      { label: 'Volunteers active', value: 128, trend: '+8%' },
      { label: 'NGOs connected', value: 47, trend: '+5%' },
      { label: 'Average pickup time', value: '19 min', trend: '-6%' },
    ];
  }
}
