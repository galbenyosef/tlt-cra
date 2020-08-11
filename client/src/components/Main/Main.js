
import React, {Suspense, useEffect, useState} from 'react'
import Layout from '../Layout'
import {useGlobalState,setGlobalState} from '../../globalState'
import { getProperties} from '../../apiHandler'
import FiltersBar from './FiltersBar';
import { PropertyModal } from '../PropertyModal/PropertyModal';
import {devices, getValueByDevice} from '../Utilities'
import { LeadModal } from '../PropertyModal/LeadModal';
import { SideFilters } from '../SideFilters';
import {Grid, Hidden} from '@material-ui/core';
import {AiFillPhone,AiOutlineYoutube} from 'react-icons/ai'
import {BsEnvelope} from 'react-icons/bs'
import {GiHamburgerMenu} from 'react-icons/gi'
import {
  FaSearch,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaGooglePlusG,
  FaInstagram,
  FaPhoneAlt,
  FaRegHandPointer,
  FaHeart
} from 'react-icons/fa'
import {IoLogoWhatsapp} from 'react-icons/io'
import {MainSpinner} from "./MainSpinner";
import smallLogo from '../../assets/YellowLogoSideTextTrans_TLT.png'
import bigLogo from '../../assets/YellowLogoTrans_TLT.png'
import Only_Text from '../../assets/old/Only_Text_Trans.png'
import {aboutUsText} from "./aboutUsText";
import {filterProperties, onPropertyClicked} from "../../dataHandler";
import {colors} from "../../colors";
import {MediaModal} from "../PropertyList/MediaModal";
import {MapModal} from "../PropertyModal/MapModal";
import {FiltersModal} from "../FiltersModal";
import {NewPropertyModal} from "../NewPropertyModal";

const PropertyList = React.lazy(() => import('../PropertyList/PropertyList'));


const scrollToBottom = element => element?.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });

const resize = () => {
  const setDevice = (val) => setGlobalState('device',val)

  if (window.innerWidth < 600)
    setDevice(devices.Mobile)
  else if (window.innerWidth < 1280)
    setDevice(devices.Tablet)
  else
    setDevice(devices.Desktop)
}

const fetchProperties = async (city) => {

  const setProperties = (val) => setGlobalState('properties',val)
  const setAddresses = (val) => setGlobalState('addresses',val)
  const setNeighborhoods = (val) => setGlobalState('neighborhoods',val)
  const setPropertiesNumbers = (val) => setGlobalState('propertiesNumbers',val)

  const data = await getProperties(city)

  const properties = data.sort(({created:createdA},{created:createdB}) => createdB - createdA)

  let addressesMap = {}
  let propertiesNumbers = []

  let favouritesString = localStorage.getItem('favourites')
  let favourites = favouritesString && JSON.parse(favouritesString) || []

  for (let property of properties){
    let {
      neighborhood_name,
      street_name
    } = property

    property.isFiltered = true
    if (favourites && favourites.includes(property.id))
      property.isFavourite = true
    if (!addressesMap[neighborhood_name])
      addressesMap[neighborhood_name] = []
    if (!addressesMap[neighborhood_name].includes(street_name))
      addressesMap[neighborhood_name].push(street_name)

    if (property.custom_id)
      propertiesNumbers.push(property.custom_id + '')

  }

  let addresses = []
  let neighborhoods = Object.keys(addressesMap).sort()
  for (let i=0; i<neighborhoods.length;i++){
    addresses.push(neighborhoods[i])
    for (let j=0;j<addressesMap[neighborhoods[i]].sort().length;j++){
      addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
    }
  }

  setNeighborhoods(neighborhoods)
  setAddresses(addresses)
  setProperties(properties)
  setPropertiesNumbers(propertiesNumbers)

}


