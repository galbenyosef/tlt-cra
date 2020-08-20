import React, {Suspense, useEffect} from 'react'
import Layout from '../Layout'
import {useGlobalState, setGlobalState} from '../../globalState'
import { SideFilters } from '../SideFilters';
import {Hidden} from '@material-ui/core';
import {MainSpinner} from "./MainSpinner";
import bigLogo from '../../assets/YellowLogoTrans_TLT.png'
import Only_Text from '../../assets/old/Only_Text_Trans.png'
import {aboutUsText} from "./aboutUsText";
import {onCityClick, resize, showSingleProperty} from "../../dataHandler";
import {colors} from "../../colors";
import Header from "../Header";
import Footer from "../Footer";
import Modals from "../Modals";
import FiltersBar from "../FiltersBar";
import moment from "moment-timezone";


const PropertyList = React.lazy(() => import('../PropertyList/PropertyList'));


const CitySelection = () => {

  const [city] = useGlobalState('city')

  if (city)
    return null
  return(
    <div style={{margin:'0px auto',minHeight:70,display:'flex',alignItems:'center',justifyContent:'space-evenly',flexWrap:'wrap'}}>
      <p style={{padding:'0px 10px',width:'100%'}}>
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
  )
}

const AboutUs = () => {

  const [city] = useGlobalState('city')

  if (city)
    return null
  return(
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
  )
}

const Main = ({id}) => {

  const [isLoading] = useGlobalState('loading')
  const setHeaderHeight = val => setGlobalState('headerHeight',val)

  const handleScroll = (e) => setHeaderHeight(118 - (e.currentTarget.scrollY > 36 ? 36 : e.currentTarget.scrollY))

  useEffect(() => {
    window.addEventListener("resize",resize);
    window.addEventListener('scroll',handleScroll)

    if (id)
      showSingleProperty(id)

    resize()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
    }
  },[])

  console.log('root rendered')
  return (

    <Layout>
      <Header/>
      <div style={{width:'100%',display:'flex',flexGrow:1,flexDirection:'column',justifyContent:'space-evenly',position:'relative'}}>
          {
          isLoading ?
              <MainSpinner/> :
            <div style={{display:'flex',flexDirection:'column'}}>
              <CitySelection/>
              <AboutUs/>
              <Hidden mdDown>
                <FiltersBar/>
              </Hidden>
              <Suspense fallback={<div>Loading...</div>}>
                <PropertyList />
              </Suspense>
            </div>
          }
      </div>
      <Footer/>
      <Modals/>
      <SideFilters/>
    </Layout>

  )
}

export default Main