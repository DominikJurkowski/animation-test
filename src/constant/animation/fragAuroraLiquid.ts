export const FRAG_AURORA_LIQUID = `#version 300 es
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
  colors[0] = ColorStop(uColorStops[0], 0.0);    // First color at bottom (0.0)
  colors[1] = ColorStop(uColorStops[1], 1.0/3.0); // Second color at 1/3 height
  colors[2] = ColorStop(uColorStops[2], 2.0/3.0); // Third color at 2/3 height
  colors[3] = ColorStop(uColorStops[3], 1.0);     // Fourth color at top (1.0)
  
// New changes liquid colors move
  // vec3 rampColor = interpolateColors(colors, 1.0 - uv.y);
  // Liquid-like movement in the gradient: stronger, faster, with flowing noise
  float sinShiftX = 0.02 * sin(uv.x * 2.0 + uTime * 1.1);
  float sinShiftY = 0.04 * sin(uv.y * 0.6 + uTime * 0.8);
  float flowNoise = snoise(vec2(uv.x * 1.6 + uTime * 0.28, uv.y * 0.4 + uTime * 0.22)) * 0.05;

  // Softer liquid-like movement in the gradient (less aggressive)
  // Format hint: amplitude * sin(spatialFrequency * coord + timeSpeed * uTime)
  // float sinShiftX = 0.06 * sin(uv.x * 1.6 + uTime * 0.40); // 0.06: horizontal wobble strength, 1.6: width-wise ripple density, 0.40: color drift speed
  //float sinShiftY = 0.04 * sin((1.0 - uv.y) * 1.8 + uTime * 0.30); // 0.04: vertical wobble strength, 1.8: height-wise ripple density, 0.30: vertical drift speed
  //float flowNoise = snoise(vec2(
  //  uv.x * 0.9 + uTime * 0.12,            // 0.9: noise scale across X, 0.12: noise flow speed in X
  //  (1.0 - uv.y) * 0.9 - uTime * 0.10     // 0.9: noise scale across Y, 0.10: noise flow speed in Y (negative = opposite direction)
  // )) * 0.05;                               // 0.05: overall noise influence on color shift
  

  float colorShift = sinShiftX + sinShiftY + flowNoise;
  float rampT = clamp(uv.y + colorShift, 0.0, 1.0);
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
  // Reversed: now starts from bottom
  float band = ((1.0 - uv.y) * 4.0 - height + 0.50);
  
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
