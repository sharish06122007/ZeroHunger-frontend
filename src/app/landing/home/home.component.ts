import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly stats = [
    { value: '500k+', label: 'Meals rescued' },
    { value: '250k+', label: 'People helped' },
    { value: '10k+', label: 'Volunteers' },
    { value: '5k+', label: 'Partners' },
  ];

  readonly workflow = ['Food donor', 'Upload surplus food', 'Smart matching', 'Volunteer pickup', 'NGO distribution', 'People receive food'];
}
