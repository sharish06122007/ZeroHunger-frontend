import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// @ts-ignore
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-parallax-scrolling',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parallax-scrolling.component.html',
  styleUrls: ['./parallax-scrolling.component.scss']
})
export class ParallaxScrollingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('parallaxRef') parallaxRef!: ElementRef<HTMLDivElement>;
  private lenis: any;
  
  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      gsap.registerPlugin(ScrollTrigger);

      const triggerElement = this.parallaxRef.nativeElement.querySelector('[data-parallax-layers]');

      if (triggerElement) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerElement,
            start: "0% 0%",
            end: "100% 0%",
            scrub: 0
          }
        });

        const layers = [
          { layer: "1", yPercent: 70 },
          { layer: "2", yPercent: 55 },
          { layer: "3", yPercent: 40 },
          { layer: "4", yPercent: 10 }
        ];

        layers.forEach((layerObj, idx) => {
          const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
          if (targets.length > 0) {
            tl.to(
              targets,
              {
                yPercent: layerObj.yPercent,
                ease: "none"
              },
              idx === 0 ? undefined : "<"
            );
          }
        });
      }

      this.lenis = new Lenis();
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time: number) => { this.lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (this.parallaxRef?.nativeElement) {
        const trigger = this.parallaxRef.nativeElement.querySelector('[data-parallax-layers]');
        if (trigger) {
          gsap.killTweensOf(trigger);
        }
      }
      if (this.lenis) {
        this.lenis.destroy();
      }
    });
  }
}
