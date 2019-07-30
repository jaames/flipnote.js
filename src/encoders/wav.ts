import { DataStream } from '../utils/index';

export class WavEncoder {

  public sampleRate: number;
  public channels: number;
  public bitsPerSample: number;

  private header: DataStream;
  private pcmData: Int16Array;

  constructor(sampleRate: number, channels=1, bitsPerSample=16) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
    // Write WAV file header
    // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
    let headerBuffer = new ArrayBuffer(44);
    let header = new DataStream(headerBuffer);
    // 'RIFF' indent
    header.writeUtf8('RIFF');
    // filesize (set later)
    header.writeUint32(0);
    // 'WAVE' indent
    header.writeUtf8('WAVE');
    // 'fmt ' section header
    header.writeUtf8('fmt ');
    // fmt section length
    header.writeUint32(16);
    // specify audio format is pcm (type 1)
    header.writeUint16(1);
    // number of audio channels
    header.writeUint16(this.channels);
    // audio sample rate
    header.writeUint32(this.sampleRate);
    // byterate = (sampleRate * bitsPerSample * channelCount) / 8
    header.writeUint32((this.sampleRate * this.bitsPerSample * this.channels) / 8);
    // blockalign = (bitsPerSample * channels) / 8
    header.writeUint16((this.bitsPerSample * this.channels) / 8);
    // bits per sample
    header.writeUint16(this.bitsPerSample);
    // 'data' section header
    header.writeUtf8('data');
    // data section length (set later)
    header.writeUint32(0);
    this.header = header;
    this.pcmData = null;
  }

  public writeFrames(pcmData: Int16Array) {
    let header = this.header;
    // fill in filesize
    header.seek(4);
    header.writeUint32(header.byteLength + pcmData.byteLength);
    // fill in data section length
    header.seek(40);
    header.writeUint32(pcmData.byteLength);
    this.pcmData = pcmData;
  }

  public getBlob() {
    return new Blob([this.header.buffer, this.pcmData.buffer], {type: 'audio/wav'});
  }
}