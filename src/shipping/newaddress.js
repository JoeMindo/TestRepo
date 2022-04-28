import axios from 'axios';
import { BASEURL } from '../core/urls.js';

const createNewShippingAddress = async (data) => {
  const response = await axios.post(`${BASEURL}/api/user/address/add`, data).catch((err) => err.response);
  return response;
};

export default createNewShippingAddress;
