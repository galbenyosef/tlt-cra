import React, {useState} from 'react'
import { Grid } from '@material-ui/core';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LeadTypes } from '../Utilities';
import TLT_LOGO from '../../assets/Logo_TLT.png'
import {setGlobalState} from "../../globalState";
import {onPropertyClicked} from "../../dataHandler";

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
            backgroundColor: 'rgb(112, 146, 191)',
            transform: 'rotate(45deg)',color:'white',fontWeight:'bolder',zIndex:1}}>{`חדש !`}</p>
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
                  style={{padding:5,display:'flex',width:90,justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgba(29,31,60,.7)',color:'white',}}>{`לפרטים`}</div>
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


const PropertyViewList = React.memo(({property:{

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
  isFavourite

},index,toggleFavourite}) => {

  const setLeadModal = val => setGlobalState('lead',val)
  const [isCollapsed,setIsCollapsed] = useState(false)
  let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
  isNew.setDate(isNew.getDate() + 7);

  isNew = Date.now() < isNew

  console.log('card render')

  const PropertyViewComponent = () =>
    <>
      <div onClick={() => setIsCollapsed(isCollapsed => !isCollapsed)} style={{height:74,display:'flex',alignItems:'center',borderBottom:'2px solid lightgrey'}}>
        <div
          style={{
            borderRadius:10,
            display:'flex',
            height:66,
            width:110,
            backgroundImage:`${thumb_file? `url(${imageUrl}${thumb_file?.sm})` : `url(${TLT_LOGO})`}`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize:thumb_file  ? 'cover' : '66px'
          }}>
        </div>
        <div style={{display:'flex',flexDirection:'column',padding:'0px 10px',width:250}}>
          <span style={{fontSize:16}}>{street_name}</span>
          <span style={{fontSize:14}}>{`${propertytype}, ${neighborhood_name}, ${city_id}`}</span>
        </div>
        <div style={{textAlign:'center',justifyContent:"space-between",width:150,padding:'0px 10px',alignItems:'center',display:'flex',height:'100%',borderLeft:'1px solid rgba(0,0,0,.1)',borderRight:'1px solid rgba(0,0,0,.1)'}}>
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
        </div>
        <div style={{display:'flex',flexDirection:'column',padding:'0px 10px',width:150}}>
          <span style={{textAlign:'left'}}>
            {`${price.toLocaleString()} ₪`}
          </span>
          <span style={{fontSize:10,textAlign:'left'}}>
            {isNew? 'חדש' : ''}
          </span>
        </div>
      </div>
      {
        isCollapsed ?
          <div style={{display:'flex',backgroundColor:'white',height:50}}>
            <div style={{display:'flex',flexDirection:'column'}}>
              <span>תיאור הנכס</span>
              <span></span>
            </div>
          </div>
          : null
      }
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