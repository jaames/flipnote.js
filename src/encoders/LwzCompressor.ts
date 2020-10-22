import { ByteArray } from '../utils/byteArray';

/*
  LZWEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
  James Daniel (ES6/TS version)

  Acknowledgements
  GIFCOMPR.C - GIF Image compression routines
  Lempel-Ziv compression based on 'compress'. GIF modifications by
  David Rowley (mgardi@watdcsu.waterloo.edu)
  GIF Image compression - modified 'compress'
  Based on: compress.c - File compression ala IEEE Computer, June 1984.
  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)
  Jim McKie (decvax!mcvax!jim)
  Steve Davies (decvax!vax135!petsd!peora!srd)
  Ken Turkowski (decvax!decwrl!turtlevax!ken)
  James A. Woods (decvax!ihnp4!ames!jaw)
  Joe Orost (decvax!vax135!petsd!joe)
*/

/** @internal */
const EOF = -1;
/** @internal */
const BITS = 12;
/** @internal */
const HSIZE = 5003; // 80% occupancy
/** @internal */
const masks = [
  0x0000, 0x0001, 0x0003, 0x0007, 0x000F, 0x001F,
  0x003F, 0x007F, 0x00FF, 0x01FF, 0x03FF, 0x07FF,
  0x0FFF, 0x1FFF, 0x3FFF, 0x7FFF, 0xFFFF
];

/** @internal */
export class LzwCompressor {
  public width: number;
  public height: number;
  public pixels: Uint8Array;
  public colorDepth: number;

  private initCodeSize: number;
  private accum = new Uint8Array(256);
  private htab = new Int32Array(HSIZE);
  private codetab = new Int32Array(HSIZE);
  private cur_accum = 0;
  private cur_bits = 0;
  private n_bits: number;
  private a_count: number;
  private remaining: number;
  private curPixel = 0;
  private free_ent = 0; // first unused entry
  private maxcode: number;
  // block compression parameters -- after all codes are used up,
  // and compression rate changes, start over.
  private clear_flg: boolean = false;
  // Algorithm: use open addressing double hashing (no chaining) on the
  // prefix code / next character combination. We do a variant of Knuth's
  // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
  // secondary probe. Here, the modular division first probe is gives way
  // to a faster exclusive-or manipulation. Also do block compression with
  // an adaptive reset, whereby the code table is cleared when the compression
  // ratio decreases, but after the table fills. The variable-length output
  // codes are re-sized at this point, and a special CLEAR code is generated
  // for the decompressor. Late addition: construct the table according to
  // file size for noticeable speed improvement on small files. Please direct
  // questions about this implementation to ames!jaw.
  private g_init_bits: number = undefined;
  private ClearCode: number = undefined;
  private EOFCode: number = undefined;

  constructor(width: number, height: number, colorDepth: number) {
    this.width = width;
    this.height = height;
    this.colorDepth = colorDepth;
    this.reset();
  }

  reset() {
    this.initCodeSize = Math.max(2, this.colorDepth);
    this.accum.fill(0);
    this.htab.fill(0);
    this.codetab.fill(0);
    this.cur_accum = 0;
    this.cur_bits = 0;
    this.curPixel = 0;
    this.free_ent = 0; // first unused entry
    this.maxcode;
    // block compression parameters -- after all codes are used up,
    // and compression rate changes, start over.
    this.clear_flg = false;
    // Algorithm: use open addressing double hashing (no chaining) on the
    // prefix code / next character combination. We do a variant of Knuth's
    // algorithm D (vol. 3, sec. 6.4) along with G. Knott's relatively-prime
    // secondary probe. Here, the modular division first probe is gives way
    // to a faster exclusive-or manipulation. Also do block compression with
    // an adaptive reset, whereby the code table is cleared when the compression
    // ratio decreases, but after the table fills. The variable-length output
    // codes are re-sized at this point, and a special CLEAR code is generated
    // for the decompressor. Late addition: construct the table according to
    // file size for noticeable speed improvement on small files. Please direct
    // questions about this implementation to ames!jaw.
    this.g_init_bits = undefined;
    this.ClearCode = undefined;
    this.EOFCode = undefined;
  }

  // Add a character to the end of the current packet, and if it is 254
  // characters, flush the packet to disk.
  char_out(c: number, outs: ByteArray) {
    this.accum[this.a_count++] = c;
    if (this.a_count >= 254) this.flush_char(outs);
  }

