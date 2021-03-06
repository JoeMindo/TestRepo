/* eslint-disable import/no-cycle */
import axios from 'axios';
import { BASEURL } from '../core/urls.js';

/**
 * It takes in a cartSelections object and sends it to the server.
 * @param cartSelections - {
 * @returns The response from the server.
 */
const makebasicOrder = async (cartSelections) => {
  const makeOrderRequest = await axios
    .post(`${BASEURL}/ussd/savebasicorder`, cartSelections)
    .catch((err) => err.response);

  return makeOrderRequest;
};

export const viewOrders = async (userId) => {
  const response = axios
    .get(`${BASEURL}/ussd/showmyorders/${userId}`)
    .catch((err) => err.response);
  return response;
};

export const renderOrders = async (userId, menus) => {
  const response = await viewOrders(userId);
  let orders = '';
  if (Array.isArray(response.data.message)) {
    response.data.message.data.forEach((order) => {
      orders += `${menus.orderId} ${
        order.order_id.substring(0, 3) + order.order_id.substring(5, 7)
      }, ${menus.status} ${order.order_status}\n`;
    });
    return orders;
  }
  return `${menus.noOrders}`;
};

export default makebasicOrder;
