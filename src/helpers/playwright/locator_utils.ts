import {Frame, Page, Locator} from 'playwright-core';
import {isFrame, isPage} from './type_guards';

// See https://github.com/microsoft/playwright/blob/v1.14.1/src/client/locator.ts

export const getFrame = (x: Locator | Page | Frame): Frame => {
  return isFrame(x) ? x : isPage(x) ? x.mainFrame() : x.page().mainFrame();
};

/**
 * デバッグ用の関数です。ログに出力する以外の目的で使用しないでください。
 * Locatorのもとになったセレクターを返します。
 *
 * @param locator 対象の Locator
 * @returns Locatorのもとになったセレクター
 */
export const debugSelector = (locator: Locator): string => {
  const o = locator as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  return o._selector as string;
};
