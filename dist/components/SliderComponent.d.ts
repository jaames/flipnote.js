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
    onSliderMouseStart: (event: MouseEvent) => void;
    onSliderMouseEnd: (event: MouseEvent) => void;
    onSliderMouseMove: (event: MouseEvent) => void;
    onSliderTouchStart: (event: TouchEvent) => void;
    onSliderTouchEnd: (event: TouchEvent) => void;
    onSliderTouchMove: (event: TouchEvent) => void;
    onSliderInput: (x: number, y: number) => void;
    private dispatch;
}
export {};
