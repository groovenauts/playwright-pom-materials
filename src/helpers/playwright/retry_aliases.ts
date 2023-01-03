import {Locator, Page} from 'playwright-core';

export {RetryOptions} from '../retry'; // export type alias
export {RetryAttemptOptions} from '../retryOptions'; // export type alias

import {RetryOptions, retry as retryRaw, uiRetry as uiRetryRaw} from '../retry';
import {retryAttempts as retryAttemptsRaw} from '../retryAttempts';
import {RetryAttemptOptions} from '../retryOptions';
import {sleepFunc} from './sleepFunc';

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。
 *
 * オプションに maxAttempts を指定する場合の振る舞いは retryAttempts と同じ。
 * オプションに maxAttempts を指定されない場合の振る舞いは retryUntilTimeout と同じ。
 */
export const retry = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => {
  options = options || {};
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  await retryRaw(fn, options);
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
export const uiRetry = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryOptions
): Promise<void> => {
  options = options || {};
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  await uiRetryRaw(fn, options);
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
export const retryAttempts = async (
  x: Locator | Page,
  fn: () => Promise<boolean>,
  options?: RetryAttemptOptions
): Promise<void> => {
  options = options || {};
  options.intervalFunc = options.intervalFunc || sleepFunc(x);
  await retryAttemptsRaw(fn, options);
};
