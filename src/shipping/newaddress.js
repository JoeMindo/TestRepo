import axios from 'axios';
import { BASEURL } from '../core/urls.js';

const createNewShippingAddress = async (data) => {
  const response = await axios.post(`${BASEURL}/api/user/address/add`, data).catch((err) => err.response);
  return response;
};
export const viewShippingAddresses = async (userID) => {
  const response = await axios.get(`${BASEURL}/api/user/address/${userID}`).catch((err) => err.response);
  return response;
};
export default createNewShippingAddress;
