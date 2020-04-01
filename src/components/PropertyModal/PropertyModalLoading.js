
import React from 'react'
import { useGlobalState } from '../../globalState';
import { CircularProgress } from '@material-ui/core';


export const PropertyModalLoading = props => {

    return (

        <div style={{backgroundColor:'rgba(0,0,0,0.2)',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',direction:'rtl',position:'absolute',width:'100%'}}>        
            <CircularProgress size={60}/>
        </div>
    )

}