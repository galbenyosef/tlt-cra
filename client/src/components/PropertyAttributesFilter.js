import {Grid} from "@material-ui/core";
import {FaAccessibleIcon, FaBath, FaBuilding, FaFan, FaParking, FaShower, FaWarehouse} from "react-icons/fa";
import {FiSun} from "react-icons/fi";
import {GiFireFlower, GiStairs, GiWindow, GiWindowBars} from "react-icons/gi";
import {FcSafe} from "react-icons/fc";
import {AiOutlineTable} from "react-icons/ai";
import {RiLandscapeLine, RiParentLine} from "react-icons/ri";
import {IoIosHome} from "react-icons/io";
import {GrElevator} from "react-icons/gr";
import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import {setFilters} from "../dataHandler";
import {useGlobalState} from "../globalState";
import {devices, switchFilters} from "./Utilities";

const MifratItemStyle = {
  flexWrap:'wrap',
  display:'flex',
  alignItems:'center',
  fontSize:14,
  paddingBottom:35,
  whiteSpace:'nowrap'
}

const MifratTextStyle = {
 textAlign:'center',fontWeight:'bold',paddingRight:5
}

const imageSize = 20

const switchFiltersImages = {
  airconditioner:<FaFan  size={imageSize}/>,
  terrace:<GiWindow size={imageSize} />,
  shower:<FaShower size={imageSize} />,
  bathtub:<FaBath size={imageSize} />,
  landscape:<RiLandscapeLine size={imageSize} />,
  parking:<FaParking size={imageSize} />,
  boiler:<FiSun size={imageSize} />,
  elevator:<GrElevator size={imageSize} />,
  warehouse:<FaWarehouse size={imageSize} />,
  garden:<GiFireFlower size={imageSize} />,
  accessibility:<FaAccessibleIcon size={imageSize} />,
  saferoom:<FcSafe size={imageSize} />,
  bars:<GiWindowBars size={imageSize} />,
  nets:<AiOutlineTable size={imageSize} />,
  parentsunit:<RiParentLine size={imageSize} />,
  electricshutters:<IoIosHome size={imageSize} />,
}

export const PropertyAttributesFilter = () => {

  const [filters] = useGlobalState('filters')
  const [device] = useGlobalState('device')

  const changeAttributes = (attribute,value) => setFilters({...filters,attributes:{...filters.attributes,[attribute]:value}})

  return (
    <Grid container style={{paddingTop:20,maxWidth:600}}>
      {
        Object.keys(switchFilters).map(filterName => <Grid key={filterName} style={MifratItemStyle} item xs={device == devices.Desktop ? 4:6}>
          <div style={{display:'flex',alignItems:'center'}}>
            <Checkbox style={{paddingBottom:0,paddingTop:0}} checked={filters.attributes[filterName]} onChange={e => changeAttributes(filterName,e.currentTarget.checked)} />
            {switchFiltersImages[filterName]}
            <p style={MifratTextStyle}>{switchFilters[filterName]}</p>
          </div>
        </Grid>)
      }
    </Grid>
  )
}

