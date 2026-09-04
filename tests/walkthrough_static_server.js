/* BFS218 isolated walkthrough server: production static bytes, loopback only. */
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const net = require('net');
const dns = require('dns');

const root = path.resolve(process.env.BFS218_APP_ROOT || '');
const isolatedRoot = path.resolve(process.env.BFS218_ISOLATED_ROOT || '');
const expectedPrefix = path.resolve(process.env.BFS218_EXPECTED_ISOLATION_PARENT || '');

if (!root || !fs.statSync(root).isDirectory()) throw new Error('BFS218_APP_ROOT must be an existing directory.');
if (!isolatedRoot || !expectedPrefix || !isolatedRoot.startsWith(expectedPrefix + path.sep)) {
  throw new Error('The isolated walkthrough data root assertion failed.');
}

const mime = {
  '.css': 'text/css; charset=utf-8', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.gif': 'image/gif', '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4',
  '.pdf': 'application/pdf', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function resolveRequest(url) {
  const requestPath = decodeURIComponent(String(url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) return null;
  return target;
}

const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
  const target = resolveRequest(request.url);
  if (!target) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.stat(target, (statError, stat) => {
    if (statError || !stat.isFile()) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, {
      'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store, max-age=0',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    if (request.method === 'HEAD') { response.end(); return; }
    fs.createReadStream(target).pipe(response);
  });
});

server.listen(0, '127.0.0.1', () => {
  const address = server.address();
  process.stdout.write(JSON.stringify({
    type: 'ready', host: address.address, port: address.port,
    endpoint: `http://${address.address}:${address.port}/`, dataRootAsserted: true
  }) + '\n');

  /* The server has finished its only socket creation. Fail closed on any outbound attempt. */
  const reject = (name) => function () { throw new Error(`Backend egress denied: ${name}`); };
  net.connect = reject('net.connect');
  net.createConnection = reject('net.createConnection');
  dns.lookup = reject('dns.lookup');
  if (typeof global.fetch === 'function') global.fetch = reject('fetch');
});

function stop() { server.close(() => process.exit(0)); }
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
