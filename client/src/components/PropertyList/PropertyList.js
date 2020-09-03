
import React, { useEffect } from 'react'
import {useGlobalState, setGlobalState, ListDisplays} from '../../globalState';
import { Grid } from '@material-ui/core';
import { FiGrid,FiList } from "react-icons/fi";
import {colors} from "../../colors";
import PropertyViewList from "./PropertyViewList";
import PropertyViewGrid from "./PropertyViewGrid";
import Pagination from '@material-ui/lab/Pagination';

const PropertyList = () => {

  const [propertiesData,setPropertiesData] = useGlobalState('properties');
  const [listDisplay,setListDisplay] = useGlobalState('listDisplay')
  const [totalFiltered] = useGlobalState('totalFiltered')
  const [totalCityCount] = useGlobalState('totalCityCount')
  const [city] = useGlobalState('city')
  const [perPage,setPerPage] = useGlobalState('perPage')
  const [page,setPage] = useGlobalState('page')


  const listRef = React.useRef(null)

  useEffect(() => {
    if (listRef)
      setGlobalState('listRef',listRef)

  },[listRef])

  if (!propertiesData.length)
    return null

  let propertiesFiltered = propertiesData.length ? propertiesData.filter(p => p.isFiltered) : []
  let properties = propertiesFiltered.filter(p => p.isFiltered).slice((page-1) * perPage,perPage*page)

  console.log('property List rendered')

  return (
    <div style={{display:'flex',justifyContent:'center',overflow:'hidden',width:'100%',fontFamily:'Rubik'}}>
      <div style={{flexDirection:'column',display:'flex',width:'100%',maxWidth:window.innerWidth > 1000 ? '1300px': 'auto' ,alignItems:'center'}}>
        <div style={{display:'flex',paddingTop:20,paddingBottom:20,alignItems:'center',flexWrap:'wrap',justifyContent:'space-around'}}>
          <div style={{fontSize:14}}>
            <span>{`מציג ${properties.length} מתוך ${totalFiltered} נכסים מסוננים,`}</span>
            <span>{` ${totalCityCount} נכסים ב${city} סה"כ`}</span>
          </div>
          <div style={{paddingTop:10}}>
            {
              listDisplay == ListDisplays.List ?
                <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',borderRadius:20,border:'1px solid black',paddingLeft:10,paddingRight:10}}>
                  <span>תצוגת רשת</span>
                  <FiGrid size={32} style={{cursor:'pointer'}} onClick={() => setListDisplay(ListDisplays.Grid)}/>
                </div>
                :
                <div style={{display:'flex',justifyContent:'space-around',alignItems:'center',borderRadius:20,border:'1px solid black',paddingLeft:10,paddingRight:10}}>
                  <span>תצוגת רשימה</span>
                  <FiList size={32} style={{cursor:'pointer'}} onClick={() => setListDisplay(ListDisplays.List)}/>
                </div>
            }
          </div>
          <div style={{direction:'ltr',display:'flex',justifyContent:'center',width:'100%',paddingTop:10}}>
            <Pagination siblingCount={0} showFirstButton showLastButton count={parseInt(propertiesFiltered.length/perPage)+1} page={page} onChange={(e, page) => setPage(page)} variant="outlined" shape="rounded" />
          </div>
        </div>
        {
          listDisplay == ListDisplays.List ?
            <div style={{maxWidth:800,fontFamily:'Rubik,sans-serif',border:'1px solid rgba(0,0,0,.1)',backgroundColor:colors.darkblue,width:'100%'}}>
              {
                properties.map((prop,idx) =>
                  <PropertyViewList index={idx} key={prop.id} property={prop}/>
                )
              }
            </div>:
            <Grid spacing={4} ref={listRef}  style={{width:'100%',overflow:'auto',justifyContent:'center'}} container>
              {
                properties.map((prop,idx) =>
                  <PropertyViewGrid index={idx} key={prop.id} property={prop}/>
                )
              }
            </Grid>
        }
        <div style={{direction:'ltr',paddingTop:20,paddingBottom:20}}>
          <Pagination siblingCount={0} showFirstButton showLastButton count={parseInt(propertiesFiltered.length/perPage)+1} page={page} onChange={(e,page) => setPage(page)} variant="outlined" shape="rounded" />
        </div>
      </div>
    </div>
  )
}

export default PropertyList