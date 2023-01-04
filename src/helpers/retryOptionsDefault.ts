import {
  RetryOptionsBase,
  RetryUntilTimeoutOptions,
  RetryAttemptOptions,
} from './retryOptions';

class RetryOptionsDefaultBase<ThrowOnElement extends string> {
  constructor(
    private readonly base: Required<RetryOptionsBase<ThrowOnElement>>
  ) {}

  asObject(): Required<RetryOptionsBase<ThrowOnElement>> {
    return {...this.base};
  }
}

export class RetryUntilTimeoutOptionsDefault extends RetryOptionsDefaultBase<
  'catch' | 'timeout'
> {
  constructor(
    private readonly timeoutFn: {(): number},
    private readonly intervalFn: {(): number},
    base: Omit<Required<RetryUntilTimeoutOptions>, 'timeout' | 'interval'>
  ) {
    super(base);
  }

  asObject(): Required<RetryUntilTimeoutOptions> {
    return {
      ...super.asObject(),
      timeout: this.timeoutFn(),
      interval: this.intervalFn(),
    };
  }
}

export class RetryAttemptOptionsDefault extends RetryOptionsDefaultBase<
  'catch' | 'exceeded'
> {
  constructor(
    private readonly maxAttemptsFn: {(): number},
    private readonly intervalFn: {(): number},
    base: Omit<Required<RetryAttemptOptions>, 'maxAttempts' | 'interval'>
  ) {
    super(base);
  }

  asObject(): Required<RetryAttemptOptions> {
    return {
      ...super.asObject(),
      maxAttempts: this.maxAttemptsFn(),
      interval: this.intervalFn(),
    };
  }
}
