import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { DonationLocation } from '../../../core/models/donation.model';
import { DonorService } from './donor.service';
import { MapService } from './map.service';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-donor-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatMenuModule, MatTabsModule],
  templateUrl: './donor-dashboard.component.html',
  styleUrl: './donor-dashboard.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(18px)' }), animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
    ]),
    trigger('slideIn', [
      state('active', style({ transform: 'translateX(0)', opacity: 1 })),
      state('inactive', style({ transform: 'translateX(20px)', opacity: 0.7 })),
      transition('inactive <=> active', animate('250ms ease-out')),
    ]),
    trigger('successIn', [
      transition(':enter', [style({ opacity: 0, transform: 'translateY(8px)' }), animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
    ]),
  ],
})
export class DonorDashboardComponent {
  readonly stats: Array<{ label: string; value: string; icon: string }>;
  readonly timeline: Array<{ title: string; detail: string; active: boolean }>;
  readonly history: Array<{ food: string; quantity: string; date: string; volunteer: string; status: string }>;
  readonly notifications: Array<{ title: string; time: string; unread: boolean }>;
  readonly routeStops: Array<{ label: string; lat: number; lng: number; type: string }>;
  readonly categories = ['Rice Items', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Fruits', 'Vegetables', 'Bakery Items', 'Beverages', 'Packed Food', 'Other'];
  readonly foodSuggestions = ['Rice', 'Biryani', 'Chapati', 'Idli', 'Dosa', 'Meals', 'Vegetable Curry', 'Chicken Rice', 'Sambar Rice', 'Curd Rice', 'Fried Rice', 'Bread', 'Snacks', 'Fruits'];

  selectedLocation: DonationLocation = {
    name: 'Green Market Kitchen',
    address: '12 Market Lane',
    city: 'Bengaluru',
    type: 'pickup',
    description: 'Busy kitchen with ready-to-serve meals and a quick handoff lane.',
    mapsQuery: 'Green Market Kitchen Bengaluru',
  };

  donationForm = {
    foodName: '',
    category: '',
    quantity: '',
    meals: '',
    prepTime: '',
    expiryTime: '',
    location: '',
    phone: '',
    imageName: '',
    imageSize: '',
    latitude: '',
    longitude: '',
  };

  formErrors = {
    foodName: '',
    category: '',
    quantity: '',
    location: '',
    phone: '',
    image: '',
  };

  isSubmitting = false;
  showSuccess = false;
  isGeolocating = false;
  filteredSuggestions: string[] = [];
  showSuggestions = false;

  constructor(private readonly donorService: DonorService, private readonly mapService: MapService, private readonly notificationService: NotificationService) {
    this.stats = this.donorService.getStats();
    this.timeline = this.donorService.getTimeline();
    this.history = this.donorService.getHistory();
    this.notifications = this.notificationService.getNotifications();
    this.routeStops = this.mapService.getRouteStops();
  }

  get previewDonation() {
    return {
      foodName: this.donationForm.foodName || 'Biryani',
      category: this.donationForm.category || 'Dinner',
      quantity: this.donationForm.quantity || '200',
      meals: this.donationForm.meals || '200',
      location: this.donationForm.location || 'Chennai',
      status: 'Available',
    };
  }

  selectLocation(location: DonationLocation): void {
    this.selectedLocation = location;
  }

  openMaps(location: DonationLocation): void {
    this.mapService.openDirections(location.mapsQuery || `${location.address}, ${location.city}`);
  }

  onFoodNameInput(): void {
    const searchText = this.donationForm.foodName.trim().toLowerCase();
    this.showSuggestions = searchText.length > 0;
    this.filteredSuggestions = this.foodSuggestions.filter((item) => item.toLowerCase().includes(searchText)).slice(0, 5);
    if (!this.filteredSuggestions.length) {
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string): void {
    this.donationForm.foodName = suggestion;
    this.showSuggestions = false;
  }

  useCurrentLocation(): void {
    if (!('geolocation' in navigator)) {
      this.formErrors.location = 'Geolocation is not supported in this browser.';
      return;
    }

    this.isGeolocating = true;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.isGeolocating = false;
        this.donationForm.latitude = position.coords.latitude.toFixed(6);
        this.donationForm.longitude = position.coords.longitude.toFixed(6);
        this.donationForm.location = 'Current location detected';
        this.formErrors.location = '';
      },
      () => {
        this.isGeolocating = false;
        this.formErrors.location = 'Unable to access your location. Please enter a pickup point manually.';
      },
    );
  }

  openGoogleMaps(): void {
    const query = this.donationForm.latitude && this.donationForm.longitude ? `${this.donationForm.latitude},${this.donationForm.longitude}` : this.donationForm.location || 'Chennai';
    window.open(`https://www.google.com/maps?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.formErrors.image = 'Image size must be 2 MB or less.';
      this.donationForm.imageName = '';
      this.donationForm.imageSize = '';
      return;
    }

    this.formErrors.image = '';
    this.donationForm.imageName = file.name;
    this.donationForm.imageSize = `${(file.size / 1024 / 1024).toFixed(1)} MB`;
  }

  submitDonation(): void {
    this.formErrors = {
      foodName: '',
      category: '',
      quantity: '',
      location: '',
      phone: '',
      image: '',
    };

    const phonePattern = /^[0-9]{10}$/;
    const errors = { ...this.formErrors };

    if (!this.donationForm.foodName.trim()) {
      errors.foodName = 'Food name is required.';
    }

    if (!this.donationForm.category) {
      errors.category = 'Category is required.';
    }

    if (!this.donationForm.quantity.trim()) {
      errors.quantity = 'Quantity is required.';
    }

    if (!this.donationForm.location.trim()) {
      errors.location = 'Pickup location is required.';
    }

    if (!this.donationForm.phone.trim() || !phonePattern.test(this.donationForm.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }

    if (Object.values(errors).some(Boolean)) {
      this.formErrors = errors;
      return;
    }

    this.isSubmitting = true;
    this.showSuccess = false;

    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccess = true;
    }, 900);
  }
}
