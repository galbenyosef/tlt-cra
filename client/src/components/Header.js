import {Grid, Hidden} from "@material-ui/core";
import {colors} from "../colors";
import {AiFillPhone, AiOutlineYoutube} from "react-icons/ai";
import {BsEnvelope} from "react-icons/bs";
import {
  FaFacebookF,
  FaGooglePlusG,
  FaHeart,
  FaInstagram,
  FaPhoneAlt,
  FaSearch,
  FaTwitter,
  FaWhatsapp
} from "react-icons/fa";
import smallLogo from "../assets/YellowLogoSideTextTrans_TLT.png";
import {IoLogoWhatsapp} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";
import {getValueByDevice} from "./Utilities";
import React from "react";
import {useGlobalState} from "../globalState";

export default () => {

  const [city] = useGlobalState('city')
  const [filters,setFilters] = useGlobalState('filters')
  const [isFavouritesView] = useGlobalState('isFavouritesView')
  const setFiltersModal = (val) => setFilters({...filters,modalOpened:val})
  const {modalOpened:filtersModalOpened} = filters

  return (
    <>
    <Grid container direction={'row'} style={{backgroundColor:colors.darkblue,width:'100%'}}>
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
      {

        <Grid item xs={12} sm={5}>
          <div style={{display:'flex',justifyContent:'center'}}>
            <FaFacebookF style={{padding:10}}/>
            <FaTwitter style={{padding:10}}/>
            <FaGooglePlusG style={{padding:10}}/>
            <FaInstagram style={{padding:10}}/>
            <AiOutlineYoutube style={{padding:10}}/>
          </div>
        </Grid>
      }
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
    </>
  )
}