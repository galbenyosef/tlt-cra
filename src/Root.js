import React, { useEffect } from 'react'
import Layout from './components/Layout'
import {useGlobalState,getGlobalState,setGlobalState} from './globalState'
import { getProperties } from './dataHandler'
import TopBar from './components/TopBar';
import { PropertyList } from './components/PropertyList';


const Root = props => {
    const [isDesktop, setIsDesktop] = useGlobalState('isDesktop');

    const setIsLoading = (val) => setGlobalState('loading',val)
    const setProperties = (val) => setGlobalState('properties',val)
    const setAddresses = (val) => setGlobalState('addresses',val)
    const setAddressesMap = (val) => setGlobalState('addressesMap',val)

    const fetchProperties = async (options={}) => {

        setIsLoading(true)
/*         scrollToTop()
 */        const data = await getProperties(options)
        const _properites = data.payload
    
    
        let addressesMap = {}
        
        for (let i=0; i<_properites.length;i++){
            let {attributes} = _properites[i]
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
        setProperties({data:_properites,currentCount:_properites.length,totalCount:data.metadata.total})
        setIsLoading(false)
    
    }

    useEffect(() => {
        fetchProperties()
    },[])


    console.log('root rendered')
    return (

        <Layout>
            <TopBar/>
       {/*      <div style={{fontWeight:'bolder',}}>
                {
                    `מציג ${currentListCount} מתוך ${totalListCount} נכסים בסה"כ`
                }
            </div> */}
            <PropertyList/>
            <div style={{fontWeight:'bolder',height:'50px',display:'flex',flexDirection:'column',flex:1,width:'100%',position:'absolute',bottom:0,zIndex:1,backgroundColor:'lightgray',justifyContent:'center',alignItems:'center'}}>
                <p>TLT - תיווך ללא תיווך נכסים והשקעות בע"מ - כל הזכויות שמורות</p>
            </div>
        </Layout>


    )
}

export default Root