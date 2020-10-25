/// <reference types="node" />
import { Flipnote, FlipnoteAudioTrack } from '../parsers/index';
/**
 * WAV audio encoder
 *
 * Creates WAV file containing uncompressed PCM audio data
 * WAV info: https://en.wikipedia.org/wiki/WAV
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
     * Create a WAV audio file
     * @param sampleRate audio samplerate
     * @param channels number of audio channels
     * @param bitsPerSample number of bits per sample
     */
    constructor(sampleRate: number, channels?: number, bitsPerSample?: number);
    /**
     * Create a WAV audio file from a Flipnote's master audio track
     * @param flipnote {@link PpmParser} or {@link KwzParser} instance
     * @param trackId {@link FlipnoteAudioTrack}
     */
    static fromFlipnote(note: Flipnote): WavAudio;
    /**
     * Create a WAV audio file from a given Flipnote audio track
     * @param flipnote {@link PpmParser} or {@link KwzParser} instance
     * @param trackId {@link FlipnoteAudioTrack}
     */
    static fromFlipnoteTrack(flipnote: Flipnote, trackId: FlipnoteAudioTrack): WavAudio;
    /**
     * Add PCM audio frames to the WAV
     * @param pcmData signed int16 PCM audio samples
     */
    writeFrames(pcmData: Int16Array): void;
    /**
     * Returns the WAV audio data as an ArrayBuffer
     */
    getArrayBuffer(): ArrayBufferLike;
    /**
     * Returns the WAV audio data as a NodeJS Buffer
     *
     * Note: This method does not work outside of node.js environments
     *
     * Buffer API: https://nodejs.org/api/buffer.html
     */
    getBuffer(): Buffer;
    /**
     * Returns the GIF image data as a file blob
     *
     * Note: This method will not work outside of browser environments
     *
     * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
     */
    getBlob(): Blob;
}
