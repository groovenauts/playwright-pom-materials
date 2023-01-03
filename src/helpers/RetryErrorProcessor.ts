export type RetryErrorProcessor = {(errors: unknown[]): Promise<void>};

export const newRetryErrorProcessor = (defaultError: {
  (): Error;
}): RetryErrorProcessor => {
  return (errors: unknown[]): Promise<void> => {
    throw errors.length > 0 ? errors[errors.length - 1] : defaultError();
  };
};
