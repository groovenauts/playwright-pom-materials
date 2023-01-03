import {config} from './config';
import {sleep} from './sleep';

import {newErrorProcessor, RetryErrorProcessor} from './retryErrorFunc';

export type RetryUntilTimeoutOptionsMain = {
  timeout?: number;
  interval?: number;
};

type RetryUntilTimeoutOptionsBase = {
  intervalFunc?: {(i: number): Promise<void>};
  throwOn?: ('catch' | 'timeout')[];
  errorFunc?: RetryErrorProcessor;
};

export type RetryUntilTimeoutOptions = RetryUntilTimeoutOptionsMain &
  RetryUntilTimeoutOptionsBase;

export const newDefaultRetryUntilTimeoutOptions = (
  timeout: number,
  interval: number
): Required<RetryUntilTimeoutOptions> => ({
  timeout,
  interval,
  ...defaultRetryUntilTimeoutOptionsBase,
});

export const isRetryUntilTimeoutOptions = (
  x: unknown
): x is RetryUntilTimeoutOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).timeout !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

const defaultRetryErrorProc = newErrorProcessor(
  () => new Error('Timeout Error')
);

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

export const defaultRetryUntilTimeoutOptionsMain: Required<RetryUntilTimeoutOptionsMain> =
  {
    timeout: 2 * 60 * config.timeoutUnit,
    interval: 10 * config.timeoutUnit,
  };

export const defaultRetryUntilTimeoutOptionsBase: Required<RetryUntilTimeoutOptionsBase> =
  {
    intervalFunc: sleep,
    throwOn: ['timeout'],
    errorFunc: defaultRetryErrorProc,
  };

export const defaultRetryUntilTimeoutOptions: Required<RetryUntilTimeoutOptions> =
  {
    ...defaultRetryUntilTimeoutOptionsMain,
    ...defaultRetryUntilTimeoutOptionsBase,
  };
