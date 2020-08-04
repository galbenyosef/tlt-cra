
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../../globalState';
import { Grid } from '@material-ui/core';
import {PropertyViewGrid, PropertyViewList} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'
import { FiGrid,FiList } from "react-icons/fi";

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
      <div style={{flexDirection:'column',display:'flex',maxWidth:window.innerWidth > 1000 ? '1300px': window.innerWidth > 660 ? '670px' : '320px' ,alignItems:'center'}}>
        <PropertyListLoading/>
        <div style={{display:'flex',padding:20}}>
          <FiGrid onClick={() => setListDisplay(0)}/>
          <FiList onClick={() => setListDisplay(1)}/>
        </div>
        {
          listDisplay ? <div style={{fontFamily:'Rubik,sans-serif',border:'1px solid rgba(0,0,0,.1)',backgroundColor:'#fdf9c5'}}>
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

PropertyList.whyDidYouRender = true

export {PropertyList}