
const getPropertyUrl = id => `/api/properties/${id}`

const getUserUrl = id => `/api/user/${id}`

const getCoordinatesUrl = (q) => `/api/coordinates/${q}`

const getLeadUrl = () => `/api/lead`

const getAllPropertiesUrl = () => `/api/properties`

export const getUser = async (id) => {

  try{
    let response = await fetch(getUserUrl(id))

    if (response && response.ok){
      let responseJson = await response.json()
      return responseJson
    }
    throw(response)
  }
  catch(e){
    console.log(e)
    return
  }


}

export const getProperties = async () => {
  try{
    let response = await fetch(getAllPropertiesUrl())

    if (response && response.ok){
      let responseJson = await response.json()
      return responseJson
    }
    throw(response)
  }
  catch(e){
    console.log(e)
    return
  }
}

export const getProperty = async id => {
  try{
    let response = await fetch(getPropertyUrl(id))

    if (response && response.ok){
      let responseJson = await response.json()
      return responseJson
    }
    throw(response)
  }
  catch(e){
    console.log(e)
    return
  }
}

export const getCoordinates = async (q) => {
  try{
    let response = await fetch(getCoordinatesUrl(q))

    if (response && response.ok){
      let responseJson = await response.json()
      return responseJson
    }
    throw(response)
  }
  catch(e){
    console.log(e)
    return
  }
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




