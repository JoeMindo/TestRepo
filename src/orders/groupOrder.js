/* eslint-disable import/no-cycle */
import axios from 'axios';
import { retreiveCachedItems } from '../core/services.js';
import { renderOffers, renderProducts } from '../products/renderProducts.js';
import client from '../server.js';
import { BASEURL } from '../core/urls.js';

import {
  askForQuantity,
  renderProductCategories,
} from '../users/buyer/buyermenus.js';
import { con } from '../menus/rendermenu.js';

/**
 * Checks if a user is in a group
 * @returns The group ID
 */
export const checkIfUserIsInGroup = async () => {
  const user = await retreiveCachedItems(client, ['user_id']);
  const data = {
    // TODO: Custom ID
    user_id: user,
  };
  const response = await axios.post(`${BASEURL}/ussd/isuseringroup`, data);
  if (response.data.status === 'success') {
    return response.data.group_ID;
  }
  return false;
};

/**
 * If the state is false, then the message is "CON Create Group". If the state is a number, then the
message is "CON Group To Join". The message is then concatenated with the footer.
 * @param state - The state of the user.
 * @returns The message to be sent to the user.
 */
export const actionToTake = async (state, menus) => {
  let message = '';
  if (state === false) {
    message = `CON ${menus.createGroup}`;
  } else if (typeof state === 'number') {
    message = `CON ${menus.groupToJoin}`;
  }
  message += menus.footer;
  return message;
};

/**
 * It creates a group.
 * @param groupdata - {
 * @returns The status of the request.
 */
export const createGroup = async (groupdata) => {
  const response = await axios.post(`${BASEURL}/ussd/saveusergroup`, groupdata);
  return response.data.status;
};
export const requestGroupName = (menus) => `${con()} ${menus.requestName}`;
/**
 * This function is used to create a group.
 * @param status - The status of the group creation.
 * @returns The message that is being returned.
 */
export const groupCreationMessage = (status, menus) => {
  let message;
  if (status === 'success') {
    message = `${con()} ${menus.groupCreatedSuccess}`;
  } else {
    message = `${con()} ${menus.couldNotCreateGroup}`;
  }
  message += menus.footer;
  return message;
};

/**
 * It takes in a productId and returns a message that contains the product's offers.
 * @param productId - The productId of the product you want to render
 * @returns The message that is being sent to the user.
 */
export const renderGroupPricedItems = async (productId) => {
  try {
    let offers = await axios.get(
      `${BASEURL}/ussd/productsbyproductid/${productId}`,
    );
    offers = offers.data.message.data;
    const message = renderOffers(offers, [], client);
    return message;
  } catch (err) {
    throw new Error(err);
  }
};
/**
 * It renders the product categories, products, and group priced items.
 * @param textValue - The value of the text message received.
 * @param text - The text that the user sent.
 * @returns The message to be sent to the user.
 */
export const groupPricedItems = async (textValue, text, menus) => {
  let message;
  if (textValue === 5) {
    message = await renderProductCategories();
  } else if (textValue === 6) {
    const selection = parseInt(text.split('*')[5], 10);
    message = await renderProducts(selection);
  } else if (textValue === 7) {
    const id = parseInt(text.split('*')[6], 10);
    message = await renderGroupPricedItems(id);
  } else if (textValue === 8) {
    message = askForQuantity();
  }
  message += menus.footer;
  return message;
};
export default checkIfUserIsInGroup;
