import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

export const LocationMap = ({lat,lon}) => {


    const map = (
      <Map  center={[lat,lon]} zoom={80}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
      </Map>
    )

    return map
}
