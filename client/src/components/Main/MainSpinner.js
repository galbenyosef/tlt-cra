import React from 'react'
import Logo_NOTEXT from '../../assets/YellowLogoNoTextTrans_TLT.png'

import '../spin.css'

export const MainSpinner = () => {

    return (
      <div style={{    alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'}}>
        <img style={{height:200,width:300,animation: `spin ${3.5}s linear infinite`}} src={Logo_NOTEXT} alt="img"/>
      </div>
    )
}