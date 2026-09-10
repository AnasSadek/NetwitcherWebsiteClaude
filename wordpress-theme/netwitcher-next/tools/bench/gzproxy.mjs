/**
 * Tiny reverse proxy that adds gzip + cache headers in front of PHP's built-in
 * server (which sends neither). Stands in for what any real WordPress host
 * (nginx/Apache with gzip or brotli) does. 8081 → 8080.
 */
import http from "node:http";
import zlib from "node:zlib";
const TEXT = /^(text\/|application\/(javascript|json|xml|ld\+json)|image\/svg)/;
http.createServer((req, res) => {
  const up = http.request({ host: "127.0.0.1", port: 8080, path: req.url, method: req.method, headers: { ...req.headers, host: "127.0.0.1:8080", "accept-encoding": "identity" } }, (u) => {
    const headers = { ...u.headers };
    const ct = headers["content-type"] || "";
    const isAsset = /\/wp-content\/themes\//.test(req.url);
    if (isAsset) headers["cache-control"] = "public, max-age=31536000, immutable";
    const wantGzip = /gzip/.test(req.headers["accept-encoding"] || "") && TEXT.test(ct);
    if (TEXT.test(ct)) {
      // rewrite absolute self-links so every sub-resource also goes through the proxy
      const chunks = [];
      u.on("data", (c) => chunks.push(c));
      u.on("end", () => {
        let body = Buffer.concat(chunks).toString("utf8").replaceAll("127.0.0.1:8080", "127.0.0.1:8081");
        delete headers["content-length"];
        if (wantGzip) { headers["content-encoding"] = "gzip"; headers["vary"] = "Accept-Encoding"; body = zlib.gzipSync(body, { level: 6 }); }
        headers["content-length"] = Buffer.byteLength(body);
        res.writeHead(u.statusCode, headers);
        res.end(body);
      });
    } else {
      res.writeHead(u.statusCode, headers);
      u.pipe(res);
    }
  });
  up.on("error", () => { res.writeHead(502); res.end("upstream down"); });
  req.pipe(up);
}).listen(8081, "127.0.0.1", () => console.log("gzproxy 8081 → 8080"));
