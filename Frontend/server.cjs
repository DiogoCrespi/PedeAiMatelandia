const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const root = path.resolve('dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.map': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  let filePath = path.join('dist', decodeURIComponent(req.url.split('?')[0]));
  // Garante que / ou /index.html sempre sirva o index.html
  if (req.url === '/' || req.url === '/index.html') filePath = path.join('dist', 'index.html');

  // Previne acesso a arquivos fora da pasta dist
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 Forbidden</h1>', 'utf-8');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      // Serve o arquivo normalmente
      const extname = String(path.extname(filePath)).toLowerCase();
      const contentType = mimeTypes[extname] || 'application/octet-stream';
      fs.readFile(filePath, (error, content) => {
        if (error) {
          console.error('Erro ao ler arquivo:', filePath, error);
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(content, 'utf-8');
        }
      });
    } else {
      // Se não for arquivo, redireciona para dist/index.html (SPA)
      const indexPath = path.join('dist', 'index.html');
      fs.readFile(indexPath, (error, content) => {
        if (error) {
          console.error('Erro ao ler index.html:', indexPath, error);
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        }
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}); 