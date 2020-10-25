/** @internal */
export class ByteArray {

  static pageSize: number = 4096 * 4;

  private pageSize = ByteArray.pageSize;
  private currPageIndex: number = -1;
  private pages: Uint8Array[] = [];
  private currPage: Uint8Array;
  private cursor: number = 0;

  constructor() {
    this.newPage();
  }
  
  private newPage() {
    this.pages[++this.currPageIndex] = new Uint8Array(this.pageSize);
    this.currPage = this.pages[this.currPageIndex];
    this.cursor = 0;
  }
  
  public getData(): Uint8Array {
    const data = new Uint8Array(this.currPageIndex * this.pageSize + this.cursor);
    for (let index = 0; index < this.pages.length; index++) {
      const page = this.pages[index];
      if (index === this.currPageIndex)
        data.set(page.slice(0, this.cursor), index * this.pageSize);
      else
        data.set(page, index * this.pageSize);
    }
    return data;
  }

  public getBuffer(): ArrayBufferLike {
    const data = this.getData();
    return data.buffer;
  }
  
  public writeByte(val: number) {
    if (this.cursor >= this.pageSize)
      this.newPage();
    this.currPage[this.cursor++] = val;
  }

  public writeBytes(bytes: Uint8Array | number[], offset?: number, length?: number) {
    for (let l = length || bytes.length, i = offset || 0; i < l; i++)
      this.writeByte(bytes[i]);
  }
}