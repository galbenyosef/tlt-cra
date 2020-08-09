import React, {useRef, useState} from 'react'
import {Grid, Hidden} from '@material-ui/core';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LeadTypes } from '../Utilities';
import TLT_LOGO from '../../assets/YellowLogoTrans_TLT.png'
import {MediaModalTypes, setGlobalState} from "../../globalState";
import {onPropertyClicked} from "../../dataHandler";
import {PropertyDetailGrid} from "../PropertyModal/PropertyDetailGrid";
import {colors} from "../../colors";

const imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"

const PropertyViewGrid = React.memo(({property:{

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
    custom_id,
    isFavourite

},index,toggleFavourite}) => {

    const setLeadModal = val => setGlobalState('lead',val)

    let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
    isNew.setDate(isNew.getDate() + 7);

    isNew = Date.now() < isNew

    console.log('card render')

    const PropertyViewComponent = () => 
        <div
          style={{
            display:'flex',
            flexDirection:'column',
            height:320,
            width:'auto',
            margin:'auto',
            backgroundColor:'white',
            boxShadow:'3px 3px 3px 0px grey',
            whiteSpace:'nowrap',
            borderRadius:20,
            overflow:'hidden',
            justifyContent:'flex-end',
            backgroundImage:`${thumb_file? `url(${imageUrl}${thumb_file?.sm})` : `url(${TLT_LOGO})`}`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize:thumb_file  ? 'cover' : window.innerWidth < 600 ? '300px' : '200px',
            position:'relative',
          }}>
          {
            isNew &&
            <p style={{position:'absolute',top: 30,
            width: 150,
            textAlign: 'center',
            right: -35,
            fontSize:22,
            backgroundColor: colors.darkblue,
            transform: 'rotate(45deg)',fontWeight:'bolder',zIndex:1}}>{`חדש !`}</p>
          }
          {
            isFavourite ?
            <FaHeart onClick={(event) => {toggleFavourite(index);event.stopPropagation()}} size={32} color={'red'} style={{zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
            :
            <FiHeart onClick={(event) => {toggleFavourite(index);event.stopPropagation()}} size={32} color={'white'} style={{backgroundColor:'rgba(0,0,0,0.05)',zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
          }
          <div style={{textAlign:'right',display:'flex',flexDirection:'column',backgroundImage:'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',justifyContent:'flex-end',alignItems:'flex-start'}}>
            <div style={{padding:'10px 10px',fontFamily:'Assistant',fontWeight:'bolder',color:'white',fontSize:15}}>
                <p>
                  {`שכונת ${neighborhood_name}, רחוב ${street_name}`}
                </p>
            </div>
            <div style={{width:'100%',paddingBottom:10,justifyContent:'space-between',display:'flex',flexDirection:'row',fontFamily:'Assistant',fontWeight:'bold',color:'white'}}>
              <p style={{fontSize:13,paddingRight:10}}>
                {rooms ? `${rooms} חדרים | `: ` `}
                {metres? `${metres} מ"ר`:` `}
                {terrace ? ` + מרפסת`:``}
                {floor !== undefined ? (floor ? ` | קומה ${floor}`:` | קומת קרקע`): ' '}
              </p>
              <p style={{fontSize:20,paddingBottom:10,fontWeight:'bolder',paddingLeft:10}}>
                {price ? `${price.toLocaleString()} ₪`: ` `}
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'row',paddingBottom:10,justifyContent:'space-between',margin:'auto'}}>
              <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                <div onClick={() => onPropertyClicked(id)}
                  style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:colors.darkblue}}>{`לפרטים`}</div>
                <div onClick={(e) => {e.stopPropagation();setLeadModal({type:LeadTypes.MeetingRequest,attributes:{kala_property_id:id}})}}
                   style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(255,255,255,0.2)',color:'white'}}>{`לפגישה`}
                </div>
              </div>
            </div>
          </div>
        </div>

    return  (
      <Grid item xs={12} sm={index % 4 === 0 || (index+1) % 4 === 0 ? 12:6} md={index % 21 === 1 || index % 21 === 7 || index % 21 === 16 ? 6 : 3} >
        <PropertyViewComponent/>
      </Grid>
    )
    
},(prevProps,nextProps) => {
  return prevProps.property.isFavourite === nextProps.property.isFavourite
})


