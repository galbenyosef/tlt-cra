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
  FaWhatsapp,
  FaFilter
} from "react-icons/fa";
import smallLogo from "../assets/YellowLogoSideTextTrans_TLT.png";
import {IoLogoWhatsapp} from "react-icons/io";
import {GiHamburgerMenu} from "react-icons/gi";
import {getValueByDevice} from "./Utilities";
import React, {useRef, useState} from "react";
import {useGlobalState} from "../globalState";
import {changeFilters, setProperties} from "../dataHandler";
import WindowedSelect, { components } from "react-windowed-select";
import {newSearchStyle} from "../styles";

const customFilterOption = (option, rawInput) => {
  const words = rawInput.split(' ');
  return words.reduce(
    (acc, cur) => acc && option.label.toLowerCase().includes(cur.toLowerCase()),
    true,
  );
};

export default () => {

  const [city] = useGlobalState('city')
  const [filters,setFilters] = useGlobalState('filters')
  const [isFavouritesView,setIsFavouriteView] = useGlobalState('isFavouritesView')
  const setFiltersModal = (val) => setFilters({...filters,modalOpened:val})
  const {modalOpened:filtersModalOpened} = filters
  const [addressesData] = useGlobalState('addresses');
  const selectRef = useRef(0)
  const [inputValue,setInputValue] = useState('')
  const {address} = filters
  const [propertiesNumbers] = useGlobalState('propertiesNumbers')
  const [properties] = useGlobalState('properties')

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
            <div style={{display:'flex',padding:10}}>
              <AiFillPhone/>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-333-8879</p>
            </div>
            <div style={{display:'flex',padding:10}}>
              <BsEnvelope/>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>tlthaifa@gmail.com</p>
            </div>
            <div style={{display:'flex',padding:10}}>
              <FaWhatsapp/>
              <p style={{fontFamily:'Assistant',whiteSpace:'nowrap',fontSize:12,paddingRight:10}}>054-333-8879</p>
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
            <GiHamburgerMenu onClick={()=>console.log('menu clicked')} size={40}/>
          </div>
        </Hidden>
      </div>
      {
        city &&
        <Hidden lgUp>
          <div style={{width:'100%',display:'flex'}}>
            <WindowedSelect
              filterOption={customFilterOption}
              styles={newSearchStyle}
              ref={selectRef}
              isClearable={true}
              isRtl={true}
              closeMenuOnSelect={false}
              isMulti={false}
              menuIsOpen={!!inputValue}
              openMenuOnFocus={false}
              openMenuOnClick={true}
              getOptionValue={e => e}
              getOptionLabel={e => e}
              inputValue={inputValue}
              components={{ SingleValue: () => <div>{`מוצגים ${filteredCount} פריטים`}</div>}}
              onInputChange={e => setInputValue(e)}
              options={Number.isInteger(parseInt(inputValue)) ? propertiesNumbers : addressesData}
              placeholder="הקש כתובת/ מספר נכס"
              value={filters.propertyNumber.length ? [`נכס מספר #${filters.propertyNumber[0]}`] : [filters.address[0]]}
              onChange={e => {
                console.log(e)
                if (!e)
                  changeFilters({address:[],addresses:[],addressesActive:0,propertyNumber:[]})
                else if(!Number.isInteger(parseInt(e))){
                  if (address.includes(e))
                    changeFilters({address:address.filter(addr => addr !== e),addresses:[],addressesActive:0,propertyNumber:[]})
                  else
                    changeFilters({address:address.concat(e),addresses:[],addressesActive:0,propertyNumber:[]})
                }
                else{
                  changeFilters({propertyNumber:e ? [e] : [],addresses:[],addressesActive:0,address:''})
                }
              }}
            />
            <div style={{display:'flex',alignItems:'center',width:150,justifyContent:'space-evenly'}}>
              {
                <FaFilter onClick={() => setFiltersModal(filtersModalOpened?false:true)} size={30} color={'black'} />
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
                      if (favourites.includes(property.id))
                        property.isFiltered = true
                      else
                        property.isFiltered = false
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