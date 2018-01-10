export default class fileReader {
  constructor(arrBuffer) {
    this.data = new DataView(arrBuffer);
    this.offset = 0;
  }

  seek(offset, whence) {
    switch (whence) {
      case 2:
        this.offset = this.data.byteLength + offset;
        break;
      case 1:
        this.offset += offset;
        break;
      case 0:
      default:
        this.offset = offset;
        break;
    }
  }

  readUint8() {
    var val = this.data.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  readInt8() {
    var val = this.data.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  readUint16(littleEndian=true) {
    var val = this.data.getUint16(this.offset, littleEndian);
    this.offset += 2;
    return val;
  }

  readInt16(littleEndian=true) {
    var val = this.data.getInt16(this.offset, littleEndian);
    this.offset += 2;
    return val;
  }

  readUint32(littleEndian=true) {
    var val = this.data.getUint32(this.offset, littleEndian);
    this.offset += 4;
    return val;
  }

  readInt32(littleEndian=true) {
    var val = this.data.getInt32(this.offset, littleEndian);
    this.offset += 4;
    return val;
  }
}