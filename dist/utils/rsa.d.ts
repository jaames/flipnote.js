/**
 * @internal
 */
declare type HashType = 'SHA-1' | 'SHA-256';
/**
 * @internal
 */
export declare function rsaLoadPublicKey(pemKey: string, hashType: HashType): Promise<CryptoKey>;
/**
 * @internal
 */
export declare function rsaVerify(key: CryptoKey, signature: Uint8Array, data: Uint8Array): Promise<boolean>;
export {};
