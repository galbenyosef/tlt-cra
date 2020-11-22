var express = require('express');
var router = express.Router();
const axios = require('axios')

serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

let getPropertiesUrl = city => {

  return("https://tlt.kala-crm.co.il/api/v1/page?" + serialize({
    'select[0]':'created',
    'select[1]':'id',
    'select[2]':'title',
    'select[3]':'attributes',
    'select[4]':'active',
    'select[5]':'thumb_file',
    'select[6]':'modified',
    'active':'true',
    'page_attributes[city_id]':`${city}`,
    'page_attributes[status]':'במאגר',
    'page_attributes[__operators][price]':'between',
    'page_attributes[price][0]':0,
    'page_attributes[price][1]':99999,
    'page_attributes[__operators][rooms]':'between',
    'page_attributes[rooms][0]':1,
    'page_attributes[rooms][1]':99,
    'page_attributes[__operators][renovation]':'between',
    'page_attributes[renovation][0]':1,
    'page_attributes[renovation][1]':4,
    'page_attributes[renovation][1]':4,
/*
    'page_attributes[street_name]':'שמשון',
*/


  }))
};

const getUsersUrl = () => `https://tlt.kala-crm.co.il/api/v1/user/`
const getUserUrl = id => `https://tlt.kala-crm.co.il/api/v1/user/${id}`
/*
const getPropertyUrl = id => `https://tlt.kala-crm.co.il/api/v1/page/${id}?get_page_assets_urls=true`
*/
const getPropertyUrl = id => `https://tlt.kala-crm.co.il/api/v1/page?${serialize({
  'select[0]':'created',
  'select[1]':'id',
  'select[2]':'title',
  'select[3]':'attributes',
  'select[4]':'active',
  'select[5]':'thumb_file',
  'select[6]':'modified'
})}&id=${id}`

const getCoordinatesUrl = (q) => `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`
const getLeadUrl = () => `https://tlt.kala-crm.co.il/api/v1/lead`
const getAgents = () => `https://tlt.kala-crm.co.il/api/v1/user?site_id=724&active=1&select[]=first_name&select[]=last_name&select[]=phone&select[]=id`


router.post('/lead', async (req,res) => {

  const {body} = req

  try {
    await axios.post(getLeadUrl(),
      body, {
        headers:{
          "X-Leads-Key":"nGb3tltbJr4ew6k",
        }
      })

    return res.sendStatus(200)
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)

  }
})




router.get('/user/:id',async (req,res) => {

  const {id} = req.params

  try{
    let response = await axios.get(getUserUrl(id),{
      method: 'GET',
      headers: {
        "x-users-key":"asGgtlt6q2bgsdF"
      }
    })
    const {data:{payload}} = response

    let {
      first_name,
      last_name,
      phone
    } = payload

    return res.send({first_name,
      last_name,
      phone})
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)
  }


})

router.get('/agents/',async (req,res) => {

  try{
    let response = await axios.get(getAgents(),{
      method: 'GET',
      headers: {
        "x-users-key":"asGgtlt6q2bgsdF"
      }
    })
    const {data:{payload}} = response
    res.set('Cache-control', 'public, max-age=300')
    return res.send(payload)
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)
  }


})

router.get('/user/',async (req,res) => {

  const {id} = req.params

  try{
    let response = await axios.get(getUsersUrl(id),{
      method: 'GET',
      headers: {
        "x-users-key":"asGgtlt6q2bgsdF"
      }
    })
    const {data:{payload}} = response

    let {
      first_name,
      last_name,
      phone
    } = payload

    return res.send({first_name,
      last_name,
      phone})
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)
  }


})

