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
        <h1 class="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">System Settings & Profile</h1>
        <p class="text-xs text-[var(--text-muted)] mt-1">Manage your organization profile, notifications, and security</p>
      </div>

      <div class="zh-card p-8 sm:p-10 space-y-6">
        <div class="flex items-center gap-4 pb-6 border-b border-[var(--border-color)]">
          <div class="w-14 h-14 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center font-black text-xl shadow-lg">
            {{ currentUser()?.fullName?.charAt(0) || 'U' }}
          </div>
          <div>
            <h2 class="font-extrabold text-lg text-[var(--text-main)]">{{ currentUser()?.fullName }}</h2>
            <span class="badge badge-primary text-[10px] uppercase font-bold tracking-wider">{{ currentUser()?.role }} Role</span>
          </div>
        </div>

        <form [formGroup]="settingsForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="form-group">
            <label class="zh-label" for="fullName">Full Name <span class="text-rose-500">*</span></label>
            <input id="fullName" type="text" class="zh-input" formControlName="fullName" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="zh-label" for="email">Work Email (Read-Only)</label>
              <input id="email" type="email" class="zh-input bg-[var(--bg-surface)]/50 text-[var(--text-muted)]" formControlName="email" readonly />
            </div>

            <div class="form-group">
              <label class="zh-label" for="phone">Phone Number</label>
              <input id="phone" type="text" class="zh-input" formControlName="phone" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="form-group">
              <label class="zh-label" for="city">City / Region</label>
              <input id="city" type="text" class="zh-input" formControlName="city" />
            </div>

            <div class="form-group">
              <label class="zh-label" for="org">Organization Name</label>
              <input id="org" type="text" class="zh-input" formControlName="organizationName" />
            </div>
          </div>

          <div class="form-group">
            <label class="zh-label" for="address">Pickup Address / Street</label>
            <input id="address" type="text" class="zh-input" formControlName="address" />
          </div>

          <div class="form-group">
            <label class="zh-label" for="bio">Profile Description & Mission</label>
            <textarea id="bio" rows="3" class="zh-input resize-none" formControlName="bio"></textarea>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
            <span class="text-xs text-[var(--text-muted)]">Account Status: <strong class="text-emerald-600">Active & Verified</strong></span>
            <button type="submit" [disabled]="isLoading()" class="btn-primary py-3 px-8 text-xs font-bold rounded-2xl shadow-lg shadow-[var(--primary)]/30">
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
