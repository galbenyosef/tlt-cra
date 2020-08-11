import React from 'react'
import { Modal, Input, InputAdornment, Button,TextField } from '@material-ui/core'
import { useGlobalState, setGlobalState } from '../../globalState'
import { createLead } from '../../apiHandler'
import { IoMdPhonePortrait } from 'react-icons/io'
import DatePicker from "react-datetime-picker"
import moment from 'moment'
import {createLeadKala} from "../../dataHandler";

export const LeadModal = () => {

  const [leadModalData,setLeadModalData] = useGlobalState('lead')



  const {
    opened,
    user_id,
    subject,
    full_name,
    phone,
    email,
    comments,
    attributes:{
      actual_when,
      kala_property_id,
    }
  } = leadModalData

  if (!opened)
    return null

  const setLoading = val => setGlobalState('loading',val)
  const setModalProp = (prop,value) => setLeadModalData(data => ({...data,[prop]:value}))

  return (
    <Modal open={opened} style={{direction:'rtl',maxHeight:'calc(100vh)'}} onBackdropClick={() => setLeadModalData(data => ({...data,opened:false}))}>
      <div style={{
        right: '50%',
        maxWidth: '90%',
        top: '50%',
        transform: 'translate(50%, -50%)',
        position: 'absolute',
        display:'flex',
      }} >
        <div style={{backgroundColor:'white'}}>
          <div style={{padding:30}}>
            <form style={{display:'flex',flexDirection:'column'}}>
              <label htmlFor='nameInput'>
                שם מלא (חובה)
              </label>
              <input style={{border:'0.5px solid black'}} id='nameInput' type='text' value={full_name} onChange={e => setModalProp('full_name',e.currentTarget.value)}/>
              <label htmlFor='phoneInput'>
                טלפון (חובה)
              </label>
              <input style={{border:'0.5px solid black'}} id='phoneInput' type='text' value={full_name} onChange={e => setModalProp('full_name',e.currentTarget.value)}/>
              <label htmlFor='mailInput'>
                מייל (חובה)
              </label>
              <input style={{border:'0.5px solid black'}} id='mailInput' type='text' value={full_name} onChange={e => setModalProp('email',e.currentTarget.value)}/>
              <p>בחר תאריך ושעה</p>
              <DatePicker
                value={actual_when}
                className={'datetimepicker'}
                onChange={actually_when => setModalProp('attributes.actual_when',actually_when)}
                format={"dd/MM/yyyy HH:mm"}
                locale={"he-IL"}
                minDate={new Date()}
              />
              <Button style={{border:'1px solid blue'}} color='primary' onClick={() => {
                if (full_name && full_name.length > 2 && phone.replace('-','').length === 10)
                  createLeadKala(leadModalData)
                else{
                  alert('התגלתה שגיאה באחד מן השדות')
                }
              }}>שלח</Button>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
}