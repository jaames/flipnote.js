import { LitElement } from 'lit-element';
declare type SliderOrientation = 'horizontal' | 'vertical';
/**
 * @category Web Component
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
