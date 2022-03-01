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

export const renderProducts = async (id, menus) => {
  try {
    const response = await fetchProducts(id);
    if (response) {
      message = `${con()} ${menus.chooseProduct} ${response}`;
    } else {
      message = `${con()} ${menus.couldNotFetch}`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const renderOffers = (offers, offersArray, client, menus) => {
  const status = {};
  let offeringText = '';
  offers.forEach((offer) => {
    const userViewOffers = {};

    if (offer.status !== '0') {
      offeringText += `\n${offer.id}. ${offer.product_name} ${menus.miscellaneous.from} ${offer.farm_name} ${menus.grade} ${offer.grade} ${menus.atKES} ${offer.group_price}`;
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
  const message = `${con()} ${menus.chooseOneToBuy} ${offeringText}`;
  return message;
};
export const renderProductCategories = async (menus) => {
  try {
    const response = await fetchCategories();

    if (response) {
      message = `${con()} ${menus.selectCategory} ${response}`;
    } else {
      message = `${end()} ${menus.couldNotFetchCategories}`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
export const checkGroupAndIndividualPrice = (status, menus) => {
  if (status === 'both') {
    message = `${con()} ${menus.selectPrice}`;
  } else if (status === 'unit') {
    message = `${con()} ${menus.buyAtUnit}`;
  } else if (status === 'group') {
    message = `${con()} ${menus.buyAtGroup}`;
  }

  return message;
};

export const renderOfferings = async (client, id, menus) => {
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

    message = `${con()} ${menus.askForOptionSelection} ${offeringText}`;
  } else {
    message = `${con()} ${menus.productNotAvailable}`;
    message += menus.footer;
  }
  return {
    message,
    status,
  };
};

export const showAvailableProducts = async (client, textValue, text, menus) => {
  if (textValue === 2) {
    message = await renderProductCategories(menus);
  } else if (textValue === 3 && numberWithinRange(text, 2, menus) === 'valid') {
    const selection = parseInt(text.split('*')[2], 10);
    message = await renderProducts(selection, menus);
  } else if (textValue === 4 && numberWithinRange(text, 3, menus) === 'valid') {
    const selection = parseInt(text.split('*')[3], 10);
    const result = await renderOfferings(client, selection, menus);
    offeringStatus.push(result.status);

    message = result.message;
  } else if (textValue === 5 && numberWithinRange(text, 4, menus) === 'valid') {
    const selection = parseInt(text.split('*')[4], 10);
    message = checkGroupAndIndividualPrice(
      offeringStatus[`${offeringStatus.length - 1}`][`${selection}`],
      menus,
    );
  } else if (
    textValue === 6
    && numberWithinRange(text, 5, menus) === 'valid'
    && text.split('*')[5] === '1'
  ) {
    message = askForQuantity(menus);
  } else if (
    textValue === 7
    && parseInt(text.split('*')[6], 10) > 0
    && numberWithinRange(text, 6, menus) === 'valid'
  ) {
    const userQuantity = parseInt(text.split('*')[6], 10);
    const id = text.split('*')[4];
    const typeOfOffering = offeringStatus[offeringStatus.length - 1];
    const selection = parseInt(text.split('*')[4], 10);
    const purchasingOption = text.split('*')[5];
    const availablePrice = typeOfOffering[`${selection}`];
    const price = priceToUse(availablePrice, purchasingOption);
    message = await confirmQuantityWithPrice(
      userQuantity,
      id,
      price,
      client,
      menus,
    );
  } else if (
    textValue === 7
    && text.split('*')[6] === '1'
    && numberWithinRange(text, 6, menus) === 'valid'
  ) {
    message = await addToCart(client, itemSelection, totalCost);
  } else if (
    textValue === 8
    && text.split('*')[7] === '1'
    && numberWithinRange(text, 7, menus) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 1, menus);
  } else if (
    textValue === 8
    && text.split('*')[7] === '67'
    && numberWithinRange(text, 7) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 0);
  } else if (
    textValue === 9
    && text.split('*')[8] === '1'
    && numberWithinRange(text, 8, menus) === 'valid'
  ) {
    message = await cartOperations(text, 'inner', 8);
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
