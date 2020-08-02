import React, {useRef, useState} from 'react'
import { Modal,Grid } from '@material-ui/core'
import { useGlobalState } from '../../globalState'
import { isMobile } from 'react-device-detect'
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";
import {PropertyDetailGrid} from "./PropertyDetailGrid";

export const PropertyModal = () => {

  const [property,setProperty] = useGlobalState('property')
  const videoRef = useRef(0)
  if (!property)
    return null
  console.log('rendering PropertyModal')

  const {
    street_name,
    neighborhood_name,
    city_id,
    propertytype,
    price,
    metres,
    floor,
    committee,
    tax,
    requirements,
    video__url,
    coordinates,
    alternatives,
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
  } = property

  let pictures = [pic_living_room__url,
    pic_living_room2__url,
    pic_balcony__url,
    pic_kitchen__url,
    pic_kitchen2__url,
    pic_main_bedroom__url,
    pic_bedroom__url,
    pic_bathroom__url,
    pic_bathroom2__url,
    pic_view__url].filter(img => !!img)

  let propertyImages = pictures.map(image => ({
    original:`https://tlt.kala-crm.co.il/${image}`,
    thumbnail:`https://tlt.kala-crm.co.il/${image}`,
  }))

  if (video__url){
    console.log('detected video url')
    propertyImages.unshift({
      original:'',
      renderItem:() => (<div>
        <video ref={videoRef} onClick={(e) => {if (e.target.paused)e.target.play();else e.target.pause()}} muted className={"image-gallery-image"}>
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
            <Grid item xs={12} style={{display:'flex',alignItems:'center'}}>
              <p style={{color:'blue',fontWeight:'bolder',marginLeft:20}}>
                כתובת הנכס
              </p>
              <p>
                {`${city_id}, שכונת ${neighborhood_name}, רחוב ${street_name}`}
              </p>
            </Grid>
            <Grid item xs={12} style={{display:'flex',alignItems:'center',justifyContent:'space-around'}}>
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
            <PropertyDetailGrid {...property}/>
          </div>
          <div style={{width:320}}>
            <ImageGallery onSlide={(index) => {if (index && videoRef.current){videoRef.current.pause();videoRef.current.currentTime = 0}} }
            showThumbnails={false} showIndex showBullets isRTL items={propertyImages} />
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