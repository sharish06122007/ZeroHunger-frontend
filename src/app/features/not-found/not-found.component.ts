import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[var(--bg-main)] p-6 relative overflow-hidden text-center">
      <!-- Ambient Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--primary)]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--accent)]/20 blur-3xl pointer-events-none"></div>

      <div class="glass-panel max-w-md w-full p-10 rounded-3xl shadow-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-6 relative z-10">
        <div class="w-20 h-20 rounded-3xl bg-[var(--primary)]/10 text-[var(--primary)] mx-auto flex items-center justify-center text-4xl shadow-inner">
          🔍
        </div>

        <div class="space-y-2">
          <span class="badge badge-primary font-mono text-xs">ERR_404_NOT_FOUND</span>
          <h1 class="text-3xl font-extrabold text-[var(--text-main)]">Page Not Found</h1>
          <p class="text-xs text-[var(--text-muted)] leading-relaxed">
            The resource or URL you requested does not exist on the ZeroHunger platform.
          </p>
        </div>

        <a routerLink="/dashboard" class="btn-primary inline-block py-3.5 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[var(--primary)]/30">
          Return to Dashboard →
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
