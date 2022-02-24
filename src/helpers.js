/* eslint-disable import/no-cycle */
import { menus } from './menus/menuoptions.js';

const usernameValidation = (text, index) => {
  const username = text.split('*')[`${index}`];
  const regex = /^[a-zA-Z]*$/;
  if (username.length < 3) {
    return `${menus.helpers.userNameTooShort}`;
  } if (!regex.test(username)) {
    return `${menus.helpers.usernameOnlyLetters}`;
  }
  return `${menus.helpers.valid}`;
};
export const IdValidation = (text) => {
  const id = text.split('*')[2];
  const regex = /^[0-9]*$/;
  if (id.length < 8) {
    return `${menus.helpers.idTooShort}`;
  }
  if (!regex.test(id)) {
    return `${menus.helpers.idOnlyNumbers}`;
  }
  return `${menus.helpers.valid}`;
};
export const numberValidation = (text, index) => {
  const number = text.split('*')[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return `${menus.helpers.chooseListedOptions}`;
  }
  return `${menus.helpers.valid}`;
};

export const numberWithinRange = (text, index) => {
  const number = text.split('*')[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return `${menus.helpers.outOfRange}`;
  }
  return `${menus.helpers.valid}`;
};

export const languageChooser = (option) => {
  const language = option === '1' ? 'English' : 'Swahili';
  return language;
};

export default usernameValidation;