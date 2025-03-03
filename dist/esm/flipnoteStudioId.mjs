/*!!
 * flipnote.js v6.1.1
 * https://flipnote.js.org
 * A JavaScript library for Flipnote Studio animation files
 * 2018 - 2025 James Daniel
 * Flipnote Studio is (c) Nintendo Co., Ltd. This project isn't affiliated with or endorsed by them in any way.
*/
/**
 * Flipnote region
 */
var FlipnoteRegion;
(function (FlipnoteRegion) {
    /**
     * Europe and Oceania
     */
    FlipnoteRegion["EUR"] = "EUR";
    /**
     * Americas
     */
    FlipnoteRegion["USA"] = "USA";
    /**
     * Japan
     */
    FlipnoteRegion["JPN"] = "JPN";
    /**
     * Unidentified (possibly never used)
     */
    FlipnoteRegion["UNKNOWN"] = "UNKNOWN";
})(FlipnoteRegion || (FlipnoteRegion = {}));
/**
 * Identifies which animation format a Flipnote uses
 */
var FlipnoteFormat;
(function (FlipnoteFormat) {
    /**
     * Animation format used by Flipnote Studio (Nintendo DSiWare)
     */
    FlipnoteFormat["PPM"] = "PPM";
    /**
     * Animation format used by Flipnote Studio 3D (Nintendo 3DS)
     */
    FlipnoteFormat["KWZ"] = "KWZ";
})(FlipnoteFormat || (FlipnoteFormat = {}));
/**
 * Buffer format for a FlipnoteThumbImage
 */
var FlipnoteThumbImageFormat;
(function (FlipnoteThumbImageFormat) {
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Jpeg"] = 0] = "Jpeg";
    FlipnoteThumbImageFormat[FlipnoteThumbImageFormat["Rgba"] = 1] = "Rgba";
})(FlipnoteThumbImageFormat || (FlipnoteThumbImageFormat = {}));
/**
 * stereoscopic eye view (left/right) for 3D effects
 */
var FlipnoteStereoscopicEye;
(function (FlipnoteStereoscopicEye) {
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Left"] = 0] = "Left";
    FlipnoteStereoscopicEye[FlipnoteStereoscopicEye["Right"] = 1] = "Right";
})(FlipnoteStereoscopicEye || (FlipnoteStereoscopicEye = {}));
/**
 * Identifies a Flipnote audio track type
 */
var FlipnoteAudioTrack;
(function (FlipnoteAudioTrack) {
    /**
     * Background music track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["BGM"] = 0] = "BGM";
    /**
     * Sound effect 1 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE1"] = 1] = "SE1";
    /**
     * Sound effect 2 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE2"] = 2] = "SE2";
    /**
     * Sound effect 3 track
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE3"] = 3] = "SE3";
    /**
     * Sound effect 4 track (only used by KWZ files)
     */
    FlipnoteAudioTrack[FlipnoteAudioTrack["SE4"] = 4] = "SE4";
})(FlipnoteAudioTrack || (FlipnoteAudioTrack = {}));
/**
 * {@link FlipnoteAudioTrack}, but just sound effect tracks
 */
var FlipnoteSoundEffectTrack;
(function (FlipnoteSoundEffectTrack) {
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE1"] = 1] = "SE1";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE2"] = 2] = "SE2";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE3"] = 3] = "SE3";
    FlipnoteSoundEffectTrack[FlipnoteSoundEffectTrack["SE4"] = 4] = "SE4";
})(FlipnoteSoundEffectTrack || (FlipnoteSoundEffectTrack = {}));

/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;
/**
 * @internal
 * There are several known exceptions to the standard FSID format, all from Nintendo or Hatena developer/event accounts (mario, zelda 25th, etc).
 * This list was compiled from data provided by the Flipnote Archive, so it can be considered comprehensive enough to match any Flipnote you may encounter.
 */
const PPM_FSID_SPECIAL_CASE = [
    '01FACA7A4367FC5F',
    '03D6E959E2F9A42D',
    '03F80445160587FA',
    '04068426E1008915',
    '092A3EC8199FD5D5',
    '0B8D56BA1BD441B8',
    '0E61C75C9B5AD90B',
    '14E494E35A443235'
];
/**
 * Indicates whether the input is a valid Flipnote Studio user ID
 */
const isPpmFsid = (fsid) => REGEX_PPM_FSID.test(fsid) || PPM_FSID_SPECIAL_CASE.includes(fsid);
/**
 * Get the region for any valid Flipnote Studio user ID
 */
const getPpmFsidRegion = (fsid) => {
    switch (fsid.charAt(0)) {
        case '0':
        case '1':
            return FlipnoteRegion.JPN;
        case '5':
            return FlipnoteRegion.USA;
        case '9':
            return FlipnoteRegion.EUR;
        default:
            return FlipnoteRegion.UNKNOWN;
    }
};

/**
 * Match an FSID from Flipnote Studio 3D
 * e.g. 003f-0b7e-82a6-fe0bda
 * @internal
 */
