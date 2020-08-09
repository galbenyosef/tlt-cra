
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../../globalState';
import { Grid } from '@material-ui/core';
import {PropertyViewGrid, PropertyViewList} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'
import { FiGrid,FiList } from "react-icons/fi";
import {colors} from "../../colors";

const PropertyList = () => {

  const [propertiesData,setPropertiesData] = useGlobalState('properties');
  const [listDisplay,setListDisplay] = useGlobalState('listDisplay')

  const listRef = React.useRef(null)

  useEffect(() => {
    if (listRef)
      setGlobalState('listRef',listRef)

  },[listRef])

  if (!propertiesData.length)
    return null


  const toggleFavourite = idx => {

    setPropertiesData(properties => {
      let updatedProperties = properties.map((p,_idx) => (idx == _idx ? {...p,isFavourite:!p.isFavourite} : p ))
      localStorage.setItem('favourites',JSON.stringify(updatedProperties.filter(p => p.isFavourite).map(p => p.id)))
      return updatedProperties
    })

  }

  console.log('property List rendered')

  return (
    <div style={{display:'flex',justifyContent:'center',overflow:'hidden',width:'100%',}}>
      <div style={{flexDirection:'column',display:'flex',width:'100%',maxWidth:window.innerWidth > 1000 ? '1300px': 'auto' ,alignItems:'center'}}>
        <PropertyListLoading/>
        <div style={{display:'flex',padding:20}}>
          <FiGrid size={40} style={{cursor:'pointer'}} onClick={() => setListDisplay(0)}/>
          <FiList size={40} style={{paddingRight:20,cursor:'pointer'}} onClick={() => setListDisplay(1)}/>
        </div>
        {
          listDisplay ? <div style={{maxWidth:800,fontFamily:'Rubik,sans-serif',border:'1px solid rgba(0,0,0,.1)',backgroundColor:colors.darkblue,width:'100%'}}>
              {
                propertiesData.length > 0 && propertiesData.filter(p => p.isFiltered).map((prop,idx) =>
                  <PropertyViewList toggleFavourite={toggleFavourite} index={idx} key={prop.id} property={prop}/>
                )
              }
            </div>:
            <Grid spacing={4} ref={listRef}  style={{width:'100%',overflow:'auto',justifyContent:'center'}} container>
              {
                propertiesData.length > 0 && propertiesData.filter(p => p.isFiltered).map((prop,idx) =>
                  <PropertyViewGrid toggleFavourite={toggleFavourite} index={idx} key={prop.id} property={prop}/>
                )
              }
            </Grid>
        }

      </div>
    </div>
  )
}

export default PropertyList