
const getSingleUrl = id => `/api/properties/${id}`

const getUserUrl = id => `/api/user/${id}`

const getCoordinatesUrl = (q) => `/api/coordinates/${q}`

const getLeadUrl = () => `/api/lead`

const getUrl = () => `/api/properties`

export const getUser = async (id) => {

  let response = await fetch(getUserUrl(id))

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)

}

export const getProperties = async () => {

  let response = await fetch(getUrl())

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
  }
  throw(response)

}

export const getProperty = async id => {

  let response = await fetch(getSingleUrl(id))

  if (response && response.ok){
    let responseJson = await response.json()
    return responseJson
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

  try{
    let response = await fetch(getLeadUrl(),{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(body),
    })
    return response.ok
  }
  catch(e){
    console.log(e)
    return
  }

}




