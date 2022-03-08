import { describe } from 'mocha';
import nock from 'nock';
import { expect } from 'chai';
import { BASEURL } from '../../src/core/urls.js';

import productsByID from './buyerresponses.js';
import { renderOfferings } from '../../src/products/renderProducts.js';
import client from '../../src/server.js';

describe('Buyer', () => {
  beforeEach(() => {
    nock(`${BASEURL}`).get('/ussd/productwithprice/product/1')
      .reply(200, productsByID);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);

    nock(`${BASEURL}`);
  });
  it('should see the produce based on what produce ID they selected', async () => {
    const farmOfferings = await renderOfferings(client, 1);
    expect(farmOfferings.message).to.equal('CON Choose one of the available options to buy. \n'
      + '7. Tomatoes from ThisFarm Grade: 1\n'
     + 'KES 2.00 ');
  });
});
