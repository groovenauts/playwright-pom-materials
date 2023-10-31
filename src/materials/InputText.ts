import {Locator} from '@playwright/test';
import {pwRetryUi, RetryOptions} from '../helpers/playwright';

import {Operable, OperableOptions} from './Operable';

export type InputTextValueFunc = {(l: Locator): Promise<string>};

export type InputTextOptions = OperableOptions & {
  inputSelector?: string;
};

export class InputText extends Operable {
  private readonly inputSelector?: string;

  constructor(locator: Locator, options?: InputTextOptions) {
    super(locator, options);
    this.inputSelector = options?.inputSelector;
  }

  private get inputLocator(): Locator {
    return this.inputSelector
      ? this.locator.locator(this.inputSelector)
      : this.locator;
  }

  async fill(value: string): Promise<void> {
    return this.inputLocator.fill(value);
  }

  value(): Promise<string> {
    return this.inputLocator.inputValue();
  }

  async set(value: string, options?: RetryOptions): Promise<void> {
    await pwRetryUi(
      this.locator,
      async () => {
        await this.inputLocator.fill(value);
        return (await this.value()) === value;
      },
      options
    );
  }

  shouldHave(value: string): Promise<void> {
    // expect(await this.value()).toBe(value); のようなコードでも実現可能ではありますが、
    // Playwrightのエラーとしてトレースできないので、セレクタを保持しているかどうかを確認しています。
    return this.locator
      .locator(`.. >> [value="${value}"]`) // locatorで参照する要素に再度valueで絞り込みするために、一度親の階層に登っています
      .waitFor({state: 'visible'});
  }

  has(value: string): Promise<boolean> {
    return this.locator.locator(`.. >> [value="${value}"]`).isVisible();
  }

  isEditable(): Promise<boolean> {
    return this.locator.isEditable();
  }
}
