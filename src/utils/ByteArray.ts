export class ByteArray {

  static pageSize: number = 4096;

  public pageSize = ByteArray.pageSize;
  public currPageIndex: number = -1;
  public pages: Uint8Array[] = [];
  public currPage: Uint8Array;
  public cursor: number = 0;

  constructor() {
    this.newPage();
  }
  
  private newPage() {
    this.pages[++this.currPageIndex] = new Uint8Array(this.pageSize);
    this.currPage = this.pages[this.currPageIndex];
    this.cursor = 0;
  }
  
  public getData() {
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

  public getBuffer() {
    const data = this.getData();
    return data.buffer;
  }
  
  public writeByte(val: number) {
    if (this.cursor >= ByteArray.pageSize)
      this.newPage();
    this.currPage[this.cursor++] = val;
  }

  public writeBytes(array: Uint8Array | number[], offset?: number, length?: number) {
    // if (this.cursor + array.length < this.pageSize) {
    //   this.currPage.set(array, this.cursor);
    //   this.cursor += array.length;
    // }
    // else {
      for (let l = length || array.length, i = offset || 0; i < l; i++)
        this.writeByte(array[i]);
    // }
  }
}