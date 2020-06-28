import React, { useState } from 'react'
import { IconButton, Input, InputAdornment } from '@material-ui/core';
import { AccountCircleOutlined, TuneOutlined, Hotel, LocationCity, FavoriteBorder, Sync, Weekend } from '@material-ui/icons';
import { MySelect } from './MySelect';
import {useGlobalState, setGlobalState} from '../globalState';
import { IoIosConstruct } from 'react-icons/io';
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
}


const TopBar = props => {

    const [addresses, setAddresses] = useGlobalState('addresses');
    const [addressSearch, setAddressSearch] = useGlobalState('addressSearch');
    const [urlOptionsJson, setUrlOptionsJson] = useGlobalState('urlOptionsJson');
    const [sideBarVisible, setSideBarVisible] = useGlobalState('sideBarVisible');
    const [filters, setFilters] = useGlobalState('filters');
    const [neighborhoodSelected,setNeighborhoodSelected] = useState([])
    const [device] = useGlobalState('device')

    const [currentFilter, setCurrentFilter] = useGlobalState('currentFilter');

    if (!addresses.length){
        return null
    }
    
    const {currentFilterName} = currentFilter
    const {currentFilterElement} = currentFilter

    const setProperties = (val) => setGlobalState('properties',val)
    const setIsLoading = (val) => setGlobalState('loading',val)

    
    const submitNewFilter = (filterName,filterValue) => {

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


    const fetchProperties = async (options={}) => {

        setIsLoading(true)
        /* scrollToTop() */
        const data = await getProperties(options)
        const _properites = data.payload

        setProperties({data:_properites,currentCount:_properites.length})
        setIsLoading(false)

    }
    

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
                justifyContent:'space-between',
                alignItems:'center',
                flexWrap:'wrap',
                padding:'20px',
                marginBottom:'20px'
            }}>


            {
                device == devices.Desktop &&
                <IconButton onClick={() => {}}>
                    <AccountCircleOutlined/>
                </IconButton>
            }

            
            <div style={{width:'180px'}}>
                <WindowedSelect
                    styles={customSelectStyles}
                    isClearable={true}
                    isRtl={true}
                    isMulti={true}
                    getOptionValue={e => e}
                    getOptionLabel={e => e}
                    options={addresses}
                    placeholder="חפש לפי כתובת"
                    value={filters.addresses}
                    onChange={e => {console.log(e);setFilters({...filters,addresses:e});submitNewFilter('addresses',e)}}
                />
            </div>

            {
                device == devices.Desktop &&

                <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',padding:'0px 20px'}}>

                    <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
                        <IconButton id='budget'  onClick={e => handleClickFilter(e)}>
                            <i className="fa fa-ils" aria-hidden="true"></i>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}><span style={{fontSize:'1rem'}}>₪</span> תקציב</span>
                        </IconButton>              
                        {
                            urlOptionsJson.price.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,price:[]});fetchProperties({...urlOptionsJson,price:[]})} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
                        <IconButton id='rooms'  onClick={e => handleClickFilter(e)}>
                            <Hotel/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>חדרים </span>
                        </IconButton>
                        {
                            urlOptionsJson.rooms.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,rooms:[]});fetchProperties({...urlOptionsJson,rooms:[]})} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
                        <IconButton id='renovation'  onClick={e => handleClickFilter(e)}>
                            <IoIosConstruct/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>רמת שיפוץ </span>
                        </IconButton>
                        {
                            urlOptionsJson.renovation.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,renovation:[]});fetchProperties({...urlOptionsJson,renovation:[]})} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
                        <IconButton id='addresses'  onClick={e => handleClickFilter(e)}>
                            <LocationCity/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>שכונות </span>
                        </IconButton>
                        {
                            urlOptionsJson.addresses.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,addresses:[]});fetchProperties({...urlOptionsJson,addresses:[]})} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                    <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
                        <IconButton id='furniture'  onClick={e => handleClickFilter(e)}>
                            <Weekend/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>ריהוט </span>
                        </IconButton>
                        {
                            urlOptionsJson.furniture.length > 0 &&
                            <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,furniture:[]});fetchProperties({...urlOptionsJson,furniture:[]})} } 
                                style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                                borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                                borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
                        }
                    </div>

                </div>
            }
            
            <IconButton onClick={(e) => {/* setSideBarVisible(true) */}}>
                <TuneOutlined/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem'}}>סננים נוספים</span>
            </IconButton>

            <IconButton style={{border:'2px solid grey',borderRadius:10,padding:'6px'}} onClick={() => {}}>
                <FavoriteBorder/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
            </IconButton>

            {
                <IconButton style={{border:'2px solid grey',borderRadius:10,padding:'6px'}} onClick={() => {}}>
                    <Sync/>
                    <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>רענן חיפוש </span>
                </IconButton>
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