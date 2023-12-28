import {
  ElementHandle,
  FrameLocator,
  Locator,
  LocatorScreenshotOptions,
  Page,
} from '@playwright/test';
import {
  PageFunctionOn,
  SmartHandle,
  EvaluationArgument,
} from 'playwright-core/types/structs';

export class Displayable implements Locator {
  constructor(readonly _locator: Locator) {}

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

  evaluate<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(
    pageFunction: PageFunctionOn<E, Arg, R>,
    arg: Arg,
    options?: {timeout?: number | undefined} | undefined
  ): Promise<R>;
  evaluate<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(
    pageFunction: PageFunctionOn<E, void, R>,
    options?: {timeout?: number | undefined} | undefined
  ): Promise<R>;
  evaluate<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(
    pageFunction: PageFunctionOn<E, Arg, R> | PageFunctionOn<E, void, R>,
    argOrOptions?: Arg | {timeout?: number | undefined} | undefined,
    options?: {timeout?: number | undefined} | undefined
  ): Promise<R> | Promise<R> {
    if (options && (options as {timeout?: number | undefined}).timeout) {
      return this._locator.evaluate(
        pageFunction as PageFunctionOn<E, Arg, R>,
        argOrOptions as Arg,
        options
      );
    } else if (argOrOptions) {
      if ((argOrOptions as {timeout?: number | undefined}).timeout) {
        return this._locator.evaluate(
          pageFunction as PageFunctionOn<E, void, R>,
          argOrOptions as {timeout?: number | undefined}
        );
      }
      return this._locator.evaluate(
        pageFunction as PageFunctionOn<E, Arg, R>,
        argOrOptions as Arg
      );
    }
    return this._locator.evaluate(pageFunction as PageFunctionOn<E, void, R>);
  }

  evaluateHandle<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<SmartHandle<R>>;
  evaluateHandle<
    R,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(pageFunction: PageFunctionOn<E, void, R>): Promise<SmartHandle<R>>;
  evaluateHandle<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(
    pageFunction: PageFunctionOn<E, Arg, R> | PageFunctionOn<E, void, R>,
    arg?: Arg
  ):
    | Promise<import('playwright-core/types/structs').SmartHandle<R>>
    | Promise<import('playwright-core/types/structs').SmartHandle<R>> {
    if (arg) {
      return this._locator.evaluateHandle(
        pageFunction as PageFunctionOn<E, Arg, R>,
        arg
      );
    }
    return this._locator.evaluateHandle(
      pageFunction as PageFunctionOn<E, void, R>
    );
  }

  evaluateAll<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;
  evaluateAll<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(
    pageFunction: PageFunctionOn<E[], void, R>
  ): Promise<R>;
  evaluateAll<
    R,
    Arg,
    E extends SVGElement | HTMLElement = SVGElement | HTMLElement
  >(
    pageFunction: PageFunctionOn<E[], Arg, R> | PageFunctionOn<E[], void, R>,
    arg?: Arg
  ): Promise<R> | Promise<R> {
    if (arg) {
      return this._locator.evaluateAll(
        pageFunction as PageFunctionOn<E[], Arg, R>,
        arg
      );
    }
    return this._locator.evaluateAll(
      pageFunction as PageFunctionOn<E[], void, R>
    );
  }

