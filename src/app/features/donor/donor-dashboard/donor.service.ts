import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DonorService {
  getStats() {
    return [
      { label: 'Meals donated', value: '25,000+', icon: 'restaurant' },
      { label: 'People helped', value: '12,500+', icon: 'people' },
      { label: 'Waste reduced', value: '5 Tons', icon: 'eco' },
      { label: 'Impact score', value: '98%', icon: 'military_tech' },
    ];
  }

  getHistory() {
    return [
      { food: 'Vegetable biryani', quantity: '120 meals', date: '2026-07-21', volunteer: 'Milan', status: 'Delivered' },
      { food: 'Bakery boxes', quantity: '90 meals', date: '2026-07-18', volunteer: 'Riya', status: 'Accepted' },
      { food: 'Fruit trays', quantity: '75 meals', date: '2026-07-12', volunteer: 'Arun', status: 'Picked Up' },
    ];
  }

  getTimeline() {
    return [
      { title: 'Food registered', detail: 'Donation captured and verified', active: true },
      { title: 'Volunteer assigned', detail: 'Route matched to the nearest NGO', active: true },
      { title: 'Pickup started', detail: 'Volunteer is en route now', active: true },
      { title: 'Delivered', detail: 'Community handoff completed', active: false },
    ];
  }
}
