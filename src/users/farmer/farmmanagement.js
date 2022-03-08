/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { BASEURL } from '../../core/urls.js';
import { promptToGive } from './farmerlocation.js';
import { numberWithinRange } from '../../helpers.js';
import { end, con } from '../../menus/rendermenu.js';
import { isTextOnly } from './farmermenus.js';
import { retreiveCachedItems } from '../../core/services.js';

/**
 * It takes a farm object and sends it to the server.
 * @param farm - The farm object to be saved.
 * @returns The response object.
 */
export const addFarm = async (farm) => {
  const response = await axios
    .post(`${BASEURL}/ussd/farm/save`, farm)
    .catch((err) => err.response);
  return response;
};

/**
 * It takes in a farmerKYC object and an id and sends it to the API.
 * @param farmerKYC - {
 * @param id - The farmer id
 * @returns The farmer's KYC answers
 */
export const addFarmerKYC = async (farmerKYC, id) => {
  try {
    const response = await axios.post(
      `${BASEURL}/ussd/kycsanswers/save/${id}`,
      farmerKYC,
    );

    return response;
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Get the farmer metric sections.
 * @returns The response is an object with the following properties:
 */
export const getFarmerMetricSections = async () => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycmetricsections/1`)
    .catch((err) => err.response);
  return response;
};
/**
 * It gets the questions for a specific section.
 * @param sectionId - The section id of the section you want to get the questions for.
 * @returns The question and the answer.
 */
export const getQuestionsPerSection = async (sectionId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycquestions/${sectionId}`)
    .catch((err) => err.response);
  return response;
};
/**
 * Get all possible answers for a question.
 * @param questionId - The question id of the question you want to get the possible answers for.
 * @returns The possible answers for the question.
 */
