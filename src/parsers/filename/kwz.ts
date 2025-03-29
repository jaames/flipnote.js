import {
  dateFromNintendoTimestamp,
  dateToNintendoTimestamp
} from '../common';

import {
  kwzFsidFormat,
  kwzFsidUnformat
} from '../flipnoteStudioId';

import {
  hexFromBytes,
  hexToBytes
} from '../../utils';

/**
 * KWZ filenames can be decoded and broken down into different fields. This object represents an unpacked KWZ filename.
 */
export interface FlipnoteKwzUnpackedFilename {
  fsid: string;
  created: Date;
  edited: Date;
};

const REGEX_KWZ_FILENAME = /^[0-5a-z]{28}$/;

const BASE32_ALPHABET = 'cwmfjordvegbalksnthpyxquiz012345';

const base32Decode = (src: string) => {
  const srcSize = src.length;
  let srcPtr = 0;

  const dst = new Uint8Array(srcSize * 5 / 8);
  let dstPtr = 0;

  let value = 0;
  for (let i = 0; i < srcSize; i++) {
    value = (value << 5) | BASE32_ALPHABET.indexOf(src[i]);
    srcPtr += 5;

    if (srcPtr >= 8) {
      dst[dstPtr++] = (value >>> (srcPtr - 8)) & 0xFF;
      srcPtr -= 8;
    }
  }

  return dst;
};

const base32Encode = (src: Uint8Array) => {
  const srcSize = src.byteLength;
  let srcPtr = 0;

  let dst = '';

  let value = 0;
  for (let i = 0; i < srcSize; i++) {
    value = (value << 8) | src[i];
    srcPtr += 8;
    while (srcPtr >= 5) {
      dst += BASE32_ALPHABET[(value >>> (srcPtr - 5)) & 31];
      srcPtr -= 5;
    }
  }

  if (srcPtr > 0)
    dst += BASE32_ALPHABET[(value << (5 - srcPtr)) & 31];

  return dst;
};

/**
 * Determines if a string matches the KWZ filename format.
 */
export const isKwzFilename = (filename: string) =>
  REGEX_KWZ_FILENAME.test(filename);

/**
 * Decode a KWZ filename into its constituent parts.
 */
export const kwzFilenameDecode = (filename: string): FlipnoteKwzUnpackedFilename => {
  const bytes = base32Decode(filename);
  const data = new DataView(bytes.buffer);

  const fsid = kwzFsidFormat(hexFromBytes(bytes.slice(0, 9)));

  const created = dateFromNintendoTimestamp(data.getUint32(9, true));
  const edited = dateFromNintendoTimestamp(data.getUint32(13, true));
  
  return { fsid, created, edited };
};

/**
 * Encode a KWZ filename from its parts; i.e. do the inverse of {@link kwzFilenameDecode}.
 */
export const kwzFilenameEncode = (filename: FlipnoteKwzUnpackedFilename) => {
  const bytes = new Uint8Array(17);
  const data = new DataView(bytes.buffer);

  const fsid = kwzFsidUnformat(filename.fsid);
  bytes.set(hexToBytes(fsid));

  data.setUint32(9, dateToNintendoTimestamp(filename.created), true);
  data.setUint32(13, dateToNintendoTimestamp(filename.edited), true);
  return base32Encode(bytes);
};