import React, { useEffect } from 'react'
import Layout from './components/Layout'
import {useGlobalState,getGlobalState,setGlobalState} from './globalState'
import { getProperties } from './dataHandler'
import TopBar from './components/TopBar';
import { PropertyList } from './components/PropertyList';
import { PropertyModal } from './components/PropertyModal';
import { devices } from './components/Utilities'
import { AllMediaModal } from './components/MediaModals/AllMediaModal';
import { SingleMediaModal } from './components/MediaModals/SingleMediaModal';
import { LeadModal } from './components/LeadModal';
import { SideFilters } from './components/SideFilters';


const Root = props => {

    const setIsLoading = (val) => setGlobalState('loading',val)
    const setProperties = (val) => setGlobalState('properties',val)
    const setAddresses = (val) => setGlobalState('addresses',val)
    const setAddressesMap = (val) => setGlobalState('addressesMap',val)
    const setDevice = (val) => setGlobalState('device',val)
    const setProperty = (val) => setGlobalState('selectedProperty',val)

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
        setProperties({data:_properites,dataFiltered:_properites,currentCount:_properites.length,totalCount:data.metadata.total})
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

        if (window.innerWidth < 960)
            setDevice(devices.Mobile)
        else
            setDevice(devices.Desktop)
    }


    console.log('root rendered')
    return (

        <Layout>
            <TopBar/>
            <PropertyList/>
            <div style={{fontWeight:'bolder',height:'50px',display:'flex',flexDirection:'column',flex:1,width:'100%',position:'fixed',textAlign:'center',bottom:0,zIndex:1,backgroundColor:'lightgray',justifyContent:'center',alignItems:'center'}}>
                <p>TLT - תיווך ללא תיווך נכסים והשקעות בע"מ - כל הזכויות שמורות</p>
            </div>
            <PropertyModal/>
            <AllMediaModal/>
            <SingleMediaModal/>
            <LeadModal/>
            <SideFilters/>
        </Layout>

    )
}

export default Root