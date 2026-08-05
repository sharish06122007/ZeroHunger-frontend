import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-zerohunger-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './zerohunger-loader.component.html',
  styleUrls: ['./zerohunger-loader.component.scss'],
})
export class ZerohungerLoaderComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);

  readonly currentMessageIndex = signal(0);

  private messageIntervalId?: number;
  private redirectTimeoutId?: number;

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
    // Rotate status messages every 800ms
    this.messageIntervalId = window.setInterval(() => {
      this.currentMessageIndex.update(idx => (idx + 1) % this.messages.length);
    }, 800);

    // Automatically redirect to /dashboard after 4000ms
    this.redirectTimeoutId = window.setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 4000);
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
