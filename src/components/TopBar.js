import React, { useState } from 'react'
import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { AccountCircleOutlined, TuneOutlined, Hotel, LocationCity, FavoriteBorder, Sync, Weekend } from '@material-ui/icons';
import { MySelect } from './MySelect';
import {useGlobalState, setGlobalState} from '../globalState';
import { IoIosConstruct } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaShekelSign } from 'react-icons/fa';
import { getProperties } from '../dataHandler'
import StyledMenu from './StyledMenu'
import {Range} from 'rc-slider';
import {constants, renovationTypes, range, furnitureTypes, devices} from './Utilities'
import { NeighborhoodsFilterView } from './NeighborhoodFilterView';
import WindowedSelect from "react-windowed-select";
import 'rc-slider/assets/index.css';

const customSelectStyles = {
    option: (provided, state) => { return({
      ...provided,
      direction:'rtl',
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 10,
      fontSize: state.value?.includes(',') ? 14:18,
      fontWeight: state.value?.includes(',') ? null:'bolder'
    })},
    control: (provided, state) => ({
        ...provided,
        // none of react-select's styles are passed to <Control />
        borderBottom:'2px solid orangered',
        borderTop:0,
        borderLeft:0,
        borderRight:0,
        color:'black',
        fontFamily:'Assistant',
        fontWeight:'bold'
    }),
/*     multiValue: (provided, state)  => ({
        ...provided,
        backgroundColor:'black',
        display:'flex',

    }), */

 /*    valueContainer: (provided, state)  => {
        return({
            ...provided,
            backgroundColor:'yellow',
            display:'flex',
        })

    }, */
    indicatorSeparator: () => ({
        display:'none'
    }),
    dropdownIndicator:  (provided, state)  => ({
        ...provided,
        color:'orangered',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color:'black',
    }),
}


