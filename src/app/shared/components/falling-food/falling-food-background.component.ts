import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  layer: number; // 0: background (small/blurred), 1: mid, 2: foreground
}

@Component({
  selector: 'app-falling-food-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="absolute inset-0 w-full h-full pointer-events-none z-0"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }
  `],
})
export class FallingFoodBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private items: FallingItem[] = [];

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
    // Calculate density: lightweight count based on screen area
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 38000), 30);
    this.items = [];

    for (let i = 0; i < count; i++) {
      const emoji = this.fallingFoodEmojis[i % this.fallingFoodEmojis.length];
      const layer = Math.floor(Math.random() * 3); // 0, 1, 2
      const size = layer === 0 ? 22 : layer === 1 ? 36 : 48;

      this.items.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height, // Spread across top and offscreen
        size,
        emoji,
        speedY: 0.8 + layer * 0.5 + Math.random() * 0.4,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleAngle: Math.random() * Math.PI * 2,
        wobbleDistance: 0.6 + Math.random() * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        opacity: layer === 0 ? 0.35 : layer === 1 ? 0.65 : 0.85,
        layer,
      });
    }
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sort items by layer depth
    const sorted = [...this.items].sort((a, b) => a.layer - b.layer);
    sorted.forEach((item) => this.drawFallingItem(item));

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawFallingItem(item: FallingItem): void {
    const canvas = this.canvasRef.nativeElement;

    // Falling movement
    item.y += item.speedY;
    item.wobbleAngle += item.wobbleSpeed;
    item.x += Math.sin(item.wobbleAngle) * item.wobbleDistance;
    item.rotation += item.rotationSpeed;

    // Reset when item falls beyond bottom edge cleanly
    if (item.y > canvas.height + item.size) {
      item.y = -item.size - Math.random() * 80;
      item.x = Math.random() * canvas.width;
    }

    this.ctx.save();
    this.ctx.translate(item.x, item.y);
    this.ctx.rotate(item.rotation);

    // Soft subtle shadow for depth
    this.ctx.shadowBlur = 8 + item.layer * 4;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
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
