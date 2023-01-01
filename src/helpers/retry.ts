import {config} from './config';
import {
  retryUntilTimeout,
  RetryUntilTimeoutOptions,
  defaultRetryUntilTimeoutOptions,
  newDefaultRetryUntilTimeoutOptions,
  fillRetryUntilTimeoutOptions,
} from './retryUntilTimeout';
import {
  retryAttempts,
  RetryAttemptOptions,
  isRetryAttemptOptions,
} from './retryAttempts';

export type RetryOptions = RetryUntilTimeoutOptions | RetryAttemptOptions;

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。
 *
 * オプションに maxAttempts を指定する場合の振る舞いは retryAttempts と同じ。
 * オプションに maxAttempts を指定されない場合の振る舞いは retryUntilTimeout と同じ。
 */
export const retry = (
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => retryBase(fn, defaultRetryUntilTimeoutOptions, options);

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。UI操作用。
 *
 * オプションに maxAttempts を指定する場合の振る舞いは retryAttempts と同じ。
 * オプションに maxAttempts を指定されない場合の振る舞いは retryUntilTimeout と同じ。
 *
 * @param [options]
 * @param {number} [options.timeout] タイムアウトをミリ秒で指定。デフォルトは 2 * 60 * config.timeoutUnit
 * @param {number} [options.interval] fnを実行するまでの間隔。ミリ秒で指定。デフォルトは uiTimeout(30)
 */
export const uiRetry = (
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => retryBase(fn, defaultUiRetryOptions, options);
export const defaultUiRetryOptions = newDefaultRetryUntilTimeoutOptions(
  config.timeoutUnit * 30,
  config.timeoutUnit * 1
);

export const retryBase = async (
  fn: () => Promise<boolean>,
  defaultOptions: Required<RetryUntilTimeoutOptions>,
  options?: RetryOptions
): Promise<void> => {
  if (isRetryAttemptOptions(options)) {
    await retryAttempts(fn, options);
  } else {
    options = fillRetryUntilTimeoutOptions(options, defaultOptions);
    await retryUntilTimeout(fn, options);
  }
};
