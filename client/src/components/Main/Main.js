import React from 'react'
import {Hidden} from '@material-ui/core';
import bigLogo from '../../assets/YellowLogoTrans_TLT.png'
import Only_Text from '../../assets/old/Only_Text_Trans.png'
import {aboutUsText} from "./aboutUsText";
import {colors} from "../../colors";
import {Link} from "react-router-dom";

export const CitySelection = () => {

  return(
    <div style={{margin:'0px auto',minHeight:70,display:'flex',alignItems:'center',justifyContent:'space-evenly',flexWrap:'wrap',marginRight:'auto',marginLeft:'auto',marginTop:10,marginBottom:30}}>
      <p style={{padding:'0px 10px',width:'100%'}}>
        בחר עיר מבוקשת:
      </p>
      <Link to={'/חיפה'} style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,margin:6}}>
        חיפה
      </Link>
      <Link to={'/קריות'} style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,margin:6}}>
        קריות
      </Link>
      <Link to={'/טירת הכרמל'}style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,margin:6}}>
        טירת הכרמל
      </Link>
      <Link to={'/נשר'} style={{padding:'0px 8px',cursor:'pointer',backgroundColor:colors.darkblue,margin:6}}>
        נשר
      </Link>
    </div>
  )
}

const AboutUs = () => {

  return(
    <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
      <div>
        <div style={{
          borderRadius:50,
          boxShadow:'0px 0px 3px 4px grey',
          width:250,
          height:250,
          backgroundImage:`url(${bigLogo})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize:'90%'
        }}/>
      </div>
      <Hidden xsDown>
        <div style={{flex:.1}}/>
      </Hidden>
      <div style={{maxWidth:470}}>
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{
            width:'100%',
            height:50,
            backgroundImage:`url(${Only_Text})`,
            backgroundPosition: 'center',
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

const Main = () => {

  console.log('main rendered ')
  return (

    <div style={{width:'100%',display:'flex',flexGrow:1,flexDirection:'column',justifyContent:'space-evenly',position:'relative'}}>
      <div style={{display:'flex',flexDirection:'column'}}>
        <CitySelection/>
        <AboutUs/>
      </div>
    </div>

  )
}

export default Main