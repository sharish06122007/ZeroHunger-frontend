import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FloatingItem {
  x: number;
  y: number;
  baseY: number;
  size: number;
  emoji: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  floatAngle: number;
  floatSpeed: number;
  opacity: number;
  glowColor: string;
  layer: number; // 0: back (small/blurred), 1: mid, 2: front (large)
}

interface GlowingParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  speedX: number;
  speedY: number;
}

@Component({
  selector: 'app-floating-food-canvas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="absolute inset-0 w-full h-full pointer-events-auto z-0"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
  `],
})
export class FloatingFoodCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private items: FloatingItem[] = [];
  private particles: GlowingParticle[] = [];

  private mouseX = 0;
  private mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  // Food Emojis grouped by categories
  readonly foodCategoryEmojis = [
    // Fruits
    '🍎', '🍊', '🍌', '🍓', '🍇',
    // Vegetables
    '🥕', '🥦', '🥬', '🌽', '🥒',
    // Bakery
    '🥖', '🥐', '🍞', '🧁',
    // Meals
    '🍱', '🍚', '🥗', '🍲',
  ];

  readonly glowColors = ['#22C55E', '#3B82F6', '#7743DB', '#A855F7', '#10B981'];

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initItems();
    this.initParticles();
    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initItems();
    this.initParticles();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.targetMouseX = event.clientX;
    this.targetMouseY = event.clientY;
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initItems(): void {
    const canvas = this.canvasRef.nativeElement;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 35000), 32);
    this.items = [];

    for (let i = 0; i < count; i++) {
      const emoji = this.foodCategoryEmojis[i % this.foodCategoryEmojis.length];
      const layer = Math.floor(Math.random() * 3); // 0, 1, 2
      const size = layer === 0 ? 24 : layer === 1 ? 40 : 58;

      const item: FloatingItem = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseY: Math.random() * canvas.height,
        size,
        emoji,
        speedX: (Math.random() - 0.5) * (0.3 + layer * 0.2),
        speedY: (Math.random() - 0.5) * (0.2 + layer * 0.15),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        floatAngle: Math.random() * Math.PI * 2,
        floatSpeed: 0.01 + Math.random() * 0.02,
        opacity: layer === 0 ? 0.45 : layer === 1 ? 0.75 : 0.95,
        glowColor: this.glowColors[Math.floor(Math.random() * this.glowColors.length)],
        layer,
      };
      this.items.push(item);
    }
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const particleCount = 45;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: this.glowColors[Math.floor(Math.random() * this.glowColors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Smooth mouse interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Draw background glowing particles
    this.drawParticles();

    // Draw food items sorted by layer for depth
    const sorted = [...this.items].sort((a, b) => a.layer - b.layer);
    sorted.forEach((item) => this.drawFoodItem(item));

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawParticles(): void {
    const canvas = this.canvasRef.nativeElement;

    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  private drawFoodItem(item: FloatingItem): void {
    const canvas = this.canvasRef.nativeElement;

    // Floating sine wave animation
    item.floatAngle += item.floatSpeed;
    item.rotation += item.rotationSpeed;

    item.x += item.speedX;
    item.y += item.speedY + Math.sin(item.floatAngle) * 0.4;

    // Wrap boundaries
    if (item.x < -60) item.x = canvas.width + 60;
    if (item.x > canvas.width + 60) item.x = -60;
    if (item.y < -60) item.y = canvas.height + 60;
    if (item.y > canvas.height + 60) item.y = -60;

    // Mouse parallax offset based on layer depth
    const parallaxFactor = (item.layer + 1) * 0.015;
    const offsetX = (this.mouseX - canvas.width / 2) * parallaxFactor;
    const offsetY = (this.mouseY - canvas.height / 2) * parallaxFactor;

    const drawX = item.x + offsetX;
    const drawY = item.y + offsetY;

    this.ctx.save();
    this.ctx.translate(drawX, drawY);
    this.ctx.rotate(item.rotation);

    // Glowing aura shadow
    this.ctx.shadowBlur = 20 + item.layer * 10;
    this.ctx.shadowColor = item.glowColor;
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
