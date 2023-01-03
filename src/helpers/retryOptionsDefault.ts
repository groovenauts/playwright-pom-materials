import {RetryErrorProcessor} from './RetryErrorProcessor';
import {
  RetryOptionsBase,
  RetryUntilTimeoutOptions,
  RetryAttemptOptions,
} from './retryOptions';

class RetryOptionsDefaultBase<ThrowOnElement extends string>
  implements RetryOptionsBase<ThrowOnElement>
{
  constructor(
    private readonly base: Required<RetryOptionsBase<ThrowOnElement>>
  ) {}
  get intervalFunc(): {(i: number): Promise<void>} {
    return this.base.intervalFunc;
  }
  get throwOn(): ThrowOnElement[] {
    return this.base.throwOn;
  }
  get errorFunc(): RetryErrorProcessor {
    return this.base.errorFunc;
  }
}

export class RetryUntilTimeoutOptionsDefault
  extends RetryOptionsDefaultBase<'catch' | 'timeout'>
  implements Required<RetryUntilTimeoutOptions>
{
  constructor(
    private readonly timeoutFn: {(): number},
    private readonly intervalFn: {(): number},
    base: Omit<Required<RetryUntilTimeoutOptions>, 'timeout' | 'interval'>
  ) {
    super(base);
  }
  get timeout(): number {
    return this.timeoutFn();
  }
  get interval(): number {
    return this.intervalFn();
  }
}

export class RetryAttemptOptionsDefault
  extends RetryOptionsDefaultBase<'catch' | 'exceeded'>
  implements Required<RetryAttemptOptions>
{
  constructor(
    private readonly maxAttemptsFn: {(): number},
    private readonly intervalFn: {(): number},
    base: Omit<Required<RetryAttemptOptions>, 'maxAttempts' | 'interval'>
  ) {
    super(base);
  }
  get maxAttempts(): number {
    return this.maxAttemptsFn();
  }
  get interval(): number {
    return this.intervalFn();
  }
}
