import React, { useState, useEffect } from 'react'
import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { AccountCircleOutlined, TuneOutlined, Hotel, LocationCity, Sync, Weekend } from '@material-ui/icons';
import {useGlobalState, setGlobalState} from '../../globalState';
import { IoIosConstruct } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaShekelSign, FaHeart } from 'react-icons/fa';
import StyledMenu from './StyledMenu'
import {Range} from 'rc-slider';
import {constants, renovationTypes, range, furnitureTypes, devices, switchFilters, getValueByDevice} from '../Utilities'
import { NeighborhoodsFilterView } from './NeighborhoodFilterView';
import WindowedSelect from "react-windowed-select";
import 'rc-slider/assets/index.css';
import {clearFilterStyle, filterBoxStyle, searchStyle} from '../../styles';

const {
  MinPrice,
  MaxPrice,
  MinRooms,
  MaxRooms,
  MinRenovation,
  MaxRenovation,
  MinFurniture,
  MaxFurniture,
  MinMetres,
  MaxMetres,
  MinFloor,
  MaxFloor
} = constants


const filterProperties = (properties,filters) => {

  const {
    //default values
    budgetFrom,
    budgetTo,
    roomsFrom,
    roomsTo,
    renovationFrom,
    renovationTo,
    addresses,
    addressesActive,
    address,
    propertyNumber,
    furnitureFrom,
    furnitureTo,
    metresFrom,
    metresTo,
    floorFrom,
    floorTo,
  } = filters

  console.log('filters : ',filters)

  let furnitureRange = range(furnitureFrom,furnitureTo)
  let furnitureRangeText = furnitureRange.map(num => furnitureTypes[num])

  let filtered = properties
    .filter(({
               price,
               rooms,
               metres,
               floor,
               renovation,
               furniture,
             }) => {

      return (budgetFrom <= price) && (price <= budgetTo) &&
        (metresFrom <= metres) && (metres <= metresTo) &&
        (roomsFrom <= rooms) && (rooms <= roomsTo) &&
        (!floor || (floorFrom <= floor) && (floor <= floorTo)) &&
        (renovationFrom <= renovation) && (renovation <= renovationTo) &&
        (furnitureRangeText.some(text => furniture === text));

    })
  Object.keys(switchFilters).forEach(filter => {
    if (filters[filter])
      filtered = filtered.filter(prop => prop[filter])
  })

  if (addressesActive){
    filtered = filtered.filter(({neighborhood_name}) => addresses.some(addr => neighborhood_name.includes(addr)))
  }
  else if (address){
    filtered = filtered.filter(({neighborhood_name,street_name}) => {
      let [neighborhood,street] = address.split(', ')
      if (street)
        return (neighborhood_name === neighborhood && street_name === street)
      return (neighborhood_name === neighborhood)
    })
  }
  else if (propertyNumber)
    filtered = filtered.filter(({custom_id}) =>  custom_id + '' === propertyNumber)

  filtered = filtered.map(({id}) => id)

  let retval = [...properties]
  for (let property of retval){
    if (filtered.includes(property.id)){
      property.isFiltered = true
    }
    else
      property.isFiltered = false
  }
  return retval.sort(({created:createdA},{created:createdB}) => createdB - createdA)
}

