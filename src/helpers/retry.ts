import {config} from './config';
import {
  RetryUntilTimeoutOptions,
  defaultRetryUntilTimeoutOptions,
  RetryAttemptOptions,
  isRetryAttemptOptions,
  defaultRetryAttemptsOptions,
  RetryOptions,
} from './retryOptions';

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
export const defaultUiRetryOptions = {
  ...defaultRetryUntilTimeoutOptions,
  timeout: config.timeoutUnit * 30,
  interval: config.timeoutUnit * 1,
};

export const retryBase = async (
  fn: () => Promise<boolean>,
  defaultOptions: Required<RetryUntilTimeoutOptions>,
  options?: RetryOptions
): Promise<void> => {
  if (isRetryAttemptOptions(options)) {
    await retryAttempts(fn, options);
  } else {
    await retryUntilTimeout(fn, {...defaultOptions, ...options});
  }
};

/**
 * 引数 fn が true を返すまで処理を繰り返す関数。
 * 繰り返し処理を行う最大時間をオプションの timeout で指定可能。
 *
 * 例外が起きたらすぐに throw する場合は options.throwOn に 'catch' を追加する。
 * timeoutを過ぎた際に例外を throw する場合は options.throwOn に 'timeout' を追加する。
 * 例外が起きてもリトライし、timeoutを過ぎても例外を throw しない場合は options.throwOn に [] を指定する。
 *
 * @param { {(): Promise<boolean>} } fn 実行に成功したら true を返す(Promiseを返す)関数
 * @param [options]
 * @param {number} [options.timeout] タイムアウトをミリ秒で指定。デフォルトは 2 * 60 * config.timeoutUnit
 * @param {number} [options.interval] fnを実行するまでの間隔。ミリ秒で指定。デフォルトは 10 * config.timeoutUnit
 * @param { {(number): Promise<void>} } [options.intervalFunc] fnを実行するまでの間隔を指定する関数。デフォルトは sleep
 * @param { ('catch'|'timeout')[] } [options.throwOn] 例外が起きた場合にthrowするタイミング。デフォルトは ['timeout']
 * @param { {(errors: unknown[]): Promise<void>} } [options.errorFunc] 例外が起きた場合に呼び出される関数。デフォルトでは、最後のエラー あるいは 'Timeout Error' というErrorをthrowする
 */
export const retryUntilTimeout = async (
  fn: () => Promise<boolean>,
  options?: RetryUntilTimeoutOptions
): Promise<void> => {
  const opts = {...defaultRetryUntilTimeoutOptions, ...options};

  const t0 = Date.now();
  const errors: unknown[] = [];
  while (Date.now() - t0 < opts.timeout) {
    try {
      const x = await fn();
      if (x) return;
    } catch (err) {
      errors.push(err);
      if (opts.throwOn.includes('catch')) await opts.errorFunc(errors);
      console.debug('retry function ignored an error: ', err);
    }
    await opts.intervalFunc(opts.interval);
  }
  if (opts.throwOn.includes('timeout')) await opts.errorFunc(errors);
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
  fn: () => Promise<boolean>,
  options?: RetryAttemptOptions
): Promise<void> => {
  const {maxAttempts, interval, throwOn, errorFunc, intervalFunc} = {
    ...defaultRetryAttemptsOptions,
    ...options,
  };

  const errors: unknown[] = [];
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    try {
      const x = await fn();
      if (x) return;
    } catch (err) {
      errors.push(err);
      if (throwOn.includes('catch')) await errorFunc(errors);
      console.debug('retry function ignored an error: ', err);
    }
    await intervalFunc(interval);
  }
  if (throwOn.includes('exceeded')) await errorFunc(errors);
};
