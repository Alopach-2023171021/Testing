// k6-test.js
// Pruebas de Carga - fast-api-dev
// Alondra Itzel Pacheco de Jesus - 2023171021

import http from 'k6/http';
import { check, sleep } from 'k6';
import { group } from 'k6';

export const options = {
  stages: [
    { target: 20, duration: '1m' },   // Rampa: sube a 20 usuarios en 1 minuto
    { target: 20, duration: '3m30s' }, // Carga sostenida: 20 usuarios por 3.5 minutos
    { target: 0,  duration: '1m' },   // Bajada: reduce a 0 en 1 minuto
  ],
};

const BASE_URL = 'http://localhost:3000';

export default function () {

  // ── Vista 1: Health Check ──────────────────────────────────────────────────
  group('GET /health - Estado de la API', function () {
    const res = http.get(`${BASE_URL}/health`);

    check(res, {
      'health status 200': (r) => r.status === 200,
      'body tiene status OK': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.status === 'OK';
        } catch {
          return false;
        }
      },
      'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
  });

  // ── Vista 2: Inventario ────────────────────────────────────────────────────
  group('GET /items - Listado de Inventario', function () {
    const res = http.get(`${BASE_URL}/items`);

    check(res, {
      'items status 200': (r) => r.status === 200,
      'respuesta es un arreglo': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body);
        } catch {
          return false;
        }
      },
      'primer item tiene id y stock': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.length > 0 && 'id' in body[0] && 'stock' in body[0];
        } catch {
          return false;
        }
      },
      'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
  });

  // ── Vista 3: Usuarios ──────────────────────────────────────────────────────
  group('GET /users - Endpoint de Usuarios', function () {
    const res = http.get(`${BASE_URL}/users`);

    check(res, {
      'users status 200': (r) => r.status === 200,
      'tiempo de respuesta < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
  });
}