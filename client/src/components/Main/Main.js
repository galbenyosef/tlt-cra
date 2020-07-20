import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import {useGlobalState,setGlobalState} from '../../globalState'
import { getProperties} from '../../dataHandler'
import FiltersBar from './FiltersBar';
import { PropertyList } from '../PropertyList/PropertyList';
import { PropertyModal } from '../PropertyModal/PropertyModal';
import { devices } from '../Utilities'
import { LeadModal } from '../PropertyModal/LeadModal';
import { SideFilters } from '../SideFilters';
import TLT_LOGO from '../../assets/Logo_TLT.png'
import TLT_DETAILED_Trans from '../../assets/Logo_DETAILED_Trans.png'
import { Grid } from '@material-ui/core';
import { aboutUsText, aboutUsDetailedText } from './aboutUsText';

const scrollToBottom = element => element?.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });

const resize = () => {
    const setDevice = (val) => setGlobalState('device',val)

    if (window.innerWidth < 600)
        setDevice(devices.Mobile)
    else if (window.innerWidth < 1280)
        setDevice(devices.Tablet)
    else
        setDevice(devices.Desktop)
}

const fetchProperties = () => {

  const setIsLoading = (val) => setGlobalState('loading',val)
  const setProperties = (val) => setGlobalState('properties',val)
  const setAddresses = (val) => setGlobalState('addresses',val)
  const setAddressesMap = (val) => setGlobalState('neighborhoods',val)

  setIsLoading(true)

  getProperties()
    .then(data => {
      const properties = data.payload.sort(({created:createdA},{created:createdB}) => createdB - createdA)

      let addressesMap = {}

      for (let i=0; i<properties.length;i++){
        let {
          attributes,attributes:{
            neighborhood_name,
            street_name
          }
        } = properties[i]

        if (!attributes)
          console.log(properties[i])
        if (!addressesMap[neighborhood_name])
          addressesMap[neighborhood_name] = []
        if (!addressesMap[neighborhood_name].includes(street_name))
          addressesMap[neighborhood_name].push(street_name)
      }

      let addresses = []
      let neighborhoods = Object.keys(addressesMap).sort()
      for (let i=0; i<neighborhoods.length;i++){
        addresses.push(neighborhoods[i])
        for (let j=0;j<addressesMap[neighborhoods[i]].sort().length;j++){
          addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
        }
      }

      setAddressesMap(neighborhoods)
      setAddresses(addresses)
      let favouritesString = localStorage.getItem('favourites')
      let favourites = JSON.parse(favouritesString) || []
      setProperties({data:properties,dataFiltered:properties,currentCount:properties.length,totalCount:data.metadata.total,favourites})
    })
    .catch(e => console.log(e))
    .then(() => {
      setIsLoading(false)
    })
}

