import { LitElement } from 'lit-element';
/** @internal */
declare type SliderOrientation = 'horizontal' | 'vertical';
/**
 * @category Web Component
 * @internal
 */
export declare class SliderComponent extends LitElement {
    static get styles(): import("lit-element").CSSResult;
    value: number;
    orientation: SliderOrientation;
    private isActive;
    private sliderElement;
    render(): import("lit-element").TemplateResult;
    onSliderInputStart: (event: MouseEvent) => void;
    onSliderInputEnd: (event: MouseEvent) => void;
    onSliderInput: (event: MouseEvent) => void;
    private dispatch;
}
export {};
