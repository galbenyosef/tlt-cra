import React, {useEffect, useRef} from 'react'
import {Modal} from "@material-ui/core";
import {MediaModalTypes, setGlobalState, useGlobalState} from "../../globalState";
import {
  createPropertyDescription,
  fetchCoordinates,
  getAgentById,
  onExploreClicked,
  setLeadModal,
  setMapModal, setMediaModal,
} from "../../dataHandler";
import {PropertyDetailGrid} from "../PropertyDetailGrid";
import {
  EmailShareButton,
  FacebookShareButton,
  WhatsappShareButton,
} from "react-share"
import {colors} from "../../colors";
import moment from "moment";
import FacebookIcon from "react-share/es/FacebookIcon";
import TwitterShareButton from "react-share/es/TwitterShareButton";
import TwitterIcon from "react-share/es/TwitterIcon";
import WhatsappIcon from "react-share/es/WhatsappIcon";
import EmailIcon from "react-share/es/EmailIcon";
import FacebookMessengerShareButton from "react-share/es/FacebookMessengerShareButton";
import FacebookMessengerIcon from "react-share/es/FacebookMessengerIcon";

export default () => {

  const [headerHeight] = useGlobalState('headerHeight')
  const [property,setProperty] = useGlobalState('property')
  const setMediaModal = val => setGlobalState('media',val)
  const [agents] = useGlobalState('agents')
  const videoRef = useRef(0)


  if (!property)
    return null

  let {
    id,
    thumb_file,
    agent_id,
    pic_living_room__url,
    pic_living_room2__url,
    pic_balcony__url,
    pic_kitchen__url,
    pic_kitchen2__url,
    pic_main_bedroom__url,
    pic_bedroom__url,
    pic_bathroom__url,
    pic_bathroom2__url,
    description,
    pic_view__url,
    video__url,
    propertytype,
    city_id,
    price,
    street_name,
    neighborhood_name,
    rooms,
    floor,
    entrance,
    metres,
    furniture,
    furniture_items,
    tax,
    committee,
    custom_id
  } = property


  const agent = getAgentById(agents,agent_id)
  const agentName = agent && [agent.first_name,agent.last_name].join(' ')
  const propertyName = [city_id,neighborhood_name,street_name].join(', ')
  const agentPhone = agent && agent.phone

  let pictures =[]

  let getPropertyUrl = () => `https://tlt-israel.herkouapp.com/${id}`

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

  let top = headerHeight

  let innerH = window.innerHeight
  entrance = entrance ? (moment(entrance,"DD-MM-YYYY").isBefore(moment().add(1, 'days')) ? 'מיידי':entrance.slice(0,-5)) : 'מיידי'
  console.log(property)
  return (
    <Modal
      hideBackdrop
      BackdropProps={{style:{top:150}}}
      open={true} style={{direction:'rtl',backgroundColor:'white',top:headerHeight,fontFamily:'Rubik'}}>
      <div style={{position:'relative',display:'flex',flexDirection:'column',padding:'0px 10px',paddingTop:30,outline:'none'}}>
        <div onClick={
          () => setProperty(null)
        } style={{fontSize: 32,
          fontWeight: 'bold',
          cursor:'pointer',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          position: 'absolute',
          top: -18,
          right: 0,
          backgroundColor: 'white',
          textAlign: 'center',
          borderRadius: 100,
          height: 32,
          width: 32}}>X</div>
        <div style={{maxHeight:`calc(${innerH}px - ${top}px - 60px)`,overflow:'auto'}}>
          <div>
            <div style={{display:'flex',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
              <span>{`${propertytype} להשכרה ב${city_id}`}</span>
              <span>עודכן היום</span>
            </div>
            <div onClick={() => setMediaModal({...media,opened:true,type:MediaModalTypes.Images})} style={{
              width:'100%',
              height:'calc(90vw * 3 / 4)',
              backgroundImage:`url(${propertyImages[0] ? propertyImages[0].original : ''})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize:'90%',
              backgroundColor:'lightgrey'
            }}/>
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',borderTop:'1px solid grey',borderBottom:'1px solid grey',marginTop:20,paddingTop:20,paddingBottom:20}}>
            <span style={{fontSize:20,fontWeight:'bold'}}>{`${price.toLocaleString()} ₪`}</span>
            <span>{street_name}</span>
            <span>{`${propertytype}, ${neighborhood_name}, ${city_id}`}</span>
            <div style={{display:'flex',width:'100%',alignItems:'center',whiteSpace:'pre-wrap',textAlign:'center',justifyContent:'space-around',paddingTop:20}}>
              <span>{`${rooms}\n חדרים`}</span>
              <span>{`${floor || `קרקע`}\n קומה`}</span>
              <span>{`${metres}\n מ"ר`}</span>
            </div>
          </div>
          <div style={{display:'flex',width:'100%',alignItems:'center',textAlign:'center',justifyContent:'space-around',marginTop:20}}>
            <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue,cursor:'pointer'}}
                  onClick={() => {
                    setLeadModal(modal => {
                      let user_id = agent_id
                      let kala_property_id = id
                      return ({...modal,opened:true,user_id,attributes:{...modal.attributes,kala_property_id,propertyName,agentName,agentPhone:agent.phone}})
                    })
                  }}>לפגישה</span>
            {
              media.videos.length ? <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:'grey',cursor:'pointer'}}
                                          onClick={() => onExploreClicked()}>סיור בנכס</span> : null
            }
            <span style={{display:'flex',justifyContent:'center',alignItems:'center',height:30,width:'45%',backgroundColor:colors.darkblue,cursor:'pointer'}}
                  onClick={async () => {
                    let coords = await fetchCoordinates([street_name,neighborhood_name,city_id].join(', '))
                    if (coords ){
                      const {lon,lat} = coords
                      setMapModal({lon,lat,opened:true})
                    }
                  }}>מפה</span>
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            <span style={{fontSize:20,fontWeight:'bold',paddingBottom:10}}>על הנכס</span>
            <span style={{whiteSpace:'break-spaces'}}>{createPropertyDescription(property)}</span>
            <span style={{whiteSpace: 'break-spaces'}}>{description}</span>
          </div>
          <span>{`תאריך כניסה: ${entrance}`}</span>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            <EmailShareButton/>
            <FacebookShareButton/>
            <WhatsappShareButton/>
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            <span style={{fontSize:20,fontWeight:'bold',paddingBottom:10}}>מה יש בנכס?</span>
            <PropertyDetailGrid {...property}/>
            <span>{furniture}</span>
            <span>{furniture_items && furniture_items.length? `פירוט ריהוט: ${furniture_items.join(', ')}` : ``}</span>
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20,marginBottom:20}}>
            <span style={{fontSize:20,fontWeight:'bold',paddingBottom:10}}>פרטים נוספים</span>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>{`ועד בית (לחודש)`}</span>
              <span>{committee > 0 ? `${committee.toLocaleString()} ₪` : `לא צוין`}</span>
            </div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span>{`ארנונה דו חודשית`}</span>
              <span>{tax > 0 ? `${tax.toLocaleString()} ₪` : `לא צוין`}</span>
            </div>
          </div>
          <div style={{display:'flex',width:'100%',justifyContent:'space-around',alignItems:'center'}}>
            <FacebookShareButton url={getPropertyUrl()} quote={`נכס מספר ${custom_id}`}>
              <FacebookIcon
                size={40} // You can use rem value instead of numbers
                round
              />
            </FacebookShareButton>

            <FacebookMessengerShareButton title={'messnger'} url={getPropertyUrl()}>
              <FacebookMessengerIcon round
                size={40}
              />
            </FacebookMessengerShareButton>

            <TwitterShareButton title={'twitter title'} url={getPropertyUrl()}>
              <TwitterIcon size={40} round />
            </TwitterShareButton>

            <WhatsappShareButton url={getPropertyUrl()} title={'whatsapp test'} separator=":: ">
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <EmailShareButton url={getPropertyUrl()} subject={'mail test'} body="body">
              <EmailIcon size={40} round />
            </EmailShareButton>

          </div>
        </div>
        <div style={{width:'100%',backgroundColor:'yellowgreen',textAlign:'center',position:'fixed',bottom:0,right:0,left:0,height:30,display:'flex'}}>
          <span style={{margin:'auto'}} onClick={() => window.open(`tel:${agentPhone}`,`_blank`)}>{`התקשר ${agentPhone}`}</span>
        </div>
      </div>
    </Modal>
  )
}