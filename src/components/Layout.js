import React from 'react'


const Layout = ({children}) => 
<div style={{direction:'rtl',display:'flex',alignItems:'center',height:'100vh',flexDirection:'column',backgroundColor:'lightgray'}}>
    {
        children
    }
</div>

export default Layout