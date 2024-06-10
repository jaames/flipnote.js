import { FlipnoteFormat } from '../types';
import { DataStream } from '../../utils';

export const XOR_KEY = [
  0xF7, 0x4C, 0x6A, 0x3A, 0xFB, 0x82, 0xA6, 0x37,
  0x6E, 0x11, 0x38, 0xCF, 0xA0, 0xDD, 0x85, 0xC0,
  0xC7, 0x9B, 0xC4, 0xD8, 0xDD, 0x28, 0x8A, 0x87,
  0x53, 0x20, 0xEE, 0xE0, 0x0B, 0xEB, 0x43, 0xA0,
  0xDB, 0x55, 0x0F, 0x75, 0x36, 0x37, 0xEB, 0x35,
  0x6A, 0x34, 0x7F, 0xB5, 0x0F, 0x99, 0xF7, 0xEF,
  0x43, 0x25, 0xCE, 0xA0, 0x29, 0x46, 0xD9, 0xD4,
  0x4D, 0xBB, 0x04, 0x66, 0x68, 0x08, 0xF1, 0xF8,
];

/**
 * Parsed playlist filepath.
 */
export interface Path {
  /**
   * Full original filepath.
   */
  full: string;
  /**
   * Parsed filename (e.g. `flipnote.ppm`).
   */
  name: string;
  /**
   * Parsed filename base (e.g. `flipnote`).
   */
  base: string;
  /**
   * Parsed filename extension (e.g. `ext`).
   */
  ext: string;
  /**
   * Parsed filepath folder.
   */
  folder?: string;
  /**
   * Parsed filepath parent folder - the folder one level above {@link folder}.
   */
  parentFolder?: string;
};

export abstract class BasePlaylistParser extends DataStream {
  
  abstract format: FlipnoteFormat;

  /**
   * List of filepaths in the playlist.
   */
  entries: Path[] = [];

  constructor(buffer: ArrayBuffer) {
    super(buffer);
  }
  
  addEntry(full: string) {
    const parts = full.split('/');
    const name = parts.at(-1);
    const lastDot = full.lastIndexOf('.');
    this.entries.push({
      full,
      name,
      base: full.slice(0, lastDot),
      ext: full.slice(lastDot + 1),
      folder: parts.at(-2),
      parentFolder: parts.at(-3)
    });
  }

}