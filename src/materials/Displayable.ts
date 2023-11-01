import {Locator} from '@playwright/test';

export class Displayable {
  constructor(readonly locator: Locator) {}

  isVisible(): Promise<boolean> {
    return this.locator.isVisible();
  }

  isHidden(): Promise<boolean> {
    return this.locator.isHidden();
  }

  shouldBeVisible(options?: {timeout?: number}): Promise<void> {
    return this.locator.waitFor({state: 'visible', ...options});
  }

  async shouldNotBeVisible(options?: {timeout?: number}): Promise<void> {
    if (await this.locator.isHidden()) {
      return; // 見えていないのであればOK
    } else {
      return this.locator.waitFor({state: 'hidden', ...options});
    }
  }

  async textContent(): Promise<string> {
    return (await this.locator.textContent()) || '';
  }
}
