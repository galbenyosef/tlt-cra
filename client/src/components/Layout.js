import React, { useRef, useEffect } from 'react'
import { setGlobalState } from '../globalState'


const Layout = ({children}) => {

    const rootRef = useRef(null)
    const setRootRef = val => setGlobalState('rootRef',val)
    useEffect(() => {
        setRootRef(rootRef)
        console.log(rootRef)
    },[rootRef])
    return (
        <div id='rootRef' ref={rootRef} style={{direction:'rtl',display:'flex',alignItems:'center',flexDirection:'column',minHeight:'100vh',justifyContent:'space-between'}}>
            {
                children
            }
        </div>
    )
}


export default Layout