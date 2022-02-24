import { con } from '../menus/rendermenu.js';
import { menus } from '../menus/menuoptions.js';

/**
 * `${con()} Enter phone number to checkout with`
 * @returns None
 */
const makePayment = () => `${con()} ${menus.payment.makePayment}`;

/**
 * This function is used to display the message to the user to enter the phone number to checkout
with.
 * @returns A string
 */
export const checkoutUsingDifferentNumber = () => {
  let message;
  message = `${con()} ${menus.payment.differentNumber}`;
  message += menus.footer;
  return message;
};

export default makePayment;
