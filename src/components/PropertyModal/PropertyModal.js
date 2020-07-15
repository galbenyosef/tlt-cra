import React, { useEffect, useState, useRef, createRef } from 'react'
import { Modal,Grid, TextField, makeStyles, Input, InputAdornment } from '@material-ui/core'
import { KeyboardArrowLeft,KeyboardArrowRight, PlayCircleOutlineOutlined } from '@material-ui/icons'
import { getGlobalState, useGlobalState, setGlobalState } from '../../globalState'
import { getProperty, getUser, getCoordinates, createLead } from '../../dataHandler'
import { PropertyModalLoading } from './PropertyModalLoading'
import { renovationTypes, devices, LeadTypes, getScreenshot, getValueByDevice } from '../Utilities'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { FaBed, FaBuilding, FaBath, FaToilet, FaFan, FaShower, FaParking, FaWarehouse, FaAccessibleIcon } from 'react-icons/fa'
import { GiResize, GiBed, GiCrossedAirFlows, GiFireFlower, GiWindowBars, GiWindow, GiStairs } from 'react-icons/gi'
import { BsPersonBoundingBox, BsFillPersonFill, BsPeopleCircle } from 'react-icons/bs'
import { IoMdPhonePortrait, IoIosHome } from 'react-icons/io'
import { isMobile } from 'react-device-detect'
import { FcHome, FcWorkflow, FcGlobe, FcSafe } from 'react-icons/fc'
import { FiSun } from 'react-icons/fi'
import { AiOutlineTable } from 'react-icons/ai'
import { RiParentLine, RiLandscapeLine } from 'react-icons/ri'
import { GrElevator } from 'react-icons/gr'
import { LocationMap } from '../Map'
import ReactPlayer from 'react-player'
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";
import { PropertyView } from '../PropertyList/PropertyView'

const Tabs = {
    Info:1,
    Plan:2,
    Location:3,
}

const MifratItemStyle = {
    justifyContent:'space-around',
    flexWrap:'wrap',
    display:'flex',
    alignItems:'center',
    paddingBottom:35
}

