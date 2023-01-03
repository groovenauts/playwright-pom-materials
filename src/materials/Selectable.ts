import {Locator} from 'playwright-core';

import {
  LocatorPredicate,
  reverseLocatorPredicate,
  pwRetryForMaterial,
  uiRetry,
  hasClassFunc,
  RetryOptions,
} from '../helpers/playwright';

import {Clickable, ClickableOptions} from './Clickable';

export const hasSelectedClass = hasClassFunc('selected');

export type SelectableOptions = ClickableOptions & {
  selectedPredicate?: LocatorPredicate;
};

export class Selectable extends Clickable {
  protected selectedPredicate: LocatorPredicate;

  constructor(locator: Locator, options?: SelectableOptions) {
    super(locator, options);
    this.selectedPredicate = options?.selectedPredicate || hasSelectedClass;
  }

  isSelected(): Promise<boolean> {
    return this.selectedPredicate(this.locator);
  }

  set(value: boolean, options?: RetryOptions): Promise<void> {
    return value ? this.select(options) : this.deselect(options);
  }

  async shouldBeSelected(): Promise<void> {
    await pwRetryForMaterial(this.locator, this.selectedPredicate);
  }

  async shouldNotBeSelected(): Promise<void> {
    await pwRetryForMaterial(
      this.locator,
      reverseLocatorPredicate(this.selectedPredicate)
    );
  }

  async select(options?: RetryOptions): Promise<void> {
    await uiRetry(
      this.locator,
      async () => {
        if (await this.isSelected()) return true;
        await this.click();
        return false;
      },
      options
    );
  }

  async deselect(options?: RetryOptions): Promise<void> {
    await uiRetry(
      this.locator,
      async () => {
        if (!(await this.isSelected())) return true;
        await this.click();
        return false;
      },
      options
    );
  }
}
