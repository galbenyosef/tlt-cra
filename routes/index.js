var express = require('express');
var router = express.Router();

const axios = require('axios')

const getUserUrl = id => `http://localhost:${process.env.PORT || '16656'}/kala/v1/user/${id}`
const getUrl = () => `http://localhost:${process.env.PORT || '16656'}/kala/v1/page?select[]=created&select[]=id&select[]=title&select[]=attributes&select[]=active&select[]=thumb_file&page_attributes[__operators][price]=between&%20%20%20%20page_attributes__operators%5D%5Bstatus%5D=%3D&page_attributes%5Bstatus%5D=%D7%91%D7%9E%D7%90%D7%92%D7%A8&page_attributes[__operators][price]=between&page_attributes[price][0]=0&page_attributes[price][1]=99999&page_attributes[__operators][rooms]=between&page_attributes[rooms][0]=1&page_attributes[rooms][1]=99&page_attributes[__operators][renovation]=between&page_attributes[renovation][0]=1&page_attributes[renovation][1]=4`
const getSingleUrl = id => `http://localhost:${process.env.PORT || '16656'}/kala/v1/page/${id}?get_page_assets_urls=true`
const getCoordinatesUrl = (q) => `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`
const getLeadUrl = () => 'http://localhost:${process.env.PORT || \'16656\'}/kala/v1/lead'


router.get('/user/:id',async (req,res) => {

  const {id} = req.params

  let response = await axios.get(getUserUrl(id),{
    method: 'GET',
    headers: {
      "x-users-key":"asGgtlt6q2bgsdF"
    }
  })

  if (response && response.data){
    return res.send(response.data)
  }
  return res.sendStatus(400)

})

router.get('/properties/:id', async (req,res) => {

  const {id} = req.params

  console.log(id)
  let response = await axios.get(getSingleUrl(id),{
    headers: {
      "x-kala-key":"kdcG983ujtltGHtgzd"
    }
  })

  if (response && response.data){
    return res.send(response.data)
  }
  return res.sendStatus(400)

})

router.get('/properties', async (req,res) => {

  console.log('it works actually')
  let response = await axios.get(getUrl(),{
    method: 'GET',
    headers: {
      "x-kala-key":"kdcG983ujtltGHtgzd"
    }
  })

  if (response && response.data){
    return res.send(response.data)
  }
  return res.sendStatus(400).end()

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

router.post('/lead', async (req,res) => {

  const {body} = req

  console.log(body)

  let response = await axios.post(getLeadUrl(),{
    method: 'POST',
    body:JSON.stringify(body),
    headers: {
      "Content-Type":"application/json",
      "X-Leads-Key":"nGb3tltbJr4ew6k"
    }
  })

  if (response && response.ok){
    let responseJson = await response.json()
    return res.send(responseJson)
  }
  return res.sendStatus(400).end()

})

module.exports = router;
