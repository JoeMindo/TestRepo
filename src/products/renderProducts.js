/* eslint-disable import/no-cycle */
import axios from 'axios';
import {
  fetchCategories,
  fetchProducts,
  confirmQuantityWithPrice,
  itemSelection,
} from './productmanagement.js';
import { con, end } from '../menus/rendermenu.js';
import { BASEURL } from '../core/urls.js';
import { menus } from '../menus/menuoptions.js';
import {
  cartOperations,
  askForQuantity,
  priceToUse,
  addToCart,
} from '../cart/cartoperations.js';
import { numberWithinRange } from '../helpers.js';

let message;
export const offersArray = [];
export const cartItems = [];
export const totalCost = {};

export const offeringStatus = [];

export const renderProducts = async (id) => {
  try {
    const response = await fetchProducts(id);
    if (response) {
      message = `${con()} ${menus.renderProducts.chooseProduct} ${response}`;
    } else {
      message = `${con()} ${menus.renderProducts.couldNotFetch}`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const renderOffers = (offers, offersArray, client) => {
  const status = {};
  let offeringText = '';
  offers.forEach((offer) => {
    const userViewOffers = {};

    if (offer.status !== '0') {
      offeringText += `\n${offer.id}. ${offer.product_name} ${menus.miscellaneous.from} ${offer.farm_name} ${menus.miscellaneous.grade} ${offer.grade} ${menus.miscellaneous.atKES} ${offer.group_price}`;
      userViewOffers.id = `${offer.id}`;
      userViewOffers.product = `${offer.product_name}`;
      userViewOffers.farmName = `${offer.farm_name}`;
      userViewOffers.grade = `${offer.grade}`;
      userViewOffers.product_id = `${offer.product_id}`;
      userViewOffers.availableUnits = `${offer.available_units}`;
      userViewOffers.groupPrice = `${offer.group_price}`;
      status[offer.id] = 'group';
    }
    offersArray.push(userViewOffers);

    client.set('groupOffersArray', JSON.stringify(offersArray));
  });
  const message = `${con()} ${menus.renderProducts.chooseOneToBuy} ${offeringText}`;
  return message;
};
export const renderProductCategories = async () => {
  try {
    const response = await fetchCategories();

    if (response) {
      message = `${con()} ${menus.renderProducts.selectCategory} ${response}`;
    } else {
      message = `${end()} ${menus.renderProducts.couldNotFetchCategories}`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const checkGroupAndIndividualPrice = (status) => {
  if (status === 'both') {
    message = `${con()} ${menus.price.selectPrice}`;
  } else if (status === 'unit') {
    message = `${con()} ${menus.price.buyAtUnit}`;
  } else if (status === 'group') {
    message = `${con()} ${menus.price.buyAtGroup}`;
  }

  return message;
};

export const renderOfferings = async (client, id) => {
  const status = {};

  const endpointUrl = `${BASEURL}/ussd/productwithprice/product`;
  const productOffering = await axios
    .get(`${endpointUrl}/${id}`)
    .catch((err) => err.response);
  client.set('viewedProductID', id);

  let offeringText = '';
  if (productOffering.status === 200) {
    const offers = productOffering.data.message.data;

    offers.forEach((offer) => {
      const userViewOffers = {};
      offeringText += `\n${offer.id}. ${offer.product_name} from ${offer.farm_name} Grade: ${offer.grade}\nKES ${offer.unit_price} `;
      userViewOffers.id = `${offer.id}`;
      userViewOffers.product = `${offer.product_name}`;
      userViewOffers.farmName = `${offer.farm_name}`;
      userViewOffers.grade = `${offer.grade}`;
      userViewOffers.product_id = `${offer.product_id}`;
      userViewOffers.availableUnits = `${offer.available_units}`;
      userViewOffers.unitPrice = `${offer.unit_price}`;
      status[offer.id] = 'unit';
      offersArray.push(userViewOffers);
      client.set('offersArray', JSON.stringify(offersArray));
    });

    message = `${con()} ${menus.renderProducts.askForOptionSelection} ${offeringText}`;
  } else {
    message = `${con()} ${menus.renderProducts.productNotAvailable}`;
    message += menus.footer;
  }
  return {
    message,
    status,
  };
};

export const showAvailableProducts = async (client, textValue, text) => {
  if (textValue === 1) {
    message = await renderProductCategories();
  } else if (textValue === 2 && numberWithinRange(text, 1) === 'valid') {
    const selection = parseInt(text.split('*')[1], 10);
    message = await renderProducts(selection);
  } else if (textValue === 3 && numberWithinRange(text, 2) === 'valid') {
    const selection = parseInt(text.split('*')[2], 10);
    const result = await renderOfferings(client, selection);
    offeringStatus.push(result.status);

    message = result.message;
  } else if (textValue === 4 && numberWithinRange(text, 3) === 'valid') {
    const selection = parseInt(text.split('*')[3], 10);
    message = checkGroupAndIndividualPrice(
      offeringStatus[`${offeringStatus.length - 1}`][`${selection}`],
    );
  } else if (textValue === 5 && numberWithinRange(text, 4) === 'valid' && text.split('*')[4] === '1') {
    message = askForQuantity();
  } else if (
    textValue === 6
    && parseInt(text.split('*')[5], 10) > 0
    && numberWithinRange(text, 5) === 'valid'
  ) {
    const userQuantity = parseInt(text.split('*')[5], 10);
    const id = text.split('*')[3];
    const typeOfOffering = offeringStatus[offeringStatus.length - 1];
    const selection = parseInt(text.split('*')[3], 10);
    const purchasingOption = text.split('*')[4];
    const availablePrice = typeOfOffering[`${selection}`];
    const price = priceToUse(availablePrice, purchasingOption);
    message = await confirmQuantityWithPrice(userQuantity, id, price, client);
  } else if (
    textValue === 7
    && text.split('*')[6] === '1'
    && numberWithinRange(text, 6) === 'valid'
  ) {
    message = await addToCart(client, itemSelection, totalCost);
  } else if (
    textValue === 8
    && text.split('*')[7] === '1'
    && numberWithinRange(text, 7) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 1);
    console.log('The message at 8 is', message);
  } else if (
    textValue === 8
    && text.split('*')[7] === '67'
    && numberWithinRange(text, 7) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 0);
  } else if (
    textValue === 9
    && text.split('*')[8] === '1'
    && numberWithinRange(text, 8) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 8);
    console.log('The message at 9 is', message);
  } else if (
    textValue === 9
    && text.split('*')[8] === '2'
    && numberWithinRange(text, 8) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 1);
  } else if (
    textValue === 10
    && text.split('*')[9] === '1'
    && numberWithinRange(text, 9) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 2);
  } else if (
    textValue === 10
    && text.split('*')[9] === '2'
    && numberWithinRange(text, 9) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 3);
  } else if (
    textValue === 11
    && text.split('*')[9] === '1'
    && numberWithinRange(text, 9) === 'valid'
  ) {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[10], 10);
    message = await cartOperations(text, 'inner', 4, itemID);
  } else if (
    textValue === 11
    && text.split('*')[9] === '2'
    && numberWithinRange(text, 9) === 'valid'
  ) {
    // TODO: Convert to a string
    const itemID = parseInt(text.split('*')[10], 10);
    message = await cartOperations(text, 'inner', 5, itemID);
  } else if (
    textValue === 12
    && text.split('*')[10] === '2'
    && numberWithinRange(text, 10) === 'valid'
  ) {
    const itemID = parseInt(text.split('*')[10], 10);
    const index = parseInt(text.split('*')[11], 10);
    // Point A

    message = await cartOperations(text, 'inner', 6, itemID, index);
  } else if (
    textValue === 13
    && text.split('*')[10] === '1'
    && text.split('*')[12] === '67'
  ) {
    message = await cartOperations(text, 'inner', 0);
  } else {
    message = `${con()} Invalid input`;
  }
  message += menus.footer;
  return message;
};

export default renderOffers;
