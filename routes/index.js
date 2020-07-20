var express = require('express');
var router = express.Router();

const axios = require('axios')

const getUserUrl = id => `http://localhost:${process.env.PORT || '16656'}/kala/v1/user/${id}`
const getUrl = () => `http://localhost:${process.env.PORT || '16656'}/kala/v1/page?select[]=created&select[]=id&select[]=title&select[]=attributes&select[]=active&select[]=thumb_file&page_attributes[__operators][price]=between&%20%20%20%20page_attributes__operators%5D%5Bstatus%5D=%3D&page_attributes%5Bstatus%5D=%D7%91%D7%9E%D7%90%D7%92%D7%A8&page_attributes[__operators][price]=between&page_attributes[price][0]=0&page_attributes[price][1]=99999&page_attributes[__operators][rooms]=between&page_attributes[rooms][0]=1&page_attributes[rooms][1]=99&page_attributes[__operators][renovation]=between&page_attributes[renovation][0]=1&page_attributes[renovation][1]=4`
const getSingleUrl = id => `http://localhost:${process.env.PORT || '16656'}/kala/v1/page/${id}?get_page_assets_urls=true`
const getCoordinatesUrl = (q) => `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`
const getLeadUrl = () => `http://tlt.kala-crm.co.il/api/v1/lead`

router.post('/lead', async (req,res) => {

  const {body} = req

  try {
    let response = await axios.post('http://tlt.kala-crm.co.il/api/v1/lead',
      body, {
        headers:{
          'Content-Type': 'application/json;charset=UTF-8',
          "X-Leads-Key":"nGb3tltbJr4ew6k",
        }
      })

    return res.sendStatus(200)
  }
  catch(e){
/*
    console.log(e)
*/
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

router.get('/properties/:id', async (req,res) => {

  const {id} = req.params

  try{
    let response = await axios.get(getSingleUrl(id),{
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })

    const {data:{payload}} = response
    
    let  {
      title,
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
        renovation,
        rooms,
        metres,
        terrace,
        toiletamount,
        bathroomamount,
        shower,
        bathtub,
        floor,
        totalfloors,
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
      },
      position,
      active,
      created,
      modified,
      deleted,
      asset_id,
      page_assets_urls
    } = payload

    const property = {
      id,
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
      rooms,
      metres,
      terrace,
      toiletamount,
      bathroomamount,
      shower,
      bathtub,
      floor,
      totalfloors,
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
      position,
      active,
      created,
      modified,
      deleted,
      asset_id,
      page_assets_urls
    }
    
    return res.send(property)
  }
  catch(e){
    console.log(e)
    return res.sendStatus(400)
  }


})

router.get('/properties', async (req,res) => {

  try{
    let response = await axios.get(getUrl(),{
      method: 'GET',
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })
    let {data:{payload}} = response

    let properties = payload.map(({
      id,
      created,
      thumb_file,
      attributes:{
        video__url,
        project,
        neighborhood_name,
        street_name,
        rooms,
        metres,
        terrace,
        floor,
        price,
        custom_id
      }
    }) => ({
      id,
      created,
      thumb_file,
      video__url,
      project,
      neighborhood_name,
      street_name,
      rooms,
      metres,
      terrace,
      floor,
      price,
      custom_id
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
