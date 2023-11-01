import {Locator, Page} from '@playwright/test';
import {config} from '../config';

import {retry, retryAttempts} from '../retry';
import {
  RetryOptions,
  RetryAttemptOptions,
  RetryAttemptOptionsMain,
  isRetryUntilTimeoutOptions,
  isRetryAttemptOptions,
} from '../retryOptions';
import {sleepFunc} from './sleepFunc';

/**
 * 引数 locator について fn (の返すPromise) がtrueを返すまでリトライします。
 *
 * @param x
 * @param fn
 * @param options
 * @returns
 */
export const pwRetryForMaterial = async <T extends Locator | Page>(
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

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。
 *
 * オプションに maxAttempts を指定する場合の振る舞いは retryAttempts と同じ。
 * オプションに maxAttempts を指定されない場合の振る舞いは retryUntilTimeout と同じ。
 */
export const pwRetry = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => {
  options = options || {};
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  await retry(fn, options);
};

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
export const pwRetryUi = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => {
  if (!isRetryAttemptOptions(options)) {
    options = {
      timeout: config.timeoutUnit * 30,
      interval: config.timeoutUnit * 1,
      ...options,
    };
  }
  await pwRetry(x, fn, options);
};

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。
 * 繰り返しの上限をオプションの maxAttempts で指定可能。
 *
 * 例外が起きたらすぐに throw する場合は options.throwOn に 'catch' を追加する。
 * maxAttemptsを超えた際に例外を throw する場合は options.throwOn に 'exceeded' を追加する。
 * 例外が起きてもリトライし、maxAttemptsを超えても例外を throw しない場合は options.throwOn に [] を指定する。
 *
 * @param { {(): Promise<boolean>} } fn 実行に成功したら true を返す(Promiseを返す)関数
 * @param [options]
 * @param {number} [options.timeout] タイムアウトをミリ秒で指定。デフォルトは 2 * 60 * config.timeoutUnit
 * @param {number} [options.interval] { number }fnを実行するまでの間隔。ミリ秒で指定。デフォルトは 10 * config.timeoutUnit
 * @param { {(number): Promise<void>} } [options.intervalFunc] fnを実行するまでの間隔を指定する関数。デフォルトは sleep
 * @param { ('catch'|'exceeded')[] } [options.throwOn] 例外が起きた場合にthrowするタイミング。デフォルトは ['exceeded']
 * @param { {(errors: unknown[]): Promise<void>} } [options.errorFunc] 例外が起きた場合に呼び出される関数。デフォルトでは、最後のエラー あるいは 'Retry exceeded maxAttempts' というErrorをthrowする
 */
export const pwRetryAttempts = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryAttemptOptions
): Promise<void> => {
  options = options || {};
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  await retryAttempts(fn, options);
};
