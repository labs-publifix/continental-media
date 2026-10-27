#!/usr/bin/env node
/**
 * Continental Media — verification script for the SEO migration
 * (LEEME §7.4). Spins up a tiny in-process HTTP server that mimics
 * GitHub Pages' real static-hosting behavior (serve <path>/index.html
 * when it exists, else serve 404.html with a real 404 status — no
 * other local static server replicates the 404 part faithfully), then
 * checks, for every row of the lista corta:
 *   - the stub route responds 200
 *   - its <meta http-equiv="refresh"> is exactly "0; url=..."
 *   - that url (resolved) and the <link rel="canonical"> both match
 *     the live-resolved destination exactly (see migracion-redirects.mjs —
 *     same resolver the generator itself uses, so this never drifts)
 *   - the destination itself is not another stub (zero chains)
 * Then: the 2 conserved (ruta_heredada) routes respond 200 with real
 * content (not a stub) — reported as PENDING, not FAIL, if not yet
 * authorized/published; and a sample of discarded legacy URLs returns
 * a real 404 with the branded 404 page's body.
 *
 * Usage:
 *   node scripts/migracion/probar-redirects.mjs
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, extname } from 'node:path';

import { resolveAllRedirects, SITE_URL } from '../lib/migracion-redirects.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PUBLIC_DIR = join(REPO_ROOT, 'public');
const PORT = 8911;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.xml': 'application/xml',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

// A sample of real discarded legacy URLs (Plan_Transición's Mapa
// maestro, rows NOT flagged for the lista corta) — confirms the
// reduced plan's "everything else 404s real" rule on actual rows from
// the plan, not invented paths.
const DISCARDED_SAMPLE = [
  '/404-page/',
  '/elementor-3504/',
  '/homepage-revolution/',
  '/pagina-inicial/',
  '/testing-1/',
  '/2012/08/creative-interior-design/',
  '/2012/08/marketing-olfativo/',
];

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = join(PUBLIC_DIR, urlPath);
    if (urlPath.endsWith('/') || !extname(urlPath)) {
      filePath = join(filePath, 'index.html');
    }
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
      return;
    }
    // GitHub Pages behavior: any unmatched path serves the root
    // 404.html with a real 404 status.
    const body = existsSync(join(PUBLIC_DIR, '404.html')) ? readFileSync(join(PUBLIC_DIR, '404.html')) : '<h1>404</h1>';
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  });
  return new Promise((res) => server.listen(PORT, () => res(server)));
}

async function get(path) {
  const r = await fetch(`http://localhost:${PORT}${path}`);
  const text = await r.text();
  return { status: r.status, text };
}

function extractMetaRefresh(html) {
  const m = html.match(/<meta http-equiv="refresh" content="(\d+);\s*url=([^"]+)"/);
  return m ? { seconds: Number(m[1]), url: m[2] } : null;
}

function extractCanonical(html) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  return m ? m[1] : null;
}

function isStub(html) {
  return /<meta http-equiv="refresh"/.test(html);
}

async function main() {
  console.log('Starting local test server (mimics GitHub Pages: real 404.html on any miss)...\n');
  const server = await startServer();

  let pass = 0;
  let fail = 0;
  const failures = [];

  function check(label, ok, detail) {
    if (ok) {
      pass++;
    } else {
      fail++;
      failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
    }
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${label}`);
  }

  // ---------- 1. Every 301 row: stub, meta refresh, canonical, no chains ----------
  console.log('--- Lista corta: 301 rows (stub pages) ---');
  const redirects = resolveAllRedirects();
  const redirectRows = redirects.filter((r) => !r.resolved.conserved);

  for (const row of redirectRows) {
    const { status, text } = await get(row.ruta_origen);
    const label = row.ruta_origen;

    if (status !== 200) {
      check(label, false, `expected 200 (stub), got ${status}`);
      continue;
    }

    const refresh = extractMetaRefresh(text);
    const canonical = extractCanonical(text);
    const expectedAbsolute = `${SITE_URL}${row.resolved.path}`;

    if (!refresh) {
      check(label, false, 'no meta refresh tag found');
      continue;
    }
    if (refresh.seconds !== 0) {
      check(label, false, `meta refresh is ${refresh.seconds}s, expected 0`);
      continue;
    }
    // pathname + hash — a bare .pathname drops a '#contacto'-style
    // fragment, which several destinations (home-page anchors) rely on.
    const resolvedUrl = new URL(refresh.url, `http://localhost:${PORT}${row.ruta_origen}`);
    const resolvedRefreshPath = `${resolvedUrl.pathname}${resolvedUrl.hash}`;
    if (resolvedRefreshPath !== row.resolved.path) {
      check(label, false, `meta refresh resolves to ${resolvedRefreshPath}, expected ${row.resolved.path}`);
      continue;
    }
    if (canonical !== expectedAbsolute) {
      check(label, false, `canonical is ${canonical}, expected ${expectedAbsolute}`);
      continue;
    }

    // no chains: the destination itself must not be another stub
    const dest = await get(row.resolved.path);
    if (dest.status !== 200) {
      check(label, false, `destination ${row.resolved.path} did not respond 200 (got ${dest.status}) — target not published yet?`);
      continue;
    }
    if (isStub(dest.text)) {
      check(label, false, `destination ${row.resolved.path} is itself another redirect stub — chain!`);
      continue;
    }

    check(label, true);
  }

  // ---------- 2. Conserved (ruta_heredada) routes ----------
  console.log('\n--- Conservadas (ruta_heredada, sin redirect) ---');
  const conservedRows = redirects.filter((r) => r.resolved.conserved);
  for (const row of conservedRows) {
    const { status, text } = await get(row.ruta_origen);
    if (status === 404) {
      console.log(`PEND ${row.ruta_origen} — not published yet (expected 404 until authorized)`);
    } else if (status === 200 && !isStub(text)) {
      check(row.ruta_origen, true);
    } else if (status === 200 && isStub(text)) {
      check(row.ruta_origen, false, 'responded 200 but as a redirect stub, not real content');
    } else {
      check(row.ruta_origen, false, `unexpected status ${status}`);
    }
  }

  // ---------- 3. Discarded URLs -> real 404 ----------
  console.log('\n--- Muestra de URLs descartadas (deben dar 404 real) ---');
  for (const path of DISCARDED_SAMPLE) {
    const { status, text } = await get(path);
    const hasBrandedBody = /Esta página ya no existe/.test(text);
    check(path, status === 404 && hasBrandedBody, status !== 404 ? `got ${status}, expected 404` : 'got 404 but not the branded 404 body');
  }

  server.close();

  console.log(`\n${pass} passed, ${fail} failed.`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exitCode = 1;
  }
}

main();
