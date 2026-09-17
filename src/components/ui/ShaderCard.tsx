import React, { useEffect, useRef } from 'react';

export interface ShaderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number;
  positionY?: number;
  scale?: number;
  edgeMax?: number;
  falloffPower?: number;
  waveAmount?: number;
  branchIntensity?: number;
  verticalExtent?: number;
  blur?: number;
  colorTheme?: 'slate' | 'purple' | 'gold' | 'cyan' | 'emerald';
  children?: React.ReactNode;
}

const COLOR_MAP: Record<string, { r: number; g: number; b: number }> = {
  slate: { r: 0.58, g: 0.64, b: 0.72 },    // #94a3b8 Silver/Slate
  purple: { r: 0.66, g: 0.33, b: 0.97 },   // #a855f7 Royal Violet/Purple
  gold: { r: 0.96, g: 0.62, b: 0.04 },     // #f59e0b Gold/Amber
  cyan: { r: 0.02, g: 0.71, b: 0.83 },     // #06b6d4 Electric Cyan
  emerald: { r: 0.06, g: 0.73, b: 0.51 },  // #10b981 Haven Emerald
};

export const ShaderCard: React.FC<ShaderCardProps> = ({
  speed = 0.1,
  positionY = 0.15,
  scale = 3,
  edgeMax = 0.7,
  falloffPower = 3.5,
  waveAmount = 0.1,
  branchIntensity = 1.9,
  verticalExtent = 2,
  blur = 4.5,
  colorTheme = 'purple',
  children,
  className = '',
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    let animId: number;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec3 u_color;
      uniform float u_positionY;
      uniform float u_scale;
      uniform float u_edgeMax;
      uniform float u_falloffPower;
      uniform float u_waveAmount;
      uniform float u_branchIntensity;
      uniform float u_verticalExtent;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv = (uv - 0.5) * u_scale;
        uv.y += u_positionY;

        float t = u_time * 0.5;
        float wave = sin(uv.x * 2.5 + t) * u_waveAmount;
        wave += cos(uv.x * 4.0 - t * 1.2) * (u_waveAmount * 0.5);

        float dist = abs(uv.y - wave) * u_verticalExtent;
        float intensity = pow(clamp(1.0 - dist / u_edgeMax, 0.0, 1.0), u_falloffPower) * u_branchIntensity;

        // Add soft ambient depth glow
        float ambient = exp(-dist * 2.0) * 0.15;
        vec3 finalColor = u_color * (intensity + ambient);

        gl_FragColor = vec4(finalColor, clamp(intensity * 0.85 + ambient, 0.0, 0.95));
      }
    `;

    // Compile helper
    const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Full screen quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uColor = gl.getUniformLocation(program, 'u_color');
    const uPosY = gl.getUniformLocation(program, 'u_positionY');
    const uScale = gl.getUniformLocation(program, 'u_scale');
    const uEdgeMax = gl.getUniformLocation(program, 'u_edgeMax');
    const uFalloff = gl.getUniformLocation(program, 'u_falloffPower');
    const uWave = gl.getUniformLocation(program, 'u_waveAmount');
    const uBranch = gl.getUniformLocation(program, 'u_branchIntensity');
    const uVert = gl.getUniformLocation(program, 'u_verticalExtent');

    const col = COLOR_MAP[colorTheme] || COLOR_MAP.purple;
    gl.uniform3f(uColor, col.r, col.g, col.b);
    gl.uniform1f(uPosY, positionY);
    gl.uniform1f(uScale, scale);
    gl.uniform1f(uEdgeMax, edgeMax);
    gl.uniform1f(uFalloff, falloffPower);
    gl.uniform1f(uWave, waveAmount);
    gl.uniform1f(uBranch, branchIntensity);
    gl.uniform1f(uVert, verticalExtent);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let startTime = performance.now();
    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * (speed * 10);
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
    };
  }, [
    speed,
    positionY,
    scale,
    edgeMax,
    falloffPower,
    waveAmount,
    branchIntensity,
    verticalExtent,
    colorTheme,
  ]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} {...props}>
      {/* WebGL Shader Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        style={{
          filter: `blur(${blur}px)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* Content Slot */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
export default ShaderCard;
