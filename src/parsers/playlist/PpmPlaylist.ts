import { XOR_KEY, BasePlaylistParser } from './Base';
import { FlipnoteFormat } from '../types';

/**
 * Parses .pls and .lst playlist files from Flipnote Studio (DSiWare).
 * 
 * > This only supports playlists from version 2 of Flipnote Studio.
 * > Since version 1 was only ever released in Japan (and for a short period of time at that) I didn't bother including support.
 * 
 * File format documentation is at https://github.com/Flipnote-Collective/flipnote-studio-docs/wiki/.pls-and-.lst-files
 */
export class PpmPlaylist extends BasePlaylistParser {

  format = FlipnoteFormat.PPM;

  constructor(buffer: ArrayBufferLike) {
    super(buffer);
    
    // Decrypt
    const bytes = this.bytes;
    const size = this.numBytes;
    for (let i = 0; i < size; i++)
      bytes[i] = bytes[i] ^ XOR_KEY[i % 64];

    // Parse
    let currPath = '';
    while (!this.end()) {
      const char = this.readChar();
      if (char === '\x0A') {
        this.addEntry(currPath);
        currPath = '';
        continue;
      }
      currPath += char;
    }
  }

}