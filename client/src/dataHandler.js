import {createLead, getAgents, getCoordinates, getProperties, getProperty, getUser} from "./apiHandler";
import {getGlobalState, setGlobalState, useGlobalState} from "./globalState";
import {devices, furnitureTypes, range, renovationTypes, switchFilters} from "./components/Utilities";
import moment from "moment";

export const setProperties = (val) => setGlobalState('properties',val)
export const setAddresses = (val) => setGlobalState('addresses',val)
export const setNeighborhoods = (val) => setGlobalState('neighborhoods',val)
export const setPropertiesNumbers = (val) => setGlobalState('propertiesNumbers',val)
export const setIsLoading = (val) => setGlobalState('loading',val)
export const setProperty = val => setGlobalState('property',val)
export const setCity = val => setGlobalState('city',val)
export const setFilters = val => setGlobalState('filters',val)
export const setAgents = val => setGlobalState('agents',val)
export const setActionFeedback = (val) => setGlobalState('feedback',val)
export const setLead = (val) => setGlobalState('lead',val)
export const setCurrentFilter = (val) => setGlobalState('currentFilter',val)
export const setLeadModal = val => setGlobalState('lead',val)
export const setMediaModal = val => setGlobalState('media',val)
export const setMapModal = val => setGlobalState('map',val)
export const setTotalCityCount = val => setGlobalState('totalCityCount',val)
export const setTotalFiltered = val => setGlobalState('totalFiltered',val)
export const setPage = val => setGlobalState('page',val)
export const setAddressTree = (val) => setGlobalState('addressTree',val)
export const setAddressMap = (val) => setGlobalState('addressMap',val)

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

export const handleCloseFilter = () => setCurrentFilter({currentFilterName:'',currentFilterElement:null})


export const changeFilters = newFilters => {

  let _filters = []
  setFilters(filters => {return _filters = ({...filters,...newFilters})})

  console.log(_filters)
  setProperties(
    properties => filterProperties(properties,_filters)
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
    airdirections,
    toiletamount,
    bathroomamount,
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

  let test = []
  if (airdirections)
    test.push(`${airdirections} כיווני אוויר`)
  if (bathroomamount)
    test.push(`${bathroomamount} חדרי רחצה`)
  if (toiletamount)
    test.push(`${toiletamount} חדרי שירותים`)

  let first = []
  first.push(`${rooms} חדרים,`)
  first.push(`${metres} מ"ר,`)
  first.push(`${floor ? `קומה ${floor}`:`קומת קרקע`}`)
  first.push(`מתוך ${totalfloors} קומות`)
  let string = `${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}, ${city_id}
${first.join(' ')}
${test.join(', ')}
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

  let furnitureRange = range(furnitureFrom,furnitureTo)
  let furnitureRangeText = furnitureRange.map(num => furnitureTypes[num])
  let primeFilters = [...properties]

  if (addressesActive){
    primeFilters = primeFilters.filter(({neighborhood_name}) => addresses.some(addr => neighborhood_name.includes(addr)))
  }
  else if (address.length) {
    primeFilters = primeFilters.filter(({neighborhood_name, street_name}) => {
      for (let addr of address) {
        let [neighborhood, street] = addr.split(', ')
        if (neighborhood_name === neighborhood && street_name === street)
          return true
        else if (!street){
          if (neighborhood_name === neighborhood)
            return true
        }
      }
    })
  }
  else if (propertyNumber.length) {
    primeFilters = primeFilters.filter(({custom_id}) => propertyNumber.some(num => custom_id == num))
  }

  let filtered = primeFilters
    .filter(({
               price,
               rooms,
               metres,
               floor,
               renovation,
               furniture,
             }) => {



      return (
        (budgetFrom <= price) && (budgetTo == 10000 ? price <= 9999999 : price <= budgetTo) &&
        (metresFrom <= metres) && (metres <= metresTo) &&
        (roomsFrom <= rooms) && (roomsTo == 6 ? rooms <= 99 : rooms <= roomsTo+.5) &&
        (!floor || (floorFrom <= floor) && (floor <= floorTo)) &&
        (renovationFrom <= renovation) && (renovation <= renovationTo) &&
        (furnitureRangeText.some(text => furniture === text))
      );
    })

  Object.keys(switchFilters).forEach(filter => {
    if (filters[filter])
      filtered = filtered.filter(prop => prop[filter])
  })


  filtered = filtered.map(({id}) => id)
  let retval = [...properties]
  for (let property of retval){
    if (filtered.includes(property.id)){
      property.isFiltered = true
    }
    else
      property.isFiltered = false
  }
  setPage(1)

  setTotalFiltered(filtered.length)
  return retval.sort(({created:createdA},{created:createdB}) => createdB - createdA)
}

export const validateId = id => id && Number.isInteger(parseInt(id)) && id.length == 5


export const onPropertyClicked = async (id) => {

  let property = await fetchProperty(id)

  let alternatives = getAlternatives(property)
  setProperty({...property,alternatives})

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

  setFilters(filters => {_filters=filters;return ({...filters,propertyNumber:[custom_id],addresses:[],addressesActive:0,address:''})})
  setProperties(
    properties => {
      let selectedProperty = filterProperties(properties,{..._filters,propertyNumber:[custom_id],addresses:[],addressesActive:0,address:''})
      return selectedProperty.map(prop => prop.custom_id == custom_id ? ({...prop,isCollapsedOut:true}) : prop)
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

  let newAddressMap = []
  let dropdownData = []


  for (let property of properties){
    let {
      neighborhood_name,
      street_name,
      area,
      custom_id
    } = property

    property.isFiltered = true
    if (favourites && favourites.includes(property.id))
      property.isFavourite = true
    if (!addressesMap[area]) {
      addressesMap[area] = {}
      newAddressMap[area] = {}
      dropdownData.push({
        id:area,
        label:area,
        value:area,
      })
    }
    if (!addressesMap[area][neighborhood_name]) {
      addressesMap[area][neighborhood_name] = []
      newAddressMap[area][neighborhood_name] = []
      dropdownData.push({
        area,
        id:neighborhood_name,
        label:neighborhood_name,
        parent_id:area,
      })
    }
    if (!addressesMap[area][neighborhood_name].includes(street_name)) {
      addressesMap[area][neighborhood_name].push(street_name)
      newAddressMap[area][neighborhood_name][street_name] = []
      dropdownData.push({
        area,
        neighborhood_name,
        id:street_name,
        label:street_name,
        parent_id:neighborhood_name,
      })
    }


    if (custom_id) {
      propertiesNumbers.push(property.custom_id + '')
      newAddressMap[area][neighborhood_name][street_name].push(custom_id)
      dropdownData.push({
        id:custom_id,
        label:`נכס מספר ${custom_id}`,
        parent_id:street_name
      })
    }

  }

  setAddressMap(newAddressMap)
  setAddressTree(unflatten(dropdownData))
  setTotalCityCount(properties.length)
  setTotalFiltered(properties.length)

  let addresses = []
  let areas = Object.keys(addressesMap).sort()
  for (let _area of areas){
    addresses.push(_area)
    let neighborhoods =  Object.keys(addressesMap[_area]).sort()
    for (let neighb of neighborhoods){
      addresses.push(neighb)
      for (let street of addressesMap[_area][neighb])
        addresses.push(`${neighb}, ${street}`)
    }
  }

  setAgents(agents)
  setAddresses(addresses)
  setProperties(properties)
  setPropertiesNumbers(propertiesNumbers)


}

function unflatten(arr) {
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem.parent_id) {
        mappedArr[mappedElem['parent_id']]['children'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
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