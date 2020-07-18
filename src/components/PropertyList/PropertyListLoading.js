
import React from 'react'
import { useGlobalState } from '../../globalState';
import { CircularProgress } from '@material-ui/core';


export const PropertyListLoading = props => {

    const [loading] = useGlobalState('loading');

    if (loading)
        return (
    
            <div style={{backgroundColor:'rgba(0,0,0,0.2)',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',direction:'rtl',top:'50%',left:'50%',position:'absolute',transform:'translate(-50%, -50%)',height:'100%',width:'100%'}}>        
                <CircularProgress size={60}/>
            </div>
        )

    return null
}