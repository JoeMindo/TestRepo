/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */
import client from '../../server.js';
import { addLocation, isLocationPresent } from '../../core/usermanagement.js';
import { retreiveCachedItems, setToCache } from '../../core/services.js';
import {
  fetchCategories,
  fetchProducts,
  addProduct,
  productsInFarm,
  updateListedProduct,
  listProductForSale,
} from '../../products/productmanagement.js';
import {
  addFarm,
  addFarmerKYC,
  getAnswersPerQuestion,
  getFarmerMetricSections,
  getQuestionsPerSection,
  getUserFarms,
  showGroups,
  joinGroup,
  renderFarmerFarms,
  inputFarmLocation,
  renderProductsInFarm,
} from './farmmanagement.js';

import { responsePrompt } from '../../menus/prompts.js';
import { promptToGive } from './farmerlocation.js';
import {
  renderFarmerMenusLevelTwo,
  renderLocationOptions,
} from '../../menus/rendermenu.js';
import { numberWithinRange } from '../../helpers.js';

const con = () => 'CON';
const end = () => 'END';
export const isTextOnly = (str) => /^[a-zA-Z]+$/.test(str);

const questionanswers = {};
/**
 * It takes in a farm ID and returns a list of products in that farm
 * @param farmID - The ID of the farm that you want to see the products in.
 * @returns A string of all the products in the farm.
 */
export const showProductsInFarm = async (farmID, menus) => {
  const products = await productsInFarm(farmID);
  console.log('The products in this farm are:', products);
  const productIDs = [];
  let productList = '';
  if (products.data.status === 'success') {
    products.data.message.forEach((product) => {
      const combination = {
        id: product.id,
        prodID: product.product_id,
      };
      productIDs.push(combination);
      client.set('productIDs', JSON.stringify(productIDs));
      productList += `\n${product.id}. ${product.product_name}`;
    });
    return productList;
  }
  return `${menus.noProductsInFarm}`;
};

/**
 * This function is used to update the user's location.
 */
