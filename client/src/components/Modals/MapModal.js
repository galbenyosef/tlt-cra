import React from 'react'
import {LocationMap} from "../Map";
import {Modal} from "@material-ui/core";
import {useGlobalState} from "../../globalState";
import "leaflet/dist/leaflet.css";

export default () => {

  const [map,setMap] = useGlobalState('map')
  const {opened,lat,lon} = map
  if (!opened)
    return null
  console.log('map rendered')
  return (
    <Modal open={opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setMap({...map,opened:false})}>
      <div style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute'}}>
        <div style={{display:'flex',justifyContent:'center',width:'100vw',maxWidth:660,padding:20,minHeight:320}}>
            {/* property location */}
            <LocationMap lat={lat} lon={lon}/>
          </div>
        </div>
    </Modal>
  )


}