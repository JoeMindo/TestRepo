/* eslint-disable import/no-cycle */
import axios from 'axios';
import { con, end } from '../menus/rendermenu.js';
import { BASEURL } from '../core/urls.js';

/**
 * `${con()} Enter phone number to checkout with`
 * @returns None
 */
const makePayment = (menus) => `${
  con()
} ${
  menus.makePayment
}`;
export const makeSTKPush = async (phone, menus) => {
  let message;
  phone = phone.replace(/^'(.*)'$/, '$1');

  try {
    const pushresponse = await axios.post(`${BASEURL}/ussd/testmpesa`, { phone_no: phone });
    if (pushresponse.status === 200) {
      message = `${
        end()
      } ${
        menus.stksuccess
      }`;
    }
  } catch (err) {
    return err;
  }
  return message;
};
/**
 * This function is used to display the message to the user to enter the phone number to checkout
with.
 * @returns A string
 */
export const checkoutUsingDifferentNumber = (menus) => {
  let message;
  message = `${
    con()
  } ${
    menus.differentNumber
  }`;
  message += menus.footer;
  return message;
};

export default makePayment;
