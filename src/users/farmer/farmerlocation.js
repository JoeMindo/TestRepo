/* eslint-disable import/no-cycle */
import { getLocations, getRegions } from './listlocations.js';
import { retreiveCachedItems } from '../../core/services.js';
import { numberWithinRange } from '../../helpers.js';
import { updateLocation } from '../../core/usermanagement.js';

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
    client.set('userCountySelection', userCountySelection);
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
    console.log('The location IDs is', locationIds);

    let userLocationSelection = locationIds[0].split(',')[`${(id -= 1)}`];
    console.log('The ID here is', id);
    console.log('Usr location selection string', userLocationSelection);

    userLocationSelection = parseInt(userLocationSelection, 10);
    console.log('The user location selection', userLocationSelection);
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
  } else if (locality === 'county') {
    const results = await fetchLocalityDetails(client, 'county', menus, id);

    prompt = `${con()} ${menus.selectCounty}`;
    prompt += results;
  } else if (locality === 'subcounty') {
    const results = await fetchLocalityDetails(client, 'subcounty', menus, id);
    prompt = `${con()} ${menus.selectSubCounty}`;
    prompt += results;
  } else if (locality === 'location') {
    const results = await fetchLocalityDetails(client, 'location', menus, id);

    prompt = `${con()} ${menus.selectLocation}`;
    prompt += results;
  } else if (locality === 'area') {
    await fetchLocalityDetails(client, 'area', menus, id);
    prompt = `${con()} ${menus.area}`;
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
    const validRange = numberWithinRange(text, 6, menus);
    if (validRange === 'valid') {
      const locationId = parseInt(text.split('*')[6], 10);
      console.log('Where we find the location ID is', locationId);
      const menuPrompt = await promptToGive(client, 'area', menus, locationId);
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.outOfRange}`;
    }
  } else if (textValue === 8) {
    client.set('userArea', text.split('*')[6]);
    const postLocationDetails = await retreiveCachedItems(client, [
      'userCountySelection',
      'userSubCountySelection',
      'userLocationSelection',
      'user_id',
    ]);

    const postDetails = {
      user_id: parseInt(postLocationDetails[3], 10),
      county_id: postLocationDetails[0],
      sub_county_id: postLocationDetails[1],
      location_id: postLocationDetails[2],
      area: text.split('*')[7],
    };

    const response = await updateLocation(postDetails);
    console.log('The response is', response);

    if (response.status === 200) {
      const menuPrompt = `${end()} ${menus.locationUpdateOk}`;
      message = menuPrompt;
    } else {
      message = `${end()} ${menus.locationUpdateFailed}`;
    }
  }
  return message;
};
