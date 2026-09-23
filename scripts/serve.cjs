// Local preview with the extensionless .html URLs served by GitHub Pages.
const { createServer } = require("node:http");
const { readFileSync, statSync } = require("node:fs");
const { resolve, extname, sep } = require("node:path");
const root = resolve(__dirname, "..");
const types = { ".html": "text/html", ".txt": "text/plain", ".xml": "application/xml", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png" };
createServer((req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let file = resolve(root, `.${path === "/" ? "/index.html" : path}`);
    if (!file.startsWith(root + sep)) throw new Error("Invalid path");
    if (!extname(file)) file += ".html";
    if (!statSync(file).isFile()) throw new Error("Not a file");
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}).listen(8000, "127.0.0.1", () => console.log("Preview: http://127.0.0.1:8000"));
