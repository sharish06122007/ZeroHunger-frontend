// app.component.ts
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastService } from './core/services/toast.service';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            opacity: 0,
          }),
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(16px) scale(0.98)', filter: 'blur(4px)' }),
          animate('380ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' })),
        ], { optional: true }),
      ]),
    ]),
  ],
  template: `
    <div [@routeAnimations]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet" />
    </div>
    <app-toast-container />
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
  `],
})
export class AppComponent {
  readonly toastService = inject(ToastService);

  prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
