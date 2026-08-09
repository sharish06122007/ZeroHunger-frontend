import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

function passwordMatchValidator(ctrl: AbstractControl): ValidationErrors | null {
  const pw = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

function strongPasswordValidator(ctrl: AbstractControl): ValidationErrors | null {
  const val = ctrl.value || '';
  if (val.length < 8) {
    return { minLength: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('step', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-[var(--bg-main)]">
      <!-- Left Premium Hero Panel -->
      <div class="relative hidden lg:flex flex-col justify-between p-12 bg-[var(--sidebar)] text-white overflow-hidden">
        <!-- Background Image overlaying dark -->
        <div class="absolute inset-0 z-0 opacity-40">
           <img src="assets/images/community-food.jpg" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1593113565694-c676714f17ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" alt="Community" />
        </div>
        <div class="absolute inset-0 z-0 bg-gradient-to-t from-[var(--sidebar)] via-[var(--sidebar)]/80 to-transparent"></div>
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--primary)]/50 blur-3xl pointer-events-none z-0"></div>

        <!-- Brand Top Bar -->
        <a routerLink="/" class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--primary)] via-[var(--primary-indigo)] to-[var(--accent)] p-0.5 shadow-lg">
            <div class="w-full h-full bg-[var(--sidebar)] rounded-[14px] flex items-center justify-center font-black text-white">
              ZH
            </div>
          </div>
          <span class="font-extrabold text-xl tracking-tight text-white">Zero<span class="text-[var(--accent)]">Hunger</span></span>
        </a>

        <div class="space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white border border-white/20">
              <span class="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></span>
              Join the Movement
            </span>
            <h1 class="text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-md">
              Start Your Food Rescue Journey Today
            </h1>
            <p class="text-sm text-slate-200 leading-relaxed drop-shadow-md">
              Create an enterprise account to list surplus food, manage logistics, and track your environmental impact in real-time.
            </p>
          </div>

        <div class="relative z-10 text-xs text-slate-400">
          Already registered? <a routerLink="/auth/login" class="text-[var(--secondary)] font-bold hover:underline">Sign In</a>
        </div>
      </div>

      <!-- Right Multi-Step Wizard Panel -->
      <div class="lg:col-span-2 flex items-center justify-center p-6 sm:p-12">
        <div class="w-full max-w-xl space-y-8">
          <!-- Horizontal Progress Track for Mobile & Tablet -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
              <span>Step {{ currentStep() }} of {{ stepLabels.length }}: {{ stepLabels[currentStep() - 1].label }}</span>
              <span>{{ (currentStep() / stepLabels.length) * 100 }}% Complete</span>
            </div>
            <div class="h-2 bg-[var(--bg-surface)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div class="h-full bg-gradient-to-r from-[var(--primary)] via-[var(--primary-indigo)] to-[var(--accent)] transition-all duration-300 ease-out" [style.width.%]="(currentStep() / stepLabels.length) * 100"></div>
            </div>
          </div>

          <!-- Wizard Card Container -->
          <div class="zh-card space-y-6">
            <!-- Step 1: Basic Info -->
            @if (currentStep() === 1) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-2xl font-extrabold text-[var(--text-main)]">Basic Details</h2>
                  <p class="text-xs text-[var(--text-muted)]">Enter your full name and phone number for contact verification</p>
                </div>
                <form [formGroup]="step1Form" class="space-y-4">
                  <div class="form-group">
                    <label class="zh-label" for="fullName">Full Name <span class="text-[var(--danger)]">*</span></label>
                    <input id="fullName" type="text" class="zh-input" [class.border-red-400]="isInvalid(step1Form, 'fullName')" formControlName="fullName" placeholder="Jane Doe" />
                    @if (isInvalid(step1Form, 'fullName')) {
                      <p class="text-xs text-[var(--danger)] mt-1">Full name is required (at least 2 characters)</p>
                    }
                  </div>
                  <div class="form-group">
                    <label class="zh-label" for="phone">Phone Number <span class="text-[var(--danger)]">*</span></label>
                    <input id="phone" type="tel" class="zh-input" [class.border-red-400]="isInvalid(step1Form, 'phone')" formControlName="phone" placeholder="+1 (555) 000-0000" />
                    @if (isInvalid(step1Form, 'phone')) {
                      <p class="text-xs text-[var(--danger)] mt-1">A valid phone number is required</p>
                    }
                  </div>
                </form>
              </div>
            }

            <!-- Step 2: Account Security -->
            @if (currentStep() === 2) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-2xl font-extrabold text-[var(--text-main)]">Account Security</h2>
                  <p class="text-xs text-[var(--text-muted)]">Set up your email and login credentials</p>
                </div>
                <form [formGroup]="step2Form" class="space-y-4">
                  <div class="form-group">
                    <label class="zh-label" for="email">Work Email <span class="text-[var(--danger)]">*</span></label>
                    <input id="email" type="email" class="zh-input" [class.border-red-400]="isInvalid(step2Form, 'email')" formControlName="email" placeholder="name@organization.com" />
                    @if (isInvalid(step2Form, 'email')) {
                      <p class="text-xs text-[var(--danger)] mt-1">Please enter a valid work email</p>
                    }
                  </div>
                  <div class="form-group">
                    <label class="zh-label" for="password">Password <span class="text-[var(--danger)]">*</span></label>
                    <input id="password" [type]="showPw() ? 'text' : 'password'" class="zh-input" formControlName="password" placeholder="At least 8 characters" />
                  </div>
                  <div class="form-group">
                    <label class="zh-label" for="confirmPassword">Confirm Password <span class="text-[var(--danger)]">*</span></label>
                    <input id="confirmPassword" [type]="showCpw() ? 'text' : 'password'" class="zh-input" formControlName="confirmPassword" placeholder="Re-enter password" />
                    @if (step2Form.hasError('passwordMismatch') && step2Form.get('confirmPassword')?.touched) {
                      <p class="text-xs text-[var(--danger)] mt-1">Passwords do not match</p>
                    }
                  </div>
                </form>
              </div>
            }

            <!-- Step 3: Role Selection -->
            @if (currentStep() === 3) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-2xl font-extrabold text-[var(--text-main)]">Select Your Role</h2>
                  <p class="text-xs text-[var(--text-muted)]">Choose how your account interacts with the network</p>
                </div>
                <form [formGroup]="step3Form" class="space-y-4">
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    @for (role of roles; track role.value) {
                      <div
                        (click)="step3Form.patchValue({ role: role.value })"
                        class="p-4 rounded-2xl border text-center cursor-pointer transition-all"
                        [ngClass]="step3Form.get('role')?.value === role.value ? 'bg-[var(--primary)]/10 border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md' : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[var(--primary)]/30'"
                      >
                        <span class="text-3xl block mb-2">{{ role.icon }}</span>
                        <h4 class="font-bold text-xs text-[var(--text-main)]">{{ role.label }}</h4>
                        <p class="text-[10px] text-[var(--text-muted)] mt-1 leading-tight">{{ role.desc }}</p>
                      </div>
                    }
                  </div>

                  @if (step3Form.get('role')?.value === 'restaurant' || step3Form.get('role')?.value === 'ngo') {
                    <div class="form-group pt-2">
                      <label class="zh-label" for="org">Organization / Venue Name</label>
                      <input id="org" type="text" class="zh-input" formControlName="organizationName" placeholder="Green Harvest Kitchens" />
                    </div>
                  }
                </form>
              </div>
            }

            <!-- Step 4: Summary & Confirm -->
            @if (currentStep() === 4) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-2xl font-extrabold text-[var(--text-main)]">Review & Create</h2>
                  <p class="text-xs text-[var(--text-muted)]">Confirm your account information</p>
                </div>

                <div class="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-3 text-xs">
                  <div class="flex justify-between py-1 border-b border-[var(--border-color)]">
                    <span class="text-[var(--text-muted)]">Full Name:</span>
                    <span class="font-bold text-[var(--text-main)]">{{ step1Form.value.fullName }}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-[var(--border-color)]">
                    <span class="text-[var(--text-muted)]">Phone:</span>
                    <span class="font-bold text-[var(--text-main)]">{{ step1Form.value.phone }}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-[var(--border-color)]">
                    <span class="text-[var(--text-muted)]">Email:</span>
                    <span class="font-bold text-[var(--text-main)]">{{ step2Form.value.email }}</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="text-[var(--text-muted)]">Role:</span>
                    <span class="font-bold text-[var(--primary)] capitalize">{{ step3Form.value.role }}</span>
                  </div>
                </div>

                <p class="text-[11px] text-[var(--text-muted)]">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            }

            <!-- Wizard Navigation Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
              @if (currentStep() > 1) {
                <button type="button" (click)="prev()" class="btn-secondary">
                  ← Back
                </button>
              } @else {
                <a routerLink="/auth/login" class="text-xs font-bold text-[var(--primary)] hover:underline">
                  Already have an account?
                </a>
              }

              @if (currentStep() < stepLabels.length) {
                <button type="button" (click)="next()" class="btn-primary">
                  Continue →
                </button>
              } @else {
                <button type="button" (click)="submit()" [disabled]="isLoading()" class="btn-primary">
                  @if (isLoading()) {
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating...</span>
                  } @else {
                    <span>Create Account 🚀</span>
                  }
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly currentStep = signal(1);
  readonly isLoading = signal(false);
  readonly showPw = signal(false);
  readonly showCpw = signal(false);

  readonly stepLabels = [
    { step: 1, label: 'Basic Info' },
    { step: 2, label: 'Account Security' },
    { step: 3, label: 'Role Selection' },
    { step: 4, label: 'Review & Confirm' },
  ];

  readonly roles = [
    { value: 'restaurant', label: 'Commercial Donor', icon: '🏪', desc: 'Post surplus food' },
    { value: 'ngo', label: 'NGO / Shelter', icon: '🏢', desc: 'Request food' },
    { value: 'volunteer', label: 'Volunteer Courier', icon: '🚚', desc: 'Handle pickups' },
    { value: 'donor', label: 'Monetary Supporter', icon: '🎁', desc: 'Fund operations' },
    { value: 'receiver', label: 'Individual Recipient', icon: '🙏', desc: 'Find local meals' },
    { value: 'admin', label: 'Platform Admin', icon: '⚙️', desc: 'System management' },
  ];

  step1Form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
  });

  step2Form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, strongPasswordValidator]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  step3Form = this.fb.group({
    role: ['restaurant', Validators.required],
    organizationName: [''],
  });

  isInvalid(form: any, field: string): boolean {
    const ctrl = form.get(field);
    return !!(ctrl?.invalid && (ctrl.dirty || ctrl.touched));
  }

  next(): void {
    if (this.currentStep() === 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.invalid) return;
    }
    if (this.currentStep() === 2) {
      this.step2Form.markAllAsTouched();
      if (this.step2Form.invalid) return;
    }
    this.currentStep.update(s => s + 1);
  }

  prev(): void {
    this.currentStep.update(s => s - 1);
  }

  submit(): void {
    this.isLoading.set(true);

    const payload = {
      fullName: this.step1Form.value.fullName!,
      phone: this.step1Form.value.phone!,
      email: (this.step2Form.value.email ?? '').trim().toLowerCase(),
      password: this.step2Form.value.password!,
      confirmPassword: this.step2Form.value.confirmPassword!,
      role: this.step3Form.value.role as any,
      organizationName: this.step3Form.value.organizationName || undefined,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Registration successful!', 'Please verify your email code (Demo OTP: 123456)');
        this.router.navigate(['/auth/verify-email'], { queryParams: { email: payload.email } });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Registration failed', err.message);
      },
    });
  }
}
