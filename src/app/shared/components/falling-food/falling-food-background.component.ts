import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FallingItem {
  x: number;
  y: number;
  size: number;
  emoji: string;
  speedY: number;
  wobbleSpeed: number;
  wobbleAngle: number;
  wobbleDistance: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  layer: number;
}

export interface DomFallingFood {
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

@Component({
  selector: 'app-falling-food-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>

    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      @for (item of domItems(); track $index) {
        <div
          class="falling-food-dom-node"
          [style.left.%]="item.left"
          [style.fontSize.px]="item.size"
          [style.animationDuration.s]="item.duration"
          [style.animationDelay.s]="item.delay"
          [style.--drift-x.px]="item.drift"
        >
          {{ item.emoji }}
        </div>
      }
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

    .falling-food-dom-node {
      position: absolute;
      top: -60px;
      user-select: none;
      pointer-events: none;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
      animation: fallGravity linear infinite;
      will-change: transform;
    }

    @keyframes fallGravity {
      0% {
        transform: translateY(0) translateX(0) rotate(0deg);
        opacity: 0;
      }
      8% {
        opacity: 0.9;
      }
      92% {
        opacity: 0.9;
      }
      100% {
        transform: translateY(115vh) translateX(var(--drift-x, 30px)) rotate(360deg);
        opacity: 0;
      }
    }
  `],
})
export class FallingFoodBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private items: FallingItem[] = [];
  readonly domItems = signal<DomFallingFood[]>([]);

  readonly fallingFoodEmojis = [
    // Fruits: Apple, Banana, Orange, Strawberry, Mango, Grapes
    '🍎', '🍌', '🍊', '🍓', '🥭', '🍇',
    // Vegetables: Carrot, Tomato, Broccoli, Lettuce, Corn, Potato
    '🥕', '🍅', '🥦', '🥬', '🌽', '🥔',
    // Bakery: Bread, Croissant, Cake, Donut, Muffin, Cookies
    '🥖', '🥐', '🍰', '🍩', '🧁', '🍪',
    // Meals: Rice bowl, Pizza, Burger, Sandwich, Healthy meal
    '🍚', '🍕', '🍔', '🥪', '🥗',
  ];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initItems();
    this.initDomItems();
    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initItems();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initItems(): void {
    const canvas = this.canvasRef.nativeElement;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 28000), 34);
    this.items = [];

    for (let i = 0; i < count; i++) {
      const emoji = this.fallingFoodEmojis[i % this.fallingFoodEmojis.length];
      const layer = Math.floor(Math.random() * 3);
      const size = layer === 0 ? 28 : layer === 1 ? 42 : 56;

      this.items.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 1.5 - canvas.height * 0.5,
        size,
        emoji,
        speedY: 0.9 + layer * 0.4 + Math.random() * 0.5,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleAngle: Math.random() * Math.PI * 2,
        wobbleDistance: 0.8 + Math.random() * 1.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        opacity: layer === 0 ? 0.55 : layer === 1 ? 0.8 : 0.95,
        layer,
      });
    }
  }

  private initDomItems(): void {
    const domList: DomFallingFood[] = [];
    const totalDom = 26;

    for (let i = 0; i < totalDom; i++) {
      const emoji = this.fallingFoodEmojis[i % this.fallingFoodEmojis.length];
      domList.push({
        emoji,
        left: Math.floor(Math.random() * 94) + 3,
        size: Math.floor(Math.random() * 24) + 28,
        duration: Math.round((Math.random() * 6 + 7) * 10) / 10,
        delay: Math.round(Math.random() * 6 * 10) / 10,
        drift: Math.floor(Math.random() * 80) - 40,
      });
    }

    this.domItems.set(domList);
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sorted = [...this.items].sort((a, b) => a.layer - b.layer);
    sorted.forEach((item) => this.drawFallingItem(item));

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawFallingItem(item: FallingItem): void {
    const canvas = this.canvasRef.nativeElement;

    item.y += item.speedY;
    item.wobbleAngle += item.wobbleSpeed;
    item.x += Math.sin(item.wobbleAngle) * item.wobbleDistance;
    item.rotation += item.rotationSpeed;

    if (item.y > canvas.height + item.size) {
      item.y = -item.size - Math.random() * 60;
      item.x = Math.random() * canvas.width;
    }

    this.ctx.save();
    this.ctx.translate(item.x, item.y);
    this.ctx.rotate(item.rotation);

    this.ctx.shadowBlur = 8 + item.layer * 4;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    this.ctx.globalAlpha = item.opacity;

    this.ctx.font = `${item.size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(item.emoji, 0, 0);

    this.ctx.restore();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
