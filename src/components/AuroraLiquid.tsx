'use client';
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

// Step 4: Add proper Simplex noise and height calculation
const FRAG_AURORA_LIQUID = `#version 300 es
precision highp float;

uniform vec3 uColorStops[4];
uniform vec2 uResolution;
uniform float uTime;
uniform float uAmplitude;

out vec4 fragColor;

struct ColorStop {
  vec3 color;
  float position;
};

vec3 interpolateColors(ColorStop colors[4], float factor) {
  int index = 0;
  for (int i = 0; i < 3; i++) {
    if (colors[i].position <= factor) {
      index = i;
    }
  }
  
  ColorStop current = colors[index];
  ColorStop next = colors[index + 1];
  float range = next.position - current.position;
  float lerpFactor = (factor - current.position) / range;
  
  return mix(current.color, next.color, lerpFactor);
}

// Simplex noise implementation
vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[4];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 1.0/3.0);
  colors[2] = ColorStop(uColorStops[2], 2.0/3.0);
  colors[3] = ColorStop(uColorStops[3], 1.0);
  
// New changes liquid colors move
  // vec3 rampColor = interpolateColors(colors, 1.0 - uv.y);
  // Liquid-like movement in the gradient: stronger, faster, with flowing noise
  float sinShiftX = 0.02 * sin(uv.x * 2.0 + uTime * 1.1);
  float sinShiftY = 0.04 * sin((1.0 - uv.y) * 0.6 + uTime * 0.8);
  float flowNoise = snoise(vec2(uv.x * 1.6 + uTime * 0.28, (1.0 - uv.y) * 0.4 - uTime * 0.22)) * 0.05;

  // Softer liquid-like movement in the gradient (less aggressive)
  // Format hint: amplitude * sin(spatialFrequency * coord + timeSpeed * uTime)
  // float sinShiftX = 0.06 * sin(uv.x * 1.6 + uTime * 0.40); // 0.06: horizontal wobble strength, 1.6: width-wise ripple density, 0.40: color drift speed
  //float sinShiftY = 0.04 * sin((1.0 - uv.y) * 1.8 + uTime * 0.30); // 0.04: vertical wobble strength, 1.8: height-wise ripple density, 0.30: vertical drift speed
  //float flowNoise = snoise(vec2(
  //  uv.x * 0.9 + uTime * 0.12,            // 0.9: noise scale across X, 0.12: noise flow speed in X
  //  (1.0 - uv.y) * 0.9 - uTime * 0.10     // 0.9: noise scale across Y, 0.10: noise flow speed in Y (negative = opposite direction)
  // )) * 0.05;                               // 0.05: overall noise influence on color shift
  

  float colorShift = sinShiftX + sinShiftY + flowNoise;
  float rampT = clamp(1.0 - uv.y + colorShift, 0.0, 1.0);
  vec3 rampColor = interpolateColors(colors, rampT);
  
  // Smooth wave animation (remains when noise is disabled)
  // Here sin is used to create a smooth wave animation
  float wave = sin(uv.x * 1.2 + uTime * 0.35) * 0.2;
  
  // Noise term (set to 0.0 to remove noise)
  float baseNoise = snoise(vec2(uv.x * 1.2 + uTime * 0.08, uTime * 0.20));

  // Tutaj manipulujemy zeby bylo mniej agresywniej
  float noise = baseNoise * 0.8 * uAmplitude; 
  // baseNoise * 0.35 * uAmplitude; 
  // enable to add noise
  
  float height = exp(wave + noise);
  // float band = (uv.y * 2.0 - height + 0.25);
  // uv.y * cos powieksza wysokosc w dol
  float band = (uv.y * 4.0 - height + 0.50);
  
  // Sharpen and strengthen intensity to reduce blur and boost color presence
  float intensity = clamp(band * 0.9, 0.0, 1.0);
  intensity = smoothstep(0.15, 0.98, intensity);
  
  vec3 auroraColor = rampColor ;
  
  // White background for areas with low intensity
  float mask = intensity;
  vec3 finalColor = mix(vec3(1.0), auroraColor, mask);

  fragColor = vec4(finalColor, 1.0);
}
`;

// Show full gradient palette everywhere, and add animated highlight
//  vec3 baseColor = rampColor;               // full gradient across the screen
//  vec3 highlightColor = auroraColor * 1.2;  // stronger highlight on top
//  vec3 finalColor = clamp(baseColor + highlightColor, 0.0, 1.0);

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

interface AuroraStepProps {
  step?: number;
  colorStops?: string[];
  amplitude?: number;
  // blend?: number;
  time?: number;
  speed?: number;
}

export default function AuroraLiquid(props: AuroraStepProps) {
  const {
    colorStops = ['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF'],
    amplitude = 1.0,
    // blend = 0.5,
  } = props;

  const propsRef = useRef<AuroraStepProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    // eslint-disable-next-line prefer-const
    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener('resize', resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    // Create uniforms based on step
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniforms: any = {
      uColorStops: { value: colorStopsArray },
      uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
    };

    uniforms.uTime = { value: 0 };
    uniforms.uAmplitude = { value: amplitude };

    // if (step >= 5) {
    //   uniforms.uBlend = { value: blend };
    // }

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG_AURORA_LIQUID,
      uniforms,
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      if (program) {
        program.uniforms.uTime.value = time * speed * 0.1;
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;

        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener('resize', resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colorStops, amplitude]);

  return (
    <div className='w-full h-full'>
      <div ref={ctnDom} className='w-full h-full' />
    </div>
  );
}
