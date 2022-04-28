import axios from 'axios';
import { BASEURL } from '../core/urls.js';
import { end, con } from '../menus/rendermenu.js';

const viewShippingAddresses = async (userID) => {
  const response = await axios.get(`${BASEURL}/api/user/address/${userID}`).catch((err) => err.response);
  return response;
};

export const renderShippingMenus = async (menus, userID) => {
  let results = `${con()}`;
  const response = await viewShippingAddresses(userID);
  if (response.status === 200 && response.data.message.length > 0) {
    response.data.data.forEach((item, index) => {
      results += `\n${
        index += 1
      }. ${
        item.address_name
      }\n`;
    });
    return results;
  }
  return `${end()} ${menus.noAddressFound}`;
};
export default viewShippingAddresses;