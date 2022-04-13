import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  renderFarmerMenus,
  renderFarmerMenusLevelTwo,
} from '../../src/menus/rendermenu.js';
import { promptToGive } from '../../src/users/farmer/farmerlocation.js';
import client from '../../src/server.js';
import { getStrings } from '../../src/menus/language.js';
import { strings } from '../../src/menus/strings.js';

describe('Farmer', () => {
  it('should see the relevant first level menus', () => {
    const menus = getStrings(strings, 'en');
    expect(typeof renderFarmerMenus(menus)).to.equal('string');
    expect(renderFarmerMenus(menus)).to.equal(
      'CON 1. Update Location\n2. Add Farm Details\n3. Add product to farm\n4. Update farmer details\n5. Update listed produce\n\n98.More',
    );
  });
  it('should see the second level menus', () => {
    const menus = getStrings(strings, 'en');
    expect(typeof renderFarmerMenusLevelTwo(menus)).to.equal('string');
    expect(renderFarmerMenusLevelTwo(menus)).to.equal(
      'CON 6. Join Group\n7. My Farms\n8.Change location details',
    );
  });
  it('on update location, further menus should be returned', async () => {
    const menus = getStrings(strings, 'en');
    const prompt = await promptToGive(client, 'region', menus);
    expect(typeof prompt).to.equal('string');
  });
});
