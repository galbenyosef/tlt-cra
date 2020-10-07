import React, {useEffect} from 'react'
import {Hidden} from "@material-ui/core";
import FiltersBar from "./FiltersBar";
import PropertyList from "./PropertyList/PropertyList";
import {MainSpinner} from "./Main/MainSpinner";
import {useGlobalState} from "../globalState";
import {initProperty, onCityClick, validateId} from "../dataHandler";

export default ({id,city}) => {

  const [isLoading] = useGlobalState('loading')
  const [currentCity] = useGlobalState('city')

  useEffect(() => {
    if (validateId(id) && !currentCity){
      console.log('init with property')
      initProperty(id,currentCity)
    }
    else if (city && !currentCity){
      onCityClick(city)
    }
  },[currentCity])

  if (isLoading)
    console.log('city loading ')
  else
    console.log('city rendered ')

  return (
    <div style={{width:'100%',display:'flex',flexGrow:1,flexDirection:'column',justifyContent:'space-evenly',position:'relative'}}>
      {
        isLoading ?
          <MainSpinner/> :
          <div style={{display:'flex',flexDirection:'column'}}>
            <Hidden xsDown>
              <FiltersBar/>
            </Hidden>
            <PropertyList />
          </div>
      }
    </div>
  )
}
