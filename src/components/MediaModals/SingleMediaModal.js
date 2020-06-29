import React, { useEffect, useState } from 'react'
import { Modal,Grid, TextField, makeStyles, Input, InputAdornment } from '@material-ui/core'
import { getGlobalState, useGlobalState, setGlobalState } from '../../globalState'
import { isMobile } from 'react-device-detect'
import { getValueByDevice } from '../Utilities'

export const SingleMediaModal = () => {

    const [opened,setOpened] = useGlobalState('singleMediaModal')

    if (!opened)
        return null
    console.log(opened)
    return (
        <Modal open={!!opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setOpened(false)}>
            <div style={{
               right: '50%',
               maxWidth: '90%',
               top: '50%',
               transform: 'translate(50%, -50%)',
               position: 'absolute',
               display:'flex',
               maxHeight:'90vh',
               width:getValueByDevice('auto','100%') 
            }} >
                {
                    opened && opened.includes('.mp4') ?
                    <video style={{width:'100%'}} autoPlay controls>
                        <source src={`https://tlt.kala-crm.co.il/${opened}`} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>:
                    <img style={{maxWidth:'90vw',minHeight:'75vh',maxHeight:'100vh'}} src={`https://tlt.kala-crm.co.il/${opened}`} />

                }

            </div>
        </Modal>
    )
}