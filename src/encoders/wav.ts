import { DataStream } from '../utils/index';
import { Flipnote, FlipnoteAudioTrack } from '../parsers/index';

// Typical WAV sample rate
const WAV_SAMPLE_RATE = 44100;

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
    header.writeChars('RIFF');
    // filesize (set later)
    header.writeUint32(0);
    // 'WAVE' indent
    header.writeChars('WAVE');
    // 'fmt ' section header
    header.writeChars('fmt ');
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
    header.writeChars('data');
    // data section length (set later)
    header.writeUint32(0);
    this.header = header;
    this.pcmData = null;
  }

  static fromFlipnote(note: Flipnote) {
    const wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
    const pcm = note.getAudioMasterPcm(WAV_SAMPLE_RATE);
    wav.writeFrames(pcm);
    return wav;
  }

  static fromFlipnoteTrack(note: Flipnote, trackId: FlipnoteAudioTrack) {
    const wav = new WavEncoder(WAV_SAMPLE_RATE, 1, 16);
    const pcm = note.getAudioTrackPcm(trackId, WAV_SAMPLE_RATE);
    wav.writeFrames(pcm);
    return wav;
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