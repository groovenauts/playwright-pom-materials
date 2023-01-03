import {RetryAttemptOptions, defaultRetryAttemptsOptions} from './retryOptions';

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
