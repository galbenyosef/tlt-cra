import React from 'react'
import { Grid } from '@material-ui/core';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { setGlobalState } from '../../globalState';
import { LeadTypes } from '../Utilities';
import TLT_LOGO from '../../assets/Logo_TLT.png'

const imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"

export const PropertyView = ({property,isFavourite,toggleFavourite,index,isAlternative}) => {

    const handleClick = val => setGlobalState('selectedProperty',val)
    const setSingleMediaModalOpened = val => setGlobalState('singleMediaModal',val)
    const setLeadModal = val => setGlobalState('newLeadModal',val)

    const {
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
    } = property

    let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
    isNew.setDate(isNew.getDate() + 7);

    isNew = Date.now() < isNew

    console.log('card render')

    const PropertyViewComponent = () => 
        <div onClick={() => {console.log(property);handleClick(property.id)}}  
          style={{
            display:'flex',
            flexDirection:'column',
            height:isAlternative ? 320*.8 : 320,
            width:isAlternative ? 300 : 'auto',
            margin:'auto',
            backgroundColor:'white',
            boxShadow:'3px 3px 3px 0px grey',
            whiteSpace:'nowrap',
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
            <FaHeart onClick={(event) => {toggleFavourite(id);event.stopPropagation()}} size={32} color={'red'} style={{zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
            :
            <FiHeart onClick={(event) => {toggleFavourite(id);event.stopPropagation()}} size={32} color={'white'} style={{backgroundColor:'rgba(0,0,0,0.05)',zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
          }
          <div style={{textAlign:'right',display:'flex',flexDirection:'column',backgroundImage:'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',justifyContent:'flex-end',alignItems:'flex-start'}}>
            <div style={{padding:'0px 10px',fontFamily:'Assistant',fontWeight:'bolder',color:'white',fontSize:22}}>
                <p>
                  {`שכונת ${neighborhood_name}, רחוב ${street_name}`}
                </p>
            </div>
            <div style={{width:'100%',justifyContent:'space-between',display:'flex',flexDirection:'row',fontFamily:'Assistant',fontWeight:'bold',color:'white'}}>
              <p style={{paddingRight:10}}>
                {rooms ? `${rooms} חדרים | `: ` `}
                {metres? `${metres} מ"ר`:` `}
                {terrace ? `+ מרפסת`:``}
                {floor !== undefined ? (floor ? ` | קומה ${floor}`:` | קומת קרקע`): ' '}
              </p>
              <p style={{fontSize:26,fontWeight:'bolder',paddingLeft:10}}>
                {price ? `${price.toLocaleString()} ₪`: ` `}
              </p>
            </div>
            <div style={{display:'flex',flexDirection:'row',fontWeight:'bold',justifyContent:'space-between',margin:'auto'}}>
              <div style={{display:'flex',flexDirection:'row',fontWeight:'bold',justifyContent:'space-between'}}>
                <div style={{padding:5,display:'flex',width:project? 100 :90,borderRadius:100,border:'1px solid rgb(112,146,191)',justifyContent:'center',alignItems:'center',fontSize:14,color:'white'}}>{`${custom_id ? `#${custom_id}`:`-`}`}</div>
                <div onClick={(e) => {e.stopPropagation();setLeadModal({type:LeadTypes.MeetingRequest,attributes:{kala_property_id:property.id}})}} 
                  style={{padding:5,display:'flex',width:project? 100 :90,borderRadius:100,border:'1px solid rgb(112,146,191)',justifyContent:'center',alignItems:'center',fontSize:14,cursor:'pointer',backgroundColor:'rgb(112,146,191)',color:'white',}}>{`קבע פגישה`}</div>
                <div onClick={
                    (e) => {video__url && setSingleMediaModalOpened(video__url);e.stopPropagation()}
                  } style={{padding:5,display:'flex',width:project? 100 :90,borderRadius:100,border:'1px solid rgb(112,146,191)',justifyContent:'center',alignItems:'center',fontSize:14,cursor:video__url?'pointer':'',color:'white'}}>{`סייר בנכס`}
                </div>
              </div>
            </div>
          </div>
        </div>

    return isAlternative ? (
      <div style={{padding:20}}>
        <PropertyViewComponent/>
      </div>
    ) : (
      <Grid item xs={12} sm={index % 4 === 0 || (index+1) % 4 === 0 ? 12:6} md={index % 10 === 0 || (index-6) % 10 === 0 ? 8 : 4} >
        <PropertyViewComponent/>
      </Grid>
    )
    
}
  