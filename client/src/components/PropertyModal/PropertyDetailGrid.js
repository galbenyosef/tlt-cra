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

const MifratItemStyle = {
  justifyContent:'space-around',
  flexWrap:'wrap',
  display:'flex',
  alignItems:'center',
  paddingBottom:35
}

export const PropertyDetailGrid = ({
     airconditioner,
     boiler,
     shower,
     bathtub,
     structure,
     parking,
     warehouse,
     garden,
     accessibility,
     saferoom,
     bars,
     nets,
     electricshutters,
     parentsunit,
     stairs,
     landscape,
     terrace,
     elevator,
   }) =>

  <Grid container>
    <Grid item xs={12}>
      <p style={{textAlign:'center'}}>מפרט הדירה</p>
    </Grid>
    {
      airconditioner?.length &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaFan  size={20}/>
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מיזוג ${airconditioner[0]}`}</p>
      </Grid>
    }
    {
      boiler &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FiSun size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${boiler}`}</p>
      </Grid>
    }
    {
      shower &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaShower size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מקלחון`}</p>
      </Grid>
    }
    {
      bathtub &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaBath size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`אמבטיה`}</p>
      </Grid>
    }
    {
      structure &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaBuilding size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מבנה ${structure}`}</p>
      </Grid>
    }
    {
      parking &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaParking size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${parking}`}</p>
      </Grid>
    }
    {
      warehouse &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaWarehouse size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מחסן`}</p>
      </Grid>
    }
    {
      garden &&
      <Grid style={MifratItemStyle} item xs={4}>
        <GiFireFlower size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גינה`}</p>
      </Grid>
    }
    {
      accessibility &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FaAccessibleIcon size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`גישה לנכים`}</p>
      </Grid>
    }
    {
      saferoom &&
      <Grid style={MifratItemStyle} item xs={4}>
        <FcSafe size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`ממ"ד`}</p>
      </Grid>
    }
    {
      bars &&
      <Grid style={MifratItemStyle} item xs={4}>
        <GiWindowBars size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`סורגים`}</p>
      </Grid>
    }
    {
      nets &&
      <Grid style={MifratItemStyle} item xs={4}>
        <AiOutlineTable size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`חלונות מרושתים`}</p>
      </Grid>
    }
    {
      electricshutters &&
      <Grid style={MifratItemStyle} item xs={4}>
        <GiWindow size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`תריסים חשמליים`}</p>
      </Grid>
    }
    {
      parentsunit &&
      <Grid style={MifratItemStyle} item xs={4}>
        <RiParentLine size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`יחידת הורים`}</p>
      </Grid>
    }
    {
      stairs > 0 &&
      <Grid style={MifratItemStyle} item xs={4}>
        <GiStairs size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`${stairs} מדרגות עד לפתח הדירה`}</p>
      </Grid>
    }
    {
      landscape &&
      <Grid style={MifratItemStyle} item xs={4}>
        <RiLandscapeLine size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`נוף ${landscape}`}</p>
      </Grid>
    }
    {
      terrace &&
      <Grid style={MifratItemStyle} item xs={4}>
        <IoIosHome size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מרפסת`}</p>
      </Grid>
    }
    {
      elevator &&
      <Grid style={MifratItemStyle} item xs={4}>
        <GrElevator size={20} />
        <p style={{width:'80%',textAlign:'center',fontSize:10,fontWeight:'bold'}}>{`מעלית`}</p>
      </Grid>
    }
  </Grid>