const Root = () => {

    const setProperty = (val) => setGlobalState('selectedProperty',val)
    const [rootRef] = useGlobalState('rootRef')
    const [aboutUsDetailed,setAboutUsDetailed] = useState(false)
    useEffect(() => {
        fetchProperties()

        window.addEventListener("resize",() => resize());
        if (window.location.pathname.includes('/') && window.location.pathname.length > 1 && Number.isInteger(parseInt(window.location.pathname.split('/')[1]))){
            console.log(window.location.pathname.split('/')[1])
            setProperty(window.location.pathname.split('/')[1])
        }

        resize()
    },[])

    console.log('root rendered')

    return (

        <Layout>
            <div style={{width:'100%',height:160,display:'flex',paddingTop:20}}>
            
                <div style={{width:'100%',height:160}}>
                    <div style={{width:'100%',height:'calc(100% * 1/4)'}}>

                    </div>
                    <div style={{flex:1,display:'flex',flexDirection:'row',width:'100%',height:'calc(100% * 1/2)',backgroundColor:'rgb(112,146,191)'}}>
                        <div style={{width:210}}/>
                        <div style={{flex:1,display:'flex',margin:'auto',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
                                <div>בחר עיר</div>
                                <div style={{display:'flex',flexDirection:'row'}}>
                                    <div style={{border:'1px solid black',fontWeight:'bold',color:'white',width:100,padding:5}}>חיפה</div>
                                    <div style={{border:'1px solid black',fontWeight:'bold',color:'white',width:100,padding:5}}>תל אביב</div>
                                    <div style={{border:'1px solid black',fontWeight:'bold',color:'white',width:100,padding:5}}>טירת הכרמל</div>
                                    <div style={{border:'1px solid black',fontWeight:'bold',color:'white',width:100,padding:5}}>נשר</div>
                                </div>
                            </div>
                            <div style={{flex:1,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',textAlign:'center',fontWeight:'bolder'}}>
                                <div onClick={() => setAboutUsDetailed(true)} style={{padding:20,cursor:'pointer',color:'white',border:'2px solid white',borderRadius:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
                                    מי אנחנו
                                </div>
                                <div style={{flex:.2}}/>
                                <div onClick={
                                    () => {
                                        scrollToBottom(rootRef)
                                    }
                                } style={{padding:20,cursor:'pointer',color:'white',border:'2px solid white',borderRadius:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center'}}>
                                    צור קשר
                                </div>
                            </div>
                        </div>
                        <div style={{width:210}}/>
                    </div>
                    <div style={{width:'100%',height:'calc(100% * 1/4)'}}>
                        
                    </div>
                </div>
                <div style={{position:'absolute',left:'50px',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(112,146,191)',borderRadius:100,width:160,height:160}}>
                    <div style={{
                        width:'80%',
                        height:'80%',
                        borderRadius:100,
                        backgroundColor:'white',
                        backgroundImage:`url(${TLT_LOGO})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize:'80%' 
                    }}>
                    </div>
                </div>
            </div>
            <div 
                style={{
                    width:385,
                    height:200,
                    borderRadius:100,
                    backgroundImage:`url(${TLT_DETAILED_Trans})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize:'80%' 
                }}>
            </div>
            <div style={{maxWidth:'80%',padding:20,whiteSpace:'break-spaces',fontSize:24,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                <cite style={{padding:'0px 20px 20px 20px'}}>
                    {
                        aboutUsText
                    }
                </cite>
                <div style={{backgroundColor:'grey',color:'white',textDecoration:'underline',borderRadius:aboutUsDetailed ? 0: 100}}>
                    <p onClick={() => setAboutUsDetailed(aboutUs => !aboutUs)} style={{textAlign:'center',padding:20,cursor:'pointer'}}>{
                        aboutUsDetailed ? `הסתר`:`קרא עוד...`
                    }</p>
                    {
                        aboutUsDetailed ?
                        <cite>
                            <ol>
                            {
                                aboutUsDetailedText.map(i => <li>{i}</li>)
                            }
                            </ol>
                        </cite>
                        :
                        null
                    }
                </div>
            </div>
            <FiltersBar/>
            <PropertyList/>
            <Grid container direction='column' 
                style={{maxWidth:600,alignItems:'center',textAlign:'center',backgroundColor: 'lightsteelblue', marginTop: 20,border: '2px solid black'}}>
                <Grid item xs={12}>
                    צור קשר
                </Grid>
                <Grid container>
                    <Grid item xs={6} style={{height:50}}>
                        <Grid item xs={12} style={{margin:'auto'}}>
                            <input placeholder="שם"/>
                        </Grid>
                        <Grid item xs={12} style={{margin:'auto'}}>
                            <input placeholder="נייד"/>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <textarea style={{margin:'auto',padding:0,height:48,textAlign:'center'}} placeholder='טקסט חופשי'/>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid item xs={12}>
                            <p>*6345</p>
                        </Grid>
                        <Grid item xs={12}>
                            <p>TLTHaifa@Gmail.com</p>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} style={{margin:'auto'}}>
                        <p>שלח</p>
                    </Grid>
                </Grid>
                
            </Grid>
            <PropertyModal/>
            <LeadModal/>
            <SideFilters/>
        </Layout>

    )
}

export default Root