export const getAnswersPerQuestion = async (questionId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/kycpossibleanswers/${questionId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It gets all the farms owned by a user.
 * @param userId - The user's ID
 * @returns The response object.
 */
export const getUserFarms = async (userId) => {
  const response = axios
    .get(`${BASEURL}/ussd/farm/${userId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It fetches the available groups for a given location.
 * @param locationID - The location ID of the location you want to fetch groups for.
 * @returns The response object.
 */
export const fetchAvailableGroups = async (locationID) => {
  const response = await axios
    .get(`${BASEURL}/ussd/getgroupbylocationid/${locationID}`)
    .catch((err) => err.response);
  return response;
};

/**
 * This function gets the location ID of the user.
 * @param userId - The user's unique ID.
 * @returns The location ID
 */
export const getLocationID = async (userId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/checklocationdetails/${userId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It fetches the available groups for the user and returns a menu prompt with the group names.
 * @param locationID - The location ID of the location where the user is trying to join a group.
 * @returns The message that is being returned is a string.
 */
export const showGroups = async (locationID, menus) => {
  let message;
  const availableGroups = await fetchAvailableGroups(locationID);
  if (availableGroups.status === 200) {
    let menuPrompt = `${con()} ${menus.chooseGroupToJoin}`;
    availableGroups.data.message.forEach((group) => {
      menuPrompt += `${group.id}. ${group.group_name}`;
    });
    message = menuPrompt;
  } else {
    message = `${con()} ${menus.noGroups}`;
  }

  return message;
};

/**
 * It takes in a group ID and a user ID and saves the user under the group.
 * @param groupID - The group ID of the group you want to join
 * @param userId - The user's phone number
 * @returns The response object is returned.
 */
export const joinGroup = async (groupID, userId) => {
  let message;
  const data = {
    group_id: groupID,
    user_id: userId,
  };
  const response = await axios
    .post(`${BASEURL}/ussd/saveuserundergroup/`, data)
    .catch((err) => err.response);

  if (response.status === 200) {
    message = 'END Successfully joined group';
  } else {
    message = 'END You are already in this group';
  }
  return message;
};

/**
 * This function is used to add a farm located in a different location to the database.
 * @param textValue - The value of the text input.
 * @param text - The text that the user has entered.
 * @param client - The client object
 * @returns A string.
 */
export const inputFarmLocation = async (textValue, text, client, menus) => {
  let message;
  if (textValue === 3) {
    const menuPrompt = await promptToGive(client, 'region', menus);
    message = menuPrompt;
  } else if (textValue === 4) {
    const validRange = numberWithinRange(text, 3, menus);
    if (validRange === 'valid') {
      const regionId = parseInt(text.split('*')[3], 10);
      const menuPrompt = await promptToGive(client, 'county', menus, regionId);
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 5) {
    const validRange = numberWithinRange(text, 4, menus);
    if (validRange === 'valid') {
      const countyId = parseInt(text.split('*')[4], 10);
      const menuPrompt = await promptToGive(
        client,
        'subcounty',
        menus,
        countyId,
      );
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 6) {
    const validRange = numberWithinRange(text, 5, menus);
    if (validRange === 'valid') {
      const subcountyId = parseInt(text.split('*')[5], 10);
      const menuPrompt = await promptToGive(
        client,
        'location',
        menus,
        subcountyId,
      );
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 7) {
    let menuPrompt = `${con()} ${menus.enterFarmName}`;
    menuPrompt += menus.footer;
    message = menuPrompt;
  } else if (textValue === 8) {
    if (isTextOnly(text.split('*')[7]) === true) {
      let menuPrompt = `${con()} ${menus.farmArea}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      client.set('farm_name', text.split('*')[7]);
    } else {
      message = `${con()} ${menus.invalidInput}`;
    }
  } else if (textValue === 9) {
    if (isTextOnly(text.split('*')[8]) === true) {
      let menuPrompt = `${con()} ${menus.farmSize}`;
      menuPrompt += menus.footer;
      message = menuPrompt;
      client.set('farm_location', text.split('*')[8]);
    } else {
      message = `${con()} ${menus.invalidInput}`;
    }
  } else if (textValue === 10) {
    client.set('farm_size', parseInt(text.split('*')[9], 10));
    const farmDetails = await retreiveCachedItems(client, [
      'farm_name',
      'farm_location',
      'farm_description',
      'farm_size',
      'user_id',
      'userLocationIds',
    ]);

    const postDetails = {
      farm_name: farmDetails[0],
      farm_location: farmDetails[1],
      farm_description: 'Null',
      farm_size: farmDetails[3],
      user_id: farmDetails[4],
      locationID: farmDetails[5].split(',')[`${text.split('*')[6] - 1}`],
    };

    const responseForAddingFarm = await addFarm(postDetails);

    if (responseForAddingFarm.status === 200) {
      const menuPrompt = `${end()} ${menus.registerFarmSuccess}`;
      message = menuPrompt;
      client.set('farm_id', responseForAddingFarm.data.farm_id);
    } else {
      const menuPrompt = `${end()} ${menus.registerFarmFail}`;
      message = menuPrompt;
    }
  }
  return message;
};
/**
 * It fetches all the farms owned by a farmer
 * @param userId - The id of the farmer whose farms we want to fetch.
 * @returns The response is an array of objects.
 */
export const fetchFarmerFarms = async (userId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/farm/${userId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * It fetches the produce in a farm.
 * @param farmId - The id of the farm whose produce you want to fetch.
 * @returns The response is an array of produce objects.
 */
export const fetchProduceInFarms = async (farmId) => {
  const response = await axios
    .get(`${BASEURL}/ussd/farmproducts/farm/${farmId}`)
    .catch((err) => err.response);
  return response;
};

/**
 * This function will fetch produce in a farm and render it in the DOM
 * @param farmId - The id of the farm that you want to render the products in.
 */
export const renderProductsInFarm = async (farmId, menus) => {
  let message;
  const response = await fetchProduceInFarms(farmId);

  if (response.status === 200) {
    if (response.data.message.length > 0) {
      const menuPrompt = `${con()} ${menus.listedProduce}`;
      message = menuPrompt;
      response.data.message.forEach((element, index) => {
        message += `${index}. ${element.product_name}\n`;
      });
    } else {
      message = `${con()} ${menus.noProduce}`;
    }
  }
  return message;
};

/**
 * It fetches the farms owned by the farmer and returns a menu prompt with the farms' names
 * @param userId - The id of the user who is logged in.
 * @returns A string.
 */
export const renderFarmerFarms = async (userId, menus) => {
  let message;
  const response = await fetchFarmerFarms(userId);

  if (response.status === 200) {
    let menuPrompt = `${con()} ${menus.viewFarms}`;
    response.data.message.forEach((farm) => {
      menuPrompt += `${farm.id}. ${farm.farm_name}\n`;
    });
    message = menuPrompt;
  } else {
    message = `${con()} ${menus.noFarms}`;
  }
  return message;
};
