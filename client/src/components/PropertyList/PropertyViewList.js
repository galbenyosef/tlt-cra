import React, {useRef, useState} from 'react'
import {Grid, Hidden} from '@material-ui/core';
import {devices, getValueByDevice} from '../Utilities';
import {MediaModalTypes, useGlobalState} from "../../globalState";
import {
  createPropertyDescription,
  fetchCoordinates,
  getAgentById,
  onPropertyClicked, setLeadModal, setMapModal,
  setMediaModal, toggleFavourite
} from "../../dataHandler";
import {PropertyDetailGrid} from "../PropertyDetailGrid";
import {colors} from "../../colors";
import moment from "moment";
import {EmailShareButton, FacebookShareButton, WhatsappShareButton} from "react-share";
import FacebookIcon from "react-share/es/FacebookIcon";
import FacebookMessengerShareButton from "react-share/es/FacebookMessengerShareButton";
import FacebookMessengerIcon from "react-share/es/FacebookMessengerIcon";
import TwitterShareButton from "react-share/es/TwitterShareButton";
import TwitterIcon from "react-share/es/TwitterIcon";
import WhatsappIcon from "react-share/es/WhatsappIcon";
import EmailIcon from "react-share/es/EmailIcon";
import {FaHeart} from "react-icons/fa";
import {FiHeart} from "react-icons/fi";

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
  isFavouriteOut,
  description,
  entrance,
  tax,
  furniture,
  furniture_items,
  committee,
  totalfloors,
  isCollapsedOut,
  requirements,
  agent_id,

},index}) => {

  const [device] = useGlobalState('device')
  const [isCollapsed,setIsCollapsed] = useState(isCollapsedOut || false)
  const [isFavourite,setIsFavourite] = useState(isFavouriteOut || false)
  const [agentPhone,setAgentPhone] = useState('')
  const [agents] = useGlobalState('agents')
  const [isHovered,setIsHovered] = useState(false)

  const videoRef = useRef(0)

  let isNew = new Date(created * 1000); // The 0 there is the key, which sets the date to the epoch
  isNew.setDate(isNew.getDate() + 7);
  isNew = Date.now() < isNew

  const agent = getAgentById(agents,agent_id)
  const agentName = agent && [agent.first_name,agent.last_name].join(' ')
  const propertyName = [city_id,neighborhood_name,street_name].join(', ')

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
    pictures.push(`/common/assets/748/724/${thumb_file.sm}`)

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


  entrance = entrance ? (moment(entrance,"DD-MM-YYYY").isBefore(moment().add(1, 'days')) ? 'מיידי':entrance.slice(0,-5)) : 'מיידי'
  let getPropertyUrl = () => `https://tlt-israel.herkouapp.com/${id}`


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

  const onHeartClicked = () => {setIsFavourite(fav => !fav);toggleFavourite(id)}

  console.log('card render')

  return (
    <Grid container
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '2px solid lightgrey',
            justifyContent: 'space-between'
          }}
          onClick={() => {console.log(property);(device < devices.Tablet) ? onPropertyClicked(id) : setIsCollapsed(isCollapsed => !isCollapsed)}}
    >
      <Grid item xs={8} sm={5} style={{display: 'flex', alignItems: 'center'}}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setMediaModal({
              opened: true,
              type: MediaModalTypes.Images,
              ...media
            })
          }
          }
          style={{
            borderRadius: 10,
            display: 'flex',
            height: 66,
            minWidth: 110,
            backgroundImage: `url(${media.images[0]?.original})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundColor: 'white',
            position:'relative',
            cursor:'pointer',
          }}>
          {
            isFavourite ?
              <FaHeart onClick={(event) => {onHeartClicked();event.stopPropagation()}} size={26} color={'red'} style={{zIndex:1,position:'absolute',top:0,right:5,cursor:'pointer'}}/>
              :
              <FiHeart onClick={(event) => {onHeartClicked();event.stopPropagation()}} size={26} color={'white'} style={{backgroundColor:'rgba(0,0,0,0.05)',zIndex:1,position:'absolute',top:0,right:5,cursor:'pointer'}}/>
          }
          {
            isHovered ?
              <div style={{
                width: 45,
                backgroundColor: 'white',
                borderRadius: 20,
                margin:'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 35
              }}>
                {`+${propertyImages.length}`}
              </div>
              :
              null
          }
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          paddingRight: getValueByDevice(20, 10, 5),
          width: '100%'
        }}>
          <Hidden smUp>
            <span style={{fontSize: 16, textAlign: 'left', marginRight: 'auto', backgroundColor: 'blanchedalmond'}}>
              {`${price.toLocaleString()} ₪`}
            </span>
          </Hidden>
          <span style={{fontSize: 16}}>{street_name}</span>
          <span style={{fontSize: 14}}>{`${propertytype}, ${neighborhood_name}, ${city_id}`}</span>
        </div>
      </Grid>
      <Grid item xs={4} sm={4} style={{
        textAlign: 'center',
        justifyContent: "space-around",
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        borderLeft: '1px solid rgba(0,0,0,.1)',
        borderRight: '1px solid rgba(0,0,0,.1)'
      }}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize: 16}}>{rooms}</span>
          <span style={{fontSize: 14}}>חדרים</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize: 16}}>{floor ? floor : 'קרקע'}</span>
          <span style={{fontSize: 14}}>קומה</span>
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span style={{fontSize: 16}}>{metres}</span>
          <span style={{fontSize: 14}}>מ"ר</span>
        </div>
      </Grid>
      <Hidden only={'xs'}>
        <Grid item sm={3} style={{display: 'flex', flexDirection: 'column', paddingLeft: 20}}>
          <span style={{textAlign: 'left'}}>
            {`${price.toLocaleString()} ₪`}
          </span>
          <span style={{fontSize: 10, textAlign: 'left'}}>
            {isNew ? 'חדש' : ''}
          </span>
        </Grid>
      </Hidden>
      <Hidden only={'xs'}>
        {
          isCollapsed ?
            <Grid container onClick={e => e.stopPropagation()} style={{display: 'flex', backgroundColor: 'white'}}>
              <Grid item xs={8} sm={5} style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 20,
                paddingBottom: 55
              }}>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 20}}>תיאור הנכס</span>
                  <span style={{fontSize: 12, whiteSpace: 'break-spaces'}}>{createPropertyDescription((property))}</span>
                  <span style={{fontSize: 12, whiteSpace: 'break-spaces'}}>{description}</span>
                  <span style={{fontSize: 12, whiteSpace: 'break-spaces'}}>{furniture_items && furniture_items.length ?
                    `פירוט ריהוט: ${furniture_items.join(', ')}` : ``}</span>

                </div>
                <div style={{display: 'flex', flexWrap: 'wrap', paddingTop: 10}}>
              <span style={{width: '50%', paddingTop: 10, fontWeight: 'bold'}}>תאריך כניסה <span
                style={{fontSize: 12}}>{entrance}</span></span>
                  <span style={{width: '50%', paddingTop: 10, fontWeight: 'bold'}}>ארנונה <span
                    style={{fontSize: 12}}>{parseInt(tax) ? `${tax.toLocaleString()} ₪` : 'לא צוין'}</span></span>
                  <span style={{width: '50%', paddingTop: 10, fontWeight: 'bold'}}>ועד בית <span
                    style={{fontSize: 12}}>{parseInt(committee) ? `${committee.toLocaleString()} ₪` : 'לא צוין'}</span></span>
                  <span style={{width: '50%', paddingTop: 10, fontWeight: 'bold'}}>קומות בבניין <span
                    style={{fontSize: 12}}>{totalfloors || 'לא צוין'}</span></span>
                  <span style={{width: '55%', margin: 'auto', paddingTop: 10, fontWeight: 'bold'}}>דרישות בחוזה <span
                    style={{fontSize: 12}}>{requirements || 'לא צוין'}</span></span>

                </div>
              </Grid>
              <Grid item xs={4} sm={4}
                    style={{display: 'flex', flexDirection: 'column', textAlign: 'center', padding: 20}}>
                <span style={{fontSize: 16, fontWeight: 'bold', paddingBottom: 20}}>מה יש בנכס?</span>
                <PropertyDetailGrid {...property}/>
              </Grid>
              <Grid item sm={3} style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center'
              }}>
            <span style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 30,
              width: '45%',
              backgroundColor: colors.darkblue,
              cursor: 'pointer'
            }}
                  onClick={() => {
                    setLeadModal(modal => {
                      let user_id = agent_id
                      let kala_property_id = id
                      return ({
                        ...modal,
                        opened: true,
                        user_id,
                        attributes: {
                          ...modal.attributes,
                          kala_property_id,
                          propertyName,
                          agentName,
                          agentPhone: agent.phone
                        }
                      })
                    })
                  }}>לפגישה</span>
                {
                  media.videos.length ?
                    <span style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 30,
                      width: '45%',
                      backgroundColor: 'grey',
                      cursor: 'pointer'
                    }} onClick={() => onExploreClicked()}>סיור בנכס</span>
                    :
                    <span style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 30,
                      width: '45%',
                      backgroundColor: 'grey',
                      cursor: 'pointer'
                    }}
                    >לא קיים וידאו</span>
                }
                <span style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 30,
                  width: '45%',
                  backgroundColor: 'grey',
                  cursor: 'pointer',
                  fontSize: agentPhone ? 12 : ''
                }} onClick={() => setAgentPhone(agent.phone)}
                >{agentPhone || 'צור קשר'}</span>
                <span style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 30,
                  width: '45%',
                  backgroundColor: colors.darkblue,
                  cursor: 'pointer'
                }}
                      onClick={async () => {
                        let coords = await fetchCoordinates([street_name, neighborhood_name, city_id].join(', '))
                        if (coords) {
                          const {lon, lat} = coords
                          setMapModal({lon, lat, opened: true})
                        }
                      }}>מפה</span>
              </Grid>
              <div style={{display: 'flex', width: '100%', justifyContent: 'space-around', alignItems: 'center'}}>
                <FacebookShareButton url={getPropertyUrl()} quote={`נכס מספר ${custom_id}`}>
                  <FacebookIcon size={40} round/>
                </FacebookShareButton>

                <FacebookMessengerShareButton title={'messnger'} url={getPropertyUrl()}>
                  <FacebookMessengerIcon round size={40}/>
                </FacebookMessengerShareButton>

                <TwitterShareButton title={'twitter title'} url={getPropertyUrl()}>
                  <TwitterIcon size={40} round/>
                </TwitterShareButton>

                <WhatsappShareButton url={getPropertyUrl()} title={'whatsapp test'} separator=":: ">
                  <WhatsappIcon size={40} round/>
                </WhatsappShareButton>

                <EmailShareButton url={getPropertyUrl()} subject={'mail test'} body="body">
                  <EmailIcon size={40} round/>
                </EmailShareButton>

              </div>
              <div style={{margin: 'auto'}}><span>{`נכס מספר ${custom_id}`}</span></div>
            </Grid>
            : null
        }
      </Hidden>
    </Grid>
  )


},(prevProps,nextProps) => {
  return(
    (prevProps.property.isFavourite === nextProps.property.isFavourite) &&
    (prevProps.property.isCollapsed === nextProps.property.isCollapsed) &&
    (prevProps.isHovered === nextProps.isHovered)
  )
})

