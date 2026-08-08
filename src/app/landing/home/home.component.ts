import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ZhButtonComponent } from '../../shared/components/ui/zh-button/zh-button.component';
import { ZhCardComponent } from '../../shared/components/ui/zh-card/zh-card.component';
import { ZhBadgeComponent } from '../../shared/components/ui/zh-badge/zh-badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink, 
    NgOptimizedImage,
    LucideAngularModule,
    ZhButtonComponent,
    ZhCardComponent,
    ZhBadgeComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Traditional', 'Vegetarian', 'Healthy', 'Regional'];
  
  foodItems = [
    { name: 'Authentic South Indian Thali', maker: 'Lakshmi Iyer', rating: 4.9, price: 150, time: '30 mins', distance: '1.2 km', veg: true, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&q=80&w=600' },
    { name: 'Punjabi Rajma Chawal', maker: 'Simran Kaur', rating: 4.8, price: 120, time: '20 mins', distance: '2.5 km', veg: true, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
    { name: 'Home-style Chicken Curry', maker: 'Rohan Sharma', rating: 4.7, price: 250, time: '45 mins', distance: '3.0 km', veg: false, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600' }
  ];

  makers = [
    { name: 'Aarti Desai', location: 'Andheri West', specialty: 'Gujarati Thali', rating: 4.9, meals: 450, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
    { name: 'Rahul Verma', location: 'Bandra East', specialty: 'Healthy Bowls', rating: 4.8, meals: 320, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
    { name: 'Meena Rao', location: 'Juhu', specialty: 'South Indian', rating: 5.0, meals: 890, image: 'https://images.unsplash.com/photo-1531123897727-8f129e1bf98c?auto=format&fit=crop&q=80&w=200' },
    { name: 'Tariq Khan', location: 'Versova', specialty: 'Mughlai', rating: 4.7, meals: 210, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }
  ];
}
