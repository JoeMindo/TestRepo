import { getLocations, getRegions } from './listlocations.js';
import { menus } from '../../menus/menuoptions.js';
import { retreiveCachedItems } from '../../core/services.js';

const con = () => 'CON';

export const fetchLocalityDetails = async (client, locality, id = null) => {
  let results;
  if (locality === 'region') {
    const regions = await getRegions();
    if (regions.status === 500) {
      results = `${con()} ${menus.miscellaneous.serverError}`;
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
    results = `${con()} ${menus.miscellaneous.dataNotFound}`;
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
export const promptToGive = async (client, locality, id = null) => {
  let prompt;
  if (locality === 'region') {
    const results = await fetchLocalityDetails(client, 'region');
    prompt = `${con()} ${menus.updateLocation[0]}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'county') {
    const results = await fetchLocalityDetails(client, 'county', id);
    prompt = `${con()} ${menus.updateLocation[1]}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'subcounty') {
    const results = await fetchLocalityDetails(client, 'subcounty', id);
    prompt = `${con()} ${menus.updateLocation[2]}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'location') {
    const results = await fetchLocalityDetails(client, 'location', id);
    console.log('The location menu results', results);
    prompt = `${con()} ${menus.updateLocation[3]}`;
    prompt += results;
    prompt += menus.footer;
  } else if (locality === 'area') {
    const results = await fetchLocalityDetails(client, 'area', id);
    console.log('The are location ids', results);
    prompt = `${con()} ${menus.updateLocation[4]}`;
    prompt += menus.footer;
  }
  return prompt;
};