export const renderUpdateLocationMenu = async (textValue, text, menus) => {
  let message;
  if (textValue === 2) {
    const menuPrompt = await promptToGive(client, 'region', menus);
    message = menuPrompt;
  } else if (textValue === 3) {
    const validRange = numberWithinRange(text, 2, menus);
    if (validRange === 'valid') {
      const regionId = parseInt(text.split('*')[2], 10);
      const menuPrompt = await promptToGive(
        client,
        'county',
        menus,
        regionId,

      );
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 4) {
    const validRange = numberWithinRange(text, 3, menus);
    if (validRange === 'valid') {
      const countyId = parseInt(text.split('*')[3], 10);
      const menuPrompt = await promptToGive(client, 'subcounty', menus, countyId);
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 5) {
    const validRange = numberWithinRange(text, 4, menus);
    if (validRange === 'valid') {
      const subcountyId = parseInt(text.split('*')[4], 10);
      const menuPrompt = await promptToGive(client, 'location', menus, subcountyId);
      message = menuPrompt;
    } else {
      message = `${end()}${menus.outOfRange}`;
    }
  } else if (textValue === 6) {
    const validRange = numberWithinRange(text, 5, menus);
    if (validRange === 'valid') {
      const menuPrompt = await promptToGive(client, 'area', menus);
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else {
    client.set('userArea', text.split('*')[6]);

    const postLocationDetails = await retreiveCachedItems(client, [
      'userSubCountySelection',
      'userLocationSelection',
      'userArea',
      'user_id',
    ]);
    const postDetails = {
      sub_county_id: postLocationDetails[0],
      location_id: postLocationDetails[1],
      area: postLocationDetails[2],
    };

    const userId = parseInt(postLocationDetails[3], 10);
    const response = await addLocation(postDetails, userId);
    console.log('The response is', response);

    if (response.status === 200) {
      const menuPrompt = `${end()} ${menus.locationUpdateOk}`;
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.locationUpdateFailed},`;
      message += menus.footer;
    }
  }
  return message;
};

/**
 * This function is used to render the menu for adding farm details.
 */
export const renderAddFarmDetailsMenu = async (textValue, text, menus) => {
  let message;
  const userID = await retreiveCachedItems(client, ['user_id']);
  const locationDetailsPresent = await isLocationPresent(userID[0]);

  if (locationDetailsPresent === true) {
    if (textValue === 2) {
      message = renderLocationOptions(menus);
    } else if (textValue === 3 && text.split('*')[2] === '1') {
      let menuPrompt = `${con()} ${menus.enterFarmName}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else if (textValue === 4 && text.split('*')[2] === '1') {
      if (isTextOnly(text.split('*')[3]) === true) {
        let menuPrompt = `${con()} ${menus.farmArea}`;
        menuPrompt += menus.footer;
        message = menuPrompt;
        console.log('The farm name', text.split('*')[3]);
        client.set('farm_name', text.split('*')[3]);
      } else {
        message = `${con()} ${menus.invalidInput}`;
      }
    } else if (textValue === 5 && text.split('*')[2] === '1') {
      console.log('The location is', text.split('*')[4]);
      client.set('farm_location', text.split('*')[4]);
      let menuPrompt = `${con()} ${menus.farmSize}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
    } else if (textValue === 6 && text.split('*')[2] === '1') {
      console.log('The farm size is', text.split('*')[5]);
      client.set('farm_size', parseInt(text.split('*')[5], 10));
      const farmDetails = await retreiveCachedItems(client, [
        'farm_name',
        'farm_location',
        'farm_description',
        'farm_size',
        'user_id',
      ]);
      const postDetails = {
        farm_name: farmDetails[0],
        farm_location: farmDetails[1],
        farm_description: 'Null',
        farm_size: farmDetails[3],
        user_id: farmDetails[4],
      };
      const responseForAddingFarm = await addFarm(postDetails);
      console.log('The response is', responseForAddingFarm);

      if (responseForAddingFarm.status === 200) {
        const menuPrompt = `${end()} ${menus.registerFarmSuccess}`;
        message = menuPrompt;
        client.set('farm_id', responseForAddingFarm.data_id);
      } else {
        const menuPrompt = `${end()} ${menus.registerFarmFail}`;
        message = menuPrompt;
      }
    }
    if (text.split('*')[2] === '2') {
      message = await inputFarmLocation(textValue, text, client, menus);
    }
  } else {
    message = `${con()} ${menus.noLocation}`;
  }

  return message;
};

/**
 * This function is used to update the user's details.(KYC)
 * The above code is a function that takes in a text value and text and returns a message.
 */
export const renderFarmerUpdateDetailsMenu = async (textValue, text, menus) => {
  let message;
  if (textValue === 1) {
    const farmerMetrics = await getFarmerMetricSections();
    message = responsePrompt(farmerMetrics, 'sections');
  } else if (textValue === 2) {
    const sectionId = parseInt(text.split('*')[1], 10);
    client.set('sectionId', sectionId);
    const questions = await getQuestionsPerSection(sectionId);
    message = responsePrompt(questions, 'questions');
  } else if (textValue === 3) {
    const questionId = parseInt(text.split('*')[2], 10);
    client.set('questionId', questionId);
    const answersPerQuestion = await getAnswersPerQuestion(questionId);

    if (answersPerQuestion.status === 200) {
      let menuPrompt = '';

      answersPerQuestion.data.message[0].kyc_metrics_possible_answers.forEach(
        (answer) => {
          menuPrompt += `\n${answer.id}. ${answer.possible_answer}`;
          questionanswers[answer.id] = answer.possible_answer;
          questionanswers.question_id = answer.question_id;
        },
      );
      message = `${con()} ${menus.selectAResponse}`;
      message += menuPrompt;
      message += '\n#. Other';
      message += menus.footer;
    } else {
      message = `${end()} ${menus.answerNotAvailable}`;
    }
  } else if (textValue === 4) {
    const userAnswers = text.split('*')[3];
    if (userAnswers === '0') {
      message = `${con()} ${menus.typeAnswer}`;
      // res.send(message);
    } else {
      const userAnswersArray = userAnswers.split(' ');

      let answers = '';
      userAnswersArray.forEach((answer) => {
        const answerId = parseInt(answer, 10);
        answers += `${questionanswers[`${answerId}`]} `;
      });
      client.set('answers', answers);

      message = `${con()} ${menus.proceed}`;
    }
  } else if (textValue === 5) {
    if (text.split('*')[3] === '0') {
      setToCache(text, 4, client, 'answers');
    }

    const results = await retreiveCachedItems(client, [
      'user_id',
      'answers',
      'questionId',
    ]);

    const kycInfo = {
      metric_id: results[2],
      answer: results[1],
    };
    const updateKYC = await addFarmerKYC(kycInfo, results[0]);
    if (updateKYC.status === 200) {
      message = `${end()} ${menus.success}`;
    } else {
      message = `${end()} ${menus.failure}`;
    }
  }
  return message;
};

/**
 * This function is used to render the menu for adding a product to a farm
 * We have a function that takes in a text value and a text value and returns a message.
 */
export const renderFarmerAddProductMenu = async (textValue, text, menus) => {
  let message = '';
  const items = await retreiveCachedItems(client, ['user_id']);
  const userID = parseInt(items[0], 10);
  const hasFarms = await getUserFarms(userID);
  console.log('The farmer farms', hasFarms.data);
  if (hasFarms.status === 404) {
    message = `${con()} ${menus.noFarms}`;
  } else if (hasFarms.status === 200) {
    let farmList = '';
    hasFarms.data.message.forEach((farm) => {
      farmList += `\n${farm.id}. ${farm.farm_name}`;
    });
    message = `${con()} ${menus.chooseFarm}  ${farmList}`;
    if (textValue === 3) {
      client.set('farm_id', parseInt(text.split('*')[2], 10));
      const menuPrompt = `${con()} ${
        menus.category
      }${await fetchCategories()}`;
      message = menuPrompt;
    } else if (textValue === 4) {
      const categoryId = parseInt(text.split('*')[3], 10);
      client.set('category_id', categoryId);
      const products = await fetchProducts(categoryId);
      const menuPrompt = `${con()} ${menus.productToAdd} \n ${products}`;
      message = menuPrompt;
    } else if (textValue === 5) {
      const productId = parseInt(text.split('*')[4], 10);
      client.set('product_id', productId);
      // TODO: This should be a dynamic prompt
      const menuPrompt = `${con()} ${menus.quantityOfHarvest}`;
      message = menuPrompt;
    } else if (textValue === 6) {
      const availableQuantity = text.split('*')[5];
      // TODO: Add product
      const productData = await retreiveCachedItems(client, [
        'farm_id',
        'product_id',
      ]);
      const postProductDetails = {
        farm_id: productData[0],
        product_id: productData[1],
        capacity: availableQuantity,
      };
      const addingProduct = await addProduct(postProductDetails);
      console.log('The product data', addingProduct);

      if (addingProduct.status === 200) {
        message = `${end()} ${menus.productAddedSuccessfully}`;
      } else {
        message = `${end()} ${menus.productAddedFailure}`;
      }
    }
  }
  message += menus.footer;
  return message;
};

/**
 * This function renders the update listed produce menu.
 * @param userID - the user's ID
 * @returns None
 */
export const renderUpdateListedProduceMenu = async (textvalue, text, menus) => {
  let userID = await retreiveCachedItems(client, ['user_id']);
  userID = parseInt(userID, 10);
  const hasFarms = await getUserFarms(userID);
  console.log('The user farms are', hasFarms.data.message);
  const userFarms = [];

  let message = '';
  if (hasFarms.status === 404) {
    message = `${con()} ${menus.updateListedProduceNotFound}`;
  } else if (hasFarms.status === 200) {
    let farmList = '';
    hasFarms.data.message.forEach((farm) => {
      userFarms.push(farm.id);
      farmList += `\n${farm.id}. ${farm_name}`;
    });
    message = `${con()} ${menus.updateListedProduce.chooseFarm} ${farmList}`;
  }
  const farmID = parseInt(text.split('*')[1], 10);

  if (textvalue === 2 && userFarms.includes(farmID)) {
    // message = `${con()} What produce do you want to update the quantity ${productList}`;
    message = `${con()} ${menus.updateListedProduce.actionToTake} ${
      menus.updateListedProduce.updateQuantity
    } ${menus.updateListedProduce.listForSale}`;
  } else if (textvalue === 3 && text.split('*')[2] === '1') {
    const list = await showProductsInFarm(farmID);
    message = `${con()} ${
      menus.updateListedProduce.chooseProduceToUpdateQuantity
    }${list}`;
  } else if (textvalue === 3 && text.split('*')[2] === '2') {
    const list = await showProductsInFarm(farmID);
    message = `${con()} ${menus.updateListedProduce.itemToSell}  ${list}`;
  } else if (textvalue === 4 && text.split('*')[2] === '1') {
    message = `${con()} ${menus.updateListedProduce.itemQuantity}`;
  } else if (textvalue === 4 && text.split('*')[2] === '2') {
    message = `${con()} ${menus.updateListedProduce.bagsForSale}`;
  } else if (textvalue === 5 && text.split('*')[2] === '1') {
    const updatedQuantity = text.split('*')[4];
    const productID = parseInt(text.split('*')[3], 10);
    let retreivedIDs = await retreiveCachedItems(client, ['productIDs']);
    retreivedIDs = JSON.parse(retreivedIDs[0]);
    const productIdentity = retreivedIDs.find(
      (product) => product.id === productID,
    );
    const data = {
      farm_id: farmID,
      product_id: productIdentity.prodID,
      capacity: updatedQuantity,
    };

    const updatedProduce = await updateListedProduct(productID, data);
    if (updatedProduce.status === 200) {
      message = `${end()} ${menus.updateListedProduce.success}`;
    } else {
      message = `${end()}${updatedProduce}`;
    }
  } else if (textvalue === 5 && text.split('*')[2] === '2') {
    const farmProductID = text.split('*')[3];
    const quantity = text.split('*')[4];
    const data = {
      farm_product_id: farmProductID,
      units: quantity,
      grade: '3',
    };
    const response = await listProductForSale(data);
    if (response.status === 200) {
      message = `${end()} ${menus.updateListedProduce.forSaleSuccess}`;
    } else {
      message = `${end()} ${menus.updateListedProduce.forSaleFailure}`;
    }
  }

  return message;
};

export const secondLevelMenu = async (textValue, text, menus) => {
  let message;
  const selection = text.split('*')[1];
  if (textValue === 1) {
    message = renderFarmerMenusLevelTwo();
  }
  if (selection === '6') {
    if (textValue === 2) {
      const userID = await retreiveCachedItems(client, ['user_id']);
      message = await showGroups(userID[0]);
    } else if (textValue === 3) {
      const selectedGroup = parseInt(text.split('*')[2], 10);
      const userID = await retreiveCachedItems(client, ['user_id']);
      message = await joinGroup(selectedGroup, userID[0]);
    }
  } else if (selection === '7') {
    if (textValue === 2) {
      const userID = await retreiveCachedItems(client, ['user_id']);
      message = await renderFarmerFarms(userID[0]);
    } else if (textValue === 3) {
      const farmID = parseInt(text.split('*')[2], 10);
      message = await renderProductsInFarm(farmID);
    }
  }
  message += menus.footer;
  return message;
};
