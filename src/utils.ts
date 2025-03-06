/**
 * Decode an "ASCII"-encoded string, which means each code unit in the string
 * should be 0-255 and represent a single byte at this point.
 *
 * @param str ASCII-encoded string.
 * @returns Uint8Array of corresponding bytes.
 */
export function asciiToUint8Array(str: string): Uint8Array {
  return Uint8Array.from(str, (cu, i) => {
    const cp = cu.codePointAt(0);
    if (cp > 255) {
      throw new Error(`Invalid ASCII-encoded string at code unit ${i}: ${cp} "${cu}"`);
    }
    return cp;
  });
}
