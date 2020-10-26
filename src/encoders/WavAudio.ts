import { DataStream } from '../utils/index';
import { Flipnote, FlipnoteAudioTrack } from '../parsers/index';
import { isNode, isBrowser } from '../utils';

/** 
 * WAV audio encoder
 * 
 * Creates WAV file containing uncompressed PCM audio data
 * WAV info: https://en.wikipedia.org/wiki/WAV
 * @category File Encoder
 */
export class WavAudio {

  /** Audio samplerate */
  public sampleRate: number;
  /** Number of audio channels */
  public channels: number;
  /** Number of bits per sample */
  public bitsPerSample: number;

  private header: DataStream;
  private pcmData: Int16Array;

  /**
   * Create a WAV audio file
   * @param sampleRate audio samplerate
   * @param channels number of audio channels
   * @param bitsPerSample number of bits per sample
   */
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

  /**
   * Create a WAV audio file from a Flipnote's master audio track
   * @param flipnote {@link PpmParser} or {@link KwzParser} instance
   * @param trackId {@link FlipnoteAudioTrack}
   */
  static fromFlipnote(note: Flipnote) {
    const sampleRate = note.sampleRate;
    const wav = new WavAudio(sampleRate, 1, 16);
    const pcm = note.getAudioMasterPcm(sampleRate);
    wav.writeFrames(pcm);
    return wav;
  }

  /**
   * Create a WAV audio file from a given Flipnote audio track
   * @param flipnote {@link PpmParser} or {@link KwzParser} instance
   * @param trackId {@link FlipnoteAudioTrack}
   */
  static fromFlipnoteTrack(flipnote: Flipnote, trackId: FlipnoteAudioTrack) {
    const sampleRate = flipnote.sampleRate;
    const wav = new WavAudio(sampleRate, 1, 16);
    const pcm = flipnote.getAudioTrackPcm(trackId, sampleRate);
    wav.writeFrames(pcm);
    return wav;
  }

  /**
   * Add PCM audio frames to the WAV
   * @param pcmData signed int16 PCM audio samples
   */
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
  
  /**
   * Returns the WAV audio data as an ArrayBuffer
   */
  public getArrayBuffer() {
    const headerBytes = this.header.bytes;
    const pcmBytes = new Uint8Array(this.pcmData.buffer);
    const resultBytes = new Uint8Array(this.header.byteLength + this.pcmData.byteLength);
    resultBytes.set(headerBytes);
    resultBytes.set(pcmBytes, headerBytes.byteLength);
    return resultBytes.buffer;
  }

  /**
   * Returns the WAV audio data as a NodeJS Buffer
   * 
   * Note: This method does not work outside of node.js environments
   * 
   * Buffer API: https://nodejs.org/api/buffer.html
   */
  public getBuffer() {
    if (isNode) {
      return Buffer.from(this.getArrayBuffer());
    }
    throw new Error('The Buffer object is only available in Node.js environments');
  }


  /**
   * Returns the GIF image data as a file blob
   * 
   * Note: This method will not work outside of browser environments
   * 
   * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
   */
  public getBlob() {
    if (isBrowser) {   
      const buffer = this.getArrayBuffer();
      return new Blob([buffer], {type: 'audio/wav'});
    }
    throw new Error('The Blob object is only available in browser environments');
  }
}