
//get properties
const getAllUrl = 
    `/kala/v1/page?
    select[]=id&
    select[]=site_id&
    select[]=title&
    select[]=slug&
    select[]=active&
    select[]=attributes&
    select[]=thumb_file&
    offset=0&
    type_id=2933&
    active=1&
    page_attributes[__operators][status]==&
    page_attributes[status]=במאגר`

const getSingleUrl = id => `/kala/v1/page/${id}?get_page_assets_urls=true`

//get users

const getUserUrl = id => `/kala/v1/user/${id}`

//get coordinates

const getCoordinatesUrl = (q) => `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`

const getLeadUrl = () => '/kala/v1/lead'

const getUrl = (/* options = {} */) => {

  /*   console.log(options)
    let optionsEncoded = ''
    if (options.price){
        optionsEncoded += `page_attributes[__operators][price]=between&`
        optionsEncoded += options.price.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    } */
/*     if (options.rooms){
        optionsEncoded += `page_attributes[__operators][rooms]=between&`
        optionsEncoded += options.rooms.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    }
    if (options.renovation){
        optionsEncoded += `page_attributes[__operators][renovation]=between&`
        optionsEncoded += options.renovation.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    }
    if (options.addresses){
        optionsEncoded += options.addresses.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    }
    if (options.furniture){
        optionsEncoded += options.furniture.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    } */

    const url = `/kala/v1/page?select[]=id&select[]=title&select[]=attributes&select[]=active&select[]=thumb_file&page_attributes[__operators][price]=between&%20%20%20%20page_attributes__operators%5D%5Bstatus%5D=%3D&page_attributes%5Bstatus%5D=%D7%91%D7%9E%D7%90%D7%92%D7%A8&page_attributes[__operators][price]=between&page_attributes[price][0]=0&page_attributes[price][1]=99999&page_attributes[__operators][rooms]=between&page_attributes[rooms][0]=1&page_attributes[rooms][1]=99&page_attributes[__operators][renovation]=between&page_attributes[renovation][0]=1&page_attributes[renovation][1]=4`
    /* return getAllUrl+'&'+optionsEncoded */
    return url
}

export const getUser = async (id) => {

    let response = await fetch(getUserUrl(id),{
        method: 'GET',
        headers: {
          "x-users-key":"asGgtlt6q2bgsdF"
        }
    })
  
  
    if (response && response.ok){
        let responseJson = await response.json()
        return responseJson
    }
    throw(response)

}

export const getProperties = async () => {

    let response = await fetch(getUrl(),{
      method: 'GET',
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })


    if (response && response.ok){
      let responseJson = await response.json()
      return responseJson
    }
    throw(response)

}

export const getProperty = async id => {

    console.log(getSingleUrl(id))
    let response = await fetch(getSingleUrl(id),{
        method: 'GET',
        headers: {
          "x-kala-key":"kdcG983ujtltGHtgzd"
        }
    })

    if (response && response.ok){
        let responseJson = await response.json()
        return responseJson
    }
    throw(response)
  
}

export const getCoordinates = async (q) => {

    console.log(getCoordinatesUrl(q))
    let response = await fetch(getCoordinatesUrl(q),{
        method: 'GET',
    })

    if (response && response.ok){
        let responseJson = await response.json()
        return responseJson
    }
    throw(response)
  
}

export const createLead = async (body) => {


    console.log(body)
    let response = await fetch(getLeadUrl(),{
        method: 'POST',
        body:JSON.stringify(body),
        headers: {
            "Content-Type":"application/json",
            "X-Leads-Key":"nGb3tltbJr4ew6k"
        }
    })

    if (response && response.ok){
        let responseJson = await response.json()
        return responseJson
    }
    throw(response)
  
}

