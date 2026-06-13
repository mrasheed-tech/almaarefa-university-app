/**
 * Leaked-password protection via the HaveIBeenPwned Pwned Passwords API.
 *
 * Supabase's built-in leaked-password protection is a Pro-plan feature, so we
 * replicate it here for free. We use the same data source HIBP, the same one
 * Supabase Auth uses) with k-anonymity: only the first 5 characters of the
 * password's SHA-1 hash ever leave the device. The full password and full hash
 * are never transmitted.
 *
 * No native crypto dependency: SHA-1 is implemented in pure JS so this works on
 * web, native, and Expo Go without a rebuild. Passwords are short, so the cost
 * is negligible.
 */

const HIBP_RANGE_URL = 'https://api.pwnedpasswords.com/range';

/** UTF-8 encode a string into a byte array (handles Arabic + emoji/surrogates). */
function utf8Bytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i);
    if (c < 0x80) {
      bytes.push(c);
    } else if (c < 0x800) {
      bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    } else if (c >= 0xd800 && c <= 0xdbff) {
      // High surrogate paired with the following low surrogate.
      const c2 = str.charCodeAt(++i);
      c = 0x10000 + ((c & 0x3ff) << 10) + (c2 & 0x3ff);
      bytes.push(
        0xf0 | (c >> 18),
        0x80 | ((c >> 12) & 0x3f),
        0x80 | ((c >> 6) & 0x3f),
        0x80 | (c & 0x3f),
      );
    } else {
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    }
  }
  return bytes;
}

/** SHA-1 of a byte array, returned as an uppercase hex string (HIBP's format). */
function sha1Hex(bytes: number[]): string {
  const msg = bytes.slice();
  const bitLen = msg.length * 8;

  // Padding: append 0x80, then zeros until length ≡ 56 (mod 64).
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  // 64-bit big-endian message length (passwords are short, so high bytes are 0).
  for (let i = 7; i >= 0; i--) msg.push(Math.floor(bitLen / 2 ** (i * 8)) & 0xff);

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Array<number>(80);
  for (let chunk = 0; chunk < msg.length; chunk += 64) {
    for (let i = 0; i < 16; i++) {
      const j = chunk + i * 4;
      w[i] = ((msg[j] << 24) | (msg[j + 1] << 16) | (msg[j + 2] << 8) | msg[j + 3]) | 0;
    }
    for (let i = 16; i < 80; i++) {
      const v = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
      w[i] = (v << 1) | (v >>> 31);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    for (let i = 0; i < 80; i++) {
      let f: number;
      let k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const tmp = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0;
      e = d;
      d = c;
      c = (b << 30) | (b >>> 2);
      b = a;
      a = tmp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  const hex = (n: number) => (n >>> 0).toString(16).padStart(8, '0');
  return (hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4)).toUpperCase();
}

/** SHA-1 hex of a UTF-8 string. Exported for tests. */
export function sha1(input: string): string {
  return sha1Hex(utf8Bytes(input));
}

/**
 * Returns how many times the password appears in known breaches (0 = clean,
 * any positive number = leaked). Fails open: on a network/parse error it
 * returns 0 so a HIBP outage can never lock a user out of changing their
 * password — the same trade-off Supabase Auth makes.
 */
export async function checkPwnedPassword(password: string): Promise<number> {
  try {
    const hash = sha1(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    const res = await fetch(`${HIBP_RANGE_URL}/${prefix}`, {
      // Add-Padding pads the response with decoy hashes so the requested
      // prefix can't be inferred from the response size.
      headers: { 'Add-Padding': 'true' },
    });
    if (!res.ok) return 0;

    const body = await res.text();
    for (const line of body.split('\n')) {
      const idx = line.indexOf(':');
      if (idx === -1) continue;
      if (line.slice(0, idx).trim().toUpperCase() === suffix) {
        return parseInt(line.slice(idx + 1).trim(), 10) || 0;
      }
    }
    return 0;
  } catch {
    return 0;
  }
}
