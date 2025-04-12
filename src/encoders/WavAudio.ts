import { Flipnote, FlipnoteAudioTrack } from '../parsers';
import { DataStream } from '../utils';
import { EncoderBase } from './EncoderBase';

export type WavSampleBuffer = Int16Array | Float32Array;

/** 
 * Wav audio object. Used to create a {@link https://en.wikipedia.org/wiki/WAV | WAV} file from a PCM audio stream or a {@link Flipnote} object. 
 * 
 * Currently only supports PCM s16_le audio encoding.
 * 
 * @group File Encoder
 */
export class WavAudio extends EncoderBase {

  mimeType: 'audio/wav';

  /**
   * Audio samplerate
   */
  sampleRate: number;
  /**
   * Number of audio channels
   */
  channels: number;
  /**
   * Number of bits per sample
   */
  bitsPerSample: number;

  #header: DataStream;
  #pcmData: Int16Array;

  /**
   * Create a new WAV audio object
   * @param sampleRate audio samplerate
   * @param channels number of audio channels
   * @param bitsPerSample number of bits per sample
   */
  constructor(sampleRate: number, channels=1, bitsPerSample=16) {
    super();
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.bitsPerSample = bitsPerSample;
    // Write WAV file header
    // Reference: http://www.topherlee.com/software/pcm-tut-wavformat.html
    const headerBuffer = new ArrayBuffer(44);
    const header = new DataStream(headerBuffer);
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
    this.#header = header;
    this.#pcmData = null;
  }

  /**
   * Create a WAV audio file from a Flipnote's master audio track
   * @param flipnote
   * @param trackId
   */
  static fromFlipnote(note: Flipnote, sampleRate: number | null = null) {
    sampleRate ??= note.sampleRate;
    const wav = new WavAudio(sampleRate, 1, 16);
    const pcm = note.getAudioMasterPcm(sampleRate);
    wav.writeSamples(pcm);
    return wav;
  }

  /**
   * Create a WAV audio file from a given Flipnote audio track
   * @param flipnote
   * @param trackId
   */
  static fromFlipnoteTrack(flipnote: Flipnote, trackId: FlipnoteAudioTrack, sampleRate: number | null = null) {
    sampleRate ??= flipnote.sampleRate;
    const wav = new WavAudio(sampleRate, 1, 16);
    const pcm = flipnote.getAudioTrackPcm(trackId, sampleRate);
    wav.writeSamples(pcm);
    return wav;
  }

  /**
   * Add PCM audio frames to the WAV
   * @param pcmData signed int16 PCM audio samples
   */
  writeSamples(pcmData: Int16Array) {
    let header = this.#header;
    // fill in filesize
    header.seek(4);
    header.writeUint32(header.numBytes + pcmData.byteLength);
    // fill in data section length
    header.seek(40);
    header.writeUint32(pcmData.byteLength);
    this.#pcmData = pcmData;
  }
  
  /**
   * Returns the WAV audio data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
   */
  getArrayBuffer() {
    const headerBytes = this.#header.bytes;
    const pcmBytes = new Uint8Array(this.#pcmData.buffer);
    const resultBytes = new Uint8Array(this.#header.numBytes + this.#pcmData.byteLength);
    resultBytes.set(headerBytes);
    resultBytes.set(pcmBytes, headerBytes.byteLength);
    return resultBytes.buffer;
  }
}