import {Locator} from 'playwright-core';

import {RetryOptions, LocatorPredicate} from '../helpers/playwright';

import {Operable, OperableOptions} from './Operable';

export type ClickOptions = {timeout?: number};

export type ClickableOptions = OperableOptions & {
  beforeClick?: () => Promise<void>;
  afterClick?: () => Promise<void>;
  clickAction?: {(locator: Locator, options?: ClickOptions): Promise<void>};
};

export class Clickable extends Operable {
  private beforeClick?: () => Promise<void>;
  private afterClick?: () => Promise<void>;
  private clickAction: {
    (locator: Locator, options?: ClickOptions): Promise<void>;
  };
  constructor(locator: Locator, options?: ClickableOptions) {
    super(locator, options);
    this.beforeClick = options?.beforeClick;
    this.afterClick = options?.afterClick;
    this.clickAction =
      options?.clickAction || ((locator, options) => locator.click(options));
  }

  async click(options?: ClickOptions): Promise<void> {
    if (this.beforeClick) await this.beforeClick();

    await this.clickAction(this.targetLocator(), options);

    if (this.afterClick) await this.afterClick();
  }

  protected targetLocator(): Locator {
    return this.locator;
  }

  async waitAndClick(waitOptions?: RetryOptions): Promise<void> {
    await this.waitForBeingEnabled(waitOptions);
    await this.click();
  }

  async waitAndClickWith(
    fn: LocatorPredicate,
    waitOptions?: RetryOptions
  ): Promise<void> {
    await this.waitForBeingEnabledWith(fn, waitOptions);
    await this.click();
  }
}
