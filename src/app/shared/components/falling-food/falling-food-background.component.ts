import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EcosystemFoodItem {
  emoji: string;
  leftPercent: number;
  topPercent: number;
  sizePx: number;
  delayMs: number;
  floatDurationSec: number;
  opacity: number;
  rotationDeg: number;
}

@Component({
  selector: 'app-falling-food-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="food-decoration-layer">
      <!-- Stage 2: Soft Light Environmental Background Glow -->
      <div class="ambient-glow glow-top"></div>
      <div class="ambient-glow glow-bottom"></div>

      <!-- Stage 1: Base Food Foundation (Bottom Ecosystem Items) -->
      <div class="bottom-foundation-layer">
        @for (item of bottomFoodItems(); track $index) {
          <div
            class="food-item-node bottom-item"
            [style.left.%]="item.leftPercent"
            [style.top.%]="item.topPercent"
            [style.fontSize.px]="item.sizePx"
            [style.opacity]="item.opacity"
            [style.animationDelay.ms]="item.delayMs"
            [style.animationDuration.s]="item.floatDurationSec"
            [style.transform]="'rotate(' + item.rotationDeg + 'deg)'"
          >
            {{ item.emoji }}
          </div>
        }
      </div>

      <!-- Stage 3: Top Corner Food Elements -->
      <div class="top-corners-layer">
        @for (item of topFoodItems(); track $index) {
          <div
            class="food-item-node top-item"
            [style.left.%]="item.leftPercent"
            [style.top.%]="item.topPercent"
            [style.fontSize.px]="item.sizePx"
            [style.opacity]="item.opacity"
            [style.animationDelay.ms]="item.delayMs"
            [style.animationDuration.s]="item.floatDurationSec"
            [style.transform]="'rotate(' + item.rotationDeg + 'deg)'"
          >
            {{ item.emoji }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .food-decoration-layer {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    // Ambient Environmental Soft Glows
    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(140px);
      opacity: 0;
      animation: glowFadeIn 2s 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

      &.glow-top {
        top: -12rem;
        right: -10rem;
        width: 45rem;
        height: 45rem;
        background: rgba(34, 197, 94, 0.05);
      }

      &.glow-bottom {
        bottom: -12rem;
        left: -10rem;
        width: 45rem;
        height: 45rem;
        background: rgba(247, 239, 229, 0.5);
      }
    }

    @keyframes glowFadeIn {
      0% { opacity: 0; transform: scale(0.9); }
      100% { opacity: 1; transform: scale(1); }
    }

    // Common Food Item Styles
    .food-item-node {
      position: absolute;
      user-select: none;
      pointer-events: none;
      filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.04));
      will-change: transform, opacity;
    }

    // Stage 1: Bottom Foundation Items Animation (Staggered 1s-2s fade-in & slow float)
    .bottom-item {
      opacity: 0;
      animation: bottomFoundationReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                 gentleBreathe 7s ease-in-out infinite continuous;
      animation-delay: var(--delay, 1000ms), 2800ms;
    }

    @keyframes bottomFoundationReveal {
      0% {
        opacity: 0;
        transform: translateY(28px) scale(0.9);
      }
      100% {
        opacity: var(--target-opacity, 0.32);
        transform: translateY(0) scale(1);
      }
    }

    // Stage 3: Top Corner Items Animation (Staggered 3s-4s reveal)
    .top-item {
      opacity: 0;
      animation: topCornerReveal 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards,
                 gentleBreathe 8s ease-in-out infinite continuous;
      animation-delay: var(--delay, 3000ms), 4800ms;
    }

    @keyframes topCornerReveal {
      0% {
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
      }
      100% {
        opacity: var(--target-opacity, 0.28);
        transform: translateY(0) scale(1);
      }
    }

    // Stage 4: Gentle Sustained Breathing Motion
    @keyframes gentleBreathe {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-8px) rotate(4deg);
      }
    }
  `],
})
export class FallingFoodBackgroundComponent implements OnInit {
  readonly bottomFoodItems = signal<EcosystemFoodItem[]>([]);
  readonly topFoodItems = signal<EcosystemFoodItem[]>([]);

  ngOnInit(): void {
    this.initBottomFoundation();
    this.initTopCornerElements();
  }

  private initBottomFoundation(): void {
    // Stage 1: Base food foundation sitting quietly along the bottom edge
    const items: EcosystemFoodItem[] = [
      { emoji: '🍎', leftPercent: 5, topPercent: 86, sizePx: 38, delayMs: 1000, floatDurationSec: 7, opacity: 0.32, rotationDeg: -8 },
      { emoji: '🥕', leftPercent: 14, topPercent: 88, sizePx: 34, delayMs: 1200, floatDurationSec: 8, opacity: 0.28, rotationDeg: 12 },
      { emoji: '🥖', leftPercent: 22, topPercent: 85, sizePx: 40, delayMs: 1100, floatDurationSec: 7.5, opacity: 0.3, rotationDeg: -5 },
      { emoji: '🥦', leftPercent: 32, topPercent: 89, sizePx: 36, delayMs: 1400, floatDurationSec: 8.5, opacity: 0.26, rotationDeg: 10 },
      { emoji: '🍱', leftPercent: 42, topPercent: 87, sizePx: 42, delayMs: 1300, floatDurationSec: 7.2, opacity: 0.34, rotationDeg: -3 },
      { emoji: '🍊', leftPercent: 58, topPercent: 88, sizePx: 36, delayMs: 1500, floatDurationSec: 8, opacity: 0.3, rotationDeg: 6 },
      { emoji: '🥐', leftPercent: 68, topPercent: 85, sizePx: 38, delayMs: 1250, floatDurationSec: 7.8, opacity: 0.28, rotationDeg: -10 },
      { emoji: '🍅', leftPercent: 78, topPercent: 89, sizePx: 34, delayMs: 1450, floatDurationSec: 8.2, opacity: 0.32, rotationDeg: 8 },
      { emoji: '🥗', leftPercent: 88, topPercent: 86, sizePx: 40, delayMs: 1350, floatDurationSec: 7.4, opacity: 0.3, rotationDeg: -6 },
      { emoji: '🍇', leftPercent: 94, topPercent: 88, sizePx: 36, delayMs: 1600, floatDurationSec: 8.4, opacity: 0.28, rotationDeg: 14 },
    ];
    this.bottomFoodItems.set(items);
  }

  private initTopCornerElements(): void {
    // Stage 3: Extremely subtle framing elements in top corners ONLY
    const items: EcosystemFoodItem[] = [
      // Top Left Corner
      { emoji: '🍓', leftPercent: 4, topPercent: 5, sizePx: 30, delayMs: 3000, floatDurationSec: 8.5, opacity: 0.26, rotationDeg: -12 },
      { emoji: '🥬', leftPercent: 11, topPercent: 7, sizePx: 32, delayMs: 3200, floatDurationSec: 9, opacity: 0.24, rotationDeg: 15 },
      { emoji: '🍞', leftPercent: 6, topPercent: 14, sizePx: 28, delayMs: 3400, floatDurationSec: 8, opacity: 0.22, rotationDeg: -8 },

      // Top Right Corner
      { emoji: '🧁', leftPercent: 88, topPercent: 5, sizePx: 30, delayMs: 3100, floatDurationSec: 8.8, opacity: 0.26, rotationDeg: 10 },
      { emoji: '🌽', leftPercent: 94, topPercent: 7, sizePx: 32, delayMs: 3300, floatDurationSec: 9.2, opacity: 0.24, rotationDeg: -14 },
      { emoji: '🍚', leftPercent: 91, topPercent: 14, sizePx: 28, delayMs: 3500, floatDurationSec: 8.2, opacity: 0.22, rotationDeg: 6 },
    ];
    this.topFoodItems.set(items);
  }
}
