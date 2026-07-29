import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {
  readonly metrics: Array<{ label: string; value: number | string; trend: string }>;

  constructor(private readonly analyticsService: AnalyticsService) {
    this.metrics = this.analyticsService.getImpactSnapshot();
  }
}
