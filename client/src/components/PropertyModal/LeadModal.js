import React from 'react'
import { Modal,Grid, Input, InputAdornment, Button,TextField } from '@material-ui/core'
import { useGlobalState, setGlobalState } from '../../globalState'
import { LeadTypes, getValueByDevice } from '../Utilities'
import { createLead } from '../../dataHandler'
import { IoMdPhonePortrait } from 'react-icons/io'
import DatePicker from "react-datetime-picker"
import moment from 'moment'

export const LeadModal = () => {

    const [opened,setOpened] = useGlobalState('newLeadModal')

    const {
        type,
        actually_when,
        comments
    } = opened

    if (!type)
        return null

    const setLoading = val => setGlobalState('loading',val)

    const createLeadKala = async (data) => {
        setLoading(true)
    
        try {
        
            let body = {
                ...data,
                attributes:{
                    ...data.attributes,
                    comments,
                    actual_when:moment(actually_when).format("DD-MM-YYYY HH:mm")
                },
                status_id:type === LeadTypes.MeetingRequest ? 3077:3124
            }

            if (await createLead(body))
                setOpened(false)

        }
        catch(e){
            console.log(e)
        }
        setLoading(false)
    }

    return (
        <Modal open={!!opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setOpened(false)}>
            <div style={{
               right: '50%',
               maxWidth: '90%',
               top: '50%',
               transform: 'translate(50%, -50%)',
               position: 'absolute',
               display:'flex',
            }} >
                <div style={{backgroundColor:'white'}}>
                    <Grid container spacing={getValueByDevice(3,2,0)} style={{padding:30}}>
                        <Grid item xs={12} md={6} style={{paddingBottom:15,display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <Input
                                placeholder="שם מלא"
                                margin="dense"
                                variant="outlined"
                                value={opened?.full_name || ''}
                                onChange={
                                    e => setOpened({...opened,full_name:e.currentTarget.value})
                                }
                            />
                        </Grid>
                        <Grid item xs={12} md={6} style={{paddingBottom:15,display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <Input
                                endAdornment={
                                    <InputAdornment position={'start'}>
                                        <IoMdPhonePortrait/>
                                    </InputAdornment>
                                }
                                placeholder="נייד"
                                margin="dense"
                                variant="outlined"
                                value={opened?.phone || ''}
                                onChange={
                                    e => setOpened({...opened,phone:e.currentTarget.value})
                                }
                            />
                        </Grid>
                        {
                            type === LeadTypes.MeetingRequest &&
                            <Grid item xs={12} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingBottom:15}}>
                                <p>בחר תאריך ושעה</p>
                                <DatePicker
                                    value={actually_when}
                                    className={'datetimepicker'}
                                    onChange={actually_when => {setOpened({...opened,actually_when})}}
                                    format={"dd/MM/yyyy HH:mm"}
                                    locale={"he-IL"}
                                    minDate={new Date()}
                                />
                            </Grid>
                        }
                        <Grid item xs={12} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',paddingBottom:15}}>
                            <p>הערות נוספות</p>
                            <TextField multiline onChange={e => setOpened({...opened,comments:e.currentTarget.value})} value={opened.comments}/>
                        </Grid>
                        <Grid item xs={12} style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                            <Button style={{border:'1px solid blue'}} color='primary' onClick={() => {
                                const {full_name,phone,actually_when} = opened
                                if (full_name && full_name.length > 2 && phone.replace('-','').length === 10 && ((actually_when && type === LeadTypes.MeetingRequest) || type !== LeadTypes.MeetingRequest))
                                    createLeadKala(opened)
                                else{
                                    alert('התגלתה שגיאה באחד מן השדות')
                                }
                            }}>שלח</Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </Modal>
    )
}