const PropertyViewList = React.memo(({property,property:{

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
  custom_id,
  city_id,
  propertytype,
  isFavourite,
  entrance,
  committee,
  totalfloors,
  parking,
  isCollapsedOut

},index,toggleFavourite}) => {

  if (isCollapsedOut)
    console.log(id)
  const setLeadModal = val => setGlobalState('lead',val)
  const setMediaModal = val => setGlobalState('media',val)
  const [isCollapsed,setIsCollapsed] = useState(isCollapsedOut || false)
  const videoRef = useRef(0)

  let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
  isNew.setDate(isNew.getDate() + 7);

  isNew = Date.now() < isNew

  const {
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

  let media = {
    images:propertyImages,
    videos:[]
  }

  if (video__url){
    media.videos.push({
      original:'',
      renderItem:() => (<div>
        <video ref={videoRef} onClick={(e) => {if (e.target.paused)e.target.play();else e.target.pause()}} muted className={"image-gallery-image"}>
          <source src={`https://tlt.kala-crm.co.il/${video__url}`} type="video/mp4"/>
        </video>
      </div>),
      description: 'Render custom slides within the gallery',
    })
  }

  console.log('card render')

  const PropertyViewComponent = () =>
    <>
      <Grid container onClick={() => {console.log(property);setIsCollapsed(isCollapsed => !isCollapsed)}} style={{width:'100%',height:74,display:'flex',alignItems:'center',borderBottom:'2px solid lightgrey',justifyContent:'space-between'}}>
        <Grid item xs={8} sm={5} style={{display:'flex',alignItems:'center'}}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setMediaModal({
                type:MediaModalTypes.Images,
                ...media
                })
              }
            }
            style={{
              borderRadius:10,
              display:'flex',
              height:66,
              width:110,
              backgroundImage:`url(${media.images[0]?.original})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize:'cover',
              backgroundColor:'white'
            }}>
          </div>
          <div style={{display:'flex',flexDirection:'column',paddingRight:20}}>
            <span style={{fontSize:16}}>{street_name}</span>
            <span style={{fontSize:14}}>{`${propertytype}, ${neighborhood_name}, ${city_id}`}</span>
          </div>
        </Grid>
        <Grid item xs={4} sm={4} style={{textAlign:'center',justifyContent:"space-around",alignItems:'center',display:'flex',height:'100%',borderLeft:'1px solid rgba(0,0,0,.1)',borderRight:'1px solid rgba(0,0,0,.1)'}}>
          <div style={{display:'flex',flexDirection:'column'}}>
            <span style={{fontSize:16}}>{rooms}</span>
            <span style={{fontSize:14}}>חדרים</span>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <span style={{fontSize:16}}>{floor ? floor:'קרקע'}</span>
            <span style={{fontSize:14}}>קומה</span>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            <span style={{fontSize:16}}>{metres}</span>
            <span style={{fontSize:14}}>מ"ר</span>
          </div>
        </Grid>
        <Hidden only={'xs'}>
          <Grid item sm={3} style={{display:'flex',flexDirection:'column',paddingLeft:20}}>
            <span style={{textAlign:'left'}}>
              {`${price.toLocaleString()} ₪`}
            </span>
            <span style={{fontSize:10,textAlign:'left'}}>
              {isNew? 'חדש' : ''}
            </span>
          </Grid>
        </Hidden>
      </Grid>
      <Hidden only={'xs'}>
      {
        isCollapsed?
          <Grid onClick={() => console.log(property)} container style={{display:'flex',backgroundColor:'white'}}>
            <Grid item xs={8} sm={5} style={{display:'flex',flexDirection:'column',justifyContent:'space-between',padding:20,paddingBottom:55}}>
              <div style={{display:'flex',flexDirection:'column'}}>
                <span style={{fontSize:16,fontWeight:'bold',paddingBottom:20}}>תיאור הנכס</span>
                <span style={{fontSize:12}}>דירה מושקעת משופצת. רהיטים... שולחן.... כריים גז... ארון הזזה 4 דלתות דלתות פנדור מיזוג חלונות אנטי סן ונגד רעשים מתאים לשתי שותפים דירה שחבל לפספס חנייה במפרץ השכונה על בסיס מקום פנוי</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',paddingTop:10}}>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>תאריך כניסה <span style={{fontSize:12}}>{(entrance && entrance.slice(0,-5)) || 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>מרפסות <span style={{fontSize:12}}>לא צוין</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>מס תשלומים <span style={{fontSize:12}}>לא צוין</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>ועד בית <span style={{fontSize:12}}>{parseInt(committee) ? `${committee.toLocaleString()} ₪` : 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>קומות בבניין <span style={{fontSize:12}}>{totalfloors || 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>חניות <span style={{fontSize:12}}>{(parking && parking[0] == 2 ? 2 :1) || 'לא צוין'}</span></span>
              </div>
            </Grid>
            <Grid item xs={4} sm={4} style={{display:'flex',flexDirection:'column',textAlign:'center',padding:20}}>
              <span style={{fontSize:16,fontWeight:'bold',paddingBottom:20}}>מה יש בנכס?</span>
              <PropertyDetailGrid {...property}/>
            </Grid>
            <Grid item sm={3} style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around',alignItems:'center',color:'white',textAlign:'center'}}>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue}}>לפגישה</span>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey'}}>סיור בנכס</span>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey'}}>התקשר</span>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue}}>מפה</span>
            </Grid>
          </Grid>
          : null
      }
      </Hidden>
    </>
  return  (
      <PropertyViewComponent/>
  )

},(prevProps,nextProps) => {
  return(
    (prevProps.property.isFavourite === nextProps.property.isFavourite) ||
    (prevProps.property.isCollapsed === nextProps.property.isCollapsed)
  )


})

export {PropertyViewGrid,PropertyViewList}