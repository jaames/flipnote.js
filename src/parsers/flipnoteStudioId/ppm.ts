import { FlipnoteRegion } from '../types';

/**
 * Match an FSID from Flipnote Studio
 * e.g. 1440D700CEF78DA8
 * @internal
 */
const REGEX_PPM_FSID = /^[0159]{1}[0-9A-F]{6}0[0-9A-F]{8}$/;

/**
 * @internal
 * There are several known exceptions to the standard FSID format, all from Nintendo or Hatena developer and event accounts (mario, zelda 25th, etc).
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
export const isPpmFsid = (fsid: string) =>
  REGEX_PPM_FSID.test(fsid) || PPM_FSID_SPECIAL_CASE.includes(fsid);

/**
 * Get the region for any valid Flipnote Studio user ID
 */
export const getPpmFsidRegion = (fsid: string): FlipnoteRegion => {
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