import React from 'react'
import { Grid} from '@material-ui/core';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { setGlobalState, useGlobalState } from '../globalState';
import { getValueByDevice, LeadTypes } from './Utilities';
import './blur.css';
import TLT_LOGO from '../Logo_TLT.png'

export const PropertyView = ({property,isFavourite,toggleFavourite}) => {

    const handleClick = val => {setGlobalState('selectedProperty',val)}

    
    const setSingleMediaModalOpened = val => setGlobalState('singleMediaModal',val)
    const setLeadModal = val => setGlobalState('newLeadModal',val)

    const {video__url} = property.attributes
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(property.created);

    let imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"
    console.log('card render')
    return (
      <Grid item xs={12} sm={6} md={4}  style={{maxHeight:'50%'}}>
        <div onClick={() => {console.log(property);handleClick(property.id)}}  style={{display:'flex',flexDirection:'column',height:'100%',margin:'auto',backgroundColor:'white',boxShadow:'3px 3px 3px 0px grey',whiteSpace:'nowrap',overflow:'hidden',maxWidth:300}}>
          <div style={{position:'relative',flex:1,height:'55%'}}>
            {
              <p style={{position:'absolute',top:'10px',right:'10px',backgroundColor:'rgba(255,255,0,0.6)',transform:'rotate(-12.5deg)',color:'green',fontWeight:'bolder',zIndex:1}}>{`${'חדש !'}`}</p>
            }
            {
              isFavourite ?
              <FaHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={32} color={'red'} style={{zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
              :
              <FiHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={32} color={'white'} style={{zIndex:1,position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
            }
            
            <div onClick={() => {}} style={{width:'100%',height:'100%',overflow:'hidden'}}>
              <LazyLoadImage
                effect="blur"
                style={{height:'100%',width:'100%'}}
                src={property.thumb_file ? `${imageUrl}${property.thumb_file?.sm}` : TLT_LOGO} // use normal <img> attributes as props
                placeholderSrc={TLT_LOGO}
              />        
            </div>
         </div>
         <div style={{textAlign:'right',position:'relative',padding:'10px'}}>
            <div style={{fontFamily:'Assistant',fontWeight:'bolder'}}>
                <p>
                  {`שכונת ${property.attributes.neighborhood_name}, רחוב ${property.attributes.street_name}`}
                </p>
            </div>
            <div style={{fontFamily:'Assistant',fontWeight:'bold'}}>
                <p style={{width:'100%'}}>
                  {property.attributes.rooms ? `${property.attributes.rooms} חדרים | `: ` `}
                  {property.attributes.metres? `${property.attributes.metres} מ"ר`:` `}
                  {property.attributes.terrace ? `+ מרפסת`:``}
                  {property.attributes.floor != undefined ? (property.attributes.floor ? ` | קומה ${property.attributes.floor}`:` | קומת קרקע`): ' '}
                </p>
            </div>
            <div style={{fontSize:18,fontWeight:'bolder',fontFamily:'Assistant',textAlign:'end'}}>
              {property.attributes.price ? `${property.attributes.price.toLocaleString('he-IL')} ₪`: ` `}
            </div>
            <div style={{display:'flex',flexDirection:'row',fontWeight:'bold',padding:'10px 0px',justifyContent:'space-between'}}>
              <div style={{display:'flex',width:'32%',borderRadius:100,border:'1px solid orangered',justifyContent:'center',alignItems:'center',fontSize:14}}>{`${property.attributes.custom_id ? `#${property.attributes.custom_id}`:`-`}`}</div>
              <div onClick={(e) => {e.stopPropagation();setLeadModal({type:LeadTypes.MeetingRequest,attributes:{kala_property_id:property.id}})}} style={{display:'flex',width:'32%',borderRadius:100,border:'1px solid orangered',justifyContent:'center',alignItems:'center',fontSize:10,cursor:'pointer',backgroundColor:'orangered',color:'white',}}>{`קבע פגישה`}</div>
              <div onClick={
                (e) => {video__url && setSingleMediaModalOpened(video__url);e.stopPropagation()}
              } style={{display:'flex',width:'32%',borderRadius:100,border:'1px solid orangered',justifyContent:'center',alignItems:'center',fontSize:12,cursor:video__url?'pointer':''}}>{`סייר בנכס`}</div>
            </div>
          </div>
        </div>
      </Grid>
   )
}
  