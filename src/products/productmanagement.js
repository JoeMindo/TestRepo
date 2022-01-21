import axios from 'axios';
import { BASEURL } from '../core/urls.js';
import { retreiveCachedItems } from '../core/services.js';
import { menus } from '../menus/menuoptions.js';
import { con } from '../menus/rendermenu.js';

const optionProducts = [];
export const offersArray = [];
export const cartItems = [];
export const totalCost = {};
export const itemSelection = {};

/**
 * It fetches the categories from the server and returns them as a string.
 * @returns The categories are being returned as a string.
 */
async function fetchCategories() {
  let results = '';
  const response = await axios.get(`${BASEURL}/ussd/prodcategories`).catch((err) => err.response);
  if (response.status === 200) {
    response.data.data.data.forEach((category) => {
      optionProducts.push(category.id);
      results += `\n${category.id}. ${category.category_name}`;
    });
  }
  return results;
}

async function fetchProducts(id) {
  let results = '';
  const response = await axios.get(`${BASEURL}/ussd/prodcategories`).catch((err) => err.response);
  response.data.data.data.forEach((item) => {
    item.products.forEach((description) => {
      if (description.category_id === id) {
        results += `${description.id}. ${description.product_name}\n `;
      }
    });
  });
  return results;
}

const fetchFarmOfferings = async (id) => {
  let farmOfferings = '';
  try {
    const response = await axios.get(`${BASEURL}/ussd/prodcategories`);
    response.data.forEach((item) => {
      item.farm_products.forEach((farmItem) => {
        if (farmItem.product_id === id) {
          farmOfferings += `${farmItem.farm_id}. Available units: ${farmItem.units} grade of items: ${farmItem.grade}\n `;
        }
      });
    });
    return farmOfferings;
  } catch (error) {
    throw new Error(error);
  }
};

const addProduct = async (productdata) => {
  const newProduct = axios.post(
    `${BASEURL}/ussd/farmproduct/save`,
    productdata,
  ).catch((err) => err.response);
  return newProduct;
};
const productsInFarm = async (farmID) => {
  const products = await axios.get(`${BASEURL}/ussd/farmproducts/farm/${farmID}`).catch((err) => err.response);
  return products;
};
const updateListedProduct = async (id, data) => {
  const updatedProduce = await axios.post(
    `${BASEURL}/ussd/farmproduct/update/${id}`, data,
  )
    .catch((err) => err.response);
  return updatedProduce;
};
const getSpecificProduct = async (id) => {
  try {
    const specificProduct = await axios.get(`${BASEURL}/ussd/products/all`);
    const filteredItems = specificProduct.data.filter((item) => item.id === id);
    let respose = '';
    filteredItems.forEach((filteredItem) => {
      respose += `${filteredItem.id}. ${filteredItem.product_name}`;
    });
    return respose;
  } catch (err) {
    return false;
  }
};

export const confirmQuantityWithPrice = async (
  userQuantity,
  productID,
  status,
  client,
) => {
  let availableUnits = 0;
  let pricePoint;
  let message;
  let offers = await retreiveCachedItems(client, ['offersArray']);
  offers = JSON.parse(offers);
  const buyerSelection = offers.filter((item) => item.id === productID);

  availableUnits = buyerSelection[0].availableUnits;

  if (userQuantity > availableUnits) {
    message = `${con()} The amount you set is higher than the available units go back and choose a smaller quantity`;
  } else {
    if (status === 'unit') {
      pricePoint = parseInt(buyerSelection[0].unitPrice, 10);
    } else if (status === 'group') {
      pricePoint = parseInt(buyerSelection[0].groupPrice, 10);
    }

    const total = userQuantity * pricePoint;

    const prompt = `${buyerSelection[0].product} from ${buyerSelection[0].farmName} of grade:${buyerSelection[0].grade} at ${pricePoint}`;

    itemSelection.id = parseInt(`${buyerSelection[0].id}`, 10);
    itemSelection.product = `${buyerSelection[0].product}`;
    itemSelection.farmName = `${buyerSelection[0].farmName}`;
    itemSelection.grade = `${buyerSelection[0].grade}`;
    // TODO: This should return an integer
    itemSelection.product_id = parseInt(`${buyerSelection[0].product_id}`, 10);
    itemSelection.userQuantity = parseInt(`${userQuantity}`, 10);
    itemSelection.unitPrice = pricePoint;
    itemSelection.totalCost = total;
    message = `${con()} Buy ${prompt}\n Total ${total}\n 1. Add to cart`;
  }
  message += menus.footer;
  return message;
};

export {
  fetchCategories,
  fetchProducts,
  addProduct,
  getSpecificProduct,
  fetchFarmOfferings,
  updateListedProduct,
  productsInFarm,
};