  elementHandle(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<ElementHandle<SVGElement | HTMLElement> | null> {
    return this._locator.elementHandle(options);
  }
  all(): Promise<Locator[]> {
    return this._locator.all();
  }
  allInnerTexts(): Promise<string[]> {
    return this._locator.allInnerTexts();
  }
  allTextContents(): Promise<string[]> {
    return this._locator.allTextContents();
  }
  and(locator: Locator): Locator {
    return this._locator.and(locator);
  }
  blur(options?: {timeout?: number | undefined} | undefined): Promise<void> {
    return this._locator.blur(options);
  }
  boundingBox(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<{x: number; y: number; width: number; height: number} | null> {
    return this._locator.boundingBox(options);
  }
  check(
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.check(options);
  }
  clear(
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.clear(options);
  }
  click(
    options?:
      | {
          button?: 'left' | 'right' | 'middle' | undefined;
          clickCount?: number | undefined;
          delay?: number | undefined;
          force?: boolean | undefined;
          modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.click(options);
  }
  count(): Promise<number> {
    return this._locator.count();
  }
  dblclick(
    options?:
      | {
          button?: 'left' | 'right' | 'middle' | undefined;
          delay?: number | undefined;
          force?: boolean | undefined;
          modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.dblclick(options);
  }
  dispatchEvent(
    type: string,
    eventInit?: EvaluationArgument | undefined,
    options?: {timeout?: number | undefined} | undefined
  ): Promise<void> {
    return this._locator.dispatchEvent(type, eventInit, options);
  }
  dragTo(
    target: Locator,
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          sourcePosition?: {x: number; y: number} | undefined;
          targetPosition?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.dragTo(target, options);
  }
  elementHandles(): Promise<ElementHandle<Node>[]> {
    return this._locator.elementHandles();
  }
  fill(
    value: string,
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.fill(value, options);
  }
  filter(
    options?:
      | {
          has?: Locator | undefined;
          hasNot?: Locator | undefined;
          hasNotText?: string | RegExp | undefined;
          hasText?: string | RegExp | undefined;
        }
      | undefined
  ): Locator {
    return this._locator.filter(options);
  }
  first(): Locator {
    return this._locator.first();
  }
  focus(options?: {timeout?: number | undefined} | undefined): Promise<void> {
    return this._locator.focus(options);
  }
  frameLocator(selector: string): FrameLocator {
    return this._locator.frameLocator(selector);
  }
  getAttribute(
    name: string,
    options?: {timeout?: number | undefined} | undefined
  ): Promise<string | null> {
    return this._locator.getAttribute(name, options);
  }
  getByAltText(
    text: string | RegExp,
    options?: {exact?: boolean | undefined} | undefined
  ): Locator {
    return this._locator.getByAltText(text, options);
  }
  getByLabel(
    text: string | RegExp,
    options?: {exact?: boolean | undefined} | undefined
  ): Locator {
    return this._locator.getByLabel(text, options);
  }
  getByPlaceholder(
    text: string | RegExp,
    options?: {exact?: boolean | undefined} | undefined
  ): Locator {
    return this._locator.getByPlaceholder(text, options);
  }
  getByRole(
    role:
      | 'search'
      | 'link'
      | 'alert'
      | 'alertdialog'
      | 'application'
      | 'article'
      | 'banner'
      | 'blockquote'
      | 'button'
      | 'caption'
      | 'cell'
      | 'checkbox'
      | 'code'
      | 'columnheader'
      | 'combobox'
      | 'complementary'
      | 'contentinfo'
      | 'definition'
      | 'deletion'
      | 'dialog'
      | 'directory'
      | 'document'
      | 'emphasis'
      | 'feed'
      | 'figure'
      | 'form'
      | 'generic'
      | 'grid'
      | 'gridcell'
      | 'group'
      | 'heading'
      | 'img'
      | 'insertion'
      | 'list'
      | 'listbox'
      | 'listitem'
      | 'log'
      | 'main'
      | 'marquee'
      | 'math'
      | 'meter'
      | 'menu'
      | 'menubar'
      | 'menuitem'
      | 'menuitemcheckbox'
      | 'menuitemradio'
      | 'navigation'
      | 'none'
      | 'note'
      | 'option'
      | 'paragraph'
      | 'presentation'
      | 'progressbar'
      | 'radio'
      | 'radiogroup'
      | 'region'
      | 'row'
      | 'rowgroup'
      | 'rowheader'
      | 'scrollbar'
      | 'searchbox'
      | 'separator'
      | 'slider'
      | 'spinbutton'
      | 'status'
      | 'strong'
      | 'subscript'
      | 'superscript'
      | 'switch'
      | 'tab'
      | 'table'
      | 'tablist'
      | 'tabpanel'
      | 'term'
      | 'textbox'
      | 'time'
      | 'timer'
      | 'toolbar'
      | 'tooltip'
      | 'tree'
      | 'treegrid'
      | 'treeitem',
    options?:
      | {
          checked?: boolean | undefined;
          disabled?: boolean | undefined;
          exact?: boolean | undefined;
          expanded?: boolean | undefined;
          includeHidden?: boolean | undefined;
          level?: number | undefined;
          name?: string | RegExp | undefined;
          pressed?: boolean | undefined;
          selected?: boolean | undefined;
        }
      | undefined
  ): Locator {
    return this._locator.getByRole(role, options);
  }
  getByTestId(testId: string | RegExp): Locator {
    return this._locator.getByTestId(testId);
  }
  getByText(
    text: string | RegExp,
    options?: {exact?: boolean | undefined} | undefined
  ): Locator {
    return this._locator.getByText(text, options);
  }
  getByTitle(
    text: string | RegExp,
    options?: {exact?: boolean | undefined} | undefined
  ): Locator {
    return this._locator.getByTitle(text, options);
  }
  highlight(): Promise<void> {
    return this._locator.highlight();
  }
  hover(
    options?:
      | {
          force?: boolean | undefined;
          modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.hover(options);
  }
  innerHTML(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<string> {
    return this._locator.innerHTML(options);
  }
  innerText(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<string> {
    return this._locator.innerText(options);
  }
  inputValue(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<string> {
    return this._locator.inputValue(options);
  }
  isChecked(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isChecked(options);
  }
  isDisabled(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isDisabled(options);
  }
  isEditable(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isEditable(options);
  }
  isEnabled(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isEnabled(options);
  }
  isHidden(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isHidden(options);
  }
  isVisible(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<boolean> {
    return this._locator.isVisible(options);
  }
  last(): Locator {
    return this._locator.last();
  }
  locator(
    selectorOrLocator: string | Locator,
    options?:
      | {
          has?: Locator | undefined;
          hasNot?: Locator | undefined;
          hasNotText?: string | RegExp | undefined;
          hasText?: string | RegExp | undefined;
        }
      | undefined
  ): Locator {
    return this._locator.locator(selectorOrLocator, options);
  }
  nth(index: number): Locator {
    return this._locator.nth(index);
  }
  or(locator: Locator): Locator {
    return this._locator.or(locator);
  }
  page(): Page {
    return this._locator.page();
  }
  press(
    key: string,
    options?:
      | {
          delay?: number | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.press(key, options);
  }
  pressSequentially(
    text: string,
    options?:
      | {
          delay?: number | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.pressSequentially(text, options);
  }
  screenshot(options?: LocatorScreenshotOptions | undefined): Promise<Buffer> {
    return this._locator.screenshot(options);
  }
  scrollIntoViewIfNeeded(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<void> {
    return this._locator.scrollIntoViewIfNeeded(options);
  }
  selectOption(
    values:
      | string
      | ElementHandle<Node>
      | string[]
      | {
          value?: string | undefined;
          label?: string | undefined;
          index?: number | undefined;
        }
      | ElementHandle<Node>[]
      | {
          value?: string | undefined;
          label?: string | undefined;
          index?: number | undefined;
        }[]
      | null,
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<string[]> {
    return this._locator.selectOption(values, options);
  }
  selectText(
    options?:
      | {force?: boolean | undefined; timeout?: number | undefined}
      | undefined
  ): Promise<void> {
    return this._locator.selectText(options);
  }
  setChecked(
    checked: boolean,
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.setChecked(checked, options);
  }
  setInputFiles(
    files:
      | string
      | string[]
      | {name: string; mimeType: string; buffer: Buffer}
      | {name: string; mimeType: string; buffer: Buffer}[],
    options?:
      | {noWaitAfter?: boolean | undefined; timeout?: number | undefined}
      | undefined
  ): Promise<void> {
    return this._locator.setInputFiles(files, options);
  }
  tap(
    options?:
      | {
          force?: boolean | undefined;
          modifiers?: ('Alt' | 'Control' | 'Meta' | 'Shift')[] | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.tap(options);
  }
  textContent(
    options?: {timeout?: number | undefined} | undefined
  ): Promise<string | null> {
    return this._locator.textContent(options);
  }
  type(
    text: string,
    options?:
      | {
          delay?: number | undefined;
          noWaitAfter?: boolean | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.type(text, options);
  }
  uncheck(
    options?:
      | {
          force?: boolean | undefined;
          noWaitAfter?: boolean | undefined;
          position?: {x: number; y: number} | undefined;
          timeout?: number | undefined;
          trial?: boolean | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.uncheck(options);
  }
  waitFor(
    options?:
      | {
          state?: 'attached' | 'detached' | 'visible' | 'hidden' | undefined;
          timeout?: number | undefined;
        }
      | undefined
  ): Promise<void> {
    return this._locator.waitFor(options);
  }
}
