/** @internal */
export class ByteArray {

  static pageSize = 2048;

  private pageSize = ByteArray.pageSize;
  private currPageIndex = -1;
  private pages: Uint8Array[] = [];
  private currPage: Uint8Array;
  private pointer = 0;

  constructor() {
    this.newPage();
  }
  
  private newPage() {
    this.pages[++this.currPageIndex] = new Uint8Array(this.pageSize);
    this.currPage = this.pages[this.currPageIndex];
    this.pointer = 0;
  }
  
  public getData() {
    const data = new Uint8Array(this.currPageIndex * this.pageSize + this.pointer);
    for (let index = 0; index < this.pages.length; index++) {
      const page = this.pages[index];
      if (index === this.currPageIndex)
        data.set(page.slice(0, this.pointer), index * this.pageSize);
      else
        data.set(page, index * this.pageSize);
    }
    return data;
  }

  public getBuffer() {
    const data = this.getData();
    return data.buffer;
  }
  
  public writeByte(val: number) {
    if (this.pointer >= this.pageSize)
      this.newPage();
    this.currPage[this.pointer++] = val;
  }

  public writeBytes(bytes: Uint8Array | number[], offset?: number, length?: number) {
    for (let l = length || bytes.length, i = offset || 0; i < l; i++)
      this.writeByte(bytes[i]);
  }
}