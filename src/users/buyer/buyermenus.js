/* eslint-disable import/no-cycle */
import { fetchCategories } from '../../products/productmanagement.js';

let message = '';
const con = () => 'CON';
const end = () => 'END';

const centersMapping = {
  1: 'Center 1',
  2: 'Center 2',
  3: 'Center 4',
};

export const priceToUse = (availablePriceType, choice) => {
  let status;
  if (
    (availablePriceType === 'both' && choice === '1')
    || availablePriceType === 'unit'
  ) {
    status = 'unit';
  } else if (
    (availablePriceType === 'both' && choice === '2')
    || availablePriceType === 'group'
  ) {
    status = 'group';
  }

  return status;
};

export const renderProductCategories = async (menus) => {
  try {
    const response = await fetchCategories();

    if (response) {
      message = `${con()} ${menus.category}\n ${response}`;
    } else {
      message = `${end()} ${menus.couldNotFetchCategories}`;
    }
    return message;
  } catch (err) {
    throw new Error(err);
  }
};

export const askForQuantity = (menus) => {
  message = `${con()} ${menus.quantityToBuy}`;
  message += menus.footer;
  return message;
};
// Array of offers should be cached

export const chooseCenter = (administrativeID, menus) => {
  let message = `${con()} ${menus.centerForPicking}`;
  const center = centersMapping[`${administrativeID}`];
  message += `1. ${center}`;
  return message;
};
