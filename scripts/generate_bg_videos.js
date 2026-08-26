import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// 960x540 rendered at 60fps and upscaled by FFmpeg to 1080p with bicubic filtering
// Produces silky smooth, artifact-free, 60 FPS video in ~8 seconds
const WIDTH = 960;
const HEIGHT = 540;
const FPS = 60;
const DURATION_SEC = 6;
const TOTAL_FRAMES = FPS * DURATION_SEC; // 360 frames

const DARK_COLORS = {
  bg: [10, 12, 16],
  color1: [10, 12, 16],   // #0A0C10
  color2: [3, 105, 161],  // #0369A1
  color3: [4, 120, 87]    // #047857
};

const LIGHT_COLORS = {
  bg: [247, 249, 248],    // #F7F9F8
  color1: [186, 230, 253], // #BAE6FD
  color2: [167, 243, 208], // #A7F3D0
  color3: [247, 249, 248]
};

function generateVideo(outputPath, isLight = false) {
  return new Promise((resolve, reject) => {
    console.log(`Generating ${outputPath}...`);

    const ffmpeg = spawn('ffmpeg', [
      '-y',
      '-f', 'rawvideo',
      '-pix_fmt', 'rgb24',
      '-s', `${WIDTH}x${HEIGHT}`,
      '-r', `${FPS}`,
      '-i', '-',
      '-vf', 'scale=1920:1080:flags=bicubic',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '19',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      outputPath
    ]);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        console.log(`Finished ${outputPath}`);
        resolve();
      } else {
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    ffmpeg.stderr.on('data', () => {}); // consume output

    const palette = isLight ? LIGHT_COLORS : DARK_COLORS;
    const frameBuffer = Buffer.allocUnsafe(WIDTH * HEIGHT * 3);

    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const t = f / TOTAL_FRAMES;
      const angle = t * 2 * Math.PI;
      const sinT = Math.sin(angle);
      const cosT = Math.cos(angle);

      const cx1 = 0.30 + 0.25 * cosT;
      const cy1 = 0.35 + 0.20 * sinT;

      const cx2 = 0.70 - 0.25 * sinT;
      const cy2 = 0.65 + 0.22 * cosT;

      const cx3 = 0.50 + 0.20 * Math.sin(angle * 2);
      const cy3 = 0.50 + 0.18 * Math.cos(angle * 2);

      let ptr = 0;

      for (let y = 0; y < HEIGHT; y++) {
        const ny = y / HEIGHT;
        for (let x = 0; x < WIDTH; x++) {
          const nx = x / WIDTH;

          const dx1 = nx - cx1;
          const dy1 = ny - cy1;
          const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1 * 1.5);

          const dx2 = nx - cx2;
          const dy2 = ny - cy2;
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2 * 1.3);

          const dx3 = nx - cx3;
          const dy3 = ny - cy3;
          const d3 = Math.sqrt(dx3 * dx3 + dy3 * dy3 * 1.8);

          // Flowing fluid sine wave field
          const wave1 = Math.sin(d1 * 4.5 - angle + ny * 2.0) * 0.5 + 0.5;
          const wave2 = Math.cos(d2 * 5.0 + angle - nx * 2.2) * 0.5 + 0.5;
          const wave3 = Math.sin(d3 * 4.0 + angle * 1.2) * 0.5 + 0.5;

          const w2 = Math.pow(wave1 * Math.max(0, 1.0 - d1 * 0.85), 1.2);
          const w3 = Math.pow(wave2 * Math.max(0, 1.0 - d2 * 0.80), 1.2);
          const w1 = Math.max(0, 1.0 - w2 - w3);

          let r = palette.color1[0] * w1 + palette.color2[0] * w2 + palette.color3[0] * w3;
          let g = palette.color1[1] * w1 + palette.color2[1] * w2 + palette.color3[1] * w3;
          let b = palette.color1[2] * w1 + palette.color2[2] * w2 + palette.color3[2] * w3;

          if (isLight) {
            r = Math.min(255, Math.max(210, r));
            g = Math.min(255, Math.max(225, g));
            b = Math.min(255, Math.max(225, b));
          } else {
            r = Math.min(255, Math.max(0, r));
            g = Math.min(255, Math.max(0, g));
            b = Math.min(255, Math.max(0, b));
          }

          frameBuffer[ptr++] = Math.round(r);
          frameBuffer[ptr++] = Math.round(g);
          frameBuffer[ptr++] = Math.round(b);
        }
      }

      ffmpeg.stdin.write(frameBuffer);
    }

    ffmpeg.stdin.end();
  });
}

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const darkVideo = path.join(publicDir, 'haven_bg_dark.mp4');
  const lightVideo = path.join(publicDir, 'haven_bg_light.mp4');

  await generateVideo(darkVideo, false);
  await generateVideo(lightVideo, true);

  console.log('Video generation complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
