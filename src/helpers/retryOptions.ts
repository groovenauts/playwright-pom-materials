import {config} from './config';
import {sleep} from './sleep';
import {newErrorProcessor, RetryErrorProcessor} from './retryErrorFunc';

export interface RetryUntilTimeoutOptionsMain {
  timeout?: number;
  interval?: number;
}

interface RetryUntilTimeoutOptionsBase {
  intervalFunc?: {(i: number): Promise<void>};
  throwOn?: ('catch' | 'timeout')[];
  errorFunc?: RetryErrorProcessor;
}

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

export const defaultRetryUntilTimeoutOptionsMain: Required<RetryUntilTimeoutOptionsMain> =
  {
    timeout: 2 * 60 * config.timeoutUnit,
    interval: 10 * config.timeoutUnit,
  };

export const defaultRetryUntilTimeoutOptionsBase: Required<RetryUntilTimeoutOptionsBase> =
  {
    intervalFunc: sleep,
    throwOn: ['timeout'],
    errorFunc: newErrorProcessor(() => new Error('Timeout Error')),
  };

export const defaultRetryUntilTimeoutOptions: Required<RetryUntilTimeoutOptions> =
  {
    ...defaultRetryUntilTimeoutOptionsMain,
    ...defaultRetryUntilTimeoutOptionsBase,
  };
