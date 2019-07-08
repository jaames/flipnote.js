export class ByteArray {
  constructor() {
    this.page = -1;
    this.pages = [];
    this.newPage();
  }
  
  newPage() {
    this.pages[++this.page] = new Uint8Array(ByteArray.pageSize);
    this.cursor = 0;
  }
  
  getData() {
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

  getBuffer() {
    const data = this.getData();
    return data.buffer;
  }
  
  writeByte(val) {
    if (this.cursor >= ByteArray.pageSize) this.newPage();
    this.pages[this.page][this.cursor++] = val;
  }

  writeBytes(array, offset, length) {
    for (var l = length || array.length, i = offset || 0; i < l; i++)
      this.writeByte(array[i]);
  }
}

ByteArray.pageSize = 4096;