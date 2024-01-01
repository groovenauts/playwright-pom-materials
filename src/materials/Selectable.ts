import {Locator} from '@playwright/test';

import {
  LocatorPredicate,
  reverseLocatorPredicate,
  pwRetryForMaterial,
  pwRetryUi,
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
    return this.selectedPredicate(this._locator);
  }

  set(value: boolean, options?: RetryOptions): Promise<void> {
    return value ? this.select(options) : this.deselect(options);
  }

  async shouldBeSelected(): Promise<void> {
    await pwRetryForMaterial(this._locator, this.selectedPredicate);
  }

  async shouldNotBeSelected(): Promise<void> {
    await pwRetryForMaterial(
      this._locator,
      reverseLocatorPredicate(this.selectedPredicate)
    );
  }

  async select(options?: RetryOptions): Promise<void> {
    await pwRetryUi(
      this._locator,
      async () => {
        if (await this.isSelected()) return true;
        await this.click();
        return false;
      },
      options
    );
  }

  async deselect(options?: RetryOptions): Promise<void> {
    await pwRetryUi(
      this._locator,
      async () => {
        if (!(await this.isSelected())) return true;
        await this.click();
        return false;
      },
      options
    );
  }
}
