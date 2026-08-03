import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface FloatingFoodParticle {
  emoji: string;
  left: number;
  top: number;
  scale: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-zerohunger-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zerohunger-loader.component.html',
  styleUrls: ['./zerohunger-loader.component.scss'],
})
export class ZerohungerLoaderComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  readonly foodParticles = signal<FloatingFoodParticle[]>([]);
  readonly currentMessageIndex = signal(0);

  private messageIntervalId?: number;
  private redirectTimeoutId?: number;

  readonly foodList = [
    // Fruits
    '🍎', '🍊', '🍌', '🍓', '🍇',
    // Vegetables
    '🥕', '🥦', '🥬', '🌽', '🥒',
    // Bakery
    '🥖', '🥐', '🍞', '🧁',
    // Meals
    '🍱', '🍚', '🥗', '🍲',
  ];

  readonly messages = [
    'Preparing rescue network 🌱',
    'Finding surplus food 🍱',
    'Connecting volunteers 🚚',
    'Saving meals today 🤝',
    'Welcome to ZeroHunger 🌍',
  ];

  get currentMessage(): string {
    return this.messages[this.currentMessageIndex()];
  }

  ngOnInit(): void {
    this.generateFoodParticles();

    // Rotate status messages every 800ms
    this.messageIntervalId = window.setInterval(() => {
      this.currentMessageIndex.update(idx => (idx + 1) % this.messages.length);
    }, 800);

    // Automatically redirect to /dashboard after 4000ms
    this.redirectTimeoutId = window.setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 4000);
  }

  private generateFoodParticles(): void {
    const particles: FloatingFoodParticle[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const emoji = this.foodList[i % this.foodList.length];
      particles.push({
        emoji,
        left: Math.floor(Math.random() * 92) + 4,
        top: Math.floor(Math.random() * 90) + 5,
        scale: Math.round((Math.random() * 0.7 + 0.6) * 100) / 100,
        duration: Math.round((Math.random() * 4 + 4) * 10) / 10,
        delay: Math.round(Math.random() * 3 * 10) / 10,
      });
    }

    this.foodParticles.set(particles);
  }

  ngOnDestroy(): void {
    if (this.messageIntervalId) {
      clearInterval(this.messageIntervalId);
    }
    if (this.redirectTimeoutId) {
      clearTimeout(this.redirectTimeoutId);
    }
  }
}
