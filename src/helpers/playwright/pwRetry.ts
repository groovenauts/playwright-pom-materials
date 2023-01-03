import {Locator, Page} from 'playwright-core';
import {config} from '../config';

import {retry, RetryOptions} from '../retry';
import {RetryAttemptOptionsMain} from '../retryAttempts';
import {isRetryUntilTimeoutOptions} from '../retryOptions';
import {sleepFunc} from './sleepFunc';

/**
 * 引数 locator について fn (の返すPromise) がtrueを返すまでリトライします。
 *
 * @param x
 * @param fn
 * @param options
 * @returns
 */
export const pwRetry = async <T extends Locator | Page>(
  x: T,
  fn: (l: T) => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => {
  options = options || {};
  // デフォルトは retry とは異なり maxAttempts: 3
  if (!isRetryUntilTimeoutOptions(options)) {
    options = {
      ...defaultPwRetryOptionsMain,
      ...options,
    };
  }
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  const impl = (): Promise<boolean> => fn(x);

  await retry(impl, options);
};

const defaultPwRetryOptionsMain: Required<RetryAttemptOptionsMain> = {
  maxAttempts: 20,
  interval: config.timeoutUnit * 0.2, // milliseconds
};
