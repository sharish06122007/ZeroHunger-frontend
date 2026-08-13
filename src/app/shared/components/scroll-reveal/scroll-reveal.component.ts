import { Component, Input, ElementRef, AfterViewInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-scroll-reveal',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div #container class="scroll-reveal inline-block {{ containerClassName }}">
      <div class="scroll-reveal-text {{ textClassName }}">
        @for (word of splitText; track $index) {
          <span class="word inline-block relative whitespace-pre">{{ word }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .scroll-reveal {
      display: inline-block;
    }
    .word {
      display: inline-block;
      will-change: opacity, filter;
    }
  `]
})
export class ScrollRevealComponent implements AfterViewInit, OnDestroy {
  @Input() text: string = '';
  @Input() enableBlur: boolean = true;
  @Input() baseOpacity: number = 0.1;
  @Input() baseRotation: number = 3;
  @Input() blurStrength: number = 4;
  @Input() containerClassName: string = '';
  @Input() textClassName: string = '';
  @Input() rotationEnd: string = 'bottom center';
  @Input() wordAnimationEnd: string = 'bottom center';
  @Input() scrub: number | boolean = 1.5;

  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;

  get splitText(): string[] {
    if (!this.text) return [];
    // Split by spaces but keep the spaces so they render correctly
    return this.text.match(/(\S+|\s+)/g) || [];
  }

  ngAfterViewInit() {
    const el = this.containerRef.nativeElement;
    if (!el) return;
    
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: this.baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: this.rotationEnd,
          scrub: this.scrub
        }
      }
    );

    const wordElements = el.querySelectorAll('.word');

    gsap.fromTo(
      wordElements,
      { opacity: this.baseOpacity },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: this.wordAnimationEnd,
          scrub: this.scrub
        }
      }
    );

    if (this.enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${this.blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: this.wordAnimationEnd,
            scrub: this.scrub
          }
        }
      );
    }
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(t => {
       if (t.trigger === this.containerRef?.nativeElement) {
         t.kill();
       }
    });
  }
}
