import React, {useRef, useState} from 'react'
import {Grid, Hidden} from '@material-ui/core';
import {devices} from '../Utilities';
import {MediaModalTypes, setGlobalState, useGlobalState} from "../../globalState";
import {createPropertyDescription, fetchCoordinates, getAgentById, onPropertyClicked} from "../../dataHandler";
import {PropertyDetailGrid} from "../PropertyDetailGrid";
import {colors} from "../../colors";

const imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"

export default React.memo(({property,property:{

  id,
  created,
  thumb_file,
  video__url,
  neighborhood_name,
  street_name,
  rooms,
  metres,
  floor,
  price,
  custom_id,
  city_id,
  propertytype,
  isFavourite,
  description,
  entrance,
  tax,
  furniture,
  committee,
  totalfloors,
  isCollapsedOut,
  requirements,
  agent_id

},index,toggleFavourite}) => {

  const setLeadModal = val => setGlobalState('lead',val)
  const setMediaModal = val => setGlobalState('media',val)
  const setMapModal = val => setGlobalState('map',val)
  const [device] = useGlobalState('device')
  const [isCollapsed,setIsCollapsed] = useState(isCollapsedOut || false)
  const [agentPhone,setAgentPhone] = useState('')
  const [agents] = useGlobalState('agents')

  const videoRef = useRef(0)

  let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
  isNew.setDate(isNew.getDate() + 7);
  isNew = Date.now() < isNew

  const agent = getAgentById(agents,agent_id)

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

  let pictures =[]

  if (thumb_file)
    pictures.push(`/common/assets/748/724/${thumb_file.lg}`)

  pictures = pictures.concat([pic_living_room__url,
    pic_living_room2__url,
    pic_balcony__url,
    pic_kitchen__url,
    pic_kitchen2__url,
    pic_main_bedroom__url,
    pic_bedroom__url,
    pic_bathroom__url,
    pic_bathroom2__url,
    pic_view__url]).filter(img => !!img)

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
        <video ref={videoRef} controls muted className={"image-gallery-image"}>
          <source src={`https://tlt.kala-crm.co.il/${video__url}`} type="video/mp4"/>
        </video>
      </div>),
    })
  }

  const onExploreClicked = async () => {
    let myPromise = () => new Promise((resolve,reject) => {
      setMediaModal({
        type:MediaModalTypes.Videos,
        opened:true,
        ...media
      })
      resolve()
    })

    await myPromise()
    videoRef.current && videoRef.current.play()

  }

  console.log('card render')

  const PropertyViewComponent = () =>
    <>
      <Grid container onClick={() => {
        console.log(property);(device < devices.Tablet) ? onPropertyClicked(id) : setIsCollapsed(isCollapsed => !isCollapsed)}
      } style={{width:'100%',height:74,display:'flex',alignItems:'center',borderBottom:'2px solid lightgrey',justifyContent:'space-between'}}>
        <Grid item xs={8} sm={5} style={{display:'flex',alignItems:'center'}}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setMediaModal({
                opened:true,
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
          <Grid container style={{display:'flex',backgroundColor:'white'}}>
            <Grid item xs={8} sm={5} style={{display:'flex',flexDirection:'column',justifyContent:'space-between',padding:20,paddingBottom:55}}>
              <div style={{display:'flex',flexDirection:'column'}}>
                <span style={{fontSize:16,fontWeight:'bold',paddingBottom:20}}>תיאור הנכס</span>
                <span style={{fontSize:12,whiteSpace:'break-spaces'}}>{createPropertyDescription((property))}</span>
                <span style={{fontSize:12,whiteSpace:'break-spaces'}}>{description}</span>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',paddingTop:10}}>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>תאריך כניסה <span style={{fontSize:12}}>{(entrance && entrance.slice(0,-5)) || 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>דרישות בחוזה <span style={{fontSize:12}}>{requirements || 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>ריהוט <span style={{fontSize:12}}>{furniture.replace('ריהוט','') || 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>ארנונה <span style={{fontSize:12}}>{parseInt(tax) ? `${tax.toLocaleString()} ₪` : 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>ועד בית <span style={{fontSize:12}}>{parseInt(committee) ? `${committee.toLocaleString()} ₪` : 'לא צוין'}</span></span>
                <span style={{width:'50%',paddingTop:10,fontWeight:'bold'}}>קומות בבניין <span style={{fontSize:12}}>{totalfloors || 'לא צוין'}</span></span>
              </div>
            </Grid>
            <Grid item xs={4} sm={4} style={{display:'flex',flexDirection:'column',textAlign:'center',padding:20}}>
              <span style={{fontSize:16,fontWeight:'bold',paddingBottom:20}}>מה יש בנכס?</span>
              <PropertyDetailGrid {...property}/>
            </Grid>
            <Grid item sm={3} style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around',alignItems:'center',color:'white',textAlign:'center'}}>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue,cursor:'pointer'}}
                onClick={() => {
                  setLeadModal(modal => {
                    let user_id = agent_id
                    let kala_property_id = id
                    return ({...modal,opened:true,user_id,attributes:{...modal.attributes,kala_property_id}})
                  })
                }}>לפגישה</span>
              {
                media.videos.length ? <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey',cursor:'pointer'}}
                      onClick={() => onExploreClicked()}>סיור בנכס</span>
                  :
                  <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey',cursor:'pointer'}}
                        >לא קיים וידאו</span>
              }
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey',cursor:'pointer',fontSize:agentPhone ?12:''}}
                onClick={
                  () => setAgentPhone(agent.phone)
                }
              >{agentPhone || 'צור קשר'}</span>
              <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue,cursor:'pointer'}}
                onClick={async () => {
                  let coords = await fetchCoordinates([street_name,neighborhood_name,city_id].join(', '))
                  if (coords ){
                    const {lon,lat} = coords
                    setMapModal({lon,lat,opened:true})
                  }
                }}>מפה</span>
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

