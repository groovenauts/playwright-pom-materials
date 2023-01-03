import {Clickable, ClickableOptions} from './Clickable';
import {retry} from '../helpers/playwright';

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
    return this.locator.evaluate((el): string | undefined => {
      const sel = el as HTMLSelectElement;
      const idx = sel.selectedIndex;
      return idx > -1
        ? sel.options[idx].textContent?.trim() || undefined
        : undefined;
    });
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
    return retry(this.locator, async (): Promise<boolean> => {
      await this.select(label, options);
      const value = await this.label();
      return fn(value);
    });
  }

  hasOption(label: string): Promise<boolean> {
    const locator = this.locator.locator(
      `.. >> select:has(option:text("${label}"))`
    );
    return locator.isVisible();
  }
}