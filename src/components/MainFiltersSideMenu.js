import React, {useState,useEffect} from 'react'
import { Button, Slider, Switch, FormControlLabel } from '@material-ui/core';

const booleanFields = {
  elevator:`מעלית`,
  accessibility:`נגישות לנכים`,
  terrace:`מרפסת`,
  saferoom:`חדר ביטחון`,
  garden:`גינה`,
  animals:`בעלי חיים`,
  warehouse:`מחסן`,
}

export const MainFiltersSideMenu = ({filters,setFilters}) => {

  const [price,setPrice] = useState(filters.price || [0,15000])
  const [priceOpened,setPriceOpened] = useState(false)
  const [rooms,setRooms] = useState(filters.rooms || [1,10])
  const [roomsOpened,setRoomsOpened] = useState(false)
  const [neighborhoods,setNeighborhoods] = useState(filters.neighborhoods || [])
  const [neighborhoodsOpened,setNeighborhoodsOpened] = useState(false)

  const [neighborhoodsList,setNeighborhoodsList] = useState([])

  const [booleanOpened,setBooleanOpened] = useState(false)
  const [booleans,setBooleans] = useState(filters.booleans || {})

  useEffect(() => {
    const getNeighborhoods = async () => {
      let response = await fetch(`/api/streets`)
      let responseJson = await response.json()
      if (responseJson.success){
        setNeighborhoodsList(responseJson.success.map(n => {return {...n,_id:n.neighborhoodId,}}))
      }
    }
    getNeighborhoods()
  },[])

  return (
    <div style={{display:'flex',flexDirection:'column',width:'100%',direction:'rtl',backgroundColor:'white'}}>
      <Button onClick={() => setPriceOpened(!priceOpened)} variant={'outlined'}>
        מחיר
      </Button>
      {
        priceOpened ? 
        <div style={{display:'flex',flexDirection:'column',padding:10}}>
          <p>{`מ ${price[0]}`}</p>
          <Slider 
            min={0}
            max={15000}
            step={100}
            valueLabelDisplay="auto"
            value={price}
            onChangeCommitted={(event, newValue) => setFilters({...filters,price:newValue})}
            onChange={(event, newValue) => setPrice(newValue)}
          />
          <p>{`עד ${price[1]}`}</p>
        </div> : null
      }
      <Button onClick={() => setRoomsOpened(!roomsOpened)} variant={'outlined'}>
        חדרים
      </Button>
      {
        roomsOpened ? 
        <div style={{display:'flex',flexDirection:'column',padding:10}}>
          <p>{`מ ${rooms[0]}`}</p>
          <Slider 
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            value={rooms}
            onChangeCommitted={(event, newValue) => setFilters({...filters,rooms:newValue})}
            onChange={(event, newValue) => setRooms(newValue)}
          />
          <p>{`עד ${rooms[1]}`}</p>
        </div> : null
      }
      <Button onClick={() => setNeighborhoodsOpened(!neighborhoodsOpened)} variant={'outlined'}>
        שכונות
      </Button>
      {
        neighborhoodsOpened ?
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
        {
          neighborhoodsList.map((n,index) => {
            return (
              <FormControlLabel style={{width:'50%',margin:0}} key={n._id}
                control={<Switch checked={neighborhoods.includes(n._id) || false} onChange={e => {
                  if (e.target.checked){
                    setNeighborhoods([...neighborhoods,n._id])
                    setFilters({...filters,neighborhoods:[...neighborhoods,n._id]})
                  }
                  else{
                    let newNeighborhoods = [...neighborhoods]
                    let neighIndex = newNeighborhoods.findIndex(ne => ne == (n._id))
                    if (neighIndex > -1){
                      newNeighborhoods.splice(neighIndex,1)
                      setNeighborhoods(newNeighborhoods)
                      if (!newNeighborhoods.length)
                        setFilters({...filters,neighborhoods:undefined})
                      else
                        setFilters({...filters,neighborhoods:newNeighborhoods})
                    }
                  }
                }} />}
                label={n.neighborhoodName}
              />
            )
          })
        }
        </div>
        :null
      }
      <Button onClick={() => setBooleanOpened(!booleanOpened)} variant={'outlined'}>
        נוספים
      </Button>
      {
        booleanOpened ?
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',alignItems:'center'}}>
        {
          Object.keys(booleanFields).map(n => {
            return (
              <FormControlLabel
                style={{width:'50%',margin:0}} key={n}
                control={<Switch checked={booleans[n] || false} onChange={ e => {
                  if (e.target.checked){
                    setBooleans({...booleans,[n]:true})
                    setFilters({...filters,booleans:{...booleans,[n]:true}})
                  }
                  else{
                    let newBooleans = {...booleans}
                    newBooleans[n] = undefined
                    setBooleans(newBooleans)
                    if (!Object.keys(newBooleans).length)
                      setFilters({...filters,booleans:undefined})
                    else
                      setFilters({...filters,booleans:newBooleans})
                  }
                }} />}
                label={booleanFields[n]}
              />
            )
          })
        }
        </div>
        :null
      }
    </div>
  )
}