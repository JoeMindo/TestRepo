/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */

import checkFarmerSelection from '../users/farmer/farmerselection.js';
import checkBuyerSelection from '../users/buyer/buyerselection.js';

const con = () => 'CON';
const end = () => 'END';

/**
 * It takes in a response and a textToShow and returns a message.
 * @param response - the response object from the user
 * @param textToShow - the text to show in the menu
 * @returns The message to be sent to the user.
 */
export const promptToShow = (response, textToShow, menus) => {
  let message = '';
  let menuPrompt = '';
  menuPrompt += response;
  if (textToShow === 'productcategories') {
    message = `${con()} ${menus.category}`;
    message += menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'products') {
    message = `${con()} ${menus.product}`;
    message += menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'kycsections') {
    message = `${con()} ${menus.kycsection}`;
    message = menuPrompt;
    message += menus.footer;
  } else if (textToShow === 'kycmetrics') {
    message = `${con()} ${menus.kycmetrics}`;
    message = menuPrompt;
    message += menus.footer;
  } else {
    message = `${con()} ${menus.chooseOffering}`;
    message += menuPrompt;
    message += menus.footer;
  }
  return message;
};

/**
 * It takes a response object and a section string as arguments.
 * If the response status is 200 and the section is 'sections', it loops through the response data
and prints out the section id and section name.
 * If the response status is 200 and the section is 'questions', it loops through the response data
and prints out the question id and question name.
 * Otherwise, it prints out a message saying that something went wrong.
 * @param response - the response object from the API call
 * @param section - 'sections' or 'questions'
 * @returns The response from the server.
 */
export const responsePrompt = (response, section, menus) => {
  let message = '';
  let menuPrompt = 'CON ';

  if (response.status === 200 && section === 'sections') {
    response.data.message.forEach((item) => {
      menuPrompt += `${item.id}. ${item.section_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycsections', menus);
  } else if (response.status === 200 && section === 'questions') {
    response.data.message.forEach((item) => {
      menuPrompt += `${item.id}. ${item.metric_name}\n`;
    });
    message = promptToShow(menuPrompt, 'kycmetrics', menus);
  } else {
    message = `${end()} ${menus.somethingWentWrong}`;
  }
  return message;
};

/**
 * It checks the user's selection and returns the appropriate response
 * @param role - The role of the user.
 * @param text - The text that the user has entered so far.
 * @param startIndex - The index of the first menu to be shown.
 * @returns A list of options to be displayed to the user.
 */
export const showUserMenus = async (role, text, startIndex) => {
  let response;
  if (role === 'farmer') {
    response = await checkFarmerSelection(text, startIndex);
  } else if (role === 'buyer') {
    response = await checkBuyerSelection(text, startIndex);
  }
  return response;
};
