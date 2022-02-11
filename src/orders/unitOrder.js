import axios from 'axios';
import { BASEURL } from '../core/urls.js';

/**
 * It takes in a cartSelections object and sends it to the server.
 * @param cartSelections - {
 * @returns The response from the server.
 */
const makebasicOrder = async (cartSelections) => {
  const makeOrderRequest = await axios.post(
    `${BASEURL}/ussd/savebasicorder`,
    cartSelections,
  ).catch((err) => err.response);

  return makeOrderRequest;
};

export default makebasicOrder;
