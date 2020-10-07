import React from 'react'
import {useGlobalState} from "../globalState";
import Drawer  from "@material-ui/core/Drawer";
import {Link} from "react-router-dom";
import {CitySelection} from "./Main/Main";


export default () => {

  const [sideMenuOpened,setOpened] = useGlobalState('sideMenuOpened')

  console.log('side menu rendered')
  return (
    <Drawer
      anchor={'right'}
      open={sideMenuOpened}
      onClose={() => setOpened(false)}
    >
      <div style={{display:'flex',height:window.innerHeight,flexWrap:'wrap',justifyContent:'space-around',flexDirection:'column',maxWidth:150,direction:'rtl'}}>
        <div style={{display:'flex',flexDirection:'column'}}>
          <Link to={'/'} style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>ראשי</Link>
          <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>אודות</p>
          <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>לקוחות ממליצים</p>
          <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>בעלי המשרד</p>
          <p style={{whiteSpace:'nowrap',padding:10,fontSize:14,fontWeight:'bold',fontFamily:'Assistant'}}>צור קשר</p>
        </div>
        <CitySelection/>
      </div>
    </Drawer >
  )
}