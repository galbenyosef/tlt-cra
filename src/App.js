import React, { useEffect, useState, useRef, useCallback } from 'react'
import { Grid, Button, Drawer, IconButton, withStyles, Menu, CircularProgress, Input, InputAdornment, Checkbox } from '@material-ui/core';
import { useWindowDimensions } from './components/useWindowsDimensions';
import { usePrevious } from './components/usePrevious';
import { MainFiltersSideMenu } from './components/MainFiltersSideMenu';
import { AccountCircleOutlined, TuneOutlined, Hotel, LocationCity, FavoriteBorder, Sync, Weekend } from '@material-ui/icons';
import { IoIosConstruct } from 'react-icons/io';
import { FiHeart } from 'react-icons/fi';
import { range } from './components/Utilities';
import {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MySelect } from './components/MySelect';
import { FaHeart } from 'react-icons/fa';
import { MainNewModal } from './components/MainNewModal';


let constants = {
  PerPage: 12,
  MaxPrice: 18000,
  MaxRooms: 10,
  MaxRenovation:4,
  MaxFurniture:3,
}

let getBaseUrl = (offset,limit) => {
  return (
    `/kala/v1/page?select[]=id&select[]=site_id&select[]=title&select[]=slug&select[]=active&select[]=attributes&select[]=thumb_file&offset=${offset}&limit=${limit}&type_id=2933&active=1&page_attributes[__operators][status]==&page_attributes[status]=במאגר`
  )
}


const getRenovationIntToString = (int) => {
  switch(int){
    case(1):{
      return 'לא משופצת'
    }
    case(2):{
      return 'שמורה'
    }
    case(3):{
      return 'משופצת'
    }
    case(4):{
      return 'משופצת ברמה גבוהה'
    }
  }
}

const getFurnitureIntToString = (int) => {
  switch(int){
    case(1):{
      return 'ללא ריהוט'
    }
    case(2):{
      return 'ריהוט חלקי'
    }
    case(3):{
      return 'ריהוט מלא'
    }
  }
}

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    color: state.isSelected ? 'red' : 'blue',
    padding: 10,
    fontSize: state.value.includes(',') ? 14:18,
    fontWeight: state.value.includes(',') ? null:'bolder'
  }),

  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
/*     const transition = 'opacity 300ms';
 */
    return { ...provided, opacity, /* transition */ };
  }
}

const getUrl = (baseUrl,options = {}) => {

  let optionsEncoded = ''
  if (options.price){
    optionsEncoded += options.price.map(function(k) {
        return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
    }).join('&')
  }
  if (options.rooms){
    optionsEncoded += options.rooms.map(function(k) {
        return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
    }).join('&')
  }
  if (options.renovation){
    optionsEncoded += options.renovation.map(function(k) {
        return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
    }).join('&')
  }
  if (options.addresses){
    optionsEncoded += options.addresses.map(function(k) {
        return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
    }).join('&')
  }
  if (options.furniture){
    optionsEncoded += options.furniture.map(function(k) {
        return encodeURIComponent(k.name) + '=' + encodeURIComponent(k.value)
    }).join('&')
  }
  return baseUrl+'&'+optionsEncoded
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));


