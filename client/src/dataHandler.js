import {createLead, getAgents, getCoordinates, getProperties, getProperty, getUser} from "./apiHandler";
import {getGlobalState, setGlobalState, useGlobalState} from "./globalState";
import {devices, furnitureTypes, range, renovationTypes, switchFilters} from "./components/Utilities";
import moment from "moment";

const setProperties = (val) => setGlobalState('properties',val)
const setAddresses = (val) => setGlobalState('addresses',val)
const setNeighborhoods = (val) => setGlobalState('neighborhoods',val)
const setPropertiesNumbers = (val) => setGlobalState('propertiesNumbers',val)
const setIsLoading = (val) => setGlobalState('loading',val)
const setProperty = val => setGlobalState('property',val)
const setCity = val => setGlobalState('city',val)
const setFilters = val => setGlobalState('filters',val)
const setAgents = val => setGlobalState('agents',val)
const setActionFeedback = (val) => setGlobalState('feedback',val)
const setLead = (val) => setGlobalState('lead',val)


const feedback = (result,message,timer) => {
  setActionFeedback( {result,message,timer})
}

export const getAlternatives = ({id,price,rooms},options = []) => {
  return options
    .filter(
      ({id:_id,price:_price,rooms:_rooms}) =>
        (_price <= price*1.10 && _price >= price*.9) &&
        _rooms === rooms &&
        _id !== id
    )
}

export const fetchCoordinates = async address => {

  try{
    let coordinates = await getCoordinates(address)

    if (coordinates && Array.isArray(coordinates))
      return coordinates[0]
  }
  catch(e){
    console.log(e)
  }
  return
}

export const createPropertyDescription = property => {

  const {
    neighborhood_name,
    street_name,
    rooms,
    metres,
    city_id,
    propertytype,
    furniture,
    renovation,
    floor,
    price,
    structure,
    totalfloors,
  } = property

  let string = `${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}, ${city_id}
${rooms} חדרים, ${metres} מ"ר, קומה ${floor} מתוך ${totalfloors} קומות
${furniture}${structure != 'ישן' ? ` בבניין ${structure}`:``} במחיר של ${price.toLocaleString()} ₪
  `
  return string
}

export const filterProperties = (properties,filters) => {

  const {
    budgetFrom,
    budgetTo,
    roomsFrom,
    roomsTo,
    renovationFrom,
    renovationTo,
    addresses,
    addressesActive,
    address,
    propertyNumber,
    furnitureFrom,
    furnitureTo,
    metresFrom,
    metresTo,
    floorFrom,
    floorTo,
  } = filters

  console.log(filters)
  let furnitureRange = range(furnitureFrom,furnitureTo)
  let furnitureRangeText = furnitureRange.map(num => furnitureTypes[num])

  let filtered = properties
    .filter(({
               price,
               rooms,
               metres,
               floor,
               renovation,
               furniture,
             }) => {

      return (
        (budgetFrom <= price) && (price <= budgetTo) &&
        (metresFrom <= metres) && (metres <= metresTo) &&
        (roomsFrom <= rooms) && (rooms <= roomsTo) &&
        (!floor || (floorFrom <= floor) && (floor <= floorTo)) &&
        (renovationFrom <= renovation) && (renovation <= renovationTo) &&
        (furnitureRangeText.some(text => furniture === text))
      );
    })

  Object.keys(switchFilters).forEach(filter => {
    if (filters[filter])
      filtered = filtered.filter(prop => prop[filter])
  })

  if (addressesActive){
    filtered = filtered.filter(({neighborhood_name}) => addresses.some(addr => neighborhood_name.includes(addr)))
  }
  else if (address){
    filtered = filtered.filter(({neighborhood_name,street_name}) => {
      let [neighborhood,street] = address.split(', ')
      if (street)
        return (neighborhood_name === neighborhood && street_name === street)
      return (neighborhood_name === neighborhood)
    })
  }
  else if (propertyNumber)
    filtered = filtered.filter(({custom_id}) =>  custom_id + '' == propertyNumber)

  filtered = filtered.map(({id}) => id)
  let retval = [...properties]
  for (let property of retval){
    if (filtered.includes(property.id)){
      property.isFiltered = true
    }
    else
      property.isFiltered = false
  }
  return retval.sort(({created:createdA},{created:createdB}) => createdB - createdA)
}

