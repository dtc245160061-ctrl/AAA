import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function run() {
  try {
    const server = await createServer({
      root: rootDir,
      configFile: path.join(rootDir, 'vite.config.ts'),
      server: {
        port: 5173,
        host: true,
      },
    });

    await server.listen();
    console.log(`[HAVEN] Server is running at http://localhost:5173/`);

    // Prevent event loop from exiting
    setInterval(() => {}, 60000);
  } catch (err) {
    console.error('[HAVEN Error]', err);
    process.exit(1);
  }
}

run();
