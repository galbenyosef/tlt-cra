import axios from 'axios'


const getSingleUrl = id => `/api/properties/${id}`

const getUserUrl = id => `/api/user/${id}`

const getCoordinatesUrl = (q) => `/api/coordinates/${q}`

const getLeadUrl = () => `/api/lead`

const getUrl = () => `/api/properties`

export const getUser = async (id) => {

  let response = await fetch(getUserUrl(id),{
      method: 'GET',
  })

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)

}

export const getProperties = async () => {

  let response = await fetch(getUrl())
  console.log(response)
  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)

}

export const getProperty = async id => {

  let response = await axios.get(`/api/properties/${id}`)

  console.log(response)
  if (response && response.data){
    return response.data
  }
  throw(response)

}

export const getCoordinates = async (q) => {

  let response = await fetch(getCoordinatesUrl(q))

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)
  
}

export const createLead = async (body) => {

  let response = await fetch(getLeadUrl(),{
      method: 'POST',
      body:JSON.stringify(body),
  })

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)
  
}




