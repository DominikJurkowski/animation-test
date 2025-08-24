'use client';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(
  e: MouseEvent | TouchEvent,
  rect: DOMRect
): { x: number; y: number } {
  let clientX = 0,
    clientY = 0;
  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

function getNewPosition(position: number, offset: number, arr: ImageItem[]) {
  const realOffset = Math.abs(offset) % arr.length;
  if (position - realOffset >= 0) {
    return position - realOffset;
  } else {
    return arr.length - (realOffset - position);
  }
}

// Parse RGB color string to RGB values
function parseRGB(color: string): [number, number, number] | null {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

// Improved noise function using hash
function hash(x: number, y: number): number {
  const n = x + y * 57;
  let hash = n;
  hash = (hash << 13) ^ hash;
  hash = hash * (hash * hash * 15731 + 789221) + 1376312589;
  return (hash & 0x7fffffff) / 0x7fffffff;
}

// Apply duotone effect to an image using Canvas
function applyDuotoneToImage(
  imageUrl: string,
  color1: string,
  color2: string,
  intensity: number,
  noiseAmount = 0.1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Parse colors
      const rgb1 = parseRGB(color1);
      const rgb2 = parseRGB(color2);

      if (!rgb1 || !rgb2) {
        reject(new Error('Invalid color format'));
        return;
      }

      // Apply duotone effect
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate luminance (same as in the WebGL shader)
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        // Normalize luminance to 0-1
        const normalizedLuminance = luminance / 255;

        // Apply intensity
        const adjustedLuminance = Math.pow(normalizedLuminance, 1 / intensity);

        // Add noise to the luminance
        const pixelIndex = i / 4;
        const x = pixelIndex % canvas.width;
        const y = Math.floor(pixelIndex / canvas.width);
        const noiseValue = (hash(x, y) - 0.5) * 2 * noiseAmount; // Range: -noiseAmount to +noiseAmount
        const noisyLuminance = Math.max(
          0,
          Math.min(1, adjustedLuminance + noiseValue)
        );

        // Interpolate between the two colors based on noisy luminance
        const newR = Math.round(
          rgb1[0] * (1 - noisyLuminance) + rgb2[0] * noisyLuminance
        );
        const newG = Math.round(
          rgb1[1] * (1 - noisyLuminance) + rgb2[1] * noisyLuminance
        );
        const newB = Math.round(
          rgb1[2] * (1 - noisyLuminance) + rgb2[2] * noisyLuminance
        );

        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        // Keep alpha unchanged
      }

      // Put the modified image data back
      ctx.putImageData(imageData, 0, 0);

      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

class ImageItem {
  public DOM: {
    el: HTMLDivElement;
    inner: HTMLDivElement | null;
    overlay: HTMLDivElement | null;
  } = {
    el: null as unknown as HTMLDivElement,
    inner: null,
    overlay: null,
  };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resize!: () => void;
  public originalUrl = '';
  public duotoneUrl = '';
  public duotoneTween: gsap.core.Tween | null = null;
  public isDuotoneActive = false;
  public duotoneProgress = 0;
  public isVisible = false;

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.originalUrl =
      this.DOM.inner?.style.backgroundImage.replace(
        /url\(['"]?(.*?)['"]?\)/,
        '$1'
      ) || '';

    // Create overlay element for duotone effect
    this.createOverlay();

    this.getRect();
    this.initEvents();
  }

  private createOverlay() {
    if (!this.DOM.inner) return;

    // Create overlay div for duotone effect
    this.DOM.overlay = document.createElement('div');
    this.DOM.overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: inherit;
      background-size: inherit;
      background-position: inherit;
      opacity: 0;
      pointer-events: none;
      z-index: 1;
    `;

    this.DOM.inner.appendChild(this.DOM.overlay);
  }

  private initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  private getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  public async applyDuotone(
    color1: string,
    color2: string,
    intensity: number,
    noiseAmount: number
  ): Promise<void> {
    if (!this.originalUrl) return;

    try {
      this.duotoneUrl = await applyDuotoneToImage(
        this.originalUrl,
        color1,
        color2,
        intensity,
        noiseAmount
      );
    } catch (error) {
      console.error('Failed to apply duotone effect:', error);
    }
  }

  public resetToOriginal(): void {
    // Kill any ongoing duotone animation
    if (this.duotoneTween) {
      this.duotoneTween.kill();
      this.duotoneTween = null;
    }

    if (this.DOM.overlay) {
      this.DOM.overlay.style.opacity = '0';
      this.DOM.overlay.style.backgroundImage = `url(${this.originalUrl})`;
      this.DOM.overlay.style.filter = '';
    }

    this.duotoneProgress = 0;
    this.isDuotoneActive = false;
  }

  public animateDuotoneEffect(duration: number, delay: number): void {
    if (!this.DOM.inner || !this.DOM.overlay || !this.isVisible) return;

    // Kill any existing duotone animation
    if (this.duotoneTween) {
      this.duotoneTween.kill();
    }

    // Set initial progress
    const startProgress = 0;
    const endProgress = 1;

    this.duotoneProgress = startProgress;

    // Create smooth duotone transition animation using GSAP
    this.duotoneTween = gsap.to(this, {
      duotoneProgress: endProgress,
      duration: duration,
      delay: delay,
      ease: 'power2.inOut',
      onUpdate: () => {
        // Stop animation if image is no longer visible
        if (!this.isVisible) {
          if (this.duotoneTween) {
            this.duotoneTween.kill();
          }
          return;
        }

        if (this.DOM.overlay) {
          // Update overlay opacity for smooth transition
          this.DOM.overlay.style.opacity = this.duotoneProgress.toString();

          // Create noise/grain effect using contrast and brightness
          // Make noise more subtle and gradual
          const noisePhase = this.duotoneProgress * Math.PI * 1.5; // Slower oscillation
          const noiseIntensity = Math.sin(noisePhase) * 0.08; // Reduced intensity
          const contrastAmount = 100 + noiseIntensity * 20; // Reduced contrast variation

          // Add very subtle hue rotation for color distortion
          const hueRotation = this.duotoneProgress * 2; // Reduced hue shift

          // Combine all effects with smoother transitions
          const filterEffects = [
            `contrast(${contrastAmount}%)`,
            `hue-rotate(${hueRotation}deg)`,
            `saturate(${100 + this.duotoneProgress * 15}%)`,
          ];

          this.DOM.overlay.style.filter = filterEffects.join(' ');
        }
      },
      onComplete: () => {
        this.isDuotoneActive = true;
      },
    });
  }

  public destroy() {
    if (this.duotoneTween) {
      this.duotoneTween.kill();
    }
    if (this.DOM.overlay && this.DOM.overlay.parentNode) {
      this.DOM.overlay.parentNode.removeChild(this.DOM.overlay);
    }
    window.removeEventListener('resize', this.resize);
  }
}

class ImageTrailDuotoneTransition {
  private container: HTMLDivElement;
  private DOM: { el: HTMLDivElement };
  private images: ImageItem[];
  private imagesTotal: number;
  private imgPosition: number;
  private zIndexVal: number;
  private activeImagesCount: number;
  private isIdle: boolean;
  private threshold: number;
  private mousePos: { x: number; y: number };
  private lastMousePos: { x: number; y: number };
  private cacheMousePos: { x: number; y: number };
  private visibleImagesCount: number;
  private visibleImagesTotal: number;
  private duotoneConfig: {
    color1: string;
    color2: string;
    intensity: number;
    noiseAmount: number;
    enabled: boolean;
    duotoneDuration: number;
  };
  private duotoneDebounceTimer: number | null = null;
  private lastDuotoneApplication = 0;
  private duotoneDebounceDelay = 200;
  private lastImageDisplay = 0;
  private imageDisplayCooldown = 300;

  constructor(
    container: HTMLDivElement,
    duotoneConfig: {
      color1: string;
      color2: string;
      intensity: number;
      noiseAmount: number;
      enabled: boolean;
      duotoneDuration: number;
    }
  ) {
    this.container = container;
    this.DOM = { el: container };
    this.duotoneConfig = duotoneConfig;
    this.images = Array.from(container.querySelectorAll('.content__img')).map(
      (img) => new ImageItem(img as HTMLDivElement)
    );
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 200;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.visibleImagesCount = 0;
    this.visibleImagesTotal = 3;
    this.visibleImagesTotal = Math.min(
      this.visibleImagesTotal,
      this.imagesTotal - 1
    );

    // Prepare duotone effects for all images
    this.prepareDuotoneEffects();

    const handlePointerMove = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    const initRender = (ev: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      requestAnimationFrame(() => this.render());
      container.removeEventListener('mousemove', initRender as EventListener);
      container.removeEventListener('touchmove', initRender as EventListener);
    };
    container.addEventListener('mousemove', initRender as EventListener);
    container.addEventListener('touchmove', initRender as EventListener);
  }

  private async prepareDuotoneEffects() {
    if (!this.duotoneConfig.enabled) return;

    // Prepare duotone versions of all images
    const promises = this.images.map((img) =>
      img.applyDuotone(
        this.duotoneConfig.color1,
        this.duotoneConfig.color2,
        this.duotoneConfig.intensity,
        this.duotoneConfig.noiseAmount
      )
    );

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to prepare duotone effects:', error);
    }
  }

  public async updateDuotoneConfig(config: {
    color1: string;
    color2: string;
    intensity: number;
    noiseAmount: number;
    enabled: boolean;
    duotoneDuration: number;
  }) {
    this.duotoneConfig = config;
    await this.prepareDuotoneEffects();
  }

  public destroy() {
    // Clean up debounce timer
    if (this.duotoneDebounceTimer) {
      clearTimeout(this.duotoneDebounceTimer);
      this.duotoneDebounceTimer = null;
    }

    // Clean up all image resources
    this.images.forEach((img) => img.destroy());
  }

  private cancelPendingDuotoneApplications() {
    // Clear any pending duotone application timer
    if (this.duotoneDebounceTimer) {
      clearTimeout(this.duotoneDebounceTimer);
      this.duotoneDebounceTimer = null;
    }
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    const now = Date.now();

    // Check cooldown before showing new image
    if (
      distance > this.threshold &&
      now - this.lastImageDisplay > this.imageDisplayCooldown
    ) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
      this.lastImageDisplay = now;
    }

    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;

    requestAnimationFrame(() => this.render());
  }

  private applyDuotoneToSingleAgingImage() {
    if (!this.duotoneConfig.enabled || this.visibleImagesCount <= 1) return;

    const now = Date.now();

    // Check if enough time has passed since last duotone application
    if (now - this.lastDuotoneApplication < this.duotoneDebounceDelay) {
      // Clear existing timer and set a new one
      if (this.duotoneDebounceTimer) {
        clearTimeout(this.duotoneDebounceTimer);
      }

      this.duotoneDebounceTimer = window.setTimeout(() => {
        this.applyDuotoneToSingleAgingImage();
      }, this.duotoneDebounceDelay);

      return;
    }

    // Clear any existing timer
    if (this.duotoneDebounceTimer) {
      clearTimeout(this.duotoneDebounceTimer);
      this.duotoneDebounceTimer = null;
    }

    // Find the oldest visible image (excluding the newest one) that doesn't have duotone applied
    let targetImage: ImageItem | null = null;
    for (let i = 1; i < this.visibleImagesTotal; i++) {
      const index = getNewPosition(this.imgPosition, i, this.images);
      if (index !== this.imgPosition) {
        const img = this.images[index];
        // Check if image is still visible and hasn't been marked for removal
        if (!img.isDuotoneActive && img.duotoneUrl && img.isVisible) {
          targetImage = img;
          break; // Only apply to one image at a time
        }
      }
    }

    // Apply duotone effect to only one aging image
    if (targetImage) {
      // Set the duotone image as overlay background
      if (targetImage.DOM.overlay) {
        targetImage.DOM.overlay.style.backgroundImage = `url(${targetImage.duotoneUrl})`;
      }

      targetImage.animateDuotoneEffect(
        this.duotoneConfig.duotoneDuration,
        0 // No delay for immediate effect
        // this.duotoneConfig.color1,
        // this.duotoneConfig.color2,
        // this.duotoneConfig.intensity,
        // this.duotoneConfig.noiseAmount
      );
    }

    this.lastDuotoneApplication = now;
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;

    // Mark new image as visible and reset its state
    img.isVisible = true;
    img.resetToOriginal(); // Ensure it starts clean

    gsap.killTweensOf(img.DOM.el);
    // Randomize between 2 size variants
    const sizeVariants = [
      { width: 360, height: 400 }, // Variant 1: 360px width, 400px height
      { width: 270, height: 380 }, // Variant 2: 270px width, 380px height
    ];
    const selectedVariant =
      sizeVariants[Math.floor(Math.random() * sizeVariants.length)];
    const scaleValue = 1; // Keep scale at 1 since we're using actual dimensions

    // Apply duotone effect to a single aging image with debounce
    this.applyDuotoneToSingleAgingImage();

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          width: selectedVariant.width,
          height: selectedVariant.height,
          scale: 0.8, // Start at 80% for smooth animation
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - selectedVariant.width / 2,
          y: this.cacheMousePos.y - selectedVariant.height / 2,
        },
        {
          duration: 0.8, // Animation duration
          ease: 'power3',
          scale: scaleValue,
          rotationZ: gsap.utils.random(-2, 2), // Reduced rotation for less distortion
          x: this.mousePos.x - selectedVariant.width / 2,
          y: this.mousePos.y - selectedVariant.height / 2,
        },
        0
      );

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(
        this.imgPosition,
        this.visibleImagesTotal,
        this.images
      );
      const oldImg = this.images[lastInQueue];

      // Mark image as not visible immediately to prevent duotone application
      oldImg.isVisible = false;

      // Kill any pending duotone animation
      if (oldImg.duotoneTween) {
        oldImg.duotoneTween.kill();
      }

      // Cancel any pending duotone applications that might target this image
      this.cancelPendingDuotoneApplications();

      // Simply fade out the oldest image (it already has duotone effect applied)
      gsap.to(oldImg.DOM.el, {
        duration: 0.8, // Fade out animation
        ease: 'power4',
        opacity: 0,
        onComplete: () => {
          // Reset duotone effect when fade out completes
          if (oldImg.isDuotoneActive) {
            oldImg.resetToOriginal();
          }

          if (this.activeImagesCount === 0) {
            this.isIdle = true;
          }
        },
      });
    }
  }

  private onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  private onImageDeactivated() {
    this.activeImagesCount--;
  }
}

interface ImageTrailDuotoneProps {
  items?: string[];
  duotoneColor1?: string;
  duotoneColor2?: string;
  duotoneIntensity?: number;
  duotoneNoiseAmount?: number;
  duotoneEnabled?: boolean;
  duotoneDuration?: number;
}

export default function ImageTrailDuotoneTransitionComponent({
  items = [],
  duotoneColor1 = 'rgb(234,218,179)',
  duotoneColor2 = 'rgb(229,5,206)',
  duotoneIntensity = 1,
  duotoneNoiseAmount = 0.1,
  duotoneEnabled = true,
  duotoneDuration = 2.0,
}: ImageTrailDuotoneProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ImageTrailDuotoneTransition | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const duotoneConfig = {
      color1: duotoneColor1,
      color2: duotoneColor2,
      intensity: duotoneIntensity,
      noiseAmount: duotoneNoiseAmount,
      enabled: duotoneEnabled,
      duotoneDuration: duotoneDuration,
    };

    instanceRef.current = new ImageTrailDuotoneTransition(
      containerRef.current,
      duotoneConfig
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    items,
    duotoneColor1,
    duotoneColor2,
    duotoneIntensity,
    duotoneNoiseAmount,
    duotoneEnabled,
    duotoneDuration,
  ]);

  // Update duotone effect when props change
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.updateDuotoneConfig({
        color1: duotoneColor1,
        color2: duotoneColor2,
        intensity: duotoneIntensity,
        noiseAmount: duotoneNoiseAmount,
        enabled: duotoneEnabled,
        duotoneDuration: duotoneDuration,
      });
    }
  }, [
    duotoneColor1,
    duotoneColor2,
    duotoneIntensity,
    duotoneNoiseAmount,
    duotoneEnabled,
    duotoneDuration,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div
      className='w-full h-full relative z-[100] bg-transparent overflow-visible'
      ref={containerRef}
    >
      {items.map((url, i) => (
        <div
          className='content__img absolute top-0 left-0 opacity-0 overflow-hidden [will-change:transform,filter]'
          key={i}
          style={{
            width: '360px', // Default size, will be overridden by GSAP
            height: '400px', // Default size, will be overridden by GSAP
          }}
        >
          <div
            className='content__img-inner bg-center bg-cover w-[calc(100%+20px)] h-[calc(100%+20px)] absolute top-[-10px] left-[-10px]'
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
