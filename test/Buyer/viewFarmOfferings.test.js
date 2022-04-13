import { describe } from 'mocha';
import nock from 'nock';
import { expect } from 'chai';
import { BASEURL } from '../../src/core/urls.js';

import productsByID from './buyerresponses.js';
import { renderOfferings } from '../../src/products/renderProducts.js';
import client from '../../src/server.js';
import { getStrings } from '../../src/menus/language.js';
import { strings } from '../../src/menus/strings.js';

describe('Buyer', () => {
  beforeEach(() => {
    nock(`${BASEURL}`)
      .get('/ussd/productwithprice/product/1')
      .reply(200, productsByID);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);
  });
  it('should see the produce based on what produce ID they selected', async () => {
    const menus = getStrings(strings, 'en');
    const farmOfferings = await renderOfferings(client, 1, menus);
    expect(typeof farmOfferings.message).to.equal('string');
  });
});
