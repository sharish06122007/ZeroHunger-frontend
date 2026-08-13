import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GradientShimmerComponent } from '../../shared/components/gradient-shimmer/gradient-shimmer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GradientShimmerComponent],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  form: FormGroup;
  submitted = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      organisation: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.submitted = true;
      // Normally, an API call would happen here.
      setTimeout(() => {
        this.submitted = false;
        this.form.reset();
        alert('Thank you for partnering with ZeroHunger. We will be in touch soon!');
      }, 1000);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
