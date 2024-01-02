import {Locator, expect as origExpect} from '@playwright/test';
import {Displayable} from '../materials/Displayable';

type ExpectReturnType<T> = ReturnType<typeof origExpect<T>>;
type SoftType = typeof origExpect.soft;
type ConfigureType = typeof origExpect.configure;
type PollType = typeof origExpect.poll;
type ExtendType = typeof origExpect.extend;

export type ExpectType = {
  <T>(
    x: T,
    messageOrOptions?: string | {message?: string}
  ): ExpectReturnType<T>;

  // These methods are experimental
  // See https://playwright.dev/docs/test-assertions#negating-matchers for more detail
  soft: SoftType;
  configure: ConfigureType;
  poll: PollType;
  extend: ExtendType;
};

const expectBody = <T>(
  x: T,
  messageOrOptions?: string | {message?: string}
): ExpectReturnType<T | Locator> => {
  return origExpect(
    x instanceof Displayable ? x._locator : x,
    messageOrOptions
  );
};

// export const expect = Object.assign(expectBody, {
//   soft: origExpect.soft.bind(expectBody),
//   configure: origExpect.configure.bind(expectBody),
//   poll: origExpect.poll.bind(expectBody),
//   extend: origExpect.extend.bind(expectBody),
// });

export const expect = expectBody;
