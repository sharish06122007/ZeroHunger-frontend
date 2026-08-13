import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AvailableFood {
  id: string;
  name: string;
  provider: string;
  category: string;
  quantity: string;
  location: string;
  price: string;
  time: string;
  image: string;
}

@Component({
  selector: 'app-home-food-available',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[var(--bg-main)] min-h-screen p-6 sm:p-8" @fadeInUp>
      <div class="mb-8">
        <h2 class="text-3xl font-extrabold text-[var(--text-main)]">Available Home Food</h2>
        <p class="mt-2 text-sm text-[var(--text-muted)]">
          Discover fresh, healthy homemade meals available near you.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of availableFoods" class="zh-card bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
          <div class="h-48 relative overflow-hidden bg-gray-200">
            <!-- Using a fallback gradient if no image to keep it looking premium -->
            <div class="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--accent)] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div class="absolute inset-0 flex items-center justify-center text-4xl">🍲</div>
            
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur text-[var(--primary)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {{ item.category }}
            </div>
          </div>
          
          <div class="p-6">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-[var(--text-main)] leading-tight">{{ item.name }}</h3>
              <span class="font-black text-[var(--primary)] text-lg">{{ item.price }}</span>
            </div>
            <p class="text-xs font-semibold text-[var(--text-muted)] mb-4">By {{ item.provider }}</p>
            
            <div class="space-y-2 mb-6">
              <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <svg class="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>{{ item.location }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <svg class="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>Available: {{ item.time }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                <svg class="w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span>Qty: {{ item.quantity }}</span>
              </div>
            </div>
            
            <button class="w-full btn-primary py-2.5 text-sm rounded-xl flex justify-center items-center gap-2 hover:-translate-y-0.5 transition-transform">
              Request Meal
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="availableFoods.length === 0" class="text-center py-20">
        <div class="w-20 h-20 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🍲</div>
        <h3 class="text-xl font-bold text-[var(--text-main)] mb-2">No meals available right now</h3>
        <p class="text-[var(--text-muted)] text-sm max-w-md mx-auto">Check back later for fresh home-cooked meals in your area.</p>
      </div>
    </div>
  `
})
export class HomeFoodAvailableComponent implements OnInit {
  availableFoods: AvailableFood[] = [];

  ngOnInit() {
    this.availableFoods = [
      {
        id: '1',
        name: 'Rice with Chicken Gravy',
        provider: 'Priya S.',
        category: 'Lunch',
        quantity: '5 portions',
        location: 'Chennai Central',
        price: '₹120',
        time: 'Today, 12:30 PM',
        image: ''
      },
      {
        id: '2',
        name: 'Fresh Cooked Vegetarian Buffet',
        provider: 'Rahul Kitchen',
        category: 'Dinner',
        quantity: '10 boxes',
        location: 'Mumbai Suburbs',
        price: '₹150',
        time: 'Today, 7:00 PM',
        image: ''
      },
      {
        id: '3',
        name: 'Traditional Roti and Dal',
        provider: 'Asha Home Foods',
        category: 'Lunch',
        quantity: '3 portions',
        location: 'Delhi South',
        price: '₹90',
        time: 'Today, 1:00 PM',
        image: ''
      },
      {
        id: '4',
        name: 'Healthy Breakfast Poha',
        provider: 'Meera',
        category: 'Breakfast',
        quantity: '4 portions',
        location: 'Pune',
        price: '₹60',
        time: 'Tomorrow, 8:00 AM',
        image: ''
      }
    ];
  }
}
