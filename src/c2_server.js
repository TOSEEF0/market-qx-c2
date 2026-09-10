// Safe training server.
// It intentionally does NOT implement command-and-control, credential theft,
// persistence, or data exfiltration.

const http = require("http");

const HOST = "127.0.0.1";
const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({
    status: "ok",
    message: "Safe local security-training server",
    receivedPath: req.url
  }, null, 2));
});

server.listen(PORT, HOST, () => {
  console.log(`Safe demo server running at http://${HOST}:${PORT}`);
});
