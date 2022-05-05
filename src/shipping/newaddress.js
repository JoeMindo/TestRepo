import axios from 'axios';
import { BASEURL } from '../core/urls.js';

const createNewShippingAddress = async (data, id) => {
  const response = await axios.post(`${BASEURL}/ussd/user/address/add/${id}`, data).catch((err) => err.response);
  return response;
};

export default createNewShippingAddress;
