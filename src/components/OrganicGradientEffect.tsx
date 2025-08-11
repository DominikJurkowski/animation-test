'use client';

import { useEffect, useRef } from 'react';

interface OrganicGradientEffectProps {
  progress: number;
  colors?: string[];
  className?: string;
}

export function OrganicGradientEffect({
  progress,
  colors = ['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF'],
  className = '',
}: OrganicGradientEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext;

    if (!gl) {
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader
    const fragmentShaderSource = `
      precision highp float;
      
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform vec4 uColor1;
      uniform vec4 uColor2;
      uniform vec4 uColor3;
      uniform vec4 uColor4;
      
      varying vec2 v_texCoord;
      
      // Enhanced noise functions for more organic effect
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        float maxValue = 0.0;
        
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(p * frequency);
          maxValue += amplitude;
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        
        return value / maxValue;
      }
      
      vec4 getGradientColor(float t) {
        float index = t * 3.0;
        int i = int(floor(index));
        float f = fract(index);
        
        vec4 color1, color2;
        if (i == 0) {
          color1 = uColor1;
          color2 = uColor2;
        } else if (i == 1) {
          color1 = uColor2;
          color2 = uColor3;
        } else {
          color1 = uColor3;
          color2 = uColor4;
        }
        
        return mix(color1, color2, smoothstep(0.0, 1.0, f));
      }
      
      void main() {
        vec2 uv = v_texCoord;
        
        // Create multiple layers of organic noise
        float noise1 = fbm(uv * 6.0 + uTime * 0.3);
        float noise2 = fbm(uv * 12.0 + uTime * 0.2);
        float noise3 = fbm(uv * 24.0 + uTime * 0.1);
        
        // Combine noise layers for more complex organic effect
        float organicNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
        
        // Create irregular burning edge with multiple frequencies
        float edgeNoise1 = fbm(uv * 8.0 + uTime * 0.4);
        float edgeNoise2 = fbm(uv * 16.0 + uTime * 0.2);
        float edgeNoise3 = fbm(uv * 32.0 + uTime * 0.1);
        
        float combinedEdgeNoise = (edgeNoise1 * 0.4 + edgeNoise2 * 0.4 + edgeNoise3 * 0.2);
        
        // Create the main edge with organic variation
        float baseEdge = uv.y - uProgress;
        float organicEdge = baseEdge + organicNoise * 0.15;
        float burningEdge = baseEdge + combinedEdgeNoise * 0.2;
        
        // Smooth step functions for different effects
        float edge = smoothstep(0.0, 0.4, organicEdge);
        float burningMask = smoothstep(0.0, 0.25, burningEdge);
        
        // Create gradient effect at the burning edge
        float gradientPos = (uv.y - uProgress) / 0.4;
        vec4 gradientColor = getGradientColor(clamp(gradientPos, 0.0, 1.0));
        
        // Add flame-like flickering effect
        float flicker = sin(uTime * 8.0) * 0.1 + 0.9;
        float flameNoise = fbm(uv * 20.0 + uTime * 0.8);
        float flameEffect = flameNoise * flicker;
        
        // Create glow effect
        float glowDistance = abs(uv.y - uProgress);
        float glow = exp(-glowDistance * 6.0) * 0.8;
        float innerGlow = exp(-glowDistance * 12.0) * 0.4;
        
        // Combine all effects
        float alpha = 1.0 - edge;
        float burningAlpha = 1.0 - burningMask;
        
        // Add flame particles effect
        float particleNoise = fbm(uv * 40.0 + uTime * 1.2);
        float particles = step(0.95, particleNoise) * burningAlpha * 0.3;
        
        // Final color composition
        vec4 flameColor = mix(gradientColor, vec4(1.0, 0.8, 0.4, 1.0), flameEffect * 0.3);
        vec4 finalColor = mix(flameColor, vec4(1.0), glow * burningAlpha);
        finalColor = mix(finalColor, vec4(1.0, 0.6, 0.2, 1.0), particles);
        finalColor.a = alpha * burningAlpha + innerGlow * 0.5;
        
        gl_FragColor = finalColor;
      }
    `;

    // Create shaders
    function createShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Failed to create shader');

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(`Shader compilation error: ${error}`);
      }

      return shader;
    }

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    // Create program
    const program = gl.createProgram();
    if (!program) throw new Error('Failed to create program');

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program linking error: ${error}`);
    }

    gl.useProgram(program);

    // Create buffers
    const positionBuffer = gl.createBuffer();
    const texCoordBuffer = gl.createBuffer();

    // Full-screen quad vertices
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

    // Set up position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set up texture coordinate buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'uTime');
    const progressLocation = gl.getUniformLocation(program, 'uProgress');
    const resolutionLocation = gl.getUniformLocation(program, 'uResolution');
    const color1Location = gl.getUniformLocation(program, 'uColor1');
    const color2Location = gl.getUniformLocation(program, 'uColor2');
    const color3Location = gl.getUniformLocation(program, 'uColor3');
    const color4Location = gl.getUniformLocation(program, 'uColor4');

    // Set initial uniforms
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Convert colors to normalized values
    const color1 = colors[0]
      .match(/\w\w/g)
      ?.map((x) => parseInt(x, 16) / 255) || [1, 0, 0, 1];
    const color2 = colors[1]
      .match(/\w\w/g)
      ?.map((x) => parseInt(x, 16) / 255) || [0, 1, 0, 1];
    const color3 = colors[2]
      .match(/\w\w/g)
      ?.map((x) => parseInt(x, 16) / 255) || [0, 0, 1, 1];
    const color4 = colors[3]
      .match(/\w\w/g)
      ?.map((x) => parseInt(x, 16) / 255) || [1, 1, 1, 1];

    gl.uniform4f(color1Location, color1[0], color1[1], color1[2], 1.0);
    gl.uniform4f(color2Location, color2[0], color2[1], color2[2], 1.0);
    gl.uniform4f(color3Location, color3[0], color3[1], color3[2], 1.0);
    gl.uniform4f(color4Location, color4[0], color4[1], color4[2], 1.0);

    // Enable blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Animation loop
    let animationId: number;
    const startTime = Date.now();

    function render() {
      const currentTime = (Date.now() - startTime) * 0.001;

      gl.uniform1f(timeLocation, currentTime);
      gl.uniform1f(progressLocation, progress);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }

    render();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
    };
  }, [progress, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    />
  );
}
