import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { gsap } from 'gsap';

@Component({
  selector: 'app-falling-food-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #container class="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"></div>
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
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sprites: THREE.Sprite[] = [];
  private animationFrameId?: number;

  readonly foodEmojis = [
    '🍎', '🍌', '🍊', '🍓', '🥭', '🍇',
    '🥕', '🍅', '🥦', '🥬', '🌽', '🥔',
    '🥖', '🥐', '🍰', '🍩', '🧁', '🍪',
    '🍚', '🍕', '🍔', '🥪', '🥗',
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.initThreeJs();
    this.createFoodParticles();
    
    // Run animation outside Angular zone for 60FPS performance
    this.ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private initThreeJs(): void {
    const container = this.containerRef.nativeElement;

    // Scene
    this.scene = new THREE.Scene();
    
    // Add soft lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.z = 100;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
  }

  private createEmojiTexture(emoji: string, size: number): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Add subtle shadow to emoji
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.font = `${size * 0.7}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, size / 2, size / 2 + size * 0.05);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  private createFoodParticles(): void {
    const count = 10; // Exactly 10 items

    for (let i = 0; i < count; i++) {
      const emoji = this.foodEmojis[Math.floor(Math.random() * this.foodEmojis.length)];
      const size = 128; // Canvas size for high res
      const texture = this.createEmojiTexture(emoji, size);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      
      // Random scale between 6 and 10
      const scale = 6 + Math.random() * 4;
      sprite.scale.set(scale, scale, 1);

      this.scene.add(sprite);
      this.sprites.push(sprite);

      // Start animation sequence
      this.animateSprite(sprite, i * 0.5); // Stagger start times
    }
  }

  private getFrustumSizeAtDepth(depth: number) {
    const vFOV = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(vFOV / 2) * depth;
    const width = height * this.camera.aspect;
    return { width, height };
  }

  private animateSprite(sprite: THREE.Sprite, delay: number): void {
    const frustum = this.getFrustumSizeAtDepth(this.camera.position.z);
    
    // Constraints
    const bottomY = -frustum.height / 2 - 10;
    // The items should stay ONLY near the bottom area (e.g. from -bottom to max -height/6)
    const peakY = -frustum.height / 4 + (Math.random() * frustum.height * 0.1); 
    // Constrain X to the center area under the logo
    const rangeX = frustum.width * 0.25; 
    const startX = (Math.random() - 0.5) * rangeX;
    
    // Reset position
    sprite.position.set(startX, bottomY, (Math.random() - 0.5) * 20); // slight Z variation
    
    // Assign a random emoji texture for the new cycle
    const emoji = this.foodEmojis[Math.floor(Math.random() * this.foodEmojis.length)];
    sprite.material.map = this.createEmojiTexture(emoji, 128);
    sprite.material.needsUpdate = true;

    // Wobble target
    const endX = startX + (Math.random() - 0.5) * 10;
    
    // GSAP Timeline for physics
    const tl = gsap.timeline({
      delay: delay,
      onComplete: () => {
        this.animateSprite(sprite, 0); // Loop
      }
    });

    // Float upward (Gravity deceleration)
    tl.to(sprite.position, {
      y: peakY,
      duration: 2.5 + Math.random() * 1.5,
      ease: "power2.out"
    }, 0);

    // Wobble horizontally while rising
    tl.to(sprite.position, {
      x: endX,
      duration: 2.5,
      ease: "sine.inOut"
    }, 0);
    
    // Slight material rotation (since Sprite doesn't rotate in 3D natively, we rotate the material)
    sprite.material.rotation = (Math.random() - 0.5) * 0.5;
    tl.to(sprite.material, {
      rotation: sprite.material.rotation + (Math.random() - 0.5) * Math.PI,
      duration: 5, // spans both up and down
      ease: "none"
    }, 0);

    // Fall back down (Gravity acceleration)
    const fallDuration = 2 + Math.random() * 1;
    tl.to(sprite.position, {
      y: bottomY,
      duration: fallDuration,
      ease: "power2.in"
    });

    // Wobble horizontally while falling
    tl.to(sprite.position, {
      x: startX + (Math.random() - 0.5) * 15,
      duration: fallDuration,
      ease: "sine.inOut"
    }, "<");
  }

  @HostListener('window:resize')
  onResize(): void {
    const container = this.containerRef.nativeElement;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    gsap.killTweensOf(this.sprites);
    
    // Clean up Three.js resources
    this.sprites.forEach(sprite => {
      sprite.material.map?.dispose();
      sprite.material.dispose();
    });
    this.renderer.dispose();
  }
}
