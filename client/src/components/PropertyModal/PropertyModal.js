import React, { useEffect, useState } from 'react'
import { Modal,Grid, Input, InputAdornment } from '@material-ui/core'
import { useGlobalState,setGlobalState } from '../../globalState'
import { getProperty, getUser, getCoordinates } from '../../apiHandler'
import { renovationTypes, LeadTypes,  } from '../Utilities'
import { FaBuilding, FaBath, FaFan, FaShower, FaParking, FaWarehouse, FaAccessibleIcon } from 'react-icons/fa'
import { GiFireFlower, GiWindowBars, GiWindow, GiStairs } from 'react-icons/gi'
import { BsPeopleCircle } from 'react-icons/bs'
import { IoMdPhonePortrait, IoIosHome } from 'react-icons/io'
import { isMobile } from 'react-device-detect'
import { FcSafe } from 'react-icons/fc'
import { FiSun } from 'react-icons/fi'
import { AiOutlineTable } from 'react-icons/ai'
import { RiParentLine, RiLandscapeLine } from 'react-icons/ri'
import { GrElevator } from 'react-icons/gr'
import { LocationMap } from './Map'
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";
import { PropertyView } from '../PropertyList/PropertyView'


const MifratItemStyle = {
  justifyContent:'space-around',
  flexWrap:'wrap',
  display:'flex',
  alignItems:'center',
  paddingBottom:35
}

