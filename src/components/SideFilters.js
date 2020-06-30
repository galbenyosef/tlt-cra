import React from 'react'
import { Drawer, Grid } from '@material-ui/core';
import { useGlobalState, setGlobalState } from '../globalState';
import { devices, constants, switchFilters } from './Utilities';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { FaShekelSign } from 'react-icons/fa';
import { IoIosConstruct,IoIosResize } from 'react-icons/io';
import { Hotel, LocationCity, Weekend } from '@material-ui/icons';
import Switch from "react-switch";

const xStyle = {fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}

export const SideFilters = props => {

    const [visible,setVisible] = useGlobalState('sideFiltersVisible')
    const [device] = useGlobalState('device')
    const [filters, setFilters] = useGlobalState('filters');

    const {
        //default values
        metresActive,
        budgetActive,
        roomsActive,
        renovationActive,
        furnitureActive,
        floorActive
    } = filters

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


    const setCurrentFilter = val => setGlobalState('currentFilter',val);


    const handleClickFilter = (event) => {
        setCurrentFilter({currentFilterName:event.currentTarget.id,currentFilterElement:event.currentTarget})
    };


    return (
        <Drawer
            anchor={'right'}
            open={visible}
            onClose={() => setVisible(false)}
        >
            <div style={{width:250,borderBottom:'1px solid grey',display:'flex',justifyContent:'center',alignItems:'center',padding:10}}>
                <div style={{display:'flex',alignItems:'flex-end',flexDirection:'column',padding:'0px 20px'}}>
                {
                    device == devices.Mobile &&

                    <>
                        <div id='budget' style={{}}  onClick={e => handleClickFilter(e)}
                        style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',height:36,borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
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
                            style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
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
                            style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
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
                            style={{display:'flex',justifyContent:'space-around',alignItems:'center',cursor:'pointer',borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
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

                    </>
                }

                    <div id='floor' style={{}}  onClick={e => handleClickFilter(e)}
                        style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',height:36,borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
                        <>
                            <IoIosResize style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>קומה</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>              
                        {
                            floorActive > 0 &&
                            <div onClick={(e) => {
                                setFilters({...filters,floorFrom:MinFloor,floorTo:MaxFloor,floorActive:0})
                                e.stopPropagation()} } 
                                style={xStyle}>X</div>
                        }
                    </div>
                    <div id='metres' style={{}}  onClick={e => handleClickFilter(e)}
                        style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',height:36,borderBottom:'2px solid orangered',position:'relative',marginBottom:10}}>
                        <>
                            <IoIosResize style={{paddingLeft:5}}/>
                            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>גודל במ"ר</span>
                            <MdKeyboardArrowDown size={24} color='orangered'/>
                        </>              
                        {
                            metresActive > 0 &&
                            <div onClick={(e) => {
                                setFilters({...filters,metresFrom:MinMetres,metresTo:MaxMetres,metresActive:0})
                                e.stopPropagation()} } 
                                style={xStyle}>X</div>
                        }
                    </div>
                    <Grid container spacing={1}>
                        {
                            Object.keys(switchFilters).map(filter => <Grid key={filter} item xs={4}>
                                    <label style={{height:'100%',display: 'flex',flexDirection: 'column',justifyContent: 'space-between',alignItems: 'center',fontSize:14,textAlign:'center'}}>
                                        <p>{switchFilters[filter]}</p>
                                        <Switch onChange={checked => {console.log(checked,filter);setFilters({...filters,[filter]:checked})}}
                                            checked={filters[filter]}/>
                                    </label>
                                </Grid>
                            )
                        }
                    </Grid>
                </div>
            </div>
        </Drawer>
    )
}