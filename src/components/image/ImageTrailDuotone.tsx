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
  public DOM: { el: HTMLDivElement; inner: HTMLDivElement | null } = {
    el: null as unknown as HTMLDivElement,
    inner: null,
  };
  public defaultStyle: gsap.TweenVars = { scale: 1, x: 0, y: 0, opacity: 0 };
  public rect: DOMRect | null = null;
  private resize!: () => void;
  public originalUrl = '';
  public duotoneUrl = '';

  constructor(DOM_el: HTMLDivElement) {
    this.DOM.el = DOM_el;
    this.DOM.inner = this.DOM.el.querySelector('.content__img-inner');
    this.originalUrl =
      this.DOM.inner?.style.backgroundImage.replace(
        /url\(['"]?(.*?)['"]?\)/,
        '$1'
      ) || '';
    this.getRect();
    this.initEvents();
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
      if (this.DOM.inner) {
        this.DOM.inner.style.backgroundImage = `url(${this.duotoneUrl})`;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to apply duotone effect:', error);
    }
  }

  public resetToOriginal(): void {
    if (this.DOM.inner && this.originalUrl) {
      this.DOM.inner.style.backgroundImage = `url(${this.originalUrl})`;
    }
  }
}

class ImageTrailDuotone {
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
  };

  constructor(
    container: HTMLDivElement,
    duotoneConfig: {
      color1: string;
      color2: string;
      intensity: number;
      noiseAmount: number;
      enabled: boolean;
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
    this.threshold = 180; // Increased threshold to slow down image display
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.visibleImagesCount = 0;
    this.visibleImagesTotal = 4; // Reduced max visible images to prevent overcrowding
    this.visibleImagesTotal = Math.min(
      this.visibleImagesTotal,
      this.imagesTotal - 1
    );

    // Apply duotone effect to all images
    this.applyDuotoneEffect();

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

  private async applyDuotoneEffect() {
    if (!this.duotoneConfig.enabled) {
      // Reset to original images
      this.images.forEach((img) => {
        img.resetToOriginal();
      });
      return;
    }

    // Apply duotone effect to all images
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
      // eslint-disable-next-line no-console
      console.error('Failed to apply duotone effects:', error);
    }
  }

  public async updateDuotoneConfig(config: {
    color1: string;
    color2: string;
    intensity: number;
    noiseAmount: number;
    enabled: boolean;
  }) {
    this.duotoneConfig = config;
    await this.applyDuotoneEffect();
  }

  private render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.3);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.3);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;

    requestAnimationFrame(() => this.render());
  }

  private showNextImage() {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    ++this.visibleImagesCount;

    gsap.killTweensOf(img.DOM.el);
    // Randomize between 2 size variants
    const sizeVariants = [
      { width: 360, height: 400 }, // Variant 1: 360px width, 400px height
      { width: 270, height: 380 }, // Variant 2: 270px width, 380px height
    ];
    const selectedVariant =
      sizeVariants[Math.floor(Math.random() * sizeVariants.length)];
    const scaleValue = 1; // Keep scale at 1 since we're using actual dimensions

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
          duration: 0.8, // Even slower animation duration
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
      gsap.to(oldImg.DOM.el, {
        duration: 0.8, // Slower fade out animation
        ease: 'power4',
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
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
}

export default function ImageTrailDuotoneComponent({
  items = [],
  duotoneColor1 = 'rgb(234,218,179)',
  duotoneColor2 = 'rgb(229,5,206)',
  duotoneIntensity = 1,
  duotoneNoiseAmount = 0.1,
  duotoneEnabled = true,
}: ImageTrailDuotoneProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<ImageTrailDuotone | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const duotoneConfig = {
      color1: duotoneColor1,
      color2: duotoneColor2,
      intensity: duotoneIntensity,
      noiseAmount: duotoneNoiseAmount,
      enabled: duotoneEnabled,
    };

    instanceRef.current = new ImageTrailDuotone(
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
      });
    }
  }, [
    duotoneColor1,
    duotoneColor2,
    duotoneIntensity,
    duotoneNoiseAmount,
    duotoneEnabled,
  ]);

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
