'use client';

import { Geometry, Mesh, Program, Renderer } from 'ogl';
import React, { useEffect, useRef } from 'react';

interface HeatMapTextProps {
  text?: string;
  className?: string;
  width?: number;
  height?: number;
  intensity?: number;
  blurAmount?: number;
  gradientColors?: string[];
}

const HeatMapText: React.FC<HeatMapTextProps> = ({
  text = 'HEAT MAP',
  className = '',
  width = 800,
  height = 400,
  intensity = 1.0,
  blurAmount = 0.02,
  gradientColors = ['#ff0000', '#ffff00', '#00ff00', '#0000ff'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const programRef = useRef<Program | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create renderer
    const renderer = new Renderer({
      canvas: canvasRef.current,
      width,
      height,
      alpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;

    // Create full-screen quad geometry
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    // Convert gradient colors to vec3 format
    const colorVec3 = gradientColors.map((color) => {
      const hex = color.replace('#', '');
      return [
        parseInt(hex.substr(0, 2), 16) / 255,
        parseInt(hex.substr(2, 2), 16) / 255,
        parseInt(hex.substr(4, 2), 16) / 255,
      ];
    });

    // Create shader program
    const program = new Program(gl, {
      vertex: /* glsl */ `
        attribute vec2 uv;
        attribute vec2 position;

        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0, 1);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;

        uniform float uTime;
        uniform float uIntensity;
        uniform float uBlurAmount;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        uniform vec3 uColor4;
        uniform vec2 uResolution;

        varying vec2 vUv;

        // Noise function for heat distortion
        float noise(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Smooth noise
        float smoothNoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          
          float a = noise(i);
          float b = noise(i + vec2(1.0, 0.0));
          float c = noise(i + vec2(0.0, 1.0));
          float d = noise(i + vec2(1.0, 1.0));
          
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        // Heat map function
        vec3 heatMap(float t) {
          t = clamp(t, 0.0, 1.0);
          
          if(t < 0.33) {
            return mix(uColor1, uColor2, t * 3.0);
          } else if(t < 0.66) {
            return mix(uColor2, uColor3, (t - 0.33) * 3.0);
          } else {
            return mix(uColor3, uColor4, (t - 0.66) * 3.0);
          }
        }

        void main() {
          vec2 uv = vUv;
          
          // Create heat distortion
          float time = uTime * 0.5;
          vec2 distortion = vec2(
            smoothNoise(uv * 10.0 + time) * 0.1,
            smoothNoise(uv * 10.0 + time + 100.0) * 0.1
          );
          
          // Apply motion blur
          vec2 blurredUv = uv + distortion * uBlurAmount;
          
          // Create heat pattern
          float heat = 0.0;
          heat += smoothNoise(blurredUv * 5.0 + time * 0.5) * 0.5;
          heat += smoothNoise(blurredUv * 10.0 + time * 0.3) * 0.3;
          heat += smoothNoise(blurredUv * 20.0 + time * 0.2) * 0.2;
          
          // Add intensity
          heat *= uIntensity;
          
          // Create gradient from bottom to top
          float gradient = 1.0 - uv.y;
          heat = mix(heat, gradient, 0.3);
          
          // Apply heat map colors
          vec3 color = heatMap(heat);
          
          // Add glow effect
          float glow = smoothstep(0.0, 0.5, heat) * 0.5;
          color += glow * vec3(1.0, 0.5, 0.2);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: intensity },
        uBlurAmount: { value: blurAmount },
        uColor1: { value: colorVec3[0] },
        uColor2: { value: colorVec3[1] },
        uColor3: { value: colorVec3[2] },
        uColor4: { value: colorVec3[3] },
        uResolution: { value: [width, height] },
      },
    });

    programRef.current = program;

    // Create mesh
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    // Animation loop
    const animate = (time: number) => {
      if (programRef.current) {
        programRef.current.uniforms.uTime.value = time * 0.001;
      }

      renderer.render({ scene: mesh });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.gl
          .getExtension('WEBGL_lose_context')
          ?.loseContext();
      }
    };
  }, [width, height, intensity, blurAmount, gradientColors]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className='w-full h-full'
        style={{ width, height }}
      />
      <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
        <h1 className='text-6xl font-bold text-white drop-shadow-lg'>{text}</h1>
      </div>
    </div>
  );
};

export default HeatMapText;
