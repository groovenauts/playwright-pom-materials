import {ElementHandle, FrameLocator, Locator, LocatorScreenshotOptions, Page} from '@playwright/test';
import { PageFunctionOn, SmartHandle, EvaluationArgument } from 'playwright-core/types/structs';

export class Displayable implements Locator {
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

  evaluate<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg, options?: { timeout?: number | undefined; } | undefined): Promise<R>;
  evaluate<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, void, R>, options?: { timeout?: number | undefined; } | undefined): Promise<R>;
  evaluate(pageFunction: unknown, arg?: unknown, options?: unknown): Promise<R> | Promise<R> {
    throw new Error('Method not implemented.');
  }
  evaluateHandle<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<SmartHandle<R>>;
  evaluateHandle<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, void, R>): Promise<SmartHandle<R>>;
  evaluateHandle(pageFunction: unknown, arg?: unknown): Promise<import("playwright-core/types/structs").SmartHandle<R>> | Promise<import("playwright-core/types/structs").SmartHandle<R>> {
    throw new Error('Method not implemented.');
  }
  evaluateAll<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;
  evaluateAll<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E[], void, R>): Promise<R>;
  evaluateAll(pageFunction: unknown, arg?: unknown): Promise<R> | Promise<R> {
    throw new Error('Method not implemented.');
  }
  elementHandle(options?: { timeout?: number | undefined; } | undefined): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    throw new Error('Method not implemented.');
  }
  all(): Promise<Locator[]> {
    throw new Error('Method not implemented.');
  }
  allInnerTexts(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  allTextContents(): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  and(locator: Locator): Locator {
    throw new Error('Method not implemented.');
  }
  blur(options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  boundingBox(options?: { timeout?: number | undefined; } | undefined): Promise<{ x: number; y: number; width: number; height: number; } | null> {
    throw new Error('Method not implemented.');
  }
  check(options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  clear(options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  click(options?: { button?: 'left' | 'right' | 'middle' | undefined; clickCount?: number | undefined; delay?: number | undefined; force?: boolean | undefined; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  count(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  dblclick(options?: { button?: 'left' | 'right' | 'middle' | undefined; delay?: number | undefined; force?: boolean | undefined; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  dispatchEvent(type: string, eventInit?: EvaluationArgument | undefined, options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  dragTo(target: Locator, options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; sourcePosition?: { x: number; y: number; } | undefined; targetPosition?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  elementHandles(): Promise<ElementHandle<Node>[]> {
    throw new Error('Method not implemented.');
  }
  fill(value: string, options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  filter(options?: { has?: Locator | undefined; hasNot?: Locator | undefined; hasNotText?: string | RegExp | undefined; hasText?: string | RegExp | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  first(): Locator {
    throw new Error('Method not implemented.');
  }
  focus(options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  frameLocator(selector: string): FrameLocator {
    throw new Error('Method not implemented.');
  }
  getAttribute(name: string, options?: { timeout?: number | undefined; } | undefined): Promise<string | null> {
    throw new Error('Method not implemented.');
  }
  getByAltText(text: string | RegExp, options?: { exact?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  getByLabel(text: string | RegExp, options?: { exact?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  getByPlaceholder(text: string | RegExp, options?: { exact?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  getByRole(role: 'search' | 'link' | 'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'blockquote' | 'button' | 'caption' | 'cell' | 'checkbox' | 'code' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 'deletion' | 'dialog' | 'directory' | 'document' | 'emphasis' | 'feed' | 'figure' | 'form' | 'generic' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'insertion' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math' | 'meter' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'navigation' | 'none' | 'note' | 'option' | 'paragraph' | 'presentation' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'strong' | 'subscript' | 'superscript' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'time' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem', options?: { checked?: boolean | undefined; disabled?: boolean | undefined; exact?: boolean | undefined; expanded?: boolean | undefined; includeHidden?: boolean | undefined; level?: number | undefined; name?: string | RegExp | undefined; pressed?: boolean | undefined; selected?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  getByTestId(testId: string | RegExp): Locator {
    throw new Error('Method not implemented.');
  }
  getByText(text: string | RegExp, options?: { exact?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  getByTitle(text: string | RegExp, options?: { exact?: boolean | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  highlight(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  hover(options?: { force?: boolean | undefined; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  innerHTML(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  innerText(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  inputValue(options?: { timeout?: number | undefined; } | undefined): Promise<string> {
    throw new Error('Method not implemented.');
  }
  isChecked(options?: { timeout?: number | undefined; } | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isDisabled(options?: { timeout?: number | undefined; } | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isEditable(options?: { timeout?: number | undefined; } | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  isEnabled(options?: { timeout?: number | undefined; } | undefined): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  last(): Locator {
    throw new Error('Method not implemented.');
  }
  locator(selectorOrLocator: string | Locator, options?: { has?: Locator | undefined; hasNot?: Locator | undefined; hasNotText?: string | RegExp | undefined; hasText?: string | RegExp | undefined; } | undefined): Locator {
    throw new Error('Method not implemented.');
  }
  nth(index: number): Locator {
    throw new Error('Method not implemented.');
  }
  or(locator: Locator): Locator {
    throw new Error('Method not implemented.');
  }
  page(): Page {
    throw new Error('Method not implemented.');
  }
  press(key: string, options?: { delay?: number | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  pressSequentially(text: string, options?: { delay?: number | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  screenshot(options?: LocatorScreenshotOptions | undefined): Promise<Buffer> {
    throw new Error('Method not implemented.');
  }
  scrollIntoViewIfNeeded(options?: { timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  selectOption(values: string | ElementHandle<Node> | string[] | { value?: string | undefined; label?: string | undefined; index?: number | undefined; } | ElementHandle<Node>[] | { value?: string | undefined; label?: string | undefined; index?: number | undefined; }[] | null, options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  selectText(options?: { force?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setChecked(checked: boolean, options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setInputFiles(files: string | string[] | { name: string; mimeType: string; buffer: Buffer; } | { name: string; mimeType: string; buffer: Buffer; }[], options?: { noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  tap(options?: { force?: boolean | undefined; modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  type(text: string, options?: { delay?: number | undefined; noWaitAfter?: boolean | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  uncheck(options?: { force?: boolean | undefined; noWaitAfter?: boolean | undefined; position?: { x: number; y: number; } | undefined; timeout?: number | undefined; trial?: boolean | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
  waitFor(options?: { state?: 'attached' | 'detached' | 'visible' | 'hidden' | undefined; timeout?: number | undefined; } | undefined): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