const Root = () => {

  const [city,setCity] = useGlobalState('city')
  const [isLoading] = useGlobalState('loading')
  const setIsLoading = (val) => setGlobalState('loading',val)
  const [filters,setFilters] = useGlobalState('filters')
  const setProperties = (val) => setGlobalState('properties',val)
  const [isFavouritesView] = useGlobalState('isFavouritesView')
  const setFiltersModal = (val) => setFilters({...filters,modalOpened:val})
  const {modalOpened:filtersModalOpened} = filters

  const onCityClick = async city => {
    setIsLoading(true)
    setCity(city)
    await fetchProperties(city)
    setIsLoading(false)
  }

  const showSingleProperty = async (propertyId) => {

    setIsLoading(true)
    let property = await onPropertyClicked(propertyId)
    console.log(property)
    let {city_id:city,custom_id} = property
    setCity(city)
    await fetchProperties(city)

    setFilters({...filters,propertyNumber:custom_id,addresses:[],addressesActive:0,address:''})
    setProperties(
      properties => {
        let selectedProperty = filterProperties(properties,{...filters,propertyNumber:custom_id,addresses:[],addressesActive:0,address:''})
        if (selectedProperty.length){
          return selectedProperty.map(prop => prop.custom_id == custom_id ? ({...prop,isCollapsedOut:true}) : prop)
        }
      }
    )
    setIsLoading(false)

  }

  useEffect(() => {

    window.addEventListener("resize",() => resize());
    let isRoute = window.location.pathname.includes('/')
    let idCandidate = isRoute && window.location.pathname.split('/')[1]
    let isPropertyId = idCandidate && Number.isInteger(parseInt(idCandidate)) && idCandidate.length == 5
    let propertyId = isPropertyId && parseInt(idCandidate)
    if (propertyId){
      console.log(propertyId)

      showSingleProperty(propertyId)

    }

    resize()
  },[])

  console.log('root rendered')

  return (

    <Layout>
      <Grid container direction={'row'} style={{
        backgroundColor:colors.darkblue}}>
        <Hidden only={'xs'}>
          <Grid item sm={7}>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{display:'flex',padding:10}}>
                  <AiFillPhone/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-552-5456</p>
                </div>
                <div style={{display:'flex',padding:10}}>
                  <BsEnvelope/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>tlthaifa@gmail.com</p>
                </div>
                <div style={{display:'flex',padding:10}}>
                  <FaWhatsapp/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-552-5456</p>
                </div>
            </div>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={5}>
          <div style={{display:'flex',justifyContent:'center'}}>
              <FaFacebookF style={{padding:10}}/>
              <FaTwitter style={{padding:10}}/>
              <FaGooglePlusG style={{padding:10}}/>
              <FaInstagram style={{padding:10}}/>
              <AiOutlineYoutube style={{padding:10}}/>
          </div>
        </Grid>
      </Grid>
      <Grid container direction={'row'} style={{
        backgroundColor:'white',
        boxShadow: '0px 10px 10px 0px grey',
        position:'sticky',
        top:0,
        zIndex:2,
      }}>
        <div style={{width:'100%',
          display:'flex',
          justifyContent:'space-around',
          alignItems:'center',
          backgroundColor:'white',borderBottom:'2px solid black'}}>
          <div style={{display:'flex',alignItems:'center'}}>
            <div style={{
              width:200,
              height:80,
              backgroundImage:`url(${smallLogo})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize:'100%'
            }}/>
          </div>
          <Hidden smDown>
            <div style={{display:'flex',flexWrap:'wrap'}}>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>ראשי</p>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
              <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>צור קשר</p>
            </div>
            <div style={{display:'flex',alignItems:'center'}}>
              <div style={{display:'flex',backgroundColor:colors.darkblue,padding:10}}>
                <p style={{textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>התקשר</p>
                <FaPhoneAlt style={{paddingRight:10}}/>
              </div>
              <div style={{display:'flex',backgroundColor:colors.darkblue,padding:10,marginRight:10}}>
                <p style={{whiteSpace:'nowrap',textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>שלח לווטסאפ</p>
                <IoLogoWhatsapp style={{color:'greenlime',paddingRight:10}}/>
              </div>
            </div>
          </Hidden>
          <Hidden mdUp>
            <div>
              <GiHamburgerMenu size={40}/>
            </div>
          </Hidden>
        </div>
        {
          city &&
          <Hidden mdUp>
            <div style={{width: '100%',display:'flex',alignItems:'center',padding:'0px 10px',border:'2px solid black',borderTop:0,height:30,justifyContent:'space-between'}}>
              <span onClick={() => setFiltersModal(filtersModalOpened?false:true)} style={{cursor:'pointer',width:'100%'}}>
                {
                  filtersModalOpened ? 'סגור' : 'לחץ כאן לחיפוש מתקדם'
                }
              </span>
              {
                filtersModalOpened ?
                  <div style={{width:20}}/>:
                  <div style={{display:'flex',alignItems:'center'}}>
                    {
                      <FaSearch size={30} color={'black'} style={{paddingLeft:getValueByDevice(5,5,5)}} />
                    }
                    {
                      isFavouritesView ?
                        <FaHeart size={30} color={'red'}  />
                        :
                        <FaHeart size={30}  />
                    }
                  </div>
              }
            </div>
          </Hidden>
        }
      </Grid>
      <div style={{width:'100%',display:'flex',flexGrow:1,flexDirection:'column',justifyContent:'space-evenly',position:'relative'}}>
        {
        isLoading ? <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}><MainSpinner/></div> :
          <>
            {
              !city &&
              <div style={{margin:'0px auto',minHeight:70,display:'flex',alignItems:'center',justifyContent:'space-evenly'}}>
                <p style={{padding:'0px 10px'}}>
                  בחר עיר מבוקשת:
                </p>
                <p onClick={() => onCityClick('חיפה') } style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,marginLeft:4}}>
                  חיפה
                </p>
                <p onClick={() => onCityClick('קריות') } style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,marginLeft:4}}>
                  קריות
                </p>
                <p onClick={() => onCityClick('טירת הכרמל') } style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,marginLeft:4}}>
                  טירת הכרמל
                </p>
                <p onClick={() => onCityClick('נשר') } style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue}}>
                  נשר
                </p>
              </div>
            }
            {
              !city &&
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
                <div>
                  <div style={{
                    borderRadius:50,
                    boxShadow:'0px 0px 3px 4px grey',
                    width:300,
                    height:300,
                    backgroundImage:`url(${bigLogo})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize:'90%'
                  }}/>
                </div>
                <Hidden xsDown>
                  <div style={{flex:.1}}/>
                </Hidden>
                <div style={{maxWidth:320}}>
                  <div style={{display:'flex',flexDirection:'column'}}>
                    <div style={{
                      width:'100%',
                      height:80,
                      backgroundImage:`url(${Only_Text})`,
                      backgroundPosition: 'right',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize:'contain'
                    }}/>
                    <p style={{whiteSpace:'break-spaces',fontFamily:'Assistant'}}>
                    {aboutUsText}
                    </p>
                  </div>
                </div>
              </div>
            }
            <Hidden smDown>
              <FiltersBar/>
            </Hidden>
            <Suspense fallback={<div>Loading...</div>}>
              <PropertyList />
            </Suspense>
          </>
      }
      </div>
      <div style={{display:'flex',flexWrap:'wrap',fontFamily:'Assistant',width:'100%'}}>
        <div style={{height:60,width:'100%',display:'flex',justifyContent:'center',
          alignItems:'center',backgroundColor:colors.darkblue,position:'relative'}}>
          <p style={{padding:'0px 20px',textAlign:'center'}}>צריך עזרה? לא מוצא את הנכס שאתה מחפש? חייג עכשיו *4567 !</p>
          <div style={{bottom: -20,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: `20px solid ${colors.darkblue}`,
            position: 'absolute'}}></div>
        </div>
        <div style={{minHeight:160,padding:'30px 0px',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:'black',flexWrap:'wrap'}}>
          <div style={{color:colors.darkblue,padding:20,margin:'auto',minHeight:160,maxWidth:250,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:24}}>קצת עלינו</p>
            <p style={{fontSize:14}}>חברת תיווך ללא תיווך נוסדה בשנת 2014 ושינתה את כללי המשחק מקצה לקצה.
              מטרתנו היא להביא את החיבור הטוב ביותר בין השוכרים הפוטנציאלים לבין בעלי הנכסים.
            </p>
          </div>
          <div style={{color:colors.darkblue,margin:'auto',minWidth:350,maxWidth:800,minHeight:160,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
            <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
              <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
              <div>
                <p style={{fontSize:14}}>ראשי</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
              </div>
            </div>
            <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
              <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
              <div>
                <p style={{fontSize:14}}>ראשי</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
              </div>
            </div>
            <div style={{minHeight:160,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
              <p style={{fontSize:18,whiteSpace:'nowrap'}}>תפריט ראשי</p>
              <div>
                <p style={{fontSize:14}}>ראשי</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
                <p style={{fontSize:14}}>אודות</p>
              </div>
            </div>
          </div>
          <div style={{color:colors.darkblue,padding:20,margin:'auto',display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:14,paddingBottom:15}}>הרשם לקבלת נכסים חדשים המתאימים לך !</p>
            <input style={{margin:'auto'}} placeholder='שם מלא'/>
            <input style={{margin:'auto'}} placeholder='אימייל'/>
            <div style={{display:'flex',justifyContent:'center',alignItems:'center',margin:'auto',padding:15}}>
              <p>שלח</p>
              <FaRegHandPointer style={{paddingRight:10}}/>
            </div>

          </div>
        </div>
      </div>
      <MediaModal/>
      <MapModal/>
      <FiltersModal/>
      <NewPropertyModal/>
      <LeadModal/>
      <SideFilters/>
    </Layout>

  )
}

export default Root