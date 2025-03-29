/**
 * @internal
 */
export const hexFromBytes = (bytes: Uint8Array, reverse = false) => {
  let hex = [];
  
  for (let i = 0; i < bytes.length; i++)
    hex.push(bytes[i].toString(16).padStart(2, '0'));

  if (reverse)
    hex.reverse();
  
  return hex.join('').toUpperCase();
};

/**
 * @internal
 */
export const hexToBytes = (hex: string, reverse = false) => {
  const hexSize = hex.length;
  const bytes = new Uint8Array(hexSize / 2);

  for (let i = 0, j = 0; i < hexSize; i += 2)
    bytes[j++] = parseInt(hex.slice(i, i + 2), 16);

  if (reverse)
    bytes.reverse();

  return bytes;
};