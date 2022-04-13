/* eslint-disable import/no-cycle */
import * as farmerMenus from './farmermenus.js';
import { renderFarmerMenus, con } from '../../menus/rendermenu.js';
import { getStrings } from '../../menus/language.js';
import { strings } from '../../menus/strings.js';

const checkFarmerSelection = async (text, startIndex, language) => {
  let message;
  const menus = getStrings(strings, language);
  const textToUse = text.split('*').slice(startIndex).join('*');
  const textValue = textToUse.split('*').length;
  if (textValue === 1) {
    message = renderFarmerMenus(menus);
  } else if (textToUse !== '') {
    const selection = textToUse.split('*')[1];
    if (selection === '1') {
      message = await farmerMenus.renderUpdateLocationMenu(
        textValue,
        textToUse,
        menus,
      );
    } else if (selection === '2') {
      message = await farmerMenus.renderAddFarmDetailsMenu(
        textValue,
        textToUse,
        menus,
      );
    } else if (selection === '3') {
      message = farmerMenus.renderFarmerAddProductMenu(
        textValue,
        textToUse,
        menus,
      );
    } else if (selection === '4') {
      message = farmerMenus.renderFarmerUpdateDetailsMenu(
        textValue,
        textToUse,
        menus,
      );
    } else if (selection === '5') {
      message = farmerMenus.renderUpdateListedProduceMenu(
        textValue,
        textToUse,
        menus,
      );
    } else if (selection === '98') {
      message = farmerMenus.secondLevelMenu(textValue, textToUse, menus);
    } else {
      message = `${con()} ${menus.invalidInput}`;
    }
  }
  return message;
};

export default checkFarmerSelection;