const TopBar = props => {

    const [addresses, setAddresses] = useGlobalState('addresses');
    const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
    const [urlOptionsJson, setUrlOptionsJson] = useGlobalState('urlOptionsJson');
    const [sideBarVisible, setSideBarVisible] = useGlobalState('sideBarVisible');
    const [filters, setFilters] = useGlobalState('filters');
    const [neighborhoodSelected,setNeighborhoodSelected] = useState([])
    const [device] = useGlobalState('device')

    const [propertiesData,setPropertiesData] = useGlobalState('properties')

    const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

    if (!addresses.length){
        return null
    }
    
    const {currentFilterName} = currentFilter
    const {currentFilterElement} = currentFilter

    const setProperties = (val) => setGlobalState('properties',val)
    const setIsLoading = (val) => setGlobalState('loading',val)

    
 /*    const submitNewFilter = (filterName,filterValue) => {

        switch(filterName){
          case ('budget'):{
                
            const from = {
                name:"page_attributes[price][0]",
                value:filterValue[0]
            }

            const to = {
                name:"page_attributes[price][1]",
                value:filterValue[1]
            }
    
            setUrlOptionsJson({...urlOptionsJson,price:[from,to]})
            fetchProperties({...urlOptionsJson,price:[from,to]})
            break
          }
          case ('rooms'):{
            let _range = range(filterValue[0],filterValue[1],.5)
    
            let range_array = []
    
            for (let i=0;i<_range.length;i++){
              range_array.push({
                name:"page_attributes[rooms][]",
                value:_range[i]
              })
            }
    
            setUrlOptionsJson({...urlOptionsJson,rooms:range_array})
            fetchProperties({...urlOptionsJson,rooms:range_array})
            break
          }
          case ('renovation'):{
            let _range = range(filterValue[0],filterValue[1],1)
    
            let range_array = []
    
            for (let i=0;i<_range.length;i++){
              range_array.push({
                name:"page_attributes[renovation][]",
                value:_range[i]
              })
            }
    
            setUrlOptionsJson({...urlOptionsJson,renovation:range_array})
            fetchProperties({...urlOptionsJson,renovation:range_array})
            break
          }
          case ('addresses'):{
    
            let range_array = []
            console.log('setting addresses to '+filterValue)
            for (let i=0;i<filterValue?.length;i++){
              if (filterValue[i].includes(','))
                range_array.push({
                  name:"page_attributes[street_name][]",
                  value:filterValue[i].split(', ')[1]
                })
              else
                range_array.push({
                  name:"page_attributes[neighborhood_name][]",
                  value:filterValue[i]
                })
            }
            setUrlOptionsJson({...urlOptionsJson,addresses:range_array})
            fetchProperties({...urlOptionsJson,addresses:range_array})
            break
          }
          case ('furniture'):{
            let _range = range(filterValue[0],filterValue[1],1)
            console.log(_range)
            let range_array = []
    
            for (let i of _range){
              range_array.push({
                name:"page_attributes[furniture][]",
                value:furnitureTypes[i]
              })
            }
    
            setUrlOptionsJson({...urlOptionsJson,furniture:range_array})
            fetchProperties({...urlOptionsJson,furniture:range_array})
            break
          }
        }
      }
 */


    const submitNewFilter = (filterName,filterValue) => {
        switch(filterName){
            case ('budget'):{
                let dataFiltered = propertiesData.dataFiltered.filter(prop => ((filterValue[0] <= prop.attributes.price) && (prop.attributes.price <= filterValue[1])) )
                console.log(dataFiltered.length)
                setUrlOptionsJson({...urlOptionsJson,price:[filterValue[0],filterValue[1]]})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('rooms'):{
                let dataFiltered = propertiesData.dataFiltered.filter(prop => ((filterValue[0] <= prop.attributes.rooms) && (prop.attributes.rooms <= filterValue[1])) )
                console.log(dataFiltered.length)
                setUrlOptionsJson({...urlOptionsJson,rooms:[filterValue[0],filterValue[1]]})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('renovation'):{
                let dataFiltered = propertiesData.dataFiltered.filter(prop => ((filterValue[0] <= prop.attributes.renovation) && (prop.attributes.renovation <= filterValue[1])) )
                console.log(dataFiltered.length)
                setUrlOptionsJson({...urlOptionsJson,renovation:[filterValue[0],filterValue[1]]})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('address'):{
                let dataFiltered = propertiesData.data.filter(prop => prop.title.includes(filterValue || '') )
                setUrlOptionsJson({})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('addresses'):{
                let dataFiltered = propertiesData.dataFiltered.filter(prop => filterValue.some(addr => prop.title.includes(addr)) )
                setUrlOptionsJson({...urlOptionsJson,addresses:filters.addresses})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            /* case ('furniture'):{
                let dataFiltered = propertiesData.data.filter(prop => ((filterValue[0] <= prop.attributes.price) && (prop.attributes.price <= filterValue[1])) )
                console.log(dataFiltered.length)
                setUrlOptionsJson({...urlOptionsJson,price:[filterValue[0],filterValue[1]]})
                setPropertiesData({...propertiesData,dataFiltered})
                break
            } */
        }
    }

    const fetchProperties = async (options={}) => {

        setIsLoading(true)
        /* scrollToTop() */
        const data = await getProperties(options)
        const _properites = data.payload

        setProperties({data:_properites,currentCount:_properites.length})
        setIsLoading(false)

    }

    const removeFilter = (filterName) => {
        switch(filterName){
            case ('budget'):{
                let dataFiltered = propertiesData.data.filter(prop => 1000 <= prop.attributes.price <= 30000 )
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('rooms'):{
                let dataFiltered = propertiesData.data.filter(prop => 1 <= prop.attributes.rooms <= 20 )
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('renovation'):{
                let dataFiltered = propertiesData.data.filter(prop => 1 <= prop.attributes.renovation <= 4 )
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('addresses'):{
                let dataFiltered = propertiesData.data
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('address'):{
                let dataFiltered = propertiesData.data
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
            case ('furniture'):{
                let dataFiltered = propertiesData.data.filter(prop => 1000 <= prop.attributes.price <= 30000 )
                setPropertiesData({...propertiesData,dataFiltered})
                break
            }
        }
    }
    

    const handleClickFilter = (event) => {
        setCurrentFilter({currentFilterName:event.currentTarget.id,currentFilterElement:event.currentTarget})
    };

    const handleCloseFilter = () => setCurrentFilter({currentFilterName:'',currentFilterElement:null})

    console.log(filters)
    return (
        <div
            style={{
                border:'2px solid grey',
                backgroundColor:'white',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                flexWrap:'wrap',
                padding:'20px',
                marginBottom:'20px'
            }}>


            {
                device == devices.Desktop &&
                <IconButton onClick={() => {window.open('http://109.207.78.24/app',"_self")}}>
                    <AccountCircleOutlined/>
                </IconButton>
            }

            
            <div style={{width:'180px'}}>
                <WindowedSelect
                    styles={customSelectStyles}
                    isClearable={true}
                    isRtl={true}
                    isMulti={false}
                    getOptionValue={e => e}
                    getOptionLabel={e => e}
                    options={addresses}
                    placeholder="חפש לפי כתובת"
                    value={[filters.address]}
                    onCl
                    onChange={e => {console.log(e);setFilters({...filters,address:e});submitNewFilter('address',e)}}
                />
            </div>

            {
                device == devices.Desktop &&

                <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',padding:'0px 20px'}}>

                    <div id='budget' style={{}}  onClick={e => handleClickFilter(e)}
                    style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',height:36,borderBottom:'2px solid orangered',position:'relative',marginLeft:5}}>
                        <>
                            <FaShekelSign style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>תקציב</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>              
                        {
                            urlOptionsJson.price?.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,price:[]});removeFilter('budget');e.stopPropagation()} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div id='rooms' onClick={e => handleClickFilter(e)}
                        style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginLeft:5}}>
                        <>
                            <Hotel style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>חדרים</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>
                        {
                            urlOptionsJson.rooms?.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,rooms:[]});removeFilter('rooms');e.stopPropagation()} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div id='renovation'  onClick={e => handleClickFilter(e)}
                        style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginLeft:5}}>
                        <>
                            <IoIosConstruct style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>רמת שיפוץ</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>
                        {
                            urlOptionsJson.renovation?.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,renovation:[]});removeFilter('renovation');e.stopPropagation()} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div id='addresses' onClick={e => handleClickFilter(e)}
                        style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginLeft:5}}>
                        <>
                            <LocationCity style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>שכונות</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>
                        {
                            urlOptionsJson.addresses?.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,addresses:[]});removeFilter('addresses');setFilters({...filters,addresses:[]});e.stopPropagation()} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div id='furniture' onClick={e => handleClickFilter(e)}
                        style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative'}}>
                        <>
                            <Weekend style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>ריהוט</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>
                        {
                            urlOptionsJson.furniture?.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,furniture:[]});removeFilter('furniture');e.stopPropagation()} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                </div>
            }
            
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',marginLeft:10}} onClick={(e) => {/* setSideBarVisible(true) */}}>
                <TuneOutlined/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem'}}>סננים נוספים</span>
            </div>

            <div onClick={() =>  {
                setUrlOptionsJson({});
                let dataFiltered = propertiesData.data.filter(prop => prop.isFavourite );
                setPropertiesData({...propertiesData,dataFiltered})
            }}
             style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid orangered',borderRadius:10,padding:'6px',marginLeft:10,backgroundColor:'orangered',color:'white',cursor:'pointer'}}>
                <FavoriteBorder/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
            </div>

            {
                device == devices.Desktop &&
                <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid orangered',borderRadius:10,padding:'6px',cursor:'pointer'}} onClick={() => {}}>
                    <Sync/>
                    <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',color:'orangered'}}>רענן חיפוש </span>
                </div>
            }


            <StyledMenu
                anchorEl={currentFilterElement}
                open={Boolean(currentFilterElement)}
                onClose={() => handleCloseFilter()}
            >
                {
                currentFilterName == 'budget' ?
                <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                    <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                        <div style={{padding:20}}>
                            <Range
                                step={50}
                                min={1500}
                                max={constants.MaxPrice}
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
                                    min: 1500,
                                    max: constants.MaxPrice,
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
                                    min: 1500,
                                    max: constants.MaxPrice,
                                    type: 'number',
                                }}
                                value={filters.budgetTo}
                                startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                            />
                        </div>
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {submitNewFilter('budget',[filters.budgetFrom,filters.budgetTo]);handleCloseFilter()}} 
                                style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() } 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>:
                currentFilterName == 'rooms' ?
                <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                    <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                        <div style={{padding:20}}>
                            <Range
                                step={.5}
                                min={1}
                                max={constants.MaxRooms}
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
                                    min: 1,
                                    max: constants.MaxRooms,
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
                                    min: 1,
                                    max: constants.MaxRooms,
                                    type: 'number',
                                }}
                                value={filters.roomsTo}
                                startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                            />
                        </div>
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {submitNewFilter('rooms',[filters.roomsFrom,filters.roomsTo]);handleCloseFilter()}} 
                            style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                            color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() } 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>:
                currentFilterName == "renovation" ?
                <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
                    <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
                        <div style={{padding:20}}>
                            <Range
                                step={1}
                                min={1}
                                max={constants.MaxRenovation}
                                onChange={(newVal) => setFilters({...filters,renovationFrom:newVal[0],renovationTo:newVal[1]})}
                                value={[filters.renovationFrom,filters.renovationTo]}
                                reverse
                                tipFormatter={val => val}
                                dots={true}
                                marks={renovationTypes}
                                allowCross={false}
                            />
                        </div>
                        
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {submitNewFilter('renovation',[filters.renovationFrom,filters.renovationTo]);handleCloseFilter()}} 
                            style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                            color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() } 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>:
                currentFilterName == "addresses" ?
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
                    
                    <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                        <div onClick={() => {
                            let newVal = new Set(filters.addresses.concat(neighborhoodSelected))

                            setFilters({...filters,addresses: [...newVal]});
                            submitNewFilter('addresses',filters.addresses.concat(neighborhoodSelected))
                            handleCloseFilter()
                        }} 
                            style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                            color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => {handleCloseFilter();setNeighborhoodSelected([]) }} 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>
                :
                currentFilterName == "furniture" ?
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
                        
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {submitNewFilter('furniture',[filters.furnitureFrom,filters.furnitureTo]);handleCloseFilter()}} 
                            style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
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


export default TopBar