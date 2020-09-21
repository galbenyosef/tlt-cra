import React, {useEffect} from 'react'
import {Hidden} from "@material-ui/core";
import FiltersBar from "./FiltersBar";
import PropertyList from "./PropertyList/PropertyList";
import {MainSpinner} from "./Main/MainSpinner";
import {useGlobalState} from "../globalState";
import {onCityClick, showSingleProperty, validateId} from "../dataHandler";
import {useLocation,useParams} from "react-router-dom";

export default () => {
  const [isLoading] = useGlobalState('loading')
  let location = useLocation()
  let city = location.pathname.replace('/','')
  let {id} = useParams()

  useEffect(() => {

    if (parseInt(city))
      return
    if (city)
      onCityClick(city)
  },[city])

  useEffect(() => {
    console.log(id)
    if (!parseInt(city))
      return
    if (id){
      if (validateId(id))
        showSingleProperty(id)
    }
  },[id])

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