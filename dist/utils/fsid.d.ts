/**
 * Flipnote region
 */
export declare enum FlipnoteRegion {
    /** Europe and Oceania */
    EUR = "EUR",
    /** Americas */
    USA = "USA",
    /** Japan */
    JPN = "JPN",
    /** Unidentified (possibly never used) */
    UNKNOWN = "UNKNOWN"
}
/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
export declare function isPpmFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
export declare function isKwzFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
export declare function isKwzDsiLibraryFsid(fsid: string): boolean;
/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export declare function isFsid(fsid: string): boolean;
/**
 * Get the region for any valid Flipnote Studio user ID
 */
export declare function getPpmFsidRegion(fsid: string): FlipnoteRegion;
/**
 * Get the region for any valid Flipnote Studio 3D user ID
 */
export declare function getKwzFsidRegion(fsid: string): FlipnoteRegion;
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
export declare function getFsidRegion(fsid: string): FlipnoteRegion;
