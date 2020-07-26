import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import {useGlobalState,setGlobalState} from '../../globalState'
import { getProperties} from '../../dataHandler'
import FiltersBar from './FiltersBar';
import { PropertyList } from '../PropertyList/PropertyList';
import { PropertyModal } from '../PropertyModal/PropertyModal';
import { devices } from '../Utilities'
import { LeadModal } from '../PropertyModal/LeadModal';
import { SideFilters } from '../SideFilters';
import Logo_NOTEXT from '../../assets/Logo_NOTEXT.png'
import Logo_Trans from '../../assets/Logo_TLT_Trans.png'
import Only_Text from '../../assets/Only_Text_Trans.png'

import {Grid, Hidden} from '@material-ui/core';
import { aboutUsText, aboutUsDetailedText } from './aboutUsText';
import {AiFillPhone,AiOutlineYoutube} from 'react-icons/ai'
import {BsEnvelope} from 'react-icons/bs'
import {GiHamburgerMenu} from 'react-icons/gi'
import {FaWhatsapp,FaFacebookF,FaTwitter,FaGooglePlusG,FaInstagram,FaPhoneAlt,FaRegHandPointer} from 'react-icons/fa'
import {IoLogoWhatsapp} from 'react-icons/io'
import {MainSpinner} from "./MainSpinner";

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

const fetchProperties = () => {

  const setIsLoading = (val) => setGlobalState('loading',val)
  const setProperties = (val) => setGlobalState('properties',val)
  const setAddresses = (val) => setGlobalState('addresses',val)
  const setAddressesMap = (val) => setGlobalState('neighborhoods',val)

  setIsLoading(true)

  getProperties()
    .then(data => {
      const properties = data.sort(({created:createdA},{created:createdB}) => createdB - createdA)

      let addressesMap = {}

      for (let i=0; i<properties.length;i++){
        let {
          neighborhood_name,
          street_name
        } = properties[i]

        if (!addressesMap[neighborhood_name])
          addressesMap[neighborhood_name] = []
        if (!addressesMap[neighborhood_name].includes(street_name))
          addressesMap[neighborhood_name].push(street_name)
      }

      let addresses = []
      let neighborhoods = Object.keys(addressesMap).sort()
      for (let i=0; i<neighborhoods.length;i++){
        addresses.push(neighborhoods[i])
        for (let j=0;j<addressesMap[neighborhoods[i]].sort().length;j++){
          addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
        }
      }

      setAddressesMap(neighborhoods)
      setAddresses(addresses)
      let favouritesString = localStorage.getItem('favourites')
      let favourites = JSON.parse(favouritesString) || []
      setProperties({data:properties,dataFiltered:properties,favourites})
    })
    .catch(e => console.log(e))
    .then(() => {
      setIsLoading(false)
    })
}

