import React from 'react'
import { Grid} from '@material-ui/core';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { setGlobalState, useGlobalState } from '../globalState';


export const PropertyView = React.memo(({property,amount,toggleFavourite}) => {

    const [favourites, setFavourites] = useGlobalState('favourites');
    const handleClick = val => {setGlobalState('selectedProperty',val)}
    const isFavourite = favourites.includes(property.id)

    let imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"
    console.log('card render')
    return (
      <Grid onClick={() => {console.log(property);handleClick(property.id)}} item xs={6} sm={4} style={{padding:'0px 20px 20px 20px',height:amount == 4 ? '33%':'50%'}}>
        <div style={{display:'flex',flexDirection:'column',height:'100%',margin:'auto',backgroundColor:'white',boxShadow:'10px 10px 10px 0px grey',whiteSpace:'nowrap',overflow:'hidden',maxWidth:'300px'}}>
          <div style={{position:'relative',height:'55%',flex:1}}>
            <p style={{position:'absolute',top:'10px',right:'10px',backgroundColor:'yellow',transform:'rotate(-12.5deg)',color:'green',fontWeight:'bolder'}}>{`${'חדש!'}`}</p>
            {
              isFavourite ?
              <FaHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={/* amount == 4 ? 24: */32} color={'red'} style={{position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
              :
              <FiHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={/* amount == 4 ? 24: */32} color={'white'} style={{position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
            }
            
            <div onClick={() => {}} style={{overflow:'hidden',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {
                property.thumb_file ?
                <div>
                  <LazyLoadImage
                    style={{maxWidth:'100%',width:'100%',height:'100%'}}
                    src={`${imageUrl}${property.thumb_file.sm}`} // use normal <img> attributes as props
                    />
                  <span style={{width:'100%',textAlign:'center'}}>{`התמונה נטענת...`}</span>
                </div>
              : 
                null
              }
            </div>
         </div>
         <div style={{textAlign:'right',position:'relative',padding:'10px'}}>
            <div style={{fontSize:'1.1vw',fontFamily:'Assistant',fontWeight:'bolder',whiteSpace:'pre-line'}}>
              {`שכונת ${property.attributes.neighborhood_name}, רחוב ${property.attributes.street_name}`}
            </div>
            <div style={{fontSize:'.8vw',fontFamily:'Assistant',fontWeight:'bold'}}>
              {`
              ${property.attributes.rooms ? `${property.attributes.rooms} חדרים ⋅`: ` `}
              ${property.attributes.metres? `${property.attributes.metres} מ"ר`:` `}
              ${property.attributes.terrace ? `+ מרפסת`:``}
              ${property.attributes.floor != undefined ? (property.attributes.floor ? `⋅ קומה ${property.attributes.floor}`:` ⋅ קומת קרקע`): ' '}
              `}
            </div>
            <div style={{fontSize:'1.3vw',fontWeight:'bolder',fontFamily:'Assistant',textAlign:'end'}}>
             {property.attributes.price ? `${property.attributes.price.toLocaleString('he-IL')} ₪`: ` `}
            </div>
            <div style={{display:'flex',flexDirection:'row',fontWeight:'bold',padding:'10px 0px',justifyContent:'space-between'}}>
              <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`${property.attributes.propertyNumber ? `#${property.attributes.propertyNumber}`:`-`}`}</div>
              <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`סייר בנכס`}</div>
              <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`קבע פגישה`}</div>
            </div>
          </div>
        </div>
      </Grid>
   )
  })
  