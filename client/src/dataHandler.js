import {createLead, getAgents, getCoordinates, getProperties, getProperty} from "./apiHandler";
import {setGlobalState} from "./globalState";
import {constants, devices, renovationTypes, switchFilters} from "./components/Utilities";

export const setProperties = (val) => setGlobalState('properties',val)
export const setAddresses = (val) => setGlobalState('addresses',val)
export const setIsLoading = (val) => setGlobalState('loading',val)
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
export const setHeaderHeight = val => setGlobalState('headerHeight',val)
export const setDevice = (val) => {setGlobalState('device',val)}
export const setFeedback = (val) => {setGlobalState('feedback',val)}
export const setPropertyModal = val => setGlobalState('property',val)

export const toggleFavourite = id => {

  let favourites = JSON.parse(localStorage.getItem('favourites')) || []
  if (favourites.includes(id)){
    favourites.splice(favourites.indexOf(id),1)
  }
  else{
    favourites = favourites.concat(id)
  }
  localStorage.setItem('favourites',JSON.stringify(favourites))
}


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
    garden,
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

  if (garden)
    first.push(`${metres} מ"ר + גינה,`)
  else
    first.push(`${metres} מ"ר,`)
  first.push(`${floor ? `קומה ${floor}`:`קומת קרקע`}`)
  first.push(`מתוך ${totalfloors} קומות`)

  return `${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}, ${city_id}
${first.join(' ')}
${test.join(', ')}
${furniture}${structure !== 'ישן' ? ` בבניין ${structure}` : ``} במחיר של ${price.toLocaleString()} ₪
  `
}

export const filterProperties = (properties,filters) => {

  const {
    budgetFrom,
    budgetTo,
    roomsFrom,
    roomsTo,
    renovations,
    addresses,
    addressesActive,
    address,
    propertyIds,
    furnitureTypes,
    metresFrom,
    metresTo,
    floorFrom,
    floorTo,
  } = filters

  let primeFilters = [...properties]

  if (addressesActive){
    primeFilters = primeFilters.filter(({neighborhood_name}) => addresses.some(addr => neighborhood_name.includes(addr)))
  }
  else if (address.length) {
    primeFilters = primeFilters.filter( ({neighborhood_name, street_name}) => {
      for (let addr of address) {
        let [neighborhood, street] = addr.split(', ')
        if (neighborhood_name === neighborhood && street_name === street)
          return true
        else if (!street){
          if (neighborhood_name === neighborhood)
            return true
        }
        return false
      }
      return false
    })
  }
  else if (propertyIds.length) {
    primeFilters = primeFilters.filter(({custom_id}) => propertyIds.some(num => custom_id === num))
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
        (budgetFrom <= price) && (budgetTo === constants.MaxPrice ? price <= 9999999 : price <= budgetTo) &&
        (metresFrom <= metres) && (metresTo === constants.MaxMetres ? metres <= 9999999 : metres <= metresTo) &&
        (roomsFrom <= rooms) && (roomsTo === constants.MaxRooms ? rooms <= 99 : rooms <= roomsTo+.5) &&
        (floorFrom <= floor) && (floorTo === constants.MaxFloor ? floor <= 9999999 : floor <= metresTo) &&
        (renovations.length ? renovations.some(ren => ren === renovation.toString()) : true) &&
        (furnitureTypes.length ? furnitureTypes.some(f_type => f_type === furniture) : true)
      );
    })

  Object.keys(switchFilters).forEach(filter => {
    if (filters.attributes[filter])
      filtered = filtered.filter(prop => prop[filter])
  })


  filtered = filtered.map(({id}) => id)
  let retVal = [...properties]
  for (let property of retVal){
    property.isFiltered = filtered.includes(property.id);
  }
  setPage(1)

  setTotalFiltered(filtered.length)
  return retVal.sort(({created:createdA},{created:createdB}) => createdB - createdA)
}

export const validateId = id => (id && Number.isInteger(parseInt(id)) && id.length === 5)


export const onPropertyClicked = (property) => {

  const {custom_id,isCollapsed} = property

  console.log(property)
  setProperties(properties => properties.map(prop => prop.custom_id === custom_id ? ({...prop, isCollapsed: !prop.isCollapsed}) : prop))
  if (!isCollapsed)
    setPropertyModal({...property,isCollapsed:true})
  else
    setPropertyModal(null)
/*
  let alternatives = getAlternatives(property)
*/
}

export const resize = () => {

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

export const getAgentById = (agents,id) => agents.find(agent => agent.id === id)

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
  let properties = await fetchProperties(city)
  setProperties(properties)
  setIsLoading(false)
}

export const initProperty = async (propertyId,currentCity) => {

  setIsLoading(true)

  let property = await fetchProperty(propertyId)
  let {city_id: city, custom_id} = property
  let properties = await fetchProperties(city)

  console.log('setting new city from current city: ' + currentCity, ' propertyCity: ' + city)
  setCity(city)
  setProperties(properties.map(prop => prop.custom_id === custom_id ? ({...prop,isCollapsed:!prop.isCollapsed}) : prop).sort((a,b) => { return a.custom_id === custom_id ? -1 : b.custom_id === custom_id ? 1 : 0; }))
  setPropertyModal({...property,isCollapsed:true})
  setIsLoading(false)

}

export const fetchProperties = async (city) => {

  const data = await getProperties(city)
  const agents = await fetchAgents()
  const properties = data.sort(({created:createdA},{created:createdB}) => createdB - createdA)

  let favouritesString = localStorage.getItem('favourites')
  let favourites = (favouritesString && JSON.parse(favouritesString)) || []

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
      property.isFavouriteOut = true
    if (!newAddressMap[area]) {
      newAddressMap[area] = {}
      dropdownData.push({
        id:area,
        label:area,
        value:area,
      })
    }
    if (!newAddressMap[area][neighborhood_name+'n']) {
      newAddressMap[area][neighborhood_name+'n'] = []
      dropdownData.push({
        area,
        id:neighborhood_name+'n',
        label:neighborhood_name,
        parent_id:area,
      })
    }
    if (!newAddressMap[area][neighborhood_name+'n'].includes(street_name+'s')) {
      newAddressMap[area][neighborhood_name+'n'][street_name+'s'] = []
      dropdownData.push({
        area,
        neighborhood_name,
        id:street_name+'s',
        label:street_name,
        parent_id:neighborhood_name+'n',
      })
    }


    if (custom_id) {
      newAddressMap[area][neighborhood_name+'n'][street_name+'s'].push(custom_id)
      dropdownData.push({
        id:custom_id,
        label:`נכס מספר ${custom_id}`,
        parent_id:street_name+'s'
      })
    }

  }
  setAddressMap(newAddressMap)
  setAddressTree(unflatten(dropdownData))
  setTotalCityCount(properties.length)
  setTotalFiltered(properties.length)

  setAgents(agents)
  console.log('city data loaded')

  return properties

}

function unflatten(arr) {

  //addon for same neighborhood-street name (Vardiya ex.)
/*  for (let i =0;i< arr.length;i++){
    let obj = arr[i]
    for (let j =i+1;j< arr.length;j++) {
      if (obj.id == arr[j].id){
        obj.id += '*'
        for (let k =0;k< arr.length;k++){
          if (arr[k].parent_id == arr[j].id && arr[k].neighborhood_name){
            arr[k].parent_id += '*'
          }
        }
      }
    }
  }*/

  let tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(let i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }

  for (let id in mappedArr) {
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
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
}
