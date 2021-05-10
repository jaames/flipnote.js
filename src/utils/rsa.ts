import { assertBrowserEnv } from './env';

/**
 * @internal
 */
 type HashType = 'SHA-1' | 'SHA-256' | 'SHA-512';

 /**
  * @internal
  */
export async function rsaLoadPublicKey(pemKey: string, hashType: HashType) {
  assertBrowserEnv();
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
  // create cypto api key
  return await crypto.subtle.importKey('spki', keyBytes.buffer, {
    name: 'RSASSA-PKCS1-v1_5',
    hash: hashType,
  }, false, ['verify']);
}
 
 /**
  * @internal
  */
export async function rsaVerify(key: CryptoKey, signature: Uint8Array, data: Uint8Array) {
  assertBrowserEnv();
  return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
}