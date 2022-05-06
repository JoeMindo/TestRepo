/* eslint-disable import/no-cycle */
/* eslint-disable prefer-destructuring */
import { retreiveCachedItems } from '../core/services.js';
import client from '../server.js';
import { con, end } from '../menus/rendermenu.js';
import makebasicOrder from '../orders/unitOrder.js';
import makePayment from '../payment/payment.js';
import { itemSelection } from '../products/productmanagement.js';

export const offersArray = [];
export const cartItems = [];
export const totalCost = {};

let message;

/**
 * Ask the user for a number.
 * @returns The message variable.
 */
export const askPaymentPlan = (menus) => {
  message = `${
    con()
  } ${
    menus.choosePaymentPlan
  }`;
  return message;
};
/**
 * Ask the user for the quantity they want to buy.
 * @returns A string
 */
export const askForQuantity = (menus) => {
  message = `${
    con()
  } ${
    menus.quantityToBuy
  }`;
  return message;
};
/**
 * If the price type is both, and the user chooses unit, then the status is unit. If the price type
is both, and the user chooses group, then the status is group. If the price type is unit, then the
status is unit. If the price type is group, then the status is group.
 * @param availablePriceType - the type of price that is available for the user to use
 * @param choice - the user's choice of price type
 * @returns The price type that is being used.
 */
export const priceToUse = (availablePriceType, choice) => {
  let status;
  if ((availablePriceType === 'both' && choice === '1') || availablePriceType === 'unit') {
    status = 'unit';
  } else if ((availablePriceType === 'both' && choice === '2') || availablePriceType === 'group') {
    status = 'group';
  }

  return status;
};

/**
 * Show the cart items
 * @param client - The client object that is used to interact with the database.
 * @returns An array of objects.
 */
export const showCartItems = async (client, idsArray) => {
  let prompt = '';
  let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
  fetchCartItems = JSON.parse(fetchCartItems);
  if (fetchCartItems.length > 0) {
    fetchCartItems = fetchCartItems.filter((value) => Object.keys(value).length !== 0);
    fetchCartItems.forEach((item, index) => {
      idsArray.push(item.id);
      prompt += `${
        (index += 1)
      }. ${
        item.product
      }, ${
        item.farmName
      }, ${
        item.grade
      } ${
        item.totalCost
      }\n`;
    });
    return { prompt, idsArray };
  }
};

/**
 * * If the cartItems key doesn't exist, create a new array and add the items object to it.
 * * If the cartItems key exists, retrieve the existing array and check if the item is already in
 * the array.
 * * If the item is not in the array, add it to the array.
 * * If the item is in the array, increase the quantity and update the total cost
 * @param client - The client object that is returned from the redis client.
 * @param itemsObject - The item object that is being added to the cart.
 * @param totalPriceObject - The total price of the items in the cart.
 * @param menus - The menus object that contains the menu items.
 * @returns The message is being returned.
 */
export const addToCart = async (client, itemsObject, totalPriceObject, menus) => {
  if (itemsObject && totalPriceObject) {
    let existingItems = await retreiveCachedItems(client, ['cartItems']);
    client.exists('cartItems', (err, ok) => {
      if (err) throw err;

      if (ok === 0) {
        cartItems.push(itemsObject);

        client.set('cartItems', JSON.stringify(cartItems));
      } else if (ok === 1) {
        existingItems = JSON.parse(existingItems);
        // Check if item is already in cart
        const index = existingItems.findIndex((item) => item.id === itemsObject.id);

        if (index === -1) {
          existingItems.push(itemsObject);
          client.set('cartItems', JSON.stringify(existingItems));
        } else {
          const newTotal = existingItems[`${index}`].userQuantity * existingItems[`${index}`].unitPrice;
          // Increase quantity function
          existingItems[`${index}`].userQuantity += itemsObject.userQuantity;
          existingItems[`${index}`].totalCost = newTotal;
          client.set('cartItems', JSON.stringify(existingItems));
        }
      }
    });
    message = `${
      con()
    } ${
      menus.successfullyAddItemsTocart
    }`;
  } else {
    message = `${
      con()
    } ${
      menus.noItemsAddedToCart
    }`;
  }
  return message;
};

/**
 * It takes in the client, itemsObject and totalPriceObject and adds them to the cartItems array.
 * @param client - The client object that is used to interact with the database.
 * @param itemsObject - The object that contains the item name, quantity, price, and total price
 * @param totalPriceObject - {
 * @returns The message that is being returned.
 */