export const PropertyModal = () => {

    const [selectedProperty,setSelectedProperty] = useGlobalState('selectedProperty')
    const [propertiesData, setPropertiesData] = useGlobalState('properties');
    const [data,setData] = useState(null)
    const [alternatives,setAlternatives] = useState([])
    const [loading,setLoading] = useState(true)
    const [mapInfo,setMapInfo] = useState({
        lat:'',
        lon:'',
    })

    const [leadModalData,setLeadModalData] = useGlobalState('newLeadModal')

    const fetchProperty = async (id) => {

        setLoading(true)

        try{
            const _data = await getProperty(id)

            const {
                city_id,
                street_name,
                neighborhood_name,
                price,
                rooms
            } = _data.payload.attributes

            const coords = await getCoordinates([street_name,neighborhood_name,city_id].join(', '))
            console.log([street_name,neighborhood_name,city_id].join(', '))

            if (coords.length){
                setMapInfo({
                    lat:coords[0].lat,
                    lon:coords[0].lon,
                    boundingbox:coords[0].boundingbox
                })
            }

            let alternativeProperties = propertiesData.data
                .filter(p => 
                    p.attributes.neighborhood_name == neighborhood_name &&
                    (p.attributes.price <= price*1.10 || price >= p.attributes.price*.9) &&
                    p.attributes.rooms == rooms
                )
            console.log('all: '+alternativeProperties)
            setAlternatives(alternativeProperties)

            //agent exists
            if (_data.payload.attributes.agent_member_id){
                const agentId = _data.payload.attributes.agent_member_id
                const agentData = await getUser(agentId)

                const {
                    first_name,
                    phone
                } = agentData.payload

                setData({
                    ..._data,
                    payload:{
                        ..._data.payload,
                        attributes:{
                            ..._data.payload.attributes,
                            agentName:first_name,
                            agentPhone:phone,
                            agentId
                        }
                    },
                    
                })
            } 

            //no agent
            else{
                setData(_data)
            }

        }
        catch(e){
            console.log(e)
        }

        setLoading(false)
    }


    useEffect(() => {

        if (selectedProperty)
            fetchProperty(selectedProperty)

    },[selectedProperty])


    //if not pressed on property
    if (!selectedProperty)
        return null

    if (loading)
        return <PropertyModalLoading/>

    if (!data)
        return null

    let property = data.payload.attributes

    const {
        street_name,
        neighborhood_name,
        city_id,
        propertytype,
        renovation,
        price,
        rooms,
        metres,
        terrace,
        floor,
        elevator,
        custom_id,
        airdirections,
        bathroomamount,
        toiletamount,
        committee,
        tax,
        requirements,
        video__url,
        agentId,
        agentName,
        agentPhone,
        furniture,
        furniture_items,
        airconditioner,
        boiler,
        shower,
        bathtub,
        structure,
        parking,
        warehouse,
        garden,
        accessibility,
        saferoom,
        bars,
        nets,
        electricshutters,
        parentsunit,
        stairs,
        landscape
    } = property

    let propertyImages = data.payload.page_assets_urls.map(image => ({
        original:`https://tlt.kala-crm.co.il/${image}`,
        thumbnail:`https://tlt.kala-crm.co.il/${image}`,
    }))

    if (video__url){
        propertyImages.unshift({
            embedUrl: `https://tlt.kala-crm.co.il/${video__url}`,
            description: 'Render custom slides within the gallery',
        })
    }
    
    console.log(property)

    return (
        <Modal open={!!selectedProperty} style={{direction:'rtl',overflow:isMobile?'auto':'none',maxHeight:isMobile?'':'calc(100vh)'}} onBackdropClick={() => setSelectedProperty('')}>
            <Grid container style={{
                right: '50%',
                maxWidth:'1000px',
                height:'90vh',
                overflow:'auto',
                top: '50%',
                backgroundColor:'white',
                transform: 'translate(50%, -50%)',
                position: 'absolute',}} >
                {/* back button */}
                <Grid xs={12} item style={{backgroundColor:'white',padding:15,display:'flex'}}>
                    <p style={{cursor:'pointer'}} onClick={() => setSelectedProperty(null)}>חזור</p>
                </Grid>
                <Grid xs={12} item style={{backgroundColor:'white',padding:15,display:'flex'}}>
                    <p style={{color:'blue',margin:'auto'}} >{`${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}`}</p>
                </Grid>
                {/* main view */}
                <Grid item style={{justifyContent:'center',display:'flex'}} xs={12}>
                    <ImageGallery thumbnailPosition={'left'} infinite showIndex showBullets isRTL items={propertyImages} />
                </Grid>
                <Grid style={{padding:20,display:'flex',flexDirection:'column'}} item xs={12} sm={6}>
                    {/* property info */}
                    <div style={{height:'calc(100% / 3)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                        <div style={{display:'flex',alignItems:'center'}}>
                            <p style={{color:'blue',fontSize:24,fontWeight:'bolder',marginLeft:20}}>
                                כתובת הנכס
                            </p>
                            <p>
                                {`${`${city_id}, שכונת ${neighborhood_name}, רחוב ${street_name}`}`}
                            </p>
                        </div>
                        <div style={{display:'flex',alignItems:'center'}}>
                        <p style={{color:'blue',fontSize:24,fontWeight:'bolder',marginLeft:20}}>
                                מחיר
                            </p>
                            <p>
                                {`${price.toLocaleString('he-IL')} ₪`}
                            </p>
                        </div>
                    </div>
                    <div style={{height:'calc(100% / 3)',display:'flex',flexDirection:'column',justifyContent:'center'}}>
                        <p>
                            תיאור הנכס
                        </p>
                    </div>
                    <div style={{height:'calc(100% / 3)',display:'flex',justifyContent:'space-evenly'}}>
                        <div style={{display:'flex',alignItems:'center',width:'calc(100% / 3)',justifyContent:'space-around'}}>
                            <p style={{color:'blue',fontSize:24,fontWeight:'bolder'}}>
                                סוג
                            </p>
                            <p>
                                {propertytype}
                            </p>
                        </div>
                        <div style={{display:'flex',alignItems:'center',width:'calc(100% / 3)',justifyContent:'space-around'}}>
                            <p style={{color:'blue',fontSize:24,fontWeight:'bolder'}}>
                                קומה
                            </p>
                            <p>
                                {floor ? floor:`קרקע`}
                            </p>
                        </div>
                        <div style={{display:'flex',alignItems:'center',width:'calc(100% / 3)',justifyContent:'space-around'}}>
                            <p style={{color:'blue',fontSize:24,fontWeight:'bolder'}}>
                                גודל
                            </p>
                            <p>
                                {`${metres} מ"ר`}
                            </p>
                        </div>
                    </div>
   
                </Grid>
                <Grid style={{padding:20,height:320,display:'flex',flexDirection:'column'}} item xs={12} sm={6}>
                    {/* property agent contact */}
                    <Grid style={{display:'flex',justifyContent:'flex-start'}} item xs={6}>
                        <p style={{padding:10,fontSize:18,borderRadius:100,backgroundColor:'teal',color:'white'}}>ליצירת קשר</p>
                    </Grid>
                    <Grid style={{display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}} item xs={6}>
                        <p style={{fontSize:16}}>{`נכס מספר`}</p>
                        <p style={{fontSize:20}}>{` #${custom_id}`}</p>
                    </Grid>
                    {
                        agentName ?
                        <Grid item xs={12} style={{paddingTop:20}}>
                            <Grid container>
                                <Grid item xs={6} style={{display:'flex',flexDirection:'row',alignItems:'center',border:'1px dashed black'}}>
                                    <BsPeopleCircle size={36} style={{paddingLeft:20,paddingRight:10}}/>
                                    <Grid container>
                                        <Grid item xs={12}>{`שם הסוכן - ${agentName}`}</Grid>
                                        <Grid item xs={12}>{agentPhone}</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>: null
                    }
                    
                    <Grid item xs={12}>
                        <Grid container style={{padding:30}}>
                            <Grid item xs={6}>
                                <Input
                                    placeholder="שם מלא"
                                    id="outlined-margin-dense"
                                    margin="dense"
                                    variant="outlined"
                                    value={leadModalData.full_name}
                                    onChange={
                                        e => setLeadModalData({...leadModalData,full_name:e.currentTarget.value})
                                    }
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Input
                                    endAdornment={
                                        <InputAdornment position={'start'}>
                                            <IoMdPhonePortrait/>
                                        </InputAdornment>
                                    }
                                    placeholder="נייד"
                                    id="outlined-margin-dense"
                                    margin="dense"
                                    variant="outlined"
                                    value={leadModalData.phone}
                                    onChange={
                                        e => setLeadModalData({...leadModalData,phone:e.currentTarget.value})
                                    }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center'
                    }}>

                                <p onClick={
                                        () => setLeadModalData({
                                            ...leadModalData,
                                            type:LeadTypes.MeetingRequest,
                                            attributes:{
                                                agent_id:agentId,
                                                kala_property_id:selectedProperty,
                                            }
                                        })
                                    } style={{cursor:'pointer',padding:10,fontSize:18,borderRadius:100,backgroundColor:'white',color:'blue',border:'1px solid black',textAlign:'center'}}>קבע פגישה</p>
                                <p style={{fontsize:24}}>או</p>
                                <p onClick={
                                        () => setLeadModalData({
                                            ...leadModalData,
                                            type:LeadTypes.WannaHearMore,
                                            attributes:{
                                                agent_id:agentId,
                                                kala_property_id:selectedProperty,
                                            }
                                        })
                                    } style={{cursor:'pointer',padding:10,fontSize:18,borderRadius:100,backgroundColor:'blue',color:'white',border:'1px solid black',textAlign:'center'}}>רוצה לשמוע עוד</p>

                    </Grid>
                </Grid>
                <Grid container >
                    {/* property details */}
                    <Grid item xs={12} style={{paddingBottom:30}}>
                        <p style={{textAlign:'center',fontSize:26,fontWeight:'bold'}}>מפרט הדירה</p>
                    </Grid>
                    <Grid container>
                    {
                        airconditioner?.length &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaFan  size={20}/>
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מיזוג ${airconditioner[0]}`}</p>
                        </Grid>
                    }
                    {
                        boiler &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FiSun size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${boiler}`}</p>
                        </Grid>
                    }
                    {
                        shower &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaShower size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מקלחון`}</p>
                        </Grid>
                    }
                    {
                        bathtub &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaBath size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`אמבטיה`}</p>
                        </Grid>
                    }
                    {
                        structure &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaBuilding size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מבנה ${structure}`}</p>
                        </Grid>
                    }
                    {
                        parking &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaParking size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${parking}`}</p>
                        </Grid>
                    }
                    {
                        warehouse &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaWarehouse size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מחסן`}</p>
                        </Grid>
                    }
                    {
                        garden &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <GiFireFlower size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גינה`}</p>
                        </Grid>
                    }
                    {
                        accessibility &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FaAccessibleIcon size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גישה לנכים`}</p>
                        </Grid>
                    }
                    {
                        saferoom &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <FcSafe size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`ממ"ד`}</p>
                        </Grid>
                    }
                    {
                        bars &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <GiWindowBars size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`סורגים`}</p>
                        </Grid>
                    }
                    {
                        nets &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <AiOutlineTable size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`חלונות מרושתים`}</p>
                        </Grid>
                    }
                    {
                        electricshutters &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <GiWindow size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`תריסים חשמליים`}</p>
                        </Grid>
                    }
                    {
                        parentsunit &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <RiParentLine size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`יחידת הורים`}</p>
                        </Grid>
                    }
                    {
                        stairs > 0 &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <GiStairs size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${stairs} מדרגות עד לפתח הדירה`}</p>
                        </Grid>
                    }
                    {
                        landscape &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <RiLandscapeLine size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`נוף ${landscape}`}</p>
                        </Grid>
                    }
                    {
                        terrace &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <IoIosHome size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מרפסת`}</p>
                        </Grid>
                    }
                    {
                        elevator &&
                        <Grid style={MifratItemStyle} item xs={4}>
                            <GrElevator size={20} />
                            <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מעלית`}</p>
                        </Grid>
                    }
                    </Grid>
                </Grid>
                <Grid container direction='row'>
                    <Grid item style={{padding:20,minHeight:320}} xs={12} sm={6}>
                        {/* property financial */}
                        <Grid container style={{height:'100%',display:'flex',flexDirection:'colum',justifyContent:'center'}}>
                            <Grid item xs={6} style={{paddingBottom:15}}>
                                <p>ועד בית</p>
                            </Grid>
                            <Grid item xs={6} style={{paddingBottom:15,textAlign:'left'}}>
                                <p>{`${committee? committee.toLocaleString('he-IL'): 0} ₪`}</p>
                            </Grid>
                            <Grid item xs={6} style={{paddingBottom:15}}>
                                <p>ארנונה דו חודשית</p>
                            </Grid>
                            <Grid item xs={6} style={{paddingBottom:15,textAlign:'left'}}>
                                <p>{`${tax?.toLocaleString('he-IL')} ₪`}</p>
                            </Grid>
                            {
                                price &&
                                <>
                                    <Grid item xs={6} style={{paddingBottom:15}}>
                                        <p>שכר דירה</p>
                                    </Grid>
                                    <Grid item xs={6} style={{paddingBottom:15,textAlign:'left'}}>
                                        <p>{`${price.toLocaleString('he-IL')} ₪`}</p>
                                    </Grid> 
                                </>
                            }
                            
                            <Grid item xs={6} style={{paddingBottom:15}}>
                                <p>דרישות בחוזה</p>
                            </Grid>
                            <Grid item xs={6} style={{paddingBottom:15,textAlign:'left'}}>
                                <p>{requirements || `ללא`}</p>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid style={{padding:20,minHeight:320}} item xs={12} sm={6}>
                        {/* property location */}
                        <LocationMap lat={mapInfo.lat} lon={mapInfo.lon}/>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                {
                    alternatives.length ?
                    <p style={{color:'blue',fontSize:30,textAlign:'center',margin:'auto'}}>נכסים נוספים העשויים להתאים לך</p>
                    :
                    <p style={{color:'red',fontSize:30,textAlign:'center',margin:'auto'}}>לא נמצאו נכסים דומים</p>
                }
                </Grid> 

                <Grid item xs={12}>
                    {/* alternative properties */}
                    <div style={{display:'flex',overflow:'auto'}}>
                    {
                        alternatives.map(p => <PropertyView key={p.id} property={p} isAlternative/>)
                    }
                    </div>
                </Grid>
                <Grid item xs={12}>
                    {/* contact us */}
                </Grid>
            </Grid>
        </Modal>
    )
}