/// <reference types="node" />
import { Flipnote, FlipnoteAudioTrack } from '../parsers/index';
/**
 * Wav audio object. Used to create a {@link https://en.wikipedia.org/wiki/WAV | WAV} file from a PCM audio stream or a {@link Flipnote} object.
 *
 * Currently only supports PCM s16_le audio encoding.
 *
 * @category File Encoder
 */
export declare class WavAudio {
    /** Audio samplerate */
    sampleRate: number;
    /** Number of audio channels */
    channels: number;
    /** Number of bits per sample */
    bitsPerSample: number;
    private header;
    private pcmData;
    /**
     * Create a new WAV audio object
     * @param sampleRate audio samplerate
     * @param channels number of audio channels
     * @param bitsPerSample number of bits per sample
     */
    constructor(sampleRate: number, channels?: number, bitsPerSample?: number);
    /**
     * Create a WAV audio file from a Flipnote's master audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnote(note: Flipnote): WavAudio;
    /**
     * Create a WAV audio file from a given Flipnote audio track
     * @param flipnote
     * @param trackId
     */
    static fromFlipnoteTrack(flipnote: Flipnote, trackId: FlipnoteAudioTrack): WavAudio;
    /**
     * Add PCM audio frames to the WAV
     * @param pcmData signed int16 PCM audio samples
     */
    writeFrames(pcmData: Int16Array): void;
    /**
     * Returns the WAV audio data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer(): ArrayBufferLike;
    /**
     * Returns the WAV audio data as a NodeJS {@link https://nodejs.org/api/buffer.html | Buffer}
     *
     * Note: This method does not work outside of NodeJS environments
     */
    getBuffer(): Buffer;
    /**
     * Returns the GIF image data as a file {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob | Blob}
     *
     * Note: This method will not work outside of browser environments
     */
    getBlob(): Blob;
}
