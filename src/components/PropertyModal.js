import React, { useEffect, useState } from 'react'
import { Modal,Grid } from '@material-ui/core'
import { KeyboardArrowLeft,KeyboardArrowRight, PlayCircleOutlineOutlined } from '@material-ui/icons'
import { getGlobalState, useGlobalState, setGlobalState } from '../globalState'
import { getProperty } from '../dataHandler'
import { PropertyModalLoading } from './PropertyModalLoading'
import { renovationTypes } from './Utilities'
import { LazyLoadImage } from 'react-lazy-load-image-component'


const Tabs = {
    Info:1,
    Plan:2,
    Location:3,
}

const InfoView = ({property}) => {



    return (
        <Grid container xs={12}>

        </Grid>
    )
}

export const PropertyModal = () => {

    const [selectedProperty,setSelectedProperty] = useGlobalState('selectedProperty')
    const [tabSelected,setTabSelected] = React.useState(Tabs.Info)
    const [data,setData] = useState(null)
    const [loading,setLoading] = useState(true)
    const [currentImageIndex,setCurrentImageIndex] = useState(0)
    
    const fetchProperty = async (id) => {

        setLoading(true)

        try{
            const data = await getProperty(id)
            console.log('setting data')

            setData(data)

        }
        catch(e){

        }
        console.log('loading false')

        setLoading(false)
    }

    useEffect(() => {

        if (selectedProperty)
            fetchProperty(selectedProperty)
            
    },[selectedProperty])

    //if not pressed on property
    if (!selectedProperty)
        return null

    if (loading)
        return <PropertyModalLoading/>

    
    console.log(selectedProperty,loading)


    let property = data.payload.attributes
    let propertyImages = data.payload.page_assets_urls

    const {
        street_name,
        neighborhood_name,
        city_id,
        propertytype,
        renovation,
        price,
        rooms,
        metres,
        terrace,
        floor,
        elevator,
        custom_id,
        airdirections,
        bathroomamount,
        toiletamount,
        committee,
        tax,
        requirements,
        video__url,
    } = property


    return (
        <Modal open={!!selectedProperty} style={{direction:'rtl'}} onBackdropClick={() => setSelectedProperty(null)}>
            <Grid container style={{padding:20}} direction='column'>
                {/* back button */}
                <Grid xs={12} item style={{backgroundColor:'white'}}>
                    <p>חזור</p>
                </Grid>
                {/* main view */}
                <Grid item xs={12} style={{backgroundColor:'white'}}>
                    <Grid container direction='row'>
                        {/* right */}
                        <Grid item xs={4}>
                            <Grid container direction='row'>
                                <Grid item xs={8}>
                                    <p>{street_name}</p>
                                    <p>{neighborhood_name + ', ' +city_id}</p>
                                    <p>{propertytype + ' ' + renovationTypes[renovation]}</p>
                                </Grid>
                                <Grid item xs={4}>
                                    <p style={{textAlign:'end'}}>{price}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={4}>{`${rooms} חדרים`}</Grid>
                                        <Grid item xs={4}>{`${metres} מ"ר ${terrace?`+ מרפסת`:``}`}</Grid>
                                        <Grid item xs={4}>{`${floor ? `קומה ${floor} (${elevator ? `עם עלית`:`ללא מעלית`})`:`קומת קרקע`}`}</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container direction='row'>
                                <Grid item xs={6}>
                                    <p>ליצירת קשר</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p style={{textAlign:'end'}}>{`נכס מספר ${custom_id}`}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={4}>avatar</Grid>
                                        <Grid item xs={8}>
                                            <Grid container>
                                                <Grid item xs={12}>אביאל</Grid>
                                                <Grid item xs={12}>050-577-5555</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={6}>שם</Grid>
                                        <Grid item xs={6}>נייד</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={6}>קבע פגישה</Grid>
                                        <Grid item xs={6}>רוצה לשמוע עוד</Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* left */}
                        <Grid item xs={8}>
                            <Grid container>
                                <Grid item  xs={12}>
                                    <Grid container>
                                        <Grid item md={9} xs={12} style={{
                                            backgroundImage:`url(https://tlt.kala-crm.co.il/${propertyImages[currentImageIndex]})`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize:'cover',
                                            position:'relative',
                                            maxHeight:'360px',
                                            minHeight:'220px'
                                        }}>
                                        <div style={{display:'flex',position:'absolute',top:'calc(50% - 35px)',direction:'ltr',left:0}}>
                                            <KeyboardArrowLeft style={{margin:'20px 20px',border:'1px solid white',borderRadius:'100vh',color:'white'}} />
                                        </div>

                                        <div style={{display:'flex',position:'absolute',top:'calc(50% - 35px)',direction:'ltr',right:0}}>
                                            <KeyboardArrowRight style={{margin:'20px 20px',border:'1px solid white',borderRadius:'100vh',color:'white'}} />
                                        </div> 
                                        </Grid>
                                        <Grid item md={3} xs={12}>
                                            <Grid container style={{height:'100%'}}>
                                                <Grid item xs={6} md={12} style={{
                                                    height:'50%',
                                                    position:'relative',
                                                    backgroundImage:`url(https://tlt.kala-crm.co.il/${propertyImages[currentImageIndex+1]})`,
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize:'cover',
                                                    position:'relative',
                                                    maxHeight:'360px',
                                                    minHeight:'220px'
                                                }}>
                                                    <p style={{
                                                        position: 'absolute',
                                                        top: '45%',
                                                        right: 0,
                                                        left: 0,
                                                        textAlign: 'center',
                                                        fontWeight:'bolder',
                                                        fontSize:20,
                                                        color:'white',
                                                        WebkitTextStrokeWidth: '2px',
                                                        WebkitTextStrokeColor: 'black'
                                                    }}>{`לכל ${propertyImages.length} התמונות`}</p>
                                                </Grid>
                                                <Grid item xs={6} md={12} style={{
                                                    height:'50%',
                                                    position:'relative',
                                                    backgroundImage:`url(https://tlt.kala-crm.co.il/${propertyImages[currentImageIndex+1]})`,
                                                    backgroundPosition: 'center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize:'cover',
                                                    position:'relative',
                                                    maxHeight:'360px',
                                                    minHeight:'220px'
                                                }}>
                                                    <div style={{
                                                            position: 'absolute',
                                                            top: '40%',
                                                            right: 0,
                                                            left: 0,
                                                            textAlign: 'center',
                                                            fontWeight:'bolder',
                                                            fontSize:20,
                                                            color:'white',
                                                            WebkitTextStrokeWidth: '2px',
                                                            WebkitTextStrokeColor: 'black',
                                                            cursor:'pointer'
                                                        }}>
                                                        <PlayCircleOutlineOutlined size={40}/>
                                                        <p>{`סיור בנכס`}</p>
                                                    </div>
                                                    <p>{`לכל ${propertyImages.length} התמונות`}</p>
                                                </Grid>
                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={9} style={{backgroundColor:'lightgrey'}}>
                                    <Grid container>
                                        <Grid item xs={4} onClick={() => setTabSelected(Tabs.Info)}>
                                            <p style={{textAlign:'center',cursor:'pointer',border:'1px solid black'}}>פרטי הנכס</p>  
                                        </Grid>
                                        <Grid item xs={4} onClick={() => setTabSelected(Tabs.Plan)}>
                                            <p style={{textAlign:'center',cursor:'pointer',border:'1px solid black'}}>תכנית הנכס</p>
                                        </Grid>
                                        <Grid item xs={4} onClick={() => setTabSelected(Tabs.Location)}>
                                            <p style={{textAlign:'center',cursor:'pointer',border:'1px solid black'}}>מיקום הנכס</p> 
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Tab */}
                                <Grid item xs={12}>
                                    {
                                        tabSelected == Tabs.Info ?
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <p>{`${propertytype} ${renovationTypes[renovation]} בשכונת ${neighborhood_name}, רחוב ${street_name}`}</p>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Grid container>
                                                            <Grid item xs={6}>
                                                                <p>{`${rooms} חדרים`}</p>  
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{`${metres} מ"ר ${terrace?`+ מרפסת`:``}`}</p>    
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <p>{`${floor ? `קומה ${floor} (${elevator ? `עם עלית`:`ללא מעלית`})`:`קומת קרקע`}`}</p>    
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <p>{`${airdirections} כיווני אוויר`}</p>    
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{`${bathroomamount} חדרי רחצה`}</p>    
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{`${toiletamount} שירותים`}</p>   
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Grid container>
                                                            <Grid item xs={6}>
                                                                <p>ועד בית</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{committee}</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>ארנונה דו חודשית</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{tax}</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>שכר דירה</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{price}</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>דרישות בחוזה</p>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <p>{requirements}</p>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                
                                            </Grid>

                                        </Grid>
                                        :
                                        null
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Modal>
    )
}