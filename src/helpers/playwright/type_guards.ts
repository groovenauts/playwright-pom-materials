import {Frame, Page, Locator} from 'playwright-core';

export const isFrame = (x: unknown): x is Frame => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    typeof o.childFrames === 'function' &&
    typeof o.parentFrame === 'function' &&
    typeof o.waitForTimeout === 'function'
  );
};

export const isPage = (x: unknown): x is Page => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    typeof o.frames === 'function' &&
    typeof o.mainFrame === 'function' &&
    typeof o.waitForTimeout === 'function'
  );
};

export const isLocator = (x: unknown): x is Locator => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return (
    typeof o.filter === 'function' &&
    typeof o.page === 'function' &&
    typeof o.waitFor === 'function'
  );
};
