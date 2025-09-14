'use client';
// ===== IMPORTS =====
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

// - Color: Helps us work with colors (like mixing paint)
// - Mesh: A 3D object made of triangles (like a wireframe model)
// - Program: The "recipe" that tells the GPU how to draw things
// - Renderer: The thing that actually draws on the screen
// - Triangle: The simplest shape (3 points connected by lines)
// Import the fragment shader code that defines the visual appearance of the aurora effect
// A shader is like a tiny program that runs on every pixel of the screen
// This one creates the beautiful flowing aurora colors and animations
import { FRAG_AURORA_LIQUID } from '@/constant/animation/fragAuroraLiquid';

// ===== ORIGINAL CONCEPT =====
// These are old ideas for how the effect could work (we're not using this approach anymore)
// Show full gradient palette everywhere, and add animated highlight
//  vec3 baseColor = rampColor;               // full gradient across the screen
//  vec3 highlightColor = auroraColor * 1.2;  // stronger highlight on top
//  vec3 finalColor = clamp(baseColor + highlightColor, 0.0, 1.0);

// ===== VERTEX SHADER =====
const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// ===== TYPE DEFINITIONS =====
// TypeScript interface defining the configurable properties for the aurora effect
// Think of this like a contract that says "if you want to use this component, you can give me these options"
interface AuroraStepProps {
  step?: number;
  colorStops?: string[];
  amplitude?: number; // Controls the intensity/strength of the wave animations
  // Think of this like the volume knob for the waves
  // 0.0 = no waves (flat), 1.0 = normal waves, 2.0 = crazy big waves

  time?: number; // Manual time override (if not provided, uses animation frame time)
  // Normally the animation uses the current time, but you could override it
  // Useful for things like "pause at this moment" or "jump to this time"

  speed?: number; // Multiplier for animation speed (default: 1.0)
  // Like the speed control on a video player
  // 0.5 = half speed (slow motion), 1.0 = normal speed, 2.0 = double speed
}

