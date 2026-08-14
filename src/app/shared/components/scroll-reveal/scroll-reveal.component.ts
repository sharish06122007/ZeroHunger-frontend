import { Component, ElementRef, Input, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-scroll-reveal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container class="scroll-reveal {{ containerClassName }}">
      <p class="scroll-reveal-text {{ textClassName }}">
        <ng-container *ngFor="let token of splitTokens">
          <span *ngIf="!isWhitespace(token)" class="word">{{ token }}</span>
          <ng-container *ngIf="isWhitespace(token)">{{ token }}</ng-container>
        </ng-container>
      </p>
    </div>
  `,
  styles: [`
    .scroll-reveal {
      display: block;
    }
    .scroll-reveal-text {
      margin: 0;
      padding: 0;
    }
    .word {
      display: inline-block;
      will-change: opacity, filter;
    }
  `]
})
export class ScrollRevealComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() text = '';
  @Input() enableBlur = true;
  @Input() baseOpacity = 0.1;
  @Input() baseRotation = 3;
  @Input() blurStrength = 4;
  @Input() containerClassName = '';
  @Input() textClassName = '';
  @Input() rotationEnd = 'bottom bottom';
  @Input() wordAnimationEnd = 'bottom bottom';

  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  splitTokens: string[] = [];
  private scrollTriggers: ScrollTrigger[] = [];

  ngOnInit() {
    // Split text into words and spaces, preserving spaces exactly like React version
    this.splitTokens = this.text.split(/(\s+)/).filter(w => w.length > 0);
  }

  isWhitespace(str: string): boolean {
    return /^\\s+$/.test(str);
  }

  ngAfterViewInit() {
    const el = this.containerRef.nativeElement;
    if (!el) return;

    // Use window as the scroller container since this is the main page
    const scroller = window;

    // 1. Rotation animation for the container
    const rotationTrigger = ScrollTrigger.create({
      trigger: el,
      scroller,
      start: 'top bottom',
      end: this.rotationEnd,
      scrub: true,
      animation: gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: this.baseRotation },
        { ease: 'none', rotate: 0 }
      )
    });
    this.scrollTriggers.push(rotationTrigger);

    const wordElements = el.querySelectorAll('.word');

    // 2. Opacity animation for individual words
    const opacityTrigger = ScrollTrigger.create({
      trigger: el,
      scroller,
      start: 'top bottom-=20%',
      end: this.wordAnimationEnd,
      scrub: true,
      animation: gsap.fromTo(
        wordElements,
        { opacity: this.baseOpacity },
        { ease: 'none', opacity: 1, stagger: 0.05 }
      )
    });
    this.scrollTriggers.push(opacityTrigger);

    // 3. Blur animation for individual words
    if (this.enableBlur) {
      const blurTrigger = ScrollTrigger.create({
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: this.wordAnimationEnd,
        scrub: true,
        animation: gsap.fromTo(
          wordElements,
          { filter: 'blur(' + this.blurStrength + 'px)' },
          { ease: 'none', filter: 'blur(0px)', stagger: 0.05 }
        )
      });
      this.scrollTriggers.push(blurTrigger);
    }
  }

  ngOnDestroy() {
    // Clean up all ScrollTriggers created by this component to prevent memory leaks
    this.scrollTriggers.forEach(trigger => trigger.kill());
  }
}
