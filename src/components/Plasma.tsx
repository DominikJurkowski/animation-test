'use client';

import { Mesh, Program, Renderer, Triangle } from 'ogl';
import React, { useEffect, useRef } from 'react';

interface PlasmaProps {
  color?: string | string[];
  speed?: number;
  direction?: 'forward' | 'reverse' | 'pingpong';
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uUseCustomColor;
uniform float uUseGradient;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  
  // Smooth gradient color calculation
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float gradientPos = uv.y + sin(iTime * 0.5) * 0.1 + uv.x * 0.2;
  gradientPos = fract(gradientPos);
  
  // Use smoothstep for softer transitions
  vec3 gradientColor;
  if (gradientPos < 0.33) {
    float t = smoothstep(0.0, 0.33, gradientPos);
    gradientColor = mix(uColor1, uColor2, t);
  } else if (gradientPos < 0.66) {
    float t = smoothstep(0.33, 0.66, gradientPos);
    gradientColor = mix(uColor2, uColor3, t);
  } else {
    float t = smoothstep(0.66, 1.0, gradientPos);
    gradientColor = mix(uColor3, uColor1, t);
  }
  
  // Boost the gradient colors to make them more vibrant
  gradientColor = pow(gradientColor, vec3(1.6));
  
  vec3 customColor = uCustomColor;
  vec3 finalColor;
  
  if (uUseGradient > 0.5) {
    finalColor = gradientColor;
  } else if (uUseCustomColor > 0.5) {
    finalColor = customColor;
  } else {
    finalColor = rgb;
  }
  
  // Use a higher base alpha to make colors more visible
  float alpha = length(rgb);
  // float alpha = max(length(rgb), 0.1);
  
  // Apply additional smoothing to prevent harsh borders
  float smoothAlpha = smoothstep(0.0, 0.9, alpha);
  fragColor = vec4(gradientColor, smoothAlpha);
}`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = '#ffffff',
  speed = 1,
  direction = 'forward',
  scale = 1,
  opacity = 1,
  mouseInteractive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const isGradient = Array.isArray(color) && color.length >= 3;
    const useCustomColor = !isGradient && color ? 1.0 : 0.0;
    const useGradient = isGradient ? 1.0 : 0.0;

    const customColorRgb =
      !isGradient && typeof color === 'string' ? hexToRgb(color) : [1, 1, 1];
    const gradientColors = isGradient
      ? (color as string[]).map(hexToRgb)
      : [
          [1, 0, 0.5], // Default colors if not provided
          [1, 0.5, 0.2],
          [1, 1, 0.5],
        ];

    const directionMultiplier = direction === 'reverse' ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    containerRef.current.appendChild(canvas);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uColor1: { value: new Float32Array(gradientColors[0] || [1, 0, 0.5]) },
        uColor2: {
          value: new Float32Array(gradientColors[1] || [1, 0.5, 0.2]),
        },
        uColor3: { value: new Float32Array(gradientColors[2] || [1, 1, 0.5]) },
        uUseCustomColor: { value: useCustomColor },
        uUseGradient: { value: useGradient },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = containerRef.current!.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);
    setSize();

    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const timeValue = (t - t0) * 0.001;

      if (direction === 'pingpong') {
        const cycle = Math.sin(timeValue * 0.5) * directionMultiplier;
        (program.uniforms.uDirection as any).value = cycle;
      }

      (program.uniforms.iTime as any).value = timeValue;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive && containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      try {
        containerRef.current?.removeChild(canvas);
      } catch {
        console.error('Error removing canvas');
      }
    };
  }, [color, speed, direction, scale, opacity, mouseInteractive]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full relative overflow-hidden'
    />
  );
};

export default Plasma;
