export class ByteArray {

  static pageSize: number = 4096;

  private page: number = -1;
  private pages: Uint8Array[] = [];
  private cursor: number = 0;

  constructor() {
    this.newPage();
  }
  
  private newPage() {
    this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
    this.cursor = 0;
  }
  
  public getData() {
    const data = new Uint8Array((this.page) * ByteArray.pageSize + this.cursor);
    this.pages.map((page, index) => {
      if (index === this.page) {
        data.set(page.slice(0, this.cursor), index * ByteArray.pageSize);
      } else {
        data.set(page, index * ByteArray.pageSize);
      }
    });
    return data;
  }

  public getBuffer() {
    const data = this.getData();
    return data.buffer;
  }
  
  public writeByte(val: number) {
    if (this.cursor >= ByteArray.pageSize) this.newPage();
    this.pages[this.page][this.cursor++] = val;
  }

  public writeBytes(array: Uint8Array | number[], offset?: number, length?: number) {
    for (var l = length || array.length, i = offset || 0; i < l; i++)
      this.writeByte(array[i]);
  }
}