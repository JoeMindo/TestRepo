/* eslint-disable import/extensions */
/* eslint import/no-cycle: [2, { maxDepth: 1 }] */

import { getLocations, getRegions } from '../core/listlocations.js';
import { menus } from './menuoptions.js';
import { client } from '../server.js';
import { addLocation, checkFarmerVerification, checkVerification } from '../core/usermanagement.js';
import { retreiveCachedItems, setToCache } from '../core/services.js';
import {
  fetchCategories, fetchProducts, getSpecificProduct, addProduct,
} from '../core/productmanagement.js';
import {
  addFarm, addFarmerKYC, getAnswersPerQuestion, getFarmerMetricSections, getQuestionsPerSection,
} from '../core/farmmanagement.js';
import { responsePrompt } from './prompts.js';

const con = () => 'CON';
const end = () => 'END';

const questionanswers = {};

export const renderUpdateLocationMenu = async (res, textValue, text) => {
  let message;
  console.log('Update location here');
  if (textValue === 2) {
    let menuPrompt = `${con()} ${menus.updateLocation[0]}`;
    const regions = await getRegions();
    const list = await regions;
    menuPrompt += `${list.items}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    // res.send(message);
  } else if (textValue === 3) {
    let regionId = parseInt(text.split('*')[2], 10);
    regionId += 1;
    let menuPrompt = `${con()} ${menus.updateLocation[1]}`;
    const counties = await getLocations('counties', regionId, 'county_name');
    const list = await counties;
    menuPrompt += `${list.items}`;
    client.set('usercountyIds', list.ids.toString());
    menuPrompt += menus.footer;
    message = menuPrompt;
    // res.send(message);
  } else if (textValue === 4) {
    const countyId = parseInt(text.split('*')[3], 10);
    const countyIds = await retreiveCachedItems(client, ['usercountyIds']);
    let userCountySelection = countyIds[0].split(',')[countyId];
    userCountySelection = parseInt(userCountySelection, 10);
    const subcounties = await getLocations('subcounties', userCountySelection, 'sub_county_name');
    console.log('Subcounties are here', subcounties);
    let menuPrompt = `${con()} ${menus.updateLocation[2]}`;
    menuPrompt += `${subcounties.items}`;
    client.set('userSubcountyIds', subcounties.ids.toString());
    menuPrompt += menus.footer;
    message = menuPrompt;
    // res.send(message);
  } else if (textValue === 5) {
    const subcountyId = parseInt(text.split('*')[4], 10);
    const subcountyIds = await retreiveCachedItems(client, ['userSubcountyIds']);
    let userSubcountySelection = subcountyIds[0].split(',')[subcountyId];
    userSubcountySelection = parseInt(userSubcountySelection, 10);
    client.set('userSubCountySelection', userSubcountySelection);
    const locations = await getLocations('locations', userSubcountySelection, 'location_name');
    console.log('Locations are here', locations);
    let menuPrompt = `${con()} ${menus.updateLocation[3]}`;
    menuPrompt += `${locations.items}`;
    console.log('Here are the location items', locations.ids.toString());
    client.set('userLocationIds', locations.ids.toString());
    menuPrompt += menus.footer;
    message = menuPrompt;
    console.log('Here is the text value', textValue);
  } else if (textValue === 6) {
    const locationId = parseInt(text.split('*')[5], 10);
    const locationIds = await retreiveCachedItems(client, ['userLocationIds']);
    let userLocationSelection = locationIds[0].split(',')[locationId];
    console.log('UserLocationSelection', userLocationSelection);
    userLocationSelection = parseInt(userLocationSelection, 10);
    client.set('userLocationSelection', userLocationSelection);
    let menuPrompt = `${con()} ${menus.updateLocation[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    // res.send(menuPrompt);
  } else {
    client.set('userArea', text.split('*')[6]);
    console.log('THe user area is', text.split('*')[6]);
    const postLocationDetails = await retreiveCachedItems(client, ['userSubCountySelection', 'userLocationSelection', 'userArea', 'user_id']);
    const postDetails = {
      sub_county_id: postLocationDetails[0],
      location_id: postLocationDetails[1],
      area: postLocationDetails[2],
    };
    console.log('The post details are', postDetails);
    const userId = parseInt(postLocationDetails[3], 10);
    const response = await addLocation(postDetails, userId);
    console.log('The end response', response);
    if (response.status === 201) {
      const menuPrompt = `${end()} ${menus.updateLocation.success}`;
      message = menuPrompt;
    } else {
      message = 'CON Could not update location, try again later';
      message += menus.footer;
    }
  }
  res.send(message);
};
export const renderAddFarmDetailsMenu = async (res, textValue, text) => {
  let message;
  // TODO: Add a check for KYC
  if (textValue === 2) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[0]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else if (textValue === 3) {
    let menuPrompt = `${con()} ${menus.addfarmDetails[1]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    client.set('farm_name', text.split('*')[2]);
    res.send(message);
  } else if (textValue === 4) {
    client.set('farm_location', text.split('*')[3]);
    const categories = await fetchCategories();
    console.log(categories);
    let menuPrompt = `${con()} ${menus.addfarmDetails[2]}`;
    menuPrompt += categories;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else if (textValue === 5) {
    const category = parseInt(text.split('*')[4], 10);
    const product = await fetchProducts(category);
    let menuPrompt = `${con()} ${menus.addfarmDetails[3]}`;
    menuPrompt += `${product}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else if (textValue === 6) {
    const productId = parseInt(text.split('*')[5], 10);
    client.set('productID', productId);
    let menuPrompt = `${con()} ${menus.addfarmDetails[4]}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
    res.send(message);
  } else {
    client.set('capacity', parseInt(text.split('*')[6], 10));
    retreiveCachedItems(client, ['farm_name', 'farm_location', 'productID', 'capacity', 'user_id'])
      .then((farmDetails) => {
        const postDetails = {
          farm_name: farmDetails[0],
          farm_location: farmDetails[1],
          product_id: farmDetails[2],
          capacity: farmDetails[3],
          user_id: farmDetails[4],
        };

        addFarm(postDetails).then((response) => {
          if (response.status === 200) {
            const menuPrompt = `${end()} ${menus.addfarmDetails.success}`;
            message = menuPrompt;
            client.set('farm_id', response.data.success.id);
            res.send(message);
          } else {
            const menuPrompt = `${end()} ${menus.addfarmDetails.failure}`;
            message = menuPrompt;
            res.send(message);
          }
        });
      });
  }
};

export const renderFarmerUpdateDetailsMenu = (res, textValue, text) => {
  let message = '';
  if (textValue === 2) {
    getFarmerMetricSections().then((response) => {
      message = responsePrompt(response, 'sections');
      res.send(message);
    });
    message = '';
  } else if (textValue === 3) {
    const sectionId = parseInt(text.split('*')[2], 10);
    console.log(sectionId);
    client.set('sectionId', sectionId);
    getQuestionsPerSection(sectionId).then((response) => {
      message = responsePrompt(response, 'questions');
      res.send(message);
    });
    message = '';
  } else if (textValue === 4) {
    const questionId = parseInt(text.split('*')[3], 10);
    client.set('questionId', questionId);
    getAnswersPerQuestion(questionId).then((response) => {
      if (response.status === 200) {
        let menuPrompt = '';

        response.data[0].kyc_metrics_possible_answers.forEach((answer) => {
          menuPrompt += `\n${answer.id}. ${answer.possible_answer}`;
          questionanswers[answer.id] = answer.possible_answer;
          questionanswers.question_id = answer.question_id;
        });
        console.log('Question and answers object', questionanswers);
        message = `${con()} Select any of the following separated by a space`;
        message += menuPrompt;
        message += '\n0. Other';
        message += menus.footer;
        res.send(message);
      } else {
        message = `${end()} Could not fetch answers at the moment, try later`;
        res.send(message);
      }
    });
  } else if (textValue === 5) {
    const userAnswers = text.split('*')[4];
    if (userAnswers === '0') {
      message = `${con()} Type in your answer`;
      res.send(message);
    } else {
      const userAnswersArray = userAnswers.split(' ');
      console.log('User answers array', userAnswersArray);
      let answers = '';
      userAnswersArray.forEach((answer) => {
        const answerId = parseInt(answer, 10);
        answers += `${questionanswers[answerId]} `;
        console.log('Answers are displayed here', answers);
      });
      client.set('answers', answers);
      console.log('Answers are here', answers);
      message = `${con()} Proceed?\n 1. Yes`;
      res.send(message);
    }
  } else if (textValue === 6) {
    if (text.split('*')[4] === '0') {
      setToCache(text, 4, client, 'answers');
    }
    retreiveCachedItems(client, ['user_id', 'answers', 'questionId'])
      .then((results) => {
        const kycInfo = {
          metric_id: results[2],
          answer: results[1],
        };
        addFarmerKYC(kycInfo, results[0]).then((response) => {
          if (response.status === 200) {
            message = `${end()} Thank you for your submission`;
            res.send(message);
          } else {
            message = 'CON Something went wrong!!!';
            res.send(message);
          }
        });
      });
  }
};

export const renderFarmerAddProductMenu = async (res, textValue, text) => {
  let message = '';
  const items = await retreiveCachedItems(client, ['farm_id', 'productID', 'user_id']);
  const productID = parseInt(items[1], 10);
  const specificProduct = await getSpecificProduct(productID);
  message += `CON What quantity of \n ${specificProduct}`;
  if (textValue === 3) {
    const units = parseInt(text.split('*')[2], 10);
    client.set('units', units);
    const menuPrompt = 'CON How would you grade your produce?\n 1. Grade A \n 2. Grade B \n 3. Grade C \n 4.Grade D\n 5. Grade E';
    message = menuPrompt;
  } else if (textValue === 4) {
    console.log('Text value', textValue);
    let grade;
    const selection = text.split('*')[3];
    if (selection === '1') {
      grade = 'A';
      client.set('grade', grade);
    } else if (selection === '2') {
      grade = 'B';
      client.set('grade', grade);
    } else if (selection === '3') {
      grade = 'C';
      client.set('grade', grade);
    } else if (selection === '4') {
      grade = 'D';
      client.set('grade', grade);
    } else if (selection === '5') {
      grade = 'E';
      client.set('grade', grade);
    } else {
      message = 'Invalid grade';
      message += menus.footer;
    }
    const addProductDetails = await retreiveCachedItems(client, ['farm_id', 'productID', 'units', 'grade']);

    const addProductResponse = await addProductDetails;
    const postDetails = {
      farm_id: addProductResponse[0],
      product_id: addProductResponse[1],
      units: addProductResponse[2],
      grade: addProductResponse[3],
    };
    const addProductToDB = await addProduct(postDetails);
    if (addProductToDB.status === 200) {
      message = 'END Added successfully';
    } else {
      message = 'END Added failed';
    }
  }
  return res.send(message);
};