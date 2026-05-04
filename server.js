const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const mimeTypes = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.json': 'application/json',
  '.md':   'text/markdown; charset=utf-8',
  '.mp3':  'audio/mpeg',
  '.mp4':  'video/mp4',
};
const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0].split('#')[0]);
  } catch {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }
  const route = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const filePath = path.resolve(dir, route);
  if (filePath !== dir && !filePath.startsWith(dir + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  let ext = path.extname(filePath).toLowerCase();
  const readablePath = ext ? filePath : filePath + '.html';
  if (!ext) ext = '.html';
  fs.readFile(readablePath, (err, data) => {
    if (err) {
      fs.readFile(path.join(dir, '404.html'), (e2, body) => {
        if (e2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(body);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});
const port = Number(process.env.PORT) || 8000;
server.listen(port, () => console.log('Listening on ' + port));
