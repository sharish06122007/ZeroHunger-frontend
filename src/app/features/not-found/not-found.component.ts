import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#FFFBF5] p-6 relative overflow-hidden text-center">
      <!-- Ambient Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7743DB]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#C3ACD0]/20 blur-3xl pointer-events-none"></div>

      <div class="glass-panel max-w-md w-full p-10 rounded-3xl shadow-2xl border border-[#E8DDD3] bg-white/90 space-y-6 relative z-10">
        <div class="w-20 h-20 rounded-3xl bg-[#7743DB]/10 text-[#7743DB] mx-auto flex items-center justify-center text-4xl shadow-inner">
          🔍
        </div>

        <div class="space-y-2">
          <span class="badge badge-primary font-mono text-xs">ERR_404_NOT_FOUND</span>
          <h1 class="text-3xl font-extrabold text-[#1A1A1A]">Page Not Found</h1>
          <p class="text-xs text-[#5B5B6A] leading-relaxed">
            The resource or URL you requested does not exist on the ZeroHunger platform.
          </p>
        </div>

        <a routerLink="/dashboard" class="btn-primary inline-block py-3.5 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
          Return to Dashboard →
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
