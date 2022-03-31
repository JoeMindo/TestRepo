/* eslint-disable import/no-cycle */
import { getLocations, getRegions } from './listlocations.js';
import { retreiveCachedItems } from '../../core/services.js';
import { numberWithinRange } from '../../helpers.js';

const con = () => 'CON';
const end = () => 'END';

export const fetchLocalityDetails = async (
  client,
  locality,
  menus,
  id = null,
) => {
  let results;
  if (locality === 'region') {
    const regions = await getRegions();
    if (regions.status === 500) {
      results = `${con()} ${menus.serverError}`;
    }
    const list = await regions;
    results = list.items;
  } else if (locality === 'county') {
    const regionId = id;
    const counties = await getLocations('counties', regionId, 'county_name');
    const list = await counties;

    client.set('usercountyIds', list.ids.toString());
    results = list.items;
  } else if (locality === 'subcounty') {
    const countyIds = await retreiveCachedItems(client, ['usercountyIds']);
    let userCountySelection = countyIds[0].split(',')[`${(id -= 1)}`];

    userCountySelection = parseInt(userCountySelection, 10);
    const subcounties = await getLocations(
      'subcounties',
      userCountySelection,
      'sub_county_name',
    );
    client.set('userSubcountyIds', subcounties.ids.toString());
    results = subcounties.items;
  } else if (locality === 'location') {
    const subcountyIds = await retreiveCachedItems(client, [
      'userSubcountyIds',
    ]);
    let userSubcountySelection = subcountyIds[0].split(',')[`${(id -= 1)}`];
    userSubcountySelection = parseInt(userSubcountySelection, 10);
    client.set('userSubCountySelection', userSubcountySelection);
    const locations = await getLocations(
      'locations',
      userSubcountySelection,
      'location_name',
    );
    client.set('userLocationIds', locations.ids.toString());
    results = locations.items;
  } else if (locality === 'area') {
    const locationIds = await retreiveCachedItems(client, ['userLocationIds']);
    let userLocationSelection = locationIds[0].split(',')[`${(id -= 1)}`];
    userLocationSelection = parseInt(userLocationSelection, 10);
    client.set('userLocationSelection', userLocationSelection);
  } else {
    results = `${con()} ${menus.dataNotFound}`;
  }
  return results;
};

/**
 * It prompts the user to select a region, county, subcounty, location or area.
 * @param client - The client object that is used to interact with the database.
 * @param locality - The type of locality to fetch.
 * @param [id=null] - The id of the locality to be updated.
 * @returns The prompt is returned.
 */
export const promptToGive = async (client, locality, menus, id = null) => {
  let prompt;
  if (locality === 'region') {
    const results = await fetchLocalityDetails(client, 'region', menus);
    prompt = `${con()} ${menus.selectRegion}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'county') {
    const results = await fetchLocalityDetails(client, 'county', menus, id);

    prompt = `${con()} ${menus.selectCounty}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'subcounty') {
    const results = await fetchLocalityDetails(client, 'subcounty', menus, id);
    prompt = `${con()} ${menus.selectSubCounty}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'location') {
    const results = await fetchLocalityDetails(client, 'location', menus, id);

    prompt = `${con()} ${menus.selectLocation}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'area') {
    await fetchLocalityDetails(client, 'area', menus, id);
    prompt = `${con()} ${menus.area}`;
    prompt += menus.footer;
  }
  return prompt;
};

/**
 * This function is used to change the location of the user
 * @param textValue - The value of the text that was sent by the user.
 * @param text - The text that the user has sent.
 * @param client - The client object that is being used to send messages to the user.
 * @param menus - The menus object
 * @returns The message that is being returned is the message that is being sent to the user.
 */
export const changeUserLocation = async (textValue, text, client, menus) => {
  let message;
  if (textValue === 4) {
    const menuPrompt = await promptToGive(client, 'region', menus);
    message = menuPrompt;
  } else if (textValue === 5) {
    const validRange = numberWithinRange(text, 4, menus);
    if (validRange === 'valid') {
      const regionId = parseInt(text.split('*')[4], 10);
      const menuPrompt = await promptToGive(client, 'county', menus, regionId);
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 6) {
    const validRange = numberWithinRange(text, 5, menus);
    if (validRange === 'valid') {
      const countyId = parseInt(text.split('*')[5], 10);
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
  } else if (textValue === 7) {
    const validRange = numberWithinRange(text, 6, menus);
    if (validRange === 'valid') {
      const subcountyId = parseInt(text.split('*')[6], 10);
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
  } else if (textValue === 8) {
    // client.set('farm_size', parseInt(text.split('*')[9], 10));
    // const farmDetails = await retreiveCachedItems(client, [
    //   'farm_name',
    //   'farm_location',
    //   'farm_description',
    //   'farm_size',
    //   'user_id',
    //   'userLocationIds',
    // ]);

    // const postDetails = {
    //   farm_name: farmDetails[0],
    //   farm_location: farmDetails[1],
    //   farm_description: 'Null',
    //   farm_size: farmDetails[3],
    //   user_id: farmDetails[4],
    //   locationID: farmDetails[5].split(',')[`${text.split('*')[6] - 1}`],
    // };

    // const responseForAddingFarm = await addFarm(postDetails);

    // if (responseForAddingFarm.status === 200) {
    //   const menuPrompt = `${end()} ${menus.registerFarmSuccess}`;
    //   message = menuPrompt;
    //   client.set('farm_id', responseForAddingFarm.data.farm_id);
    // } else {
    //   const menuPrompt = `${end()} ${menus.registerFarmFail}`;
    //   message = menuPrompt;
    // }
    message = `${end()} ${menus.updateLocationDetailsSuccess}`;
  }
  return message;
};
