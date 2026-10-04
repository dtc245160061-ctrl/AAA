import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

import { spawn } from 'child_process';
import http from 'http';

function checkAndStartOllama() {
  const req = http.get('http://127.0.0.1:11434/api/tags', (res) => {
    // Ollama is already running
  });
  req.on('error', () => {
    console.log('[HAVEN AI] Dang tu dong kich hoat Local Ollama daemon...');
    const ollamaProcess = spawn('ollama', ['serve'], {
      detached: true,
      stdio: 'ignore',
      env: { ...process.env, OLLAMA_ORIGINS: '*' }
    });
    ollamaProcess.unref();
  });
  req.setTimeout(1000, () => req.abort());
}

async function run() {
  checkAndStartOllama();
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
