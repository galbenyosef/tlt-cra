import {Grid, Hidden} from "@material-ui/core";
import {colors} from "../colors";
import {AiFillPhone, AiOutlineYoutube} from "react-icons/ai";
import {BsEnvelope} from "react-icons/bs";
import {
  FaFacebookF,
  FaGooglePlusG,
  FaHeart,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaFilter
} from "react-icons/fa";
import smallLogo from "../assets/YellowLogoSideTextTrans_TLT.png";
import {IoLogoWhatsapp} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";
import React from "react";
import {setGlobalState, useGlobalState} from "../globalState";
import {setProperties} from "../dataHandler";
import DropDownTree from "./DropDownTree";
import {Link} from "react-router-dom";


export default () => {

  const [city] = useGlobalState('city')
  const [filters,setFilters] = useGlobalState('filters')
  const [isFavouritesView,setIsFavouriteView] = useGlobalState('isFavouritesView')
  const setFiltersModal = (val) => setFilters({...filters,modalOpened:val})
  const [properties] = useGlobalState('properties')
  const openSideMenu = () => setGlobalState('sideMenuOpened',true)

  let filteredCount = 0

  for (let property of properties){
    property.isFiltered && ++filteredCount
  }

  return (
    <>
    <Grid container direction={'row'} style={{backgroundColor:colors.darkblue,width:'100%'}}>
      <Hidden only={'xs'}>
        <Grid item sm={7}>
          <div style={{display:'flex',justifyContent:'center'}}>
            <div style={{display:'flex',padding:10,alignItems:'center'}}>
              <a  rel="noopener noreferrer" target="_blank" href={'tel:0543338879'}><AiFillPhone/></a>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-333-8879</p>
            </div>
            <div style={{display:'flex',padding:10,alignItems:'center'}}>
              <a rel="noopener noreferrer" target="_blank" href={'mailto:tlthaifa@gmail.com'}><BsEnvelope/></a>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>tlthaifa@gmail.com</p>
            </div>
            <div style={{display:'flex',padding:10,alignItems:'center'}}>
              <a  rel="noopener noreferrer" target="_blank" href={'https://wa.me/0543338879'}><FaWhatsapp/></a>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-333-8879</p>
            </div>
          </div>
        </Grid>
      </Hidden>
      {

        <Grid item xs={12} sm={5}>
          <div style={{display:'flex',justifyContent:'center'}}>
            <a rel="noopener noreferrer"   target="_blank" href={'https://www.facebook.com/groups/TLTisrael/'}><FaFacebookF style={{padding:10}}/></a>
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
      zIndex:3,
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
        <Hidden xsDown>
          <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
            <Link to={'/'} style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>ראשי</Link>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>לקוחות ממליצים</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>בעלי המשרד</p>
            <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>צור קשר</p>
          </div>
          <div style={{display:'flex',alignItems:'center'}}>
            <div style={{display:'flex',backgroundColor:colors.darkblue,padding:10,marginRight:10}}>
              <a rel="noopener noreferrer" target="_blank" href={'https://wa.me/0543338879'} style={{whiteSpace:'nowrap',textAlign:'center',fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>שלח הודעה בוואטספ</a>
              <IoLogoWhatsapp style={{color:'greenlime',paddingRight:10}}/>
            </div>
          </div>
        </Hidden>
        <Hidden smUp>
          <div>
            <GiHamburgerMenu  onClick={()=>{console.log('menu clicked');openSideMenu()}} size={40}/>
          </div>
        </Hidden>
      </div>
      {
        city &&
        <Hidden smUp>
          <div style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
            <DropDownTree/>
            <div style={{display:'flex',alignItems:'center',width:150,justifyContent:'space-evenly'}}>
              {
                filters.modalOpened ?
                  <FaFilter color={'forestgreen'} onClick={() => setFiltersModal(false)} size={30} />
                  :
                  <FaFilter onClick={() => setFiltersModal(true)} size={30} color={'black'} />
              }
              <div onClick={() =>  {
                if (isFavouritesView){
                  setProperties(properties => {
                    let newProperties = [...properties]
                    for (let property of newProperties){
                      property.isFiltered = true
                    }
                    setIsFavouriteView(false)
                    return newProperties
                  })
                }
                else{
                  setProperties(properties => {
                    let favourites = JSON.parse(localStorage.getItem('favourites')) || []
                    let newProperties = [...properties]
                    for (let property of newProperties){
                      property.isFiltered = favourites.includes(property.id);
                    }
                    setIsFavouriteView(true)
                    return newProperties})
                }
              }}>


              {
                isFavouritesView ?
                  <FaHeart size={30} color={'red'}  />
                  :
                  <FaHeart size={30}  />
              }
              </div>
            </div>
          </div>
        </Hidden>
      }
    </Grid>
    </>
  )
}