import axios from "axios";
import { BASEURL } from "../config/urls.js";

export let getRegions = async () => {
  
  let regions = []
  let menuItems = ''
  try {
    
    let regionsResult = await axios.get(`${BASEURL}/api/regions/`);

    regionsResult.data.forEach((location) => {
      regions.push(location);
    })
    regions.forEach((value,index) => {
      menuItems += `${index}. ${value.region_name}: ${value.id}\n`
    })
    return menuItems
    
  } catch (error) {
    throw new Error(error);
  }
};



export let getLocations = async (type,id,identifier) => {
  let locationType = []
  let menuItems = ''
  try {
    
    let locationResult = await axios.get(`${BASEURL}/api/${type}/${id}`);

    locationResult.data.forEach((location) => {
      locationType.push(location);
    })
    locationType.forEach((value,index) => {
      let name = value[identifier]
      let id = value['id']
      menuItems += `${index}. ${name}:${id}\n`
      
    })
    return menuItems
    
  } catch (error) {
    throw new Error(error);
  }
}


export let splitText = (text, index) => {
  return text.split("*")[index]
}