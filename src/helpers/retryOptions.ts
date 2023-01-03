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

export interface RetryUntilTimeoutOptions
  extends RetryUntilTimeoutOptionsMain,
    RetryOptionsBase<'catch' | 'timeout'> {}

export const isRetryUntilTimeoutOptions = (
  x: unknown
): x is RetryUntilTimeoutOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).timeout !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

export const defaultRetryUntilTimeoutOptions: Required<RetryUntilTimeoutOptions> =
  {
    timeout: 2 * 60 * config.timeoutUnit,
    interval: 10 * config.timeoutUnit,
    intervalFunc: sleep,
    throwOn: ['timeout'],
    errorFunc: newErrorProcessor(() => new Error('Timeout Error')),
  };

export interface RetryAttemptOptionsMain {
  maxAttempts?: number;
  interval?: number;
}

export interface RetryAttemptOptions
  extends RetryAttemptOptionsMain,
    RetryOptionsBase<'catch' | 'exceeded'> {}

export const isRetryAttemptOptions = (x: unknown): x is RetryAttemptOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).maxAttempts !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

export const defaultRetryAttemptsOptions = {
  maxAttempts: 3,
  interval: config.timeoutUnit,
  intervalFunc: sleep,
  throwOn: ['exceeded'],
  errorFunc: newErrorProcessor(() => new Error('Retry exceeded maxAttempts')),
};
