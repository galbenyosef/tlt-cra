
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState, getGlobalState } from '../globalState';
import { CircularProgress,Grid } from '@material-ui/core';
import {PropertyView} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'
import { getValueByDevice } from './Utilities';

export const PropertyList = props => {

    const [propertiesData, setPropertiesData] = useGlobalState('properties');
    const listRef = React.useRef(null)

   /*  const toggleFavourite = (index) => {
        let {data} = propertiesData
        if (data[index].isFavourite){
            data.splice(index, 1, {...data[index], isFavourite: false })

        }
        else{
            data.splice(index, 1, {...data[index], isFavourite: true })
        }
        setPropertiesData({...propertiesData,data})
    }
 */
    const toggleFavourite = (id) => {
        let {favourites} = propertiesData
        
        if (favourites.includes(id)){
            favourites = favourites.filter(_id => _id != id)
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
        const bottom = listRef && listRef.current && listRef.current.scrollHeight - listRef.current.scrollTop === listRef.current.clientHeight;
    
        if (bottom) {

        }
    }

    return (
        <div style={{display:'flex',justifyContent:'center',overflow:'hidden',width:'100%',}}>
            <div style={{display:'flex',maxWidth:window.innerWidth > 1000 ? '1000px': window.innerWidth > 660 ? '670px' : '320px' ,position:'relative',justifyContent:'center'}}>
                <PropertyListLoading/>
                <Grid spacing={3} ref={listRef}  onScroll={e => handleScroll()}  style={{width:'100%',overflow:'auto'}} container>
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