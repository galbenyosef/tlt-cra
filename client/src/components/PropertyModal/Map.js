import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import L from 'leaflet'
L.Icon.Default.imagePath='leaflet/'

export const LocationMap = ({lat,lon}) => {


    const map = (
      <Map style={{height : '400px'}} center={[lat,lon]} zoom={80}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="TLT Israel Real estate rentals and investments LTD"
        />
          <Marker position={[lat,lon]}>
              <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
          </Marker>
      </Map>
    )

    return map
}