// ===== MAIN COMPONENT =====
export default function AuroraLiquid(props: AuroraStepProps) {
  // ===== PROPS SETUP =====
  // Destructure props with default values for a beautiful pink-to-white gradient
  // "Destructuring" is like unpacking a box - we take out the things we need
  const {
    // colorStops = ['#FE3ED8', '#F6C2A4', '#F8FEC1', '#FFFFFF'], // Default: Pink → Peach → Cream → White
    colorStops = ['#FE59BA', '#F1BC5C', '#F3F69A', '#F8FEC1'], // Default: Pink → Peach → Cream → Light Cream (bottom to top)
    // If the user doesn't provide colors, we use these beautiful default ones
    // #FE59BA = bright pink (bottom), #F1BC5C = peach, #F3F69A = cream, #F8FEC1 = light cream (top)

    amplitude = 1.0, // Default wave intensity

    // blend = 0.5,   // Blending factor (commented out for future use)
  } = props;

  // ===== REFS SETUP =====
  // Create a ref to store the latest props for use in the animation loop
  // This ensures the animation always uses the most current prop values
  // Think of this like a sticky note that always has the latest information
  const propsRef = useRef<AuroraStepProps>(props);
  propsRef.current = props; // Update the sticky note with the latest props

  // Ref to the DOM container where the WebGL canvas will be mounted
  const ctnDom = useRef<HTMLDivElement>(null);

  // ===== SETUP EFFECT =====
  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return; // Exit early if container ref is not available

    // ===== WEBGL RENDERER SETUP =====
    // Create WebGL renderer with transparency support for smooth blending
    // The renderer is like the artist that will draw our animation
    const renderer = new Renderer({
      alpha: true, // Enable alpha channel for transparency
      // Alpha is like the "see-through" part of colors (like glass)

      premultipliedAlpha: true, // Use premultiplied alpha for better blending
      // This makes colors blend more naturally (like mixing paint properly)

      antialias: true, // Enable antialiasing for smoother edges
      // This makes lines look smooth instead of jagged (like smoothing rough edges)
    });

    // Get the WebGL context for direct GPU access
    const gl = renderer.gl;

    // ===== WEBGL CONFIGURATION =====
    // Configure WebGL state for transparent rendering
    // This is like setting up the canvas before painting
    gl.clearColor(255, 255, 255, 0); // Set clear color to transparent black

    gl.enable(gl.BLEND); // Enable color blending
    // This allows colors to mix together (like mixing paint)

    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // Use additive blending for smooth transparency
    // This is the specific way we want colors to mix (like choosing a mixing technique)

    gl.canvas.style.backgroundColor = 'transparent'; // Ensure canvas background is transparent
    // Make sure the canvas itself is see-through

    // ===== SHADER PROGRAM DECLARATION =====
    // Declare shader program variable (will be initialized later)
    // eslint-disable-next-line prefer-const
    let program: Program | undefined;

    // ===== RESIZE HANDLER =====
    // Function to handle window resize events and update canvas size
    // This is like making sure our painting fits the frame when someone resizes the window
    function resize() {
      if (!ctn) return; // Make sure we have a container to work with

      const width = ctn.offsetWidth; // Get current container width
      const height = ctn.offsetHeight; // Get current container height
      // This is like measuring the frame to see how big it is

      renderer.setSize(width, height); // Update WebGL canvas size

      // Update the resolution uniform in the shader so it knows the new canvas dimensions
      // This is like telling the shader "the canvas is now X pixels wide and Y pixels tall"
      if (program) {
        program.uniforms.uResolution.value = [width, height];
        // The shader needs to know the canvas size to draw things in the right places
      }
    }
    window.addEventListener('resize', resize); // Listen for window resize events

    // ===== GEOMETRY SETUP =====
    // Create a triangle geometry that covers the entire screen
    // A triangle is the simplest shape that can fill a rectangle when rendered
    const geometry = new Triangle(gl);

    // Remove UV coordinates since we're not using texture mapping
    // UV coordinates are used for texture sampling, but we're generating colors procedurally
    // UV coordinates are like "where on a photo to look for color" - but we're making colors with math instead
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    // ===== COLOR CONVERSION =====
    // Convert hex color strings to RGB arrays for the GPU shader
    // The shader expects colors as [red, green, blue] arrays with values 0-1
    // This is like converting "pink paint" into "mix 0.8 red, 0.2 green, 0.9 blue"
    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex); // Parse hex string to Color object
      return [c.r, c.g, c.b]; // Extract RGB values as array
    });

    // ===== UNIFORM VARIABLES SETUP =====
    // Create uniform variables that will be passed to the GPU shader
    // Uniforms are global variables that remain constant during a single draw call
    // Think of uniforms like "settings" that the shader can read but not change
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uniforms: any = {
      uColorStops: { value: colorStopsArray }, // Color gradient stops for the aurora
      // This tells the shader "here are the colors you can use for the gradient"

      uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] }, // Canvas dimensions for proper scaling
      // This tells the shader "the canvas is this many pixels wide and tall"
    };

    // Add time uniform for animation (starts at 0, will be updated each frame)
    uniforms.uTime = { value: 0 };
    // This is like a clock that the shader can read to know "what time is it?"
    // We'll update this every frame to make the animation move

    // Add amplitude uniform to control wave intensity
    uniforms.uAmplitude = { value: amplitude };
    // This tells the shader "how strong should the waves be?" (like a volume knob)

    // ===== SHADER PROGRAM CREATION =====
    // Create the shader program by combining vertex and fragment shaders
    // This is the "recipe" that tells the GPU how to render our effect
    // Think of it like giving the GPU a cookbook with instructions
    program = new Program(gl, {
      vertex: VERT, // Vertex shader (handles geometry positioning)
      // This tells the GPU "for each corner of the triangle, put it here"

      fragment: FRAG_AURORA_LIQUID, // Fragment shader (handles pixel colors and effects)
      // This tells the GPU "for each pixel, calculate what color it should be"

      uniforms, // Pass our uniform variables to the shaders
      // This gives the shaders access to our settings (colors, time, etc.)
    });

    // ===== MESH CREATION =====
    // Create a mesh by combining the geometry and shader program
    // The mesh is what actually gets rendered to the screen
    const mesh = new Mesh(gl, { geometry, program });

    // ===== CANVAS MOUNTING =====
    // Add the WebGL canvas to the DOM container so it becomes visible
    ctn.appendChild(gl.canvas);

    // ===== ANIMATION LOOP SETUP =====
    // Animation loop variables
    let animateId = 0; // Store the animation frame ID for cleanup
    // This is like a ticket number that lets us cancel the animation later

    // ===== MAIN ANIMATION FUNCTION =====
    // Main animation update function that runs every frame
    // This is like the heartbeat of our animation - it runs 60 times per second
    const update = (t: number) => {
      // Schedule the next frame update (creates a smooth 60fps loop)
      animateId = requestAnimationFrame(update);

      // Get current props and calculate time values
      // This gets the latest settings from the user (colors, speed, etc.)
      // const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      const { time = t * 0.01, speed = 1.15 } = propsRef.current;
      // t * 0.01 slows down the time so the animation isn't too fast

      if (program) {
        // ===== UPDATE SHADER UNIFORMS =====
        // Update time uniform for animation (multiply by speed and scale factor)
        // The 0.1 factor slows down the animation for a more pleasant effect
        program.uniforms.uTime.value = time * speed * 0.1;
        // This tells the shader "it's this time now" so it can animate

        // Update amplitude uniform to control wave intensity
        program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
        // This tells the shader "make the waves this strong"

        // Update color stops if they've changed (allows dynamic color changes)
        // This lets the user change colors while the animation is running
        const stops = propsRef.current.colorStops ?? colorStops;
        program.uniforms.uColorStops.value = stops.map((hex: string) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        // Convert the new colors to the format the shader expects

        // ===== RENDER THE FRAME =====
        // Render the mesh to the screen
        renderer.render({ scene: mesh });
      }
    };

    // ===== START THE ANIMATION =====
    // Start the animation loop
    animateId = requestAnimationFrame(update);

    // ===== INITIAL SETUP =====
    // Initial resize to set correct canvas size
    // This makes sure the canvas is the right size when it first appears
    resize();

    // ===== CLEANUP FUNCTION =====
    // Cleanup function that runs when component unmounts or dependencies change
    // This is like the "cleanup crew" that comes in when the show is over
    return () => {
      // Stop the animation loop to prevent memory leaks
      // This is like turning off the movie projector when the show is done
      cancelAnimationFrame(animateId);

      // Remove the resize event listener
      // This is like telling the security guard "you can go home now"
      window.removeEventListener('resize', resize);

      // Remove the canvas from the DOM if it's still attached
      // This is like taking the painting out of the frame
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }

      // Release the WebGL context to free up GPU resources
      // This is like giving back the graphics card to the computer
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [colorStops, amplitude]); // Re-run effect when these props change
  // This tells React "if the colors or amplitude change, restart everything"

  // ===== COMPONENT RENDER =====
  // Return the JSX structure for the component
  // This is what the user sees - just two divs that hold our animation
  return (
    <div className='w-full h-full'>
      {/* Outer container with full width and height */}
      {/* This is like the frame that holds our painting */}
      <div ref={ctnDom} className='w-full h-full' />
      {/* WebGL canvas container */}
      {/* This is where our beautiful aurora animation will appear */}
    </div>
  );
}
