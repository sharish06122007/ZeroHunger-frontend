import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './volunteer-dashboard.component.html',
  styleUrl: './volunteer-dashboard.component.scss',
})
export class VolunteerDashboardComponent {
  readonly pickups = [
    { title: 'Green Park Hotel', distance: '3.4 km', eta: '19 min', status: 'Ready to collect' },
    { title: 'Harbour Cafe', distance: '6.1 km', eta: '27 min', status: 'New request' },
  ];

  acceptPickup(): void {
    window.open('https://www.google.com/maps/dir/?api=1&destination=Green+Park+Hotel+Bengaluru', '_blank', 'noopener,noreferrer');
  }
}
