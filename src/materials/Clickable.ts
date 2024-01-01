import {Locator} from '@playwright/test';

import {RetryOptions, LocatorPredicate} from '../helpers/playwright';

import {Operable, OperableOptions} from './Operable';

export type ClickOptions = {timeout?: number};

export type ClickableOptions = OperableOptions & {
  beforeClick?: () => Promise<void>;
  afterClick?: () => Promise<void>;
  clickAction?: {(locator: Locator, options?: ClickOptions): Promise<void>};
  beforeDblClick?: () => Promise<void>;
  afterDblClick?: () => Promise<void>;
  dblclickAction?: {(locator: Locator, options?: ClickOptions): Promise<void>};
};

export class Clickable extends Operable {
  private beforeClick?: () => Promise<void>;
  private afterClick?: () => Promise<void>;
  private clickAction: {
    (locator: Locator, options?: ClickOptions): Promise<void>;
  };
  private beforeDblClick?: () => Promise<void>;
  private afterDblClick?: () => Promise<void>;
  private dblclickAction: {
    (locator: Locator, options?: ClickOptions): Promise<void>;
  };
  constructor(locator: Locator, options?: ClickableOptions) {
    super(locator, options);
    // click
    this.beforeClick = options?.beforeClick;
    this.afterClick = options?.afterClick;
    this.clickAction =
      options?.clickAction || ((locator, options) => locator.click(options));
    // dblclick
    this.beforeDblClick = options?.beforeDblClick;
    this.afterDblClick = options?.afterDblClick;
    this.dblclickAction =
      options?.dblclickAction ||
      ((locator, options) => locator.dblclick(options));
  }

  async click(options?: ClickOptions): Promise<void> {
    if (this.beforeClick) await this.beforeClick();

    await this.clickAction(this.targetLocator(), options);

    if (this.afterClick) await this.afterClick();
  }

  async dblclick(options?: ClickOptions): Promise<void> {
    if (this.beforeDblClick) await this.beforeDblClick();

    await this.dblclickAction(this.targetLocator(), options);

    if (this.afterDblClick) await this.afterDblClick();
  }

  protected targetLocator(): Locator {
    return this._locator;
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
