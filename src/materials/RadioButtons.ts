import {Locator, Page} from '@playwright/test';
import {Selectable, SelectableOptions} from './Selectable';

export type SelectableArgs = string | [string, SelectableOptions?];

export class RadioButtons<Button extends string = string> {
  private readonly selectorFunc: {(key: Button): SelectableArgs};
  constructor(
    private readonly locator: Page | Locator,
    selectors:
      | {(key: Button): SelectableArgs}
      | {[key in Button]: SelectableArgs}
  ) {
    this.selectorFunc =
      typeof selectors === 'function'
        ? selectors
        : (key: Button): SelectableArgs => selectors[key];
  }

  button(name: Button): Selectable {
    const obj = this.selectorFunc(name);
    const [selector, options] = Array.isArray(obj) ? obj : [obj, undefined];
    return new Selectable(this.locator.locator(selector), options);
  }
}
