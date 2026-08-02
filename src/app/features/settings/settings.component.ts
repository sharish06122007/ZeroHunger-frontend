import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/authentication/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(12px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-8" @fadeIn>
      <div>
        <h1 class="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">System Settings & Profile</h1>
        <p class="text-xs text-[#5B5B6A] mt-1">Manage your organization profile, notifications, and security</p>
      </div>

      <div class="glass-panel p-8 sm:p-10 rounded-3xl border border-[#E8DDD3] bg-white/90 shadow-xl space-y-6">
        <div class="flex items-center gap-4 pb-6 border-b border-[#E8DDD3]">
          <div class="w-14 h-14 rounded-2xl bg-[#7743DB] text-white flex items-center justify-center font-black text-xl shadow-lg">
            {{ currentUser()?.fullName?.charAt(0) || 'U' }}
          </div>
          <div>
            <h2 class="font-extrabold text-lg text-[#1A1A1A]">{{ currentUser()?.fullName }}</h2>
            <span class="badge badge-primary text-[10px] uppercase font-bold tracking-wider">{{ currentUser()?.role }} Role</span>
          </div>
        </div>

        <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="form-group">
            <label class="form-label" for="fullName">Full Name <span class="text-rose-500">*</span></label>
            <input id="fullName" type="text" class="input-field" formControlName="fullName" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="email">Work Email (Read-Only)</label>
              <input id="email" type="email" class="input-field bg-[#F7EFE5]/50 text-[#5B5B6A]" formControlName="email" readonly />
            </div>

            <div class="form-group">
              <label class="form-label" for="phone">Phone Number</label>
              <input id="phone" type="text" class="input-field" formControlName="phone" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label" for="city">City / Region</label>
              <input id="city" type="text" class="input-field" formControlName="city" />
            </div>

            <div class="form-group">
              <label class="form-label" for="org">Organization Name</label>
              <input id="org" type="text" class="input-field" formControlName="organizationName" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="address">Pickup Address / Street</label>
            <input id="address" type="text" class="input-field" formControlName="address" />
          </div>

          <div class="form-group">
            <label class="form-label" for="bio">Profile Description & Mission</label>
            <textarea id="bio" rows="3" class="input-field resize-none" formControlName="bio"></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[#E8DDD3]">
            <span class="text-xs text-[#5B5B6A]">Account Status: <strong class="text-emerald-600">Active & Verified</strong></span>
            <button type="submit" [disabled]="isLoading()" class="btn-primary py-3 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[#7743DB]/30">
              @if (isLoading()) {
                <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              } @else {
                <span>Save Changes 💾</span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoading = signal(false);

  readonly settingsForm = this.fb.group({
    fullName: [this.currentUser()?.fullName || '', Validators.required],
    email: [{ value: this.currentUser()?.email || '', disabled: true }],
    phone: [this.currentUser()?.phone || ''],
    city: [this.currentUser()?.city || ''],
    organizationName: [this.currentUser()?.organizationName || ''],
    address: [this.currentUser()?.address || ''],
    bio: [this.currentUser()?.bio || ''],
  });

  onSubmit(): void {
    if (this.settingsForm.invalid) return;
    this.isLoading.set(true);

    const val = this.settingsForm.value;
    this.authService.updateProfile({
      fullName: val.fullName!,
      phone: val.phone || undefined,
      city: val.city || undefined,
      organizationName: val.organizationName || undefined,
      address: val.address || undefined,
      bio: val.bio || undefined,
    } as any).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Settings Saved', 'Profile details updated.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Update Failed', err.message);
      },
    });
  }
}
