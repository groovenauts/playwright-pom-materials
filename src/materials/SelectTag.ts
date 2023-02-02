import {Locator} from 'playwright-core';
import {Clickable, ClickableOptions} from './Clickable';
import {pwRetry} from '../helpers/playwright';

export type SelectTagOptions = ClickableOptions;

export class SelectTag extends Clickable {
  async select(
    label:
      | string
      | RegExp
      | {value?: string; label?: string; index?: number; contains?: string},
    options?: {timeout?: number}
  ): Promise<void> {
    if (typeof label === 'string') {
      await this.locator.selectOption({label}, options);
    } else {
      if (label instanceof RegExp) {
        const regExpOpt = [
          label.ignoreCase ? 'i' : null,
          label.multiline ? 'm' : null,
          label.global ? 'g' : null,
        ]
          .filter(i => !!i)
          .join('');
        const optHandle = await this.locator
          .locator(`option:text-matches("${label.source}", "${regExpOpt}")`)
          .elementHandle();
        await this.locator.selectOption(optHandle, options);
      } else {
        if (label.contains) {
          const optHandle = await this.locator
            .locator(`option:has-text("${label.contains}")`)
            .elementHandle();
          await this.locator.selectOption(optHandle, options);
        } else {
          await this.locator.selectOption(label, options);
        }
      }
    }
  }

  async label(): Promise<string | undefined> {
    const value = await this.locator.inputValue();
    const l = this.locator.locator(`option[value="${value}"]`);
    return (await l.textContent()) || undefined;
  }

  set(
    label: string | RegExp | {contains: string},
    options?: {timeout?: number}
  ): Promise<void> {
    const fn =
      typeof label === 'string'
        ? (s?: string): boolean => s === label
        : label instanceof RegExp
        ? (s?: string): boolean => (s ? !!s.match(label) : false)
        : (s?: string): boolean => (s ? s.includes(label.contains) : false);
    return pwRetry(this.locator, async (): Promise<boolean> => {
      await this.select(label, options);
      const value = await this.label();
      return fn(value);
    });
  }

  private locatorWithOption(label: string): Locator {
    return this.locator.filter({
      has: this.locator.page().locator(`option:text("${label}")`),
    });
  }

  hasOption(label: string): Promise<boolean> {
    return this.locatorWithOption(label).isVisible();
  }

  shouldHaveOption(label: string, options?: {timeout?: number}): Promise<void> {
    return this.locatorWithOption(label).waitFor({
      state: 'visible',
      ...options,
    });
  }

  async selectOption(
    label: string,
    options?: {timeout?: number}
  ): Promise<void> {
    await this.shouldHaveOption(label, options);
    await this.select(label);
  }
}
