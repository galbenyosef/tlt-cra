import React, { useState } from 'react'
import { IconButton } from '@material-ui/core';
import { AccountCircleOutlined, TuneOutlined, Hotel, Sync, Weekend } from '@material-ui/icons';
import {useGlobalState, setGlobalState} from '../globalState';
import {IoIosConstruct, IoIosResize} from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaShekelSign, FaHeart } from 'react-icons/fa';
import {constants, getValueByDevice} from './Utilities'
import WindowedSelect from "react-windowed-select";
import {clearFilterStyle, searchStyle} from '../styles';
import {colors} from "../colors";
import {changeFilters, setProperties} from "../dataHandler";

const {
  MinPrice,
  MaxPrice,
  MinRooms,
  MaxRooms,
  MinFloor,
  MaxFloor,
  MinMetres,
  MaxMetres
} = constants

const singleFilterStyle = {
  display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:`2px solid ${colors.darkblue}`,position:'relative'
}

const FiltersBar = () => {

  const [addressesData] = useGlobalState('addresses');
  const [filters] = useGlobalState('filters');
  const [propertiesNumbers] = useGlobalState('propertiesNumbers')
  const [inputValue,setInputValue] = useState('')

  const [isFavouritesView,setIsFavouriteView] = useGlobalState('isFavouritesView')

  const setProperties = val => setGlobalState('properties',val)

  const setCurrentFilter = val => setGlobalState('currentFilter',val);

  const {
    //default values
    budgetActive,
    roomsActive,
    renovationActive,
    furnitureActive,
    floorActive,
    metresActive,
    attributesActive
  } = filters

  if (!addressesData.length){
    return null
  }

  console.log('render filter bar')

  const handleClickFilter = (event) => {
    setCurrentFilter({currentFilterName:event.currentTarget.id,currentFilterElement:event.currentTarget})
  };

  return (
    <div
      style={{
        border:'2px solid grey',
        backgroundColor:'white',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        borderRadius:20,
        boxShadow:'0px 0px 10px 0px grey',
        width:'fit-content',
        alignSelf:'center',
        margin:'24px 0px'
      }}>

      <div
        style={{
          backgroundColor:'white',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
        }}>


        <IconButton onClick={() => {window.open('http://109.207.78.24/app',"_self")}}>
          <AccountCircleOutlined/>
        </IconButton>


        <div style={{display:'flex',justifyContent:'space-around',width:1000,height:38}}>

          <div style={{width:'200px'}}>
            <WindowedSelect
              styles={searchStyle}
              isClearable={true}
              isRtl={true}
              isMulti={false}
              getOptionValue={e => e}
              getOptionLabel={e => Number.isInteger(parseInt(inputValue)) ? `נכס מספר #${e}`:e}
              inputValue={inputValue}
              onInputChange={e => setInputValue(e)}
              options={Number.isInteger(parseInt(inputValue)) ? propertiesNumbers : addressesData}
              placeholder="הקש כתובת/ מספר נכס"
              value={filters.propertyNumber.length ? [`נכס מספר #${filters.propertyNumber[0]}`] : [filters.address[0]]}
              onChange={e => {
                console.log(e)
                !Number.isInteger(parseInt(e)) ?
                  changeFilters({address:e ? [e] : [],addresses:[],addressesActive:0,propertyNumber:[]})
                  :
                  changeFilters({propertyNumber:e ? [e] : [],addresses:[],addressesActive:0,address:''})
              }}
            />
          </div>

          <div id='rooms' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>
            <Hotel style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>חדרים</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              roomsActive > 0 &&
              <div onClick={(e) => {changeFilters({roomsFrom:MinRooms,roomsTo:MaxRooms,roomsActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='budget' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>
            <FaShekelSign style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>תקציב</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              budgetActive > 0 &&
              <div onClick={(e) => {
                changeFilters({budgetFrom:MinPrice,budgetTo:MaxPrice,budgetActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='renovation' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>

          <IoIosConstruct style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>רמת שיפוץ</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              renovationActive > 0 &&
              <div onClick={(e) => {changeFilters({renovations:[],renovationActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='furniture' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>

          <Weekend style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>ריהוט</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              furnitureActive > 0 &&
              <div onClick={(e) => {changeFilters({furnitureTypes: [],furnitureActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='floor' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>

          <IoIosResize style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>קומה</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              floorActive > 0 &&
              <div onClick={(e) => {
                changeFilters({floorFrom:MinFloor,floorTo:MaxFloor,floorActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='metres' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>

          <IoIosResize style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>גודל במ"ר</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              metresActive > 0 &&
              <div onClick={(e) => {
                changeFilters({metresFrom:MinMetres,metresTo:MaxMetres,metresActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='attributes' onClick={e => handleClickFilter(e)} style={singleFilterStyle}>

          <IoIosResize style={{paddingLeft:5}}/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>מאפיינים</span>
            <MdKeyboardArrowDown size={24} color={colors.darkblue}/>
            {
              attributesActive > 0 &&
              <div onClick={(e) => {
                changeFilters({attributesActive:0,attributes:{}})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

        </div>

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
        }}
             style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:`2px solid ${colors.darkblue}`,borderRadius:10,padding:'6px',marginLeft:10,backgroundColor:isFavouritesView ? 'white':colors.darkblue,color:!isFavouritesView ? 'white':colors.darkblue,cursor:'pointer'}}>
          {
            isFavouritesView ?
              <FaHeart size={24} color={'red'} style={{paddingLeft:getValueByDevice(5,0,0)}} />
              :
              <FaHeart size={24} color={'white'} style={{paddingLeft:getValueByDevice(5,0,0)}} />
          }
          {
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
          }
        </div>

      </div>

    </div>
  )
}

export default FiltersBar