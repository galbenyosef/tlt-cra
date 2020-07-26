
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState } from '../../globalState';
import { Grid } from '@material-ui/core';
import {PropertyView} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'

export const PropertyList = () => {

    const [propertiesData, setPropertiesData] = useGlobalState('properties');
    const listRef = React.useRef(null)

    const toggleFavourite = (id) => {
        let {favourites} = propertiesData
        
        if (favourites.includes(id)){
            favourites = favourites.filter(_id => _id !== id)
        }
        else{
            favourites = [...favourites,id]
        }
        console.log(favourites)
        localStorage.setItem('favourites',JSON.stringify(favourites))

        setPropertiesData({...propertiesData,favourites})
    }

    useEffect(() => {
        
        if (listRef)
            setGlobalState('listRef',listRef)
    },[listRef])

    if (!propertiesData.data.length)
        return null

    console.log('property List rendered')
    
    const {dataFiltered:properties} = propertiesData

    const handleScroll = () => {
        const {
            current:{
                scrollHeight,
                scrollTop,
                clientHeight
            }
        } = listRef
        const bottom = scrollHeight - scrollTop === clientHeight;
    
        if (bottom) {

        }
    }

    return (
        <div style={{display:'flex',justifyContent:'center',overflow:'hidden',width:'100%',}}>
            <div style={{width:'100%',display:'flex',maxWidth:window.innerWidth > 1000 ? '1300px': window.innerWidth > 660 ? '670px' : '320px' ,position:'relative',justifyContent:'center'}}>
                <PropertyListLoading/>
                <Grid spacing={4} ref={listRef}  onScroll={() => handleScroll()}  style={{width:'100%',overflow:'auto',justifyContent:'center'}} container>
                {
                    properties.length > 0 && properties.slice(0,20).map((prop,idx) => 
                        <PropertyView toggleFavourite={toggleFavourite} index={idx} isFavourite={propertiesData.favourites.includes(prop.id)} key={prop.id} property={prop}/>
                    )
                }
                </Grid>
            </div>
        </div>
    )
}