const Root = () => {

  const setProperty = (val) => setGlobalState('selectedProperty',val)
  const [isLoading] = useGlobalState('loading')

  useEffect(() => {
    fetchProperties()

    window.addEventListener("resize",() => resize());
    if (window.location.pathname.includes('/') && window.location.pathname.length > 1 && Number.isInteger(parseInt(window.location.pathname.split('/')[1]))){
      console.log(window.location.pathname.split('/')[1])
      setProperty(window.location.pathname.split('/')[1])
    }

    resize()
  },[])

  console.log('root rendered')

  return (

    <Layout>
      <Grid container direction={'row'} style={{width:'100%',
        backgroundColor:'rgb(29,31,60)'}}>
        <Hidden only={'xs'}>
          <Grid item sm={7}>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{display:'flex',padding:10}}>
                  <AiFillPhone style={{color:'yellow'}}/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10,color:'white'}}>054-552-5456</p>
                </div>
                <div style={{display:'flex',padding:10}}>
                  <BsEnvelope style={{color:'yellow'}}/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10,color:'white'}}>tlthaifa@gmail.com</p>
                </div>
                <div style={{display:'flex',padding:10}}>
                  <FaWhatsapp style={{color:'yellow'}}/>
                  <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10,color:'white'}}>054-552-5456</p>
                </div>
            </div>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={5}>
          <div style={{display:'flex',justifyContent:'center'}}>
              <FaFacebookF style={{padding:10,color:'white'}}/>
              <FaTwitter style={{padding:10,color:'white'}}/>
              <FaGooglePlusG style={{padding:10,color:'white'}}/>
              <FaInstagram style={{padding:10,color:'white'}}/>
              <AiOutlineYoutube style={{padding:10,color:'white'}}/>
          </div>
        </Grid>
      </Grid>
      <Grid container direction={'row'} style={{
        width:'100%',
        display:'flex',
        justifyContent:'space-around',
        flexWrap:'nowrap',
        alignItems:'center',
        backgroundColor:'white',
        boxShadow: '0px 10px 10px 0px grey',
        position:'sticky',
        top:0,
        zIndex:2,
      }}>
        <div style={{display:'flex',alignItems:'center'}}>
          <div style={{
            width:100,
            height:80,
            backgroundImage:`url(${Logo_NOTEXT})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize:'100%'
          }}/>
          <div style={{display:'flex',flexDirection:'column',paddingRight:10}}>
            <p style={{whiteSpace:'nowrap',fontSize:22,fontWeight:'bolder',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>TLT - תיווך ללא תיווך</p>
            <p style={{whiteSpace:'nowrap',textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>דירות להשכרה ללא תיווך</p>
          </div>
        </div>
        <Hidden smDown>
          <div style={{display:'flex',flexWrap:'wrap'}}>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>ראשי</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>אודות</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>אודות</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>אודות</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>אודות</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant',color:'rgb(29,31,60)'}}>צור קשר</p>
          </div>
          <div style={{display:'flex',alignItems:'center'}}>
            <div style={{display:'flex',backgroundColor:'rgb(29,31,60)',padding:10}}>
              <p style={{color:'white',textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>התקשר</p>
              <FaPhoneAlt style={{color:'white',paddingRight:10}}/>
            </div>
            <div style={{display:'flex',backgroundColor:'rgb(29,31,60)',padding:10,marginRight:10}}>
              <p style={{whiteSpace:'nowrap',color:'white',textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>שלח לווטסאפ</p>
              <IoLogoWhatsapp style={{color:'white',paddingRight:10}}/>
            </div>
          </div>
        </Hidden>
        <Hidden mdUp>
          <div>
            <GiHamburgerMenu size={40}/>
          </div>
        </Hidden>
      </Grid>
      {
        isLoading ? <div style={{display:'flex',alignItems:'center',minHeight:'calc(100vh - 116px - 320px)'}}><MainSpinner/></div> :
          <>
            <div style={{display:'flex',paddingBottom:30,alignItems:'center',marginTop:100,justifyContent:'space-evenly'}}>
              <p style={{padding:'0px 10px'}}>
                בחר איזור חיפוש:
              </p>
              <p style={{padding:'0px 10px',cursor:'pointer',borderLeft:'1px solid black'}}>
                חיפה
              </p>
              <p style={{padding:'0px 10px',cursor:'pointer',borderLeft:'1px solid black'}}>
                קריות
              </p>
              <p style={{padding:'0px 10px',cursor:'pointer',borderLeft:'1px solid black'}}>
                טירת הכרמל
              </p>
              <p style={{padding:'0px 10px',cursor:'pointer'}}>
                נשר
              </p>
            </div>
            <FiltersBar/>
            <PropertyList/>
          </>
      }

      <div style={{display:'flex',flexWrap:'wrap',fontFamily:'Assistant',color:'white',width:'100%'}}>
        <div style={{height:60,width:'100%',display:'flex',justifyContent:'center',
          alignItems:'center',backgroundColor:'rgb(29,31,60)',position:'relative'}}>
          <p style={{padding:'0px 20px',textAlign:'center'}}>צריך עזרה? לא מוצא את הנכס שאתה מחפש? חייג עכשיו *4567 !</p>
          <div style={{bottom: -20,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '20px solid rgb(29,31,60)',
            position: 'absolute'}}></div>
        </div>
        <div style={{minHeight:160,padding:'30px 0px',width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',backgroundColor:'black',flexWrap:'wrap'}}>
          <div style={{padding:20,margin:'auto',minHeight:160,maxWidth:250,display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
            <p style={{fontSize:24}}>קצת עלינו</p>
            <p style={{fontSize:14}}>חברת תיווך ללא תיווך נוסדה בשנת 2014 ושינתה את כללי המשחק מקצה לקצה.
              מטרתנו היא להביא את החיבור הטוב ביותר בין השוכרים הפוטנציאלים לבין בעלי הנכסים.
            </p>
          </div>
          <div style={{padding:20,margin:'auto',minWidth:350,maxWidth:800,minHeight:160,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
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
          <div style={{padding:20,margin:'auto',display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
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
      <PropertyModal/>
      <LeadModal/>
      <SideFilters/>
    </Layout>

  )
}

export default Root