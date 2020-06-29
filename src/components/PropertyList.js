
import React, { useEffect } from 'react'
import { useGlobalState, setGlobalState, getGlobalState } from '../globalState';
import { CircularProgress,Grid } from '@material-ui/core';
import {PropertyView} from './PropertyView'
import {PropertyListLoading} from './PropertyListLoading'
import { getValueByDevice } from './Utilities';



export const PropertyList = props => {

    const [propertiesData, setPropertiesData] = useGlobalState('properties');
    const listRef = React.useRef(null)

    const toggleFavourite = (index) => {
        let {data} = propertiesData
        if (data[index].isFavourite){
            data.splice(index, 1, {...data[index], isFavourite: false })
        }
        else{
            data.splice(index, 1, {...data[index], isFavourite: true })
        }
        setPropertiesData({...propertiesData,data})
    }

    useEffect(() => {
        
        if (listRef)
            setGlobalState('listRef',listRef)
    },[listRef])

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
        <div style={{display:'flex',justifyContent:'center',overflow:'hidden'}}>
            <div style={{display:'flex',width:'100%',paddingTop:'20px',margin:'0px 0px 0px -20px',position:'relative'}}>
                <PropertyListLoading/>
                <Grid spacing={getValueByDevice(3,1)} ref={listRef}  onScroll={e => handleScroll()}  style={{width:'100%',overflow:'auto',marginLeft:'-20px',marginBottom:50}} container>
                {
                    properties.length > 0 && properties.map((prop,idx) => 
                        <PropertyView toggleFavourite={toggleFavourite} index={idx} key={prop.id} property={prop}/>
                    )
                }
                </Grid>
            </div>
        </div>
    )
}