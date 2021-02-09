import { LitElement } from 'lit-element';
import { Flipnote } from '../Flipnote';
import { GifImage } from '../encoders';
/**
 * Flipnote player icon component
 *
 * @category Web Component
 * @internal
 */
export declare class ImageComponent extends LitElement {
    static get styles(): import("lit-element").CSSResult;
    gif: GifImage;
    note: Flipnote;
    private _src;
    private _frame;
    set src(src: any);
    get src(): any;
    set frame(frame: string);
    get frame(): string;
    cropped: boolean;
    private gifUrl;
    private imgTitle;
    /** @internal */
    render(): import("lit-element").TemplateResult;
    private revokeUrl;
    loadNote(note: Flipnote): void;
    load(src: any): void;
    disconnectedCallback(): void;
    private getTitle;
    private dispatchLoad;
    private dispatchError;
}
