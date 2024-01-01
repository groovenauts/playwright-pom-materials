import {Locator} from '@playwright/test';

export class Displayable {
  constructor(readonly _locator: Locator) {}

  isVisible(): Promise<boolean> {
    return this._locator.isVisible();
  }

  isHidden(): Promise<boolean> {
    return this._locator.isHidden();
  }

  shouldBeVisible(options?: {timeout?: number}): Promise<void> {
    return this._locator.waitFor({state: 'visible', ...options});
  }

  async shouldNotBeVisible(options?: {timeout?: number}): Promise<void> {
    if (await this._locator.isHidden()) {
      return; // 見えていないのであればOK
    } else {
      return this._locator.waitFor({state: 'hidden', ...options});
    }
  }

  async textContent(): Promise<string> {
    return (await this._locator.textContent()) || '';
  }
}
