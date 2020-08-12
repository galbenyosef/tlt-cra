import React from 'react'
import {LocationMap} from "./Map";
import {Modal} from "@material-ui/core";
import {useGlobalState} from "../../globalState";
import "leaflet/dist/leaflet.css";

export const MapModal = () => {

  const [map,setMap] = useGlobalState('map')
  console.log(map)
  return (
    <Modal open={!!(map.lon && map.lat)} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setMap({lon:0,lat:0})}>
      <div style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute'}}>
        <div style={{display:'flex',justifyContent:'center',width:'100vw',maxWidth:660,padding:20,minHeight:320}}>
            {/* property location */}
            <LocationMap lat={map.lat} lon={map.lon}/>
          </div>
        </div>
    </Modal>
  )


}