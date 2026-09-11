// PWA アイコン（PNG）を依存ライブラリなしで生成する
// usage: node scripts/gen-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public');

// 16x16 ピクセルアート：0=navy 1=yellow 2=black 3=red
const ART = [
  '0000000000000000',
  '0111111111111110',
  '0100000000000010',
  '0100110000110010',
  '0100112000112010',
  '0100112000112010',
  '0100111111112010',
  '0100111111112010',
  '0100112222112010',
  '0100112000112010',
  '0100112000112010',
  '0100112000112010',
  '0100022000022010',
  '0100000000000010',
  '0111111111111110',
  '0000000000000000',
];
const PALETTE = {
  0: [0x0b, 0x10, 0x30],
  1: [0xff, 0xd9, 0x3d],
  2: [0x05, 0x06, 0x14],
  3: [0xff, 0x3b, 0x5c],
};

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

function renderPng(size) {
  const raw = Buffer.alloc((size * 3 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter: none
    const gy = Math.floor((y * ART.length) / size);
    for (let x = 0; x < size; x++) {
      const gx = Math.floor((x * ART[0].length) / size);
      const [r, g, b] = PALETTE[ART[gy][gx]];
      const o = y * (size * 3 + 1) + 1 + x * 3;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync(OUT, { recursive: true });
for (const [name, size] of [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
]) {
  writeFileSync(join(OUT, name), renderPng(size));
  console.log('wrote', name);
}