  // Clear out the hash table
  // table clear for block compress
  cl_block(outs: ByteArray) {
    this.cl_hash(HSIZE);
    this.free_ent = this.ClearCode + 2;
    this.clear_flg = true;
    this.output(this.ClearCode, outs);
  }

  // Reset code table
  cl_hash(hsize: number) {
    for (var i = 0; i < hsize; ++i) this.htab[i] = -1;
  }

  compress(init_bits: number, outs: ByteArray) {
    var fcode, c, i, ent, disp, hsize_reg, hshift;

    // Set up the globals: this.g_init_bits - initial number of bits
    this.g_init_bits = init_bits;

    // Set up the necessary values
    this.clear_flg = false;
    this.n_bits = this.g_init_bits;
    this.maxcode = this.get_maxcode(this.n_bits);

    this.ClearCode = 1 << (init_bits - 1);
    this.EOFCode = this.ClearCode + 1;
    this.free_ent = this.ClearCode + 2;

    this.a_count = 0; // clear packet

    ent = this.nextPixel();

    hshift = 0;
    for (fcode = HSIZE; fcode < 65536; fcode *= 2) ++hshift;
    hshift = 8 - hshift; // set hash code range bound
    hsize_reg = HSIZE;
    this.cl_hash(hsize_reg); // clear hash table

    this.output(this.ClearCode, outs);

    outer_loop: while ((c = this.nextPixel()) != EOF) {
      fcode = (c << BITS) + ent;
      i = (c << hshift) ^ ent; // xor hashing
      if (this.htab[i] === fcode) {
        ent = this.codetab[i];
        continue;
      } 
      else if (this.htab[i] >= 0) { // non-empty slot
        disp = hsize_reg - i; // secondary hash (after G. Knott)
        if (i === 0) {
          disp = 1;
        }
        do {
          if ((i -= disp) < 0) {
            i += hsize_reg;
          }
          if (this.htab[i] === fcode) {
            ent = this.codetab[i];
            continue outer_loop;
          }
        } while (this.htab[i] >= 0);
      }
      this.output(ent, outs);
      ent = c;
      if (this.free_ent < 1 << BITS) {
        this.codetab[i] = this.free_ent++; // code -> hasthis.htable
        this.htab[i] = fcode;
      } else {
        this.cl_block(outs);
      }
    }

    // Put out the final code.
    this.output(ent, outs);
    this.output(this.EOFCode, outs);
  }

  encode(pixels: Uint8Array, outs: ByteArray) {
    this.pixels = pixels;
    outs.writeByte(this.initCodeSize); // write 'initial code size' byte
    this.remaining = this.width * this.height; // reset navigation variables
    this.curPixel = 0;
    this.compress(this.initCodeSize + 1, outs); // compress and write the pixel data
    outs.writeByte(0); // write block terminator
  }

  // Flush the packet to disk, and reset the this.accumulator
  flush_char(outs: ByteArray) {
    if (this.a_count > 0) {
      outs.writeByte(this.a_count);
      outs.writeBytes(this.accum, 0, this.a_count);
      this.a_count = 0;
    }
  }

  get_maxcode(n_bits: number) {
    return (1 << n_bits) - 1;
  }

  // Return the next pixel from the image
  nextPixel() {
    if (this.remaining === 0) return EOF;
    --this.remaining;
    var pix = this.pixels[this.curPixel++];
    return pix & 0xff;
  }

  output(code: number, outs: ByteArray) {
    this.cur_accum &= masks[this.cur_bits];

    if (this.cur_bits > 0) this.cur_accum |= (code << this.cur_bits);
    else this.cur_accum = code;

    this.cur_bits += this.n_bits;

    while (this.cur_bits >= 8) {
      this.char_out((this.cur_accum & 0xff), outs);
      this.cur_accum >>= 8;
      this.cur_bits -= 8;
    }

    // If the next entry is going to be too big for the code size,
    // then increase it, if possible.
    if (this.free_ent > this.maxcode || this.clear_flg) {
      if (this.clear_flg) {
        this.maxcode = this.get_maxcode(this.n_bits = this.g_init_bits);
        this.clear_flg = false;
      } else {
        ++this.n_bits;
        if (this.n_bits == BITS) this.maxcode = 1 << BITS;
        else this.maxcode = this.get_maxcode(this.n_bits);
      }
    }

    if (code == this.EOFCode) {
      // At EOF, write the rest of the buffer.
      while (this.cur_bits > 0) {
        this.char_out((this.cur_accum & 0xff), outs);
        this.cur_accum >>= 8;
        this.cur_bits -= 8;
      }
      this.flush_char(outs);
    }
  }
}
