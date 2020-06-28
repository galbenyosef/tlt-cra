import React, { useEffect, useState } from 'react'
import { Modal,Grid, TextField, makeStyles, Input, InputAdornment } from '@material-ui/core'
import { getGlobalState, useGlobalState, setGlobalState } from '../../globalState'
import { isMobile } from 'react-device-detect'

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
               height:'90vh',
            }} >
                {
                    opened && opened.includes('.mp4') ?
                    <video style={{height:'100%',margin:'auto'}} autoPlay controls>
                        <source src={`https://tlt.kala-crm.co.il/${opened}`} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>:
                    <img style={{margin:'auto',height:'100%',maxWidth:'90vw'}} src={`https://tlt.kala-crm.co.il/${opened}`} />

                }

            </div>
        </Modal>
    )
}