export const confirmNewQuantity = (client, itemsObject, totalPriceObject, menus) => {
  if (itemsObject && totalPriceObject) {
    cartItems.push(itemsObject);
    client.set('cartItems', JSON.stringify(cartItems));
    message = `${
      con()
    } ${
      menus.cartItemsUpdatedSuccessfully
    }`;
  } else {
    message = `${
      con()
    } ${
      menus.noItemSelectedToUpdate
    }`;
  } message += menus.footer;
  return message;
};

/**
 * This function is used to update the cart.
 * @param type - The type of update to perform. Can be 'add' or 'remove'.
 * @returns The message that is being returned.
 */
export const updateType = async (type, menus) => {
  if (type === 'remove') {
    message = `${
      con()
    } ${
      menus.askForItemToRemove
    }`;
  } else {
    message = `${
      con()
    } ${
      menus.askForItemToUpdate
    }`;
  }
  const response = await showCartItems(client, []);
  console.log('The response here is', response);
  client.set('idToUpdate', JSON.stringify(response.idsArray));
  message += response.prompt;
  return message;
};
/**
 * Removing Item from cart
 * @param id - The id of the item to be removed from the cart
 * @returns The cart items
 */
export const removeItemFromCart = async (id, menus) => {
  console.log('The id is', id);
  let cartItems = await retreiveCachedItems(client, ['cartItems']).catch((err) => err);
  cartItems = JSON.parse(cartItems);

  cartItems.forEach((item) => {
    if (item.id === id) {
      const indexOfItem = cartItems.indexOf(item);
      cartItems.splice(indexOfItem, 1);

      client.set('cartItems', JSON.stringify(cartItems));
      message = `${
        con()
      } ${
        menus.itemRemovedSuccessfully
      }`;
    } else {
      message = `${
        con()
      } ${
        menus.itemNotFound
      }`;
    }
  });
  return message;
};

/**
 * This function will remove an item from the cart and update the total cost of the cart.
 * @param client - The redis client
 * @param amount - The amount of the item to be added to the cart
 * @param object - The object that is being updated
 * @param id - The id of the item to be updated
 * @returns A string
 */
export const changeQuantity = async (client, amount, object, id, menus) => {
  let cartItems = await retreiveCachedItems(client, ['cartItems']).catch((err) => err);
  cartItems = JSON.parse(cartItems);
  const newCartItems = [...cartItems];
  const oldObject = object;
  const indexToRemove = cartItems.findIndex((x) => x.id === id);
  newCartItems.splice(indexToRemove, 1);
  const newTotalCost = oldObject.unitPrice * parseInt(amount, 10);
  oldObject.totalCost = newTotalCost;
  oldObject.userQuantity = parseInt(amount, 10);
  newCartItems.push(oldObject);

  client.set('cartItems', JSON.stringify(newCartItems));
  message = `${
    end()
  } ${
    menus.updatedSuccessfully
  }`;
  return message;
};

/**
 * Find the item in the cart that matches the id provided and return the item.
 * @param client - The client object that you can use to interact with the cache.
 * @param id - The id of the item you want to update
 * @returns {
 *   message: '',
 *   itemToUpdate: {
 *     id: '',
 *     name: '',
 *     price: '',
 *     quantity: '',
 *   },
 * }
 */
export const findItemToChangeQuantity = async (client, id, menus) => {
  let cartItems = await retreiveCachedItems(client, ['cartItems']).catch((err) => err);

  cartItems = JSON.parse(cartItems);

  const itemToUpdate = cartItems.find((x) => x.id === id);
  if (itemToUpdate) {
    message = `${
      con()
    } ${
      menus.updatedQuantityToBuy
    }`;
  } else {
    message = `${
      con()
    } ${
      menus.itemNotFound
    }`;
  }

  return { message, itemToUpdate };
};

/**
 * It retrieves the total cost of the items in the cart and displays it to the user.
 * @param client - The client object that is used to interact with the user
 * @returns The total cost of the items in the cart
 */
export const displayTotalCost = async (client, menus) => {
  try {
    const chargeToUser = await retreiveCachedItems(client, ['totalCost']);
    message = `${
      con()
    } ${
      menus.paymentPrompt
    } ${chargeToUser}\n ${
      menus.yes
    }`;
    message += menus.footer;
  } catch (error) {
    throw new Error(error);
  }
  return message;
};

/**
 * Cannot generate summary
 * @param request - the request object
 * @returns The request object.
 */
