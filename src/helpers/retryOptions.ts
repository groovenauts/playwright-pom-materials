import {RetryErrorProcessor} from './retryErrorFunc';

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
  x?: RetryOptions
): x is RetryUntilTimeoutOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).timeout !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

export interface RetryAttemptOptionsMain {
  maxAttempts?: number;
  interval?: number;
}

export interface RetryAttemptOptions
  extends RetryAttemptOptionsMain,
    RetryOptionsBase<'catch' | 'exceeded'> {}

export const isRetryAttemptOptions = (
  x?: RetryOptions
): x is RetryAttemptOptions => {
  return (
    typeof x === 'object' && x !== null && (x as any).maxAttempts !== undefined // eslint-disable-line @typescript-eslint/no-explicit-any
  );
};

export type RetryOptions = RetryUntilTimeoutOptions | RetryAttemptOptions;
