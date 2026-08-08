import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/authentication/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { LucideAngularModule } from 'lucide-angular';
import { ZhInputComponent } from '../../../shared/components/ui/zh-input/zh-input.component';
import { ZhButtonComponent } from '../../../shared/components/ui/zh-button/zh-button.component';

function passwordMatchValidator(ctrl: AbstractControl): ValidationErrors | null {
  const pw = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule, ZhInputComponent, ZhButtonComponent],
  animations: [
    trigger('step', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  template: `
    <div class="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-brand-bg">
      <!-- Left Premium Hero Panel -->
      <div class="relative hidden lg:flex flex-col justify-between p-12 bg-brand-primary text-white overflow-hidden">
        <!-- Ambient Background -->
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-accent/20 blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200')] opacity-20 mix-blend-overlay object-cover"></div>

        <!-- Brand Top Bar -->
        <a routerLink="/" class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <lucide-icon name="home" class="w-6 h-6 text-brand-primary"></lucide-icon>
          </div>
          <span class="font-extrabold text-2xl tracking-tight text-white">Zero<span class="text-brand-primary-light">Hunger</span></span>
        </a>

        <!-- Hero Content -->
        <div class="relative z-10 space-y-8 max-w-lg mt-12">
          <div class="space-y-4">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-white border border-white/15 backdrop-blur-sm">
              Join the movement
            </span>
            <h1 class="text-4xl font-extrabold tracking-tight leading-tight">
              Build a stronger community today.
            </h1>
            <p class="text-sm text-brand-primary-very-light leading-relaxed">
              Create an account to request homemade food, become a verified food maker, or deliver meals. 
            </p>
          </div>
          
          <div class="space-y-5 mt-10">
            @for (s of stepLabels; track s.step; let i = $index) {
              <div class="flex items-center gap-4">
                <div
                  class="w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all"
                  [ngClass]="{
                    'bg-white text-brand-primary shadow-lg': currentStep() === i + 1,
                    'bg-brand-fresh text-white': currentStep() > i + 1,
                    'bg-white/20 text-white/50 border border-white/20': currentStep() < i + 1
                  }"
                >
                  @if (currentStep() > i + 1) { <lucide-icon name="check" class="w-4 h-4"></lucide-icon> } @else { {{ i + 1 }} }
                </div>
                <div>
                  <p class="text-sm font-bold" [ngClass]="currentStep() === i + 1 ? 'text-white' : 'text-white/70'">{{ s.label }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="relative z-10 text-xs text-white/50 mt-12">
          Already registered? <a routerLink="/auth/login" class="text-white font-bold hover:underline">Sign In</a>
        </div>
      </div>

      <!-- Right Form Panel -->
      <div class="lg:col-span-2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div class="w-full max-w-xl space-y-8">
          
          <!-- Mobile Brand (Visible only on small screens) -->
          <div class="lg:hidden text-center mb-8 flex flex-col items-center">
            <div class="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg mb-4">
              <lucide-icon name="home" class="w-6 h-6 text-white"></lucide-icon>
            </div>
            <h2 class="font-extrabold text-2xl tracking-tight text-brand-dark">Zero<span class="text-brand-primary">Hunger</span></h2>
          </div>

          <div class="space-y-2">
             <div class="flex justify-between items-center text-xs font-bold text-brand-muted mb-2">
               <span>Step {{ currentStep() }} of {{ stepLabels.length }}</span>
               <span class="text-brand-primary">{{ (currentStep() / stepLabels.length) * 100 }}%</span>
             </div>
             <div class="h-2 bg-brand-border rounded-full overflow-hidden">
               <div class="h-full bg-brand-primary transition-all duration-300 ease-out" [style.width.%]="(currentStep() / stepLabels.length) * 100"></div>
             </div>
          </div>

          <div class="p-8 rounded-3xl shadow-float bg-white border border-brand-border space-y-6">
            
            <!-- Step 1: Basic Info -->
            @if (currentStep() === 1) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-3xl font-extrabold text-brand-text">Create Account</h2>
                  <p class="text-sm text-brand-muted">Tell us a bit about yourself</p>
                </div>
                <form [formGroup]="step1Form" class="space-y-2">
                  <app-zh-input
                    formControlName="fullName"
                    label="Full Name"
                    placeholder="Jane Doe"
                    icon="user"
                    [error]="isInvalid(step1Form, 'fullName') ? 'Full name is required' : ''"
                  ></app-zh-input>
                  <app-zh-input
                    formControlName="phone"
                    label="Phone Number"
                    placeholder="+91 9876543210"
                    icon="phone"
                    [error]="isInvalid(step1Form, 'phone') ? 'Valid phone number is required' : ''"
                  ></app-zh-input>
                </form>
              </div>
            }

            <!-- Step 2: Account Security -->
            @if (currentStep() === 2) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-3xl font-extrabold text-brand-text">Secure Account</h2>
                  <p class="text-sm text-brand-muted">Set up your email and password</p>
                </div>
                <form [formGroup]="step2Form" class="space-y-2">
                  <app-zh-input
                    formControlName="email"
                    label="Email Address"
                    placeholder="name@example.com"
                    icon="mail"
                    [error]="isInvalid(step2Form, 'email') ? 'Valid email is required' : ''"
                  ></app-zh-input>
                  
                  <div class="relative">
                    <app-zh-input
                      formControlName="password"
                      [type]="showPw() ? 'text' : 'password'"
                      label="Password"
                      placeholder="Min 8 characters"
                      icon="lock"
                      [error]="isInvalid(step2Form, 'password') ? 'Password must be at least 8 characters' : ''"
                    ></app-zh-input>
                    <button type="button" (click)="showPw.set(!showPw())" class="absolute right-4 top-10 text-xs font-semibold text-brand-muted">
                      {{ showPw() ? 'Hide' : 'Show' }}
                    </button>
                  </div>

                  <div class="relative">
                    <app-zh-input
                      formControlName="confirmPassword"
                      [type]="showCpw() ? 'text' : 'password'"
                      label="Confirm Password"
                      placeholder="Re-enter password"
                      icon="lock-keyhole"
                      [error]="(step2Form.hasError('passwordMismatch') && step2Form.get('confirmPassword')?.touched) ? 'Passwords do not match' : ''"
                    ></app-zh-input>
                    <button type="button" (click)="showCpw.set(!showCpw())" class="absolute right-4 top-10 text-xs font-semibold text-brand-muted">
                      {{ showCpw() ? 'Hide' : 'Show' }}
                    </button>
                  </div>
                </form>
              </div>
            }

            <!-- Step 3: Role Selection -->
            @if (currentStep() === 3) {
              <div @step class="space-y-6">
                <div class="space-y-1">
                  <h2 class="text-3xl font-extrabold text-brand-text">Select Role</h2>
                  <p class="text-sm text-brand-muted">How would you like to use ZeroHunger?</p>
                </div>
                <form [formGroup]="step3Form" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    @for (role of roles; track role.value) {
                      <div
                        (click)="step3Form.patchValue({ role: role.value })"
                        class="p-5 rounded-2xl border-2 text-center cursor-pointer transition-all duration-200"
                        [ngClass]="step3Form.get('role')?.value === role.value ? 'bg-brand-primary-very-light border-brand-primary' : 'bg-white border-brand-border hover:border-brand-primary/40'"
                      >
                        <lucide-icon [name]="role.icon" class="w-8 h-8 mb-3 mx-auto" [ngClass]="step3Form.get('role')?.value === role.value ? 'text-brand-primary' : 'text-brand-muted'"></lucide-icon>
                        <h4 class="font-bold text-sm text-brand-text">{{ role.label }}</h4>
                        <p class="text-xs text-brand-muted mt-1 leading-tight">{{ role.desc }}</p>
                      </div>
                    }
                  </div>
                </form>
              </div>
            }

            <!-- Wizard Navigation Buttons -->
            <div class="flex items-center justify-between pt-6 mt-6 border-t border-brand-border">
              @if (currentStep() > 1) {
                <app-zh-button variant="ghost" (onClick)="prev()">Back</app-zh-button>
              } @else {
                <a routerLink="/auth/login" class="text-sm font-bold text-brand-primary hover:underline">
                  Sign In instead
                </a>
              }

              @if (currentStep() < stepLabels.length) {
                <app-zh-button variant="primary" (onClick)="next()">Continue</app-zh-button>
              } @else {
                <app-zh-button variant="primary" (onClick)="submit()" [loading]="isLoading()">Create Account</app-zh-button>
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
    { step: 2, label: 'Security' },
    { step: 3, label: 'Role' }
  ];

  readonly roles = [
    { value: 'customer', label: 'Food Requester', icon: 'utensils', desc: 'Request homemade food' },
    { value: 'home_food_maker', label: 'Food Maker', icon: 'chef-hat', desc: 'Cook & share food' },
    { value: 'delivery_partner', label: 'Delivery Partner', icon: 'truck', desc: 'Deliver meals' },
    { value: 'ngo', label: 'NGO / Community', icon: 'building-2', desc: 'Manage food rescue' }
  ];

  step1Form = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
  });

  step2Form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordMatchValidator });

  step3Form = this.fb.group({
    role: ['customer', Validators.required],
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
    if (this.step3Form.invalid) {
      this.step3Form.markAllAsTouched();
      return;
    }
    
    this.isLoading.set(true);

    const payload = {
      fullName: this.step1Form.value.fullName!,
      phone: this.step1Form.value.phone!,
      email: (this.step2Form.value.email ?? '').trim().toLowerCase(),
      password: this.step2Form.value.password!,
      confirmPassword: this.step2Form.value.confirmPassword!,
      role: this.step3Form.value.role as any,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Registration successful!', 'Please verify your email code.');
        this.router.navigate(['/auth/verify-email'], { queryParams: { email: payload.email } });
      },
      error: (err) => {
        this.isLoading.set(false);
        this.toast.error('Registration failed', err.message);
      },
    });
  }
}
