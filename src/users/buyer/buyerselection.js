/* eslint-disable import/no-cycle */
import { renderBuyerMenus, con, renderShippingMenus } from '../../menus/rendermenu.js';
// import * as groupOrderMenus from '../../orders/groupOrder.js';
import { showAvailableProducts } from '../../products/renderProducts.js';
import { retreiveCachedItems } from '../../core/services.js';
import client from '../../server.js';
import { cartOperations } from '../../cart/cartoperations.js';
import { numberWithinRange } from '../../helpers.js';
import { renderOrders } from '../../orders/unitOrder.js';
import { strings } from '../../menus/strings.js';
import { getStrings } from '../../menus/language.js';
import createNewShippingAddress from '../../shipping/newaddress.js';
import renderShippingAddresses from '../../shipping/viewaddresses.js';

let message;

const checkBuyerSelection = async (textValue, text, language, phone = null) => {
  const menus = getStrings(strings, language);
  if (textValue === 1 && text !== '') {
    message = renderBuyerMenus(menus);
  } else {
    const selection = text.split('*')[1];
    const isNumber = numberWithinRange(text, 1, menus);
    if (isNumber === 'valid') {
      if (selection === '1') {
        message = await showAvailableProducts(client, textValue, text, menus, phone);
      } else if (selection === '2') {
        if (textValue === 2) {
          message = await cartOperations(text, 'outer', 0, menus);
        } else if (textValue === 3 && text.split('*')[2] === '1') {
          message = await cartOperations(text, 'outer', 1, menus);
        } else if (textValue === 3 && text.split('*')[2] === '2') {
          message = await cartOperations(text, 'outer', 1, menus);
        } else if (textValue === 4 && text.split('*')[2] === '1' && text.split('*')[3] === '1') {
          message = await cartOperations(text, 'outer', 8, menus);
        } else if (textValue === 4 && text.split('*')[2] === '1' && text.split('*')[3] === '2') {
          message = await cartOperations(text, 'outer', 9, menus, null, null, phone);
        } else if (textValue === 4 && text.split('*')[3] === '1') {
          message = await cartOperations(text, 'outer', 2, menus);
        } else if (textValue === 4 && text.split('*')[3] === '2') {
          message = await cartOperations(text, 'outer', 3, menus);
        } else if (textValue === 5 && text.split('*')[4] === '1' && text.split('*')[3] === '1' && text.split('*')[2] === '1') { // TODO: Make payment
          message = await cartOperations(text, 'outer', 9, menus, null, null, phone);
        } else if (textValue === 5 && text.split('*')[3] === '1') {
          let ids = await retreiveCachedItems(client, ['idToUpdate']);
          ids = JSON.parse(ids[0]);
          const id = ids[parseInt(text.split('*')[4], 10) - 1];
          message = await cartOperations(text, 'outer', 4, menus, id);
        } else if (textValue === 5 && text.split('*')[3] === '2') {
          let ids = await retreiveCachedItems(client, ['idToUpdate']);
          ids = JSON.parse(ids[0]);
          const id = ids[parseInt(text.split('*')[4], 10) - 1];
          message = await cartOperations(text, 'outer', 5, menus, id);
        } else if (textValue === 6 && text.split('*')[3] === '1' && text.split('*')[5] === '67') {
          message = await cartOperations(text, 'outer', 0);
        } else if (textValue === 6 && text.split('*')[3] === '2') {
          let ids = await retreiveCachedItems(client, ['idToUpdate']);
          ids = JSON.parse(ids[0]);
          const id = ids[parseInt(text.split('*')[4], 10) - 1];
          const newQuantity = parseInt(text.split('*')[5], 10);
          const response = await cartOperations(text, 'outer', 6, menus, id, newQuantity);
          message = response;
        } else if (textValue === 7 && text.split('*')[3] === '2') {
          const id = parseInt(text.split('*')[4], 10);
          message = await cartOperations(text, 'outer', 6, id);
        }
      } else if (selection === '3') {
        let userId = await retreiveCachedItems(client, ['user_id']);
        userId = parseInt(userId[0], 10);
        const result = await renderOrders(userId, menus);
        message = `${
          con()
        } ${result}`;
        message += menus.footer;
      } else if (selection === '4') {
        // // const status = await groupOrderMenus.checkIfUserIsInGroup();
        // message = groupOrderMenus.actionToTake(false, menus);
        // if (textValue === 2) {
        // message = groupOrderMenus.requestGroupName(menus);
        // } else if (textValue === 3) {
        // let userId = await retreiveCachedItems(client, ['user_id']);
        // // TODO: Use the userId in place of dean ID

        // userId = parseInt(userId[0], 10);
        // const groupData = {
        //     dean_id: userId,
        //     group_name: text.split('*')[2],
        //     group_type: 2,
        //     status: 1,
        // };
        // const response = await groupOrderMenus.createGroup(groupData);
        // message = groupOrderMenus.groupCreationMessage(response, menus);
        // } else {
        // message = await groupOrderMenus.groupPricedItems(
        //     textValue,
        //     text,
        //     menus,
        // );
        // }
        if (textValue === 2) {
          message = renderShippingMenus(menus);
        } else if (textValue === 3 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.inputCity
          }`;
          message += menus.footer;
        } else if (textValue === 4 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.inputLandmark
          }`;
          message += menus.footer;
        } else if (textValue === 5 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.isHome
          }`;
          message += menus.footer;
        } else if (textValue === 6 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.isBilling
          }`;
          message += menus.footer;
        } else if (textValue === 7 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.isPrimary
          }`;
          message += menus.footer;
        } else if (textValue === 8 && text.split('*')[2] === '1') {
          message = `${
            con()
          } ${
            menus.confirmShippingDetails
          }`;
          message += menus.footer;
        } else if (textValue === 9 && text.split('*')[2] === '1' && text.split('*')[8] === '1') {
          const shippingResponses = text.split('*');
          let userID = await retreiveCachedItems(client, ['user_id']);
          userID = parseInt(userID[0], 10);
          const shippingData = {
            country: 'Kenya',
            city: shippingResponses[3],
            landmark: shippingResponses[4],
            is_home: shippingResponses[5] === '1' ? 1 : 0,
            is_shipping: 1,
            lat: 1.1,
            lng: 1.1,
            is_billing: shippingResponses[6] === '1' ? 1 : 0,
            is_primary: shippingResponses[7] === '1' ? 1 : 0,

          };

          // eslint-disable-next-line max-len
          const createShippingAddressResponse = await createNewShippingAddress(shippingData, userID);

          if (createShippingAddressResponse.status === 200) {
            message = `${
              con()
            } ${
              menus.shippingAddressCreated
            }`;
          } else {
            message = `${
              con()
            } ${
              menus.shippingAddressNotCreated
            }`;
          }
        } else if (textValue === 3 && text.split('*')[2] === '2') {
          let userID = await retreiveCachedItems(client, ['user_id']);
          userID = parseInt(userID[0], 10);
          message = await renderShippingAddresses(menus, userID);
        }
      }
    } else {
      message = isNumber;
    }
  }

  return message;
};

export default checkBuyerSelection;
