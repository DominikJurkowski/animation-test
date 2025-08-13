/* eslint-disable @next/next/no-img-element */
'use client';

import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

interface BurningRevealEffectProps {
  imageUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BurningRevealEffect: React.FC<BurningRevealEffectProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1754653099086-3bddb9346d37?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const imgWrap = imgWrapRef.current;
    const bg = bgRef.current;

    if (!canvas || !imgWrap || !bg) return;

    const gl = canvas.getContext('webgl2', { alpha: true });
    if (!gl) {
      alert('WebGL2 required');
      throw new Error('No WebGL2');
    }

    function resize() {
      if (!canvas || !gl) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    const vert = `#version 300 es
    in vec2 position;
    out vec2 v_uv;
    void main(){v_uv = position*0.5+0.5; gl_Position = vec4(position,0,1);}`;

    const frag = `#version 300 es
    precision highp float;
    in vec2 v_uv;
    out vec4 outColor;
    uniform float u_burn;
    uniform vec2 u_corner;
    uniform float u_time;
    uniform vec2 u_rectSize;
    uniform vec2 u_resolution;
    uniform int u_fromEdge; // 0=corner, 1=top, 2=right, 3=bottom, 4=left
    uniform float u_blurPx; // blur radius in pixels for the flame ring

    // Smooth value-noise + fbm for organic flames
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float valueNoise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0 - 2.0*f);
      return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
      for(int i=0;i<4;i++){
        v += a * valueNoise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    // ---- BLUR DEFINITION START ----
    // Computes the flame mask (0..1) at a given localPx position (in pixels inside the rect),
    // reproducing the same irregular front logic used in main(). Used for blur sampling.
    float flameMaskAt(vec2 sampleLocalPx){
      // Bounds check (outside rect -> no flame)
      if(sampleLocalPx.x < 0.0 || sampleLocalPx.y < 0.0 || sampleLocalPx.x > u_rectSize.x || sampleLocalPx.y > u_rectSize.y){
        return 0.0;
      }
      vec2 sampleUV = sampleLocalPx / u_rectSize;

      // Distance from origin (edge or corner)
      float distPx;
      float maxDist;
      if (u_fromEdge == 1) {        // top
        distPx = sampleLocalPx.y;
        maxDist = u_rectSize.y;
      } else if (u_fromEdge == 2) { // right
        distPx = (u_rectSize.x - sampleLocalPx.x);
        maxDist = u_rectSize.x;
      } else if (u_fromEdge == 3) { // bottom
        distPx = (u_rectSize.y - sampleLocalPx.y);
        maxDist = u_rectSize.y;
      } else if (u_fromEdge == 4) { // left
        distPx = sampleLocalPx.x;
        maxDist = u_rectSize.x;
      } else {                      // corner
        vec2 cornerPx = u_corner * u_rectSize;
        distPx = length(sampleLocalPx - cornerPx);
        vec2 farVecPx = vec2((1.0 - u_corner.x) * u_rectSize.x, (1.0 - u_corner.y) * u_rectSize.y);
        maxDist = length(farVecPx);
      }

      float frontPx = u_burn * maxDist;

      // Irregular front via fbm
      vec2 pNoise = sampleLocalPx / 48.0;
      float n = fbm(pNoise + vec2(0.0, u_time * 0.35));
      n = n * 2.0 - 1.0;
      float outward = max(0.0, n) * 32.0;
      float inward  = max(0.0, -n) * 10.0;
      float frontDist = frontPx + (outward - inward);

      // Edge-based bowing and chaos
      if (u_fromEdge != 0) {
        float t = (u_fromEdge == 1 || u_fromEdge == 3) ? sampleUV.x : sampleUV.y;
        float centerCurve = 1.0 - pow(abs(2.0*t - 1.0), 1.4);
        float lateralWob = (fbm(vec2(t*8.0, u_time * 0.6)) - 0.5) * 18.0;
        float crossWob   = (fbm((sampleLocalPx.yx) / 42.0 + u_time * 0.35) - 0.5) * 10.0;
        frontDist += centerCurve * 24.0 + lateralWob + crossWob;
      }

      // Thickness with jitter
      float baseHalfWidth = 25.0;
      float thicknessJitter = (fbm(pNoise * 1.7 + u_time * 0.25) - 0.5) * 6.0;
      float halfWidth = baseHalfWidth + thicknessJitter;
      if (u_fromEdge != 0) {
        float t = (u_fromEdge == 1 || u_fromEdge == 3) ? sampleUV.x : sampleUV.y;
        halfWidth += (fbm(vec2(t*5.0, u_time * 0.45)) - 0.5) * 4.0;
      }

      float softness = 6.0;
      float dToRing = abs(distPx - frontDist);
      float flame = 1.0 - smoothstep(halfWidth - softness, halfWidth + softness, dToRing);
      return flame;
    }
    // ---- BLUR DEFINITION END ----

    void main(){
      vec2 fragCoord = v_uv * u_resolution;
      vec2 rectHalf = u_rectSize * 0.5;
      vec2 center = u_resolution * 0.5;
      vec2 minB = center - rectHalf;
      vec2 maxB = center + rectHalf;

      // Default: fully black overlay everywhere
      vec3 color = vec3(0.0);
      float alpha = 1.0;

      // Inside-rect logic for burn and flames
      bool inside = fragCoord.x >= minB.x && fragCoord.x <= maxB.x && fragCoord.y >= minB.y && fragCoord.y <= maxB.y;
      if (inside) {
        vec2 localUV = (fragCoord - minB) / u_rectSize;
        vec2 localPx = localUV * u_rectSize;      // pixel-space within rect

        // Distance from origin
        float distPx;
        float maxDist;
        if (u_fromEdge == 1) {        // top
          distPx = localPx.y;
          maxDist = u_rectSize.y;
        } else if (u_fromEdge == 2) { // right
          distPx = (u_rectSize.x - localPx.x);
          maxDist = u_rectSize.x;
        } else if (u_fromEdge == 3) { // bottom
          distPx = (u_rectSize.y - localPx.y);
          maxDist = u_rectSize.y;
        } else if (u_fromEdge == 4) { // left
          distPx = localPx.x;
          maxDist = u_rectSize.x;
        } else {                      // corner
          vec2 cornerPx = u_corner * u_rectSize;
          distPx = length(localPx - cornerPx);
          vec2 farVecPx = vec2((1.0 - u_corner.x) * u_rectSize.x, (1.0 - u_corner.y) * u_rectSize.y);
          maxDist = length(farVecPx);
        }

        float frontPx = u_burn * maxDist;

        // Organic irregular front using fbm noise
        vec2 pNoise = localPx / 48.0; // ~48px noise scale
        float n = fbm(pNoise + vec2(0.0, u_time * 0.35));
        n = n * 2.0 - 1.0; // [-1,1]
        float outward = max(0.0, n) * 32.0;
        float inward  = max(0.0, -n) * 10.0;
        float frontDist = frontPx + (outward - inward);

        // For edge-based burns, push the center further than the sides and add lateral chaos
        if (u_fromEdge != 0) {
          // Lateral coordinate along the advancing edge: x for top/bottom, y for left/right
          float t = (u_fromEdge == 1 || u_fromEdge == 3) ? localUV.x : localUV.y;
          // Bowed center curve (1 at center, 0 near sides) with gentle sharpness
          float centerCurve = 1.0 - pow(abs(2.0*t - 1.0), 1.4);
          // Lateral wobble along the edge and cross wobble for added chaos
          float lateralWob = (fbm(vec2(t*8.0, u_time * 0.6)) - 0.5) * 18.0;
          float crossWob   = (fbm((localPx.yx) / 42.0 + u_time * 0.35) - 0.5) * 10.0;
          frontDist += centerCurve * 24.0 + lateralWob + crossWob;
        }

        // Ring thickness and softness (with extra jitter for edges)
        float baseHalfWidth = 25.0; // 50px ring
        float thicknessJitter = (fbm(pNoise * 1.7 + u_time * 0.25) - 0.5) * 6.0;
        float halfWidth = baseHalfWidth + thicknessJitter;
        if (u_fromEdge != 0) {
          float t = (u_fromEdge == 1 || u_fromEdge == 3) ? localUV.x : localUV.y;
          halfWidth += (fbm(vec2(t*5.0, u_time * 0.45)) - 0.5) * 4.0;
        }

        float softness = 6.0;

        float dToRing = abs(distPx - frontDist);
        float flameZone = 1.0 - smoothstep(halfWidth - softness, halfWidth + softness, dToRing);

        // --- Apply separable blur to the flame ring mask using flameMaskAt() ---
        float blurredFlame = flameZone;
        if (u_blurPx > 0.5) {
          // Build sampling direction in localPx space approximating the ring normal
          vec2 gradApprox;
          if (u_fromEdge == 1) gradApprox = vec2(0.0, 1.0);        // top -> outward along +y
          else if (u_fromEdge == 2) gradApprox = vec2(-1.0, 0.0);  // right -> outward along -x
          else if (u_fromEdge == 3) gradApprox = vec2(0.0, -1.0);  // bottom -> outward along -y
          else if (u_fromEdge == 4) gradApprox = vec2(1.0, 0.0);   // left -> outward along +x
          else {
            // corner: radial from corner toward current pixel
            vec2 cornerPx = u_corner * u_rectSize;
            gradApprox = normalize(localPx - cornerPx);
          }

          // Sample offsets along normal for a small gaussian-ish kernel
          vec2 dir = normalize(gradApprox);
          float r = clamp(u_blurPx, 0.0, 40.0);
          // 7-tap gaussian-ish kernel (broader than before)
          float w0 = 0.196482;
          float w1 = 0.296906;
          float w2 = 0.094470;
          float w3 = 0.010381;
          float acc = w0 * flameZone;
          acc += w1 * flameMaskAt(localPx + dir * r * 0.5);
          acc += w1 * flameMaskAt(localPx - dir * r * 0.5);
          acc += w2 * flameMaskAt(localPx + dir * r);
          acc += w2 * flameMaskAt(localPx - dir * r);
          acc += w3 * flameMaskAt(localPx + dir * r * 1.5);
          acc += w3 * flameMaskAt(localPx - dir * r * 1.5);
          blurredFlame = clamp(acc, 0.0, 1.0);
        }

        // Black ahead, transparent behind
        float ahead = smoothstep(frontDist + halfWidth - softness, frontDist + halfWidth + softness, distPx);
        float baseAlpha = ahead; // 1 ahead, 0 behind

        // Flame color (#FE3ED8) with flicker
        float flicker = fbm(pNoise * 2.3 + u_time * 0.9);
        vec3 flameBase = vec3(254.0/255.0, 62.0/255.0, 216.0/255.0);
        vec3 flameCol = flameBase * (0.55 + 0.45 * flicker);

        // Compose: flames on ring plus black elsewhere
        float flameAlpha = blurredFlame * 0.95;
        color = mix(color, flameCol, blurredFlame);
        alpha = max(baseAlpha, flameAlpha);

        // Subtle darkening by normalized distance
        float denom = max(1.0, maxDist);
        float edgeDark = smoothstep(0.0, 1.0, distPx / denom) * 0.06;
        color *= 1.0 - edgeDark;
      }

      outColor = vec4(color, alpha);
    }`;

    function compileShader(type: number, src: string): WebGLShader {
      if (!gl) throw new Error('WebGL context not available');
      const s = gl.createShader(type);
      if (!s) throw new Error('Failed to create shader');
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // eslint-disable-next-line no-console
        console.error(gl.getShaderInfoLog(s));
        throw new Error('Shader error');
      }
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vert);
    const fs = compileShader(gl.FRAGMENT_SHADER, frag);
    const prog = gl.createProgram();
    if (!prog) throw new Error('Failed to create program');

    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'position');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error(gl.getProgramInfoLog(prog));
      throw new Error('Link error');
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.useProgram(prog);
    // Enable alpha blending so transparent areas reveal the underlying image
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u_burn = gl.getUniformLocation(prog, 'u_burn');
    const u_corner = gl.getUniformLocation(prog, 'u_corner');
    const u_time = gl.getUniformLocation(prog, 'u_time');
    const u_rectSize = gl.getUniformLocation(prog, 'u_rectSize');
    const u_resolution = gl.getUniformLocation(prog, 'u_resolution');
    const u_fromEdge = gl.getUniformLocation(prog, 'u_fromEdge');
    const u_blurPx = gl.getUniformLocation(prog, 'u_blurPx');

    let imgReady = false;
    let rectSize = [300, 600]; // Will be updated based on image and canvas

    function computeRectSize(imgW: number, imgH: number) {
      if (!canvas) return;
      const maxW = canvas.width * 0.7;
      const maxH = canvas.height * 0.7;
      const s = Math.min(maxW / imgW, maxH / imgH);
      rectSize = [imgW * s, imgH * s];
    }

    function positionImageRect() {
      // Center the wrapper to match shader's centered rectangle
      if (!canvas || !imgWrap) return;
      const left = Math.round((canvas.width - rectSize[0]) * 0.5);
      const top = Math.round((canvas.height - rectSize[1]) * 0.5);
      imgWrap.style.width = rectSize[0] + 'px';
      imgWrap.style.height = rectSize[1] + 'px';
      imgWrap.style.left = left + 'px';
      imgWrap.style.top = top + 'px';
    }

    bg.onload = () => {
      computeRectSize(bg.naturalWidth, bg.naturalHeight);
      positionImageRect();
      imgReady = true;
    };
    bg.crossOrigin = 'anonymous';
    bg.src = imageUrl;

    // On resize, update rect size for current image and reposition wrapper
    const handleResize = () => {
      resize();
      if (bg.naturalWidth && bg.naturalHeight) {
        computeRectSize(bg.naturalWidth, bg.naturalHeight);
        positionImageRect();
      }
    };
    window.addEventListener('resize', handleResize);

    // We'll animate this JS object with GSAP. The render loop reads burnProxy.v every frame.
    const burnProxy = { v: 0.0 };

    function render() {
      // Clear to transparent so areas outside draws remain see-through
      if (!canvas || !gl) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!imgReady) {
        requestAnimationFrame(render);
        return;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(u_burn, burnProxy.v);
      gl.uniform2f(u_corner, corner[0], corner[1]);
      gl.uniform1f(u_time, performance.now() * 0.001);
      gl.uniform2f(u_rectSize, rectSize[0], rectSize[1]);
      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.uniform1i(u_fromEdge, fromEdge);
      gl.uniform1f(u_blurPx, blurPx);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }

    let corner = [0, 0];
    let fromEdge = 0; // 0=corner, 1=top, 2=right, 3=bottom, 4=left
    const blurPx = 14.0; // stronger default blur radius in pixels for the flame ring (was 6.0)
    requestAnimationFrame(render);

    // Event handlers
    const handleCornerChange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      const v = target.value;
      if (v.startsWith('edge:')) {
        const side = v.split(':')[1];
        fromEdge =
          side === 'top' ? 1 : side === 'right' ? 2 : side === 'bottom' ? 3 : 4;
      } else {
        fromEdge = 0;
        corner = v.split(',').map(Number);
      }
    };

    const handleBurnClick = () => {
      // animate the proxy's v property from its current value to 1.5 (covers full diagonal)
      gsap.killTweensOf(burnProxy);
      gsap.to(burnProxy, { v: 1.5, duration: 3, ease: 'power1.inOut' });
    };

    const handleResetClick = () => {
      gsap.killTweensOf(burnProxy);
      burnProxy.v = 0.0;
    };

    // Add event listeners
    const cornerSel = document.getElementById('cornerSel') as HTMLSelectElement;
    const burnBtn = document.getElementById('burnBtn') as HTMLButtonElement;
    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;

    if (cornerSel) cornerSel.addEventListener('change', handleCornerChange);
    if (burnBtn) burnBtn.addEventListener('click', handleBurnClick);
    if (resetBtn) resetBtn.addEventListener('click', handleResetClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cornerSel)
        cornerSel.removeEventListener('change', handleCornerChange);
      if (burnBtn) burnBtn.removeEventListener('click', handleBurnClick);
      if (resetBtn) resetBtn.removeEventListener('click', handleResetClick);
    };
  }, [imageUrl]);

  return (
    <div
      className={`burning-reveal-effect ${className}`}
      style={{
        height: '100%',
        margin: 0,
        background: '#fff',
        color: '#fff',
        ...style,
      }}
    >
      <div
        id='imgWrap'
        ref={imgWrapRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <img
          id='bg'
          ref={bgRef}
          alt=''
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>
      <canvas
        id='gl'
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          display: 'block',
        }}
      />
      <div
        className='controls'
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 10,
        }}
      >
        <select
          id='cornerSel'
          style={{
            padding: '8px 12px',
            marginRight: '8px',
            border: 'none',
            background: '#333',
            color: 'white',
            borderRadius: '4px',
          }}
        >
          <option value='0,0'>Top-left</option>
          <option value='1,0'>Top-right</option>
          <option value='0,1'>Bottom-left</option>
          <option value='1,1'>Bottom-right</option>
          <option value='edge:top'>Top edge</option>
          <option value='edge:right'>Right edge</option>
          <option value='edge:bottom'>Bottom edge</option>
          <option value='edge:left'>Left edge</option>
        </select>
        <button
          id='burnBtn'
          style={{
            padding: '8px 12px',
            marginRight: '8px',
            border: 'none',
            background: '#333',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Start Burn
        </button>
        <button
          id='resetBtn'
          style={{
            padding: '8px 12px',
            marginRight: '8px',
            border: 'none',
            background: '#333',
            color: 'white',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default BurningRevealEffect;
