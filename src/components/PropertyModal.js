import React, { useEffect, useState, useRef, createRef } from 'react'
import { Modal,Grid, TextField, makeStyles, Input, InputAdornment } from '@material-ui/core'
import { KeyboardArrowLeft,KeyboardArrowRight, PlayCircleOutlineOutlined } from '@material-ui/icons'
import { getGlobalState, useGlobalState, setGlobalState } from '../globalState'
import { getProperty, getUser, getCoordinates, createLead } from '../dataHandler'
import { PropertyModalLoading } from './PropertyModalLoading'
import { renovationTypes, devices, LeadTypes, getScreenshot, getValueByDevice } from './Utilities'
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
import { LocationMap } from './Map'
import ReactPlayer from 'react-player'
import ImageGallery from 'react-image-gallery';
import "./image-gallery.css";

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
    const [tabSelected,setTabSelected] = React.useState(Tabs.Info)
    const [data,setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [currentImageIndex,setCurrentImageIndex] = useState(0)
    const [mapInfo,setMapInfo] = useState({
        lat:'',
        lon:'',
    })

    const setAllMediaModalOpened = val => setGlobalState('allMediaModal',val)
    const setSingleMediaModalOpened = val => setGlobalState('singleMediaModal',val)
    const [leadModalData,setLeadModalData] = useGlobalState('newLeadModal')

    const [videoImage,setVideoImage] = useState(null)

    const fetchProperty = async (id) => {

        setLoading(true)

        try{
            const _data = await getProperty(id)

            //agent exists
            if (_data.payload.attributes.agent_member_id){
                const agentId = _data.payload.attributes.agent_member_id
                const agentData = await getUser(agentId)

                const {
                    city_id,
                    street_name,
                    neighborhood_name
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
                console.log(coords)
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

        }

        setLoading(false)
    }


    useEffect(() => {

        if (selectedProperty)
            fetchProperty(selectedProperty)

        return () => {
            setCurrentImageIndex(0)
        }
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
        thumbnail:`https://tlt.kala-crm.co.il/${image}`
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
                maxWidth: '90%',
                top: '50%',
                transform: 'translate(50%, -50%)',
                position: 'absolute',
               maxHeight:'100vh'}} >
                {/* back button */}
                <Grid xs={12} item style={{backgroundColor:'white',padding:15,display:'flex'}}>
                    <p style={{cursor:'pointer'}} onClick={() => setSelectedProperty(null)}>חזור</p>
                </Grid>
                {/* main view */}
                <Grid item xs={12} style={{backgroundColor:'white',overflow:'auto',maxHeight:devices.Mobile ? 'calc(100vh - 91px)':'calc(100vh - 51px - 60px)'}}>
                    <Grid container direction='row'>
                        <Grid item md={1} xs={false}/>
                        {/* right */}
                        <Grid item md={4} xs={12} style={{paddingLeft:10,paddingRight:10}} >
                            <Grid container direction='row'  style={{border:'1px solid black',padding:20}}>
                                <Grid item xs={7} style={{paddingBottom:20}}>
                                    <p style={{fontSize:24,fontWeight:'bold',paddingBottom:5}}>{street_name}</p>
                                    <p style={{paddingBottom:12}}>{neighborhood_name + ', ' +city_id}</p>
                                    <p style={{fontSize:18,fontWeight:100,paddingBottom:5,whiteSpace:'nowrap'}}>{propertytype + ' ' + renovationTypes[renovation]}</p>
                                </Grid>
                                <Grid item xs={5}>
                                    {
                                        price &&
                                        <p style={{textAlign:'end',fontSize:26,fontWeight:'bold'}}>{`${price.toLocaleString('he-IL')} ₪`}</p>
                                    }
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container style={{paddingBottom:15}}>
                                        <Grid item xs={4} style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><FaBed size={32} style={{paddingLeft:10}}/><p>{`${rooms} חדרים`}</p></Grid>
                                        <Grid item xs={4} style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><GiResize size={32} style={{paddingLeft:10}}/><p>{`${metres} מ"ר ${terrace?`+ מרפסת`:``}`}</p></Grid>
                                        <Grid item xs={4} style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}}><FaBuilding size={32} style={{paddingLeft:10}}/><p>{`${floor ? `קומה ${floor} (${elevator ? `עם מעלית`:`ללא מעלית`})`:`קומת קרקע`}`}</p></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container style={{border:'1px dashed black',padding:20}}>
                                <Grid style={{display:'flex',justifyContent:'flex-start'}} item xs={6}>
                                    <p style={{padding:10,fontSize:18,borderRadius:100,backgroundColor:'teal',color:'white'}}>ליצירת קשר</p>
                                </Grid>
                                <Grid style={{display:'flex',flexDirection:'row',justifyContent:'space-around',alignItems:'center'}} item xs={6}>
                                    <p style={{fontSize:16}}>{`נכס מספר`}</p>
                                    <p style={{fontSize:20}}>{` #${custom_id}`}</p>
                                </Grid>
                                <Grid item xs={12} style={{paddingTop:20}}>
                                    <Grid container>
                                        <Grid item xs={6} style={{display:'flex',flexDirection:'row',alignItems:'center',border:'1px dashed black'}}>
                                            <BsPeopleCircle size={36} style={{paddingLeft:20,paddingRight:10}}/>
                                            <Grid container>
                                                <Grid item xs={12}>{agentName}</Grid>
                                                <Grid item xs={12}>{agentPhone}</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
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
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={1}>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <p onClick={
                                                    () => setLeadModalData({
                                                        ...leadModalData,
                                                        type:LeadTypes.MeetingRequest,
                                                        attributes:{
                                                            agent_id:agentId,
                                                            kala_property_id:selectedProperty,
                                                        }
                                                    })
                                                } style={{cursor:'pointer',padding:10,fontSize:18,borderRadius:100,backgroundColor:'white',color:'teal',border:'1px solid black',textAlign:'center'}}>קבע פגישה</p>
                                        </Grid>
                                        <Grid item xs={2} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                            <p style={{fontsize:24}}>או</p>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <p onClick={
                                                    () => setLeadModalData({
                                                        ...leadModalData,
                                                        type:LeadTypes.WannaHearMore,
                                                        attributes:{
                                                            agent_id:agentId,
                                                            kala_property_id:selectedProperty,
                                                        }
                                                    })
                                                } style={{cursor:'pointer',padding:10,fontSize:18,borderRadius:100,backgroundColor:'limegreen',color:'white',border:'1px solid black',textAlign:'center'}}>רוצה לשמוע עוד</p>
                                        </Grid>
                                        <Grid item xs={1}>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* left */}
                        <Grid item md={6} xs={12}>
                            <Grid container style={{paddingLeft:10,paddingRight:10}}>
                                {/* images */}
                                <ImageGallery thumbnailPosition={'left'} infinite showIndex showBullets isRTL items={propertyImages} />;
                                {/*
                                    propertyImages.length &&
                                    <Grid item xs={12}>
                                        <Grid container>
                                            <Grid onClick={() => setSingleMediaModalOpened(propertyImages[currentImageIndex])} item md={video__url ? 8:12} xs={12} style={{
                                                backgroundImage:`url(https://tlt.kala-crm.co.il/${propertyImages[currentImageIndex]})`,
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize:'cover',
                                                position:'relative',
                                                minHeight:'220px',
                                                maxHeight:'360px'
                                            }}>
                                            <div style={{display:'flex',position:'absolute',top:'calc(50% - 35px)',direction:'ltr',left:0}}>
                                                <KeyboardArrowLeft style={{margin:'20px 20px',border:'1px solid white',borderRadius:'100vh',color:'white',cursor:'pointer'}} 
                                                    onClick={(e) => {
                                                        let nextImageIndex = currentImageIndex-1
                                                        if (nextImageIndex < 0)
                                                            nextImageIndex = propertyImages.length-1
                                                        setCurrentImageIndex(nextImageIndex)
                                                        e.stopPropagation()
                                                    }}
                                                />
                                            </div>
                                            <div style={{display:'flex',position:'absolute',bottom:'35px',direction:'ltr',left:0,right:0,justifyContent:'center',color:'white',fontWeight:'bolder'}}>
                                                <p>{`${currentImageIndex+1}/${propertyImages.length}`}</p>
                                            </div>
                                            <div style={{display:'flex',position:'absolute',top:'calc(50% - 35px)',direction:'ltr',right:0}}>
                                                <KeyboardArrowRight style={{margin:'20px 20px',border:'1px solid white',borderRadius:'100vh',color:'white',cursor:'pointer'}}
                                                    onClick={(e) => {
                                                        let nextImageIndex = currentImageIndex+1
                                                        if (nextImageIndex > propertyImages.length-1)
                                                            nextImageIndex = 0
                                                        setCurrentImageIndex(nextImageIndex)
                                                        e.stopPropagation()
                                                    }} 
                                                />
                                            </div> 
                                            </Grid>
                                            {
                                                video__url &&
                                                <Grid item md={4} xs={12} style={{minHeight:120,maxHeight:220}}>
                                                    <Grid container style={{height:'100%'}}>
                                                        <Grid item xs={12} md={12} onClick={video__url ? () => setSingleMediaModalOpened(video__url) : () => {}} style={{
                                                            height:getValueByDevice('100%','100%','100%'),
                                                            position:'relative',
                                                            overflow:'hidden'
                                                        }}>
                                                            <ReactPlayer controls={false} width={'100%'} height={'auto'} style={{maxHeight:getValueByDevice(180,280)}}
                                                                url={`https://tlt.kala-crm.co.il/${video__url}`}>
                                                            </ReactPlayer>
                                                            <div style={{
                                                                    position: 'absolute',
                                                                    top: '40%',
                                                                    right: 0,
                                                                    left: 0,
                                                                    textAlign: 'center',
                                                                    fontWeight:'bolder',
                                                                    fontSize:20,
                                                                    color:'white',
                                                                    WebkitTextStrokeWidth: '1px',
                                                                    WebkitTextStrokeColor: 'black',
                                                                    cursor:'pointer',
                                                                    display:'flex',
                                                                    justifyContent:'center',
                                                                    alignItems:'center'
                                                                }}>
                                                                <PlayCircleOutlineOutlined size={40}/>
                                                                <p>{video__url ? `סיור בנכס`:`לא קיים סרטון`}</p>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            }
                                            
                                        </Grid>
                                    </Grid>
                                */}
                                {/* tab menu */}
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={4} style={{color:tabSelected == Tabs.Info ? 'white':'',backgroundColor:tabSelected == Tabs.Info ? 'grey':'lightgrey',cursor:'pointer',border:'1px solid black',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}} onClick={() => setTabSelected(Tabs.Info)}>
                                            <FcHome size={20}/>
                                            <p style={{padding:10,fontSize:20,fontWeight:'bold'}}>פרטי הנכס</p>  
                                        </Grid>
                                        <Grid item xs={4} style={{color:tabSelected == Tabs.Plan ? 'white':'',backgroundColor:tabSelected == Tabs.Plan ? 'grey':'lightgrey',cursor:'pointer',border:'1px solid black',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}} onClick={() => setTabSelected(Tabs.Plan)}>
                                            <FcWorkflow size={20}/>
                                            <p style={{padding:10,fontSize:20,fontWeight:'bold'}}>תכנית הנכס</p>
                                        </Grid>
                                        <Grid item xs={4} style={{color:tabSelected == Tabs.Location ? 'white':'',backgroundColor:tabSelected == Tabs.Location ? 'grey':'lightgrey',cursor:'pointer',border:'1px solid black',display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'center'}} onClick={() => setTabSelected(Tabs.Location)}>
                                            <FcGlobe size={20}/>
                                            <p style={{padding:10,fontSize:20,fontWeight:'bold'}}>מיקום הנכס</p> 
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Tab */}
                                <Grid item xs={12} style={{overflow:'auto',maxHeight:'400px',marginLeft:'-20px'}}>
                                <div style={{display:'flex',flexDirection:'column',backgroundColor:'lightgray',width:20,zIndex:1}}>

                                </div>
                                    {
                                        tabSelected == Tabs.Info ?
                                        <Grid container style={{padding:10,border:'1px dotted black'}}>
                                            <Grid item xs={12} style={{paddingBottom:20}}>
                                                <p style={{textAlign:'center',fontWeight:'bolder',fontSize:24}}>{`${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}`}</p>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={7}>
                                                        <Grid container>
                                                            <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={4}>
                                                                <GiBed size={20} style={{paddingLeft:10}}/>
                                                                <p>{`${rooms} חדרים`}</p>  
                                                            </Grid>
                                                            <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={8}>
                                                                <GiResize size={20} style={{paddingLeft:10}}/>
                                                                <p>{`${metres} מ"ר ${terrace?`+ מרפסת`:``}`}</p>    
                                                            </Grid>
                                                            <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={12}>
                                                                <FaBuilding size={20} style={{paddingLeft:10}}/>
                                                                <p>{`${floor ? `קומה ${floor} (${elevator ? `עם מעלית`:`ללא מעלית`})`:`קומת קרקע`}`}</p>    
                                                            </Grid>
                                                            {
                                                                airdirections &&
                                                                <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={12}>
                                                                    <GiCrossedAirFlows size={20} style={{paddingLeft:10}}/>
                                                                    <p>{`${airdirections} כיווני אוויר`}</p>    
                                                                </Grid>
                                                            }
                                                            {
                                                                bathroomamount &&
                                                                <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={6}>
                                                                    <FaBath size={20} style={{paddingLeft:10}}/>
                                                                    <p>{`${bathroomamount} חדרי רחצה`}</p>    
                                                                </Grid>
                                                            }
                                                            {
                                                                toiletamount &&
                                                                <Grid style={{paddingBottom:15,display:'flex',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}} item xs={6}>
                                                                    <FaToilet size={20} style={{paddingLeft:10}}/>
                                                                    <p>{`${toiletamount} שירותים`}</p>   
                                                                </Grid> 
                                                            }
                                                            
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Grid container>
                                                            <Grid item xs={6} style={{paddingBottom:15}}>
                                                                <p>ועד בית</p>
                                                            </Grid>
                                                            <Grid item xs={6} style={{paddingBottom:15,textAlign:'left'}}>
                                                                <p>{`${committee?.toLocaleString('he-IL')} ₪`}</p>
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
                                                                <p>{requirements}</p>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <p>{`${furniture}${furniture_items?.length ? ` - ${furniture_items.join(', ')}`:``}`}</p>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} style={{paddingTop:20}}>
                                                <Grid container>
                                                    <Grid item xs={12} style={{paddingBottom:30}}>
                                                        <p style={{textAlign:'center',fontSize:26,fontWeight:'bold'}}>מפרט הדירה</p>
                                                    </Grid>
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

                                        </Grid>
                                        :
                                        tabSelected == Tabs.Location ?
                                        <Grid container style={{padding:10,border:'1px dotted black'}}>
                                            <div style={{width:'100%',height:'350px'}} id='leaflet-container'>
                                                <LocationMap {...mapInfo}/>
                                            </div>
                                            
                                        </Grid>
                                        :
                                        null
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item md={1} xs={false}/>

                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}