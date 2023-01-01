import {config} from './config';
import {sleep} from './sleep';

import {newErrorProcessor, RetryErrorProcessor} from './retryErrorFunc';

export type errorMessageFunc = () => string;

export type RetryAttemptOptionsMain = {
  maxAttempts?: number;
  interval?: number;
};

type RetryAttemptOptionsBase = {
  intervalFunc?: {(i: number): Promise<void>};
  throwOn?: ('catch' | 'exceeded')[];
  errorFunc?: RetryErrorProcessor;
};

export type RetryAttemptOptions = RetryAttemptOptionsMain &
  RetryAttemptOptionsBase;

export const fillRetryAttemptsOptions = (
  x: RetryAttemptOptions | undefined,
  defaultOptions: Required<RetryAttemptOptions>
): Required<RetryAttemptOptions> => {
  return {
    maxAttempts: x?.maxAttempts ?? defaultOptions.maxAttempts,
    interval: x?.interval ?? defaultOptions.interval,
    intervalFunc: x?.intervalFunc ?? defaultOptions.intervalFunc,
    throwOn: x?.throwOn ?? defaultOptions.throwOn,
    errorFunc: x?.errorFunc ?? defaultOptions.errorFunc,
  };
};

export const isRetryAttemptOptions = (x: unknown): x is RetryAttemptOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).maxAttempts !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

const defaultRetryErrorProc = newErrorProcessor(
  () => new Error('Retry exceeded maxAttempts')
);

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
  const maxAttempts =
    options?.maxAttempts || defaultRetryAttemptsOptions.maxAttempts;
  const interval = options?.interval || defaultRetryAttemptsOptions.interval;
  const throwOn = options?.throwOn || ['exceeded'];
  const errorProc = options?.errorFunc || defaultRetryErrorProc;
  const intervalFunc = options?.intervalFunc || sleep;

  const errors: unknown[] = [];
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    try {
      const x = await fn();
      if (x) return;
    } catch (err) {
      errors.push(err);
      if (throwOn.includes('catch')) await errorProc(errors);
      console.debug('retry function ignored an error: ', err);
    }
    await intervalFunc(interval);
  }
  if (throwOn.includes('exceeded')) await errorProc(errors);
};

export const defaultRetryAttemptsOptionsMain: Required<RetryAttemptOptionsMain> =
  {
    maxAttempts: 3,
    interval: config.timeoutUnit,
  };

export const defaultRetryAttemptsOptionsBase: Required<RetryAttemptOptionsBase> =
  {
    intervalFunc: sleep,
    throwOn: ['exceeded'],
    errorFunc: defaultRetryErrorProc,
  };

export const defaultRetryAttemptsOptions = {
  ...defaultRetryAttemptsOptionsMain,
  ...defaultRetryAttemptsOptionsBase,
};
