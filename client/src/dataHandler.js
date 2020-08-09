import {getCoordinates, getProperty, getUser} from "./apiHandler";
import {setGlobalState} from "./globalState";
import {furnitureTypes, range, switchFilters} from "./components/Utilities";

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

  console.log('filters : ',filters)

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

      return (budgetFrom <= price) && (price <= budgetTo) &&
        (metresFrom <= metres) && (metres <= metresTo) &&
        (roomsFrom <= rooms) && (rooms <= roomsTo) &&
        (!floor || (floorFrom <= floor) && (floor <= floorTo)) &&
        (renovationFrom <= renovation) && (renovation <= renovationTo) &&
        (furnitureRangeText.some(text => furniture === text));

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

export const onPropertyClicked = async (id) => {

  const setProperty = val => setGlobalState('property',val)


  let property = await fetchProperty(id)
  const {
    street_name,neighborhood_name,city_id
  } = property

  let addressString = [street_name,neighborhood_name,city_id].join(', ')
  let coordinates = await fetchCoordinates(addressString)
  let alternatives = getAlternatives(property)
  setProperty({...property,alternatives,coordinates})

  return property
}


export const fetchProperty = async (id) => {

  let property = {}

  try{
    const data = await getProperty(id)

    //agent exists
    if (data.agent_id){
      const agentId = data.agent_id
      const agentData = await getUser(agentId)

      const {
        first_name,
        phone
      } = agentData

      property = {
        ...data,
        agentName:first_name,
        agentPhone:phone,
        agentId
      }
    }
  }
  catch(e){
    console.log(e)
  }
  return property
}