const REGEX_KWZ_FSID = /^[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{6}$/;
/**
 * Match an FSID from a DSi Library note (PPM to KWZ conversion)
 * e.g. 10b8-b909-5180-9b2013
 * @internal
 */
const REGEX_KWZ_DSI_LIBRARY_FSID = /^(00|10|12|14)[0-9a-f]{2}-[0-9a-f]{4}-[0-9a-f]{3}0-[0-9a-f]{4}[0159]{1}[0-9a-f]{1}$/;
/**
 * KWZ equivalents of PPM_FSID_SPECIAL_CASE
 * @internal
 */
const KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX = [
    '5f-fc67-437a-cafa01',
    '2d-a4f9-e259-e9d603',
    'fa-8705-1645-04f803',
    '15-8900-e126-840604',
    'd5-d59f-19c8-3e2a09',
    'b8-41d4-1bba-568d0b',
    '0b-d95a-9b5c-c7610e',
    '35-3244-5ae3-94e414',
];
/**
 * Indicates whether the input is a valid Flipnote Studio 3D user ID
 */
const isKwzFsid = (fsid) => REGEX_KWZ_FSID.test(fsid);
/**
 * Indicates whether the input is a valid DSi Library user ID
 */
const isKwzDsiLibraryFsid = (fsid) => {
    if (REGEX_KWZ_DSI_LIBRARY_FSID.test(fsid))
        return true;
    for (let suffix of KWZ_DSI_LIBRARY_FSID_SPECIAL_CASE_SUFFIX) {
        if (fsid.endsWith(suffix))
            return true;
    }
    return false;
};
/**
 * Get the region for any valid Flipnote Studio 3D user ID.
 *
 * :::tip
 * This may be incorrect for IDs that are not from the DSi Library.
 * :::
 */
const getKwzFsidRegion = (fsid) => {
    if (isKwzDsiLibraryFsid(fsid)) {
        switch (fsid.charAt(19)) {
            case '0':
            case '1':
                return FlipnoteRegion.JPN;
            case '5':
                return FlipnoteRegion.USA;
            case '9':
                return FlipnoteRegion.EUR;
            default:
                return FlipnoteRegion.UNKNOWN;
        }
    }
    return FlipnoteRegion.UNKNOWN;
};
/**
 * Format a hex string with dashes, to match the format used to display Flipnote Studio IDs in the app.
 */
const kwzFsidFormat = (hex) => {
    return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 18)}`.toLowerCase();
};
/**
 * Unformat a Flipnote Studio ID string back into regular hex.
 */
const kwzFsidUnformat = (fsid) => {
    return fsid.replace(/-/g, '').toUpperCase();
};

/**
 * Indicates whether the input is a valid Flipnote Studio or Flipnote Studio 3D user ID.
 */
const isFsid = (fsid) => isPpmFsid(fsid) || isKwzFsid(fsid);
/**
 * Get the region for any valid Flipnote Studio or Flipnote Studio 3D user ID
 */
const getFsidRegion = (fsid) => {
    if (isPpmFsid(fsid))
        return getPpmFsidRegion(fsid);
    else if (isKwzFsid(fsid))
        return getKwzFsidRegion(fsid);
    return FlipnoteRegion.UNKNOWN;
};
/**
 * Convert a PPM Flipnote Studio ID to the format used by KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 *
 * :::tip
 * KWZ Flipnote Studio IDs contain an extra two characters at the beginning.
 * It is not possible to resolve these from a PPM Flipnote Studio ID.
 * :::
*/
const ppmFsidToKwzFsidSuffix = (fsid) => {
    if (isPpmFsid(fsid)) {
        const a = fsid.slice(14, 16);
        const b = fsid.slice(12, 14);
        const c = fsid.slice(10, 12);
        const d = fsid.slice(8, 10);
        const e = fsid.slice(6, 8);
        const f = fsid.slice(4, 6);
        const g = fsid.slice(2, 4);
        const h = fsid.slice(0, 2);
        return `${a}-${b}${c}-${d}${e}-${f}${g}${h}`.toLocaleLowerCase();
    }
    return null;
};
/**
 * Convert a PPM Flipnote Studio ID to an array of all possible matching KWZ Flipnote Studio IDs (as seen in Nintendo DSi Library Flipnotes).
 * Will return `null` if the conversion could not be made.
 */
const ppmFsidToPossibleKwzFsids = (fsid) => {
    const kwzIdSuffix = ppmFsidToKwzFsidSuffix(fsid);
    if (kwzIdSuffix) {
        return [
            '00' + kwzIdSuffix,
            '10' + kwzIdSuffix,
            '12' + kwzIdSuffix,
            '14' + kwzIdSuffix,
        ];
    }
    return null;
};
/**
 * Convert a KWZ Flipnote Studio ID (from a Nintendo DSi Library Flipnote) to the format used by PPM Flipnote Studio IDs.
 * Will return `null` if the conversion could not be made.
 */
const kwzFsidToPpmFsid = (fsid) => {
    if (isKwzDsiLibraryFsid(fsid)) {
        const a = fsid.slice(19, 21);
        const b = fsid.slice(17, 19);
        const c = fsid.slice(15, 17);
        const d = fsid.slice(12, 14);
        const e = fsid.slice(10, 12);
        const f = fsid.slice(7, 9);
        const g = fsid.slice(5, 7);
        const h = fsid.slice(2, 4);
        return `${a}${b}${c}${d}${e}${f}${g}${h}`.toUpperCase();
    }
    return null;
};

export { getFsidRegion, getKwzFsidRegion, getPpmFsidRegion, isFsid, isKwzDsiLibraryFsid, isKwzFsid, isPpmFsid, kwzFsidFormat, kwzFsidToPpmFsid, kwzFsidUnformat, ppmFsidToKwzFsidSuffix, ppmFsidToPossibleKwzFsids };
