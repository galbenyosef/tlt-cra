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
        <div id='rootRef' ref={rootRef} style={{direction:'rtl',display:'flex',alignItems:'center',flexDirection:'column',backgroundColor:'rgb(202,221,235)'}}>
            {
                children
            }
        </div>
    )
}


export default Layout