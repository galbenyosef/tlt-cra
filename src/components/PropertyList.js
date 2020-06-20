
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState, getGlobalState } from '../globalState';
import { CircularProgress,Grid } from '@material-ui/core';
import {PropertyView} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'



export const PropertyList = props => {

    const [favourites, setFavourites] = useGlobalState('favourites');
    const [propertiesData, setPropertiesData] = useGlobalState('properties');

    const listRef = React.useRef(null)

    useEffect(() => {
        
        if (listRef)
            setGlobalState('listRef',listRef)
    },[listRef])


    const toggleFavourite = React.useCallback(id => {
        let newFavProps = [...favourites]
        if (favourites.includes(id)){
            newFavProps.splice(favourites.indexOf(id),1)
        }
        else{
            newFavProps.push(id)
        }
        setFavourites(newFavProps)
    },[])

    if (!propertiesData.data.length)
        return null

    console.log('property List rendered')
    
    const {data:properties} = propertiesData

    const handleScroll = () => {
        const bottom = listRef && listRef.current && listRef.current.scrollHeight - listRef.current.scrollTop === listRef.current.clientHeight;
    
        if (bottom) {

        }
    }


    return (
        <div style={{display:'flex',width:'90%',height:'85%',justifyContent:'center'}}>
            <div style={{display:'flex',width:'100%',paddingTop:'20px',margin:'0px 0px 0px -20px',position:'relative'}}>
            <PropertyListLoading/>
            <Grid ref={listRef}  onScroll={e => handleScroll()}  style={{width:'100%',margin:0,overflow:'auto',marginLeft:'-20px',marginBottom:50}} container>
            {
                properties.length > 0 && properties.splice(0,50).map(prop => 
                    <PropertyView key={prop.id} property={prop} toggleFavourite={toggleFavourite}/>
                )
            }
            </Grid>
            </div>
        
            <div style={{display:'flex',flexDirection:'column',backgroundColor:'lightgray',width:20,zIndex:1}}>


            </div>
        </div>
    )
}