export const validateId = id => id && Number.isInteger(parseInt(id)) && id.length == 5


export const onPropertyClicked = async (id) => {

  let property = await fetchProperty(id)
  const {
    street_name,neighborhood_name,city_id
  } = property

  if (!street_name || !neighborhood_name || !city_id)
    alert('לא נמצא נכס')
  let addressString = [street_name,neighborhood_name,city_id].join(', ')
  let coordinates = await fetchCoordinates(addressString)
  let alternatives = getAlternatives(property)
  setProperty({...property,alternatives,coordinates})

  return property
}

export const resize = () => {
  const setDevice = (val) => setGlobalState('device',val)

  if (window.innerWidth < 600)
    setDevice(devices.Mobile)
  else if (window.innerWidth < 1280)
    setDevice(devices.Tablet)
  else
    setDevice(devices.Desktop)
}

export const fetchAgents = async () => {
  let data
  try{
    data = await getAgents()
  }
  catch(e){
    console.log(e)
  }
  return data
}

export const getAgentById = (agents,id) => agents.find(agent => agent.id == id)

export const fetchProperty = async (id) => {

  let data
  try{
    data = await getProperty(id)
  }
  catch(e){
    console.log(e)
  }
  return data
}

export const onCityClick = async city => {
  setIsLoading(true)
  setCity(city)
  await fetchProperties(city)
  setIsLoading(false)
}

export const showSingleProperty = async (propertyId) => {

  setIsLoading(true)
  let property = await onPropertyClicked(propertyId)

  let {city_id:city,custom_id} = property
  setCity(city)
  await fetchProperties(city)

  let _filters

  setFilters(filters => {_filters=filters;return ({...filters,propertyNumber:custom_id,addresses:[],addressesActive:0,address:''})})
  setProperties(
    properties => {
      let selectedProperty = filterProperties(properties,{..._filters,propertyNumber:custom_id,addresses:[],addressesActive:0,address:''})
      if (selectedProperty.length){
        return selectedProperty.map(prop => prop.custom_id == custom_id ? ({...prop,isCollapsedOut:true}) : prop)
      }
    }
  )
  setIsLoading(false)
}

export const fetchProperties = async (city) => {

  const data = await getProperties(city)
  const agents = await fetchAgents()
  const properties = data.sort(({created:createdA},{created:createdB}) => createdB - createdA)

  let addressesMap = {}
  let propertiesNumbers = []

  let favouritesString = localStorage.getItem('favourites')
  let favourites = favouritesString && JSON.parse(favouritesString) || []

  for (let property of properties){
    let {
      neighborhood_name,
      street_name,
      area
    } = property

    property.isFiltered = true
    if (favourites && favourites.includes(property.id))
      property.isFavourite = true
    if (!addressesMap[neighborhood_name])
      addressesMap[neighborhood_name] = []
    if (!addressesMap[neighborhood_name].includes(street_name))
      addressesMap[neighborhood_name].push(street_name)

    if (property.custom_id)
      propertiesNumbers.push(property.custom_id + '')

  }

  let addresses = []
  let neighborhoods = Object.keys(addressesMap).sort()
  for (let i=0; i<neighborhoods.length;i++){
    addresses.push(neighborhoods[i])
    for (let j=0;j<addressesMap[neighborhoods[i]].sort().length;j++){
      addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
    }
  }

  setAgents(agents)
  setNeighborhoods(neighborhoods)
  setAddresses(addresses)
  setProperties(properties)
  setPropertiesNumbers(propertiesNumbers)

}


export const createLeadKala = async (data) => {

  try {

    if (await createLead(data)) {
      feedback(true, 'בקשתך הוזנה במערכתינו, תודה', 5)
      setLead(lead => ({...lead,opened:false}))
    }

  }
  catch(e){
    console.log(e)
  }
}

export const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}