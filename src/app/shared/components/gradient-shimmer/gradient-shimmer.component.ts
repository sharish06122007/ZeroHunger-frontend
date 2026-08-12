import { Component, ElementRef, Input, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
export interface GradientStop {
  position: number;
  color: string;
}

export type GradientPresetName = "sunrise" | "bubble" | "peach" | "tonic" | "mint" | "spring" | "twilight" | "bay";
export type GradientInput = GradientStop[] | GradientPresetName;
export type EasingPreset = "smooth" | "gentle" | "snappy";

/* -------------------------------------------------------------------------- */
/*  Built-in presets                                                          */
/* -------------------------------------------------------------------------- */
export const gradientPresets: Record<GradientPresetName, GradientStop[]> = {
  sunrise: [
    { color: "#B6D3EF", position: 0 },
    { color: "#CAD1D7", position: 0.153 },
    { color: "#D7CFC8", position: 0.252 },
    { color: "#E1CDB9", position: 0.341 },
    { color: "#EAC6A5", position: 0.424 },
    { color: "#EDB185", position: 0.505 },
    { color: "#EF9B62", position: 0.586 },
    { color: "#F18F60", position: 0.669 },
    { color: "#F48D7A", position: 0.758 },
    { color: "#F78A94", position: 0.857 },
    { color: "#F888A0", position: 1 },
  ],
  bubble: [
    { color: "#F5EBD9", position: 0 },
    { color: "#F2D4DB", position: 0.31 },
    { color: "#EBBDDE", position: 0.5 },
    { color: "#CCBAE3", position: 0.65 },
    { color: "#8CBFF0", position: 0.82 },
    { color: "#78B0FF", position: 1 },
  ],
  peach: [
    { color: "#D9F5FA", position: 0 },
    { color: "#FCD9D6", position: 0.31 },
    { color: "#FCBAC9", position: 0.61 },
    { color: "#F0B3F5", position: 1 },
  ],
  tonic: [
    { color: "#E3EDF0", position: 0 },
    { color: "#E8EBB8", position: 0.27 },
    { color: "#F0DEA3", position: 0.43 },
    { color: "#E8B078", position: 0.75 },
    { color: "#F29682", position: 1 },
  ],
  mint: [
    { color: "#DECEE8", position: 0 },
    { color: "#CBBAEE", position: 0.21 },
    { color: "#7DC0FB", position: 0.46 },
    { color: "#00C7A6", position: 1 },
  ],
  spring: [
    { color: "#F7D5C5", position: 0.07 },
    { color: "#46A8C0", position: 0.58 },
    { color: "#43AE7D", position: 1 },
  ],
  twilight: [
    { color: "#E3CCE6", position: 0 },
    { color: "#4E8CD5", position: 0.35 },
    { color: "#6068C2", position: 0.64 },
    { color: "#38364E", position: 1 },
  ],
  bay: [
    { color: "#DBE3D0", position: 0 },
    { color: "#8DB8A7", position: 0.23 },
    { color: "#2D8E9A", position: 0.42 },
    { color: "#076492", position: 0.59 },
    { color: "#154288", position: 0.79 },
    { color: "#262C81", position: 1 },
  ],
};

export const easingPresets: Record<EasingPreset, string> = {
  smooth: "cubic-bezier(0.45, 0, 0.55, 1)",
  gentle: "cubic-bezier(0.76, 0, 0.24, 1)",
  snappy: "cubic-bezier(0.3, 0, 0.2, 1)",
};

const BAND_CORE_RATIO = 0.44;

export function buildBandGradient(stops: GradientStop[], angle: number): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const first = sorted[0]?.color ?? "white";
  const last = sorted[sorted.length - 1]?.color ?? "white";

  const core = sorted
    .map((stop) => {
      const factor = (stop.position - 0.5) * 2 * BAND_CORE_RATIO;
      return `${stop.color} calc(50% + var(--gs-spread-mid) * ${factor.toFixed(4)})`;
    })
    .join(", ");

  return [
    `linear-gradient(${angle}deg`,
    `var(--gs-base) calc(50% - var(--gs-spread))`,
    `color-mix(in oklab, var(--gs-base) 42%, ${first}) calc(50% - var(--gs-spread-mid))`,
    core,
    `color-mix(in oklab, var(--gs-base) 42%, ${last}) calc(50% + var(--gs-spread-mid))`,
    `var(--gs-base) calc(50% + var(--gs-spread)))`,
  ].join(", ");
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
const FALLBACK_TEXT_WIDTH_PX = 96;
const MAX_SPREAD_PX = 48;
const SPREAD_MID_RATIO = 0.72;
const BASE_FONT_PX = 14;
const DEFAULT_DURATION_SECONDS = 1.45;
const DEFAULT_SPREAD = 3;
const DEFAULT_ANGLE = 105;

@Component({
  selector: 'app-gradient-shimmer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngStyle]="mergedStyle" [class]="customClass">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host { display: inline; }
  `]
})
export class GradientShimmerComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() gradient: GradientInput = "sunrise";
  @Input() easing: EasingPreset = "smooth";
  @Input() duration: number = DEFAULT_DURATION_SECONDS;
  @Input() spread: number = DEFAULT_SPREAD;
  @Input() angle: number = DEFAULT_ANGLE;
  @Input() pauseBetween: number = 1000;
  @Input() baseColor: string = "currentColor";
  @Input() pauseOnScroll: boolean = true;
  @Input() pauseWhenOffscreen: boolean = true;
  @Input() respectReducedMotion: boolean = true;
  @Input() customClass: string = "";
  
  mergedStyle: any = {};
  
  private anim: Animation | null = null;
  private pauseTimer: any;
  private active = true;
  private cancelled = false;
  private stopVisibilityFn?: () => void;
  private isBrowser: boolean;

  constructor(
    private elRef: ElementRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      this.updateStyles();
      if (!changes['firstChange']) {
        this.restartSweep();
      }
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    
    this.updateStyles();
    
    if (!this.supportsBackgroundClipText()) {
      this.revealNormalText();
      return;
    }

    if (this.respectReducedMotion && this.prefersReducedMotion()) return;
    const innerSpan = this.elRef.nativeElement.querySelector('span');
    if (!innerSpan || typeof innerSpan.animate !== "function") return;

    this.ngZone.runOutsideAngular(() => {
      this.stopVisibilityFn = this.observeShimmerActive({
        pauseOnScroll: this.pauseOnScroll,
        pauseWhenOffscreen: this.pauseWhenOffscreen
      }, (next: boolean) => {
        this.active = next;
        if (this.anim) {
          if (this.active) this.anim.play();
          else this.anim.pause();
        }
      });

      this.runSweep();
    });
  }

  ngOnDestroy(): void {
    this.cancelled = true;
    if (this.anim) this.anim.cancel();
    clearTimeout(this.pauseTimer);
    if (this.stopVisibilityFn) this.stopVisibilityFn();
  }

  private resolveStops(): GradientStop[] {
    if (!this.gradient) return gradientPresets.sunrise;
    if (typeof this.gradient === "string") return gradientPresets[this.gradient as GradientPresetName] ?? gradientPresets.sunrise;
    return this.gradient as GradientStop[];
  }

  private updateStyles(): void {
    const stops = this.resolveStops();
    const safeAngle = Number.isFinite(this.angle) ? this.angle : DEFAULT_ANGLE;
    const backgroundImage = buildBandGradient(stops, safeAngle);
    
    const innerSpan = this.elRef.nativeElement.querySelector('span');
    const textContent = innerSpan ? innerSpan.textContent || "" : "";
    const safeSpread = Math.max(0, Number.isFinite(this.spread) ? this.spread : DEFAULT_SPREAD);
    const initialSpread = Math.min(textContent.length * safeSpread, MAX_SPREAD_PX);

    this.mergedStyle = {
      position: "relative",
      display: "inline-block",
      backgroundImage,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
      backgroundColor: `var(--gs-base)`,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      "--gs-base": this.baseColor,
      "--gs-spread": `${initialSpread}px`,
      "--gs-spread-mid": `${initialSpread * SPREAD_MID_RATIO}px`,
    };
  }

  private measure(): { start: number, end: number, durationMs: number } {
    const innerSpan = this.elRef.nativeElement.querySelector('span');
    if (!innerSpan) return { start: 0, end: 0, durationMs: 0 };
    
    const textContent = innerSpan.textContent || "";
    const textWidth = innerSpan.getBoundingClientRect().width || FALLBACK_TEXT_WIDTH_PX;
    const fontSize = Number.parseFloat(getComputedStyle(innerSpan).fontSize) || BASE_FONT_PX;
    const fontScale = fontSize / BASE_FONT_PX;
    
    const safeSpread = Math.max(0, Number.isFinite(this.spread) ? this.spread : DEFAULT_SPREAD);
    const spreadPx = Math.min(textContent.length * safeSpread * fontScale, MAX_SPREAD_PX * fontScale);
    const layerWidth = Math.max(1, textWidth + spreadPx * 2);
    
    const start = -spreadPx - layerWidth / 2;
    const end = textWidth + spreadPx - layerWidth / 2;
    
    const safeDuration = Math.max(0.001, Number.isFinite(this.duration) ? this.duration : DEFAULT_DURATION_SECONDS);
    const durationMs = safeDuration * 1000;
    
    innerSpan.style.setProperty("--gs-spread", `${spreadPx}px`);
    innerSpan.style.setProperty("--gs-spread-mid", `${spreadPx * SPREAD_MID_RATIO}px`);
    innerSpan.style.backgroundSize = `${layerWidth}px 100%`;
    
    return { start, end, durationMs };
  }

  private runSweep = (): void => {
    if (this.cancelled) return;
    const innerSpan = this.elRef.nativeElement.querySelector('span');
    if (!innerSpan) return;

    const { start, end, durationMs } = this.measure();
    const easingValue = easingPresets[this.easing] ?? easingPresets.smooth;

    const next = innerSpan.animate(
      [
        { backgroundPosition: `${start}px center` },
        { backgroundPosition: `${end}px center` },
      ],
      { duration: durationMs, easing: easingValue, fill: "forwards" }
    );
    
    if (!this.active) next.pause();
    
    if (this.anim) this.anim.cancel();
    this.anim = next;
    
    next.onfinish = () => {
      this.pauseTimer = setTimeout(this.runSweep, Math.max(0, this.pauseBetween));
    };
  }

  private restartSweep(): void {
    if (!this.isBrowser) return;
    this.cancelled = true;
    if (this.anim) this.anim.cancel();
    clearTimeout(this.pauseTimer);
    
    setTimeout(() => {
      this.cancelled = false;
      this.runSweep();
    }, 50);
  }

  private supportsBackgroundClipText(): boolean {
    if (typeof window === "undefined") return true;
    if (typeof (window as any).CSS?.supports !== "function") return false;
    return (
      (window as any).CSS.supports("background-clip", "text") ||
      (window as any).CSS.supports("-webkit-background-clip", "text")
    );
  }

  private prefersReducedMotion(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  private revealNormalText(): void {
    const innerSpan = this.elRef.nativeElement.querySelector('span');
    if (innerSpan) {
      innerSpan.style.removeProperty("background-image");
      innerSpan.style.removeProperty("-webkit-text-fill-color");
    }
  }

  private observeShimmerActive(opts: any, onChange: (active: boolean) => void): () => void {
    let inViewport = !opts.pauseWhenOffscreen || typeof IntersectionObserver === "undefined";
    let pageVisible = typeof document === "undefined" ? true : !document.hidden;
    let notScrolling = true;
    
    const compute = () => onChange(inViewport && pageVisible && notScrolling);

    let io: IntersectionObserver | undefined;
    if (opts.pauseWhenOffscreen && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1];
          if (!entry) return;
          inViewport = entry.isIntersecting;
          compute();
        },
        { rootMargin: "160px" }
      );
      io.observe(this.elRef.nativeElement);
    }

    const onVisibility = () => {
      pageVisible = !document.hidden;
      compute();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let scrollTimer: any;
    const onScroll = () => {
      notScrolling = false;
      compute();
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        notScrolling = true;
        compute();
      }, 120);
    };
    
    if (opts.pauseOnScroll) window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    compute();

    return () => {
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (opts.pauseOnScroll) window.removeEventListener("scroll", onScroll, { capture: true });
      clearTimeout(scrollTimer);
    };
  }
}
