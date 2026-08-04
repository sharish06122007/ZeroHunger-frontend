import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EcoFoodParticle {
  x: number;
  y: number;
  size: number;
  emoji: string;
  speedY: number;
  peakY: number;
  wobbleSpeed: number;
  wobbleAngle: number;
  wobbleDistance: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  layer: number;
  direction: 'rising' | 'falling';
}

@Component({
  selector: 'app-falling-food-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="fixed inset-0 w-full h-full pointer-events-none z-0"></canvas>
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
  `],
})
export class FallingFoodBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private particles: EcoFoodParticle[] = [];

  readonly foodEmojis = [
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
    this.initParticles();
    this.animate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initParticles();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 26000), 32);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(canvas, true));
    }
  }

  private createParticle(canvas: HTMLCanvasElement, randomY = false): EcoFoodParticle {
    const layer = Math.floor(Math.random() * 3);
    const size = layer === 0 ? 28 : layer === 1 ? 40 : 54;
    const emoji = this.foodEmojis[Math.floor(Math.random() * this.foodEmojis.length)];
    const peakY = canvas.height * (0.35 + Math.random() * 0.45); // Target apex height (35% to 80% from top)

    return {
      x: Math.random() * canvas.width,
      y: randomY ? canvas.height * (0.4 + Math.random() * 0.6) : canvas.height + size + Math.random() * 80,
      size,
      emoji,
      speedY: 0.9 + layer * 0.4 + Math.random() * 0.5,
      peakY,
      wobbleSpeed: 0.012 + Math.random() * 0.018,
      wobbleAngle: Math.random() * Math.PI * 2,
      wobbleDistance: 0.8 + Math.random() * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.015,
      opacity: layer === 0 ? 0.45 : layer === 1 ? 0.75 : 0.92,
      layer,
      direction: 'rising',
    };
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render soft environmental ambient background glows
    this.drawAmbientGlows(canvas);

    // Sort particles by depth layer
    const sorted = [...this.particles].sort((a, b) => a.layer - b.layer);
    sorted.forEach((particle) => this.updateAndDrawParticle(canvas, particle));

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawAmbientGlows(canvas: HTMLCanvasElement): void {
    // Soft light mint radial glow in top right
    const radial1 = this.ctx.createRadialGradient(canvas.width * 0.85, 0, 0, canvas.width * 0.85, 0, canvas.width * 0.5);
    radial1.addColorStop(0, 'rgba(34, 197, 94, 0.06)');
    radial1.addColorStop(1, 'transparent');
    this.ctx.fillStyle = radial1;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Soft warm cream radial glow in bottom left
    const radial2 = this.ctx.createRadialGradient(0, canvas.height, 0, 0, canvas.height, canvas.width * 0.5);
    radial2.addColorStop(0, 'rgba(247, 239, 229, 0.4)');
    radial2.addColorStop(1, 'transparent');
    this.ctx.fillStyle = radial2;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private updateAndDrawParticle(canvas: HTMLCanvasElement, particle: EcoFoodParticle): void {
    // 3D Continuous Rising & Descending Physics Movement
    if (particle.direction === 'rising') {
      particle.y -= particle.speedY;
      if (particle.y <= particle.peakY) {
        particle.direction = 'falling';
      }
    } else {
      particle.y += particle.speedY * 0.9;
      // Respawn seamlessly from bottom when item descends past canvas bottom
      if (particle.y > canvas.height + particle.size + 40) {
        const newParticle = this.createParticle(canvas, false);
        Object.assign(particle, newParticle);
      }
    }

    // Gentle side-to-side wobble & rotation
    particle.wobbleAngle += particle.wobbleSpeed;
    particle.x += Math.sin(particle.wobbleAngle) * particle.wobbleDistance;
    particle.rotation += particle.rotationSpeed;

    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.rotate(particle.rotation);

    // 3D soft lighting & shadow depth
    this.ctx.shadowBlur = 10 + particle.layer * 5;
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
    this.ctx.globalAlpha = particle.opacity;

    this.ctx.font = `${particle.size}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(particle.emoji, 0, 0);

    this.ctx.restore();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
