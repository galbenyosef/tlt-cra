import React, { useState, useEffect } from 'react'
import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { AccountCircleOutlined, TuneOutlined, Hotel, LocationCity, FavoriteBorder, Sync, Weekend } from '@material-ui/icons';
import {useGlobalState, setGlobalState} from '../globalState';
import { IoIosConstruct } from 'react-icons/io';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaShekelSign, FaHeart } from 'react-icons/fa';
import StyledMenu from './StyledMenu'
import {Range} from 'rc-slider';
import {constants, renovationTypes, range, furnitureTypes, devices, switchFilters, getValueByDevice} from './Utilities'
import { NeighborhoodsFilterView } from './NeighborhoodFilterView';
import WindowedSelect from "react-windowed-select";
import 'rc-slider/assets/index.css';
import { FiHeart } from 'react-icons/fi';

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
    menu: (provided, state) => ({
        ...provided,
        zIndex:2
    }),
}

const xStyle = {fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}


const TopBar = props => {

    const [addressesData] = useGlobalState('addresses');
    const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
    const [filters, setFilters] = useGlobalState('filters');
    const [neighborhoodSelected,setNeighborhoodSelected] = useState([])
    const [device] = useGlobalState('device')

    const [inputValue,setInputValue] = useState('')

    const setSideFilterVisible = val => setGlobalState('sideFiltersVisible',val)

    const [propertiesData,setPropertiesData] = useGlobalState('properties')

    const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

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
        budgetActive,
        roomsActive,
        renovationActive,
        furnitureActive,
        metresActive,
        floorActive,
        terrace,
        bathtub,
        landscape,
        airconditioner,
        parking,
        boiler,
        elevator,
        warehouse,
        garden,
        accessibility,
        saferoom,
        bars,
        nets,
        electricshutters,
        parentsunit,
    } = filters

    useEffect(() => {

        console.log(filters)
        submitFilters()

    },[
        address,
        propertyNumber,
        addressesActive,
        budgetActive,
        roomsActive,
        renovationActive,
        furnitureActive,
        metresActive,
        floorActive,
        terrace,
        bathtub,
        landscape,
        airconditioner,
        parking,
        boiler,
        elevator,
        warehouse,
        garden,
        accessibility,
        saferoom,
        bars,
        nets,
        electricshutters,
        parentsunit,
    ])

    const submitFilters = () => {


        let furnitureRange = range(furnitureFrom,furnitureTo)
        let furnitureRangeText = furnitureRange.map(num => furnitureTypes[num])

        let dataFiltered = propertiesData.data
        .filter(prop => (budgetFrom <= prop.attributes.price) && (prop.attributes.price <= budgetTo))
        .filter(prop => (roomsFrom <= prop.attributes.rooms) && (prop.attributes.rooms <= roomsTo))
        .filter(prop => (metresFrom <= prop.attributes.metres) && (prop.attributes.metres <= metresTo))
        .filter(prop => (floorFrom <= prop.attributes.floor) && (prop.attributes.floor <= floorTo))
        .filter(prop => (renovationFrom <= prop.attributes.renovation) && (prop.attributes.renovation <= renovationTo))
        .filter(prop => furnitureRangeText.some(text => prop.attributes.furniture == text)  )
        
        Object.keys(switchFilters).forEach(filter => {
            if (filters[filter])
                dataFiltered = dataFiltered.filter(prop => prop.attributes[filter])
        })

        if (addressesActive){
            dataFiltered = dataFiltered.filter(prop => addresses.some(addr => prop.title.includes(addr)))
        }
        else if (address){
            dataFiltered = dataFiltered.filter(prop => prop.title.includes(address))
        }
        else if (propertyNumber)
            dataFiltered = dataFiltered.filter(prop => prop.attributes.custom_id + '' == propertyNumber)

        setPropertiesData({...propertiesData,dataFiltered})
  
    }

    if (!addressesData.length || !propertiesData.data.length){
        return null
    }

    const {currentFilterName} = currentFilter
    const {currentFilterElement} = currentFilter

    const handleClickFilter = (event) => {
        setCurrentFilter({currentFilterName:event.currentTarget.id,currentFilterElement:event.currentTarget})
    };

    const handleCloseFilter = () => setCurrentFilter({currentFilterName:'',currentFilterElement:null})

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


    return (
        <div
            style={{
                border:'2px solid grey',
                backgroundColor:'white',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center',
                padding:getValueByDevice(20,10,10),
                marginBottom:'20px'
            }}>


            {
                device == devices.Desktop &&
                <IconButton onClick={() => {window.open('http://109.207.78.24/app',"_self")}}>
                    <AccountCircleOutlined/>
                </IconButton>
            }

            
            <div style={{width:'190px'}}>
                <WindowedSelect
                    styles={customSelectStyles}
                    isClearable={true}
                    isRtl={true}
                    isMulti={false}
                    getOptionValue={e => e}
                    getOptionLabel={e => Number.isInteger(parseInt(inputValue)) ? `נכס מספר #${e}`:e}
                    inputValue={inputValue}
                    onInputChange={e => setInputValue(e)}
                    options={Number.isInteger(parseInt(inputValue)) ? propertiesData.data.map(p => p.attributes.custom_id + '') : addressesData}
                    placeholder="הקש כתובת/ מספר נכס"
                    value={filters.propertyNumber ? [`נכס מספר #${filters.propertyNumber}`] : [filters.address]}
                    onChange={e => {
                        !Number.isInteger(parseInt(e)) ?
                            setFilters({...filters,address:e,addresses:[],addressesActive:0,propertyNumber:''})
                        :
                            setFilters({...filters,propertyNumber:e,addresses:[],addressesActive:0,address:''})
                    }}
                />
            </div>

            {
                device == devices.Desktop &&

                <div style={{display:'flex',justifyContent:'space-around',padding:'0px 20px',height:38}}>

                    <div id='budget' style={{}}  onClick={e => handleClickFilter(e)}
                    style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginLeft:5}}>
                        <>
                            <FaShekelSign style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>תקציב</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>              
                        {
                            budgetActive > 0 &&
                            <div onClick={(e) => {
                                setFilters({...filters,budgetFrom:MinPrice,budgetTo:MaxPrice,budgetActive:0})
                                e.stopPropagation()} } 
                                style={xStyle}>X</div>
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
                            roomsActive > 0 &&
                            <div onClick={(e) => {setFilters({...filters,roomsFrom:MinRooms,roomsTo:MaxRooms,roomsActive:0});e.stopPropagation()} } 
                            style={xStyle}>X</div>
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
                            renovationActive > 0 &&
                            <div onClick={(e) => {setFilters({...filters,renovationFrom:MinRenovation,renovationTo:MaxRenovation,renovationActive:0});e.stopPropagation()} } 
                            style={xStyle}>X</div>
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
                            filters.addresses.length > 0 &&
                            <div onClick={(e) => {setFilters({...filters,addresses:[],addressesActive:0});e.stopPropagation()} } 
                            style={xStyle}>X</div>
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
                            furnitureActive > 0 &&
                            <div onClick={(e) => {setFilters({...filters,furnitureFrom:MinFurniture,furnitureTo:MaxFurniture,furnitureActive:0});e.stopPropagation()} } 
                            style={xStyle}>X</div>
                        }
                    </div>

                </div>
            }
            
            <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',marginLeft:10,marginRight:10}} onClick={(e) => {setSideFilterVisible(true)}}>
                <TuneOutlined/>
                {
                    device != devices.Mobile &&
                    <span style={{fontFamily:'Assistant',fontSize:'1rem'}}>סננים נוספים</span>
                }
            </div>

            <div onClick={() =>  {
                if (propertiesData.favouritesDisplayed)
                    setPropertiesData({...propertiesData,dataFiltered:propertiesData.data,favouritesDisplayed:false})
                else{
                    let dataFiltered = propertiesData.data.filter(prop => propertiesData.favourites.some(id => prop.id == id))
                    setPropertiesData({...propertiesData,dataFiltered,favouritesDisplayed:true})
                }
            }}
             style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid orangered',borderRadius:10,padding:'6px',marginLeft:10,backgroundColor:propertiesData.favouritesDisplayed ? 'white':'orangered',color:!propertiesData.favouritesDisplayed ? 'white':'orangered',cursor:'pointer'}}>
                {
                    propertiesData.favouritesDisplayed ?               
                    <FaHeart size={24} color={'red'} style={{paddingLeft:5}} />
                    :
                    <FaHeart size={24} color={'white'} style={{paddingLeft:5}} />
                }
                {
                    device != devices.Mobile &&
                    <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
                }

            </div>

            {
                device == devices.Desktop &&
                <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',border:'2px solid orangered',borderRadius:10,padding:'6px',cursor:'pointer'}} onClick={() => {submitFilters()}}>
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
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {
                                setFilters({...filters,budgetActive:filters.budgetActive+1});
                                handleCloseFilter()}
                            } 
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
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {setFilters({...filters,roomsActive:filters.roomsActive+1});handleCloseFilter()}} 
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
                        
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {setFilters({...filters,renovationActive:filters.renovationActive++});handleCloseFilter()}} 
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
                            setFilters({...filters,addresses: [...newVal],addressesActive:filters.addressesActive+1,address:''});
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
                            <div onClick={() => {setFilters({...filters,furnitureActive:filters.furnitureActive+1});handleCloseFilter()}} 
                                style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() } 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>:
                currentFilterName == 'metres' ?
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
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {
                                setFilters({...filters,metresActive:filters.metresActive+1});
                                handleCloseFilter()}
                            } 
                                style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                            <div onClick={() => handleCloseFilter() } 
                                style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
                        </div>
                    </div>
                </div>:
                currentFilterName == 'floor' ?
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
                        <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                            <div onClick={() => {
                                setFilters({...filters,floorActive:filters.floorActive+1});
                                handleCloseFilter()}
                            } 
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