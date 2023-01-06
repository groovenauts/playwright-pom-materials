import {Frame, Locator, Page} from 'playwright-core';
import {getFrame} from './locator_utils';

export const sleepFunc = (
  x: Locator | Page | Frame
): {(ms: number): Promise<void>} => {
  const frame = getFrame(x);
  return (ms: number) => frame.waitForTimeout(ms);
};
