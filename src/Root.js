import React, { useEffect, useRef, useState } from 'react'
import Layout from './components/Layout'
import {useGlobalState,getGlobalState,setGlobalState} from './globalState'
import { getProperties } from './dataHandler'
import TopBar from './components/TopBar';
import { PropertyList } from './components/PropertyList/PropertyList';
import { PropertyModal } from './components/PropertyModal/PropertyModal';
import { devices } from './components/Utilities'
import { AllMediaModal } from './components/MediaModals/AllMediaModal';
import { SingleMediaModal } from './components/MediaModals/SingleMediaModal';
import { LeadModal } from './components/LeadModal';
import { SideFilters } from './components/SideFilters';
import TLT_LOGO from './Logo_TLT.png'
import TLT_DETAILED_Trans from './Logo_DETAILED_Trans.png'

import WindowedSelect from "react-windowed-select";
import { TextField, Button, Grid } from '@material-ui/core';
import { aboutUsText, aboutUsDetailedText } from './components/aboutUsText';

const customSelectStyles = {
    option: (provided, state) => { return({
      ...provided,
      direction:'rtl',
      borderBottom: '1px dotted pink',
      color: state.isSelected ? 'red' : 'blue',
      padding: 10,
      fontSize: state.value?.includes(',') ? 14:18,
      fontWeight: state.value?.includes(',') ? null:'bolder'
    })},
    control: (provided, state) => ({
        ...provided,
        // none of react-select's styles are passed to <Control />
        borderRadius: 0,
        borderBottom:'2px solid rgb(112,146,191)',
        borderTop:0,
        borderLeft:0,
        borderRight:0,
        color:'black',
        fontFamily:'Assistant',
        fontWeight:'bold'
    }),
    indicatorSeparator: () => ({
        display:'none'
    }),
    dropdownIndicator:  (provided, state)  => ({
        ...provided,
        color:'rgb(112,146,191)',
    }),
    placeholder: (provided, state) => ({
        ...provided,
        color:'black',
    }),
    menu: (provided, state) => ({
        ...provided,
        zIndex:2
    }),
}

const scrollToBottom = element => element?.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });

const Root = props => {

    const setIsLoading = (val) => setGlobalState('loading',val)
    const setProperties = (val) => setGlobalState('properties',val)
    const setAddresses = (val) => setGlobalState('addresses',val)
    const setAddressesMap = (val) => setGlobalState('addressesMap',val)
    const setDevice = (val) => setGlobalState('device',val)
    const setProperty = (val) => setGlobalState('selectedProperty',val)
    const [rootRef] = useGlobalState('rootRef')
    const [aboutUsDetailed,setAboutUsDetailed] = useState(false)
    const fetchProperties = async () => {

        setIsLoading(true)
        const data = await getProperties()
        const _properites = data.payload
    
        
        let addressesMap = {}
        
        for (let i=0; i<_properites.length;i++){
            let {attributes} = _properites[i]
            if (!attributes)
                console.log(_properites[i])
            if (!addressesMap[attributes.neighborhood_name])
                addressesMap[attributes.neighborhood_name] = []
            if (!addressesMap[attributes.neighborhood_name].includes(attributes.street_name))
                addressesMap[attributes.neighborhood_name].push(attributes.street_name)
        }
    
        let addresses = []
        let neighborhoods = Object.keys(addressesMap)
        for (let i=0; i<neighborhoods.length;i++){
            addresses.push(neighborhoods[i])
            for (let j=0;j<addressesMap[neighborhoods[i]].length;j++){
                addresses.push(`${neighborhoods[i]}, ${addressesMap[neighborhoods[i]][j]}`)
            }
        }
    
        setAddressesMap(addressesMap)
        setAddresses(addresses)
        let favouritesString = localStorage.getItem('favourites')
        let favourites = JSON.parse(favouritesString) || []
        setProperties({data:_properites,dataFiltered:_properites,currentCount:_properites.length,totalCount:data.metadata.total,favourites})
        setIsLoading(false)
    
    }

    useEffect(() => {
        fetchProperties()

        window.addEventListener("resize",() => resize());
        if (window.location.pathname.includes('/') && window.location.pathname.length > 1 && Number.isInteger(parseInt(window.location.pathname.split('/')[1]))){
            console.log(window.location.pathname.split('/')[1])
            setProperty(window.location.pathname.split('/')[1])
        }

        resize()
    },[])

    const resize = () => {

        if (window.innerWidth < 600)
            setDevice(devices.Mobile)
        else if (window.innerWidth < 1280)
            setDevice(devices.Tablet)
        else
            setDevice(devices.Desktop)
    }


    console.log('root rendered')
    return (

        <Layout>
            <div style={{width:'100%',height:160,display:'flex',paddingTop:20}}>
            
                <div style={{width:'100%',height:160}}>
                    <div style={{width:'100%',height:'calc(100% * 1/4)'}}>

                    </div>
                    <div style={{flex:1,display:'flex',flexDirection:'row',width:'100%',height:'calc(100% * 1/2)',backgroundColor:'rgb(112,146,191)'}}>
                        {/* <div style={{width:'190px'}}>
                            <WindowedSelect
                                styles={customSelectStyles}
                                isClearable={true}
                                isRtl={true}
                                isMulti={false}
                                placeholder="הקש כתובת/ מספר נכס"
                            />
                        </div> */}
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
            <TopBar/>
            <PropertyList/>
   {/*          <div style={{fontWeight:'bolder',height:'50px',display:'flex',flexDirection:'column',flex:1,width:'100%',position:'fixed',textAlign:'center',bottom:0,zIndex:1,backgroundColor:'lightgray',justifyContent:'center',alignItems:'center'}}>
                <p>TLT - תיווך ללא תיווך נכסים והשקעות בע"מ - כל הזכויות שמורות</p>
            </div> */}
            <Grid container direction='column' 
                style={{maxWidth:600,alignItems:'center',textAlign:'center',backgroundColor: 'lightsteelblue', marginTop: 20,border: '2px solid black'}}>
                <Grid item xs={12}>
                    צור קשר
                </Grid>
                <Grid container>
                    <Grid item xs={6} style={{height:50}}>
                        <Grid item xs={12} style={{margin:'auto'}}>
                            <input placeholder="שם"></input>
                        </Grid>
                        <Grid item xs={12} style={{margin:'auto'}}>
                            <input placeholder="נייד"></input>
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
            <AllMediaModal/>
            <SingleMediaModal/>
            <LeadModal/>
            <SideFilters/>
        </Layout>

    )
}

export default Root