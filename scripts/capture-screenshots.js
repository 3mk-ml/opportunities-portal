/**
 * بوابة الفرص (Opportunities Portal) — Automated Headless Screenshot Capture
 * Script: scripts/capture-screenshots.js
 * Author: Agent D (Integration & Design Consistency)
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'docs', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.join(ROOT_DIR, reqPath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

function captureOne(target) {
  return new Promise((resolve) => {
    const outFile = path.join(OUTPUT_DIR, target.name);
    console.log(`Capturing ${target.name} (${target.width}x${target.height}, lang=${target.lang})...`);

    const args = [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-sync',
      '--disable-background-networking',
      '--disable-default-apps',
      '--no-first-run',
      '--hide-scrollbars',
      `--window-size=${target.width},${target.height}`,
      `--screenshot=${outFile}`,
      target.url
    ];

    const child = spawn(CHROME_PATH, args, { stdio: 'ignore' });

    child.on('exit', (code) => {
      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 0) {
        const kb = (fs.statSync(outFile).size / 1024).toFixed(1);
        console.log(`  ✔ Captured: ${target.name} (${kb} KB)`);
      } else {
        console.warn(`  ✖ Failed: ${target.name} (exit code ${code})`);
      }
      resolve();
    });

    child.on('error', (err) => {
      console.error(`  ✖ Spawn error on ${target.name}:`, err.message);
      resolve();
    });
  });
}

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Static test server running at http://127.0.0.1:${PORT}`);

  const targets = [
    // ─── INDEX PAGE ───
    {
      name: 'index-desktop-ar.png',
      url: `http://127.0.0.1:${PORT}/index.html?lang=ar`,
      width: 1280,
      height: 900,
      lang: 'ar'
    },
    {
      name: 'index-mobile-ar.png',
      url: `http://127.0.0.1:${PORT}/index.html?lang=ar`,
      width: 360,
      height: 740,
      lang: 'ar'
    },
    {
      name: 'index-desktop-en.png',
      url: `http://127.0.0.1:${PORT}/index.html?lang=en`,
      width: 1280,
      height: 900,
      lang: 'en'
    },
    {
      name: 'index-mobile-en.png',
      url: `http://127.0.0.1:${PORT}/index.html?lang=en`,
      width: 360,
      height: 740,
      lang: 'en'
    },

    // ─── DETAIL PAGE ───
    {
      name: 'detail-desktop-ar.png',
      url: `http://127.0.0.1:${PORT}/detail.html?id=oxford-weidenfeld-hoffmann-2027-2028&lang=ar`,
      width: 1280,
      height: 900,
      lang: 'ar'
    },
    {
      name: 'detail-mobile-ar.png',
      url: `http://127.0.0.1:${PORT}/detail.html?id=oxford-weidenfeld-hoffmann-2027-2028&lang=ar`,
      width: 360,
      height: 740,
      lang: 'ar'
    },
    {
      name: 'detail-desktop-en.png',
      url: `http://127.0.0.1:${PORT}/detail.html?id=oxford-weidenfeld-hoffmann-2027-2028&lang=en`,
      width: 1280,
      height: 900,
      lang: 'en'
    },
    {
      name: 'detail-mobile-en.png',
      url: `http://127.0.0.1:${PORT}/detail.html?id=oxford-weidenfeld-hoffmann-2027-2028&lang=en`,
      width: 360,
      height: 740,
      lang: 'en'
    },

    // ─── ABOUT PAGE ───
    {
      name: 'about-desktop-ar.png',
      url: `http://127.0.0.1:${PORT}/about.html?lang=ar`,
      width: 1280,
      height: 900,
      lang: 'ar'
    },
    {
      name: 'about-mobile-ar.png',
      url: `http://127.0.0.1:${PORT}/about.html?lang=ar`,
      width: 360,
      height: 740,
      lang: 'ar'
    },
    {
      name: 'about-desktop-en.png',
      url: `http://127.0.0.1:${PORT}/about.html?lang=en`,
      width: 1280,
      height: 900,
      lang: 'en'
    },
    {
      name: 'about-mobile-en.png',
      url: `http://127.0.0.1:${PORT}/about.html?lang=en`,
      width: 360,
      height: 740,
      lang: 'en'
    }
  ];

  for (const t of targets) {
    await captureOne(t);
  }

  server.close(() => {
    console.log('\nAll 12 screenshots captured successfully.');
    process.exit(0);
  });
});