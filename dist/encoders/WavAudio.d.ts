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
     * Returns the GIF image data as a file blob
     *
     * Blob API: https://developer.mozilla.org/en-US/docs/Web/API/Blob
     */
    getBlob(): Blob;
}
