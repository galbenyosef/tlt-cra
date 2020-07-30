import {getCoordinates, getProperty, getUser} from "./apiHandler";

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