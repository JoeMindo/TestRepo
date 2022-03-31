/* eslint-disable import/no-cycle */
import usernameValidation, {
  numberValidation,
  IdValidation,
} from '../helpers.js';
import { registerUser } from '../core/usermanagement.js';
import { getStrings } from './language.js';
import { strings } from './strings.js';

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
export const renderRegisterMenu = async (
  textValue,
  text,
  phoneNumber,
  language,
) => {
  const menus = getStrings(strings, language);
  if (textValue === 1 && text !== '') {
    let menuPrompt = `${con()} ${menus.firstname}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 2) {
    const validationResponse = usernameValidation(text, 1, menus);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.lastname}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 3) {
    const validationResponse = usernameValidation(text, 2, menus);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.idNumber}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 4) {
    const validationResponse = IdValidation(text, menus);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.gender}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 5) {
    const validationResponse = numberValidation(text, 4, menus);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.password}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 6) {
    let menuPrompt = `${con()} ${menus.confirmPassword}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 7) {
    let menuPrompt = `${con()} ${menus.role}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 8) {
    const validationResponse = numberValidation(text, 7, menus);
    if (validationResponse === 'valid') {
      let menuPrompt = `${con()} ${menus.submitDetails}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else {
      message = `${end()} ${validationResponse}`;
    }
  } else if (textValue === 9 && text.split('*')[8] === '1') {
    const userDetails = {
      first_name: text.split('*')[1],
      last_name: text.split('*')[2],
      id_no: text.split('*')[3],
      gender: text.split('*')[4],
      password: text.split('*')[5],
      password_confirmation: text.split('*')[6],
      role_id: text.split('*')[7],
    };

    const registrationResponse = await registerUser(userDetails, phoneNumber);

    const role = registrationResponse.status === 200
      ? registrationResponse.data.data.role_id
      : null;

    if (role === null) {
      message = `${con()} ${menus.couldNotAssignRole}`;
    } else if (role === '1') {
      message = `${con()} ${menus.successFarmer}`;
    } else if (role === '2') {
      message = `${con()} ${menus.successBuyer}`;
    }
  }
  return message;
};

/**
 * This function renders the login menu prompt.
 * @returns A string that is the prompt for the user to enter their password.
 */
export const renderLoginMenus = (menus) => {
  let menuPrompt = `${con()} ${menus.login.password}`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};

/**
 * This function renders the menus for the farmer.
 * @returns A string that is the message that is displayed to the user.
 */
export const renderFarmerMenus = (menus) => {
  let menuPrompt = `${con()} ${menus.updateLocation}`;
  menuPrompt += menus.addFarmDetails;
  menuPrompt += menus.addProduct;
  menuPrompt += menus.updateDetails;
  menuPrompt += menus.updateListedProduce;
  menuPrompt += menus.more;
  message = menuPrompt;
  return message;
};

export const renderLocationOptions = (menus) => {
  const menuPrompt = `${con()} ${menus.addFarmLocationOption}`;
  message = menuPrompt;
  return message;
};
/**
 * This function renders the second level of the farmer menu.
 * @returns A string that is the message that is being displayed to the user.
 */
export const renderFarmerMenusLevelTwo = (menus) => {
  let menuPrompt = `${con()} ${menus.joinGroup}`;
  menuPrompt += `${menus.myFarms}`;
  menuPrompt += `${menus.changeLocationDetails}`;
  message = menuPrompt;
  return message;
};

export const renderCropCalendarMenus = (menus) => {
  const menuPrompt = `${con()} ${menus.cropCalendarMenus}`;
  message = menuPrompt;
  return message;
};
/**
 * This function renders the buyer menu.
 * @returns A string that is the message that is to be sent to the user.
 */
export const renderBuyerMenus = (menus) => {
  let menuPrompt = `${con()} ${menus.viewProducts}\n`;
  menuPrompt += `${menus.myCart}\n`;
  menuPrompt += `${menus.myOrders}\n`;
  menuPrompt += `${menus.groupOrder}\n`;
  menuPrompt += menus.footer;
  message = menuPrompt;
  return message;
};
