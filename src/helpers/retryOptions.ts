import {config} from './config';
import {sleep} from './sleep';
import {newErrorProcessor, RetryErrorProcessor} from './retryErrorFunc';

interface RetryOptionsBase<ThrowOnElement extends string> {
  intervalFunc?: {(i: number): Promise<void>};
  throwOn?: ThrowOnElement[];
  errorFunc?: RetryErrorProcessor;
}

export interface RetryUntilTimeoutOptionsMain {
  timeout?: number;
  interval?: number;
}

type RetryUntilTimeoutOptionsBase = RetryOptionsBase<'catch' | 'timeout'>;

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

export interface RetryAttemptOptionsMain {
  maxAttempts?: number;
  interval?: number;
}

type RetryAttemptOptionsBase = RetryOptionsBase<'catch' | 'exceeded'>;

export type RetryAttemptOptions = RetryAttemptOptionsMain &
  RetryAttemptOptionsBase;

export const isRetryAttemptOptions = (x: unknown): x is RetryAttemptOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).maxAttempts !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
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
    errorFunc: newErrorProcessor(() => new Error('Retry exceeded maxAttempts')),
  };

export const defaultRetryAttemptsOptions = {
  ...defaultRetryAttemptsOptionsMain,
  ...defaultRetryAttemptsOptionsBase,
};
