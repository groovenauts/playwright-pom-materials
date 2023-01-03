export type Config = {
  readonly timeoutUnit: number;
};

export const setConfig = (newConfig: Config): void => {
  config = newConfig;
};

export let config = {
  timeoutUnit: 1_000,
};
