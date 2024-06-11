/**
 * @internal
 */
export class ByteArray {
  /**
   * @internal
   */
  pageSize = 2048 * 2;
  /**
   * Allocated size counting all pages.
   * @internal
   */
  allocSize = 0;
  /**
   * Number of bytes actually used.
   * @internal
   */
  realSize = 0;
  /**
   * @internal
   */
  pages: Uint8Array[] = [];
  /**
   * @internal
   */
  numPages = 0;
  /**
   * Page to write to.
   * @internal
   */
  pageIdx = 0;
  /**
   * Position in page to write to.
   * @internal
   */
  pagePtr = 0; // 
  /**
   * Position in file.
   * @internal
   */
  realPtr = 0;

  constructor() {
    this.newPage();
  }

  /**
   * @internal
   */
  set pointer(ptr: number) {
    this.setPointer(ptr);
  }

  /**
   * @internal
   */
  get pointer() {
    return this.realPtr;
  }

  /**
   * @internal
   */
  newPage() {
    this.pages[this.numPages] = new Uint8Array(this.pageSize);
    this.numPages = this.pages.length;
    this.allocSize = this.numPages * this.pageSize;
  }

  /**
   * @internal
   */
  setPointer(ptr: number) {
    // allocate enough pages to include pointer
    while (ptr >= this.allocSize) {
      this.newPage();
    }
    // increase real file size if the end is reached
    if (ptr > this.realSize)
      this.realSize = ptr;
    // update ptrs
    this.pageIdx = Math.floor(ptr / this.pageSize);
    this.pagePtr = ptr % this.pageSize;
    this.realPtr = ptr;
  }

  /**
   * @internal
   */
  writeByte(value: number) {
    this.pages[this.pageIdx][this.pagePtr] = value;
    this.setPointer(this.realPtr + 1);
  }

  /**
   * @internal
   */
  writeBytes(bytes: Uint8Array | number[], srcPtr?: number, length?: number) {
    for (let l = length || bytes.length, i = srcPtr || 0; i < l; i++)
      this.writeByte(bytes[i]);
  }

  /**
   * @internal
   */
  writeChars(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.writeByte(str.charCodeAt(i));
    }
  }

  /**
   * @internal
   */
  writeU8(value: number) {
    this.writeByte(value & 0xFF);
  }

  /**
   * @internal
   */
  writeU16(value: number) {
    this.writeByte((value >>> 0) & 0xFF);
    this.writeByte((value >>> 8) & 0xFF);
  }

  /**
   * @internal
   */
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