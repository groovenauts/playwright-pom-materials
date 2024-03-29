import {Locator} from '@playwright/test';

export type LocatorPredicate = (l: Locator) => Promise<boolean>;

export const reverseLocatorPredicate = (
  lp: LocatorPredicate
): LocatorPredicate => {
  return async (l: Locator): Promise<boolean> => {
    return !(await lp(l));
  };
};