export const PropertyModal = () => {

  const [property,setProperty] = useGlobalState('property')
  const [showPlayButton,setShowPlayButton] = useState(false)
  if (!property)
    return null
  console.log('rendering PropertyModal')
  const {page_assets_urls} = property

  const {
    street_name,
    neighborhood_name,
    city_id,
    propertytype,
    renovation,
    price,
    rooms,
    metres,
    terrace,
    floor,
    elevator,
    custom_id,
    airdirections,
    bathroomamount,
    toiletamount,
    committee,
    tax,
    requirements,
    video__url,
    agentId,
    agentName,
    agentPhone,
    furniture,
    furniture_items,
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
    coordinates,
    alternatives
  } = property

  let propertyImages = page_assets_urls.map(image => ({
    original:`https://tlt.kala-crm.co.il/${image}`,
    thumbnail:`https://tlt.kala-crm.co.il/${image}`,
  }))

  if (video__url){
    console.log('detected video url')
    propertyImages.unshift({
      renderItem:() => (<div>
        <video autoPlay controls className={"image-gallery-image"}>
          <source src={`https://tlt.kala-crm.co.il/${video__url}`} type="video/mp4"/>
        </video>
      </div>),
      description: 'Render custom slides within the gallery',
    })
  }

  console.log(property)

  return (
    <Modal open={!!property} style={{direction:'rtl',overflow:isMobile?'auto':'none',maxHeight:isMobile?'':'calc(100vh)'}} onBackdropClick={() => setProperty(null)}>
      <Grid container style={{
        right: '50%',
        maxWidth:'900px',
        overflow:'auto',
        top: '50%',
        backgroundColor:'white',
        transform: 'translate(50%, -50%)',
        position: 'absolute',}} >
        {/* back button */}
        <Grid xs={12} item style={{backgroundColor:'white',padding:15,display:'flex'}}>
          <p style={{cursor:'pointer'}} onClick={() => setProperty(null)}>חזור</p>
        </Grid>
        {/* info and image row */}
        <Grid item xs={12}
          style={{display:'flex',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{width:525,display:'flex',flexDirection:'column',height:400}}>
            <Grid xs={12} style={{display:'flex',alignItems:'center'}}>
              <p style={{color:'blue',fontWeight:'bolder',marginLeft:20}}>
                כתובת הנכס
              </p>
              <p>
                {`${city_id}, שכונת ${neighborhood_name}, רחוב ${street_name}`}
              </p>
            </Grid>
            <Grid xs={12} style={{display:'flex',alignItems:'center',justifyContent:'space-around'}}>
              <p style={{color:'blue',fontWeight:'bolder'}}>
                מחיר
              </p>
              <p>
                {`${price.toLocaleString()} ₪`}
              </p>
              <p style={{color:'blue',fontWeight:'bolder'}}>
                סוג
              </p>
              <p>
                {propertytype}
              </p>
              <p style={{color:'blue',fontWeight:'bolder'}}>
                קומה
              </p>
              <p>
                {floor ? floor:`קרקע`}
              </p>
              <p style={{color:'blue',fontWeight:'bolder'}}>
                גודל
              </p>
              <p>
                {`${metres} מ"ר`}
              </p>
            </Grid>
            <Grid item xs={12} style={{paddingBottom:15}}
              style={{display:'flex',justifyContent:'space-around'}}>
              <p>ועד בית</p>
              <p>{`${committee? committee.toLocaleString(): 0} ₪`}</p>
              <p>ארנונה דו חודשית</p>
              <p>{`${tax?.toLocaleString()} ₪`}</p>
            </Grid>
            <Grid item xs={12} style={{paddingBottom:15}}
              style={{display:'flex',justifyContent:'space-around'}}>
            <p>שכר דירה</p>
              <p>{`${price? price.toLocaleString() : ''} ₪`}</p>
              <p>דרישות בחוזה</p>
              <p>{requirements || `ללא`}</p>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <p style={{textAlign:'center'}}>מפרט הדירה</p>
              </Grid>
              {
                airconditioner?.length &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaFan  size={20}/>
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מיזוג ${airconditioner[0]}`}</p>
                </Grid>
              }
              {
                boiler &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FiSun size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${boiler}`}</p>
                </Grid>
              }
              {
                shower &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaShower size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מקלחון`}</p>
                </Grid>
              }
              {
                bathtub &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaBath size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`אמבטיה`}</p>
                </Grid>
              }
              {
                structure &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaBuilding size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מבנה ${structure}`}</p>
                </Grid>
              }
              {
                parking &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaParking size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${parking}`}</p>
                </Grid>
              }
              {
                warehouse &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaWarehouse size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מחסן`}</p>
                </Grid>
              }
              {
                garden &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <GiFireFlower size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גינה`}</p>
                </Grid>
              }
              {
                accessibility &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FaAccessibleIcon size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גישה לנכים`}</p>
                </Grid>
              }
              {
                saferoom &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <FcSafe size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`ממ"ד`}</p>
                </Grid>
              }
              {
                bars &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <GiWindowBars size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`סורגים`}</p>
                </Grid>
              }
              {
                nets &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <AiOutlineTable size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`חלונות מרושתים`}</p>
                </Grid>
              }
              {
                electricshutters &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <GiWindow size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`תריסים חשמליים`}</p>
                </Grid>
              }
              {
                parentsunit &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <RiParentLine size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`יחידת הורים`}</p>
                </Grid>
              }
              {
                stairs > 0 &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <GiStairs size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${stairs} מדרגות עד לפתח הדירה`}</p>
                </Grid>
              }
              {
                landscape &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <RiLandscapeLine size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`נוף ${landscape}`}</p>
                </Grid>
              }
              {
                terrace &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <IoIosHome size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מרפסת`}</p>
                </Grid>
              }
              {
                elevator &&
                <Grid style={MifratItemStyle} item xs={4}>
                  <GrElevator size={20} />
                  <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מעלית`}</p>
                </Grid>
              }
            </Grid>
          </div>
          <div style={{width:320}}>
            <ImageGallery  showThumbnails={false} showIndex showBullets isRTL items={propertyImages} />
          </div>
        </Grid>
        <div style={{maxWidth:320,margin:'auto'}}>
          <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
            <div
                 style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(29,31,60,.7)',color:'white',}}>{`לפרטים`}</div>
            <div
                 style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(100,100,100,0.5)',color:'white'}}>{`לפגישה`}
            </div>
            <div
              style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(29,31,60,.7)',color:'white',}}>{`לפרטים`}</div>
            <div
              style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(100,100,100,0.5)',color:'white'}}>{`לפגישה`}
            </div>
          </div>
        </div>
      </Grid>
    </Modal>
  )
}