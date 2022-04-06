/* eslint-disable import/no-cycle */

const usernameValidation = (text, index, menus, stringToDelete, client) => {
  const username = text.split("*")[`${index}`];
  const regex = /^[a-zA-Z]*$/;
  if (username.length < 3) {
    return `${menus.userNameTooShort}`;
  }
  if (!regex.test(username)) {
    client.del(stringToDelete);
    return `${menus.usernameOnlyLetters}`;
  }
  return `${menus.valid}`;
};
export const IdValidation = (text, menus, stringToDelete, client) => {
  const id = text.split("*")[3];
  const regex = /^[0-9]*$/;
  if (id.length < 8) {
    return `${menus.idTooShort}`;
  }
  if (!regex.test(id)) {
    client.del(stringToDelete);
    return `${menus.idOnlyNumbers}`;
  }
  return `${menus.valid}`;
};
export const numberValidation = (text, index, menus) => {
  const number = text.split("*")[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return `${menus.chooseListedOptions}`;
  }
  return `${menus.valid}`;
};

export const numberWithinRange = (text, index, menus) => {
  const number = text.split("*")[`${index}`];
  const regex = /^\d+$/;
  if (!regex.test(number)) {
    return `${menus.outOfRange}`;
  }
  return `${menus.valid}`;
};

export const languageChooser = (option) => {
  const language = option === "1" ? "en" : "sw";
  return language;
};

export const createIdsObject = (ids) => {
  const id = {};
  ids.forEach((item, index) => {
    id[`${(index += 1)}`] = item;
  });
  return id;
};

export default usernameValidation;
