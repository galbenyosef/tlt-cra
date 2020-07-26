import React from 'react'
import Logo_NOTEXT from '../../assets/Logo_NOTEXT.png'
import {useGlobalState} from '../../globalState'
import './spin.css'

export const MainSpinner = () => {

    return (
      <div>
        <img style={{height:200,width:300,animation: `spin ${3.5}s linear infinite`}} src={Logo_NOTEXT} alt="img"/>
      </div>
    )
}