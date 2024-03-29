import React, {useEffect} from 'react'
import {Modal} from "@material-ui/core";
import {setGlobalState, useGlobalState} from "../../globalState";
import {colors} from "../../colors";
import {Hotel, TuneOutlined, Weekend} from "@material-ui/icons";
import {clearFilterStyle} from "../../styles";
import {FaShekelSign} from "react-icons/fa";
import {IoIosConstruct, IoIosResize} from "react-icons/io";
import {constants, devices} from "../Utilities";
import {changeFilters} from "../../dataHandler";
import {FiltersBarContent} from "../FiltersBarContent";
import '../noScrollBar.css'

const {
  MinPrice,
  MaxPrice,
  MinRooms,
  MaxRooms,
  MinMetres,
  MaxMetres,
  MinFloor,
  MaxFloor
} = constants

const setFilters = val => setGlobalState('filters',val)
const setCurrentFilter = val => setGlobalState('currentFilter',val)
const handleClick = (e) => setCurrentFilter(currentFilter => ({...currentFilter,currentFilterName:e.currentTarget.id}))

export default () => {

  const [filters] = useGlobalState('filters');
  const [device] = useGlobalState('device')
  const {modalOpened} = filters
  const setModalOpened = val => setFilters({...filters,modalOpened: val})
  const [headerHeight] = useGlobalState('headerHeight')
  const [currentFilter] = useGlobalState('currentFilter')
  const {currentFilterName} = currentFilter

  const filterLabelStyle = {
    display:'flex',
    flexGrow:1,
    justifyContent:'center',
    alignItems:'center',
    cursor:'pointer',
    border:`2px solid`,
    borderLeft:0,height:26,
    position:'relative'
  }

  const isSelectedBackground = name => name === currentFilterName ? {backgroundColor:colors.darkblue} : null

  useEffect(() => {console.log('render Filters modal')})

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


  return (
    <Modal
      disableEnforceFocus={true}
      BackdropProps={{style:{top:headerHeight + 38}}}
      open={modalOpened} style={{direction:'rtl',backgroundColor:'rgba(0,0,0,0.4)',top:headerHeight + 38,zIndex:1}} onBackdropClick={() => setModalOpened(false)}>
      <div style={{display:'flex',flexDirection:'column',maxHeight:`calc(100vh - ${headerHeight}px - 60px)`,backgroundColor:'white',overflow:'auto',outline:'none',padding:20,alignItems:'center',justifyContent:'center',paddingBottom:0}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',whiteSpace:'nowrap',flexWrap:'wrap',maxWidth:360,paddingBottom:20}}>
          <div id='rooms' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('rooms')}}>
              <Hotel style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>חדרים</span>
            {
              roomsActive > 0 &&
              <div onClick={(e) => {changeFilters({roomsFrom:MinRooms,roomsTo:MaxRooms,roomsActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='budget' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('budget')}}>
              <FaShekelSign style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>תקציב</span>
            {
              budgetActive > 0 &&
              <div onClick={(e) => {
                changeFilters({budgetFrom:MinPrice,budgetTo:MaxPrice,budgetActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='furniture' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('furniture')}}>
              <Weekend style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>ריהוט</span>
            {
              furnitureActive > 0 &&
              <div onClick={(e) => {changeFilters({furnitureTypes: [],furnitureActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='floor' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('floor'),borderLeft:'2px solid black'}}>
              <IoIosResize style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>קומה</span>
            {
              floorActive > 0 &&
              <div onClick={(e) => {
                changeFilters({floorFrom:MinFloor,floorTo:MaxFloor,floorActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='renovation' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('renovation')}}>
              <IoIosConstruct style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>רמת שיפוץ</span>
            {
              renovationActive > 0 &&
              <div onClick={(e) => {changeFilters({renovations:[],renovationActive:0});e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='metres' onClick={handleClick}
               style={{...filterLabelStyle,...isSelectedBackground('metres')}}>
              <IoIosResize style={{paddingLeft:5}}/>
              <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>גודל במ"ר</span>
            {
              metresActive > 0 &&
              <div onClick={(e) => {
                changeFilters({metresFrom:MinMetres,metresTo:MaxMetres,metresActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

          <div id='attributes' onClick={handleClick}
            style={{...filterLabelStyle,...isSelectedBackground('attributes'),borderLeft:'2px solid black'}}>
            <TuneOutlined/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold',paddingLeft:5}}>מאפיינים</span>
            {
              attributesActive > 0 &&
              <div onClick={(e) => {
                changeFilters({attributes:{},attributesActive:0})
                e.stopPropagation()} }
                   style={clearFilterStyle}>X</div>
            }
          </div>

        </div>
        <div className={'noScrollBar'} style={{borderTop:'2px dotted lightgrey',overflow:'scroll'}}>
          <FiltersBarContent mobile={device !== devices.Desktop}/>
        </div>
      </div>
    </Modal>
  )
}