router.get('/properties/:id', async (req,res) => {

  const {id} = req.params

  try{
    let response = await axios.get(getPropertyUrl(id),{
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })

    const {data:{payload}} = response
    let  {
      title,
      thumb_file,

      attributes: {
        custom_id,
        agent_id,
        commission,
        comment,
        city_id,
        neighborhood_name,
        street_name,
        streetnumber,
        propertytype,
        stairs,
        renovation,
        rooms,
        metres,
        terrace,
        toiletamount,
        furniture_items,
        bathroomamount,
        shower,
        bathtub,
        floor,
        totalfloors,
        description,
        structure,
        entrance,
        furniture,
        price,
        tax,
        committee,
        landscape,
        parking,
        elevator,
        warehouse,
        accessibility,
        saferoom,
        bars,
        nets,
        electricshutters,
        parentsunit,
        roomsbig,
        kitchenbig,
        salonbig,
        video__url,
        pic_living_room__url,
        pic_living_room2__url,
        pic_balcony__url,
        pic_kitchen__url,
        pic_kitchen2__url,
        pic_main_bedroom__url,
        pic_bedroom__url,
        pic_bathroom__url,
        pic_bathroom2__url,
        pic_view__url,
        garden
      },
      active,
      created,
      modified,
      deleted,
      asset_id,
    } = payload[0]

    const property = {
      id,
      thumb_file,
      title,
      custom_id,
      agent_id,
      commission,
      comment,
      city_id,
      neighborhood_name,
      street_name,
      streetnumber,
      propertytype,
      renovation,
      stairs,
      rooms,
      metres,
      terrace,
      toiletamount,
      bathroomamount,
      description,
      shower,
      bathtub,
      floor,
      garden,
      furniture_items,
      totalfloors,
      structure,
      entrance,
      furniture,
      video__url,
      price,
      tax,
      committee,
      landscape,
      parking,
      elevator,
      warehouse,
      accessibility,
      saferoom,
      bars,
      nets,
      electricshutters,
      parentsunit,
      roomsbig,
      kitchenbig,
      salonbig,
      active,
      created,
      modified,
      deleted,
      asset_id,
      pictures:[
        thumb_file ? `/common/assets/748/724/${thumb_file.sm}` : null,
        pic_living_room__url,
        pic_living_room2__url,
        pic_balcony__url,
        pic_kitchen__url,
        pic_kitchen2__url,
        pic_main_bedroom__url,
        pic_bedroom__url,
        pic_bathroom__url,
        pic_bathroom2__url,
        pic_view__url
      ].filter(img => !!img).map(image => ({
        original:`https://tlt.kala-crm.co.il/${image}`,
        thumbnail:`https://tlt.kala-crm.co.il/${image}`,
      }))
    }
    console.log(modified)
    return res.send(property)
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)
  }


})

router.get('/properties/', async (req,res) => {

  const {city} = req.query

  try{
    let response = await axios.get(getPropertiesUrl(city),{
      method: 'GET',
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })
    let {data:{payload}} = response

    let properties = payload.map(({
      id,
      created,
      title,
      thumb_file,
      modified,
      attributes:{
        video__url,
        neighborhood_name,
        description,
        airdirections,
        toiletamount,
        bathroomamount,
        area,
        street_name,
        rooms,
        metres,
        agent_id,
        city_id,
        furniture_items,
        propertytype,
        terrace,
        furniture,
        renovation,
        floor,
        price,
        custom_id,
        airconditioner,
        boiler,
        shower,
        bathtub,
        structure,
        parking,
        warehouse,
        garden,
        accessibility,
        saferoom,
        bars,
        nets,
        requirements,
        electricshutters,
        parentsunit,
        stairs,
        landscape,
        elevator,
        entrance,
        tax,
        committee,
        totalfloors,
        pic_living_room__url,
        pic_living_room2__url,
        pic_balcony__url,
        pic_kitchen__url,
        pic_kitchen2__url,
        pic_main_bedroom__url,
        pic_bedroom__url,
        pic_bathroom__url,
        pic_bathroom2__url,
        pic_view__url
      }
    }) => ({
      id,
      created,
      agent_id,
      video__url,
      neighborhood_name,
      street_name,
      rooms,
      area,
      metres:parseInt(metres),
      terrace,
      title,
      furniture_items,
      requirements,
      description,
      floor,
      airdirections,
      toiletamount,
      bathroomamount,
      city_id,
      propertytype,
      price,
      tax,
      furniture,
      renovation,
      custom_id,
      airconditioner,
      boiler,
      shower,
      bathtub,
      structure,
      parking,
      warehouse,
      garden,
      accessibility,
      saferoom,
      bars,
      nets,
      electricshutters,
      parentsunit,
      stairs,
      landscape,
      elevator,
      entrance,
      committee,
      totalfloors,
      modified,
      pictures:[
        thumb_file ? `/common/assets/748/724/${thumb_file.sm}` : null,
        pic_living_room__url,
        pic_living_room2__url,
        pic_balcony__url,
        pic_kitchen__url,
        pic_kitchen2__url,
        pic_main_bedroom__url,
        pic_bedroom__url,
        pic_bathroom__url,
        pic_bathroom2__url,
        pic_view__url
      ].filter(img => !!img).map(image => ({
        original:`https://tlt.kala-crm.co.il/${image}`,
        thumbnail:`https://tlt.kala-crm.co.il/${image}`,
      }))
    }))

    return res.send(properties)
  }
  catch(e){
    console.log(e)

    return res.sendStatus(400)
  }

})


router.get('/coordinates/:q', async (req,res) => {

  try{
    const {q} = req.params

    console.log(getCoordinatesUrl(encodeURIComponent(q)))
    let response = await axios.get(getCoordinatesUrl(encodeURIComponent(q)))

    if (response && response.data){
      return res.send(response.data)
    }
  }
  catch(e){
    return res.status(400).send(e)
  }

})


module.exports = router;
