import { isBrowser, isWebWorker, isNode, dynamicRequire, getGlobalObject } from './env';

/**
 * Extended Window interface that allows for Crypto API usage in IE browsers
 * @internal
 */
interface MsCryptoWindow extends Window {
  msCrypto?: Crypto;
};

/**
 * same SubtleCrypto API is available in browser and node, but in node it isn't global
 * @internal
 */
const SUBTLE_CRYPTO = ((): SubtleCrypto => {
  if (isBrowser || isWebWorker) {
    const global = getGlobalObject() as MsCryptoWindow;
    return (global.crypto || global.msCrypto).subtle;
  }
  else if (isNode)
    return dynamicRequire(module, 'crypto').webcrypto.subtle;
})();

/**
 * crypto algo used
 * @internal
 */
const ALGORITHM = 'RSASSA-PKCS1-v1_5';

/**
 * @internal
 */
type HashType = 'SHA-1' | 'SHA-256'; // also available are 'SHA-384' and 'SHA-512', but flipnote doesnt use them...

/**
 * @internal
 */
export async function rsaLoadPublicKey(pemKey: string, hashType: HashType) {
  // remove PEM header and footer
  const lines = pemKey
    .split('\n')
    .filter(line => !line.startsWith('-----') && !line.endsWith('-----'))
    .join('');
  // base64 decode
  const keyPlaintext = atob(lines);
  // convert to byte array
  const keyBytes = new Uint8Array(keyPlaintext.length)
    .map((_, i) => keyPlaintext.charCodeAt(i));
  // create crypto api key
  return await SUBTLE_CRYPTO.importKey('spki', keyBytes.buffer, {
    name: ALGORITHM,
    hash: hashType,
  }, false, ['verify']);
}
 
/**
 * @internal
 */
export async function rsaVerify(key: CryptoKey, signature: Uint8Array, data: Uint8Array) {
  return await SUBTLE_CRYPTO.verify(ALGORITHM, key, signature, data);
}