import React from 'react'
import {Modal} from "@material-ui/core";
import {MediaModalTypes, setGlobalState, useGlobalState} from "../../globalState";
import {createPropertyDescription, getAgentById} from "../../dataHandler";
import {PropertyDetailGrid} from "../PropertyDetailGrid";

export default () => {

  const [headerHeight] = useGlobalState('headerHeight')
  const [property,setProperty] = useGlobalState('property')
  const setMediaModal = val => setGlobalState('media',val)
  const [agents] = useGlobalState('agents')

  console.log(property)
  if (!property)
    return null

  const {
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
    committee
  } = property

  const agent = getAgentById(agents,agent_id)
  const agentPhone = agent && agent.phone

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
        <video controls muted className={"image-gallery-image"}>
          <source src={`https://tlt.kala-crm.co.il/${video__url}`} type="video/mp4"/>
        </video>
      </div>),
    })
  }

  let top = headerHeight

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
        <div style={{maxHeight:`calc(100vh - ${top}px - 60px)`,overflow:'auto'}}>
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
              <span>{`${floor}\n קומה`}</span>
              <span>{`${metres}\n מ"ר`}</span>
            </div>
          </div>
          <div style={{display:'flex',width:'100%',alignItems:'center',textAlign:'center',justifyContent:'space-around',marginTop:20}}>
            <button>מפה</button>
            <button>נווט</button>
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            <span style={{fontSize:20,fontWeight:'bold',paddingBottom:10}}>על הנכס</span>
            <span style={{whiteSpace:'break-spaces'}}>{createPropertyDescription(property)}</span>
          </div>
          <span>{`תאריך כניסה: ${entrance}`}</span>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            כאן יופיעו קישורי שיתוף והעתקת קישור כמו ביד2
          </div>
          <div style={{display:'flex',width:'100%',flexDirection:'column',marginTop:20}}>
            <span style={{fontSize:20,fontWeight:'bold',paddingBottom:10}}>מה יש בנכס?</span>
            <PropertyDetailGrid {...property}/>
            <span>{furniture}</span>
            <span>{furniture_items && furniture_items.length? `${furniture_items.join(', ')}` : ``}</span>
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
        </div>
        <div style={{width:'100%',backgroundColor:'lime',textAlign:'center',position:'fixed',bottom:0,right:0,left:0,height:30}}>
          <span onClick={() => window.open(`tel:${agentPhone}`,`_blank`)}>{`התקשר ${agentPhone}`}</span>
        </div>
      </div>
    </Modal>
  )
}