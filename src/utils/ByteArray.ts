/** @internal */
export class ByteArray {
  // sizes
  pageSize = 2048 * 2;
  allocSize = 0; // allocated size counting all pages
  realSize = 0; // number of bytes actually used
  // pages
  pages: Uint8Array[] = [];
  numPages = 0;
  // pointers
  pageIdx = 0; // page to write to
  pagePtr = 0; // position in page to write to
  realPtr = 0; // position in file

  constructor() {
    this.newPage();
  }

  set pointer(ptr: number) {
    this.setPointer(ptr);
  }

  get pointer() {
    return this.realPtr;
  }

  newPage() {
    this.pages[this.numPages] = new Uint8Array(this.pageSize);
    this.numPages = this.pages.length;
    this.allocSize = this.numPages * this.pageSize;
  }

  setPointer(ptr: number) {
    // allocate enough pages to include pointer
    while (ptr >= this.allocSize) {
      this.newPage();
    }
    // increase real file size if the end is reached
    if (ptr > this.realSize)
      this.realSize = ptr;
    // update ptrs
    // TODO: this is going to get hit a lot, maybe optimise?
    this.pageIdx = Math.floor(ptr / this.pageSize);
    this.pagePtr = ptr % this.pageSize;
    this.realPtr = ptr;
  }

  writeByte(value: number) {
    this.pages[this.pageIdx][this.pagePtr] = value;
    this.setPointer(this.realPtr + 1);
  }

  writeBytes(bytes: Uint8Array | number[], srcPtr?: number, length?: number) {
    for (let l = length || bytes.length, i = srcPtr || 0; i < l; i++)
      this.writeByte(bytes[i]);
  }

  writeChars(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  writeU8(value: number) {
    this.writeByte(value & 0xFF);
  }

  writeU16(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
  }

  writeU32(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
    this.writeByte((value >>> 16) & 0xFF);
    this.writeByte((value >>> 24) & 0xFF);
  }

  getBytes() {
    const bytes = new Uint8Array(this.realSize);
    const numPages = this.numPages;
    for (let i = 0; i < numPages; i++) {
      const page = this.pages[i];
      if (i === numPages - 1) // last page
        bytes.set(page.slice(0, this.realSize % this.pageSize), i * this.pageSize);
      else
        bytes.set(page, i * this.pageSize);
    }
    return bytes;
  }

  getBuffer() {
    const bytes = this.getBytes();
    return bytes.buffer;
  }
}