export const updateRequest = (request) => {
  const array = request.body.text.split('*');
  array.splice(2, array.length);
  request.text = array.join('*');
  return request;
};
export const displayCartItems = async (client, menus) => {
  try {
    let prompt = '';
    let fetchCartItems = await retreiveCachedItems(client, ['cartItems']);
    fetchCartItems = JSON.parse(fetchCartItems);
    if (fetchCartItems.length > 0) {
      fetchCartItems = fetchCartItems.filter((value) => Object.keys(value).length !== 0);
      fetchCartItems.forEach((item, index) => {
        prompt += `${
          (index += 1)
        }. ${
          item.product
        } ${
          menus.from
        } ${
          item.farmName
        } ${
          menus.grade
        }: ${
          item.grade
        } ${
          menus.atKES
        } ${
          item.totalCost
        }\n`;
      });
      const availableTotal = fetchCartItems.reduce((total, obj) => obj.totalCost + total, 0);
      message = `${
        con()
      } ${
        menus.yourCartItems
      } ${prompt} ${
        menus.total
      } ${availableTotal}\n ${
        menus.checkoutAndUpdate
      }`;
    } else if (Object.keys(fetchCartItems[0]).length === 0) {
      message = `${
        con()
      } ${
        menus.noItemsInCart
      }`;
      message += menus.footer;
    }
    return message;
  } catch (error) {
    throw new Error(error);
  }
};
export const updateCart = async (operation, menus, id = null) => {
  if (operation === 'firstscreen') {
    message = `${
      con()
    } ${
      menus.operation
    }`;
  } else if (operation === 'removeItem') {
    message = await removeItemFromCart(id, menus);
  } else if (operation === 'updateItemCount') {
    message = await findItemToChangeQuantity(id, menus);
  } else {
    message = `${
      end()
    } ${
      menus.itemNotFound
    }`;
  }
  return message;
};

/*
1. Level 0: Display all the cart items
2. Level 1: Choose between checkout and update cart
3. Level 2: If update cart choose remove or update count
4. Level 3: Remove item or update quantity
5. Level 4: Check quantity if matches
6. level 5: If checkout then ask for details and make order
*/

export const cartOperations = async (
  text, menuLevel, level, menus, itemId = null, index = null,
) => {
  let selection;
  if (menuLevel === 'inner') {
    selection = text.split('*')[7];
  } else if (menuLevel === 'outer') {
    selection = text.split('*')[2];
  }

  if (level === 0) {
    message = await displayCartItems(client, menus);
  } else if (selection === '1' && level === 1) {
    message = askPaymentPlan(menus);
  } else if (selection === '2' && level === 1) {
    message = updateCart('firstscreen', menus);
  } else if (level === 2) {
    message = await updateType('remove', menus);
  } else if (level === 3) {
    message = await updateType('updateItemCount', menus);
  } else if (level === 4) {
    message = await removeItemFromCart(itemId, menus);
  } else if (level === 5) {
    const response = await findItemToChangeQuantity(client, itemId, menus);
    message = response.message;
  } else if (level === 6) {
    const response = await findItemToChangeQuantity(client, itemId, menus);

    const item = response.itemToUpdate;
    message = changeQuantity(client, index, item, itemId, menus);
  } else if (level === 7) {
    message = confirmNewQuantity(client, itemSelection, totalCost, menus);
  } else if (level === 8) {
    console.log('I am executed');
    const products = [];
    const details = await retreiveCachedItems(client, ['user_id', 'cartItems']);

    const cartItems = JSON.parse(details[1]);

    cartItems.forEach((item) => {
      const pickedFields = (({
        id,
        // eslint-disable-next-line camelcase
        product_id,
        userQuantity,
        grade,
        totalCost,
      }) => ({
        id,
        product_id,
        userQuantity,
        grade,
        totalCost,
      }))(item);
      if (pickedFields.userQuantity > 0 && pickedFields.totalCost > 0) {
        const cartSelections = {
          id: pickedFields.id,
          product_id: pickedFields.product_id,
          grade: pickedFields.grade,
          units: pickedFields.userQuantity,
          price: pickedFields.totalCost,
        };
        products.push(cartSelections);
      }
    });

    const cartSelections = {
      centre_id: 5,
      user_id: parseInt(details[0], 10),
      products,
      order_priority: 'medium',
    };

    const response = await makebasicOrder(cartSelections);
    console.log('The response is', response);
    if (response.status === 200) {
      client.del('cartItems');
      message = `${
        end()
      } ${
        menus.orderSuccess
      }`;
    } else if (response.status === 500) {
      message = `${
        con()
      } ${
        menus.orderFailed
      }`;
    }
  } else if (level === 9) {
    message = makePayment(menus);
  }
  return message;
};

export default cartOperations;
