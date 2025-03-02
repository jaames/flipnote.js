import { XOR_KEY, BasePlaylistParser } from './Base';
import { FlipnoteFormat } from '../types';

/**
 * Parses .lst playlist files from Flipnote Studio 3D.
 * 
 * File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-3d-docs/wiki/lst-format
 */
export class KwzPlaylist extends BasePlaylistParser {

  format = FlipnoteFormat.KWZ;

  constructor(buffer: ArrayBufferLike) {
    super(buffer);

    // Decrypt
    const bytes = this.bytes;
    const size = this.numBytes;
    for (let i = 0; i < size; i++)
      bytes[i] = bytes[i] ^ XOR_KEY[i % 61]; // Yes, the KWZ playlist format doesn't use the full key length.

    // Parse
    let currPath = '';
    this.seek(4);
    const separator = this.readWideChar();
    while (!this.end()) {
      const char = this.readWideChar();
      if (char === separator) {
        this.addEntry(currPath);
        currPath = '';
        continue;
      }
      currPath += char;
    }
  }

}