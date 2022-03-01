/* eslint-disable import/no-cycle */
import { con } from '../menus/rendermenu.js';

/**
 * `${con()} Enter phone number to checkout with`
 * @returns None
 */
const makePayment = (menus) => `${con()} ${menus.makePayment}`;

/**
 * This function is used to display the message to the user to enter the phone number to checkout
with.
 * @returns A string
 */
export const checkoutUsingDifferentNumber = (menus) => {
  let message;
  message = `${con()} ${menus.differentNumber}`;
  message += menus.footer;
  return message;
};

export default makePayment;
