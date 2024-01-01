import {Locator} from '@playwright/test';

import {
  LocatorPredicate,
  reverseLocatorPredicate,
  hasDisabledAttr,
  pwRetryForMaterial,
  RetryOptions,
} from '../helpers/playwright';

import {Displayable} from './Displayable';

export type OperableOptions = {
  disabledPredicate?: LocatorPredicate;
};

export class Operable extends Displayable {
  protected disabledPredicate: LocatorPredicate;

  constructor(locator: Locator, options?: OperableOptions) {
    super(locator);
    this.disabledPredicate = options?.disabledPredicate || hasDisabledAttr;
  }

  isDisabled(): Promise<boolean> {
    return this.disabledPredicate(this._locator);
  }
  async isEnabled(): Promise<boolean> {
    return !(await this.isDisabled());
  }

  async waitForBeingEnabled(options?: RetryOptions): Promise<void> {
    await pwRetryForMaterial(
      this._locator,
      reverseLocatorPredicate(this.disabledPredicate),
      options
    );
  }

  async waitForBeingEnabledWith(
    fn: LocatorPredicate,
    options?: RetryOptions
  ): Promise<void> {
    const origFn = reverseLocatorPredicate(this.disabledPredicate);
    await pwRetryForMaterial(
      this._locator,
      async (l: Locator) => {
        return (await origFn(l)) && (await fn(l));
      },
      options
    );
  }

  shouldBeEnabled(options?: RetryOptions): Promise<void> {
    return this.waitForBeingEnabled(options);
  }

  async shouldBeDisabled(): Promise<void> {
    await pwRetryForMaterial(this._locator, this.disabledPredicate);
  }
}
