
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../../globalState';
import { Grid } from '@material-ui/core';
import {PropertyView} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'
import {fetchCoordinates, fetchProperty, getAlternatives} from "../../dataHandler";

const PropertyList = () => {

    const [propertiesData,setPropertiesData] = useGlobalState('properties');
    const setProperty = val => setGlobalState('property',val)

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
            localStorage.setItem('favourites',JSON.stringify(updatedProperties.filter(p => p.isFavourite)))
            return updatedProperties
        })

    }

    const onPropertyClicked = async (id) => {

        let property = await fetchProperty(id)
        const {
            street_name,neighborhood_name,city_id
        } = property

        let addressString = [street_name,neighborhood_name,city_id].join(', ')
        let coordinates = await fetchCoordinates(addressString)
        let alternatives = getAlternatives(property)
        setProperty({...property,alternatives,coordinates})
    }

    console.log('property List rendered')

    return (
        <div style={{display:'flex',justifyContent:'center',overflow:'hidden',width:'100%',}}>
            <div style={{width:'100%',display:'flex',maxWidth:window.innerWidth > 1000 ? '1300px': window.innerWidth > 660 ? '670px' : '320px' ,position:'relative',justifyContent:'center'}}>
                <PropertyListLoading/>
                <Grid spacing={4} ref={listRef}  style={{width:'100%',overflow:'auto',justifyContent:'center'}} container>
                {
                    propertiesData.length > 0 && propertiesData.filter(p => p.isFiltered).map((prop,idx) =>
                        <PropertyView onPropertyClicked={onPropertyClicked} toggleFavourite={toggleFavourite} index={idx} key={prop.id} property={prop}/>
                    )
                }
                </Grid>
            </div>
        </div>
    )
}

PropertyList.whyDidYouRender = true

export {PropertyList}