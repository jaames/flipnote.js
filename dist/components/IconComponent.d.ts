import { LitElement } from 'lit-element';
/**
 * Flipnote player icon component
 *
 * @category Web Component
 * @internal
 */
export declare class IconComponent extends LitElement {
    static get styles(): import("lit-element").CSSResult;
    /**
     * Available icons:
     * - `play`
     * - `pause`
     * - `loader`
     * - `volumeOn`
     * - `volumeOff`
     */
    icon: string;
    /** @internal */
    render(): import("lit-element").TemplateResult;
}
