import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const leer = ruta => readFileSync(new URL(`../${ruta}`, import.meta.url), 'utf8');

test('la imagen trae healthcheck contra /salud', () => {
  const dockerfile = leer('docker/Dockerfile');
  assert.match(dockerfile, /HEALTHCHECK[\s\S]*wget[^\n]*http:\/\/127\.0\.0\.1\/salud/);
});

test('nginx responde /salud sin pasar por la app', () => {
  const nginx = leer('docker/nginx.conf');
  const bloque = nginx.match(/location = \/salud \{([^}]*)\}/);
  assert.ok(bloque, 'falta location = /salud');
  assert.match(bloque[1], /return 200/);
  assert.match(bloque[1], /access_log off/);
});

test('/salud va antes del fallback de la SPA', () => {
  const nginx = leer('docker/nginx.conf');
  assert.ok(nginx.indexOf('location = /salud') < nginx.indexOf('location / {'));
});
