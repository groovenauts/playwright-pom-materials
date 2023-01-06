import {Locator} from 'playwright-core';

export const hasDisabledAttr = async (l: Locator): Promise<boolean> => {
  return l.evaluate((el: SVGElement | HTMLElement): boolean => {
    const attr = el.getAttributeNode('disabled');
    if (attr) {
      console.log('hasDisabledAttr: attr.value', attr.value);
    } else {
      console.log('hasDisabledAttr: attr is falsy', attr);
    }
    return !!(attr && (attr.value === '' || attr.value === 'disabled'));
  });
};

export const hasCheckedAttr = async (l: Locator): Promise<boolean> => {
  const attr = await l.getAttribute('checked');
  if (attr) {
    console.log('hasCheckedAttr: attr', attr);
  }
  if (attr === null) return false;
  return attr === '' || attr === 'checked';
};

export const hasClassFunc =
  (className: string) =>
  async (l: Locator): Promise<boolean> => {
    const classes = await l.getAttribute('class');
    const classList = classes?.split(' ') || [];
    return classList.includes(className);
  };

export const isChecked = (l: Locator): Promise<boolean> => l.isChecked();
