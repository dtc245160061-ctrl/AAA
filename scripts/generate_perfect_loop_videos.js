import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// 960x540 rendered at 60fps and upscaled by FFmpeg to 1080p with bicubic filtering
const WIDTH = 960;
const HEIGHT = 540;
const FPS = 60;
const DURATION_SEC = 8;
const TOTAL_FRAMES = FPS * DURATION_SEC; // 480 frames for an ultra-smooth 8-second loop

// Dark mode colors: #0A0C10 (Canvas Dark), #0369A1 (Azure Blue), #047857 (Emerald)
const DARK_COLORS = {
  color1: [10, 12, 16],   // #0A0C10
  color2: [3, 105, 161],  // #0369A1
  color3: [4, 120, 87]    // #047857
};

// Light mode colors: #F7F9F8 (Sanctuary White), #BAE6FD (Sky Mist), #A7F3D0 (Mint Emerald)
const LIGHT_COLORS = {
  color1: [247, 249, 248], // #F7F9F8
  color2: [186, 230, 253], // #BAE6FD
  color3: [167, 243, 208]  // #A7F3D0
};

async function writeBuffer(stream, buffer) {
  if (!stream.write(buffer)) {
    await new Promise((resolve) => stream.once('drain', resolve));
  }
}

async function generateSeamlessLoopVideo(outputPath, isLight = false) {
  console.log(`Generating perfectly seamless 60fps video: ${outputPath}...`);

  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'rawvideo',
    '-pix_fmt', 'rgb24',
    '-s', `${WIDTH}x${HEIGHT}`,
    '-r', `${FPS}`,
    '-i', '-',
    '-vf', 'scale=1920:1080:flags=bicubic',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    outputPath
  ]);

  ffmpeg.stderr.on('data', () => {}); // consume logs

  const palette = isLight ? LIGHT_COLORS : DARK_COLORS;
  const frameBuffer = Buffer.alloc(WIDTH * HEIGHT * 3);

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const t = f / TOTAL_FRAMES; // 0 to 1
    const angle = t * 2 * Math.PI; // 0 to 2*PI (guarantees f(0) === f(1))
    const sinT = Math.sin(angle);
    const cosT = Math.cos(angle);

    // Continuous orbital trajectories
    const cx1 = 0.35 + 0.20 * cosT;
    const cy1 = 0.40 + 0.18 * sinT;

    const cx2 = 0.65 - 0.22 * sinT;
    const cy2 = 0.60 + 0.20 * cosT;

    const cx3 = 0.50 + 0.16 * Math.sin(angle * 2);
    const cy3 = 0.45 + 0.14 * Math.cos(angle * 2);

    let ptr = 0;

    for (let y = 0; y < HEIGHT; y++) {
      const ny = y / HEIGHT;
      for (let x = 0; x < WIDTH; x++) {
        const nx = x / WIDTH;

        // Distances from moving energy centers
        const dx1 = nx - cx1;
        const dy1 = (ny - cy1) * 1.2;
        const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

        const dx2 = nx - cx2;
        const dy2 = (ny - cy2) * 1.1;
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        const dx3 = nx - cx3;
        const dy3 = (ny - cy3) * 1.4;
        const d3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

        // Periodic harmonic wave equations (zero jump at t=0 and t=1)
        const wave1 = Math.sin(d1 * 4.5 - angle + ny * 2.0) * 0.5 + 0.5;
        const wave2 = Math.cos(d2 * 5.0 + angle - nx * 2.0) * 0.5 + 0.5;
        const wave3 = Math.sin(d3 * 3.8 + angle * 2.0) * 0.5 + 0.5;

        // Smooth radial attenuation
        const w2 = Math.pow(wave1 * Math.max(0, 1.0 - d1 * 0.8), 1.3);
        const w3 = Math.pow(wave2 * Math.max(0, 1.0 - d2 * 0.75), 1.3);
        const w4 = Math.pow(wave3 * Math.max(0, 1.0 - d3 * 0.9), 1.2);
        const w1 = Math.max(0, 1.0 - w2 - w3 - w4 * 0.5);

        // Blended RGB
        let r = palette.color1[0] * w1 + palette.color2[0] * w2 + palette.color3[0] * (w3 + w4 * 0.5);
        let g = palette.color1[1] * w1 + palette.color2[1] * w2 + palette.color3[1] * (w3 + w4 * 0.5);
        let b = palette.color1[2] * w1 + palette.color2[2] * w2 + palette.color3[2] * (w3 + w4 * 0.5);

        if (isLight) {
          r = Math.min(255, Math.max(215, r));
          g = Math.min(255, Math.max(230, g));
          b = Math.min(255, Math.max(230, b));
        } else {
          r = Math.min(255, Math.max(8, r));
          g = Math.min(255, Math.max(10, g));
          b = Math.min(255, Math.max(14, b));
        }

        frameBuffer[ptr++] = Math.round(r);
        frameBuffer[ptr++] = Math.round(g);
        frameBuffer[ptr++] = Math.round(b);
      }
    }

    await writeBuffer(ffmpeg.stdin, frameBuffer);
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Successfully generated ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });
  });
}

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const darkVideo = path.join(publicDir, 'haven_bg_dark.mp4');
  const lightVideo = path.join(publicDir, 'haven_bg_light.mp4');

  await generateSeamlessLoopVideo(darkVideo, false);
  await generateSeamlessLoopVideo(lightVideo, true);

  console.log('All seamless loop videos generated successfully with 0 seam cut!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
