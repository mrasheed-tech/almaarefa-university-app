/**
 * Builds assets/icon.png — the iOS/Android home-screen icon — by taking the
 * white university wordmark already composited on teal in adaptive-icon.png,
 * detecting its bounding box, and recentering it on a fresh 1024x1024 teal
 * canvas. iOS shows the icon unmasked, so a centered mark looks best.
 *
 * Pure Node (zlib only) — no native image libs required.
 * Run:  node scripts/gen-icon.js
 */
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const TEAL = [0x00, 0xad, 0xca];
const SRC = path.join(__dirname, '..', 'assets', 'adaptive-icon.png');
const OUT_ICON = path.join(__dirname, '..', 'assets', 'icon.png');

/* ----------------------------- PNG helpers ------------------------------ */
const CRC_TABLE = (() => {
  const t = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

/** Decode an 8-bit, non-interlaced, RGBA (color type 6) PNG into {w,h,px}. */
function decodeRGBA(buf) {
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  if (buf[24] !== 8 || buf[25] !== 6) throw new Error('expected 8-bit RGBA PNG');

  // Gather IDAT
  const idat = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    if (type === 'IDAT') idat.push(buf.subarray(off + 8, off + 8 + len));
    off += 12 + len;
    if (type === 'IEND') break;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));

  const bpp = 4;
  const rowLen = w * bpp;
  const px = Buffer.alloc(w * h * bpp);
  let prev = Buffer.alloc(rowLen);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    const row = raw.subarray(p, p + rowLen);
    p += rowLen;
    const out = Buffer.alloc(rowLen);
    for (let i = 0; i < rowLen; i++) {
      const a = i >= bpp ? out[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let val = row[i];
      switch (filter) {
        case 1: val += a; break;
        case 2: val += b; break;
        case 3: val += (a + b) >> 1; break;
        case 4: {
          const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c);
          val += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
      }
      out[i] = val & 0xff;
    }
    out.copy(px, y * rowLen);
    prev = out;
  }
  return { w, h, px };
}

/** Encode an RGBA pixel buffer back into a PNG. */
function encodeRGBA(w, h, px) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const rowLen = w * 4 + 1;
  const raw = Buffer.alloc(rowLen * h);
  for (let y = 0; y < h; y++) {
    raw[y * rowLen] = 0; // filter none
    px.copy(raw, y * rowLen + 1, y * w * 4, (y + 1) * w * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

/* ------------------------------- compose -------------------------------- */
const { w, h, px } = decodeRGBA(fs.readFileSync(SRC));

// A pixel is "logo" if it's noticeably brighter than the teal background.
const isLogo = (i) => {
  const r = px[i], g = px[i + 1], b = px[i + 2];
  return Math.abs(r - TEAL[0]) + Math.abs(g - TEAL[1]) + Math.abs(b - TEAL[2]) > 60;
};

// Detect the column split between the book symbol and the text label.
// We scan column density from left; the first sustained gap after x=300
// marks where the text begins. We use only the book portion for the icon.
function findBookRight(scanW, scanH, fullW) {
  for (let x = scanW; x > 200; x--) {
    let col = 0;
    for (let y = 0; y < scanH; y++) col += isLogo((y * fullW + x) * 4) ? 1 : 0;
    if (col > 5) return x; // rightmost column with meaningful density
  }
  return Math.round(scanW * 0.4); // fallback
}

// First find full logo bounds.
let minX = w, minY = h, maxX = 0, maxY = 0, found = false;
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    if (isLogo((y * w + x) * 4)) {
      found = true;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
if (!found) throw new Error('could not locate logo in source');

// Scan for the gap that separates book icon (~left 40%) from Arabic/English text.
// We look for a vertical strip with near-zero density between x=300 and x=500.
let bookMaxX = maxX;
for (let x = minX + Math.round((maxX - minX) * 0.25); x < minX + Math.round((maxX - minX) * 0.6); x++) {
  let col = 0;
  for (let y = minY; y <= maxY; y++) col += isLogo((y * w + x) * 4) ? 1 : 0;
  if (col === 0) { bookMaxX = x - 1; break; }
}

const logoW = bookMaxX - minX + 1;
const logoH = maxY - minY + 1;
console.log(`Book symbol: x=${minX}..${bookMaxX} (${logoW}px wide), y=${minY}..${maxY} (${logoH}px tall)`);

// Scale the book up to fill ~65% of the canvas width.
const TARGET_FILL = 0.65;
const scale = (w * TARGET_FILL) / logoW;
const scaledW = Math.round(logoW * scale);
const scaledH = Math.round(logoH * scale);

// Bilinear scale: for each destination pixel find the source position.
const scaled = Buffer.alloc(scaledW * scaledH * 4);
for (let dy = 0; dy < scaledH; dy++) {
  for (let dx = 0; dx < scaledW; dx++) {
    const sx = dx / scale;
    const sy = dy / scale;
    const sx0 = Math.floor(sx), sy0 = Math.floor(sy);
    const sx1 = Math.min(sx0 + 1, logoW - 1), sy1 = Math.min(sy0 + 1, logoH - 1);
    const fx = sx - sx0, fy = sy - sy0;
    const si00 = ((minY + sy0) * w + (minX + sx0)) * 4;
    const si10 = ((minY + sy0) * w + (minX + sx1)) * 4;
    const si01 = ((minY + sy1) * w + (minX + sx0)) * 4;
    const si11 = ((minY + sy1) * w + (minX + sx1)) * 4;
    const di = (dy * scaledW + dx) * 4;
    for (let c = 0; c < 4; c++) {
      scaled[di + c] = Math.round(
        px[si00 + c] * (1 - fx) * (1 - fy) +
        px[si10 + c] * fx * (1 - fy) +
        px[si01 + c] * (1 - fx) * fy +
        px[si11 + c] * fx * fy
      );
    }
  }
}

// Fresh teal canvas, scaled book centred.
const out = Buffer.alloc(w * h * 4);
for (let i = 0; i < w * h; i++) {
  out[i * 4] = TEAL[0];
  out[i * 4 + 1] = TEAL[1];
  out[i * 4 + 2] = TEAL[2];
  out[i * 4 + 3] = 255;
}
const destX = Math.round((w - scaledW) / 2);
const destY = Math.round((h - scaledH) / 2);
for (let dy = 0; dy < scaledH; dy++) {
  for (let dx = 0; dx < scaledW; dx++) {
    const si = (dy * scaledW + dx) * 4;
    // Skip pixels that are close to the teal background (not part of the book).
    const r = scaled[si], g = scaled[si + 1], b = scaled[si + 2];
    if (Math.abs(r - TEAL[0]) + Math.abs(g - TEAL[1]) + Math.abs(b - TEAL[2]) <= 60) continue;
    const di = ((destY + dy) * w + (destX + dx)) * 4;
    out[di] = r;
    out[di + 1] = g;
    out[di + 2] = b;
    out[di + 3] = 255;
  }
}

fs.writeFileSync(OUT_ICON, encodeRGBA(w, h, out));
console.log(`Wrote assets/icon.png — book scaled ${scaledW}x${scaledH} (${Math.round(scale * 100)}%) centred on ${w}x${h} teal.`);
