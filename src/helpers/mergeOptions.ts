export const mergeOptions = <T>(defaultOptions: T, options?: Partial<T>): T => {
  if (!options) {
    return defaultOptions;
  } else {
    return {
      ...defaultOptions,
      ...filterUndefined(options),
    };
  }
};

/**
 * Options must be a type of object which allows any undefined value
 */
const filterUndefined = <Options>(obj: Options): Options => {
  const result = {} as Options;
  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};
