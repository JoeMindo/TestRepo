/* eslint-disable import/no-cycle */
import { menus } from './menuoptions.js';
import usernameValidation, { numberValidation, IdValidation } from '../helpers.js';
import { registerUser } from '../core/usermanagement.js';

export const con = () => 'CON';
export const end = () => 'END';
let message = '';

/**
 * It takes in the text value and text from the user and checks if the text value is equal to the
number of the text value in the menus.register object. If it is, it returns the corresponding text
from the menus.register object. If it isn't, it returns the message 'CON Invalid choice'.
 * @param textValue - The current text value of the user.
 * @param text - The user's input
 * @returns {
 *   message: 'CON Welcome to Mamlaka\nWhat is your first name?',
 *   completedStatus: false,
 * }
 */
export const renderRegisterMenu = async (textValue, text, phoneNumber) => {
  if (textValue === 1 && text.length === 0) {
    let menuPrompt = `${con()} Welcome to Mamlaka\n${menus.register.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 1) {
    const validationResponse = usernameValidation(text, 0);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.register.lastname}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 2) {
    const validationResponse = usernameValidation(text, 1);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.register.idNumber}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 3) {
    const validationResponse = IdValidation(text);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.register.gender}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 4) {
    const validationResponse = numberValidation(text, 3);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.register.password}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 5) {
    let menuPrompt = `${con()} ${menus.register.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 6) {
    let menuPrompt = `${con()} ${menus.register.role}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 7) {
    const validationResponse = numberValidation(text, 6);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.submitDetails}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 8 && text.split('*')[7] === '1') {
    const userDetails = {
      first_name: text.split('*')[0],
      last_name: text.split('*')[1],
      id_no: text.split('*')[2],
      gender: text.split('*')[3],
      password: text.split('*')[4],
      password_confirmation: text.split('*')[5],
      role_id: text.split('*')[6],
    };
    const registrationResponse = await registerUser(userDetails, phoneNumber);
    console.log('This response is', registrationResponse.data.data);
    const role = registrationResponse.status === 200 ? registrationResponse.data.data.role_id
      : null;

    if (role === null) {
      message = 'CON Hmm... I don\'t know you. Please register first.';
    } else if (role === '1') {
      message = 'CON Welcome to Mamlaka Foods, you have registred as a farmer';
    } else if (role === '2') {
      message = 'CON Welcome to Mamlaka Foods, you have registred as a buyer';
    }
  }
  return message;
};

/**
 * This function renders the login menu prompt.
 * @returns A string that is the prompt for the user to enter their password.
 */
export const renderLoginMenus = () => {
  let menuPrompt = `${con()} ${menus.login.password}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

/**
 * This function renders the menus for the farmer.
 * @returns A string that is the message that is displayed to the user.
 */
export const renderFarmerMenus = () => {
  let menuPrompt = `${con()} ${menus.farmer.updateLocation}`;
  menuPrompt += menus.farmer.addFarmDetails;
  menuPrompt += menus.farmer.addProduct;
  menuPrompt += menus.farmer.updateDetails;
  menuPrompt += menus.farmer.updateListedProduce;
  menuPrompt += menus.more;
  message = menuPrompt;
  return message;
};

export const renderLocationOptions = () => {
  const menuPrompt = `${con()} ${menus.farmer.addFarmLocationOption}`;
  message = menuPrompt;
  return message;
};
/**
 * This function renders the second level of the farmer menu.
 * @returns A string that is the message that is being displayed to the user.
 */
export const renderFarmerMenusLevelTwo = () => {
  let menuPrompt = `${con()} ${menus.farmer.joinGroup}`;
  menuPrompt += `${menus.farmer.myFarms}`;
  message = menuPrompt;
  return message;
};

export const renderCropCalendarMenus = () => {
  const menuPrompt = `${con()} ${menus.farmer.cropCalendarMenus}`;
  message = menuPrompt;
  return message;
};
/**
 * This function renders the buyer menu.
 * @returns A string that is the message that is to be sent to the user.
 */
export const renderBuyerMenus = () => {
  let menuPrompt = `${con()} ${menus.buyermenu.viewProducts}\n`;
  menuPrompt += `${menus.buyermenu.myCart}\n`;
  menuPrompt += `${menus.buyermenu.myOrders}\n`;
  menuPrompt += `${menus.buyermenu.groupOrder}\n`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
