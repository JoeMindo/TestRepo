import axios from 'axios';
import { BASEURL } from '../core/urls.js';
import { end, con } from '../menus/rendermenu.js';

const viewShippingAddresses = async (userID) => {
  const response = await axios.get(`${BASEURL}/ussd/user/address/get/${userID}`).catch((err) => err.response);
  return response;
};

export const renderShippingMenus = async (menus, userID) => {
  let results = `${con()} Here are your addresses:`;
  const response = await viewShippingAddresses(userID);
  if (response.status === 200 && response.data.message.length > 0) {
    response.data.message.forEach((item, index) => {
      results += `\n${
        index += 1
      }. ${
        item.city
      }, ${item.landmark}\n`;
    });
    return results;
  }
  return `${end()} ${menus.noAddressFound}`;
};
export default renderShippingMenus;