const FiltersBar = () => {

  const [addressesData] = useGlobalState('addresses');
  const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
  const [filters, setFilters] = useGlobalState('filters');
  const [neighborhoodSelected,setNeighborhoodSelected] = useState([])
  const [device] = useGlobalState('device')
  const [propertiesNumbers] = useGlobalState('propertiesNumbers')
  const [inputValue,setInputValue] = useState('')

  const [isFavouritesView,setIsFavouriteView] = useGlobalState('isFavouritesView')

  const setSideFilterVisible = val => setGlobalState('sideFiltersVisible',val)

  const setProperties = val => setGlobalState('properties',val)

  const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

  const changeFilters = filters => {

    setFilters(filters)

    setProperties(
      properties => filterProperties(properties,filters)
    )
  }

  const {
    //default values
    budgetActive,
    roomsActive,
    renovationActive,
    furnitureActive,
  } = filters

  if (!addressesData.length){
    return null
  }

  console.log('render filter bar')

  const {currentFilterName} = currentFilter
  const {currentFilterElement} = currentFilter

  const handleClickFilter = (event) => {
    setCurrentFilter({currentFilterName:event.currentTarget.id,currentFilterElement:event.currentTarget})
  };

  const handleCloseFilter = () => setCurrentFilter({currentFilterName:'',currentFilterElement:null})

  return (
    <div
      style={{
        border:'2px solid grey',
        backgroundColor:'white',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between',
        alignItems:'center',
        padding:getValueByDevice(20,10,10),
        borderRadius:20,
        boxShadow:'0px 0px 10px 0px grey',
        width:'fitcontent',
        marginBottom:24
      }}>

      <p style={{fontWeight:'bolder',marginLeft:'auto',paddingBottom:10,color:'rgba(29,31,60)',textDecoration:'underline'}}>חיפוש מתקדם:</p>

      <div
        style={{
          backgroundColor:'white',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
        }}>

        {
          device === devices.Desktop &&
          <IconButton onClick={() => {window.open('http://109.207.78.24/app',"_self")}}>
            <AccountCircleOutlined/>
          </IconButton>
        }

        <div style={{width:'190px'}}>
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
            value={filters.propertyNumber ? [`נכס מספר #${filters.propertyNumber}`] : [filters.address]}
            onChange={e => {
              !Number.isInteger(parseInt(e)) ?
                changeFilters({...filters,address:e,addresses:[],addressesActive:0,propertyNumber:''})
                :
                changeFilters({...filters,propertyNumber:e,addresses:[],addressesActive:0,address:''})
            }}
          />
        </div>

        {
          device === devices.Desktop &&

          <div style={{display:'flex',justifyContent:'space-around',paddingRight:20,height:38}}>



            <div id='addresses' onClick={e => handleClickFilter(e)}
                 style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid rgba(29,31,60)',position:'relative',marginLeft:5}}>
              <>
                <LocationCity style={{paddingLeft:5}}/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>שכונות</span>
                <MdKeyboardArrowDown size={24} color='rgba(29,31,60)'/>
              </>
              {
                filters.addresses.length > 0 &&
                <div onClick={(e) => {changeFilters({...filters,addresses:[],addressesActive:0});e.stopPropagation()} }
                     style={clearFilterStyle}>X</div>
              }
            </div>

            <div id='rooms' onClick={e => handleClickFilter(e)}
                 style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid rgba(29,31,60)',position:'relative',marginLeft:5}}>
              <>
                <Hotel style={{paddingLeft:5}}/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>חדרים</span>
                <MdKeyboardArrowDown size={24} color='rgba(29,31,60)'/>
              </>
              {
                roomsActive > 0 &&
                <div onClick={(e) => {changeFilters({...filters,roomsFrom:MinRooms,roomsTo:MaxRooms,roomsActive:0});e.stopPropagation()} }
                     style={clearFilterStyle}>X</div>
              }
            </div>

            <div id='budget'  onClick={e => handleClickFilter(e)}
                 style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid rgba(29,31,60)',position:'relative',marginLeft:5}}>
              <>
                <FaShekelSign style={{paddingLeft:5}}/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>תקציב</span>
                <MdKeyboardArrowDown size={24} color='rgba(29,31,60)'/>
              </>
              {
                budgetActive > 0 &&
                <div onClick={(e) => {
                  changeFilters({...filters,budgetFrom:MinPrice,budgetTo:MaxPrice,budgetActive:0})
                  e.stopPropagation()} }
                     style={clearFilterStyle}>X</div>
              }
            </div>

            <div id='renovation'  onClick={e => handleClickFilter(e)}
                 style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid rgba(29,31,60)',position:'relative',marginLeft:5}}>
              <>
                <IoIosConstruct style={{paddingLeft:5}}/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>רמת שיפוץ</span>
                <MdKeyboardArrowDown size={24} color='rgba(29,31,60)'/>
              </>
              {
                renovationActive > 0 &&
                <div onClick={(e) => {changeFilters({...filters,renovationFrom:MinRenovation,renovationTo:MaxRenovation,renovationActive:0});e.stopPropagation()} }
                     style={clearFilterStyle}>X</div>
              }
            </div>



            <div id='furniture' onClick={e => handleClickFilter(e)}
                 style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid rgba(29,31,60)',position:'relative'}}>
              <>
                <Weekend style={{paddingLeft:5}}/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>ריהוט</span>
                <MdKeyboardArrowDown size={24} color='rgba(29,31,60)'/>
              </>
              {
                furnitureActive > 0 &&
                <div onClick={(e) => {changeFilters({...filters,furnitureFrom:MinFurniture,furnitureTo:MaxFurniture,furnitureActive:0});e.stopPropagation()} }
                     style={clearFilterStyle}>X</div>
              }
            </div>

          </div>
        }

        <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',marginLeft:10,marginRight:10}} onClick={() => {setSideFilterVisible(true)}}>
          <TuneOutlined/>
          {
            device !== devices.Mobile &&
            <span style={{fontFamily:'Assistant',fontSize:'1rem'}}>סננים נוספים</span>
          }
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
              let newProperties = [...properties]
              for (let property of newProperties){
                if (property.isFavourite)
                  property.isFiltered = true
                else
                  property.isFiltered = false
              }
              setIsFavouriteView(true)
              return newProperties})
          }
        }}
             style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid rgba(29,31,60)',borderRadius:10,padding:'6px',marginLeft:10,backgroundColor:isFavouritesView ? 'white':'rgba(29,31,60)',color:!isFavouritesView ? 'white':'rgba(29,31,60)',cursor:'pointer'}}>
          {
            isFavouritesView ?
              <FaHeart size={24} color={'red'} style={{paddingLeft:getValueByDevice(5,0,0)}} />
              :
              <FaHeart size={24} color={'white'} style={{paddingLeft:getValueByDevice(5,0,0)}} />
          }
          {
            device !== devices.Mobile &&
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
          }
        </div>

        {
          device === devices.Desktop &&
          <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid rgba(29,31,60)',borderRadius:10,padding:'6px',cursor:'pointer'}}>
            <Sync/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',color:'rgba(29,31,60)'}}>רענן חיפוש </span>
          </div>
        }
      </div>


      <StyledMenu
        anchorEl={currentFilterElement}
        open={Boolean(currentFilterElement)}
        onClose={() => handleCloseFilter()}
      >
        {
          currentFilterName === 'budget' ?
            <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
              <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                <div style={{padding:20}}>
                  <Range
                    step={50}
                    min={MinPrice}
                    max={MaxPrice}
                    onChange={(newVal) => setFilters({...filters,budgetFrom:newVal[0],budgetTo:newVal[1]})}
                    value={[filters.budgetFrom,filters.budgetTo]}
                    reverse
                    allowCross={false}
                  />
                </div>

                <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                  <Input
                    onChange={(event) => setFilters({...filters,budgetFrom:parseInt(event.currentTarget.value)})}
                    margin="dense"
                    inputProps={{
                      step: 10,
                      min: MinPrice,
                      max: MaxPrice,
                      type: 'number',
                    }}
                    value={filters.budgetFrom}
                    startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                  />
                  <Input
                    onChange={(event) => setFilters({...filters,budgetTo:parseInt(event.currentTarget.value)})}
                    margin="dense"
                    inputProps={{
                      step: 10,
                      min: MinPrice,
                      max: MaxPrice,
                      type: 'number',
                    }}
                    value={filters.budgetTo}
                    startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                  />
                </div>
                <div style={filterBoxStyle}>
                  <div onClick={() => {
                    changeFilters({...filters,budgetActive:filters.budgetActive+1});
                    handleCloseFilter()}
                  }
                       style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                         color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                  <div onClick={() => handleCloseFilter() }
                       style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                         borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                </div>
              </div>
            </div>:
            currentFilterName === 'rooms' ?
              <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                  <div style={{padding:20}}>
                    <Range
                      step={.5}
                      min={MinRooms}
                      max={MaxRooms}
                      onChange={(newVal) => setFilters({...filters,roomsFrom:newVal[0],roomsTo:newVal[1]})}
                      value={[filters.roomsFrom,filters.roomsTo]}
                      reverse
                      allowCross={false}
                    />
                  </div>

                  <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                    <Input
                      onChange={(event) => setFilters({...filters,roomsFrom:parseFloat(event.currentTarget.value)})}
                      margin="dense"
                      inputProps={{
                        step: .5,
                        min: MinRooms,
                        max: MaxRooms,
                        type: 'number',
                      }}
                      value={filters.roomsFrom}
                      startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                    />
                    <Input
                      onChange={(event) => setFilters({...filters,roomsTo:parseFloat(event.currentTarget.value)})}
                      margin="dense"
                      inputProps={{
                        step: .5,
                        min: MinRooms,
                        max: MaxRooms,
                        type: 'number',
                      }}
                      value={filters.roomsTo}
                      startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                    />
                  </div>
                  <div style={filterBoxStyle}>
                    <div onClick={() => {changeFilters({...filters,roomsActive:filters.roomsActive+1});handleCloseFilter()}}
                         style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                           color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                    <div onClick={() => handleCloseFilter() }
                         style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                           borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                  </div>
                </div>
              </div>:
              currentFilterName === "renovation" ?
                <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                  <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                    <div style={{padding:20}}>
                      <Range
                        step={1}
                        min={MinRenovation}
                        max={MaxRenovation}
                        onChange={(newVal) => setFilters({...filters,renovationFrom:newVal[0],renovationTo:newVal[1]})}
                        value={[filters.renovationFrom,filters.renovationTo]}
                        reverse
                        tipFormatter={val => val}
                        dots={true}
                        marks={renovationTypes}
                        allowCross={false}
                      />
                    </div>

                    <div style={filterBoxStyle}>
                      <div onClick={() => {changeFilters({...filters,renovationActive:filters.renovationActive+1});handleCloseFilter()}}
                           style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                             color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                      <div onClick={() => handleCloseFilter() }
                           style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                             borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                    </div>
                  </div>
                </div>:
                currentFilterName === "addresses" ?
                  <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                    <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap',overflow:'hidden'}}>
                      <div style={{padding:20}}>
                        <div style={{width:'100%'}}>
                          <Input
                            onChange={e => setAddressSearch(e.currentTarget.value)}
                            value={addressSearch}
                            placeholder="חיפוש שכונה">
                          </Input>
                        </div>
                      </div>

                      <div style={{display:'flex',flexDirection:'column',width:'100%',overflow:'auto',flexWrap:'wrap',height:'150px'}}>
                        <NeighborhoodsFilterView neighborhoodSelected={neighborhoodSelected} setNeighborhoodSelected={setNeighborhoodSelected}/>
                      </div>

                      <div style={filterBoxStyle}>
                        <div onClick={() => {
                          let newVal = new Set(filters.addresses.concat(neighborhoodSelected))
                          changeFilters({...filters,addresses: [...newVal],addressesActive:filters.addressesActive+1,address:''});
                          handleCloseFilter()
                        }}
                             style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                               color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                        <div onClick={() => {handleCloseFilter();setNeighborhoodSelected([]) }}
                             style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                               borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                      </div>
                    </div>
                  </div>
                  :
                  currentFilterName === "furniture" ?
                    <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                      <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                        <div style={{padding:20}}>
                          <Range
                            step={1}
                            min={1}
                            max={3}
                            onChange={(newVal) => setFilters({...filters,furnitureFrom:newVal[0],furnitureTo:newVal[1]})}
                            value={[filters.furnitureFrom,filters.furnitureTo]}
                            reverse
                            tipFormatter={val => val}
                            dots={true}
                            marks={{
                              1: 'ללא ריהוט',
                              2: 'ריהוט חלקי',
                              3: 'ריהוט מלא',
                            }}
                            allowCross={true}
                          />
                        </div>

                        <div style={filterBoxStyle}>
                          <div onClick={() => {changeFilters({...filters,furnitureActive:filters.furnitureActive+1});handleCloseFilter()}}
                               style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                 color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                          <div onClick={() => handleCloseFilter() }
                               style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                 borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                      </div>
                    </div>:
                    currentFilterName === 'metres' ?
                      <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                        <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                          <div style={{padding:20}}>
                            <Range
                              step={1}
                              min={MinMetres}
                              max={MaxMetres}
                              onChange={(newVal) => setFilters({...filters,metresFrom:newVal[0],metresTo:newVal[1]})}
                              value={[filters.metresFrom,filters.metresTo]}
                              reverse
                              allowCross={false}
                            />
                          </div>

                          <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                            <Input
                              onChange={(event) => setFilters({...filters,metresFrom:parseInt(event.currentTarget.value)})}
                              margin="dense"
                              inputProps={{
                                step: 1,
                                min: MinMetres,
                                max: MaxMetres,
                                type: 'number',
                              }}
                              value={filters.metresFrom}
                              startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                            />
                            <Input
                              onChange={(event) => setFilters({...filters,metresTo:parseInt(event.currentTarget.value)})}
                              margin="dense"
                              inputProps={{
                                step: 1,
                                min: MinMetres,
                                max: MaxMetres,
                                type: 'number',
                              }}
                              value={filters.metresTo}
                              startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                            />
                          </div>
                          <div style={filterBoxStyle}>
                            <div onClick={() => {
                              changeFilters({...filters,metresActive:filters.metresActive+1});
                              handleCloseFilter()}
                            }
                                 style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                   color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() }
                                 style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                   borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                          </div>
                        </div>
                      </div>:
                      currentFilterName === 'floor' ?
                        <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                          <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                            <div style={{padding:20}}>
                              <Range
                                step={1}
                                min={MinFloor}
                                max={MaxFloor}
                                onChange={(newVal) => setFilters({...filters,floorFrom:newVal[0],floorTo:newVal[1]})}
                                value={[filters.floorFrom,filters.floorTo]}
                                reverse
                                allowCross={false}
                              />
                            </div>

                            <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                              <Input
                                onChange={(event) => setFilters({...filters,floorFrom:parseInt(event.currentTarget.value)})}
                                margin="dense"
                                inputProps={{
                                  step: 1,
                                  min: MinFloor,
                                  max: MaxFloor,
                                  type: 'number',
                                }}
                                value={filters.floorFrom}
                                startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                              />
                              <Input
                                onChange={(event) => setFilters({...filters,floorTo:parseInt(event.currentTarget.value)})}
                                margin="dense"
                                inputProps={{
                                  step: 1,
                                  min: MinFloor,
                                  max: MaxFloor,
                                  type: 'number',
                                }}
                                value={filters.floorTo}
                                startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                              />
                            </div>
                            <div style={filterBoxStyle}>
                              <div onClick={() => {
                                changeFilters({...filters,floorActive:filters.floorActive+1});
                                handleCloseFilter()}
                              }
                                   style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                     color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                              <div onClick={() => handleCloseFilter() }
                                   style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                     borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                            </div>
                          </div>
                        </div>:
                        null
        }
      </StyledMenu>
    </div>
  )
}

export default FiltersBar