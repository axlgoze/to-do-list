// jest.setup.js
// JSDOM no siempre incluye crypto por defecto, así lo aseguramos:
if (!global.crypto) {
  global.crypto = require('node:crypto').webcrypto;
}