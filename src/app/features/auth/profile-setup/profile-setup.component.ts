import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-profile-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#FFFBF5] p-6 relative overflow-hidden">
      <!-- Ambient Background Orbs -->
      <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#7743DB]/15 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#C3ACD0]/20 blur-3xl pointer-events-none"></div>

      <div class="glass-panel max-w-lg w-full p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#E8DDD3] bg-white/90 space-y-6 relative z-10" @fadeIn>
        <div class="text-center space-y-3">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7743DB] to-[#C3ACD0] text-white mx-auto flex items-center justify-center text-2xl font-black shadow-lg shadow-[#7743DB]/30">
            ZH
          </div>
          <h1 class="text-2xl font-extrabold text-[#1A1A1A]">Setup Your Profile</h1>
          <p class="text-xs text-[#5B5B6A] leading-relaxed">
            Provide your operating location and organizational details to enable AI location matching for nearby food rescues.
          </p>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="form-group">
            <label class="form-label" for="city">City / Metro Region <span class="text-rose-500">*</span></label>
            <input id="city" type="text" class="input-field" formControlName="city" placeholder="e.g. San Francisco, New York, London" />
          </div>

          <div class="form-group">
            <label class="form-label" for="address">Street Address / Pickup Landmark</label>
            <input id="address" type="text" class="input-field" formControlName="address" placeholder="123 Market St, Suite 400" />
          </div>

          <div class="form-group">
            <label class="form-label" for="bio">Organization Mission / Description</label>
            <textarea id="bio" rows="3" class="input-field resize-none" formControlName="bio" placeholder="Briefly describe your food donation capacity or NGO feeding program..."></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[#E8DDD3]">
            <button type="button" (click)="skip()" class="text-xs font-bold text-[#5B5B6A] hover:text-[#1A1A1A]">
              Skip for now
            </button>
            <button type="submit" [disabled]="isLoading()" class="btn-primary py-3 px-6 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
              @if (isLoading()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving Profile...</span>
              } @else {
                <span>Complete Profile & Go to Dashboard →</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class ProfileSetupComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly isLoading = signal(false);

  readonly profileForm = this.fb.group({
    city: ['', Validators.required],
    address: [''],
    bio: [''],
  });

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.updateProfile({
      city: this.profileForm.value.city!,
      address: this.profileForm.value.address || undefined,
      bio: this.profileForm.value.bio || undefined,
      profileCompleted: true,
    } as any).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Profile Complete!', 'Welcome to ZeroHunger Dashboard');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Update Failed', err.message);
      },
    });
  }

  skip(): void {
    this.router.navigate(['/dashboard']);
  }
}
