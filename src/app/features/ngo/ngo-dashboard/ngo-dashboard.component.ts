import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ngo-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './ngo-dashboard.component.html',
  styleUrl: './ngo-dashboard.component.scss',
})
export class NgoDashboardComponent {
  readonly inventory = [
    { title: 'Meal packs', value: '32' },
    { title: 'Fresh trays', value: '18' },
    { title: 'Families queued', value: '156' },
  ];
}
