import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getStrings } from '../../src/menus/language.js';
import { renderBuyerMenus } from '../../src/menus/rendermenu.js';
import { strings } from '../../src/menus/strings.js';

describe('Buyer', () => {
  it('should see the relevant menus', () => {
    const menus = getStrings(strings, 'en');
    expect(typeof renderBuyerMenus(menus)).to.equal('string');
  });
});
