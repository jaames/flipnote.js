import { directive, Directive } from 'lit/async-directive.js';

interface PartInfo {
  readonly [name: string]: string | boolean | number;
};

class PartMapDirective extends Directive {
  render(partInfo: PartInfo) {
    return Object.keys(partInfo)
      .filter((key) => partInfo[key])
      .join(' ');
  }
};

export const partMap = directive(PartMapDirective);