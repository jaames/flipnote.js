import { Flipnote, FlipnoteAudioTrack } from '../parsers';
import { EncoderBase } from './EncoderBase';
export declare type WavSampleBuffer = Int16Array | Float32Array;
/**
 * Wav audio object. Used to create a {@link https://en.wikipedia.org/wiki/WAV | WAV} file from a PCM audio stream or a {@link Flipnote} object.
 *
 * Currently only supports PCM s16_le audio encoding.
 *
 * @category File Encoder
 */
export declare class WavAudio extends EncoderBase {
    mimeType: 'audio/wav';
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
    writeSamples(pcmData: Int16Array): void;
    /**
     * Returns the WAV audio data as an {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer | ArrayBuffer}
     */
    getArrayBuffer(): ArrayBufferLike;
}
