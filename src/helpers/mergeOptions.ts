export const mergeOptions = <T>(defaultOptions: T, options?: Partial<T>): T => {
  if (!options) {
    return defaultOptions;
  } else {
    const result = {} as Partial<T>;
    for (const key in defaultOptions) {
      result[key] = options[key] ?? defaultOptions[key];
    }
    return result as T;
  }
};
