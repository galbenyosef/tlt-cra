import React, { useEffect, useState } from 'react'
import { Modal,Grid, TextField, makeStyles, Input, InputAdornment } from '@material-ui/core'
import { getGlobalState, useGlobalState, setGlobalState } from '../../globalState'
import { isMobile } from 'react-device-detect'
import { devices, getValueByDevice } from '../Utilities'

export const AllMediaModal = () => {

    const [opened,setOpened] = useGlobalState('allMediaModal')

    const setSingleModal = val => setGlobalState('singleMediaModal',val)
    const [device] = useGlobalState('device')

    console.log(opened)
    if (!opened)
        return null
    return (
        <Modal open={!!opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setOpened(false)}>
            <Grid container spacing={getValueByDevice(3,1,1)} style={{
                right: '50%',
                maxWidth: '90%',
                top: '50%',
                transform: 'translate(50%, -50%)',
                position: 'absolute',
                margin:'auto',
                backgroundColor:'white',
                maxHeight:'100vh',
                overflow:'auto',
            }}>
                {
                    opened.map(media => 
                        <Grid item xs={getValueByDevice(4,6,6)} spacing={3} style={{
                            display:'flex',
                            justifyContent:'center',
                            alignItems:'top',
                            maxHeight:'30vh'
                        }}>
                            <img style={{width:'100%'}} onClick={
                                () => setSingleModal(media)
                            } src={`https://tlt.kala-crm.co.il/${media}`} />
                        </Grid>
                    )
                }
            </Grid>
        </Modal>
    )
}