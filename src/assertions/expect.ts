import {expect as origExpect} from '@playwright/test';
import type {Locator} from '@playwright/test';
import {Displayable} from '../materials/Displayable';

type ExpectReturnType = ReturnType<typeof origExpect>;
type SoftType = typeof origExpect.soft;
type ConfigureType = typeof origExpect.configure;
type PollType = typeof origExpect.poll;
type ExtendType = typeof origExpect.extend;

export type ExpectType = {
  (
    x: Locator | Displayable,
    messageOrOptions?: string | {message?: string}
  ): ExpectReturnType;

  // These methods are experimental
  // See https://playwright.dev/docs/test-assertions#negating-matchers for more detail
  soft: SoftType;
  configure: ConfigureType;
  poll: PollType;
  extend: ExtendType;
};

export const expect = ((): ExpectType => {
  const body = (
    x: Locator | Displayable,
    messageOrOptions?: string | {message?: string}
  ): ExpectReturnType => {
    const locator = x instanceof Displayable ? x._locator : x;
    return origExpect(locator as unknown, messageOrOptions);
  };
  return Object.assign(body, {
    soft: origExpect.soft.bind(body),
    configure: origExpect.configure.bind(body),
    poll: origExpect.poll.bind(body),
    extend: origExpect.extend.bind(body),
  });
})();
