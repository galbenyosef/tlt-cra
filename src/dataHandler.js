
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

const getUrl = (options = {}) => {

    console.log(options)
    let optionsEncoded = ''
    if (options.price){
        optionsEncoded += `page_attributes[__operators][price]=between&`
        optionsEncoded += options.price.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    }
    if (options.rooms){
        optionsEncoded += options.rooms.map(function(k) {
            return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
        }).join('&')
    }
    if (options.renovation){
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
    }

    console.log(getAllUrl+'&'+optionsEncoded)
    return getAllUrl+'&'+optionsEncoded
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

export const getProperties = async (options) => {

    let response = await fetch(getUrl(options),{
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