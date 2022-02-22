/* eslint-disable import/no-cycle */
import * as farmerMenus from './farmermenus.js';
import { renderFarmerMenus } from '../../menus/rendermenu.js';

const checkFarmerSelection = async (text, startIndex) => {
  let message;
  const textToUse = text.split('*').slice(startIndex).join('*');
  console.log('The text to use is', textToUse);
  const textValue = textToUse.split('*').length;
  if (textValue === 1 && textToUse === '') {
    message = renderFarmerMenus();
  } else if (textToUse !== '') {
    const selection = textToUse.split('*')[0];
    if (selection === '1') {
      message = await farmerMenus.renderUpdateLocationMenu(textValue, textToUse);
    } else if (selection === '2') {
      message = await farmerMenus.renderAddFarmDetailsMenu(textValue, textToUse);
    } else if (selection === '3') {
      message = farmerMenus.renderFarmerAddProductMenu(textValue, textToUse);
    } else if (selection === '4') {
      message = farmerMenus.renderFarmerUpdateDetailsMenu(textValue, textToUse);
    } else if (selection === '5') {
      message = farmerMenus.renderUpdateListedProduceMenu(textValue, textToUse);
    } else if (selection === '98') {
      message = farmerMenus.secondLevelMenu(textValue, textToUse);
    } else {
      message = 'CON Invalid choice, try again';
    }
  }
  return message;
};

export default checkFarmerSelection;