const PropertyCardKala = React.memo(({property,amount,isFavourite,toggleFavourite}) => {

  let imageUrl = "https://tlt.kala-crm.co.il/common/assets/748/724/"
  console.log('card render')
  return (
    <Grid onClick={() => {console.log(property)}} item xs={6} sm={4} style={{padding:'0px 20px 20px 20px',height:amount == 4 ? '33%':'50%'}}>
      <div style={{display:'flex',flexDirection:'column',height:'100%',margin:'auto',backgroundColor:'white',boxShadow:'10px 10px 10px 0px grey',whiteSpace:'nowrap',overflow:'hidden',maxWidth:'300px'}}>
        <div style={{position:'relative',height:'55%',flex:1}}>
          <p style={{position:'absolute',top:'10px',right:'10px',backgroundColor:'yellow',transform:'rotate(-12.5deg)',color:'green',fontWeight:'bolder'}}>{`${'חדש!'}`}</p>
          {
            isFavourite ?
            <FaHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={/* amount == 4 ? 24: */32} color={'red'} style={{position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
            :
            <FiHeart onClick={(event) => {toggleFavourite(property.id);event.stopPropagation()}} size={/* amount == 4 ? 24: */32} color={'white'} style={{position:'absolute',top:'10px',left:'10px',cursor:'pointer'}}/>
          }
          
          <div onClick={() => {}} style={{overflow:'hidden',width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {
              property.thumb_file ?
              <div>
                <LazyLoadImage
                  style={{maxWidth:'100%',width:'100%',height:'100%'}}
                  src={`${imageUrl}${property.thumb_file.sm}`} // use normal <img> attributes as props
                  />
                <span style={{width:'100%',textAlign:'center'}}>{`התמונה נטענת...`}</span>
              </div>
            : 
              null
            }
          </div>
       </div>
       <div style={{textAlign:'right',position:'relative',padding:'10px'}}>
          <div style={{fontSize:'1.1vw',fontFamily:'Assistant',fontWeight:'bolder',whiteSpace:'pre-line'}}>
            {`שכונת ${property.attributes.neighborhood_name}, רחוב ${property.attributes.street_name}`}
          </div>
          <div style={{fontSize:'.8vw',fontFamily:'Assistant',fontWeight:'bold'}}>
            {`
            ${property.attributes.rooms ? `${property.attributes.rooms} חדרים ⋅`: ` `}
            ${property.attributes.metres? `${property.attributes.metres} מ"ר`:` `}
            ${property.attributes.terrace ? `+ מרפסת`:``}
            ${property.attributes.floor != undefined ? (property.attributes.floor ? `⋅ קומה ${property.attributes.floor}`:` ⋅ קומת קרקע`): ' '}
            `}
          </div>
          <div style={{fontSize:'1.3vw',fontWeight:'bolder',fontFamily:'Assistant',textAlign:'end'}}>
           {property.attributes.price ? `${property.attributes.price.toLocaleString('he-IL')} ₪`: ` `}
          </div>
          <div style={{display:'flex',flexDirection:'row',fontWeight:'bold',padding:'10px 0px',justifyContent:'space-between'}}>
            <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`${property.attributes.propertyNumber ? `#${property.attributes.propertyNumber}`:`-`}`}</div>
            <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`סייר בנכס`}</div>
            <div style={{display:'flex',width:'30%',border:'3px solid black',justifyContent:'center',alignItems:'center',fontSize:'1vw'}}>{`קבע פגישה`}</div>
          </div>
        </div>
      </div>
    </Grid>
 )
})


const IndexPage = props => {

  const [showFiltersMenu,setShowFiltersMenu] = useState(false)
  const [loading,setLoading] = useState(false)
  const [endReached,setEndReached] = useState(false)
  const [amount,setAmount] = useState(0)
  const { height, width } = useWindowDimensions();
  const prevWidth = usePrevious(width)
  const [page,setPage] = useState(0)
  const listRef = useRef(null)
  const [currentCount,setCurrentCount] = useState(0)
  const [addressesMap,setAddressesMap] = useState({})
  const [addresses,setAddresses] = useState([])
  const [properties,setProperties] = useState([])
  const [favouriteProperties,setFavouriteProperties] = useState([])
  const [total,setTotal] = useState(0)
  const [urlOptionsJson,setUrlOptionsJson] = useState({
    price:[],
    rooms:[],
    renovation:[],
    addresses:[],
    furniture:[]
  })
  const [neighborhood_search,setNeighborhoodSearch] = useState('')
  const [filterType,setFilterType] = useState(null)
  const [filterElement, setFilterElement] = useState(null);
  const [filters,setFilters] = useState({
    budgetFrom:1500,
    budgetTo:constants.MaxPrice,
    roomsFrom:1,
    roomsTo:constants.MaxRooms,
    renovationFrom:1,
    renovationTo:constants.MaxRenovation,
    addresses:[],
    furnitureFrom:1,
    furnitureTo:constants.MaxFurniture
  })

  const [modalOpened,setModalOpened] = useState(false)

  const handleClickFilter = (event) => {
    setFilterElement(event.currentTarget);
    setFilterType(event.currentTarget.id)
  };

  const toggleFavourite = React.useCallback(id => {
    let newFavProps = [...favouriteProperties]
    if (favouriteProperties.includes(id)){
      newFavProps.splice(favouriteProperties.indexOf(id),1)
    }
    else{
      newFavProps.push(id)
    }
    setFavouriteProperties(newFavProps)
  })



  const submitNewFilter = (filterName,filterValue) => {

    switch(filterName){
      case ('budget'):{
        let _range = range(filterValue[0],filterValue[1],10)

        let range_array = []

        for (let i=0;i<_range.length;i++){
          range_array.push({
            name:"page_attributes[price][]",
            value:_range[i]
          })
        }

        setUrlOptionsJson({...urlOptionsJson,price:range_array})
        getProperties(0,999999,{...urlOptionsJson,price:range_array})
        break
      }
      case ('rooms'):{
        let _range = range(filterValue[0],filterValue[1],.5)

        let range_array = []

        for (let i=0;i<_range.length;i++){
          range_array.push({
            name:"page_attributes[rooms][]",
            value:_range[i]
          })
        }

        setUrlOptionsJson({...urlOptionsJson,rooms:range_array})
        getProperties(0,999999,{...urlOptionsJson,rooms:range_array})
        break
      }
      case ('renovation'):{
        let _range = range(filterValue[0],filterValue[1],1)

        let range_array = []

        for (let i=0;i<_range.length;i++){
          range_array.push({
            name:"page_attributes[renovation][]",
            value:_range[i]
          })
        }

        setUrlOptionsJson({...urlOptionsJson,renovation:range_array})
        getProperties(0,9999999,{...urlOptionsJson,renovation:range_array})
        break
      }
      case ('addresses'):{

        let range_array = []
        console.log(filterValue)
        for (let i=0;i<filterValue.length;i++){
          if (filterValue[i].includes(','))
            range_array.push({
              name:"page_attributes[street_name][]",
              value:filterValue[i]
            })
          else
            range_array.push({
              name:"page_attributes[neighborhood_name][]",
              value:filterValue[i]
            })
        }
        setUrlOptionsJson({...urlOptionsJson,addresses:range_array})
        getProperties(0,9999999,{...urlOptionsJson,addresses:range_array})
        break
      }
      case ('furniture'):{
        let _range = range(filterValue[0],filterValue[1],1)
        console.log(_range)
        let range_array = []

        for (i of _range){
          range_array.push({
            name:"page_attributes[furniture][]",
            value:getFurnitureIntToString(i)
          })
        }

        setUrlOptionsJson({...urlOptionsJson,furniture:range_array})
        getProperties(0,9999999,{...urlOptionsJson,furniture:range_array})
        break
      }
    }
  }

  const handleCloseFilter = React.useCallback(() => {
    setFilterElement(null);
  })
  
  const handleScroll = () => {
    const bottom = listRef && listRef.current && listRef.current.scrollHeight - listRef.current.scrollTop === listRef.current.clientHeight;

    if (bottom && !endReached && !loading) {
      setPage(page+1)
    }
  }

  const getProperties = async (offset=0,limit,options,fetchAll) => {

    setLoading(true)

    scrollToTop()

    console.log(getUrl(getBaseUrl(offset,limit),options))
    let response = await fetch(getUrl(getBaseUrl(offset,limit),options),{
      method: 'GET',
      headers: {
        "x-kala-key":"kdcG983ujtltGHtgzd"
      }
    })

    console.log('getting properties '+options)
    if (response && response.ok){
      let responseJson = await response.json()

      
      if (fetchAll){
        setTotal(responseJson.metadata.total)
        let addressesMap = {}
        let properties = responseJson.payload
        
        for (let i=0; i<properties.length;i++){
          let {attributes} = properties[i]
          if (!addressesMap[attributes.neighborhood_name])
            addressesMap[attributes.neighborhood_name] = []
          if (!addressesMap[attributes.neighborhood_name].includes(attributes.street_name))
            addressesMap[attributes.neighborhood_name].push(attributes.street_name)
        }
        setAddressesMap(addressesMap)

        let addresses = []
        let neighborhoods = Object.keys(addressesMap)
        for (let i=0; i<neighborhoods.length;i++){
          addresses.push(neighborhoods[i])
          for (let j=0;j<addressesMap[neighborhoods[i]].length;j++){
            addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
          }
        }

        setAddresses(addresses)
      }
      
      setCurrentCount(responseJson.payload.length)
      setProperties(responseJson.payload)
      
    }

    setLoading(false)
    console.log('finished getting properties '+options)

  }


  const scrollToTop = React.useCallback( () => {
    if (listRef.current)
      listRef.current.scrollTop = 0
  })

  const initialize = async () => {
    await getProperties(0,99999999,{},true)
    let isFavouritesExists = localStorage.getItem('favourites')
    if (isFavouritesExists){
      const likedProperties = JSON.parse(isFavouritesExists)

    }
    else{
      localStorage.setItem('favourites',JSON.stringify([]))
    }
  }

  useEffect(() => {
    initialize()
  },[])

  const NeighborhoodsFilterView = React.memo(() => Object.keys(addressesMap).filter(neighborhood => neighborhood.match(neighborhood_search)).length ? 
    Object.keys(addressesMap).filter(neighborhood => neighborhood.match(neighborhood_search)).map(neighbor => {

      return (
        <div key={neighbor} style={{display:'flex',flexDirection:'row',width:'45%',padding:10,alignItems:'center'}}>
          <Checkbox checked={filters.addresses.includes(neighbor)} onChange={() => {
            let newAddresses = [...filters.addresses]
            if (filters.addresses.includes(neighbor)){
              newAddresses.splice(filters.addresses.indexOf(neighbor),1)
              setFilters({...filters,addresses:newAddresses})
            }
            else{
              newAddresses.push(neighbor)
              setFilters({...filters,addresses:newAddresses})
            }
          }}/>
          {
            neighbor
          }
        </div>
      )
    })
    :
    Object.keys(addressesMap).map(neighbor => {

      return (
        <div key={neighbor} style={{display:'flex',flexDirection:'row',width:'45%',padding:10,alignItems:'center'}}>
          <Checkbox checked={filters.addresses.includes(neighbor)} onChange={() => {
            let newAddresses = [...filters.addresses]
            if (filters.addresses.includes(neighbor)){
              newAddresses.splice(filters.addresses.indexOf(neighbor),1)
              setFilters({...filters,addresses:newAddresses})
            }
            else{
              newAddresses.push(neighbor)
              setFilters({...filters,addresses:newAddresses})
            }
          }}/>
          {
            neighbor
          }
        </div>
      )
    }),[])

  useEffect(() => {
    console.log('width change')
    if (width < 650)
      setAmount(4)
    else
      setAmount(6)
  },[width])

  let i=0

  const optionsDefault = new Array(1000).fill(null).map(() => ({
    value: ++i,
    label: `${i}`,
  }));

  console.log('Render Global...')

  return (
    <div
      style={{direction:'rtl',display:'flex',alignItems:'center',height:'100vh',flexDirection:'column',backgroundColor:'lightgray'}}>
      <div
        style={{
          border:'2px solid grey',
          backgroundColor:'white',
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          flexWrap:'wrap',
          padding:'20px',
          marginBottom:'20px'
        }}>


        <IconButton onClick={() => {}}>
          <AccountCircleOutlined/>
        </IconButton>

        
        <div style={{width:'180px'}}>
         <MySelect data={addresses}/>
        </div>

        <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap',padding:'0px 20px'}}>

            <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
              <IconButton id='budget'  onClick={e => handleClickFilter(e)}>
                <i className="fa fa-ils" aria-hidden="true"></i>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}><span style={{fontSize:'1rem'}}>₪</span> תקציב</span>
              </IconButton>              
              {
                urlOptionsJson.price.length > 0 &&
                <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,price:[]});getProperties(0,9999999,{...urlOptionsJson,price:[]})} } 
                  style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                  borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
              }
            </div>

            <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
              <IconButton id='rooms'  onClick={e => handleClickFilter(e)}>
                <Hotel/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>חדרים </span>
              </IconButton>
              {
                urlOptionsJson.rooms.length > 0 &&
                <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,rooms:[]});getProperties(0,9999999,{...urlOptionsJson,rooms:[]})} } 
                  style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                  borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
              }
            </div>

            <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
              <IconButton id='renovation'  onClick={e => handleClickFilter(e)}>
              <IoIosConstruct/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>רמת שיפוץ </span>
              </IconButton>
              {
                urlOptionsJson.renovation.length > 0 &&
                <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,renovation:[]});getProperties(0,9999999,{...urlOptionsJson,renovation:[]})} } 
                  style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                  borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
              }
            </div>

            <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
              <IconButton id='addresses'  onClick={e => handleClickFilter(e)}>
                <LocationCity/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>שכונות </span>
              </IconButton>
              {
                urlOptionsJson.addresses.length > 0 &&
                <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,addresses:[]});getProperties(0,9999999,{...urlOptionsJson,addresses:[]})} } 
                  style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                  borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
              }
            </div>

            <div style={{border:'2px solid grey',borderRadius:10,position:'relative'}}>
              <IconButton id='furniture'  onClick={e => handleClickFilter(e)}>
                <Weekend/>
                <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>ריהוט </span>
             </IconButton>
              {
                urlOptionsJson.furniture.length > 0 &&
                <div onClick={(e) => {setUrlOptionsJson({...urlOptionsJson,furniture:[]});getProperties(0,9999999,{...urlOptionsJson,furniture:[]})} } 
                  style={{fontWeight:'bolder',fontSize:18,width:20,height:20,cursor:'pointer',
                  borderRadius:100,backgroundColor:'red',position:'absolute',right:-10,top:-12.5,zIndex:1,color:'white',
                  borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>X</div>
              }
            </div>



        </div>
        
        <IconButton onClick={(e) => setShowFiltersMenu(true)}>
          <TuneOutlined/>
          <span style={{fontFamily:'Assistant',fontSize:'1rem'}}>סננים נוספים</span>
        </IconButton>

        <IconButton style={{border:'2px solid grey',borderRadius:10,padding:'6px'}} onClick={() => {}}>
          <FavoriteBorder/>
          <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>נכסים שאהבתי </span>
        </IconButton>

        {
          amount != 4 &&
          <IconButton style={{border:'2px solid grey',borderRadius:10,padding:'6px'}} onClick={() => {}}>
            <Sync/>
            <span style={{fontFamily:'Assistant',fontSize:'1rem',fontWeight:'bold'}}>רענן חיפוש </span>
          </IconButton>
        }
      </div>

      <div style={{fontWeight:'bolder',}}>
        {
          `מציג ${currentCount} מתוך ${total} נכסים בסה"כ`
        }
      </div>
     
      <div style={{display:'flex',width:'90%',height:'85%',justifyContent:'center'}}>
        <div style={{display:'flex',width:amount == 4 ? '100%':'80%',paddingTop:'20px',margin:'0px 0px 0px -20px',position:'relative'}}>
          {
            loading &&
              <div style={{backgroundColor:'rgba(0,0,0,0.2)',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',direction:'rtl',top:'50%',left:'50%',position:'absolute',transform:'translate(-50%, -50%)',height:'100%',width:'100%'}}>        
                <CircularProgress size={60}/>
              </div>
          }
          <Grid ref={listRef}  onScroll={e => handleScroll()}  style={{width:'100%',margin:0,overflow:'auto',marginLeft:'-20px',marginBottom:50}} container>
          {
            properties.length > 0 && properties.map(prop => 
              <PropertyCardKala key={prop.id} property={prop} amount={amount} isFavourite={favouriteProperties.includes(prop.id)} toggleFavourite={toggleFavourite}/>
            )
          }
          </Grid>
        </div>
      
        <div style={{display:'flex',flexDirection:'column',backgroundColor:'lightgray',width:20,zIndex:1}}>


        </div>
      </div>

      <div style={{fontWeight:'bolder',height:'50px',display:'flex',flexDirection:'column',flex:1,width:'100%',position:'absolute',bottom:0,zIndex:1,backgroundColor:'lightgray',justifyContent:'center',alignItems:'center'}}>
        <p>TLT - תיווך ללא תיווך נכסים והשקעות בע"מ - כל הזכויות שמורות</p>
      </div>
      
      <StyledMenu
        anchorEl={filterElement}
        open={Boolean(filterElement)}
        onClose={() => handleCloseFilter()}
      >
        {
          filterType == 'budget' ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
            <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
              <div style={{padding:20}}>
                <Range
                  step={50}
                  min={1500}
                  max={constants.MaxPrice}
                  onChange={(newVal) => setFilters({...filters,budgetFrom:newVal[0],budgetTo:newVal[1]})}
                  value={[filters.budgetFrom,filters.budgetTo]}
                  reverse
                  allowCross={false}
                />
              </div>
              
              <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                <Input
                  onChange={(event) => setFilters({...filters,budgetFrom:parseInt(event.currentTarget.value)})}
                  margin="dense"
                  inputProps={{
                    step: 10,
                    min: 1500,
                    max: constants.MaxPrice,
                    type: 'number',
                  }}
                  value={filters.budgetFrom}
                  startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                />
                <Input
                  onChange={(event) => setFilters({...filters,budgetTo:parseInt(event.currentTarget.value)})}
                  margin="dense"
                  inputProps={{
                    step: 10,
                    min: 1500,
                    max: constants.MaxPrice,
                    type: 'number',
                  }}
                  value={filters.budgetTo}
                  startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                />
              </div>
              <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                <div onClick={() => {submitNewFilter('budget',[filters.budgetFrom,filters.budgetTo]);handleCloseFilter()}} 
                  style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                  color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                <div onClick={() => handleCloseFilter() } 
                    style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                    borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
              </div>
            </div>
          </div>:
          filterType == 'rooms' ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
            <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
              <div style={{padding:20}}>
                <Range
                  step={.5}
                  min={1}
                  max={constants.MaxRooms}
                  onChange={(newVal) => setFilters({...filters,roomsFrom:newVal[0],roomsTo:newVal[1]})}
                  value={[filters.roomsFrom,filters.roomsTo]}
                  reverse
                  allowCross={false}
                />
              </div>
              
              <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',padding:'0px 20px 0px 20px'}}>
                <Input
                  onChange={(event) => setFilters({...filters,roomsFrom:parseFloat(event.currentTarget.value)})}
                  margin="dense"
                  inputProps={{
                    step: .5,
                    min: 1,
                    max: constants.MaxRooms,
                    type: 'number',
                  }}
                  value={filters.roomsFrom}
                  startAdornment={<InputAdornment position="end">מ</InputAdornment>}
                />
                <Input
                  onChange={(event) => setFilters({...filters,roomsTo:parseFloat(event.currentTarget.value)})}
                  margin="dense"
                  inputProps={{
                    step: .5,
                    min: 1,
                    max: constants.MaxRooms,
                    type: 'number',
                  }}
                  value={filters.roomsTo}
                  startAdornment={<InputAdornment position="end">עד</InputAdornment>}
                />
              </div>
              <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                <div onClick={() => {submitNewFilter('rooms',[filters.roomsFrom,filters.roomsTo]);handleCloseFilter()}} 
                  style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                  color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                <div onClick={() => handleCloseFilter() } 
                    style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                    borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
              </div>
            </div>
          </div>:
          filterType == "renovation" ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
            <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
              <div style={{padding:20}}>
                <Range
                  step={1}
                  min={1}
                  max={constants.MaxRenovation}
                  onChange={(newVal) => setFilters({...filters,renovationFrom:newVal[0],renovationTo:newVal[1]})}
                  value={[filters.renovationFrom,filters.renovationTo]}
                  reverse
                  tipFormatter={val => val}
                  dots={true}
                  marks={{
                    1: getRenovationIntToString(1),
                    2: getRenovationIntToString(2),
                    3: getRenovationIntToString(3),
                    4: getRenovationIntToString(4)
                  }}
                  allowCross={false}
                />
              </div>
              
              <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                <div onClick={() => {submitNewFilter('renovation',[filters.renovationFrom,filters.renovationTo]);handleCloseFilter()}} 
                  style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                  color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                <div onClick={() => handleCloseFilter() } 
                    style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                    borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
              </div>
            </div>
          </div>:
           filterType == "addresses" ?
           <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
             <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap',overflow:'hidden'}}>
               <div style={{padding:20}}>
                <div style={{width:'100%'}}>
                  <Input
                    onChange={e => setNeighborhoodSearch(e.currentTarget.value)}
                    value={neighborhood_search}
                    placeholder="חיפוש שכונה">
                  </Input>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',width:'100%',overflow:'auto',flexWrap:'wrap',height:'150px'}}>
                <NeighborhoodsFilterView/>
              </div>
               
               <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                 <div onClick={() => {submitNewFilter('addresses',filters.addresses);handleCloseFilter()}} 
                   style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                   color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                 <div onClick={() => handleCloseFilter() } 
                     style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                     borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
               </div>
             </div>
           </div>
          :
          filterType == "furniture" ?
          <div style={{direction:'rtl',display:'flex',flexWrap:'wrap',paddingLeft:20,paddingRight:20,position:'relative'}}>
            <div style={{width:'300px',display:'flex',flexDirection:'column',flexWrap:'wrap'}}>
              <div style={{padding:20}}>
                <Range
                  step={1}
                  min={1}
                  max={3}
                  onChange={(newVal) => setFilters({...filters,furnitureFrom:newVal[0],furnitureTo:newVal[1]})}
                  value={[filters.furnitureFrom,filters.furnitureTo]}
                  reverse
                  tipFormatter={val => val}
                  dots={true}
                  marks={{
                    1: 'ללא ריהוט',
                    2: 'ריהוט חלקי',
                    3: 'ריהוט מלא',
                  }}
                  allowCross={true}
                />
              </div>
              
              <div style={{flex:1,display:'flex',justifyContent:'space-evenly',alignItems:'center',padding:20}}>
                <div onClick={() => {submitNewFilter('furniture',[filters.furnitureFrom,filters.furnitureTo]);handleCloseFilter()}} 
                  style={{width:'30%',backgroundColor:'lightgreen',cursor:'pointer',fontSize:'14px',color:'black',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                  color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>אישור</div>
                <div onClick={() => handleCloseFilter() } 
                    style={{width:'30%',fontWeight:'bolder',fontSize:14,cursor:'pointer',backgroundColor:'grey',color:'white',boxShadow: "3px 3px 0px 1px rgba(0,0,0,0.18)",
                    borderWidth:2,borderColor:'black',display:'flex',justifyContent:'center',alignItems:'center'}}>סגור</div>
              </div>
            </div>
          </div>:
          null
        }
      </StyledMenu>
      <MainNewModal open={modalOpened}/>
      <Drawer
        anchor={'right'}
        open={showFiltersMenu}
        onClose={() => setShowFiltersMenu(false)}
      >
        <div style={{width:250,borderBottom:'1px solid grey',display:'flex',justifyContent:'center',alignItems:'center',padding:10}}>
          <MainFiltersSideMenu filters={filters} setFilters={setFilters}/>
        </div>
      </Drawer>

    </div>
  )
}


export default IndexPage